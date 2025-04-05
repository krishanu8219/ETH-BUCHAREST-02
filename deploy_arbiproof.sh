#!/bin/bash
set -e

# Color codes for better readability
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}     ArbiProof Deployment Script${NC}"
echo -e "${BLUE}========================================${NC}"

cd "$(dirname "$0")/arbi-proof-new"

echo -e "${YELLOW}Building contract...${NC}"
cargo build --target wasm32-unknown-unknown --release

if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed.${NC}"
    exit 1
fi

echo -e "${GREEN}Contract built successfully.${NC}"
echo -e "${YELLOW}Deploying contract to Arbitrum Sepolia...${NC}"

# Deploy using the direct wasm file option to bypass the 'run' attempt
cargo stylus deploy \
  --private-key $(cat ../private_key.txt) \
  --endpoint https://sepolia-rollup.arbitrum.io/rpc \
  --wasm-file ./target/wasm32-unknown-unknown/release/arbi_proof_new.wasm \
  --no-verify

if [ $? -ne 0 ]; then
    echo -e "${RED}Deployment failed.${NC}"
    exit 1
fi

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}     Contract deployed successfully!${NC}"
echo -e "${GREEN}========================================${NC}"

echo -e "${YELLOW}Don't forget to save your contract address for testing.${NC}"
