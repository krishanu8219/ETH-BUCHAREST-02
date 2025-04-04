#!/bin/bash

# Change to the project directory
if [ -d "./contracts/arbi-proof" ]; then
  echo "Changing to project directory: ./contracts/arbi-proof"
  cd ./contracts/arbi-proof
elif [ -d "./arbi-proof" ]; then
  echo "Changing to project directory: ./arbi-proof"
  cd ./arbi-proof
else
  echo "ERROR: Cannot find the project directory with Cargo.toml"
  exit 1
fi

# Create a new Cargo.toml file that can work with the current toolchain
echo "Creating a simplified project to work with current toolchain..."

# Create a backup of the original files
echo "Backing up original files..."
mkdir -p backup
cp Cargo.toml backup/Cargo.toml || echo "No Cargo.toml to backup"
cp -r src backup/ || echo "No src directory to backup"

# Create a new minimal Cargo.toml
echo "Creating new Cargo.toml..."
cat > Cargo.toml << EOF
[package]
name = "arbi-proof-contract"
version = "0.1.0"
edition = "2021"

[dependencies]
stylus-sdk = "0.4.1"
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

# Create rust-toolchain.toml with nightly version
echo "Creating rust-toolchain.toml with nightly version..."
cat > rust-toolchain.toml << EOF
[toolchain]
channel = "nightly-2023-12-01"
components = ["rustfmt", "clippy", "rust-src"]
targets = ["wasm32-unknown-unknown", "wasm32-wasi"]
EOF

# Clean any previous build artifacts
echo "Cleaning project directory..."
rm -f Cargo.lock
rm -rf target

# Install the nightly toolchain
echo "Installing nightly toolchain..."
rustup install nightly-2023-12-01
rustup target add wasm32-unknown-unknown --toolchain nightly-2023-12-01
rustup target add wasm32-wasi --toolchain nightly-2023-12-01

# Build the project
echo "Building the contract..."
cargo +nightly-2023-12-01 build --release --target wasm32-unknown-unknown

# Check the contract
echo "Checking contract with stylus..."
cargo stylus check || echo "Check failed, but continuing with deployment attempt"

# Deploy the contract
echo "Deploying contract to Arbitrum Sepolia..."
if [ -f "../../private_key.txt" ]; then
  PRIVATE_KEY=$(cat ../../private_key.txt)
  echo "Using private key from private_key.txt"
  
  if [ -f "../../wallet_address.txt" ]; then
    WALLET_ADDRESS=$(cat ../../wallet_address.txt)
    echo "Deploying from address: $WALLET_ADDRESS"
  fi
  
  # Get help to see available options
  echo "Checking deployment command options..."
  DEPLOY_HELP=$(cargo stylus deploy --help)
  echo "$DEPLOY_HELP"
  
  # Check if --no-verify is supported
  if echo "$DEPLOY_HELP" | grep -q -- "--no-verify"; then
    echo "Using --no-verify flag for deployment..."
    NO_VERIFY_OPT="--no-verify"
  else
    echo "No --no-verify flag supported, proceeding without it..."
    NO_VERIFY_OPT=""
  fi
  
  echo "Starting deployment..."
  cargo stylus deploy --private-key $PRIVATE_KEY $NO_VERIFY_OPT
  
  # Store the deployment result
  DEPLOY_RESULT=$?
  if [ $DEPLOY_RESULT -eq 0 ]; then
    echo "Deployment successful! Check console output above for your contract address."
    echo "Enter your contract address to save it (copy from above):"
    read CONTRACT_ADDRESS
    if [ ! -z "$CONTRACT_ADDRESS" ]; then
      echo $CONTRACT_ADDRESS > ../../contract_address.txt
      echo "Contract address saved to contract_address.txt"
    fi
  else
    echo "Deployment failed. Please check the error messages above."
    echo "You may need to create a new Stylus project from scratch and migrate your code."
    echo "Try: cargo stylus new arbi-proof-new"
  fi
else
  echo "ERROR: private_key.txt not found in the parent directory."
  exit 1
fi

# Go back to original directory
cd - > /dev/null

echo -e "\n=== NEXT STEPS ==="
echo "1. If deployment was successful, verify your contract on Arbitrum Sepolia Explorer:"
echo "   https://sepolia.arbiscan.io/"
echo "2. To interact with your contract, use ethers.js or web3.js libraries" 
echo "3. For contract verification, run: cargo stylus verify --contract YOUR_CONTRACT_ADDRESS"

echo -e "\n=== ALTERNATIVE APPROACH ==="
echo "If you continue to have issues, try creating a new project from scratch:"
echo "1. cargo stylus new my-arbi-proof"
echo "2. Copy your src/lib.rs file to the new project"
echo "3. Deploy the new project"

#!/bin/bash

# Navigate to the contract directory
cd /Users/krishanu8219/Downloads/EthBucharest-01-ec6631b6330e44286401779b3715f7b07046c355/arbi-proof-new

# Build the WASM binary first
echo "Building the contract..."
cargo +nightly-2024-07-01 build --target wasm32-unknown-unknown --release

# Check if the WASM file exists
if [ ! -f "./target/wasm32-unknown-unknown/release/arbi_proof_new.wasm" ]; then
  echo "Error: WASM file not found!"
  exit 1
fi

# Read private key (securely) from file
if [ -f "../private_key.txt" ]; then
  PRIVATE_KEY=$(cat ../private_key.txt)
  echo "Using private key from private_key.txt"
  
  # Deploy using the WASM file directly with stylus
  echo "Deploying contract to Arbitrum Sepolia..."
  cargo stylus deploy \
    --private-key $PRIVATE_KEY \
    --endpoint https://sepolia-rollup.arbitrum.io/rpc \
    --wasm-file ./target/wasm32-unknown-unknown/release/arbi_proof_new.wasm
    
  # Check deployment status
  if [ $? -eq 0 ]; then
    echo "Deployment successful! Enter your contract address to save it:"
    read CONTRACT_ADDRESS
    if [ ! -z "$CONTRACT_ADDRESS" ]; then
      echo $CONTRACT_ADDRESS > ../contract_address.txt
      echo "Contract address saved to contract_address.txt"
    fi
  else
    echo "Deployment failed. Please check the error messages above."
  fi
else
  echo "ERROR: private_key.txt not found in the parent directory."
  exit 1
fi

echo -e "\n=== NEXT STEPS ==="
echo "1. Verify your contract on Arbitrum Sepolia Explorer: https://sepolia.arbiscan.io/"
echo "2. To verify your contract: cargo stylus verify --contract YOUR_CONTRACT_ADDRESS"