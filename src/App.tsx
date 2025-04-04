import { useState } from 'react';
import BenchmarkComparison from './components/BenchmarkComparison';
import FraudProofSimulator from './components/FraudProofSimulator';
import ZkProofVerification from './components/ZkProofVerification';
import NftGenerationSimulator from './components/NftGenerationSimulator';

function App() {
  const [account, setAccount] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [activeTab, setActiveTab] = useState<'benchmarks' | 'simulator' | 'zkproofs' | 'nfts'>('benchmarks');
  
  async function connectWallet() {
    if (!window.ethereum) {
      alert('Please install MetaMask to use this application');
      return;
    }
    
    try {
      setConnecting(true);
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      }) as string[];
      
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setConnecting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <header className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="mr-3 p-2 rounded-full bg-gradient-to-br from-blue-600 to-emerald-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-emerald-500">
                  ArbiProof
                </span>
                <span className="text-slate-300"> Simulator</span>
              </h1>
            </div>
            
            <div>
              {!account ? (
                <button
                  onClick={connectWallet}
                  disabled={connecting}
                  className="relative inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-lg hover:from-blue-700 hover:to-emerald-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
                >
                  {connecting ? 'Connecting...' : 'Connect Wallet'}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z" clipRule="evenodd" />
                  </svg>
                </button>
              ) : (
                <div className="flex items-center bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700">
                  <div className="h-3 w-3 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-slate-300 font-mono text-sm">
                    {account.substring(0, 6)}...{account.substring(account.length - 4)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </header>
        
        {/* Main content tabs */}
        <section>
          <div className="mb-6">
            <div className="flex flex-wrap space-x-0 sm:space-x-2 space-y-2 sm:space-y-0 rounded-xl bg-slate-800/20 p-1 backdrop-blur-sm border border-slate-700/50">
              <button
                onClick={() => setActiveTab('benchmarks')}
                className={`w-full sm:w-auto flex-grow rounded-lg py-3 px-4 text-base font-medium leading-5 transition-all duration-200 focus:outline-none
                  ${activeTab === 'benchmarks' 
                    ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`
                }
              >
                Benchmarks
              </button>
              <button
                onClick={() => setActiveTab('simulator')}
                className={`w-full sm:w-auto flex-grow rounded-lg py-3 px-4 text-base font-medium leading-5 transition-all duration-200 focus:outline-none
                  ${activeTab === 'simulator' 
                    ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`
                }
              >
                Fraud Proof Simulator
              </button>
              <button
                onClick={() => setActiveTab('zkproofs')}
                className={`w-full sm:w-auto flex-grow rounded-lg py-3 px-4 text-base font-medium leading-5 transition-all duration-200 focus:outline-none
                  ${activeTab === 'zkproofs' 
                    ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`
                }
              >
                ZK Proof Verification
              </button>
              <button
                onClick={() => setActiveTab('nfts')}
                className={`w-full sm:w-auto flex-grow rounded-lg py-3 px-4 text-base font-medium leading-5 transition-all duration-200 focus:outline-none
                  ${activeTab === 'nfts' 
                    ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`
                }
              >
                On-Chain NFTs
              </button>
            </div>
          </div>
          
          <div>
            {activeTab === 'benchmarks' && <BenchmarkComparison />}
            {activeTab === 'simulator' && <FraudProofSimulator account={account} />}
            {activeTab === 'zkproofs' && <ZkProofVerification />}
            {activeTab === 'nfts' && <NftGenerationSimulator account={account} />}
          </div>
        </section>
        
        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-slate-800 text-slate-400 text-sm text-center">
          <p className="mb-2">
            ArbiProof Simulator - Demonstrating the Power of Arbitrum Stylus
          </p>
          <p>
            Built for ETH Bucharest Hackathon 2023
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;