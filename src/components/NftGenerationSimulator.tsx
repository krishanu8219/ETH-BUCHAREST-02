import React, { useState, useEffect } from 'react';

interface NftGenerationSimulatorProps {
  account: string | null;
}

interface NFTAttribute {
  trait_type: string;
  value: string;
}

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: NFTAttribute[];
}

const NftGenerationSimulator: React.FC<NftGenerationSimulatorProps> = ({ account }) => {
  const [loading, setLoading] = useState(false);
  const [minting, setMinting] = useState(false);
  const [generatedNft, setGeneratedNft] = useState<NFTMetadata | null>(null);
  const [complexity, setComplexity] = useState<'low' | 'medium' | 'high'>('medium');
  const [gasEstimates, setGasEstimates] = useState({
    solidity: 0,
    stylus: 0,
    savings: 0
  });
  const [selectedTraits, setSelectedTraits] = useState({
    background: 'Nebula',
    character: 'Astronaut',
    accessory: 'Laser Sword',
    special: 'Glowing Aura'
  });

  const backgroundOptions = ['Nebula', 'Cyberpunk City', 'Abstract Patterns', 'Quantum Field'];
  const characterOptions = ['Astronaut', 'Cyborg', 'Alien', 'Robot'];
  const accessoryOptions = ['Laser Sword', 'Holographic Shield', 'Plasma Gun', 'Tech Goggles'];
  const specialOptions = ['Glowing Aura', 'Digital Particles', 'Energy Trails', 'Time Distortion'];

  // Mock SVG NFT generation based on traits
  const generateSvgNft = (traits: typeof selectedTraits, size: number): string => {
    // Simplified SVG generation - in a real app, this would be more complex
    const colors: Record<string, string> = {
      Nebula: '#1a103a',
      'Cyberpunk City': '#0c1b33',
      'Abstract Patterns': '#152e33',
      'Quantum Field': '#1f1d36',
      Astronaut: '#white',
      Cyborg: '#7573e6',
      Alien: '#60cf98',
      Robot: '#8c8c9c',
      'Laser Sword': '#ff4d4d',
      'Holographic Shield': '#39c0ff',
      'Plasma Gun': '#62fa83',
      'Tech Goggles': '#ffaa00',
      'Glowing Aura': '#ffd700',
      'Digital Particles': '#00ff9d',
      'Energy Trails': '#ff00ff',
      'Time Distortion': '#3d85c6'
    };

    const bgColor = colors[traits.background];
    const characterColor = colors[traits.character];
    const accessoryColor = colors[traits.accessory];
    const specialColor = colors[traits.special];

    // Create a simple SVG with multiple elements to simulate complexity
    let svgParts = [];
    
    // Background
    svgParts.push(`<rect width="100%" height="100%" fill="${bgColor}" />`);
    
    // Add complexity based on selected level
    const complexityFactor = complexity === 'low' ? 5 : complexity === 'medium' ? 15 : 30;
    
    // Generate background patterns
    for (let i = 0; i < complexityFactor; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const radius = Math.random() * 20 + 5;
      const opacity = Math.random() * 0.5 + 0.1;
      svgParts.push(`<circle cx="${x}" cy="${y}" r="${radius}" fill="${specialColor}" opacity="${opacity}" />`);
    }
    
    // Character (simplified as a circle)
    svgParts.push(`<circle cx="${size/2}" cy="${size/2}" r="${size/4}" fill="${characterColor}" />`);
    
    // Accessory (simplified)
    if (traits.accessory === 'Laser Sword') {
      svgParts.push(`<rect x="${size*0.65}" y="${size*0.3}" width="${size*0.05}" height="${size*0.4}" fill="${accessoryColor}" />`);
    } else if (traits.accessory === 'Holographic Shield') {
      svgParts.push(`<circle cx="${size*0.4}" cy="${size*0.5}" r="${size/5}" stroke="${accessoryColor}" stroke-width="5" fill="none" opacity="0.7" />`);
    } else if (traits.accessory === 'Plasma Gun') {
      svgParts.push(`<rect x="${size*0.6}" y="${size*0.45}" width="${size*0.25}" height="${size*0.1}" fill="${accessoryColor}" />`);
    } else {
      svgParts.push(`<rect x="${size*0.4}" y="${size*0.3}" width="${size*0.2}" height="${size*0.1}" fill="${accessoryColor}" rx="5" ry="5" />`);
    }
    
    // Special effect
    for (let i = 0; i < complexityFactor/2; i++) {
      const radius = (size/4) + (i * 5);
      const opacity = 0.8 - (i * 0.05);
      svgParts.push(`<circle cx="${size/2}" cy="${size/2}" r="${radius}" fill="none" stroke="${specialColor}" stroke-width="2" opacity="${opacity}" />`);
    }
    
    // Return the complete SVG
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      ${svgParts.join('\n')}
    </svg>`;
  };

  const updateGasEstimates = () => {
    // Gas estimates based on complexity
    let solidityGas, stylusGas;
    
    if (complexity === 'low') {
      solidityGas = 387250;
      stylusGas = 124320;
    } else if (complexity === 'medium') {
      solidityGas = 742890;
      stylusGas = 183740;
    } else {
      solidityGas = 1453700;
      stylusGas = 289630;
    }
    
    const savingsPercent = ((solidityGas - stylusGas) / solidityGas * 100).toFixed(1);
    
    setGasEstimates({
      solidity: solidityGas,
      stylus: stylusGas,
      savings: parseFloat(savingsPercent)
    });
  };

  useEffect(() => {
    updateGasEstimates();
  }, [complexity]);

  const handleGenerate = () => {
    setLoading(true);
    
    // Simulate processing time
    setTimeout(() => {
      const svg = generateSvgNft(selectedTraits, 400);
      const svgBase64 = btoa(svg);
      
      const metadata: NFTMetadata = {
        name: `${selectedTraits.character} with ${selectedTraits.accessory}`,
        description: `A unique NFT featuring a ${selectedTraits.character} with a ${selectedTraits.accessory} on a ${selectedTraits.background} background, with ${selectedTraits.special} effect.`,
        image: `data:image/svg+xml;base64,${svgBase64}`,
        attributes: [
          { trait_type: 'Background', value: selectedTraits.background },
          { trait_type: 'Character', value: selectedTraits.character },
          { trait_type: 'Accessory', value: selectedTraits.accessory },
          { trait_type: 'Special Effect', value: selectedTraits.special },
          { trait_type: 'Generation Method', value: 'On-Chain Stylus' },
          { trait_type: 'Complexity', value: complexity.charAt(0).toUpperCase() + complexity.slice(1) }
        ]
      };
      
      setGeneratedNft(metadata);
      setLoading(false);
    }, 1500);
  };

  const handleMint = () => {
    if (!account || !generatedNft) return;
    
    setMinting(true);
    
    // Simulate minting process
    setTimeout(() => {
      setMinting(false);
      // Show success message or update state
      alert('NFT minted successfully! (This is a simulation)');
    }, 2000);
  };

  return (
    <div className="w-full bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold mb-8 text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
        On-Chain NFT Generation Simulator
      </h2>

      <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6 mb-8">
        <p className="text-slate-300">
          Traditional NFTs store metadata and images off-chain because generating complex art on-chain is prohibitively 
          expensive in Solidity. With Stylus, fully on-chain generative NFTs become economically viable.
          This demo showcases how Stylus enables complex SVG generation directly in smart contracts.
        </p>
      </div>
      
      {!account ? (
        <div className="bg-slate-800/50 p-8 rounded-xl text-center border border-slate-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h3 className="text-xl font-medium text-slate-300 mb-2">Wallet Connection Required</h3>
          <p className="text-slate-400 mb-6">
            Please connect your wallet to interact with the NFT generation simulator.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls Panel */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
            <h3 className="text-xl font-bold text-white mb-6">NFT Traits</h3>
            
            {/* Trait Selectors */}
            <div className="space-y-5 mb-8">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Background</label>
                <select
                  value={selectedTraits.background}
                  onChange={(e) => setSelectedTraits(prev => ({ ...prev, background: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {backgroundOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Character</label>
                <select
                  value={selectedTraits.character}
                  onChange={(e) => setSelectedTraits(prev => ({ ...prev, character: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {characterOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Accessory</label>
                <select
                  value={selectedTraits.accessory}
                  onChange={(e) => setSelectedTraits(prev => ({ ...prev, accessory: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {accessoryOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Special Effect</label>
                <select
                  value={selectedTraits.special}
                  onChange={(e) => setSelectedTraits(prev => ({ ...prev, special: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {specialOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Complexity Selector */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-slate-400 mb-2">Art Complexity</label>
              <div className="flex justify-between p-1 bg-slate-900 rounded-lg">
                {(['low', 'medium', 'high'] as const).map((level) => (
                  <button
                    key={level}
                    className={`flex-1 py-2 px-3 rounded-md transition-all text-sm font-medium
                      ${complexity === level 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
                        : 'text-slate-400 hover:text-white'
                      }`
                    }
                    onClick={() => setComplexity(level)}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Higher complexity = more on-chain operations = higher gas costs
              </p>
            </div>
            
            {/* Gas Estimates */}
            <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800 mb-8">
              <h4 className="font-semibold text-slate-300 mb-3">Estimated Gas Comparison</h4>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Solidity:</span>
                  <span className="font-mono text-orange-400">{gasEstimates.solidity.toLocaleString()} gas</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Stylus:</span>
                  <span className="font-mono text-emerald-400">{gasEstimates.stylus.toLocaleString()} gas</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-slate-300 font-medium">Gas Savings:</span>
                  <span className="font-mono text-emerald-400 font-bold">{gasEstimates.savings}%</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating NFT...
                </span>
              ) : 'Generate On-Chain NFT'}
            </button>
          </div>
          
          {/* Preview Panel */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
            <h3 className="text-xl font-bold text-white mb-6">NFT Preview</h3>
            
            <div className="aspect-square bg-slate-900/80 rounded-lg border-2 border-dashed border-slate-700 mb-6 flex items-center justify-center overflow-hidden">
              {generatedNft ? (
                <div className="w-full h-full">
                  <img
                    src={generatedNft.image}
                    alt={generatedNft.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="text-center p-6">
                  {loading ? (
                    <div className="flex flex-col items-center">
                      <svg className="animate-spin h-12 w-12 text-purple-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <p className="text-slate-400">Generating your on-chain NFT...</p>
                      <p className="text-slate-500 text-sm mt-2">Simulating Stylus contract execution</p>
                    </div>
                  ) : (
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-600 mb-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-slate-400">Select traits and generate your NFT</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {generatedNft && (
              <>
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-white mb-3">{generatedNft.name}</h4>
                  <p className="text-slate-400 text-sm">{generatedNft.description}</p>
                </div>
                
                <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800 mb-6">
                  <h5 className="font-medium text-slate-300 mb-3">Traits</h5>
                  <div className="grid grid-cols-2 gap-3">
                    {generatedNft.attributes.map((attr, idx) => (
                      <div key={idx} className="bg-slate-800/60 rounded-md px-3 py-2">
                        <p className="text-xs text-slate-500">{attr.trait_type}</p>
                        <p className="text-sm text-slate-300">{attr.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={handleMint}
                  disabled={minting || !generatedNft}
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {minting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Minting...
                    </span>
                  ) : 'Mint NFT (Simulation)'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
      
      <div className="mt-8 bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-5 rounded-xl border border-purple-900/30">
        <h3 className="text-purple-300 font-medium mb-2">Why This Matters</h3>
        <p className="text-slate-300">
          Fully on-chain NFTs offer superior permanence and provenance since both metadata and artwork live entirely on the blockchain.
          With Stylus, complex on-chain art generation becomes economically feasible with up to 80% gas savings compared to Solidity.
          This enables richer, more dynamic on-chain NFT experiences and stronger guarantees of permanence.
        </p>
      </div>
    </div>
  );
};

export default NftGenerationSimulator;