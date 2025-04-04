#!/bin/bash

# Using the very latest nightly which should have rustc 1.81+
NIGHTLY_VERSION="nightly"

echo "Cleaning up any previous Cargo.lock..."
rm -f /Users/krishanu8219/Downloads/EthBucharest-01-ec6631b6330e44286401779b3715f7b07046c355/arbi-proof-new/Cargo.lock

echo "Installing Rust toolchain $NIGHTLY_VERSION..."
rustup install $NIGHTLY_VERSION
rustup default $NIGHTLY_VERSION

echo "Adding WebAssembly targets..."
rustup target add wasm32-unknown-unknown --toolchain $NIGHTLY_VERSION
rustup target add wasm32-wasi --toolchain $NIGHTLY_VERSION

# Update the rust-toolchain.toml file
cat > /Users/krishanu8219/Downloads/EthBucharest-01-ec6631b6330e44286401779b3715f7b07046c355/arbi-proof-new/rust-toolchain.toml << EOF
[toolchain]
channel = "nightly"
components = ["rustfmt", "clippy", "rust-src"]
targets = ["wasm32-unknown-unknown", "wasm32-wasi"]
EOF

# Update Cargo.toml with the latest stylus-sdk version
cat > /Users/krishanu8219/Downloads/EthBucharest-01-ec6631b6330e44286401779b3715f7b07046c355/arbi-proof-new/Cargo.toml << EOF
[package]
name = "arbi-proof-new"
version = "0.1.0"
edition = "2021"

[dependencies]
stylus-sdk = "0.9.1"
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

# Create a simplified lib.rs using the latest stylus-sdk syntax
cat > /Users/krishanu8219/Downloads/EthBucharest-01-ec6631b6330e44286401779b3715f7b07046c355/arbi-proof-new/src/lib.rs << 'EOF'
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

    // Event signature constants
    const TOPIC_DISPUTE_INITIATED: [u8; 32] = hex!("c0ffc525a1c7ed42f5800d3456826e1ab57528228b4b78a5f4395f12acad581c");
    const TOPIC_BISECTION_CHALLENGE: [u8; 32] = hex!("8ce8baccddca58f45e59c77062be74f8e3a1c8e309282ad8bb436f6d9e25008f");
    const TOPIC_DISPUTE_RESOLVED: [u8; 32] = hex!("4c514279ce03d81bf6b1f1eb88b43c634d1d7e6ed95835c967e33b44c8ec8785");

    // Status codes
    const STATUS_PENDING: u8 = 0;
    const STATUS_IN_PROGRESS: u8 = 1;
    const STATUS_RESOLVED: u8 = 2;

    // Main storage structure
    #[derive(Storage)]
    pub struct ArbiProofSimulator {
        // Core dispute data
        disputes_count: u64,
        dispute_challenger: Mapping<FixedBytes<32>, Address>,
        dispute_defender: Mapping<FixedBytes<32>, Address>,
        dispute_status: Mapping<FixedBytes<32>, u8>,
        dispute_timestamp: Mapping<FixedBytes<32>, U256>,
        
        // Benchmarking data
        benchmark_results: Mapping<String, U256>,
    }

    #[external]
    impl ArbiProofSimulator {
        pub fn constructor(self) -> Result<(), Vec<u8>> {
            Ok(())
        }

        // Create a new dispute
        #[payable]
        pub fn initiate_dispute(
            &mut self,
            defender: Address,
        ) -> Result<FixedBytes<32>, Vec<u8>> {
            let start_gas = evm::gas_left();
            
            // Basic validation
            let caller = msg::sender();
            let value = msg::value();
            if value < U256::from(100000000000000000u64) {  // 0.1 ETH
                return Err("Insufficient stake".into());
            }
            
            // Generate dispute ID
            let mut hasher = Keccak256::new();
            hasher.update(caller.as_slice());
            hasher.update(defender.as_slice());
            hasher.update(&U256::from(block::timestamp()).to_be_bytes::<32>());
            let dispute_id = FixedBytes::<32>::from_slice(&hasher.finalize());
            
            // Store dispute data
            self.dispute_challenger.insert(dispute_id, caller);
            self.dispute_defender.insert(dispute_id, defender);
            self.dispute_status.insert(dispute_id, STATUS_IN_PROGRESS);
            self.dispute_timestamp.insert(dispute_id, U256::from(block::timestamp()));
            
            // Increment dispute counter
            self.disputes_count.set(self.disputes_count.get() + 1);
            
            // Emit event
            let topic0 = FixedBytes::<32>::from_slice(&TOPIC_DISPUTE_INITIATED);
            
            // Pad addresses to 32 bytes
            let mut caller_bytes = [0u8; 32];
            caller_bytes[12..].copy_from_slice(caller.as_slice());
            let caller_topic = FixedBytes::from_slice(&caller_bytes);
            
            let mut defender_bytes = [0u8; 32];
            defender_bytes[12..].copy_from_slice(defender.as_slice());
            let defender_topic = FixedBytes::from_slice(&defender_bytes);
            
            evm::raw_log(&[topic0, dispute_id, caller_topic, defender_topic], &[]);
            
            // Record gas usage for benchmarking
            let gas_used = start_gas - evm::gas_left();
            self.benchmark_results.insert("initiate_dispute".into(), U256::from(gas_used));
            
            Ok(dispute_id)
        }
        
        // Resolve a dispute
        pub fn resolve_dispute(
            &mut self,
            dispute_id: FixedBytes<32>,
        ) -> Result<(), Vec<u8>> {
            let start_gas = evm::gas_left();
            
            // Check if dispute exists
            if !self.dispute_exists(dispute_id) {
                return Err("Dispute not found".into());
            }
            
            // Update status
            self.dispute_status.insert(dispute_id, STATUS_RESOLVED);
            
            // Emit event
            let topic0 = FixedBytes::<32>::from_slice(&TOPIC_DISPUTE_RESOLVED);
            let challenger = self.dispute_challenger.get(dispute_id);
            
            let mut challenger_bytes = [0u8; 32];
            challenger_bytes[12..].copy_from_slice(challenger.as_slice());
            let challenger_topic = FixedBytes::from_slice(&challenger_bytes);
            
            evm::raw_log(&[topic0, dispute_id, challenger_topic], &[]);
            
            // Record gas usage
            let gas_used = start_gas - evm::gas_left();
            self.benchmark_results.insert("resolve_dispute".into(), U256::from(gas_used));
            
            Ok(())
        }
        
        // Run benchmark to compare with Solidity
        pub fn benchmark_hashing(&mut self) -> Result<U256, Vec<u8>> {
            let start_gas = evm::gas_left();
            
            // Perform a series of hash operations that would be expensive in Solidity
            let mut result = [0u8; 32];
            for i in 0..25 {
                let mut hasher = Keccak256::new();
                hasher.update(&[i as u8; 32]);
                hasher.update(&result);
                result = hasher.finalize().into();
            }
            
            let gas_used = start_gas - evm::gas_left();
            self.benchmark_results.insert("hash_verification".into(), U256::from(gas_used));
            
            Ok(U256::from(gas_used))
        }
        
        // Run state transition benchmark
        pub fn benchmark_state_transition(&mut self) -> Result<U256, Vec<u8>> {
            let start_gas = evm::gas_left();
            
            // Perform a computation that would be expensive in Solidity
            let mut total = U256::ZERO;
            for i in 0..30 {
                let mut hasher = Keccak256::new();
                hasher.update(&[i as u8; 32]);
                hasher.update(&total.to_be_bytes::<32>());
                let hash = FixedBytes::<32>::from_slice(&hasher.finalize());
                
                // Add some of the bytes from the hash
                total += U256::from(hash.as_slice()[0]) + U256::from(hash.as_slice()[1]);
            }
            
            let gas_used = start_gas - evm::gas_left();
            self.benchmark_results.insert("state_transition".into(), U256::from(gas_used));
            
            Ok(U256::from(gas_used))
        }
        
        // View function to check if dispute exists
        pub fn dispute_exists(&self, dispute_id: FixedBytes<32>) -> bool {
            self.dispute_challenger.get(dispute_id) != Address::ZERO
        }
        
        // Get benchmark comparison data
        pub fn get_benchmark_data(&self, operation: String) -> U256 {
            self.benchmark_results.get(operation)
        }
        
        // Run all benchmarks
        pub fn run_all_benchmarks(&mut self) -> Result<(), Vec<u8>> {
            let _ = self.benchmark_hashing();
            let _ = self.benchmark_state_transition();
            
            // Create a test dispute
            let defender = Address::from([0; 20]);
            let dispute_id = self.initiate_dispute(defender)?;
            
            // Resolve the dispute
            let _ = self.resolve_dispute(dispute_id);
            
            Ok(())
        }
    }
}
EOF

# Create a simple deployment script
cat > /Users/krishanu8219/Downloads/EthBucharest-01-ec6631b6330e44286401779b3715f7b07046c355/deploy_simple.sh << EOF
#!/bin/bash

cd /Users/krishanu8219/Downloads/EthBucharest-01-ec6631b6330e44286401779b3715f7b07046c355/arbi-proof-new

# Build with the latest nightly
echo "Building contract with the latest nightly..."
cargo +nightly build --release --target wasm32-unknown-unknown

# Check with cargo stylus
echo "Checking contract with stylus..."
cargo stylus check

# Deploy the contract if a private key is available
if [ -f "../private_key.txt" ]; then
  PRIVATE_KEY=\$(cat ../private_key.txt)
  echo "Deploying contract to Arbitrum Sepolia..."
  cargo stylus deploy --private-key \$PRIVATE_KEY --no-verify --endpoint https://sepolia-rollup.arbitrum.io/rpc
else
  echo "No private key found. Skipping deployment."
fi

echo "Process complete!"
EOF

chmod +x /Users/krishanu8219/Downloads/EthBucharest-01-ec6631b6330e44286401779b3715f7b07046c355/deploy_simple.sh

echo "Setup complete!"
echo "Run these commands to build and deploy:"
echo "1. ./install_toolchain.sh (to install the latest nightly toolchain)"
echo "2. ./deploy_simple.sh (to build and deploy the contract)"
