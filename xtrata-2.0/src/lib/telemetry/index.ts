/**
 * Public telemetry API. Import `telemetry` for the common surface, or the named
 * exports for wiring (installGlobalTelemetry, TelemetryBoundary).
 *
 *   import { telemetry } from '@/lib/telemetry';
 *   const j = telemetry.startJourney('market_buy', listingId);
 *   telemetry.event({ journey: j, attempt: j.attempt(), step: 'sign', outcome: 'start' });
 */
import { breadcrumb, event, flush, setWallet, startJourney } from './client';

export {
  Journey,
  sessionId,
  setWallet,
  breadcrumb,
  event,
  flush,
  startJourney,
  setTelemetryEnabled
} from './client';
export { installGlobalTelemetry } from './global';
export { TelemetryBoundary } from './TelemetryBoundary';
export { classify } from './classify';
export { fingerprint, normaliseMessage } from './fingerprint';
export type { Flow, Outcome, Severity, TelemetryInput, JourneyHandle } from './types';

export const telemetry = { event, flush, setWallet, breadcrumb, startJourney };
