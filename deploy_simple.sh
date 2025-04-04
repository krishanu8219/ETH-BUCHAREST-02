#!/bin/bash

set -e  # Exit on error

BASE_DIR="/Users/krishanu8219/Downloads/EthBucharest-01-ec6631b6330e44286401779b3715f7b07046c355"
PROJECT_DIR="$BASE_DIR/arbi-proof-new"

cd "$PROJECT_DIR"

echo "=== Setting up Rust toolchain ==="
# Use a specific nightly that's known to have rustc 1.81+
NIGHTLY_VERSION="nightly-2024-07-01"

echo "Installing $NIGHTLY_VERSION toolchain..."
rustup install $NIGHTLY_VERSION
rustup default $NIGHTLY_VERSION

echo "Adding WebAssembly target to toolchain..."
rustup target add wasm32-unknown-unknown --toolchain $NIGHTLY_VERSION

# Update rust-toolchain.toml to use the specific nightly version
echo "Updating rust-toolchain.toml..."
cat > rust-toolchain.toml << EOF
[toolchain]
channel = "$NIGHTLY_VERSION"
components = ["rustfmt", "clippy", "rust-src"]
targets = ["wasm32-unknown-unknown", "wasm32-wasi"]
EOF

# Check rustc version
echo "Current rustc version:"
rustc --version

# Update Cargo.toml to use a compatible stylus version
echo "Updating Cargo.toml to use a compatible version of stylus-sdk..."
cat > Cargo.toml << EOF
[package]
name = "arbi-proof-new"
version = "0.1.0"
edition = "2021"

[dependencies]
stylus-sdk = "0.8.3"
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

# Clean any previous build artifacts
echo "Cleaning previous build artifacts..."
cargo clean

# Build with the specific nightly
echo "Building contract with $NIGHTLY_VERSION..."
cargo +$NIGHTLY_VERSION build --release --target wasm32-unknown-unknown

# Check with cargo stylus
echo "Checking contract with stylus..."
cargo stylus check

# Deploy the contract if a private key is available
if [ -f "../private_key.txt" ]; then
  PRIVATE_KEY=$(cat ../private_key.txt)
  echo "Deploying contract to Arbitrum Sepolia..."
  
  echo "Verifying rustc version for deployment:"
  rustc +$NIGHTLY_VERSION --version
  
  # Try building with the explicit nightly version for the wasm target
  echo "Building with explicit toolchain designation:"
  cargo +$NIGHTLY_VERSION build --release --target wasm32-unknown-unknown
  
  # If build succeeds, try deployment
  if [ $? -eq 0 ]; then
    echo "Build succeeded, attempting deployment..."
    # Try deploying with explicit toolchain version
    cargo +$NIGHTLY_VERSION stylus deploy \
      --private-key $PRIVATE_KEY \
      --no-verify \
      --endpoint https://sepolia-rollup.arbitrum.io/rpc \
      --wait-forever
    
    if [ $? -eq 0 ]; then
      echo "✅ Contract deployed successfully!"
      
      # Extract and save the contract address
      echo "Enter the deployed contract address:"
      read CONTRACT_ADDRESS
      if [ ! -z "$CONTRACT_ADDRESS" ]; then
        echo "$CONTRACT_ADDRESS" > "$BASE_DIR/contract_address.txt"
        echo "Contract address saved to $BASE_DIR/contract_address.txt"
      fi
    else
      echo "❌ Deployment failed. Check errors above."
    fi
  else
    echo "❌ Build failed. Cannot proceed with deployment."
  fi
else
  echo "No private key found. Skipping deployment."
  echo "Please create a private_key.txt file in the parent directory with your Ethereum private key."
fi

echo "Process complete!"
