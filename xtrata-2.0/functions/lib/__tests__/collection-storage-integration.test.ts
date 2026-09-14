import { createRequire } from 'node:module';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { deserializeCV } from '@stacks/transactions';
import { createUploadIntent, putVerifiedUpload } from '../collection-storage/uploads';
import { advanceAutomaticJobs, scanObject } from '../collection-storage/cleanup';
import { verifySealedContent, type ChainReader } from '../collection-storage/chain';
import { onRequest as preview } from '../../collections/[collectionId]/asset-preview';
import { fixture, sqliteAvailable, BYTES, HASH, COLLECTION, NOW } from './storage/fixtures';

const require = createRequire(import.meta.url);
afterEach(() => vi.unstubAllGlobals());
describe.skipIf(!sqliteAvailable)('isolated staging to actual v1.5 mint to recovery preview', () => {
  it('completes both automated verification passes without changing sale history', async () => {
    const { initSimnet } = require('../../../contracts/clarinet/node_modules/@stacks/clarinet-sdk');
    const { Cl, serializeCV } = require('../../../contracts/clarinet/node_modules/@stacks/transactions');
    const simnet = await initSimnet('contracts/clarinet/Clarinet.toml');
    const accounts = simnet.getAccounts();
    const admin = accounts.get('deployer'); const buyer = accounts.get('wallet_1');
    const core = `${admin}.xtrata-v3-2-3`; const helper = `${admin}.xtrata-collection-mint-v1-5`;
    const target = { core, helper, network: 'testnet' as const };
    const invoke = (contract: string, method: string, args: any[], sender = admin) => {
      const result = simnet.callPublicFn(contract, method, args, sender).result;
      expect(result.type).toBe('ok'); return result;
    };
    invoke(core, 'set-paused', [Cl.bool(false)]);
    invoke(helper, 'set-max-supply', [Cl.uint(1)]);
    invoke(helper, 'set-paused', [Cl.bool(false)]);
    invoke(helper, 'set-registered-token-uri', [Cl.bufferFromHex(HASH), Cl.stringAscii('data:text/plain,asset')]);
    const f = await fixture(); f.env.COLLECTION_CLEANUP_CORES = core;
    f.DB.sqlite.prepare('UPDATE collections SET metadata=?,contract_address=? WHERE id=?')
      .run(JSON.stringify({ coreContractId: core }), helper, COLLECTION);
    const intent = await createUploadIntent(f.env, COLLECTION, NOW);
    const stored = await putVerifiedUpload(f.env, COLLECTION, intent.key, BYTES, 'text/plain', NOW);
    f.DB.sqlite.prepare(`INSERT INTO assets (asset_id, collection_id, storage_key, expected_hash, total_bytes, total_chunks, mime_type, state)
      VALUES ('asset',?,?,?,?,?,'text/plain','draft')`).run(COLLECTION, stored.key, HASH, BYTES.length, 1);
    const principal = Cl.contractPrincipal(admin, 'xtrata-v3-2-3');
    invoke(helper, 'mint-begin', [principal, Cl.bufferFromHex(HASH), Cl.stringAscii('text/plain'), Cl.uint(BYTES.length), Cl.uint(1)], buyer);
    invoke(helper, 'mint-add-chunk-batch', [principal, Cl.bufferFromHex(HASH), Cl.list([Cl.buffer(BYTES)])], buyer);
    invoke(helper, 'mint-seal', [principal, Cl.bufferFromHex(HASH), Cl.stringAscii('data:text/plain,asset')], buyer);
    const blockHash = '0x' + 'a'.repeat(64);
    const rpc: ChainReader = {
      async anchor() { return { height: 100, hash: blockHash, confirmations: 6 }; },
      async canonical() {},
      async read(contract, method, args) {
        // Convert root Stacks v6 values to the simulator's Stacks v7 wire format.
        const { serializeCV: serializeV6 } = await import('@stacks/transactions');
        const { deserializeCV: deserializeV7 } = require('../../../contracts/clarinet/node_modules/@stacks/transactions');
        const converted = args.map(arg => deserializeV7(serializeV6(arg)));
        return deserializeCV(serializeCV(simnet.callReadOnlyFn(contract, method, converted, buyer).result));
      }
    };
    vi.stubGlobal('fetch', vi.fn(async () => Response.json({ canonical: true, height: 100, index_block_hash: blockHash })));
    const verifier = (env: any, object: any, refs: any, now: number) => verifySealedContent(env, target, object, refs, rpc, now);
    const job = await scanObject(f.env, COLLECTION, stored.key, verifier, NOW);
    expect(job?.state).toBe('flagged');
    const done = await advanceAutomaticJobs(f.env, COLLECTION, verifier, NOW + 86400000);
    expect(done?.state).toBe('quarantined');
    expect(f.DB.sqlite.prepare("SELECT state FROM assets WHERE asset_id='asset'").get()?.state).toBe('draft');
    const response = await preview({ env: f.env, params: { collectionId: COLLECTION },
      request: new Request('https://local/collections/a/asset-preview?assetId=asset') } as any);
    expect(response.status).toBe(200);
    expect(response.headers.get('X-Xtrata-Asset-Binding')).toBe('COLLECTION_RECOVERY');
    expect(new Uint8Array(await response.arrayBuffer())).toEqual(BYTES);
    // Cleanup preserves normal sale/status reconciliation and collection edits.
    expect(() => f.DB.sqlite.prepare("UPDATE assets SET state='minted' WHERE asset_id='asset'").run()).not.toThrow();
    expect(() => f.DB.sqlite.prepare("UPDATE collections SET state='published' WHERE id=?").run(COLLECTION)).not.toThrow();
    expect(() => f.DB.sqlite.prepare("UPDATE assets SET expected_hash='changed' WHERE asset_id='asset'").run()).toThrow('held');
    expect(() => f.DB.sqlite.prepare("UPDATE collections SET contract_address='changed' WHERE id=?").run(COLLECTION)).toThrow('held');
  }, 30000);
});
