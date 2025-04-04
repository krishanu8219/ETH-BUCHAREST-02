#!/bin/bash

# Create a new Stylus project
cd /Users/krishanu8219/Downloads/EthBucharest-01-ec6631b6330e44286401779b3715f7b07046c355
cargo stylus new arbi-proof-new

echo "New Stylus project created in ./arbi-proof-new"
echo "Now updating the lib.rs file with your contract code..."

# Make the deploy script executable
echo "Making deployment script executable..."
chmod +x deploy_new_contract.sh
echo "You can now run ./deploy_new_contract.sh"
