export type AgentType = 'scout' | 'analyst' | 'executor' | 'governor';

export type AgentTier = 'drone' | 'worker' | 'queen';

export interface AgentSwarmConfig {
  rpcUrl: string;
  programId?: string;
}

export interface DeployAgentParams {
  type: AgentType;
  stakeAmount: number;
  tier?: AgentTier;
}

export interface Agent {
  id: string;
  type: AgentType;
  tier: AgentTier;
  stakeAmount: number;
  reputation: number;
  status: 'pending' | 'active' | 'inactive';
  pubkey: string;
}

export interface SwarmProposal {
  id: string;
  proposerId: string;
  action: string;
  votesFor: number;
  votesAgainst: number;
  status: 'open' | 'approved' | 'rejected' | 'executed';
  createdAt: number;
}