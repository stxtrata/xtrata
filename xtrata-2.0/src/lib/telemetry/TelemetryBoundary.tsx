import React from 'react';
import { event } from './client';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}
interface State {
  failed: boolean;
}

/** Catches React render crashes so a broken screen becomes a logged issue. */
export class TelemetryBoundary extends React.Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo): void {
    event({
      flow: 'app',
      outcome: 'error',
      severity: 'fatal',
      errorCode: 'RENDER_CRASH',
      error,
      context: { componentStack: info?.componentStack }
    });
  }

  render(): React.ReactNode {
    if (this.state.failed) {
      return (
        this.props.fallback ?? (
          <div
            style={{
              padding: 24,
              fontFamily: 'system-ui, sans-serif',
              maxWidth: 520,
              margin: '10vh auto'
            }}
          >
            <h1 style={{ fontSize: 18, margin: '0 0 8px' }}>Something went wrong on this page.</h1>
            <p style={{ opacity: 0.75, margin: 0, lineHeight: 1.5 }}>
              Please refresh to try again. If it keeps happening, give it a minute and retry — the
              issue has been recorded so it can be fixed.
            </p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
