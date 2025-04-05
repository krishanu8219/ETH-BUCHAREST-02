#!/bin/bash

# Color codes for better readability
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}     ArbiProof Testing Suite${NC}"
echo -e "${BLUE}========================================${NC}"

# Check for required dependencies
echo -e "${YELLOW}Checking dependencies...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is required but not installed.${NC}"
    exit 1
fi

if ! command -v cargo &> /dev/null; then
    echo -e "${RED}Cargo is required but not installed.${NC}"
    exit 1
fi

echo -e "${GREEN}Dependencies found.${NC}"

# Navigate to the contract directory
cd "$(dirname "$0")/arbi-proof-new"

# Build the contract
echo -e "${YELLOW}Building the contract...${NC}"
cargo build --target wasm32-unknown-unknown --release

if [ $? -ne 0 ]; then
    echo -e "${RED}Contract build failed. Please check your Rust code.${NC}"
    exit 1
fi

echo -e "${GREEN}Contract built successfully.${NC}"

# Export ABI
echo -e "${YELLOW}Exporting contract ABI...${NC}"
cargo stylus export-abi --wasm-file ./target/wasm32-unknown-unknown/release/arbi_proof_new.wasm > ../arbi_proof_abi.json

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to export ABI. Make sure cargo-stylus is installed.${NC}"
    exit 1
fi

echo -e "${GREEN}ABI exported successfully.${NC}"

# Return to the parent directory
cd ..

# Check if contract address is set
if grep -q "0x0000000000000000000000000000000000000000" test_arbiproof.js; then
    echo -e "${YELLOW}Warning: You need to update the contract address in test_arbiproof.js${NC}"
    echo -e "Edit test_arbiproof.js and replace the placeholder with your actual contract address."
fi

# Install required npm packages
echo -e "${YELLOW}Installing required npm packages...${NC}"
npm install --no-save ethers@5.7.2

# Run the tests
echo -e "${YELLOW}Running tests...${NC}"
node test_arbiproof.js

if [ $? -eq 0 ]; then
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}     Tests completed successfully!${NC}"
    echo -e "${GREEN}========================================${NC}"
else
    echo -e "${RED}Tests failed. Please check the output above for errors.${NC}"
fi
