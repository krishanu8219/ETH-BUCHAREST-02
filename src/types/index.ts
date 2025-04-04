export interface DisputeState {
  id: string;
  status: 'pending' | 'in_progress' | 'resolved';
  challenger: string;
  defender: string;
  currentRound: number;
  totalRounds: number;
  timestamp: number;
  steps: SimulationStep[];
  disputedTransaction: Transaction;
}

export interface SimulationStep {
  id: string;
  round: number;
  description: string;
  status: 'pending' | 'completed' | 'challenged';
  timestamp: number;
  data?: Record<string, unknown>;
  explanation: string;
}

export interface Challenge {
  id: string;
  disputeId: string;
  round: number;
  challenger: string;
  defender: string;
  status: 'pending' | 'resolved';
  timestamp: number;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  data: string;
  executionTrace: ExecutionStep[];
}

export interface ExecutionStep {
  step: number;
  opcode: string;
  stackState: string[];
  memoryState: string;
  description: string;
}