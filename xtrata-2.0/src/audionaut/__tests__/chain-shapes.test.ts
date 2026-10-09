import path from 'node:path';
import { describe, expect, it } from 'vitest';

// Safety net for the plugin tidy-up (docs: "Plugins made familiar", stage 1). Moving the delay and
// reverb sends out of the FX list is only safe while every shipped song and Beats preset keeps its
// sends at the END of the chain. tools/chain-shapes.mjs audits that; this test keeps it true, so a
// new starter or preset with an odd shape fails here before it meets the migration.
const AUDIONAUT = path.resolve(__dirname, '../../../public/audionaut');
const tool = async () => (await import(/* @vite-ignore */ path.join(AUDIONAUT, 'tools/chain-shapes.mjs'))) as any;

describe('chain shapes', () => {
  it('classifies the shapes a migration must handle', async () => {
    const { shapeOf } = await tool();
    const s = (type: string) => ({ id: type, type, enabled: true, params: {} });
    expect(shapeOf({ inserts: [], fx: [] }).flags).toEqual(['empty']);
    expect(shapeOf({ inserts: [s('eq3')], fx: [s('chorus')] }).flags).toEqual(['both-chains']);
    expect(shapeOf({ inserts: [], fx: [s('drive'), s('delaySend')] }).flags).toEqual(['trailing-sends']);
    expect(shapeOf({ inserts: [], fx: [s('delaySend'), s('drive')] }).flags).toContain('mid-chain-send');
    expect(shapeOf({ inserts: [], fx: [s('delaySend'), s('delaySend')] }).flags).toContain('duplicate-send');
    expect(shapeOf({ inserts: [s('reverbSend')], fx: [] }).flags).toContain('send-in-inserts');
  });

  it('every shipped starter keeps its sends at the end of the chain', async () => {
    const { auditProject } = await tool();
    const fs = await import('node:fs');
    const dir = path.join(AUDIONAUT, 'daw/data/starters');
    const files = fs.readdirSync(dir).filter((f: string) => f.endsWith('.json') && f !== 'index.json');
    expect(files.length).toBeGreaterThanOrEqual(19);
    const odd = ['mid-chain-send', 'send-in-inserts', 'duplicate-send', 'unknown-type', 'insert-type-in-fx', 'fx-type-in-inserts'];
    const projects: [string, any][] = files.map((f: string) => [f, JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))]);
    projects.push(['starter-session.json', JSON.parse(fs.readFileSync(path.join(AUDIONAUT, 'daw/data/starter-session.json'), 'utf8'))]);
    for (const [label, project] of projects) {
      const rows = auditProject(label, project);
      expect(rows.length).toBeGreaterThan(0);
      for (const r of rows) expect(r.flags.filter((f: string) => odd.includes(f)), `${label} ${r.where}`).toEqual([]);
    }
  });

  it('every Beats preset writes sends at the end of the chain', async () => {
    const lib = (await import(/* @vite-ignore */ path.join(AUDIONAUT, 'daw/js/l1-beats.js'))) as any;
    const { auditProject } = await tool();
    const presets = lib.L1_BEAT_PRESETS as any[];
    expect(presets.length).toBeGreaterThan(50);
    for (const p of presets) {
      const chans = (p.channels || p.tracks || p.parts || []).map((d: any) => ({ inserts: [], fx: d.fx ? { ...d.fx } : {} }));
      for (const r of auditProject(String(p.id || p.name), { channels: chans })) {
        expect(r.flags.includes('mid-chain-send') || r.flags.includes('duplicate-send'), `${p.id} ${r.where}`).toBe(false);
      }
    }
  });
});
