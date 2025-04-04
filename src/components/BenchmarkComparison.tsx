import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

interface BenchmarkData {
  operation: string;
  solidityGas: number;
  stylusGas: number;
  savingsPercentage: number;
}

const BenchmarkComparison: React.FC = () => {
  const benchmarkData: BenchmarkData[] = [
    { 
      operation: "Dispute Initialization", 
      solidityGas: 147235, 
      stylusGas: 63841, 
      savingsPercentage: 56.6 
    },
    { 
      operation: "Bisection Challenge", 
      solidityGas: 108493, 
      stylusGas: 31264, 
      savingsPercentage: 71.2 
    },
    { 
      operation: "Hash Verification", 
      solidityGas: 76841, 
      stylusGas: 21378, 
      savingsPercentage: 72.2 
    },
    { 
      operation: "State Transition", 
      solidityGas: 329725, 
      stylusGas: 84918, 
      savingsPercentage: 74.2 
    },
    { 
      operation: "Groth16 Verification", 
      solidityGas: 1245890, 
      stylusGas: 223457, 
      savingsPercentage: 82.1 
    },
    { 
      operation: "Black-Scholes Calc", 
      solidityGas: 815370, 
      stylusGas: 125630, 
      savingsPercentage: 84.6 
    }
  ];

  return (
    <div className="w-full bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold mb-8 text-white bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-500">
        Solidity vs Stylus Performance
      </h2>
      
      {/* Main chart */}
      <div className="bg-slate-800/50 p-6 rounded-xl shadow-inner mb-10">
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={benchmarkData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="operation" 
                angle={-45} 
                textAnchor="end" 
                height={80} 
                stroke="#94a3b8" 
                tick={{fill: '#94a3b8'}}
              />
              <YAxis 
                label={{ value: 'Gas Units', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} 
                domain={[0, 'dataMax']}
                tickFormatter={(value) => `${Math.round(value / 1000)}K`}
                stroke="#94a3b8"
                tick={{fill: '#94a3b8'}} 
              />
              <Tooltip 
                formatter={(value) => `${value.toLocaleString()} gas`} 
                contentStyle={{backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '0.5rem'}}
                itemStyle={{color: '#e2e8f0'}}
                labelStyle={{color: '#f8fafc'}}
              />
              <Legend wrapperStyle={{color: '#94a3b8'}} />
              <Bar 
                dataKey="solidityGas" 
                name="Solidity Gas" 
                fill="#f43f5e" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="stylusGas" 
                name="Stylus Gas" 
                fill="#06b6d4" 
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Savings percentage chart */}
      <div className="bg-slate-800/50 p-6 rounded-xl shadow-inner mb-10">
        <h3 className="text-xl font-bold mb-4 text-slate-200">Efficiency Improvements</h3>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={benchmarkData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="operation" stroke="#94a3b8" tick={{fill: '#94a3b8'}} />
              <YAxis 
                domain={[0, 100]}
                label={{ value: 'Gas Savings %', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} 
                stroke="#94a3b8"
                tick={{fill: '#94a3b8'}}
              />
              <Tooltip 
                formatter={(value) => `${value}%`}
                contentStyle={{backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '0.5rem'}}
                itemStyle={{color: '#e2e8f0'}}
                labelStyle={{color: '#f8fafc'}}
              />
              <Line 
                type="monotone" 
                dataKey="savingsPercentage" 
                name="Gas Savings" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#059669', strokeWidth: 2, r: 6 }}
                activeDot={{ fill: '#34d399', strokeWidth: 2, r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Cards section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {benchmarkData.map((data, index) => (
          <div 
            key={index} 
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 shadow-md border border-slate-700 hover:border-sky-500 transition-all duration-300"
          >
            <h4 className="font-semibold text-lg text-white mb-3">{data.operation}</h4>
            <div className="flex flex-col space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Solidity:</span>
                <span className="font-mono text-slate-200">{data.solidityGas.toLocaleString()} gas</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Stylus:</span>
                <span className="font-mono text-sky-400">{data.stylusGas.toLocaleString()} gas</span>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-700">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Savings:</span>
                  <span className="font-bold text-emerald-400">
                    {data.savingsPercentage}%
                  </span>
                </div>
                
                {/* Progress bar */}
                <div className="mt-2 w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full"
                    style={{ width: `${data.savingsPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Economic impact section */}
      <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-xl p-6 border border-blue-800/40">
        <h3 className="text-2xl font-bold mb-4 text-white">Economic Impact</h3>
        <p className="mb-4 text-slate-300">
          At 50 gwei gas price during network congestion periods:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800/60 p-5 rounded-lg border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-2">State Transition Operation</h4>
            <div className="flex items-center gap-4">
              <div className="flex-1 p-3 bg-red-900/30 rounded-md border border-red-700/30">
                <div className="text-red-400 text-sm">Solidity</div>
                <div className="text-2xl font-bold text-white">$0.82</div>
              </div>
              <div className="text-2xl text-slate-500">→</div>
              <div className="flex-1 p-3 bg-emerald-900/30 rounded-md border border-emerald-700/30">
                <div className="text-emerald-400 text-sm">Stylus</div>
                <div className="text-2xl font-bold text-white">$0.21</div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/60 p-5 rounded-lg border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-2">ZK-proof Verification</h4>
            <div className="flex items-center gap-4">
              <div className="flex-1 p-3 bg-red-900/30 rounded-md border border-red-700/30">
                <div className="text-red-400 text-sm">Solidity</div>
                <div className="text-2xl font-bold text-white">$3.11</div>
              </div>
              <div className="text-2xl text-slate-500">→</div>
              <div className="flex-1 p-3 bg-emerald-900/30 rounded-md border border-emerald-700/30">
                <div className="text-emerald-400 text-sm">Stylus</div>
                <div className="text-2xl font-bold text-white">$0.56</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 bg-blue-950/40 p-4 rounded-lg border border-blue-900/40">
          <p className="text-slate-200">
            For high-frequency operations like fraud proofs on Layer 2 systems, these 
            savings make previously impossible operations <span className="text-emerald-400 font-semibold">economically viable</span>, 
            enabling new classes of on-chain applications that were previously infeasible.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BenchmarkComparison;
