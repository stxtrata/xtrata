import type { LeaderboardConfiguration } from './model';

export type SimulatedScore = {
  wallet: string;
  alias: string;
  score: bigint;
  season: bigint;
};

export type SimulationState = {
  season: bigint;
  scores: SimulatedScore[];
  events: string[];
};

export const createSimulation = (): SimulationState => ({
  season: 1n,
  scores: [],
  events: ['asset-verified']
});

export const submitSimulatedScore = (
  state: SimulationState,
  configuration: LeaderboardConfiguration,
  input: { wallet: string; alias: string; score: string; isAdministrator?: boolean }
): SimulationState => {
  if (
    configuration.submissionPolicy === 'administrator' &&
    !input.isAdministrator
  ) {
    throw new Error('ERR-NOT-AUTHORIZED');
  }
  if (!/^(0|[1-9]\d*)$/.test(input.score)) {
    throw new Error('ERR-INVALID-SCORE');
  }
  const score = BigInt(input.score);
  if (score < BigInt(configuration.minScore) || score > BigInt(configuration.maxScore)) {
    throw new Error('ERR-INVALID-SCORE');
  }
  if (input.alias.length < 3 || input.alias.length > 12) {
    throw new Error('ERR-INVALID-ALIAS');
  }
  const existing = state.scores.find(
    (entry) => entry.wallet === input.wallet && entry.season === state.season
  );
  if (existing && configuration.rejectIdentical && existing.score === score) {
    throw new Error('ERR-DUPLICATE');
  }
  if (existing && configuration.recordMode === 'personal-best') {
    const better =
      configuration.direction === 'higher' ? score > existing.score : score < existing.score;
    if (!better) {
      throw new Error('ERR-NOT-BETTER');
    }
  }
  const next = state.scores.filter(
    (entry) => !(entry.wallet === input.wallet && entry.season === state.season)
  );
  next.push({ wallet: input.wallet, alias: input.alias, score, season: state.season });
  next.sort((left, right) => {
    if (left.score === right.score) return left.wallet.localeCompare(right.wallet);
    const direction = left.score > right.score ? -1 : 1;
    return configuration.direction === 'higher' ? direction : -direction;
  });
  return {
    ...state,
    scores: next,
    events: [...state.events, `score-submitted:${input.wallet}:${score}`]
  };
};

export const resetSimulatedSeason = (
  state: SimulationState,
  configuration: LeaderboardConfiguration,
  isAdministrator: boolean
): SimulationState => {
  if (!configuration.seasons) throw new Error('ERR-PERMANENT');
  if (!isAdministrator) throw new Error('ERR-NOT-AUTHORIZED');
  const season = state.season + 1n;
  return { ...state, season, events: [...state.events, `season-started:${season}`] };
};

