interface Window {
  ethereum?: {
    request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    on: (event: string, callback: (...args: any[]) => void) => void;
    removeListener: (event: string, callback: (...args: any[]) => void) => void;
    isMetaMask?: boolean;
    // Add gas estimation capability
    estimateGas?: (tx: {to: string, data: string, value?: string}) => Promise<string>;
  };
}
