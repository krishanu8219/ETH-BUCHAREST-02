# ArbiProof Smart Contract

This is a Rust implementation of the ArbiProof dispute resolution system for Arbitrum Stylus.

## Deployment Options

### Option 1: Using the deploy script

The easiest way to deploy is using our prepared script:

```bash
# Make the script executable
chmod +x ../deploy_contract.sh

# Run the deployment script
../deploy_contract.sh
```

### Option 2: Manual deployment

If you prefer to deploy manually:

1. Build the contract:

```bash
cargo +nightly-2024-07-01 build --target wasm32-unknown-unknown --release
```

2. Deploy using cargo-stylus:

```bash
# With specific WASM file
cargo stylus deploy \
  --private-key $(cat ../private_key.txt) \
  --endpoint https://sepolia-rollup.arbitrum.io/rpc \
  --wasm-file ./target/wasm32-unknown-unknown/release/arbi_proof_new.wasm
```

### Option 3: Using the Stylus CLI directly

If cargo-stylus is giving errors, you can use the Stylus CLI directly:

```bash
# Install stylus CLI if not already installed
npm install -g @arbitrum/stylus-cli

# Deploy using stylus CLI
stylus deploy \
  --network sepolia \
  --private-key $(cat ../private_key.txt) \
  --wasm-file ./target/wasm32-unknown-unknown/release/arbi_proof_new.wasm
```

## After Deployment

After successful deployment:
1. Save your contract address
2. Verify your contract on Arbitrum Sepolia Explorer with:
   ```bash
   cargo stylus verify --contract YOUR_CONTRACT_ADDRESS
   ```
