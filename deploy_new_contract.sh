#!/bin/bash

# Check if the new project exists
if [ ! -d "./arbi-proof-new" ]; then
  echo "Creating new Stylus project..."
  cargo stylus new arbi-proof-new
  
  # Copy the updated lib.rs to the new project
  if [ -f "updated_lib.rs" ]; then
    cp updated_lib.rs ./arbi-proof-new/src/lib.rs
    echo "Copied updated contract code to new project"
  else
    echo "WARNING: updated_lib.rs not found. Using default contract template."
  fi
fi

# Navigate to the new project directory
cd ./arbi-proof-new

# Create rust-toolchain.toml file with specific nightly version
echo "Creating rust-toolchain.toml with specific nightly version..."
cat > rust-toolchain.toml << EOF
[toolchain]
channel = "nightly-2023-12-01"
components = ["rustfmt", "clippy", "rust-src"]
targets = ["wasm32-unknown-unknown", "wasm32-wasi"]
EOF

# Check the contract
echo "Checking contract..."
cargo stylus check

# Deploy the contract
echo "Deploying contract to Arbitrum Sepolia..."
if [ -f "../private_key.txt" ]; then
  PRIVATE_KEY=$(cat ../private_key.txt)
  echo "Using private key from private_key.txt"
  
  # Display the address we're deploying from
  if [ -f "../wallet_address.txt" ]; then
    WALLET_ADDRESS=$(cat ../wallet_address.txt)
    echo "Deploying from address: $WALLET_ADDRESS"
  fi
  
  # Deploy with --no-verify flag for faster deployment
  echo "Starting deployment with --no-verify flag..."
  cargo stylus deploy --private-key $PRIVATE_KEY --no-verify --endpoint https://sepolia-rollup.arbitrum.io/rpc
  
  # Store deployment result
  DEPLOY_RESULT=$?
  if [ $DEPLOY_RESULT -eq 0 ]; then
    echo "Deployment successful! Check console output above for contract address."
    echo "Enter your contract address to save it (copy from above):"
    read CONTRACT_ADDRESS
    if [ ! -z "$CONTRACT_ADDRESS" ]; then
      echo $CONTRACT_ADDRESS > ../contract_address.txt
      echo "Contract address saved to contract_address.txt"
    fi
  else
    echo "Deployment failed. Check error messages above."
  fi
else
  echo "ERROR: private_key.txt not found in the parent directory."
  exit 1
fi

cd ..

echo -e "\n=== NEXT STEPS ==="
echo "1. Verify your contract on Arbitrum Sepolia Explorer: https://sepolia.arbiscan.io/"
echo "2. Use the contract address in your frontend application"
echo "3. To verify your contract: cargo stylus verify --contract YOUR_CONTRACT_ADDRESS"
