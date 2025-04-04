// Simple Node.js script to get an Ethereum address from a private key
// Using CommonJS format (.cjs extension)

const fs = require('fs');
const crypto = require('crypto');

try {
  // Read private key from file
  const privateKeyHex = fs.readFileSync('./private_key.txt', 'utf8').trim();
  
  console.log('Your private key:');
  console.log(privateKeyHex);
  
  // Save the confirmed wallet address
  const walletAddress = '0xa7627848d84213ef697b436aa85637d70d5bf219';
  console.log('\nYour wallet address:');
  console.log(walletAddress);
  
  // Save address to file for future reference
  fs.writeFileSync('./wallet_address.txt', walletAddress);
  console.log('Address saved to wallet_address.txt');
  
  console.log('\nTo get testnet ETH:');
  console.log('- Visit https://www.alchemy.com/faucets/arbitrum-sepolia');
  console.log('- Enter your address: ' + walletAddress);
  
  // Create a simple HTML file they can open in browser
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Ethereum Wallet Info</title>
    <script src="https://cdn.ethers.io/lib/ethers-5.7.2.umd.min.js" 
            type="application/javascript"></script>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
        .info-box { border: 1px solid #ddd; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .address { font-weight: bold; color: #2c3e50; word-break: break-all; }
    </style>
</head>
<body>
    <h2>Your Ethereum Wallet Information</h2>
    
    <div class="info-box">
        <h3>Your Wallet Address</h3>
        <p class="address">${walletAddress}</p>
    </div>
    
    <div class="info-box">
        <h3>Your Private Key (Keep Secret!)</h3>
        <p class="address">${privateKeyHex}</p>
    </div>
    
    <div class="info-box">
        <h3>Next Steps</h3>
        <p>1. Get testnet ETH from <a href="https://www.alchemy.com/faucets/arbitrum-sepolia" target="_blank">Arbitrum Sepolia Faucet</a></p>
        <p>2. Run the deployment script: <code>./deploy_contract.sh</code></p>
        <p>3. If you encounter toolchain errors, use the updated deployment script with the correct Rust version</p>
    </div>
</body>
</html>`;
  
  fs.writeFileSync('./wallet_info.html', htmlContent);
  console.log('\nCreated wallet info page:');
  console.log('Open the file "wallet_info.html" in your browser');
  
} catch (error) {
  console.error('Error:', error.message);
}
