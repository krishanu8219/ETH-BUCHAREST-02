#!/bin/bash

# Contract information
CONTRACT_ADDRESS="0x8f645e59e8b2e8c046bc733d2b85398845e98aaa"
DEPLOYMENT_TX="0xe5ed208aaaa9fdd2795f0d0ef2efede0b83b12bf880173d05ef4c57f23408f03"
ACTIVATION_TX="0xcda2557a5059e9fd595dd83523a652957f2b9c6341ee5fee783a3fbe172b94ce"

echo "=== ArbiProof Contract Information ==="
echo "Contract Address: $CONTRACT_ADDRESS"
echo "Deployment Tx: $DEPLOYMENT_TX"
echo "Activation Tx: $ACTIVATION_TX"
echo ""

# Check if the contract exists on Arbiscan first
echo "Checking if contract exists on Arbiscan..."
echo "Visit: https://sepolia.arbiscan.io/address/$CONTRACT_ADDRESS"
echo ""

echo "=== Verification Command ==="
echo "The correct syntax for verifying your contract is:"
echo "cargo stylus verify --deployment-tx $DEPLOYMENT_TX"
echo ""

# Ask if user wants to verify the contract now
read -p "Do you want to verify the contract now? (y/n): " verify_now
if [[ $verify_now == "y" || $verify_now == "Y" ]]; then
  echo "Verifying contract..."
  cargo stylus verify --deployment-tx $DEPLOYMENT_TX > verify_output.txt 2>&1
  VERIFY_RESULT=$?
  cat verify_output.txt
  
  # Check verification result
  if [ $VERIFY_RESULT -ne 0 ]; then
    echo ""
    echo "⚠️ Verification failed!"
    
    # Check for specific error message
    if grep -q "No code at address" verify_output.txt; then
      echo "ERROR: No code found at contract address. Possible reasons:"
      echo "  - Contract might have been removed or self-destructed"
      echo "  - Contract might have been deployed to a different network"
      echo "  - The address might be incorrect"
      echo ""
      echo "Suggested fixes:"
      echo "  - Confirm the contract address on Arbiscan: https://sepolia.arbiscan.io/address/$CONTRACT_ADDRESS"
      echo "  - Check if you're using the correct RPC endpoint (Arbitrum Sepolia)"
    else
      echo "Possible reasons:"
      echo "  - The contract might not be deployed at the specified address"
      echo "  - The deployment transaction hash might be incorrect"
      echo "  - The contract needs to be activated first"
    fi
  fi
  # Clean up temp file
  rm -f verify_output.txt
fi

echo ""
echo "=== Caching Command ==="
echo "To cache your contract for better gas efficiency:"

# Check for private key file in current directory
if [ -f "./private_key.txt" ]; then
  PRIVATE_KEY_PATH="./private_key.txt"
  echo "cargo stylus cache bid --private-key \$(cat $PRIVATE_KEY_PATH) --endpoint https://sepolia-rollup.arbitrum.io/rpc $CONTRACT_ADDRESS 0"
  
  # Ask if user wants to cache the contract now
  echo ""
  read -p "Do you want to cache the contract now? (y/n): " cache_now
  if [[ $cache_now == "y" || $cache_now == "Y" ]]; then
    echo "Caching contract..."
    echo "Checking if contract can be cached..."
    CACHE_OUTPUT=$(cargo stylus cache bid --private-key $(cat $PRIVATE_KEY_PATH) --endpoint https://sepolia-rollup.arbitrum.io/rpc $CONTRACT_ADDRESS 0 2>&1)
    CACHE_RESULT=$?
    echo "$CACHE_OUTPUT"
    
    # Check if contract is already cached
    if echo "$CACHE_OUTPUT" | grep -q "Stylus contract is already cached"; then
      echo ""
      echo "✅ GOOD NEWS: Your contract is already cached in ArbOS!"
      echo "This means your contract will benefit from reduced gas costs for calls."
      echo "No further action is needed for caching."
    elif [ $CACHE_RESULT -ne 0 ]; then
      echo ""
      echo "❌ Caching failed. Please check the error message above."
    else
      echo ""
      echo "✅ Caching completed successfully!"
    fi
  fi
else
  echo "⚠️ private_key.txt not found in the current directory."
  echo "To cache the contract, create a private_key.txt file with your Ethereum private key"
  echo "Example command (replace YOUR_KEY with your actual private key):"
  echo "echo \"YOUR_KEY\" > private_key.txt"
fi

echo ""
echo "=== View Contract on Arbiscan ==="
echo "https://sepolia.arbiscan.io/address/$CONTRACT_ADDRESS"
echo ""
echo "=== Done ==="
