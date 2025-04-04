#!/bin/bash

echo "Setting up for Arbitrum Stylus deployment"

# Display available cargo stylus commands
echo "Available cargo stylus commands:"
cargo stylus --help

# Create a wallet using the standard Ethereum approach
echo "Creating a wallet key file..."
# Generate a private key
PRIVATE_KEY=$(openssl rand -hex 32)
echo "Your private key (SAVE THIS SECURELY):"
echo $PRIVATE_KEY

# Calculate the corresponding address (this is simplified)
echo "To get your address, you'll need to use a wallet tool like ethers.js or web3.js to derive it from your private key"
echo "For now, save your private key to a file:"

# Save private key to a file
echo $PRIVATE_KEY > ./private_key.txt
chmod 600 ./private_key.txt
echo "Private key saved to ./private_key.txt"

echo "Get testnet ETH from: https://www.alchemy.com/faucets/arbitrum-sepolia"