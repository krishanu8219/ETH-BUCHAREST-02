#!/bin/bash

# Color codes for better readability
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}     ArbiProof Contract Testing${NC}"
echo -e "${BLUE}========================================${NC}"

echo "Checking dependencies..."
# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed!${NC}"
    exit 1
fi

# Navigate to project root
cd "$(dirname "$0")/.."

echo "Running tests..."
# Use the correct file extension based on your choice above
# For ES modules:
node tests/test_arbiproof.js || node tests/test_arbiproof.cjs

if [ $? -eq 0 ]; then
    echo -e "${GREEN}All tests passed successfully!${NC}"
else
    echo -e "${RED}Tests failed. See errors above.${NC}"
fi
