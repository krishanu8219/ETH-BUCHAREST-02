export const ArbiProofABI = [
  "function initiate_dispute(bytes32 txHash, address defender) external payable returns (bytes32)",
  "function submit_bisection_challenge(bytes32 disputeId, uint256 bisectionPoint, bytes32 claimHash) external",
  "function resolve_dispute(bytes32 disputeId, bool challengerWon) external",
  "function benchmark_comprehensive() external returns (string[] memory, uint256[] memory)",
  "function dispute_exists(bytes32 disputeId) external view returns (bool)",
  "function hook_before_swap(bytes32 poolId, address sender, uint256 amountIn, address tokenIn) external returns (uint256)"
];