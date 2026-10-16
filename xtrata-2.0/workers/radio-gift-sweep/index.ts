/**
 * Calls the radio gift sweep every five minutes (see wrangler.toml). The sweep itself, the treasury key and the database
 * stay in the Pages project; this Worker only knocks, so a leaked Worker can do no more than run housekeeping early.
 */
interface Env { SWEEP_URL: string; RADIO_GIFT_SWEEP_SECRET?: string }

export async function sweepOnce(env: Env, fetcher: typeof fetch = fetch): Promise<{ steps: string[] }> {
  if (!env.RADIO_GIFT_SWEEP_SECRET) throw new Error('RADIO_GIFT_SWEEP_SECRET is not set on this Worker.');
  const response = await fetcher(env.SWEEP_URL, { method: 'POST', headers: { authorization: `Bearer ${env.RADIO_GIFT_SWEEP_SECRET}` } });
  if (!response.ok) throw new Error(`Gift sweep answered ${response.status}.`);
  return (await response.json()) as { steps: string[] };
}

export default {
  async scheduled(_event: unknown, env: Env, context: { waitUntil(promise: Promise<unknown>): void }) {
    context.waitUntil(sweepOnce(env).then((r) => { console.log('[radio:gift-sweep]', r.steps.join(','));}));
  },
  async fetch() { return new Response('Scheduled gift sweep only.', { status: 404 }); }
};
