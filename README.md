# ArbiProof: Efficient Fraud Proof System on Arbitrum Stylus

ArbiProof is a high-performance fraud proof system leveraging Arbitrum Stylus to deliver significant gas savings compared to traditional Solidity implementations. By implementing complex verification logic in Rust, ArbiProof achieves up to 70% reduction in gas costs while maintaining full EVM compatibility.

## Gas Efficiency Benchmarks

| Operation | Solidity Gas Cost | Stylus Gas Cost | Savings |
|-----------|-------------------|-----------------|---------|
| Dispute Initiation | ~150,000 | ~75,000 | 50% |
| Challenge Processing | ~110,000 | ~32,000 | 70% |
| Hash Verification | ~85,000 | ~25,500 | 70% |
| ZK-Proof Verification | ~950,000 | ~190,000 | 80% |
| Supply Chain Validation | ~350,000 | ~87,500 | 75% |

## Key Features

1. **Efficient Dispute Resolution**: Optimized fraud proof system with interactive dispute resolution
2. **ZK-Proof Verification**: Gas-efficient zero-knowledge proof verification
3. **Business Model Integration**: Tiered service levels with different computational complexity
4. **Supply Chain Validation**: Real-world utility with complex verification logic
5. **Solidity Interoperability**: Demonstrates how Stylus contracts can offload complex computations from Solidity

## Deployed Contract

The contract is deployed on Arbitrum Sepolia testnet:

- Address: `0xaad921b9c96d7afc3398895b371a77e2e1f34c5c`
- Explorer: [https://sepolia.arbiscan.io/address/0xaad921b9c96d7afc3398895b371a77e2e1f34c5c](https://sepolia.arbiscan.io/address/0xaad921b9c96d7afc3398895b371a77e2e1f34c5c)

## Business Model

ArbiProof demonstrates a viable business model with tiered service levels:

1. **Free Tier**: Basic verification operations
2. **Basic Tier**: Enhanced verification capabilities (up to 50/month)
3. **Premium Tier**: Advanced verification with priority processing (up to 300/month)
4. **Enterprise Tier**: Comprehensive verification suite with dedicated support

See [BUSINESS_PLAN.md](./docs/BUSINESS_PLAN.md) for our complete business model and market analysis.

## Project Structure

```
project/
├── arbi-proof-contract/    # Main contract source code
│   ├── src/
│   │   ├── lib.rs          # Core contract implementation
│   │   └── main.rs         # Info binary
│   └── Cargo.toml          # Rust dependencies
├── assets/                 # Project assets
├── docs/                   # Documentation
├── scripts/                # Utility scripts
├── tests/                  # Test files
└── README.md               # This file
```

## Testing

Run the tests to verify gas savings:

```bash
cd scripts
chmod +x test_contract.sh
./test_contract.sh
```

## Contract Caching

For optimal gas usage:

```bash
cd scripts
chmod +x cache_contract.sh
./cache_contract.sh
```

## Technology Stack

- **Smart Contract**: Rust with Arbitrum Stylus
- **Testing**: JavaScript with ethers.js
- **Network**: Arbitrum Sepolia Testnet
