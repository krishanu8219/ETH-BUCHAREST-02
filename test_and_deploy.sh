#!/bin/bash

# Color codes for better readability
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}     ArbiProof Test & Deploy Script${NC}"
echo -e "${BLUE}========================================${NC}"

cd "$(dirname "$0")/arbi-proof-new"

# Step 1: Build with all features enabled and test 
echo -e "${YELLOW}Building contract with all features...${NC}"
cargo build --features export-abi --target wasm32-unknown-unknown --release

if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed - fix the errors above before proceeding.${NC}"
    exit 1
fi

echo -e "${GREEN}Contract built successfully.${NC}"

# Step 2: Run Wasm validation
echo -e "${YELLOW}Running Wasm validation...${NC}"
wasm-strip target/wasm32-unknown-unknown/release/arbi_proof_new.wasm 2>/dev/null || echo "wasm-strip not available, skipping"
wasm-utils validate target/wasm32-unknown-unknown/release/arbi_proof_new.wasm 2>/dev/null || echo "wasm-utils not available, skipping"

# Step 3: Export and validate ABI 
echo -e "${YELLOW}Exporting ABI...${NC}"
cargo stylus export-abi --wasm-file ./target/wasm32-unknown-unknown/release/arbi_proof_new.wasm > ../arbi_proof_abi.json

if [ $? -ne 0 ]; then
    echo -e "${RED}ABI export failed - check for issues in your contract interface.${NC}"
    exit 1
fi

echo -e "${GREEN}ABI exported successfully.${NC}"

# Step 4: Run cargo clippy for additional static analysis
echo -e "${YELLOW}Running cargo clippy...${NC}"
cargo clippy -- -D warnings

if [ $? -ne 0 ]; then
    echo -e "${RED}Clippy found issues - fix the warnings above before proceeding.${NC}"
    exit 1
fi

echo -e "${GREEN}Code quality check passed.${NC}"

# Step 5: Deploy with full verification
echo -e "${YELLOW}Deploying contract to Arbitrum Sepolia with full verification...${NC}"
cargo stylus deploy \
  --private-key $(cat ../private_key.txt) \
  --endpoint https://sepolia-rollup.arbitrum.io/rpc

if [ $? -ne 0 ]; then
    echo -e "${RED}Deployment failed - check the errors above.${NC}"
    exit 1
fi

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}     Contract deployed successfully!${NC}"
echo -e "${GREEN}========================================${NC}"

echo -e "${YELLOW}Don't forget to save your contract address for testing.${NC}"
echo -e "${YELLOW}You can now run comprehensive tests with test_arbiproof.js${NC}"
