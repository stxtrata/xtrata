#!/usr/bin/env node
// The serverlessness audit.
//
// Production X Chess must not require a server of any kind. Not an API, not a
// signing service, not a leaderboard, not a database, not a websocket. The
// point of the whole architecture is that the application keeps working when
// every machine anybody involved has ever operated is gone.
//
// That is easy to state and easy to violate by accident: one import, one URL
// left in during development, one convenience endpoint. So it is checked
// mechanically rather than by intention, and the check is a release gate.
//
//   node harness/serverless-audit.mjs
//
// Exits non-zero on any finding.

import { readFile, readdir, stat } from 'node:fs/promises';
import { extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));

/**
 * What gets audited.
 *
 * Everything that can end up in the permanent artefact. Deliberately NOT the
 * tests or the harness: those are development tooling, they never ship, and
 * forbidding a localhost URL in a test that exists to check localhost handling
 * would be absurd.
 */
const AUDITED = ['packages', 'apps', 'contracts', 'dist'];

/** Extensions worth reading. */
const SOURCE = new Set(['.ts', '.js', '.mjs', '.cjs', '.html', '.json', '.clar', '.css']);

/**
 * Every pattern is something that, if it appeared in shipped code, would mean
 * the application had acquired a dependency on somebody staying online.
 *
 * `why` is shown on a hit, because a bare pattern name does not tell the person
 * reading the failure what rule they have broken.
 */
const FORBIDDEN = [
  {
    name: 'backend framework',
    pattern: /\b(from|require\()\s*['"](express|next\/server|fastify|koa|hapi|nest)/,
    why: 'a server framework in shipped code means there is a server'
  },
  {
    name: 'hosted database or backend service',
    pattern: /\b(firebase|supabase|@planetscale|mongodb|pg|mysql2|redis|ioredis|@vercel\/kv)\b/,
    why: 'no database is authoritative; the chain is'
  },
  {
    name: 'serverless function platform',
    pattern: /\b(aws-lambda|@aws-sdk|cloudflare:workers|@netlify\/functions|@vercel\/node)\b/,
    why: 'a function that has to be deployed is a server with extra steps'
  },
  {
    name: 'websocket',
    pattern: /\bnew\s+WebSocket\s*\(|\bsocket\.io\b|\bwss:\/\//,
    why: 'a socket needs something at the other end of it'
  },
  {
    name: 'localhost or private address',
    pattern: /https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|192\.168\.|10\.[0-9]+\.)/,
    why: 'a development address cannot be reachable from an inscription'
  },
  {
    name: 'an X Chess operated host',
    pattern: /https?:\/\/(?:[a-z0-9-]+\.)*(xchess\.xyz|api\.xchess|chess-api)/i,
    why: 'the application must keep working when xchess.xyz is gone'
  },
  {
    name: 'a private or signing endpoint',
    pattern: /\/(api|internal|admin)\/(sign|sponsor|relay|submit|leaderboard|session)/i,
    why: 'no private API, and above all no signing service'
  },
  {
    name: 'an embedded secret',
    pattern: /\b(sk_live|sk_test|x402_sk|api[_-]?key\s*[:=]\s*['"][A-Za-z0-9_\-]{16,})/i,
    why: 'a key in a permanent artefact is a key that is published forever'
  },
  {
    name: 'a private key or mnemonic',
    pattern: /\b(mnemonic|seedPhrase|privateKey)\s*[:=]\s*['"][^'"]{16,}/i,
    why: 'never embed a key; the user holds their own'
  }
];

/**
 * Lines that are allowed to mention something forbidden.
 *
 * An audit with no escape hatch gets disabled the first time it is
 * inconvenient. This one has exactly one, it has to be written deliberately on
 * the line above, and it is reported in the summary so that a growing pile of
 * them is visible rather than quiet.
 */
const ALLOW_MARKER = 'serverless-audit-allow:';

async function* walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return; // A directory that does not exist yet is not a finding.
  }
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      yield* walk(path);
    } else if (SOURCE.has(extname(entry.name))) {
      yield path;
    }
  }
}

async function audit() {
  const findings = [];
  const allowances = [];
  let filesRead = 0;

  for (const dir of AUDITED) {
    for await (const path of walk(join(ROOT, dir))) {
      const text = await readFile(path, 'utf8');
      filesRead++;
      const lines = text.split('\n');

      for (const [index, line] of lines.entries()) {
        const previous = index > 0 ? lines[index - 1] : '';
        const allowed = previous.includes(ALLOW_MARKER);

        for (const rule of FORBIDDEN) {
          if (!rule.pattern.test(line)) continue;
          const record = {
            file: relative(ROOT, path),
            line: index + 1,
            rule: rule.name,
            why: rule.why,
            text: line.trim().slice(0, 120)
          };
          if (allowed) allowances.push({ ...record, reason: previous.split(ALLOW_MARKER)[1].trim() });
          else findings.push(record);
        }
      }
    }
  }

  return { findings, allowances, filesRead };
}

const { findings, allowances, filesRead } = await audit();

console.log(`serverlessness audit: read ${filesRead} files under ${AUDITED.join(', ')}`);

if (allowances.length) {
  console.log(`\n${allowances.length} explicit allowance(s):`);
  for (const item of allowances) {
    console.log(`  ${item.file}:${item.line}  ${item.rule}  -- ${item.reason}`);
  }
}

if (findings.length) {
  console.error(`\n${findings.length} finding(s):\n`);
  for (const item of findings) {
    console.error(`  ${item.file}:${item.line}`);
    console.error(`    ${item.rule}: ${item.why}`);
    console.error(`    ${item.text}\n`);
  }
  console.error('Production X Chess must not require a server. See section 5 of the brief.');
  process.exit(1);
}

console.log('\nno server dependencies found.');

// A check that cannot fail is not a check. Prove the patterns actually match.
const CANARIES = [
  ["import express from 'express'", 'backend framework'],
  ['const db = require("firebase")', 'hosted database or backend service'],
  ['fetch("http://localhost:3999/x")', 'localhost or private address'],
  ['fetch("https://api.xchess.xyz/games")', 'an X Chess operated host'],
  ['new WebSocket("wss://live.example")', 'websocket'],
  ['const mnemonic = "abandon abandon abandon ability"', 'a private key or mnemonic'],
  ['post("/api/sign", body)', 'a private or signing endpoint']
];

const missed = CANARIES.filter(([line, rule]) => {
  const found = FORBIDDEN.find((r) => r.name === rule);
  return !found || !found.pattern.test(line);
});

if (missed.length) {
  console.error('\nthe audit failed its own canaries, so it proves nothing:');
  for (const [line, rule] of missed) console.error(`  ${rule} did not match: ${line}`);
  process.exit(1);
}

console.log(`all ${CANARIES.length} canaries matched, so the patterns are live.`);
