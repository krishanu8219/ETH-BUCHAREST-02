// Simple test script to interact with your deployed contract
const { ethers } = require('ethers');
const fs = require('fs');

// Read contract ABI (you'll need to generate this if you don't have it)
const contractABI = require('./contract_abi.json');
const contractAddress = '0x8f645e59e8b2e8c046bc733d2b85398845e98aaa';

async function main() {
  try {
    // Connect to Arbitrum Sepolia
    const provider = new ethers.providers.JsonRpcProvider('https://sepolia-rollup.arbitrum.io/rpc');
    
    // Read private key (be careful with this in production!)
    const privateKey = fs.readFileSync('./private_key.txt', 'utf8').trim();
    const wallet = new ethers.Wallet(privateKey, provider);
    
    // Connect to the contract
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);
    
    // Example: Call a read-only function (adjust based on your contract)
    console.log('Checking contract...');
    // Replace with your actual contract function
    // const result = await contract.someFunction();
    // console.log('Result:', result);
    
    console.log('Contract interaction complete!');
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
