/**
 * Global safety net — installed once from main.tsx. Captures the literal
 * "crashes out": uncaught errors, unhandled promise rejections, and flushes
 * pending events when the tab is hidden or closed (so we never lose the event
 * right before someone bails).
 */
import { event, flush, setTelemetryEnabled } from './client';

let installed = false;

export function installGlobalTelemetry(): void {
  if (installed || typeof window === 'undefined') return;
  installed = true;
  setTelemetryEnabled(true);

  // A lightweight boot event is the dashboard's positive heartbeat. Without
  // it, a healthy visit that never enters a wallet/mint flow is
  // indistinguishable from a broken telemetry client.
  event({ flow: 'app', step: 'boot', outcome: 'info' });

  window.addEventListener('error', (e: ErrorEvent) => {
    event({
      flow: 'app',
      outcome: 'error',
      severity: 'fatal',
      errorCode: 'UNCAUGHT',
      error: e.error ?? e.message,
      context: { source: e.filename, line: e.lineno, col: e.colno }
    });
  });

  window.addEventListener('unhandledrejection', (e: PromiseRejectionEvent) => {
    event({
      flow: 'app',
      outcome: 'error',
      severity: 'error',
      errorCode: 'UNCAUGHT',
      error: e.reason
    });
  });

  const onHide = () => flush('pagehide');
  window.addEventListener('pagehide', onHide);
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) flush('visibilitychange');
    });
  }

  window.addEventListener('offline', () =>
    event({ flow: 'app', outcome: 'info', step: 'offline', severity: 'warn' })
  );
  window.addEventListener('online', () => event({ flow: 'app', outcome: 'info', step: 'online' }));
}
