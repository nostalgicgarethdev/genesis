import type {
  ChildAgent,
  GenesisAgent,
  GenesisConfig,
  LaunchChildParams,
  RegisterGenesisParams,
  TokenizeChildParams,
} from './types';

const DEFAULT_API = 'https://api.genesis.so';

export class GenesisClient {
  private rpcUrl: string;
  private apiUrl: string;

  constructor(config: GenesisConfig) {
    this.rpcUrl = config.rpcUrl;
    this.apiUrl = config.apiUrl ?? DEFAULT_API;
  }

  getRpcUrl(): string {
    return this.rpcUrl;
  }

  getApiUrl(): string {
    return this.apiUrl;
  }

  /** Register a genesis agent (requires X verification). */
  async registerGenesis(params: RegisterGenesisParams): Promise<GenesisAgent> {
    return {
      id: `gen_${Date.now()}`,
      role: 'genesis',
      xUserId: params.xUserId,
      name: params.name,
      solanaWallet: params.solanaWallet,
      childCount: 0,
      status: 'pending_verification',
      createdAt: Date.now(),
    };
  }

  /** Launch a child agent. Only callable from genesis context. */
  async launchChild(params: LaunchChildParams): Promise<ChildAgent> {
    return {
      id: `child_${Date.now()}`,
      role: 'child',
      genesisId: params.genesisId,
      name: params.name,
      purpose: params.purpose,
      status: 'spawning',
      feesEarned: 0,
      createdAt: Date.now(),
    };
  }

  /** Tokenize a child agent on pump.fun. Fees route to human wallet. */
  async tokenizeChild(params: TokenizeChildParams): Promise<ChildAgent> {
    return {
      id: params.childId,
      role: 'child',
      genesisId: 'gen_placeholder',
      name: params.name,
      purpose: '',
      status: 'tokenized',
      feesEarned: 0,
      createdAt: Date.now(),
      token: {
        mintAddress: 'TokenMintPlaceholder111111111111111111111',
        ticker: params.ticker,
        pumpFunUrl: `https://pump.fun/coin/TokenMintPlaceholder`,
      },
    };
  }

  /** List children spawned by a genesis agent. */
  async listChildren(_genesisId: string): Promise<ChildAgent[]> {
    return [];
  }
}