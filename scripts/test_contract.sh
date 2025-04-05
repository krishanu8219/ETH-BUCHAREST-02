#!/bin/bash

# Color codes for better readability
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

cd "../tests"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}     ArbiProof Contract Testing${NC}"
echo -e "${BLUE}========================================${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is required but not found!${NC}"
    exit 1
fi

# Install dependencies if needed
echo -e "${YELLOW}Checking dependencies...${NC}"
if ! command -v npm &> /dev/null; then
    echo -e "${RED}NPM is required but not found!${NC}"
    exit 1
fi

# Install ethers if not installed
if [ ! -d "../node_modules/ethers" ]; then
    echo -e "${YELLOW}Installing ethers.js...${NC}"
    npm install --no-save ethers@5.7.2
fi

# Run tests
echo -e "${YELLOW}Running tests...${NC}"
node test_arbiproof.js

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Tests completed successfully!${NC}"
else
    echo -e "${RED}Tests failed. See errors above.${NC}"
    exit 1
fi
