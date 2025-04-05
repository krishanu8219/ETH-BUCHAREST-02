#!/bin/bash

# Color codes for better readability
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

CONTRACT_ADDRESS="0xaad921b9c96d7afc3398895b371a77e2e1f34c5c"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}     ArbiProof Contract Caching${NC}"
echo -e "${BLUE}========================================${NC}"

# Check if private key file exists
if [ ! -f "./private_key.txt" ]; then
    echo -e "${RED}Error: private_key.txt not found!${NC}"
    echo -e "${YELLOW}Please ensure the file exists in the current directory.${NC}"
    exit 1
fi

echo -e "${YELLOW}Caching contract at address ${CONTRACT_ADDRESS}...${NC}"
echo -e "${YELLOW}This will significantly reduce gas costs for function calls${NC}"

# Cache the contract in ArbOS with the private key
cargo stylus cache bid --private-key $(cat ./private_key.txt) ${CONTRACT_ADDRESS} 0

if [ $? -ne 0 ]; then
    echo -e "${RED}Contract caching failed. Please check the errors above.${NC}"
    exit 1
fi

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}     Contract cached successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Your contract functions will now have lower gas costs.${NC}"
