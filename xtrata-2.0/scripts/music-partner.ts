/**
 * Manage music referral partners in public/music-partners.json, one at a time.
 *
 *   npx vite-node scripts/music-partner.ts list
 *   npx vite-node scripts/music-partner.ts add <slug> "<Name>" <SP address> [--share 0.5] [--self-referral] [--self-share 0.3] [--min-payout-ustx 10000]
 *   npx vite-node scripts/music-partner.ts deactivate <slug>
 *   npx vite-node scripts/music-partner.ts activate <slug>
 *
 * Without --share a partner gets the standard share (25%). Review the diff, then open a pull request.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { addPartner, listPartners, setActive } from '../src/agent-one/partner-admin';

const FILE = fileURLToPath(new URL('../public/music-partners.json', import.meta.url));
const argv = process.argv.slice(2);
const [cmd, ...rest] = argv;
const flag = (name: string): string | undefined => { const i = rest.indexOf('--' + name); return i >= 0 ? rest[i + 1] : undefined; };
const num = (v: string | undefined): number | undefined => (v === undefined ? undefined : Number(v));
const die = (lines: string[]): never => { console.error(lines.join('\n')); process.exit(1); };

const raw = JSON.parse(readFileSync(FILE, 'utf8'));
const save = (res: ReturnType<typeof addPartner>) => {
  if (!res.ok) die(res.errors);
  else { writeFileSync(FILE, JSON.stringify(res.registry, null, 2) + '\n'); console.log(res.summary); }
};

if (cmd === 'list') console.log(listPartners(raw).join('\n') || '(no partners)');
else if (cmd === 'add') {
  const [slug, name, address] = rest;
  if (!slug || !name || !address) die(['usage: add <slug> "<Name>" <SP address> [--share 0.5] [--self-referral]']);
  save(addPartner(raw, {
    slug, name, address, share: num(flag('share')), selfReferral: rest.includes('--self-referral') || undefined,
    selfShare: num(flag('self-share')), minPayoutUstx: num(flag('min-payout-ustx')),
  }));
} else if (cmd === 'deactivate' || cmd === 'activate') {
  if (!rest[0]) die([`usage: ${cmd} <slug>`]);
  save(setActive(raw, rest[0], cmd === 'activate'));
} else die(['commands: list | add | activate | deactivate']);
