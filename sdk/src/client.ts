import type {
  Agent,
  AgentSwarmConfig,
  AgentTier,
  DeployAgentParams,
  SwarmProposal,
} from './types';

const TIER_THRESHOLDS: Record<AgentTier, number> = {
  drone: 1_000,
  worker: 10_000,
  queen: 100_000,
};

const PROGRAM_ID = 'SWARM11111111111111111111111111111111111111';

export class AgentSwarmClient {
  private rpcUrl: string;
  private programId: string;

  constructor(config: AgentSwarmConfig) {
    this.rpcUrl = config.rpcUrl;
    this.programId = config.programId ?? PROGRAM_ID;
  }

  /** Returns the configured Solana RPC endpoint. */
  getRpcUrl(): string {
    return this.rpcUrl;
  }

  /** Returns the AgentSwarm program ID. */
  getProgramId(): string {
    return this.programId;
  }

  /** Resolves agent tier from stake amount. */
  resolveTier(stakeAmount: number): AgentTier {
    if (stakeAmount >= TIER_THRESHOLDS.queen) return 'queen';
    if (stakeAmount >= TIER_THRESHOLDS.worker) return 'worker';
    return 'drone';
  }

  /**
   * Deploy a new agent to the swarm.
   * Mainnet integration coming in Phase 2.
   */
  async deployAgent(params: DeployAgentParams): Promise<Agent> {
    const tier = params.tier ?? this.resolveTier(params.stakeAmount);

    return {
      id: `agent_${Date.now()}`,
      type: params.type,
      tier,
      stakeAmount: params.stakeAmount,
      reputation: 0,
      status: 'pending',
      pubkey: 'SimulatedAgentPubkey111111111111111111111',
    };
  }

  /** List all agents registered by a wallet address. */
  async listAgents(_walletAddress: string): Promise<Agent[]> {
    return [];
  }

  /** Fetch open swarm proposals. */
  async getProposals(): Promise<SwarmProposal[]> {
    return [];
  }
}