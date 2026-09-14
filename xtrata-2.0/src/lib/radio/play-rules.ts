/** Versioned, shared rules. Client reports are observations, never proof of a human. */
export const RULE_VERSION = 1;
export const IDLE_MS = 30 * 60_000;
export type Span = [number, number];
export function mergeSpans(spans: Span[]): Span[] {
  const result: Span[] = [];
  for (const [a, b] of [...spans].sort((x, y) => x[0] - y[0])) {
    const last = result[result.length - 1];
    if (last && a <= last[1]) last[1] = Math.max(last[1], b);
    else result.push([a, b]);
  }
  return result;
}
export const coverage = (spans: Span[]) => mergeSpans(spans).reduce((n, [a, b]) => n + b - a, 0);
export function classify(seconds: number, duration: number, spans: Span[]) {
  const started = seconds >= 2;
  const qualified = started && seconds >= Math.max(2, Math.min(30, duration / 2));
  return { started, qualified, completed: qualified && coverage(spans) >= duration * 0.9 };
}
/** Only credit continuous forward progress; jumps, buffering and throttled gaps fail closed. */
export function credit(previous: number, position: number, wallSeconds: number, rate: number, active: boolean) {
  const advance = position - previous;
  if (!active || wallSeconds <= 0 || wallSeconds > 5 || rate <= 0 || rate > 4 || advance <= 0 || advance > wallSeconds * rate + 0.35) return 0;
  return Math.min(wallSeconds, advance / rate);
}
