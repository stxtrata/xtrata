const { chromium } = require('playwright'); const fs = require('fs');
const seeds = process.argv[2].split(',').map(Number), out = require('path').join(__dirname, 'raw', 'cicada');
fs.mkdirSync(out, { recursive: true });
(async () => {
  const b = await chromium.launch({ args: ['--mute-audio'] }); const p = await b.newPage({ viewport: { width: 600, height: 600 } });
  p.on('pageerror', e => console.log('ERR', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('CERR', m.text()); });
  await p.goto('http://127.0.0.1:8092/harness.html'); await p.waitForFunction(() => window.ready); if (process.env.OV) await p.evaluate(o => { window.OV = JSON.parse(o); }, process.env.OV);
  const meta = {};
  for (const s of seeds) {
    const m = await p.evaluate(async s => { const st = document.getElementById('stage'); st.replaceChildren(); window.cur && window.cur.destroy(); window.cur = C.renderCicada({ seed: s, mount: st, instructionOverrides: window.OV || {}, interactive: false, enableAudio: false, pageStyles: false, clearMount: true }); const md = C.getMetadataForSeed(s); md.instr = C.getRenderInstructionsForSeed(s); return md; }, s);
    await p.waitForTimeout(1800);
    await p.screenshot({ path: `${out}/seed-${s}.png` });
    const pcm = await p.evaluate(s => { const md = C.getMetadataForSeed(s); const r = C.renderSignatureCall(s, md.rarityTier || 'Common'); const d = r.data || r; const a = Array.from(d instanceof Float32Array ? d : (d.samples || d)); return { n: a.length, sr: r.sampleRate || r.sr || 44100, keys: Object.keys(r || {}).slice(0, 10), b64: (() => { const u = new Uint8Array(new Int16Array(a.map(x => Math.max(-1, Math.min(1, x)) * 32767)).buffer); let s = ''; for (let i = 0; i < u.length; i += 8192) s += String.fromCharCode.apply(null, u.subarray(i, i + 8192)); return btoa(s); })() }; }, s).catch(e => ({ err: e.message }));
    if (pcm.b64) fs.writeFileSync(`${out}/seed-${s}.pcm`, Buffer.from(pcm.b64, 'base64'));
    meta[s] = { meta: m, pcm: { n: pcm.n, sr: pcm.sr, keys: pcm.keys, err: pcm.err } };
    console.log(s, JSON.stringify(m).slice(0, 300), pcm.n, pcm.sr, pcm.err || '');
  }
  fs.writeFileSync(`${out}/meta-${seeds[0]}.json`, JSON.stringify(meta, null, 1)); await b.close();
})();
