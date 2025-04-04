import React, { useState } from 'react';
import { ChevronRight, AlertCircle, CheckCircle2, Clock, Info, Terminal } from 'lucide-react';
import type { DisputeState, SimulationStep, Transaction, ExecutionStep } from '../types';

// Mock data since the hook isn't fully implemented
const sampleExecutionTrace: ExecutionStep[] = [
  {
    step: 1,
    opcode: 'PUSH1',
    stackState: ['0x60'],
    memoryState: '0x0000',
    description: 'Push 1 byte to stack'
  },
  {
    step: 2,
    opcode: 'MSTORE',
    stackState: ['0x60', '0x00'],
    memoryState: '0x6000',
    description: 'Store value in memory'
  }
];

const sampleTransaction: Transaction = {
  hash: '0xabcd1234',
  from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  to: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
  value: '1.5 ETH',
  data: '0x60806040',
  executionTrace: sampleExecutionTrace
};

const initialDisputeState: DisputeState = {
  id: '0x1234',
  status: 'pending',
  challenger: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  defender: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
  currentRound: 0,
  totalRounds: 5,
  timestamp: Date.now(),
  steps: [],
  disputedTransaction: sampleTransaction
};

const simulationSteps = [
  {
    description: 'Dispute Initiated',
    explanation: 'The challenger claims that a specific transaction execution is incorrect and stakes tokens to initiate the dispute.'
  },
  {
    description: 'Bisection Challenge Round',
    explanation: 'The disputed computation is divided into two parts. The challenger identifies which half contains the alleged error.'
  },
  {
    description: 'Interactive Bisection',
    explanation: 'The process continues by repeatedly dividing the disputed segment until a single step is isolated.'
  },
  {
    description: 'Single Step Verification',
    explanation: 'The final disputed step is verified on-chain to determine if it was executed correctly.'
  },
  {
    description: 'Dispute Resolution',
    explanation: 'The dispute is resolved based on the single step verification. The correct party receives the staked tokens.'
  }
];

export default function DisputeSimulator() {
  const [dispute, setDispute] = useState<DisputeState>(initialDisputeState);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showExplanation, setShowExplanation] = useState<string | null>(null);
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  
  // Mock implementation since useArbiProof isn't fully implemented
  const initiateDispute = async () => {
    return { ...initialDisputeState, status: 'in_progress' };
  };
  
  const submitChallenge = async () => {
    // Mock implementation
    return true;
  };
  
  const resolveDispute = async () => {
    // Mock implementation
    return true;
  };
  
  const error = null;
  const isConnecting = false;

  const startSimulation = async () => {
    try {
      setIsSimulating(true);
      
      // Simulate initiate dispute
      const newDispute = await initiateDispute();
      setDispute(prev => ({ ...prev, ...newDispute, status: 'in_progress' }));
      
      for (let round = 1; round <= dispute.totalRounds; round++) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate submitting a challenge
        await submitChallenge();
        
        const newStep: SimulationStep = {
          id: `step-${round}`,
          round,
          description: simulationSteps[round - 1]?.description || `Round ${round}`,
          explanation: simulationSteps[round - 1]?.explanation || '',
          status: 'completed',
          timestamp: Date.now()
        };
        
        setDispute(prev => ({
          ...prev,
          currentRound: round,
          steps: [...prev.steps, newStep]
        }));
      }
      
      // Resolve the dispute
      await resolveDispute();
      setDispute(prev => ({ ...prev, status: 'resolved' }));
    } catch (err) {
      console.error('Simulation failed:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Interactive Fraud Proof Simulator</h2>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Current Dispute</h3>
              <p className="text-sm text-gray-600">ID: {dispute.id}</p>
            </div>
            <div className="flex items-center gap-2">
              {dispute.status === 'pending' && (
                <Clock className="w-5 h-5 text-gray-500" />
              )}
              {dispute.status === 'in_progress' && (
                <AlertCircle className="w-5 h-5 text-yellow-500" />
              )}
              {dispute.status === 'resolved' && (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              )}
              <span className="capitalize">{dispute.status}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Challenger</p>
              <p className="font-mono text-sm">{dispute.challenger}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Defender</p>
              <p className="font-mono text-sm">{dispute.defender}</p>
            </div>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Terminal className="w-5 h-5 text-gray-700" />
              <h4 className="font-semibold">Disputed Transaction</h4>
            </div>
            <div className="space-y-2 font-mono text-sm">
              <p>Hash: {dispute.disputedTransaction.hash}</p>
              <p>From: {dispute.disputedTransaction.from}</p>
              <p>To: {dispute.disputedTransaction.to}</p>
              <p>Value: {dispute.disputedTransaction.value}</p>
              <div className="mt-2">
                <p className="font-semibold mb-1">Execution Trace:</p>
                <div className="bg-gray-100 p-2 rounded">
                  {dispute.disputedTransaction.executionTrace.map((step, index) => (
                    <div 
                      key={index}
                      className={`p-2 cursor-pointer ${selectedStep === index ? 'bg-blue-100' : ''}`}
                      onClick={() => setSelectedStep(index)}
                    >
                      <code>{step.opcode} - {step.description}</code>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative pt-4">
            <div className="flex items-center mb-4">
              <div className="flex-1">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${(dispute.currentRound / dispute.totalRounds) * 100}%` }}
                  />
                </div>
              </div>
              <span className="ml-4 text-sm">
                Round {dispute.currentRound} of {dispute.totalRounds}
              </span>
            </div>
            
            <div className="space-y-4">
              {dispute.steps.map((step) => (
                <div 
                  key={step.id}
                  className="relative group"
                >
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <ChevronRight className="w-5 h-5 text-blue-500 mr-3" />
                    <div className="flex-1">
                      <p className="font-medium">{step.description}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(step.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowExplanation(showExplanation === step.id ? null : step.id)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Info className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  {showExplanation === step.id && (
                    <div className="mt-2 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-900">{step.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <button
          onClick={startSimulation}
          disabled={isSimulating || isConnecting || dispute.status === 'resolved'}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSimulating ? 'Simulating...' : isConnecting ? 'Connecting...' : 'Start Simulation'}
        </button>
      </div>
    </div>
  );
}