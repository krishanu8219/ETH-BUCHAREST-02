import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { ARBIPROOF_SIMULATOR_ABI } from '../contracts/ArbiProofSimulator';
import type { DisputeState, Transaction } from '../types';

// Using a mock address since we're running as POC
const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';

export function useArbiProof() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProvider = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error("MetaMask not installed");
    }
    
    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Check if we're on Arbitrum Stylus testnet (chain ID might be different, check docs)
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId !== '0x66eee') { // Replace with actual Stylus testnet chain ID
        throw new Error('Please connect to Arbitrum Stylus testnet');
      }
      
      return new ethers.BrowserProvider(window.ethereum);
    } catch (error) {
      console.error("Error connecting to MetaMask", error);
      throw error;
    }
  }, []);

  const initiateDispute = useCallback(async (transaction: Transaction): Promise<DisputeState> => {
    try {
      setIsConnecting(true);
      setError(null);

      // Use mock data for now since we don't have a deployed contract
      console.log("Would connect to contract at", CONTRACT_ADDRESS);
      console.log("Would initiate dispute for transaction", transaction.hash);
      console.log("Would use ABI:", ARBIPROOF_SIMULATOR_ABI);
      
      // Simulating a network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return mock data
      return {
        id: '0x' + Math.random().toString(16).slice(2, 10),
        status: 'pending',
        challenger: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        defender: transaction.to,
        currentRound: 0,
        totalRounds: 5,
        timestamp: Date.now(),
        steps: [],
        disputedTransaction: transaction
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initiate dispute';
      setError(errorMessage);
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const submitChallenge = useCallback(async (
    disputeId: string,
    bisectionPoint: number
  ): Promise<void> => {
    try {
      setIsConnecting(true);
      setError(null);

      console.log("Would submit challenge for dispute", disputeId, "at point", bisectionPoint);
      
      // Simulating a network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit challenge';
      setError(errorMessage);
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const resolveDispute = useCallback(async (disputeId: string): Promise<void> => {
    try {
      setIsConnecting(true);
      setError(null);

      console.log("Would resolve dispute", disputeId);
      
      // Simulating a network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to resolve dispute';
      setError(errorMessage);
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  return {
    initiateDispute,
    submitChallenge,
    resolveDispute,
    isConnecting,
    getProvider,
    error
  };
}