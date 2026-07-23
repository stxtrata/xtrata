import type { NetworkType } from '../network/types';

export const LEADERBOARD_TEMPLATE = {
  id: 'xtrata-leaderboard',
  version: '1.0.0',
  riskTier: 1
} as const;

export type XtrataAssetRef = {
  network: NetworkType;
  coreContractId: string;
  tokenId: string;
  contentHash: string;
  creator: string;
  owner: string;
  mimeType: string;
  totalSize: string;
  parents: string[];
  dependencies: string[];
  protocolVersion: string;
};

export type LeaderboardConfiguration = {
  projectName: string;
  gameId: string;
  administrator: string;
  direction: 'higher' | 'lower';
  recordMode: 'personal-best' | 'most-recent';
  submissionPolicy: 'public' | 'administrator';
  minScore: string;
  maxScore: string;
  topN: number;
  seasons: boolean;
  rejectIdentical: boolean;
};

export type StudioArtifact = {
  path: string;
  content: string;
};

export type StudioProject = {
  source: string;
  sourceHash: string;
  configurationHash: string;
  manifest: Record<string, unknown>;
  artifacts: StudioArtifact[];
};

export const DEFAULT_LEADERBOARD_CONFIGURATION: LeaderboardConfiguration = {
  projectName: 'Xtrata Game Leaderboard',
  gameId: 'xtrata-game',
  administrator: '',
  direction: 'higher',
  recordMode: 'personal-best',
  submissionPolicy: 'public',
  minScore: '1',
  maxScore: '1000000000',
  topN: 10,
  seasons: true,
  rejectIdentical: true
};

