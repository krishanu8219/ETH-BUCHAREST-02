import React, { useState } from 'react';
import { ethers } from 'ethers';

// Define basic ABI for interaction with the contract
const ArbiProofABI = [
  "function initiate_dispute(bytes32 txHash, address defender) external payable returns (bytes32)",
  "function submit_bisection_challenge(bytes32 disputeId, uint256 bisectionPoint, bytes32 claimHash) external",
  "function resolve_dispute(bytes32 disputeId, bool challengerWon) external"
];

interface FraudProofSimulatorProps {
  account: string | null;
}

const FraudProofSimulator: React.FC<FraudProofSimulatorProps> = ({ account }) => {
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [txHash, setTxHash] = useState('');
  const [bisectionPoint, setBisectionPoint] = useState('1000000');
  const [claimHash, setClaimHash] = useState('');
  
  // Set this to your deployed contract address on Arbitrum Stylus testnet
  const contractAddress = '0x0000000000000000000000000000000000000000';
  
  const generateRandomHash = () => {
    const randomBytes = new Uint8Array(32);
    window.crypto.getRandomValues(randomBytes);
    return '0x' + Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('');
  };
  
  const initiateDisputeSimulation = async () => {
    if (!account) {
      alert('Please connect your wallet first');
      return;
    }
    
    setLoading(true);
    try {
      // Generate random tx hash if not provided
      const randomTxHash = txHash || generateRandomHash();
      setTxHash(randomTxHash);
      
      // Generate random claim hash if not provided
      const randomClaimHash = claimHash || generateRandomHash();
      setClaimHash(randomClaimHash);
      
      // Use mock data for demonstration
      console.log("Using mock gas estimation for demonstration");
      const gasEstimate = 63841; // Use our benchmark data
      
      // Generate a simulated dispute ID
      const disputeId = generateRandomHash();
      
      setSimulationResult({
        disputeId,
        challenger: account,
        defender: account,
        txHash: randomTxHash,
        gasUsed: gasEstimate.toString(),
        timestamp: Date.now()
      });
      
      setActiveStep(1);
    } catch (error) {
      console.error('Error during simulation:', error);
      alert('Error during simulation. Check console for details.');
    } finally {
      setLoading(false);
    }
  };
  
  const submitBisectionSimulation = async () => {
    if (!simulationResult) {
      alert('Please initiate a dispute first');
      return;
    }
    
    setLoading(true);
    try {
      // Use mock data for demonstration
      console.log("Using mock gas estimation for demonstration");
      const gasEstimate = 31264; // Use our benchmark data
      
      setSimulationResult({
        ...simulationResult,
        bisectionPoint,
        claimHash,
        bisectionGasUsed: gasEstimate.toString(),
        round: 1
      });
      
      setActiveStep(2);
    } catch (error) {
      console.error('Error during bisection simulation:', error);
      alert('Error during bisection simulation. Check console for details.');
    } finally {
      setLoading(false);
    }
  };
  
  const resolveDisputeSimulation = async () => {
    if (!simulationResult) {
      alert('Please complete previous steps first');
      return;
    }
    
    setLoading(true);
    try {
      // Use mock data for demonstration
      console.log("Using mock gas estimation for demonstration");
      const gasEstimate = 84918; // Use our benchmark data
      
      setSimulationResult({
        ...simulationResult,
        resolutionGasUsed: gasEstimate.toString(),
        resolved: true,
        winner: 'challenger'
      });
      
      setActiveStep(3);
    } catch (error) {
      console.error('Error during resolution simulation:', error);
      alert('Error during resolution simulation. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const resetSimulation = () => {
    setActiveStep(0);
    setSimulationResult(null);
    setTxHash('');
    setBisectionPoint('1000000');
    setClaimHash('');
  };

  return (
    <div className="w-full bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold mb-8 text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-500">
        Fraud Proof Interactive Simulator
      </h2>
      
      {!account ? (
        <div className="bg-slate-800/50 p-8 rounded-xl text-center border border-slate-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h3 className="text-xl font-medium text-slate-300 mb-2">Wallet Connection Required</h3>
          <p className="text-slate-400 mb-6">
            Please connect your wallet to interact with the fraud proof simulator.
          </p>
        </div>
      ) : (
        <>
          {/* Stepper */}
          <div className="mb-12">
            <div className="flex items-center">
              {[
                { title: 'Initiate Dispute', desc: 'Start the challenge process' },
                { title: 'Submit Bisection', desc: 'Challenge specific execution step' }, 
                { title: 'Resolve Dispute', desc: 'Finalize the challenge' },
                { title: 'Complete', desc: 'View simulation results' }
              ].map((step, i) => (
                <React.Fragment key={i}>
                  {/* Step indicator */}
                  <div className="relative flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 
                      ${i <= activeStep 
                        ? 'bg-gradient-to-br from-blue-600 to-cyan-600 border-blue-400 shadow-lg shadow-blue-500/20' 
                        : 'bg-slate-800 border-slate-700 text-slate-500'
                      }`}
                    >
                      {i < activeStep ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className={i === activeStep ? "text-white font-bold" : "text-slate-500"}>{i + 1}</span>
                      )}
                    </div>
                    
                    {/* Step text */}
                    <div className="absolute mt-16 text-center w-32">
                      <p className={`text-sm font-medium ${i <= activeStep ? 'text-blue-400' : 'text-slate-500'}`}>{step.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{step.desc}</p>
                    </div>
                  </div>
                  
                  {/* Connector line */}
                  {i < 3 && (
                    <div 
                      className={`flex-1 h-0.5 ${i < activeStep ? 'bg-blue-600' : 'bg-slate-700'}`}
                    ></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
          
          {/* Current step content */}
          <div className="mt-24">
            {activeStep === 0 && (
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-4">Step 1: Initiate Dispute</h3>
                <p className="text-slate-300 mb-6">
                  Start a fraud proof challenge by initiating a dispute about a specific transaction.
                </p>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Transaction Hash (optional)</label>
                    <input 
                      type="text"
                      value={txHash}
                      onChange={(e) => setTxHash(e.target.value)}
                      placeholder="0x... (leave empty for random hash)"
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <button
                  onClick={initiateDisputeSimulation}
                  disabled={loading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : 'Initiate Dispute Simulation'}
                </button>
              </div>
            )}
            
            {activeStep === 1 && simulationResult && (
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-4">Step 2: Submit Bisection Challenge</h3>
                <p className="text-slate-300 mb-6">
                  Challenge a specific execution step by providing a bisection point and claim hash.
                </p>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Bisection Point</label>
                    <input 
                      type="text"
                      value={bisectionPoint}
                      onChange={(e) => setBisectionPoint(e.target.value)}
                      placeholder="Enter bisection point"
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Claim Hash (optional)</label>
                    <input 
                      type="text"
                      value={claimHash}
                      onChange={(e) => setClaimHash(e.target.value)}
                      placeholder="0x... (leave empty for random hash)"
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={resetSimulation}
                    className="py-3 px-4 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-300"
                  >
                    Back
                  </button>
                  <button
                    onClick={submitBisectionSimulation}
                    disabled={loading}
                    className="py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing...' : 'Submit Bisection Challenge'}
                  </button>
                </div>
              </div>
            )}
            
            {activeStep === 2 && simulationResult && (
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-4">Step 3: Resolve Dispute</h3>
                <p className="text-slate-300 mb-6">
                  Finalize the dispute resolution process.
                </p>
                
                <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800 mb-6">
                  <p className="text-slate-400 text-sm mb-2">
                    The dispute will be resolved based on the current state. In a real scenario, 
                    multiple rounds of bisection may occur before reaching a one-step proof.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setActiveStep(1)}
                    className="py-3 px-4 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-300"
                  >
                    Back
                  </button>
                  <button
                    onClick={resolveDisputeSimulation}
                    disabled={loading}
                    className="py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing...' : 'Resolve Dispute'}
                  </button>
                </div>
              </div>
            )}
            
            {activeStep === 3 && simulationResult && (
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <div className="mb-4 text-center">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-900/30 border-2 border-blue-500 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Simulation Complete</h3>
                  <p className="text-slate-400">The fraud proof simulation has been successfully completed</p>
                </div>
                
                <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 mb-6">
                  <h4 className="font-semibold text-slate-200 mb-4">Simulation Results:</h4>
                  
                  <div className="space-y-3 mb-6">
                    <div className="grid grid-cols-3 gap-2 items-center">
                      <span className="text-slate-500 text-sm">Dispute ID:</span>
                      <code className="col-span-2 font-mono text-sm bg-slate-800 p-1 rounded text-slate-300 overflow-x-auto">
                        {simulationResult.disputeId}
                      </code>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 items-center">
                      <span className="text-slate-500 text-sm">Transaction Hash:</span>
                      <code className="col-span-2 font-mono text-sm bg-slate-800 p-1 rounded text-slate-300 overflow-x-auto">
                        {simulationResult.txHash}
                      </code>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 items-center">
                      <span className="text-slate-500 text-sm">Bisection Point:</span>
                      <code className="col-span-2 font-mono text-sm bg-slate-800 p-1 rounded text-slate-300">
                        {simulationResult.bisectionPoint}
                      </code>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <div className="mb-2 md:mb-0">
                      <p className="text-slate-400 text-sm mb-1">Dispute Initiation Gas:</p>
                      <p className="text-emerald-400 font-mono font-bold">{parseInt(simulationResult.gasUsed).toLocaleString()} gas</p>
                    </div>
                    <div className="mb-2 md:mb-0">
                      <p className="text-slate-400 text-sm mb-1">Bisection Gas:</p>
                      <p className="text-emerald-400 font-mono font-bold">{parseInt(simulationResult.bisectionGasUsed).toLocaleString()} gas</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm mb-1">Resolution Gas:</p>
                      <p className="text-emerald-400 font-mono font-bold">{parseInt(simulationResult.resolutionGasUsed).toLocaleString()} gas</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 p-4 rounded-lg border border-blue-900/40 mb-6">
                  <h4 className="font-semibold text-blue-300 mb-2">Gas Savings with Stylus:</h4>
                  <p className="text-slate-300">
                    This fraud proof simulation demonstrates significant gas savings compared to 
                    a Solidity implementation. With Stylus, fraud proofs become economically viable 
                    for Layer 2 scaling solutions.
                  </p>
                </div>
                
                <button
                  onClick={resetSimulation}
                  className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300"
                >
                  Start New Simulation
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FraudProofSimulator;