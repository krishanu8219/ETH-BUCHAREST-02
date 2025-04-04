// Simple Node.js script to get an Ethereum address from a private key

const fs = require('fs');
const crypto = require('crypto');
// These libraries need to be installed first via npm
try {
  const secp256k1 = require('secp256k1');
  const keccak256 = require('keccak256');

  try {
    // Read private key from file
    const privateKeyHex = fs.readFileSync('./private_key.txt', 'utf8').trim();
    const privateKey = Buffer.from(privateKeyHex, 'hex');
    
    // Ensure the private key is valid
    if (!secp256k1.privateKeyVerify(privateKey)) {
      throw new Error('Invalid private key');
    }
    
    // Get public key
    const publicKey = secp256k1.publicKeyCreate(privateKey, false).slice(1);
    
    // Generate address
    const address = keccak256(publicKey).slice(-20);
    
    // Format as ETH address (0x prefix + hex)
    const ethAddress = '0x' + address.toString('hex');
    
    console.log('Your wallet address:');
    console.log(ethAddress);
    
    // Save to file for convenience
    fs.writeFileSync('./wallet_address.txt', ethAddress);
    console.log('Address saved to wallet_address.txt');
    
    console.log('\nUse this address to get testnet ETH from:');
    console.log('https://www.alchemy.com/faucets/arbitrum-sepolia');
  } catch (error) {
    console.error('Error:', error.message);
  }
} catch (requireError) {
  console.error('Required libraries not installed.');
  console.error('\nTo run this script:');
  console.error('1. Install npm if not already installed');
  console.error('2. Run: npm install secp256k1 keccak256');
  console.error('3. Run: node get_address.js');
  console.error('\nAlternative methods to get your address:');
  console.error('- Use MetaMask: Import your private key to see the address');
  console.error('- Use MyEtherWallet: https://www.myetherwallet.com');
  console.error('- Try Vanity-ETH tool: https://vanity-eth.tk/');
  console.error('- Use EthToolBox: https://eth-toolbox.com/');
  console.error('- Use ethers.js in a browser console: ');
  console.error('  new ethers.Wallet("0x" + YOUR_PRIVATE_KEY).address');
  
  // Create simple HTML file as a fallback
  try {
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Get ETH Address</title>
    <script src="https://cdn.ethers.io/lib/ethers-5.7.2.umd.min.js" 
            type="application/javascript"></script>
</head>
<body>
    <h2>Get Ethereum Address from Private Key</h2>
    <p>Your private key: <span id="privkey"></span></p>
    <button onclick="getAddress()">Get Address</button>
    <p>Your address: <span id="address"></span></p>
    
    <script>
        document.getElementById("privkey").textContent = "${fs.readFileSync('./private_key.txt', 'utf8').trim()}";
        
        function getAddress() {
            try {
                const privateKey = document.getElementById("privkey").textContent.trim();
                const wallet = new ethers.Wallet("0x" + privateKey);
                document.getElementById("address").textContent = wallet.address;
            } catch(e) {
                document.getElementById("address").textContent = "Error: " + e.message;
            }
        }
    </script>
</body>
</html>`;
    
    fs.writeFileSync('./get_address.html', htmlContent);
    console.error('- Created get_address.html - open this file in a browser to get your address');
  } catch (writeError) {
    // Ignore HTML file creation errors
  }
  
  const privateKeyHex = fs.readFileSync('./private_key.txt', 'utf8').trim();
  console.log('\nYour private key for reference:');
  console.log(privateKeyHex);
}
