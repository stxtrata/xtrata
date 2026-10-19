#!/usr/bin/env node
// Generate a poster file from a short list.
//   node ops/campaign.mjs rotation items.json --height N --days 7 [--each 1] [--overlap 1] [--set community] [--out file]
//   node ops/campaign.mjs calendar events.json --height N [--today-date 2026-10-19] [--lead 2] [--out file]
// items.json: [{ "head": "...", "sub": "...", "art": "...", "colour": "...", "action": { "kind": "path", "path": "/arcade" } }, ...]
// events.json: [{ "date": "2026-11-02", "head": "...", ... }]  (or "day": <Bitcoin day>)
import { readFileSync, writeFileSync } from 'node:fs';
import { parseArgs, die } from './lib/cli.mjs';
import { rotation, calendar, dayOf } from './lib/campaign.mjs';
import { transportFromArgs } from './lib/context.mjs';

const args = parseArgs(process.argv.slice(2), { height: 'value', days: 'value', each: 'value', overlap: 'value', set: 'value', weight: 'value', lead: 'value', todayDate: 'value', out: 'value', start: 'value', network: 'value', world: 'value', posters: 'value' });
const [mode, file] = args._;
if (!['rotation', 'calendar'].includes(mode) || !file) die('usage: node ops/campaign.mjs rotation|calendar <list.json> --height N ...');
const t = transportFromArgs(args);
const height = t ? await t.height() : args.height != null ? Number(args.height) : null;
if (height == null) die('give --height N (the current block height) or --network');
const today = dayOf(height);
const list = JSON.parse(readFileSync(file, 'utf8'));
const defaults = { set: args.set || 'community', weight: args.weight != null ? Number(args.weight) : 5 };
const doc = mode === 'rotation'
  ? rotation({ items: list, startDay: args.start != null ? Number(args.start) : today + 1, days: Number(args.days || 7), each: Number(args.each || 1), overlap: Number(args.overlap || 1), defaults })
  : calendar({ events: list, todayDay: today, todayDate: args.todayDate || null, lead: Number(args.lead || 2), defaults });
const text = JSON.stringify(doc, null, 2) + '\n';
if (args.out) { writeFileSync(args.out, text); console.log(`${doc.posters.length} poster(s) written to ${args.out} (anchored at day ${today}; today's date is not used unless you gave --today-date)`); } else process.stdout.write(text);
