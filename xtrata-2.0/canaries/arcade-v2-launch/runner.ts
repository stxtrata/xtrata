/**
 * Xtrata Arcade v2 launch canary: the headless runner (TESTNET ONLY).
 *
 * Runs the same steps as the page (engine.ts) from a machine that can reach the Hiro testnet API, signing with a key file,
 * behind the arcade-world ops guard (contracts/arcade-world/ops/lib/guard.mjs). Built by scripts/build-arcade-v2-launch-canary.mjs
 * into canaries/build/arcade-v2-launch-runner.mjs.
 *
 *   node canaries/build/arcade-v2-launch-runner.mjs --network testnet --address ST…            # dry run: reads only, sends nothing
 *   XA_OPS_CONFIRM=broadcast-testnet node canaries/build/arcade-v2-launch-runner.mjs \
 *     --network testnet --execute --key-file ./testnet-root.key [--steps a,b] [--full] [--yes]
 *   --full also registers all the arcade boards and adds the two test games (the steps boards26 and testgames), so the testnet
 *   leaderboard and games contract look like the mainnet ones.
 *
 * A real send needs everything the guard asks for: --execute, XA_OPS_CONFIRM=broadcast-testnet, a key file holding one hex key
 * that is not the mainnet admin wallet's, and no ops/KILL file (checked again before every transaction). Mainnet is refused
 * outright, before anything is read. The key's address must be the testnet root this canary was built for: build with
 * XA_TESTNET_ROOT=<that address> (the default testnet root is the mainnet admin's key, which the guard never accepts).
 *
 * It runs the deploy, registry and release steps. The run proof and the board moves (and the audit, which checks the boards)
 * need the embedded arcade, so they stay in the page; the runner refuses them.
 */
import {
  AnchorMode, makeContractCall, makeContractDeploy, makeSTXTokenTransfer, PostConditionMode,
  type ClarityValue, type PostCondition
} from '@stacks/transactions';
import { chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as E from './engine';

// --full adds what makes the testnet leaderboard and games contract look like the mainnet ones: every arcade board, and two test games
export const FULL_EXTRA_STEPS = ['boards26', 'testgames'];
export const DEFAULT_STEPS = ['connect', 'preflight', 'core', 'fixtures', 'deploy', 'kinds', 'hall', 'setup', 'registry', 'pack-engine', 'pack-hall', 'parent', 'release', 'ownership'];

type Args = { network: string; execute: boolean; keyFile: string | null; address: string | null; steps: string[] | null; stateDir: string; yes: boolean; forget: boolean; list: boolean; full: boolean };
const parse = (argv: string[]): Args => {
  const a: Args = { network: '', execute: false, keyFile: null, address: null, steps: null, stateDir: join(homedir(), '.xtrata-arcade-v2-launch'), yes: false, forget: false, list: false, full: false };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i], v = () => { const x = argv[++i]; if (x === undefined) throw new Error(`${k} needs a value`); return x; };
    if (k === '--network') a.network = v();
    else if (k === '--execute') a.execute = true;
    else if (k === '--key-file') a.keyFile = v();
    else if (k === '--address') a.address = v();
    else if (k === '--steps') a.steps = v().split(',').map((s) => s.trim()).filter(Boolean);
    else if (k === '--state-dir') a.stateDir = v();
    else if (k === '--yes') a.yes = true;
    else if (k === '--forget') a.forget = true;
    else if (k === '--list') a.list = true;
    else if (k === '--full') a.full = true;
    else throw new Error(`unknown option ${k}`);
  }
  return a;
};
const repoRoot = () => process.env.XA_REPO || resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const errText = (e: unknown) => (e instanceof Error ? e.message : String(e));

/** Returns the exit code: 0 all steps passed, 1 a step failed, 2 refused (mainnet, guard, configuration). */
export async function main(argv: string[]): Promise<number> {
  let a: Args;
  try { a = parse(argv); } catch (e) { console.error(`REFUSED: ${errText(e)}`); return 2; }
  if (a.network !== 'testnet') {
    console.error(`REFUSED: the headless runner is testnet only (got --network ${a.network || '(none)'}). Mainnet launches run in the page, from the root wallet.`);
    return 2;
  }
  const guard = await import(pathToFileURL(join(repoRoot(), 'contracts/arcade-world/ops/lib/guard.mjs')).href);
  let key: string | null = null, address: string;
  if (a.execute) {
    try { ({ key, sender: address } = guard.authoriseBroadcast({ network: 'testnet', execute: true, keyFile: a.keyFile })); }
    catch (e) { console.error(`REFUSED: ${errText(e)}`); return 2; }
  } else {
    if (!a.address) { console.error('REFUSED: a dry run needs --address ST… (the key file is read only when sending, with --execute)'); return 2; }
    address = a.address;
    console.log('DRY RUN: reads only. The first step that would send stops the run; nothing is signed.');
  }
  // state (progress and the temporary wallet's key) lives in a private folder, one file per network
  mkdirSync(a.stateDir, { recursive: true, mode: 0o700 });
  const file = join(a.stateDir, 'testnet.json');
  let store: Record<string, string> = {};
  try { if (existsSync(file)) store = JSON.parse(readFileSync(file, 'utf8')); } catch { console.error(`could not read ${file}; starting empty`); }
  const persist = () => { writeFileSync(file, JSON.stringify(store, null, 2)); try { chmodSync(file, 0o600); } catch { /* ignore */ } };
  let lastStatus = '', lastAt = 0;
  const rl = a.yes ? null : createInterface({ input: process.stdin, output: process.stdout });
  const ensureSend = () => {
    if (!key) throw new Error('dry run: this step would send a transaction; nothing was sent (add --execute to send)');
    if (guard.killed()) throw new Error(`kill switch is on (${guard.killFile()} exists): nothing was sent`);
    return key;
  };
  const feeFor = (bytes: number) => BigInt(Math.max(20_000, bytes * 2));
  const signer: E.Signer = {
    address, label: 'key file',
    async call(target: string, fn: string, args: ClarityValue[], pcs: PostCondition[]) {
      const k = ensureSend();
      const [contractAddress, contractName] = target.split('.');
      const nonce = await E.chain.nonce(address);
      const build = (fee: bigint) => makeContractCall({ contractAddress, contractName, functionName: fn, functionArgs: args, senderKey: k, network: E.chain.stacks,
        nonce, fee, anchorMode: AnchorMode.Any, postConditionMode: PostConditionMode.Deny, postConditions: pcs });
      const size = (await build(0n)).serialize().length;
      return E.chain.broadcast(await build(feeFor(size)));
    },
    async deploy(name: string, code: string, clarityVersion: number) {
      const k = ensureSend();
      const nonce = await E.chain.nonce(address);
      const fee = BigInt(new TextEncoder().encode(code).length) * E.FEE_EST.deployPerByte;
      if (clarityVersion <= 3) {
        const tx = await makeContractDeploy({ contractName: name, codeBody: code, senderKey: k, network: E.chain.stacks, clarityVersion: clarityVersion as any,
          nonce, fee, anchorMode: AnchorMode.Any, postConditionMode: PostConditionMode.Deny });
        return E.chain.broadcast(tx);
      }
      // @stacks/transactions v6 (the page's) stops at Clarity 3; Clarity 4 deploys are built with v7, as the ops tools do.
      const V7 = createRequire(join(repoRoot(), 'contracts/arcade-world/package.json'))('@stacks/transactions');
      const tx = await V7.makeContractDeploy({ contractName: name, codeBody: code, senderKey: k, network: 'testnet', clarityVersion: clarityVersion,
        nonce, fee, postConditionMode: V7.PostConditionMode.Deny });
      return E.chain.broadcastRaw(tx.serialize());
    },
    async transfer(recipient: string, amount: bigint, memo: string) {
      const k = ensureSend();
      const nonce = await E.chain.nonce(address);
      return E.chain.broadcast(await makeSTXTokenTransfer({ recipient, amount, memo, senderKey: k, network: E.chain.stacks, nonce, fee: 5_000n, anchorMode: AnchorMode.Any }));
    }
  };
  const host: E.Host = {
    log(level, msg, txid) { console.log(`${level === 'error' ? '  !! ' : level === 'warn' ? '  ?  ' : '     '}${msg}${txid ? ` ${E.chain.txUrl(txid)}` : ''}`); },
    status(text) { if (text !== lastStatus && Date.now() - lastAt > 2000) { console.log(`  …  ${text}`); lastStatus = text; lastAt = Date.now(); } },
    async confirm(msg) {
      console.log(`\n${msg}`);
      if (a.yes) { console.log('  (--yes: continuing)'); return true; }
      return /^y(es)?$/i.test((await rl!.question('Continue? [y/N] ')).trim());
    },
    saveFile(name, data) {
      const out = join(a.stateDir, name);
      writeFileSync(out, JSON.stringify(data, null, 2)); try { chmodSync(out, 0o600); } catch { /* ignore */ }
      console.log(`     saved ${out}`);
    },
    storage: { get: (k) => store[k] ?? null, set: (k, v) => { store[k] = v; persist(); }, remove: (k) => { delete store[k]; persist(); } },
    async connect() { return { ...signer, publicKey: null }; },
    async readHall(registry) {
      const H = await import(pathToFileURL(join(repoRoot(), 'contracts/arcade-world/ops/lib/hallread.mjs')).href);
      return H.readHall({ read: H.networkRead({ apiBase: E.chain.bases[E.chain.bases.length - 1] }), registry });
    }
  };
  try {
    E.init('testnet', host);
    if (a.forget) { E.forget(); console.log('local progress forgotten: every step re-reads the chain'); }
    if (address !== E.rootAddr()) {
      console.error(`REFUSED: the key's address ${address} is not the testnet root this canary was built for (${E.rootAddr()}). ${E.H1()} Rebuild with XA_TESTNET_ROOT=${address}.`);
      return 2;
    }
    const all = E.steps();
    if (a.list) { for (const s of all) console.log(`${s.id.padEnd(12)} ${E.BROWSER_ONLY.has(s.id) ? '(page only) ' : ''}${s.title} · ${s.who}`); return 0; }
    const want = a.steps || (a.full ? [...DEFAULT_STEPS, ...FULL_EXTRA_STEPS] : DEFAULT_STEPS);
    for (const id of want) {
      if (!all.some((s) => s.id === id)) { console.error(`REFUSED: no step "${id}" on testnet (use --list)`); return 2; }
      if (E.BROWSER_ONLY.has(id)) { console.error(`REFUSED: "${id}" needs the page (the run proof and the board moves fly and re-play a run in the embedded arcade)`); return 2; }
    }
    console.log(`testnet · root ${E.rootAddr()} · core ${E.state.core} · ${want.length} step(s) · state ${file}`);
    for (const id of want) {
      const s = all.find((x) => x.id === id)!;
      const st = E.step(id);
      console.log(`\n== ${id}: ${s.title}`);
      st.status = 'running'; st.note = undefined; E.save();
      try {
        const note = await s.run();
        st.status = 'pass'; st.note = note || 'passed'; E.save();
        console.log(`PASS ${id}: ${st.note}`);
      } catch (error) {
        st.status = 'fail'; st.note = errText(error); E.save();
        console.log(`FAIL ${id}: ${st.note}`);
        return 1;
      }
    }
    console.log(`\nall ${want.length} steps passed`);
    return 0;
  } finally { rl?.close(); }
}

const invoked = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
if (invoked) main(process.argv.slice(2)).then((code) => process.exit(code), (e) => { console.error(e); process.exit(1); });
