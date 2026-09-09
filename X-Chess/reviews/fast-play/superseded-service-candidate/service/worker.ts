import { Referee, serviceHandler } from './shared/fast/referee.js';
import type { Store, MatchRecord } from './shared/fast/referee.js';
import { loadOpening } from './shared/fast/registry.js';
import { FAST_PROTOCOL, insist } from './shared/fast/protocol.js';
import type { Opening, Key } from './shared/fast/protocol.js';
interface Statement { bind(...values: unknown[]): Statement; first<T>(): Promise<T | null>; run(): Promise<{meta: {changes: number}}> }
interface Database { prepare(sql: string): Statement }
interface Env { DB: Database; REFEREE_JWK: string; REFEREE_PUBLIC: string; REGISTRY: string; NETWORK: Opening['network']; STACKS_API?: string }
export class D1Store implements Store {
  constructor(private db: Database) {}
  async get(game: number): Promise<MatchRecord | null> {
    const row = await this.db.prepare('SELECT record FROM matches WHERE game = ?').bind(game).first<{record: string}>();
    return row ? JSON.parse(row.record) : null;
  }
  async put(game: number, expected: number | null, row: MatchRecord): Promise<boolean> {
    const q = expected === null
      ? this.db.prepare('INSERT OR IGNORE INTO matches (game, revision, record) VALUES (?, ?, ?)').bind(game, row.revision, JSON.stringify(row))
      : this.db.prepare('UPDATE matches SET revision = ?, record = ? WHERE game = ? AND revision = ?').bind(row.revision, JSON.stringify(row), game, expected);
    return (await q.run()).meta.changes === 1;
  }
}
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (new URL(request.url).pathname === '/') return new Response('<!doctype html><meta name="viewport" content="width=device-width"><title>X Chess Quick Play</title><style>body{font:18px system-ui;max-width:680px;margin:10vh auto;padding:24px;background:#12100e;color:#e8e2d9}a{color:#d8a24a}</style><h1>X Chess Quick Play</h1><p>Clock and signed game archive service for X Chess 2.3.1.</p><p>Open Quick Play in the X Chess standalone app to create or join a game. Completed archives can be verified without this service.</p><p><a href="/v1/info">Service settings</a></p>', { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    try {
      insist(env.REFEREE_JWK && env.REFEREE_PUBLIC && env.DB, 'Service setup is incomplete');
      const secret = await crypto.subtle.importKey('jwk', JSON.parse(env.REFEREE_JWK), { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
      const key: Key = { public: env.REFEREE_PUBLIC, secret };
      const config = { registry: env.REGISTRY ?? '', network: env.NETWORK ?? 'mainnet', confirmations: 2,
        api: env.STACKS_API || (env.NETWORK === 'testnet' ? 'https://api.testnet.hiro.so' : 'https://api.mainnet.hiro.so') };
      const referee = new Referee({ store: new D1Store(env.DB), key, loadOpening: game => loadOpening(config, game) });
      return await serviceHandler(referee, { protocol: FAST_PROTOCOL, referee: key.public, registry: config.registry, network: config.network, confirmations: config.confirmations })(request);
    } catch {
      return Response.json({ error: 'Service setup is incomplete. Contact the operator.' }, { status: 503, headers: { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store' } });
    }
  }
};
