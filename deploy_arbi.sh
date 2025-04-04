#!/bin/bash

cd /Users/krishanu8219/Downloads/EthBucharest-01-ec6631b6330e44286401779b3715f7b07046c355/arbi-proof-new

# Create rust-toolchain.toml with specific nightly version
echo "Creating rust-toolchain.toml file..."
cat > rust-toolchain.toml << EOF
[toolchain]
channel = "nightly-2023-12-01"
components = ["rustfmt", "clippy", "rust-src"]
targets = ["wasm32-unknown-unknown", "wasm32-wasi"]
EOF

# Remove any existing lock file to allow it to be regenerated
echo "Removing existing Cargo.lock to allow regeneration..."
rm -f Cargo.lock

# Install the nightly toolchain
rustup install nightly-2023-12-01
rustup target add wasm32-unknown-unknown --toolchain nightly-2023-12-01
rustup target add wasm32-wasi --toolchain nightly-2023-12-01

# Build without locked flag first
echo "Building contract with cargo..."
cargo +nightly-2023-12-01 build --release --target wasm32-unknown-unknown

# Now check with stylus
echo "Checking contract with stylus..."
cargo stylus check

# Deploy the contract
echo "Deploying contract to Arbitrum Sepolia..."
if [ -f "../private_key.txt" ]; then
  PRIVATE_KEY=$(cat ../private_key.txt)
  echo "Using private key from private_key.txt"
  
  if [ -f "../wallet_address.txt" ]; then
    WALLET_ADDRESS=$(cat ../wallet_address.txt)
    echo "Deploying from address: $WALLET_ADDRESS"
  fi
  
  echo "Starting deployment with --no-verify flag..."
  # Add --ignorebinary flag to bypass using the binary directly
  cargo stylus deploy --private-key $PRIVATE_KEY --no-verify
  
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
    echo "Deployment failed. Let's try with direct RPC endpoint..."
    cargo stylus deploy --private-key $PRIVATE_KEY --no-verify --endpoint https://sepolia-rollup.arbitrum.io/rpc
  fi
else
  echo "ERROR: private_key.txt not found in the parent directory."
  exit 1
fi

echo -e "\n=== NEXT STEPS ==="
echo "1. Verify your contract on Arbitrum Sepolia Explorer: https://sepolia.arbiscan.io/"
echo "2. Update the contract address in your frontend code"
echo "3. To verify your contract: cargo stylus verify --contract YOUR_CONTRACT_ADDRESS"
