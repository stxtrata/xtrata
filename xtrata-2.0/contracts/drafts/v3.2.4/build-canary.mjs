#!/usr/bin/env node
// Regenerates canary.html and the step table inside MIGRATION-PLAN.md from
// steps.json, which is the single source of truth for the v3.2.4 migration.
//
//   node contracts/drafts/v3.2.4/build-canary.mjs
//   node contracts/drafts/v3.2.4/build-canary.mjs --check   (CI: fail if stale)
//
// Edit steps.json, never canary.html or the generated block in the plan.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const STEPS = join(HERE, 'steps.json');
const CANARY = join(HERE, 'canary.html');
const PLAN = join(HERE, 'MIGRATION-PLAN.md');
const BEGIN = '<!-- BEGIN GENERATED STEPS -->';
const END = '<!-- END GENERATED STEPS -->';
const checkOnly = process.argv.includes('--check');

const spec = JSON.parse(readFileSync(STEPS, 'utf8'));
const esc = (s) =>
  String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const phaseTitle = (id) => spec.phases.find((p) => p.id === id)?.title ?? id;

// --- markdown table ----------------------------------------------------------
const mdRows = [];
for (const phase of spec.phases) {
  const steps = spec.steps.filter((s) => s.phase === phase.id);
  if (!steps.length) continue;
  mdRows.push(`\n### ${phase.id}. ${phase.title}\n`);
  mdRows.push('| Step | What | Verify | Reversible |');
  mdRows.push('|---|---|---|---|');
  for (const s of steps) {
    // Reversibility is declared explicitly, never inferred from the rollback
    // wording. "None. Read-only." means nothing to undo, not one-way-door, and
    // conflating the two would blunt the warning on the step that really is one.
    const rev = s.irreversible ? '**No**' : 'Yes';
    const title = s.conditional ? `${s.title} *(conditional)*` : s.title;
    mdRows.push(`| \`${s.id}\` | ${title} | ${s.verify} | ${rev} |`);
  }
}
const mdBlock = `${BEGIN}\n_Generated from \`steps.json\` by \`build-canary.mjs\`. Do not edit by hand._\n${mdRows.join('\n')}\n\n${END}`;

const planSrc = readFileSync(PLAN, 'utf8');
const bi = planSrc.indexOf(BEGIN);
const ei = planSrc.indexOf(END);
if (bi === -1 || ei === -1) {
  console.error(`build-canary: ${PLAN} is missing the ${BEGIN} / ${END} markers.`);
  process.exit(1);
}
const planOut = planSrc.slice(0, bi) + mdBlock + planSrc.slice(ei + END.length);

// --- canary html -------------------------------------------------------------
const stepCards = spec.steps
  .map((s) => {
    const chk = s.check ?? { kind: 'manual' };
    return `      <li class="step" data-id="${esc(s.id)}" data-phase="${esc(s.phase)}"${
      s.conditional ? ` data-conditional="${esc(s.conditional)}"` : ''
    }>
        <div class="head">
          <input type="checkbox" class="done" id="cb-${esc(s.id)}" />
          <label for="cb-${esc(s.id)}"><span class="sid">${esc(s.id)}</span> ${esc(s.title)}</label>
          ${s.conditional ? '<span class="tag cond">conditional</span>' : ''}
          ${s.irreversible ? '<span class="tag danger">irreversible</span>' : ''}
        </div>
        <div class="body">
          <p class="why"><strong>Why.</strong> ${esc(s.why)}</p>
          <p><strong>Do.</strong> ${esc(s.action)}</p>
          <p class="verify"><strong>Verify.</strong> ${esc(s.verify)}</p>
          <p class="rb"><strong>Rollback.</strong> ${esc(s.rollback)}</p>
          ${
            chk.kind === 'manual'
              ? '<p class="auto none">No automatic check. Confirm by hand.</p>'
              : `<p class="auto"><button class="run" data-check='${esc(JSON.stringify(chk))}'>Run check</button> <span class="out"></span></p>`
          }
        </div>
      </li>`;
  })
  .join('\n');

const phaseNav = spec.phases
  .map((p) => `<button class="pill" data-phase="${esc(p.id)}">${esc(p.id)}. ${esc(p.title)}</button>`)
  .join('\n        ');

const canary = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(spec.title)} canary</title>
<!--
  GENERATED FILE. Do not edit.
  Source: contracts/drafts/v3.2.4/steps.json
  Rebuild: node contracts/drafts/v3.2.4/build-canary.mjs
-->
<style>
  :root { --bg:#fbfbfd; --fg:#16161a; --mut:#63636b; --line:#e3e3e8; --ok:#0a7d3f; --bad:#b3261e; --warn:#8a5a00; --accent:#3b3bd6; }
  @media (prefers-color-scheme: dark) {
    :root { --bg:#121216; --fg:#ececf1; --mut:#9a9aa4; --line:#2a2a32; --ok:#4ade80; --bad:#ff6b6b; --warn:#fbbf24; --accent:#8b8bff; }
  }
  * { box-sizing:border-box; }
  body { margin:0; padding:2rem 1rem 6rem; background:var(--bg); color:var(--fg);
         font:15px/1.55 ui-sans-serif,-apple-system,'Segoe UI',Roboto,sans-serif; }
  .wrap { max-width:60rem; margin:0 auto; }
  h1 { font-size:1.5rem; margin:0 0 .25rem; }
  .sub { color:var(--mut); margin:0 0 1.5rem; }
  fieldset { border:1px solid var(--line); border-radius:.6rem; padding:1rem; margin:0 0 1.5rem; }
  legend { padding:0 .4rem; color:var(--mut); font-size:.8rem; text-transform:uppercase; letter-spacing:.05em; }
  .cfg { display:grid; grid-template-columns:repeat(auto-fit,minmax(13rem,1fr)); gap:.75rem; }
  label.f { display:block; font-size:.8rem; color:var(--mut); margin-bottom:.2rem; }
  /* :not([type=checkbox]) matters. A blanket width:100% here stretches every
     step checkbox to the full row and collapses its label to a few characters. */
  input:not([type=checkbox]),select { width:100%; padding:.45rem .55rem; border:1px solid var(--line);
                 border-radius:.4rem; background:var(--bg); color:var(--fg); font:inherit; font-size:.9rem; }
  input[type=checkbox] { flex:0 0 auto; width:1rem; height:1rem; margin:0; accent-color:var(--ok); }
  .bar { position:sticky; top:0; z-index:5; background:var(--bg); border-bottom:1px solid var(--line);
         padding:.6rem 0; margin-bottom:1rem; display:flex; gap:.5rem; align-items:center; flex-wrap:wrap; }
  .pill { border:1px solid var(--line); background:transparent; color:var(--mut); border-radius:2rem;
          padding:.25rem .7rem; font-size:.78rem; cursor:pointer; }
  .pill.on { border-color:var(--accent); color:var(--accent); }
  .prog { flex:1 1 8rem; height:.4rem; background:var(--line); border-radius:2rem; overflow:hidden; min-width:6rem; }
  .prog i { display:block; height:100%; width:0; background:var(--ok); transition:width .2s; }
  ol { list-style:none; padding:0; margin:0; }
  .step { border:1px solid var(--line); border-radius:.6rem; margin-bottom:.6rem; overflow:hidden; }
  .step.done-y { opacity:.55; }
  .step.locked { opacity:.4; }
  .step.locked .body, .step.locked .done { pointer-events:none; }
  .head { display:flex; align-items:center; gap:.6rem; padding:.7rem .9rem; background:color-mix(in srgb, var(--line) 25%, transparent); }
  .head label { cursor:pointer; font-weight:600; flex:1; }
  .sid { display:inline-block; min-width:2.4rem; color:var(--accent); font-family:ui-monospace,monospace; font-size:.85rem; }
  .tag { font-size:.65rem; text-transform:uppercase; letter-spacing:.06em; padding:.12rem .45rem; border-radius:.25rem; }
  .tag.danger { background:var(--bad); color:#fff; }
  .tag.cond { border:1px solid var(--warn); color:var(--warn); }
  .body { padding:.3rem .9rem .9rem 3.9rem; }
  .body p { margin:.45rem 0; }
  .why, .rb { color:var(--mut); font-size:.9rem; }
  .verify { border-left:2px solid var(--ok); padding-left:.6rem; }
  .auto.none { color:var(--mut); font-size:.85rem; font-style:italic; }
  button.run { border:1px solid var(--accent); color:var(--accent); background:transparent;
               border-radius:.35rem; padding:.3rem .7rem; font:inherit; font-size:.85rem; cursor:pointer; }
  .out { margin-left:.6rem; font-family:ui-monospace,monospace; font-size:.82rem; }
  .out.ok { color:var(--ok); } .out.bad { color:var(--bad); } .out.wait { color:var(--mut); }
  .reset { margin-left:auto; background:none; border:none; color:var(--mut); cursor:pointer; font-size:.8rem; text-decoration:underline; }
  table.fees { border-collapse:collapse; font-size:.85rem; }
  table.fees td { padding:.15rem .8rem .15rem 0; }
  table.fees td:last-child { font-family:ui-monospace,monospace; }
</style>
</head>
<body>
<div class="wrap">
  <h1>${esc(spec.title)}</h1>
  <p class="sub">Deployment canary. Steps unlock in order. Progress is stored in this browser only.</p>

  <fieldset>
    <legend>Target</legend>
    <div class="cfg">
      <div><label class="f" for="net">Network</label>
        <select id="net">
          <option value="https://api.testnet.hiro.so">testnet</option>
          <option value="https://api.hiro.so">mainnet</option>
        </select></div>
      <div><label class="f" for="dep">Deployer</label><input id="dep" value="${esc(spec.core.deployer)}" spellcheck="false" /></div>
      <div><label class="f" for="newc">New core</label><input id="newc" value="${esc(spec.core.to)}" spellcheck="false" /></div>
      <div><label class="f" for="oldc">Old core</label><input id="oldc" value="${esc(spec.core.from)}" spellcheck="false" /></div>
    </div>
    <p class="sub" style="margin:.9rem 0 0">Target fee units:</p>
    <table class="fees">${Object.entries(spec.feeTargets)
      .map(([k, v]) => `<tr><td>${esc(k)}</td><td>u${v}</td></tr>`)
      .join('')}</table>
  </fieldset>

  <div class="bar">
        ${phaseNav}
    <div class="prog"><i id="pbar"></i></div>
    <span id="pcount" class="sub" style="margin:0;font-size:.8rem"></span>
    <button class="reset" id="reset">reset</button>
  </div>

  <ol id="steps">
${stepCards}
  </ol>
</div>
<script>
(function () {
  var KEY = 'xtrata-v324-canary';
  var state = {};
  try { state = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { state = {}; }
  var steps = Array.prototype.slice.call(document.querySelectorAll('.step'));
  var cfg = { net: 'net', dep: 'dep', newc: 'newc', oldc: 'oldc' };
  Object.keys(cfg).forEach(function (k) {
    var el = document.getElementById(cfg[k]);
    if (state['cfg_' + k]) el.value = state['cfg_' + k];
    el.addEventListener('change', function () { state['cfg_' + k] = el.value; save(); });
  });
  function save() { localStorage.setItem(KEY, JSON.stringify(state)); }
  function api() { return document.getElementById('net').value; }
  function principal(which) {
    var dep = document.getElementById('dep').value.trim();
    var name = document.getElementById(which === 'old' ? 'oldc' : 'newc').value.trim();
    return { dep: dep, name: name, id: dep + '.' + name };
  }
  // Steps unlock strictly in order. The whole point is that you cannot
  // accidentally unpause before setting next-id.
  function refresh() {
    var doneCount = 0, firstOpen = true;
    steps.forEach(function (li) {
      var id = li.dataset.id;
      var cb = li.querySelector('.done');
      cb.checked = !!state[id];
      li.classList.toggle('done-y', !!state[id]);
      if (state[id]) { doneCount++; li.classList.remove('locked'); }
      else if (firstOpen) { li.classList.remove('locked'); firstOpen = false; }
      else { li.classList.add('locked'); }
    });
    var pct = steps.length ? Math.round((doneCount / steps.length) * 100) : 0;
    document.getElementById('pbar').style.width = pct + '%';
    document.getElementById('pcount').textContent = doneCount + '/' + steps.length;
  }
  steps.forEach(function (li) {
    li.querySelector('.done').addEventListener('change', function (e) {
      state[li.dataset.id] = e.target.checked;
      if (!e.target.checked) {
        // Unchecking a step relocks everything after it.
        var seen = false;
        steps.forEach(function (o) {
          if (o === li) { seen = true; return; }
          if (seen) state[o.dataset.id] = false;
        });
      }
      save(); refresh();
    });
  });
  document.getElementById('reset').addEventListener('click', function () {
    if (!confirm('Clear all canary progress?')) return;
    steps.forEach(function (li) { state[li.dataset.id] = false; });
    save(); refresh();
  });
  document.querySelectorAll('.pill').forEach(function (p) {
    p.addEventListener('click', function () {
      var on = p.classList.toggle('on');
      var ph = p.dataset.phase;
      document.querySelectorAll('.pill').forEach(function (q) { if (q !== p) q.classList.remove('on'); });
      steps.forEach(function (li) {
        li.style.display = (!on || li.dataset.phase === ph) ? '' : 'none';
      });
    });
  });

  // Clarity read-only results arrive hex-encoded and are almost always wrapped
  // in a response, so a bare bool is 0x0703/0x0704 rather than 0x03/0x04, and a
  // uint is 0x0701 followed by a 16-byte big-endian value. Decode properly:
  // substring matching gives false passes (u1000 "matches" inside u10000).
  function decodeClarity(hex) {
    var h = String(hex || '').replace(/^0x/, '');
    if (h.slice(0, 2) === '07' || h.slice(0, 2) === '08') h = h.slice(2); // unwrap (ok/err)
    var tag = h.slice(0, 2);
    if (tag === '03') return { type: 'bool', value: true };
    if (tag === '04') return { type: 'bool', value: false };
    if (tag === '01') return { type: 'uint', value: BigInt('0x' + h.slice(2, 34)) };
    return { type: 'raw', value: '0x' + h };
  }
  function matchesExpected(hex, want) {
    var got = decodeClarity(hex);
    var w = String(want).trim();
    if (w === 'true' || w === 'false') return got.type === 'bool' && got.value === (w === 'true');
    if (/^u?\d+$/.test(w)) return got.type === 'uint' && got.value === BigInt(w.replace(/^u/, ''));
    return false;
  }
  function describe(hex) {
    var g = decodeClarity(hex);
    return g.type === 'uint' ? 'u' + g.value : g.type === 'bool' ? String(g.value) : g.value;
  }
  async function readOnly(target, fn, args) {
    var p = principal(target === 'xtrata-v3-2-3' ? 'old' : 'new');
    var url = api() + '/v2/contracts/call-read/' + p.dep + '/' + p.name + '/' + fn;
    var r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender: p.dep, arguments: args || [] })
    });
    return r.json();
  }
  async function runCheck(spec, out) {
    out.className = 'out wait'; out.textContent = 'checking...';
    try {
      if (spec.kind === 'contract-exists' || spec.kind === 'has-function') {
        var p = principal('new');
        var r = await fetch(api() + '/v2/contracts/interface/' + p.dep + '/' + p.name);
        if (!r.ok) throw new Error('not deployed (' + r.status + ')');
        var iface = await r.json();
        if (spec.kind === 'has-function') {
          var names = (iface.functions || []).map(function (f) { return f.name; });
          if (names.indexOf(spec.fn) === -1) throw new Error('missing ' + spec.fn);
          out.className = 'out ok'; out.textContent = 'PASS - ' + spec.fn + ' present';
        } else {
          out.className = 'out ok'; out.textContent = 'PASS - deployed';
        }
        return;
      }
      if (spec.kind === 'read-only') {
        var res = await readOnly(spec.contract, spec.fn, spec.args);
        if (!res.okay) throw new Error(res.cause || 'call failed');
        var got = res.result;
        if (spec.expect && !matchesExpected(got, spec.expect)) {
          out.className = 'out bad';
          out.textContent = 'MISMATCH - wanted ' + spec.expect + ', got ' + describe(got);
          return;
        }
        out.className = 'out ok'; out.textContent = 'PASS - ' + describe(got);
        return;
      }
      if (spec.kind === 'abort-scan') {
        var p2 = principal('new');
        var r2 = await fetch(api() + '/extended/v1/address/' + p2.id + '/transactions?limit=50');
        var d = await r2.json();
        var bad = (d.results || []).filter(function (t) { return t.tx_status === 'abort_by_post_condition'; });
        if (bad.length) {
          out.className = 'out bad';
          out.textContent = bad.length + ' POST-CONDITION ABORT(S) - ' + bad[0].tx_id.slice(0, 12);
        } else {
          out.className = 'out ok';
          out.textContent = 'PASS - no post-condition aborts in last 50 txs';
        }
        return;
      }
      out.className = 'out'; out.textContent = 'no check';
    } catch (e) {
      out.className = 'out bad'; out.textContent = 'FAIL - ' + (e && e.message ? e.message : e);
    }
  }
  document.querySelectorAll('button.run').forEach(function (b) {
    b.addEventListener('click', function () {
      runCheck(JSON.parse(b.dataset.check), b.parentNode.querySelector('.out'));
    });
  });
  refresh();
})();
</script>
</body>
</html>
`;

if (checkOnly) {
  const stale = [];
  if (readFileSync(CANARY, 'utf8') !== canary) stale.push('canary.html');
  if (planSrc !== planOut) stale.push('MIGRATION-PLAN.md');
  if (stale.length) {
    console.error(`build-canary: stale generated files: ${stale.join(', ')}. Run: node ${'contracts/drafts/v3.2.4/build-canary.mjs'}`);
    process.exit(1);
  }
  console.log('build-canary: generated files are up to date.');
} else {
  writeFileSync(CANARY, canary);
  writeFileSync(PLAN, planOut);
  console.log(`build-canary: wrote canary.html and refreshed MIGRATION-PLAN.md (${spec.steps.length} steps).`);
}
