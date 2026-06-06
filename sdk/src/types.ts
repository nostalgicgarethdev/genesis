export type AgentRole = 'genesis' | 'child';

export type ChildStatus = 'spawning' | 'active' | 'paused' | 'tokenized';

export interface GenesisConfig {
  rpcUrl: string;
  apiUrl?: string;
}

export interface RegisterGenesisParams {
  xUserId: string;
  name: string;
  solanaWallet: string;
}

export interface LaunchChildParams {
  genesisId: string;
  name: string;
  purpose: string;
  config?: Record<string, unknown>;
}

export interface TokenizeChildParams {
  childId: string;
  ticker: string;
  name: string;
  description?: string;
}

export interface GenesisAgent {
  id: string;
  role: 'genesis';
  xUserId: string;
  name: string;
  solanaWallet: string;
  childCount: number;
  status: 'pending_verification' | 'active';
  createdAt: number;
}

export interface ChildAgent {
  id: string;
  role: 'child';
  genesisId: string;
  name: string;
  purpose: string;
  status: ChildStatus;
  token?: {
    mintAddress: string;
    ticker: string;
    pumpFunUrl: string;
  };
  feesEarned: number;
  createdAt: number;
}