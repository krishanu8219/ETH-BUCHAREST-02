import { ethers } from 'ethers';

// Update the CONTRACT_ADDRESS constant with your deployed address
const CONTRACT_ADDRESS = '0x8f645e59e8b2e8c046bc733d2b85398845e98aaa';

export const ARBIPROOF_SIMULATOR_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "disputeId",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "challenger",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "defender",
        "type": "address"
      }
    ],
    "name": "DisputeInitiated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "disputeId",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "round",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "bisectionPoint",
        "type": "bytes32"
      }
    ],
    "name": "BisectionChallenge",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "disputeId",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "winner",
        "type": "address"
      }
    ],
    "name": "DisputeResolved",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "txHash",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "defender",
        "type": "address"
      }
    ],
    "name": "initiateDispute",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "disputeId",
        "type": "bytes32"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "disputeId",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "bisectionPoint",
        "type": "uint256"
      }
    ],
    "name": "submitBisectionChallenge",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "disputeId",
        "type": "bytes32"
      }
    ],
    "name": "resolveDispute",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];