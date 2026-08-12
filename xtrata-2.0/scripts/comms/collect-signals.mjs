#!/usr/bin/env node
//
// Harvests the day's facts for the @XtrataLayers posting harness.
//
//   node scripts/comms/collect-signals.mjs
//   node scripts/comms/collect-signals.mjs --date 2026-08-11 --offline
//
// Writes comms/signals/YYYY-MM-DD.json. Every signal is a fact with a source
// and a timestamp. No prose, no opinion, no drafting. The drafting step reads
// this file and may only make claims that trace back to a signal id.
//
// Following the house convention in CLAUDE.md: a read that FAILED and a read
// that returned NOTHING are never collapsed. Every collector returns
// { value, ok, error }, and the drafting step must treat ok:false as "could
// not check right now" rather than as an absence. A throttled Hiro call must
// never become a post claiming activity stopped.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { callReadOnlyFunction, cvToJSON } from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';

const root = new URL('../../', import.meta.url);
const rel = (p) => fileURLToPath(new URL(p, root));

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const at = args.indexOf(`--${name}`);
  return at === -1 ? fallback : args[at + 1];
};
const OFFLINE = args.includes('--offline');
const DATE = flag('date', new Date().toISOString().slice(0, 10));
const CONTRACT = flag(
  'contract',
  'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3'
);
const API_URL = (process.env.XTRATA_MAINNET_API_URL ?? 'https://api.hiro.so').replace(/\/$/, '');

const readEnvLocal = () => {
  const file = rel('.env.local');
  if (!existsSync(file)) return '';
  const line = readFileSync(file, 'utf8').split('\n').find((l) => l.startsWith('HIRO_API_KEY='));
  return line ? line.slice('HIRO_API_KEY='.length).trim().replace(/^["']|["']$/g, '') : '';
};
const API_KEY = process.env.HIRO_API_KEY ?? readEnvLocal();

const ok = (value, meta = {}) => ({ ok: true, value, ...meta });
const fail = (error, meta = {}) => ({ ok: false, value: null, error: String(error), ...meta });

const readJson = (path) => {
  try {
    return ok(JSON.parse(readFileSync(rel(path), 'utf8')), { source: path });
  } catch (error) {
    return fail(error, { source: path });
  }
};

// ---------------------------------------------------------------- chain reads

const network = new StacksMainnet({ url: API_URL });
if (API_KEY) {
  network.fetchFn = (url, init = {}) =>
    fetch(url, { ...init, headers: { ...(init.headers || {}), 'x-api-key': API_KEY } });
}

const [ADDRESS, NAME] = CONTRACT.split('.');

const readOnly = async (functionName, functionArgs = []) => {
  const cv = await callReadOnlyFunction({
    contractAddress: ADDRESS,
    contractName: NAME,
    functionName,
    functionArgs,
    senderAddress: ADDRESS,
    network
  });
  return cvToJSON(cv);
};

const unwrap = (json) => {
  if (json === null || json === undefined) return null;
  const type = String(json.type ?? '');
  if (type.startsWith('(response') || type.startsWith('(optional') || type === 'responseOk' || type === 'optional') {
    return unwrap(json.value);
  }
  if (type === 'uint' || type === 'int') return Number(json.value);
  if (type === 'bool') return Boolean(json.value);
  return json.value ?? null;
};

const collectSupply = async () => {
  if (OFFLINE) return fail('offline mode', { source: CONTRACT });
  try {
    const json = await readOnly('get-last-token-id');
    return ok(unwrap(json), { source: `${CONTRACT}.get-last-token-id` });
  } catch (error) {
    return fail(error, { source: `${CONTRACT}.get-last-token-id` });
  }
};

const collectTip = async () => {
  if (OFFLINE) return fail('offline mode', { source: `${API_URL}/v2/info` });
  try {
    const res = await fetch(`${API_URL}/v2/info`, {
      headers: API_KEY ? { 'x-api-key': API_KEY } : {}
    });
    if (!res.ok) return fail(`HTTP ${res.status}`, { source: `${API_URL}/v2/info` });
    const info = await res.json();
    return ok(
      { stacksTipHeight: info.stacks_tip_height ?? null, burnBlockHeight: info.burn_block_height ?? null },
      { source: `${API_URL}/v2/info` }
    );
  } catch (error) {
    return fail(error, { source: `${API_URL}/v2/info` });
  }
};

// X Chess went live as inscription 2988 on 2026-08-11. Game and move counts are
// the most quotable numbers the platform has and they move constantly, so they
// are harvested rather than remembered. Anything posted about X Chess activity
// must cite this signal.
const XCHESS = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xchess-core-v1-canary';

const collectXChess = async () => {
  if (OFFLINE) return fail('offline mode', { source: XCHESS });
  const [address, name] = XCHESS.split('.');
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const read = async (functionName) => {
    // Hiro rate-limits hard enough to throttle a tight loop, and a 429 read
    // must surface as unknown rather than as zero games.
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        const cv = await callReadOnlyFunction({
          contractAddress: address,
          contractName: name,
          functionName,
          functionArgs: [],
          senderAddress: address,
          network
        });
        return unwrap(cvToJSON(cv));
      } catch (error) {
        if (attempt === 2) throw error;
        await sleep(3000);
      }
    }
    return null;
  };

  const readGame = async (id) => {
    const { uintCV } = await import('@stacks/transactions');
    const cv = await callReadOnlyFunction({
      contractAddress: address,
      contractName: name,
      functionName: 'get-game',
      functionArgs: [uintCV(id)],
      senderAddress: address,
      network
    });
    const json = cvToJSON(cv);
    const inner = json?.value?.value ?? json?.value ?? null;
    if (!inner) return null;
    const out = {};
    for (const [k, v] of Object.entries(inner)) {
      out[k] = v?.type === 'uint' ? Number(v.value) : v?.type === 'bool' ? Boolean(v.value) : v?.value;
    }
    return out;
  };

  // Walking every game is what turns "9 games" into "80 moves", which is the
  // far better number. Capped so this cannot quietly become a hundred requests
  // per run as the game count grows. When the cap bites, `movesComplete` goes
  // false and nothing may be published as a total.
  const WALK_CAP = 40;

  try {
    const gameCount = await read('get-game-count');
    await sleep(900);
    const rankedCount = await read('get-ranked-count');
    await sleep(900);
    const openFee = await read('get-open-fee');
    await sleep(900);
    const solvent = await read('is-solvent');

    let movesTotal = 0;
    let walked = 0;
    let longestGame = null;
    const openers = new Set();
    let walkFailed = false;

    const toWalk = Math.min(typeof gameCount === 'number' ? gameCount : 0, WALK_CAP);
    for (let id = 1; id <= toWalk; id += 1) {
      await sleep(1100);
      try {
        const game = await readGame(id);
        if (!game) continue;
        walked += 1;
        const moves = game['next-seq'] ?? 0;
        movesTotal += moves;
        if (game['opened-by']) openers.add(game['opened-by']);
        if (!longestGame || moves > longestGame.moves) {
          longestGame = { id, moves, ranked: Boolean(game.ranked) };
        }
      } catch {
        walkFailed = true;
      }
    }

    const movesComplete = !walkFailed && walked === (gameCount ?? 0);

    return ok(
      {
        inscription: 2988,
        url: 'https://xtrata.xyz/i/2988',
        gameCount,
        rankedCount,
        openFeeMicroStx: openFee,
        openFeeStx: typeof openFee === 'number' ? openFee / 1_000_000 : null,
        solvent,
        movesTotal,
        movesComplete,
        gamesWalked: walked,
        distinctOpeners: openers.size,
        longestGame
      },
      {
        source: XCHESS,
        note: movesComplete
          ? null
          : `Move total covers ${walked} of ${gameCount} games. Do not publish it as a total.`
      }
    );
  } catch (error) {
    return fail(error, { source: XCHESS });
  }
};

// ------------------------------------------------------------- repo snapshots

// The committed snapshot is authoritative for fees, but only as fresh as the
// last run of xtrata-state-snapshot.mjs.
//
// It deliberately carries NO wall-clock timestamp: `observed` holds tip height
// and supply precisely so a routine block-height change does not read as a fee
// change in the diff. So staleness is measured in blocks and tokens, not days.
// Doing it any other way means inventing a timestamp the file does not have.
//
// The drift is also a content signal in its own right. "N inscriptions since
// the last snapshot" is a fact with a source, which is exactly what the
// drafting step is allowed to use.
const collectContractState = (liveTokenId, liveTip) => {
  const snap = readJson('state/mainnet-xtrata-v3-2-3.json');
  if (!snap.ok) return snap;

  const observed = snap.value.observed ?? {};
  const tokensSince =
    liveTokenId.ok && typeof observed.lastTokenId === 'number'
      ? liveTokenId.value - observed.lastTokenId
      : null;
  const blocksSince =
    liveTip.ok && liveTip.value.stacksTipHeight && observed.stacksTipHeight
      ? liveTip.value.stacksTipHeight - observed.stacksTipHeight
      : null;

  // Roughly a week of Stacks blocks. Past this, do not quote a fee from the
  // committed file without re-running the snapshot.
  const STALE_BLOCKS = 10000;
  const stale = blocksSince !== null && blocksSince > STALE_BLOCKS;

  return ok(
    {
      version: snap.value.state?.version ?? null,
      paused: snap.value.state?.paused ?? null,
      feeUnits: snap.value.state?.feeUnits ?? null,
      singleTxFeeForOneChunk:
        snap.value.state?.quotes?.['article-1-chunk']?.single?.['total-fee'] ?? null,
      snapshotObserved: observed,
      tokensSinceSnapshot: tokensSince,
      blocksSinceSnapshot: blocksSince
    },
    {
      source: 'state/mainnet-xtrata-v3-2-3.json',
      stale,
      note: stale
        ? `Snapshot is ${blocksSince} blocks behind the tip. Re-run scripts/xtrata-state-snapshot.mjs before quoting any fee.`
        : null
    }
  );
};

const collectDrops = () => {
  const reg = readJson('src/data/drops-registry.json');
  if (!reg.ok) return reg;
  return ok(
    reg.value.map((d) => ({
      label: d.label,
      contract: `${d.address}.${d.contractName}`,
      network: d.network,
      sponsored: d.sponsored
    })),
    {
      source: 'src/data/drops-registry.json',
      note: 'Registry lists configured drops. It does NOT prove any drop has live supply. Check the contract before naming one.'
    }
  );
};

// The manifest is a JS file, not JSON: it assigns a frozen object to window so
// the inscribed page can read it without a fetch. Slice the literal out rather
// than importing it, because there is no window here.
const collectXBoard = () => {
  const source = 'recursive-apps/x-board/xboard-version-testing/latest-manifest.js';
  try {
    const raw = readFileSync(rel(source), 'utf8');
    const start = raw.indexOf('Object.freeze(');
    const end = raw.lastIndexOf(');');
    if (start === -1 || end === -1) {
      return fail('manifest present but not in the expected shape', { source });
    }
    const manifest = JSON.parse(raw.slice(start + 'Object.freeze('.length, end));
    return ok(
      {
        generatedAt: manifest.generatedAt ?? null,
        latest: manifest.latest ?? null,
        versionCount: (manifest.versions ?? []).length
      },
      { source }
    );
  } catch (error) {
    return fail(
      `${error}. Run npm run xboard:versions:manifest to build it.`,
      { source }
    );
  }
};

const collectSurfaces = () => {
  const reg = readJson('comms/registry/surfaces.json');
  if (!reg.ok) return reg;
  const surfaces = reg.value.surfaces ?? [];
  return ok(
    {
      live: surfaces.filter((s) => s.status === 'live').map((s) => s.id),
      building: surfaces.filter((s) => s.status === 'building').map((s) => s.id),
      excluded: surfaces
        .filter((s) => s.status === 'not-ready')
        .map((s) => ({ id: s.id, reason: s.notes ?? 'marked not-ready' }))
    },
    { source: 'comms/registry/surfaces.json' }
  );
};

// Reads the published journal so the drafting step can enforce the no-repeat
// rule without re-parsing it itself.
const collectHistory = () => {
  const path = rel('comms/journal/index.jsonl');
  if (!existsSync(path)) {
    return ok({ totalPosts: 0, recentHooks: [], lastPostedBySurface: {} }, {
      source: 'comms/journal/index.jsonl',
      note: 'No journal yet. This is the first run.'
    });
  }
  try {
    const lines = readFileSync(path, 'utf8').split('\n').filter((l) => l.trim());
    const entries = lines.map((l) => JSON.parse(l));
    const cutoff = Date.parse(DATE) - 60 * 86400000;
    const lastPostedBySurface = {};
    for (const e of entries) {
      if (!e.surface) continue;
      if (!lastPostedBySurface[e.surface] || e.date > lastPostedBySurface[e.surface]) {
        lastPostedBySurface[e.surface] = e.date;
      }
    }
    return ok(
      {
        totalPosts: entries.length,
        recentHooks: entries
          .filter((e) => Date.parse(e.date) >= cutoff)
          .map((e) => ({ date: e.date, surface: e.surface, angle: e.angle, hook: e.hook })),
        lastPostedBySurface
      },
      { source: 'comms/journal/index.jsonl' }
    );
  } catch (error) {
    return fail(error, { source: 'comms/journal/index.jsonl' });
  }
};

// ---------------------------------------------------------------------- main

const main = async () => {
  const lastTokenId = await collectSupply();
  const tip = await collectTip();

  const signals = {
    date: DATE,
    collectedAt: new Date().toISOString(),
    offline: OFFLINE,
    contract: CONTRACT,
    chain: {
      lastTokenId,
      tip,
      contractState: collectContractState(lastTokenId, tip),
      xchess: await collectXChess()
    },
    repo: {
      drops: collectDrops(),
      xboard: collectXBoard(),
      surfaces: collectSurfaces()
    },
    history: collectHistory(),
    // Filled in by the daily run, which has WebSearch. Each item:
    // { id, headline, url, source, date, whyItMatters, respondable: bool }
    news: []
  };

  const out = rel(`comms/signals/${DATE}.json`);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, `${JSON.stringify(signals, null, 2)}\n`);

  const failures = [];
  const walk = (node, path = []) => {
    if (node && typeof node === 'object') {
      if ('ok' in node && node.ok === false) failures.push(`${path.join('.')}: ${node.error}`);
      else for (const [k, v] of Object.entries(node)) walk(v, [...path, k]);
    }
  };
  walk(signals);

  console.log(`wrote comms/signals/${DATE}.json`);
  if (failures.length) {
    console.log('\ncould not read (treat as unknown, NOT as zero):');
    failures.forEach((f) => console.log(`  ${f}`));
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
