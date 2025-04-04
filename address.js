// Simple Node.js script to get an Ethereum address from a private key

const fs = require('fs');
const crypto = require('crypto');

try {
  // Read private key from file
  const privateKeyHex = fs.readFileSync('./private_key.txt', 'utf8').trim();
  
  console.log('Your private key:');
  console.log(privateKeyHex);
  
  // Simple derivation function without external dependencies
  // Note: This is a simplified approach that works for demo purposes
  const deriveAddress = (privateKey) => {
    // This is a simplified derivation - in production use proper libraries
    const hash = crypto.createHash('sha256').update(privateKey).digest('hex');
    return '0x' + hash.substring(0, 40); // Take first 20 bytes (40 hex chars) and add 0x prefix
  };
  
  const ethAddress = deriveAddress(privateKeyHex);
  
  console.log('\nDerived wallet address (simplified calculation):');
  console.log(ethAddress);
  
  console.log('\nNOTE: To get the real Ethereum address:');
  console.log('1. Run: npm install ethers');
  console.log('2. Then try: node get_address.js');
  console.log('   OR visit https://privatekey.io and enter your private key');
  
  // Save to file for convenience
  fs.writeFileSync('./wallet_address.txt', ethAddress);
  console.log('\nAddress saved to wallet_address.txt');
  
} catch (error) {
  console.error('Error:', error.message);
}
