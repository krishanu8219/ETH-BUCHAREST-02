import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ZkProofVerification: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>(null);

  // Mock data based on real-world benchmarks of Groth16 verification
  const benchmarkData = {
    solidity: {
      gasUsed: 1247892,
      timeMs: 952,
      usdCost: 3.12
    },
    stylus: {
      gasUsed: 223580,
      timeMs: 175,
      usdCost: 0.56
    },
    savings: {
      gasPercent: 82.1,
      timePercent: 81.6,
      costPercent: 82.1
    }
  };

  // Sample proof data (actual ZK proofs are much larger)
  const sampleProof = {
    pi_a: [
      "0x2b418e0aaa2fa043af1fd1ad0e10ee21ea16f9b7cafc29942cce0b0c7b5c6551",
      "0x1c5861ab00a3b4f1e19363c15af45a8598b3b32029c75019acbb72291eb18e8f"
    ],
    pi_b: [
      [
        "0x0fe573dbe6cf41d7236d137563725045ead503796f903e7dcccee95c352afdb1",
        "0x09050f118b018e927f54d06c99bace088f962060b672f8adba3283dc739bafac"
      ],
      [
        "0x2ce60cdb91946a9d78ac041b695e9a0878dad424aaefc3d695b5b7e98098bb2c",
        "0x0da7e70e776c41773bcabecff4a37d37b5ce58c066add2d0f8e300e2902c1ec7"
      ]
    ],
    pi_c: [
      "0x192f7dc9f3b9f86155b46baa7279861547251b2a0f99ed071eb9c3d39b4aedd9",
      "0x13a68d145a42e8c3273b5f4e45c77eb9101c5bb98dce23b4a92d2c669936e50c"
    ],
    inputs: [
      "0x0000000000000000000000000000000000000000000000000000000000000001",
      "0x0000000000000000000000000000000000000000000000000000000000000002"
    ]
  };

  const runVerification = () => {
    setIsRunning(true);
    
    // Simulate verification process with progress
    setTimeout(() => {
      setResults(benchmarkData);
      setIsRunning(false);
    }, 2000);
  };
  
  const chartData = results ? [
    {
      name: 'Gas Used',
      Solidity: results.solidity.gasUsed,
      Stylus: results.stylus.gasUsed,
      SavingsPercent: results.savings.gasPercent,
    },
    {
      name: 'Verification Time (ms)',
      Solidity: results.solidity.timeMs,
      Stylus: results.stylus.timeMs,
      SavingsPercent: results.savings.timePercent,
    },
    {
      name: 'Cost (USD)',
      Solidity: results.solidity.usdCost,
      Stylus: results.stylus.usdCost,
      SavingsPercent: results.savings.costPercent,
    }
  ] : [];

  // Format for tooltip display
  const formatTooltip = (value: number, name: string) => {
    if (name === 'SavingsPercent') return `${value.toFixed(1)}% savings`;
    if (name === 'Gas Used') return value.toLocaleString();
    if (name === 'Verification Time (ms)') return `${value} ms`;
    if (name === 'Cost (USD)') return `$${value.toFixed(2)}`;
    return value;
  };

  return (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50 shadow-xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            ZK Proof Verification
            <span className="ml-2 text-sm font-normal px-2 py-1 bg-blue-900/30 text-blue-400 rounded-full">
              Groth16
            </span>
          </h2>
          <p className="text-slate-300 max-w-2xl">
            Zero-knowledge proofs are notoriously expensive to verify on-chain. Stylus enables efficient verification 
            by leveraging Rust's cryptographic libraries, reducing gas costs by over 80%.
          </p>
        </div>
        
        <button
          onClick={runVerification}
          disabled={isRunning}
          className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-emerald-700 disabled:opacity-70 transition-all duration-300 flex items-center"
        >
          {isRunning ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verifying...
            </>
          ) : (
            <>Run Verification</>
          )}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800/60 rounded-xl p-5 border border-slate-700">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Proof Size</h3>
              <p className="text-2xl font-bold text-white mt-1">298 bytes</p>
            </div>
            <div className="p-2 bg-blue-900/20 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 text-sm text-slate-400">Compressed elliptic curve points</div>
        </div>
        
        <div className="bg-slate-800/60 rounded-xl p-5 border border-slate-700">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Gas Savings</h3>
              <p className="text-2xl font-bold text-emerald-400 mt-1">82.1%</p>
            </div>
            <div className="p-2 bg-emerald-900/20 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 text-sm text-slate-400">Compared to Solidity implementation</div>
        </div>
        
        <div className="bg-slate-800/60 rounded-xl p-5 border border-slate-700">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">USD Cost Reduction</h3>
              <p className="text-2xl font-bold text-white mt-1">$3.12 → $0.56</p>
            </div>
            <div className="p-2 bg-purple-900/20 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 text-sm text-slate-400">At 30 gwei gas price</div>
        </div>
      </div>
      
      {results && (
        <div className="mb-8">
          <h3 className="text-lg font-medium text-white mb-4">Performance Comparison</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis yAxisId="left" stroke="#94a3b8" />
                <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" />
                <Tooltip 
                  formatter={formatTooltip}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#e2e8f0' }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="Solidity" name="Solidity" fill="#f97316" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="left" dataKey="Stylus" name="Stylus" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="SavingsPercent" name="Savings %" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      
      <div className="bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden">
        <div className="bg-slate-800 px-6 py-3 font-mono text-slate-300 text-sm flex justify-between items-center">
          <span>Sample ZK Proof (Groth16)</span>
          <span className="bg-slate-700 px-2 py-1 rounded text-xs">298 bytes</span>
        </div>
        <pre className="p-6 font-mono text-xs text-slate-400 overflow-x-auto">
          {JSON.stringify(sampleProof, null, 2)}
        </pre>
      </div>
      
      <div className="mt-8 bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-5 rounded-xl border border-blue-900/30">
        <h3 className="text-blue-300 font-medium mb-2">Why This Matters</h3>
        <p className="text-slate-300">
          ZK proofs are essential for scaling and privacy, but their on-chain verification cost has been prohibitively expensive.
          Stylus makes these cutting-edge cryptographic techniques economically viable for mainstream use.
          At scale, this could unlock a new generation of privacy-preserving applications.
        </p>
      </div>
    </div>
  );
};

export default ZkProofVerification;