// Keeps build-only folders out of the deployed site.
//
// public/casino-machines/<machine>/ holds each machine's page (index.html, pack.json,
// pack.js, art, vendor) and also the working files used to make it (checks, build, notes,
// brief, tools, and src). Vite copies the whole public/ folder into dist/, so every deploy
// was shipping about 100 MB that no page ever loads.
//
// This removes those folders from dist/ only. Nothing in the repository moves, so every
// machine's own build and test scripts keep working. A folder is left alone if the machine's
// page or pack refers to it (dog-army and mooneeb load src/software.js, for example).
import fs from 'node:fs';
import path from 'node:path';

const PRUNE = ['checks', 'build', 'notes', 'brief', 'tools', 'src'];
const ENTRY_FILES = ['index.html', 'pack.js', 'pack.json'];

export function pruneCasinoMachines(distDir) {
  const root = path.join(distDir, 'casino-machines');
  const removed = [];
  const kept = [];
  if (!fs.existsSync(root)) return { removed, kept };
  for (const machine of fs.readdirSync(root, { withFileTypes: true })) {
    if (!machine.isDirectory()) continue;
    const dir = path.join(root, machine.name);
    let text = '';
    for (const f of ENTRY_FILES) {
      const p = path.join(dir, f);
      if (fs.existsSync(p)) text += fs.readFileSync(p, 'utf8') + '\n';
    }
    for (const sub of PRUNE) {
      const target = path.join(dir, sub);
      if (!fs.existsSync(target)) continue;
      const referenced = new RegExp('(^|[^A-Za-z0-9_-])' + sub + '/').test(text);
      if (referenced) { kept.push(machine.name + '/' + sub); continue; }
      fs.rmSync(target, { recursive: true, force: true });
      removed.push(machine.name + '/' + sub);
    }
  }
  return { removed, kept };
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  const r = pruneCasinoMachines(path.resolve(process.argv[2] || 'dist'));
  console.log('pruned ' + r.removed.length + ' folders; kept ' + r.kept.length + (r.kept.length ? ': ' + r.kept.join(', ') : ''));
}
