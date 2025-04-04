#!/bin/bash

cd /Users/krishanu8219/Downloads/EthBucharest-01-ec6631b6330e44286401779b3715f7b07046c355/arbi-proof-new

# Install the nightly toolchain if not installed
echo "Ensuring nightly-2024-04-01 is installed..."
rustup install nightly-2024-04-01
rustup target add wasm32-unknown-unknown --toolchain nightly-2024-04-01
rustup target add wasm32-wasi --toolchain nightly-2024-04-01

# Create rust-toolchain.toml with updated nightly version that supports rustc 1.81+
echo "Creating rust-toolchain.toml file with updated nightly version..."
cat > rust-toolchain.toml << EOF
[toolchain]
channel = "nightly-2024-04-01"  # Updated to a much newer nightly
components = ["rustfmt", "clippy", "rust-src"]
targets = ["wasm32-unknown-unknown", "wasm32-wasi"]
EOF

# Create a working lib.rs file with correct syntax
echo "Creating a simplified lib.rs with correct syntax for stylus-sdk 0.4.3..."
cat > src/lib.rs << 'EOF'
#![no_std]
extern crate alloc;

#[stylus_sdk::contract]
mod arbi_proof {
    use alloc::{string::String, vec::Vec};
    use stylus_sdk::{
        alloy_primitives::{Address, FixedBytes, U256},
        prelude::*,
        msg, block, evm,
    };
    use sha3::{Digest, Keccak256};
    use hex_literal::hex;

    // Simple event topics using constants
    const TOPIC_DISPUTE_INITIATED: [u8; 32] = hex!("c0ffc525a1c7ed42f5800d3456826e1ab57528228b4b78a5f4395f12acad581c");
    const TOPIC_BISECTION_CHALLENGE: [u8; 32] = hex!("8ce8baccddca58f45e59c77062be74f8e3a1c8e309282ad8bb436f6d9e25008f");
    const TOPIC_DISPUTE_RESOLVED: [u8; 32] = hex!("4c514279ce03d81bf6b1f1eb88b43c634d1d7e6ed95835c967e33b44c8ec8785");

    // Status codes
    const STATUS_PENDING: u8 = 0;
    const STATUS_IN_PROGRESS: u8 = 1;
    const STATUS_RESOLVED: u8 = 2;

    // Main contract storage structure using new Storage derive
    #[derive(Storage)]
    pub struct ArbiProofSimulator {
        // Dispute storage fields
        dispute_challenger: Mapping<FixedBytes<32>, Address>,
        dispute_defender: Mapping<FixedBytes<32>, Address>,
        dispute_status: Mapping<FixedBytes<32>, u8>,
        dispute_current_round: Mapping<FixedBytes<32>, u8>,
        dispute_total_rounds: Mapping<FixedBytes<32>, u8>,
        dispute_timestamp: Mapping<FixedBytes<32>, U256>,
        dispute_tx_hash: Mapping<FixedBytes<32>, FixedBytes<32>>,
    }

    #[external]
    impl ArbiProofSimulator {
        pub fn constructor(self) -> Result<(), Vec<u8>> {
            // No initialization needed
            Ok(())
        }

        #[payable]
        pub fn initiate_dispute(
            &mut self,
            tx_hash: FixedBytes<32>,
            defender: Address,
        ) -> Result<FixedBytes<32>, Vec<u8>> {
            let caller = msg::sender();
            let value = msg::value();

            // Require minimum stake of 0.1 ETH
            if value < U256::from(100000000000000000u64) {
                return Err("Insufficient stake".into());
            }

            // Generate dispute ID using keccak256
            let mut hasher = Keccak256::new();
            hasher.update(tx_hash.as_slice());
            hasher.update(caller.as_slice());
            hasher.update(&U256::from(block::timestamp()).to_be_bytes::<32>());
            let dispute_id = FixedBytes::<32>::from_slice(&hasher.finalize());

            // Store dispute data
            self.dispute_challenger.insert(dispute_id, caller);
            self.dispute_defender.insert(dispute_id, defender);
            self.dispute_status.insert(dispute_id, STATUS_IN_PROGRESS);
            self.dispute_current_round.insert(dispute_id, 0);
            self.dispute_total_rounds.insert(dispute_id, 5);
            self.dispute_timestamp.insert(dispute_id, U256::from(block::timestamp()));
            self.dispute_tx_hash.insert(dispute_id, tx_hash);

            // Emit DisputeInitiated event
            let topic0 = FixedBytes::<32>::from_slice(&TOPIC_DISPUTE_INITIATED);
            
            // Pad addresses to 32 bytes
            let mut t2_bytes = [0u8; 32];
            t2_bytes[12..].copy_from_slice(caller.as_slice());
            let t2 = FixedBytes::from_slice(&t2_bytes);
            
            let mut t3_bytes = [0u8; 32];
            t3_bytes[12..].copy_from_slice(defender.as_slice());
            let t3 = FixedBytes::from_slice(&t3_bytes);
            
            // Log event
            evm::raw_log(&[topic0, dispute_id, t2, t3], &[]);

            Ok(dispute_id)
        }

        pub fn dispute_exists(&self, dispute_id: FixedBytes<32>) -> bool {
            self.dispute_challenger.get(dispute_id) != Address::ZERO
        }
    }
}
EOF

# Remove any existing lock file to allow it to be regenerated
echo "Removing existing Cargo.lock to allow regeneration..."
rm -f Cargo.lock

# Update Cargo.toml to ensure it has the right dependencies
echo "Updating Cargo.toml with latest stylus-sdk version..."
cat > Cargo.toml << EOF
[package]
name = "arbi-proof-new"
version = "0.1.0"
edition = "2021"

[dependencies]
stylus-sdk = "0.8.3"  # Updated to latest version
sha3 = "0.10.8"
hex-literal = "0.4.1"
alloc-stdlib = "0.2.2"

[lib]
crate-type = ["cdylib"]

[profile.release]
codegen-units = 1
strip = true
lto = true
panic = "abort"
opt-level = "z"
EOF

# Build using the correct nightly version
echo "Building contract with cargo..."
cargo +nightly-2024-04-01 build --release --target wasm32-unknown-unknown

# Check with stylus
echo "Checking contract with stylus..."
cargo stylus check

# Deploy the contract
echo "Deploying contract to Arbitrum Sepolia..."
if [ -f "../private_key.txt" ]; then
  PRIVATE_KEY=$(cat ../private_key.txt)
  echo "Using private key from private_key.txt"
  
  echo "Starting deployment with --no-verify flag..."
  cargo stylus deploy --private-key $PRIVATE_KEY --no-verify --endpoint https://sepolia-rollup.arbitrum.io/rpc
  
  # Store deployment result
  DEPLOY_RESULT=$?
  if [ $DEPLOY_RESULT -eq 0 ]; then
    echo "Deployment successful! Check console output above for your contract address."
    echo "Enter your contract address to save it (copy from above):"
    read CONTRACT_ADDRESS
    if [ ! -z "$CONTRACT_ADDRESS" ]; then
      echo $CONTRACT_ADDRESS > ../contract_address.txt
      echo "Contract address saved to contract_address.txt"
    fi
  else
    echo "Deployment failed. See errors above."
  fi
else
  echo "ERROR: private_key.txt not found in the parent directory."
  exit 1
fi

echo -e "\n=== NEXT STEPS ==="
echo "1. Verify your contract on Arbitrum Sepolia Explorer: https://sepolia.arbiscan.io/"
echo "2. Update the contract address in your frontend code"
echo "3. To interact with your contract, use the frontend or ethers.js"
