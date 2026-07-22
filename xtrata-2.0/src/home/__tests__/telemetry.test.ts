import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const homeMain = readFileSync(new URL('../main.js', import.meta.url), 'utf8');

describe('public homepage telemetry coverage', () => {
  it('tracks the real public mint flow, including retries and completion', () => {
    expect(homeMain).toContain("startJourney('mint', getContractId(state.contract))");
    expect(homeMain).toContain("telemetryStep = 'readiness'");
    expect(homeMain).toContain("telemetryStep = 'upload'");
    expect(homeMain).toContain("step: 'complete', outcome: 'success'");
    expect(homeMain).toContain("outcome: 'abandon'");
  });

  it('tracks public market submissions and preserves a journey across retries', () => {
    expect(homeMain).toContain('const marketBuyJourneys = new Map()');
    expect(homeMain).toContain("startJourney('market_buy', marketTarget)");
    expect(homeMain).toContain('marketBuyJourneys.get(marketTarget)');
    expect(homeMain).toContain("classifyTelemetryError(error, 'market_buy')");
  });
});
