const { ethers } = require('ethers');
const fs = require('fs');

// Contract details
const CONTRACT_ADDRESS = '0xaad921b9c96d7afc3398895b371a77e2e1f34c5c';
// Simplified ABI with the main functions we need to test
const CONTRACT_ABI = [
  "function run_all_benchmarks() external returns ()",
  "function benchmark_comparison() external returns (string[], uint256[], uint256[], uint256[])",
  "function benchmark_zk_verification() external returns (uint256)",
  "function business_tier_service(uint256 tier) external returns (uint256, string)",
  "function interop_demonstration(uint256 opType, bytes32 input) external returns (uint256, bytes32)",
  "function validate_supply_chain(bytes32 productId, bytes32[] calldata checkpoints) external returns (bool)",
  "function get_benchmark_data(string calldata operation) external view returns (uint256)"
];

async function main() {
  try {
    console.log("ArbiProof Contract Test Script");
    console.log("==============================");
    console.log(`Testing contract at: ${CONTRACT_ADDRESS}`);
    
    // Connect to Arbitrum Sepolia
    const provider = new ethers.providers.JsonRpcProvider('https://sepolia-rollup.arbitrum.io/rpc');
    
    // Read wallet from private key
    let wallet;
    try {
      const privateKey = fs.readFileSync('./private_key.txt', 'utf8').trim();
      wallet = new ethers.Wallet(privateKey, provider);
      console.log(`Connected with wallet: ${wallet.address}`);
    } catch (err) {
      console.error("Error loading wallet:", err.message);
      console.error("Please ensure private_key.txt exists in the current directory");
      process.exit(1);
    }
    
    // Connect to contract
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);
    
    // Execute tests
    console.log("\nRunning Tests:");
    
    // Test 1: Run all benchmarks
    console.log("\n1. Running all benchmarks...");
    try {
      const tx = await contract.run_all_benchmarks();
      await tx.wait();
      console.log("✅ All benchmarks completed successfully");
    } catch (err) {
      console.error("❌ Error running benchmarks:", err.message);
    }
    
    // Test 2: Run benchmark comparison
    console.log("\n2. Comparing Stylus vs Solidity gas usage...");
    try {
      const [operations, stylusCosts, solidityCosts, savings] = await contract.benchmark_comparison();
      
      console.log("\nBenchmark Results:");
      console.log("=================");
      console.log("Operation | Stylus Gas | Solidity Gas | Savings (%)");
      console.log("-------------------------------------------------");
      
      for (let i = 0; i < operations.length; i++) {
        console.log(`${operations[i]} | ${stylusCosts[i].toString()} | ${solidityCosts[i].toString()} | ${savings[i].toString()}%`);
      }
      
      // Calculate average savings
      const avgSavings = savings.reduce((a, b) => a.add(b), ethers.BigNumber.from(0))
                               .div(ethers.BigNumber.from(savings.length));
      console.log(`\nAverage Gas Savings: ${avgSavings.toString()}%`);
      
    } catch (err) {
      console.error("❌ Error running benchmark comparison:", err.message);
    }
    
    // Test 3: Business Tier Service
    console.log("\n3. Testing Business Tier Services...");
    for (let tier = 0; tier <= 3; tier++) {
      try {
        const [gasUsed, response] = await contract.business_tier_service(tier);
        console.log(`Tier ${tier}: ${response} (Gas Used: ${gasUsed.toString()})`);
      } catch (err) {
        console.error(`❌ Error testing tier ${tier}:`, err.message);
      }
    }
    
    console.log("\nTests completed. Check results above for details.");
    
  } catch (err) {
    console.error("Error in test script:", err);
  }
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error("Unhandled error:", err);
    process.exit(1);
  });
