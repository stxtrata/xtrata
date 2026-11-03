import { runRoyaltyAutomation } from '../../functions/lib/audionaut-royalty-automation';
import type { Env } from '../../functions/lib/db';
export default {
  async scheduled(_event: unknown, env: Env, context: { waitUntil(promise: Promise<unknown>): void }) {
    context.waitUntil(runRoyaltyAutomation(env).then(result => {
      if ('errors' in result && result.errors.length) throw Error('Royalty scan incomplete; inspect the private ledger automation status.');
    }));
  },
  async fetch() { return new Response('Scheduled royalty verification only.', { status: 404 }); }
};
