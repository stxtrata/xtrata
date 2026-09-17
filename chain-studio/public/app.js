const $ = (q, root = document) => root.querySelector(q);
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const effortNames = { none: 'None', minimal: 'Minimal', low: 'Light', medium: 'Medium', high: 'High', xhigh: 'Extra high', max: 'Max', ultra: 'Ultra' };
const effortOrder = ['none', 'minimal', 'low', 'medium', 'high', 'xhigh', 'max', 'ultra'];
let boot, runs = [], selected = null, selectedStage = 0, tab = 'overview', showHidden = false, inspectorKey = '', currentFile = '', compareStage = null, requestCounter = 0;
let draft = { name: '', prompt: '', acceptance: '', source: '', testCommand: '', stageMinutes: 15, tokenBudget: 500000, stages: [] };
const model = id => boot.catalog.models.find(m => m.id === id);
const prettyModel = id => (model(id)?.name || id).replace(/^GPT-/, 'GPT ');
const visibleModels = () => boot.catalog.models.filter(m => showHidden || !m.hidden);
const totalTokens = run => run.stages.flatMap(s => [s, ...(s.attempts || [])]).reduce((n, s) => n + (s.usage?.input_tokens || 0) + (s.usage?.output_tokens || 0), 0);
const num = n => new Intl.NumberFormat('en', { notation: n > 99999 ? 'compact' : 'standard', maximumFractionDigits: 1 }).format(n);
const statusLabel = s => ({ preparing: 'Preparing', pending: 'Queued', checking: 'Checking', running: 'Running', pausing: 'Pausing', paused: 'Paused', completed: 'Complete', failed: 'Needs attention', cancelled: 'Cancelled', interrupted: 'Interrupted', budget_stopped: 'Budget reached', passed: 'Passed' }[s] || s);
const badge = s => `<span class="badge ${esc(s)}"><i></i>${esc(statusLabel(s))}</span>`;
function toast(message) { $('#toast').textContent = message; $('#toast').classList.add('show'); clearTimeout(toast.timer); toast.timer = setTimeout(() => $('#toast').classList.remove('show'), 5000); }
async function api(path, data) {
  const response = await fetch(path, data === undefined ? {} : { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Chain-Token': boot.token }, body: JSON.stringify(data) });
  const result = await response.json(); if (!response.ok) throw new Error(result.error || 'Request failed.'); return result;
}
function orderModels(models) {
  const known = ['gpt-5.5', 'gpt-5.6-luna', 'gpt-5.6-terra', 'gpt-5.6-sol', 'gpt-6-astra'];
  return [...models].sort((a, b) => (known.includes(a.id) ? known.indexOf(a.id) : 99) - (known.includes(b.id) ? known.indexOf(b.id) : 99));
}
function preset(name) {
  const models = orderModels(visibleModels()); if (!models.length) return [];
  let stages;
  if (name === 'full') stages = models.flatMap(m => [...m.efforts].sort((a, b) => effortOrder.indexOf(a) - effortOrder.indexOf(b)).map(e => ({ model: m.id, effort: e, role: 'improve', instructions: '' })));
  else if (name === 'jump') {
    const first = models.find(m => m.id.includes('luna')) || models[0];
    const last = [...models].reverse().find(m => m.efforts.includes('ultra')) || models.at(-1);
    stages = [{ model: first.id, effort: first.efforts.includes('low') ? 'low' : first.efforts[0] }, { model: last.id, effort: last.efforts.includes('ultra') ? 'ultra' : last.efforts.at(-1) }];
  } else {
    const ids = ['gpt-5.6-luna', 'gpt-5.6-terra', 'gpt-6-astra'];
    stages = ids.map((id, i) => { const m = models.find(m => m.id === id) || models[Math.min(i, models.length - 1)]; const e = ['low', 'high', 'ultra'][i]; return { model: m.id, effort: m.efforts.includes(e) ? e : m.efforts.at(-1) }; });
  }
  return stages.map((s, i) => ({ ...s, role: i === 0 ? 'build' : 'improve', instructions: '' }));
}
function modelOptions(value) { return visibleModels().concat(model(value)?.hidden && !showHidden ? [model(value)] : []).map(m => `<option value="${esc(m.id)}" ${m.id === value ? 'selected' : ''}>${esc(m.name)}${m.hidden ? ' (hidden)' : ''}</option>`).join(''); }
function stageEditor(s, i) {
  return `<article class="stage-editor" data-index="${i}"><div class="stage-number">${String(i + 1).padStart(2, '0')}</div><div class="stage-controls"><div class="stage-selects"><label><span>Model</span><select data-stage-field="model" aria-label="Stage ${i + 1} model">${modelOptions(s.model)}</select></label><label class="effort-label"><span>Reasoning</span><select data-stage-field="effort" aria-label="Stage ${i + 1} reasoning">${(model(s.model)?.efforts || []).map(e => `<option value="${esc(e)}" ${s.effort === e ? 'selected' : ''}>${esc(effortNames[e] || e)} · ${esc(e)}</option>`).join('')}</select></label></div><div class="stage-secondary"><select data-stage-field="role" aria-label="Stage ${i + 1} role">${['clarify', 'build', 'improve', 'review'].map(r => `<option ${s.role === r ? 'selected' : ''} value="${r}">${{ clarify: 'Clarify prompt', build: 'Build software', improve: 'Refine prompt + improve', review: 'Review only' }[r]}</option>`).join('')}</select><span class="stage-actions"><button type="button" data-move="-1" title="Move stage up" aria-label="Move stage ${i + 1} up" ${i === 0 ? 'disabled' : ''}>↑</button><button type="button" data-move="1" title="Move stage down" aria-label="Move stage ${i + 1} down" ${i === draft.stages.length - 1 ? 'disabled' : ''}>↓</button><button type="button" data-duplicate="${i}" title="Duplicate stage" aria-label="Duplicate stage ${i + 1}">⧉</button><button type="button" data-remove="${i}" title="Remove stage" aria-label="Remove stage ${i + 1}">×</button></span></div><details class="stage-instructions"><summary>Stage instructions <span>optional</span></summary><textarea data-stage-field="instructions" aria-label="Stage ${i + 1} instructions" placeholder="Focus this step on accessibility, architecture, or a specific concern…">${esc(s.instructions)}</textarea></details></div></article>`;
}
function renderSidebar() {
  $('#run-count').textContent = runs.length;
  $('#run-list').innerHTML = runs.length ? runs.map(r => `<button class="run-item ${selected === r.id ? 'selected' : ''}" data-run="${r.id}"><span class="run-icon ${r.status}">${r.status === 'completed' ? '✓' : ['running', 'preparing', 'pausing'].includes(r.status) ? '◌' : '⋮'}</span><span><strong>${esc(r.name)}</strong><small>${r.stages.filter(s => s.status === 'completed').length}/${r.stages.length} stages · ${esc(statusLabel(r.status))}</small></span></button>`).join('') : '<div class="empty-history">Your chains will appear here.<br>Start with an idea.</div>';
}
function renderNew() {
  selected = null; inspectorKey = ''; history.replaceState(null, '', '/'); renderSidebar(); $('#breadcrumb').textContent = 'New chain';
  $('#content').innerHTML = `<section class="page-intro"><div><span class="eyebrow">MODEL WORKBENCH</span><h1>Give your idea a running start.</h1><p>Build a chain. Watch it evolve. Try every version.</p></div><span class="version-tag">STUDIO / 01</span></section>
  <form id="chain-form"><div class="composer-grid"><section class="brief-panel"><div class="section-title"><span class="section-index">01</span><h2>The starting point</h2></div><label class="field">Chain name<input name="name" maxlength="100" value="${esc(draft.name)}" placeholder="e.g. A better reading list"></label><label class="field">What would you like to build?<textarea class="idea-input" name="prompt" required maxlength="20000" placeholder="Say it in your own words. The original request stays with every model in the chain.">${esc(draft.prompt)}</textarea></label><label class="field">What does success look like? <span class="optional">Optional</span><textarea name="acceptance" placeholder="The things every version must get right…">${esc(draft.acceptance)}</textarea></label><div class="brief-note"><span>↳</span><p>Your intent stays fixed.<br><strong>The prompt and software evolve together.</strong></p></div><details class="advanced"><summary>Workspace & run limits</summary><label class="field">Existing Git project<input name="source" value="${esc(draft.source)}" placeholder="/absolute/path/to/project"><small>Leave empty to build a new project. Source files are copied; your project stays untouched. Secrets, wallets, media, and dependencies are excluded.</small></label><label class="field">Automatic test command<input name="testCommand" value="${esc(draft.testCommand)}" placeholder="e.g. node --test"><small>Runs after every stage in a disposable copy, without network access. A failure pauses the chain.</small></label><div class="two-fields"><label class="field">Minutes per stage<input name="stageMinutes" type="number" min="1" max="120" value="${draft.stageMinutes}"></label><label class="field">Token threshold<input name="tokenBudget" type="number" min="1000" max="10000000" step="1000" value="${draft.tokenBudget}" id="budget-input"></label></div><p class="muted small">Token usage is checked between stages, not a hard spending cap.</p></details></section>
  <section class="ladder-panel"><div class="section-title"><span class="section-index">02</span><h2>Choose your trajectory</h2><span id="stage-count" class="count-tag">${draft.stages.length} stages</span></div><div class="preset-bar"><button type="button" data-preset="balanced">↗ Balanced</button><button type="button" data-preset="jump">↗ Light → Ultra</button><button type="button" data-preset="full">≋ Every option</button></div><p class="ladder-hint">Any model. Any supported effort. Any order.</p><div id="stages-editor">${draft.stages.map(stageEditor).join('')}</div><button type="button" id="add-stage" class="add-stage">＋ Add a stage</button><div class="catalog-footer"><label class="checkbox"><input id="show-hidden" type="checkbox" ${showHidden ? 'checked' : ''}>Include hidden models</label><button type="button" id="refresh-models" class="text-button">↻ Refresh models</button></div><div class="catalog-note" id="catalog-note">${esc(boot.catalog.source)}${boot.catalog.fetchedAt ? ' · ' + esc(new Date(boot.catalog.fetchedAt).toLocaleDateString()) : ''}${boot.catalog.warning ? '<br>' + esc(boot.catalog.warning) : ''}${boot.catalog.error ? '<br>' + esc(boot.catalog.error) : ''}</div><div class="template-actions"><button type="button" id="save-ladder" class="text-button">Save ladder</button><button type="button" id="load-ladder" class="text-button">Load saved ladder</button></div></section></div>
  <footer class="launch-bar"><div><span class="status-dot"></span><strong>Ready when you are</strong><small>Runs through your local Codex sign-in.</small></div><button class="primary launch" id="start-chain" ${!draft.stages.length ? 'disabled' : ''}>Start chain <span>↗</span></button></footer></form>`;
  $('#budget-input').value = draft.tokenBudget;
}
function updateDraft() {
  const form = $('#chain-form'); if (!form) return;
  for (const name of ['name', 'prompt', 'acceptance', 'source', 'testCommand', 'stageMinutes', 'tokenBudget']) draft[name] = form.elements[name].value;
}
function updateEditor() { $('#stages-editor').innerHTML = draft.stages.map(stageEditor).join(''); $('#stage-count').textContent = `${draft.stages.length} stages`; $('#start-chain').disabled = !draft.stages.length; }
function selectRun(id) {
  selected = id; selectedStage = 0; tab = 'overview'; currentFile = ''; compareStage = null; inspectorKey = '';
  const run = runs.find(r => r.id === id); if (!run) return;
  selectedStage = Math.max(0, run.stages.findIndex(s => ['running', 'checking', 'failed'].includes(s.status)));
  $('#content').innerHTML = `<section id="run-heading"></section><div id="run-metrics"></div><div class="workbench"><section class="timeline-panel"><div class="timeline-heading"><h2>The chain</h2><span id="timeline-count"></span></div><div id="timeline"></div><div class="live-heading"><span class="status-dot"></span>ACTIVITY <span id="activity-stage"></span></div><div id="activity" class="activity"></div></section><section class="inspector-panel"><div id="inspector-heading"></div><nav class="tabs" aria-label="Snapshot views">${['overview', 'preview', 'code', 'compare', 'prompt', 'tests'].map(t => `<button data-tab="${t}" class="${t === tab ? 'active' : ''}">${t[0].toUpperCase() + t.slice(1)}</button>`).join('')}</nav><div id="inspector"></div><div id="feedback-panel"></div></section></div>`;
  renderRun(); renderSidebar();
}
function renderRun() {
  const run = runs.find(r => r.id === selected); if (!run) return;
  $('#breadcrumb').textContent = run.name;
  const complete = run.stages.filter(s => s.status === 'completed').length;
  const active = ['running', 'preparing', 'pausing'].includes(run.status);
  $('#run-heading').innerHTML = `<div class="run-intro"><div><span class="eyebrow">CHAIN / ${esc(run.id.slice(0, 8).toUpperCase())}</span><h1>${esc(run.name)}</h1><p>${complete} of ${run.stages.length} stages complete. ${active ? 'Explore finished versions while the chain continues.' : run.status === 'completed' ? 'Every version is saved and ready to explore.' : 'Your completed snapshots are ready to inspect.'}</p></div><div class="run-buttons">${badge(run.status)}${active ? `<button id="pause-run" class="secondary" ${run.status === 'pausing' ? 'disabled' : ''}>Ⅱ Pause</button><button id="cancel-run" class="secondary">■ Cancel</button>` : ['paused', 'failed', 'interrupted', 'budget_stopped'].includes(run.status) ? '<button id="resume-run" class="primary">↗ Continue</button>' : ''}<button id="clone-run" class="secondary">Reuse setup</button></div></div>${run.error ? `<div class="run-error" role="status">${esc(run.error)}${run.status === 'budget_stopped' ? `<label>New token threshold <input id="resume-budget" type="number" min="${totalTokens(run) + 1000}" value="${Math.max(run.tokenBudget * 2, totalTokens(run) + 100000)}"></label>` : ''}</div>` : ''}`;
  const cached = run.stages.flatMap(s => [s, ...(s.attempts || [])]).reduce((n, s) => n + (s.usage?.cached_input_tokens || 0), 0);
  const usageStages = run.stages.filter(s => s.usage).length;
  $('#run-metrics').innerHTML = `<div class="metrics"><div><span>PROGRESS</span><strong>${complete}<small> / ${run.stages.length}</small></strong><progress class="progress-track" value="${complete}" max="${run.stages.length}" aria-label="Completed stages"></progress></div><div><span>REPORTED TOKENS</span><strong>${num(totalTokens(run))}<small>${usageStages ? 'input + output' : 'awaiting usage'}</small></strong></div><div><span>CACHED INPUT</span><strong>${num(cached)}<small>included in total</small></strong></div><div><span>EXECUTION</span><strong class="metric-text">${new Set(run.stages.map(s => s.model)).size} models<small>${run.stageMinutes} min / stage</small></strong></div></div>`;
  $('#timeline-count').textContent = `${run.stages.length} stages`;
  $('#timeline').innerHTML = run.stages.map((s, i) => `<button class="timeline-stage ${selectedStage === i ? 'selected' : ''} ${s.status}" data-stage="${i}"><span class="timeline-node">${s.status === 'completed' ? '✓' : String(i + 1).padStart(2, '0')}</span><span class="timeline-copy"><strong>${esc(prettyModel(s.model))}<span class="effort-pill">${esc(effortNames[s.effort] || s.effort)}</span></strong><small>${esc(s.role)} <span>· ${esc(statusLabel(s.status))}</span></small></span><span class="timeline-arrow">↗</span></button>`).join('');
  const liveIndex = run.stages.findIndex(s => ['running', 'checking', 'preparing'].includes(s.status));
  const activityStage = run.stages[liveIndex >= 0 ? liveIndex : selectedStage];
  $('#activity-stage').textContent = `STAGE ${(liveIndex >= 0 ? liveIndex : selectedStage) + 1}`;
  const activity = $('#activity'); const atBottom = activity.scrollHeight - activity.scrollTop - activity.clientHeight < 60;
  activity.innerHTML = activityStage.events.length ? activityStage.events.slice(-35).map(e => `<div class="event ${esc(e.kind)}"><time>${new Date(e.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time><p>${esc(e.message.slice(0, 800))}</p></div>`).join('') : '<p class="muted small">Agent activity appears here when this stage starts.</p>';
  if (atBottom) activity.scrollTop = activity.scrollHeight;
  renderInspector(); renderSidebar();
}
function filePicker(stage, selectedPath, id = 'file-picker') { return `<select id="${id}" aria-label="Snapshot file">${stage.files.map(f => `<option value="${esc(f.path)}" ${f.path === selectedPath ? 'selected' : ''}>${esc(f.path)}</option>`).join('')}</select>`; }
function list(values, empty) { return values?.length ? `<ul class="result-list">${values.map(v => `<li>${esc(v)}</li>`).join('')}</ul>` : `<p class="muted">${empty}</p>`; }
function renderInspector(force = false) {
  const run = runs.find(r => r.id === selected); const s = run.stages[selectedStage];
  history.replaceState(null, '', `/#run=${run.id}&stage=${selectedStage}&tab=${tab}`);
  const key = JSON.stringify([run.id, selectedStage, tab, s.status, ['overview', 'prompt'].includes(tab) ? s.result : null, tab === 'tests' ? s.tests : null, currentFile, compareStage]);
  if (!force && key === inspectorKey) return; inspectorKey = key; requestCounter++;
  $('#inspector-heading').innerHTML = `<div class="snapshot-title"><span class="eyebrow">SNAPSHOT ${String(selectedStage + 1).padStart(2, '0')}</span><h2>${esc(prettyModel(s.model))} <span>${esc(effortNames[s.effort])}</span></h2></div>${s.status === 'completed' ? `<a class="secondary download-link" href="/api/runs/${run.id}/stages/${selectedStage}/download">↓ Download</a>` : badge(s.status)}`;
  document.querySelectorAll('[data-tab]').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  const container = $('#inspector');
  if (tab === 'overview') container.innerHTML = `<div class="overview"><span class="eyebrow">${s.status === 'completed' ? 'STAGE REPORT' : 'STAGE BRIEF'}</span><h3>${s.status === 'completed' ? 'What changed in this version' : s.status === 'pending' ? 'Next in the chain' : 'Work in progress'}</h3><p class="report-summary">${esc(s.result?.summary || s.instructions || ({ clarify: 'Turn the original request into a precise working prompt.', build: 'Create the first working implementation.', improve: 'Refine the working prompt and improve the current implementation.', review: 'Review the software against the original requirements.' }[s.role]))}</p>${s.error ? `<pre class="error-output">${esc(s.error)}</pre>` : ''}${s.result ? `<h4>Changes</h4>${list(s.result.changes, 'No product files changed in this stage.')}<h4>Agent-reported checks</h4>${list(s.result.checks, 'No checks reported by the agent.')}<h4>Still to resolve</h4>${list(s.result.unresolved, 'No unresolved items reported. Inspect and test the output to verify.')}` : `<div class="pending-visual"><span>01</span><i></i><span>02</span><i></i><span>03</span></div><p class="muted">A report, prompt history, and separate file snapshot will appear here after this stage finishes.</p>`}<details class="original-request"><summary>Original request & acceptance criteria</summary><p>${esc(run.original)}</p><p>${esc(run.acceptance || 'No additional criteria supplied.')}</p></details></div>`;
  else if (tab === 'prompt') container.innerHTML = `<div class="prompt-view"><div class="view-toolbar"><span>Working prompt · stage ${selectedStage + 1}</span><button class="text-button" id="copy-prompt">Copy</button></div><pre>${esc(s.result?.refinedPrompt || s.prompt || 'The prompt will be assembled when this stage starts, including the latest completed output and your feedback.')}</pre>${s.result && s.prompt ? `<details><summary>Full input sent to this stage</summary><pre>${esc(s.prompt)}</pre></details>` : ''}</div>`;
  else if (s.status !== 'completed') container.innerHTML = `<div class="empty-panel"><span class="empty-symbol">◷</span><h3>This snapshot is still ${esc(statusLabel(s.status).toLowerCase())}.</h3><p>Select a completed stage to preview, compare, or test its output.<br>The running agent continues independently.</p></div>`;
  else if (tab === 'preview') {
    const entries = s.files.filter(f => /\.html?$/i.test(f.path));
    if (!entries.length) container.innerHTML = '<div class="empty-panel"><span class="empty-symbol">⌘</span><h3>No static preview in this version.</h3><p>Explore the files in Code, run a command in Tests, or download the snapshot.<br>Apps that need a server must be run separately.</p></div>';
    else {
      const entry = entries.find(f => f.path === currentFile) || entries.find(f => f.path === 'index.html') || entries[0];
      const url = `${boot.previewOrigin}/${run.id}/${selectedStage}/${entry.path.split('/').map(encodeURIComponent).join('/')}`;
      container.innerHTML = `<div class="view-toolbar preview-toolbar"><select id="preview-entry" aria-label="Preview entry file">${entries.map(f => `<option value="${esc(f.path)}" ${f.path === entry.path ? 'selected' : ''}>${esc(f.path)}</option>`).join('')}</select><button id="reload-preview" class="text-button">↻ Reload</button><a href="${esc(url)}" target="_blank" rel="noopener noreferrer" class="text-button">Open ↗</a></div><iframe class="preview-frame" title="Stage ${selectedStage + 1} interactive preview" sandbox="allow-scripts allow-forms" src="${esc(url)}"></iframe><div class="preview-note">Separate saved snapshot · Scripts enabled · Network & storage isolated</div>`;
    }
  } else if (tab === 'code') {
    if (!s.files.length) container.innerHTML = '<div class="empty-panel"><h3>No files in this snapshot.</h3></div>';
    else {
      const path = s.files.find(f => f.path === currentFile)?.path || s.files.find(f => f.path === 'index.html')?.path || s.files[0].path; currentFile = path;
      container.innerHTML = `<div class="view-toolbar">${filePicker(s, path)}<button id="copy-code" class="text-button">Copy</button><span>${num(s.files.find(f => f.path === path).bytes)} bytes</span></div><pre class="code-view" id="file-content">Loading file…</pre>`;
      loadCode(run, selectedStage, path, '#file-content');
    }
  } else if (tab === 'compare') {
    const options = run.stages.map((v, i) => ({ ...v, i })).filter(v => v.status === 'completed' && v.i !== selectedStage);
    if (!options.length) container.innerHTML = '<div class="empty-panel"><span class="empty-symbol">⇄</span><h3>Two versions make a comparison.</h3><p>Once another stage finishes, compare its files and working prompt here.</p></div>';
    else {
      const other = options.find(o => o.i === compareStage) || [...options].reverse().find(o => o.i < selectedStage) || options[0]; compareStage = other.i;
      const before = new Map(other.files.map(f => [f.path, f.hash])); const after = new Map(s.files.map(f => [f.path, f.hash]));
      const paths = [...new Set([...before.keys(), ...after.keys()])].sort();
      const changes = paths.filter(p => before.get(p) !== after.get(p));
      const path = paths.includes(currentFile) ? currentFile : changes[0] || paths[0]; currentFile = path;
      container.innerHTML = `<div class="view-toolbar"><label>Compare with <select id="compare-stage" aria-label="Compare against stage">${options.map(o => `<option value="${o.i}" ${o.i === other.i ? 'selected' : ''}>${o.i + 1}. ${esc(prettyModel(o.model))} · ${esc(effortNames[o.effort])}</option>`).join('')}</select></label><span>${changes.length} files changed</span></div><div class="change-list">${changes.length ? changes.map(p => `<button data-compare-file="${esc(p)}" class="${p === path ? 'active' : ''}"><span>${!before.has(p) ? '+' : !after.has(p) ? '−' : '~'}</span>${esc(p)}</button>`).join('') : '<span>No file changes between these snapshots.</span>'}</div><div class="compare-prompt"><details><summary>Compare working prompts</summary><div class="compare-columns"><pre>${esc(other.result?.refinedPrompt)}</pre><pre>${esc(s.result?.refinedPrompt)}</pre></div></details></div>${path ? `<div class="compare-filename">${esc(path)}</div><div class="compare-columns"><div><div class="code-label">STAGE ${other.i + 1} · BEFORE</div><pre class="code-view" id="compare-before">${before.has(path) ? 'Loading…' : 'File does not exist in this version.'}</pre></div><div><div class="code-label">STAGE ${selectedStage + 1} · SELECTED</div><pre class="code-view" id="compare-after">${after.has(path) ? 'Loading…' : 'File does not exist in this version.'}</pre></div></div>` : ''}`;
      if (path && before.has(path)) loadCode(run, other.i, path, '#compare-before');
      if (path && after.has(path)) loadCode(run, selectedStage, path, '#compare-after');
    }
  } else if (tab === 'tests') {
    container.innerHTML = `<div class="tests-view"><span class="eyebrow">VALIDATION</span><h3>Put this version to the test.</h3><p class="muted">Tests run in a disposable copy. The saved output and the ongoing chain stay separate.</p><div class="check-list">${s.checks.map(c => `<details class="check-row"><summary><span class="check-icon ${c.passed ? 'passed' : 'failed'}">${c.passed ? '✓' : '×'}</span>${esc(c.name)}<span>${c.passed ? 'Passed' : 'Failed'}</span></summary><pre>${esc(c.output)}</pre></details>`).join('')}</div><form id="test-form"><label class="field">Run a test command<input id="test-command" required placeholder="node --test" value="${esc(run.testCommand || '')}"></label><button class="secondary" ${s.tests.some(t => t.status === 'running') ? 'disabled' : ''}>▷ Run test</button></form><p class="small muted">macOS sandbox · No network · No inherited credentials · 2-minute timeout. Dependencies are not installed automatically.</p><div class="test-history">${[...s.tests].reverse().map(t => `<details class="test-result" open><summary>${badge(t.status)}<code>${esc(t.command)}</code></summary><pre>${esc(t.output || 'Test is running…')}</pre></details>`).join('')}</div></div>`;
  }
  const feedback = $('#feedback-panel');
  if (s.status === 'completed') {
    // Keep a partially typed note across background updates.
    const existing = $('#feedback-text')?.value || '';
    feedback.innerHTML = `<form id="feedback-form"><label for="feedback-text">Leave a note for the next stage <span>Applies when it starts</span></label><div><input id="feedback-text" placeholder="This works well, but the mobile layout needs attention…" value="${esc(existing)}" required><button class="secondary">Send ↗</button></div></form><div class="feedback-notes">${run.feedback.filter(f => f.stage === selectedStage).slice(-3).map(f => `<p>↳ ${esc(f.text)}</p>`).join('')}</div>`;
  } else feedback.innerHTML = '';
}
async function loadCode(run, stage, path, selector) {
  const sequence = requestCounter;
  try { const result = await api(`/api/runs/${run.id}/stages/${stage}/file?path=${encodeURIComponent(path)}`); if (sequence === requestCounter && $(selector)) $(selector).textContent = result.content; }
  catch (e) { if (sequence === requestCounter && $(selector)) $(selector).textContent = e.message; }
}
function upsert(run) { const index = runs.findIndex(r => r.id === run.id); if (index < 0) runs.unshift(run); else runs[index] = run; }

document.addEventListener('click', async event => {
  const button = event.target.closest('button'); if (!button) return;
  try {
    if (button.id === 'new-chain') { updateDraft(); renderNew(); }
    if (button.id === 'help') $('#help-dialog').showModal();
    if (button.id === 'close-help') $('#help-dialog').close();
    if (button.dataset.run) { updateDraft(); selectRun(button.dataset.run); }
    if (button.dataset.preset) { updateDraft(); draft.stages = preset(button.dataset.preset); updateEditor(); }
    if (button.id === 'add-stage') { const m = visibleModels()[0]; if (!m) return toast('Refresh the model catalog first.'); draft.stages.push({ model: m.id, effort: m.defaultEffort, role: 'improve', instructions: '' }); updateEditor(); }
    if (button.dataset.remove !== undefined) { draft.stages.splice(Number(button.dataset.remove), 1); updateEditor(); }
    if (button.dataset.duplicate !== undefined) { const i = Number(button.dataset.duplicate); draft.stages.splice(i + 1, 0, { ...draft.stages[i] }); updateEditor(); }
    if (button.dataset.move) { const i = Number(button.closest('[data-index]').dataset.index), j = i + Number(button.dataset.move); [draft.stages[i], draft.stages[j]] = [draft.stages[j], draft.stages[i]]; updateEditor(); }
    if (button.id === 'refresh-models') { button.disabled = true; button.textContent = 'Refreshing…'; updateDraft(); boot.catalog = await api('/api/models/refresh', {}); renderNew(); toast(boot.catalog.warning || 'Model catalog refreshed.'); }
    if (button.id === 'save-ladder') { localStorage.setItem('chain-studio-ladder', JSON.stringify(draft.stages)); toast('Ladder saved on this browser.'); }
    if (button.id === 'load-ladder') { const stored = JSON.parse(localStorage.getItem('chain-studio-ladder') || 'null'); if (!stored) return toast('No saved ladder yet.'); const valid = stored.filter(s => model(s.model)?.efforts.includes(s.effort)); draft.stages = valid; updateEditor(); toast(`${valid.length} supported stages loaded.`); }
    if (button.dataset.stage !== undefined) { selectedStage = Number(button.dataset.stage); currentFile = ''; compareStage = null; inspectorKey = ''; renderRun(); }
    if (button.dataset.tab) { tab = button.dataset.tab; renderInspector(true); }
    if (button.dataset.compareFile) { currentFile = button.dataset.compareFile; renderInspector(true); }
    if (button.id === 'reload-preview') { const frame = $('.preview-frame'); frame.src = frame.src; }
    if (button.id === 'copy-code' || button.id === 'copy-prompt') { await navigator.clipboard.writeText(button.id === 'copy-code' ? $('#file-content').textContent : runs.find(r => r.id === selected).stages[selectedStage].result?.refinedPrompt || runs.find(r => r.id === selected).stages[selectedStage].prompt || ''); toast('Copied.'); }
    if (['pause-run', 'cancel-run', 'resume-run'].includes(button.id)) {
      const action = button.id.split('-')[0]; const tokenBudget = $('#resume-budget')?.value;
      button.disabled = true; const run = await api(`/api/runs/${selected}/${action}`, tokenBudget ? { tokenBudget: Number(tokenBudget) } : {}); upsert(run); renderRun();
    }
    if (button.id === 'clone-run') { const r = runs.find(r => r.id === selected); draft = { name: r.name + ' · new run', prompt: r.original, acceptance: r.acceptance, source: r.source, testCommand: r.testCommand, stageMinutes: r.stageMinutes, tokenBudget: r.tokenBudget, stages: r.stages.map(s => ({ model: s.model, effort: s.effort, role: s.role, instructions: s.instructions })) }; renderNew(); }
  } catch (e) { toast(e.message); button.disabled = false; }
});
document.addEventListener('input', event => {
  if (event.target.dataset.stageField) { const i = Number(event.target.closest('[data-index]').dataset.index); draft.stages[i][event.target.dataset.stageField] = event.target.value; }
});
document.addEventListener('change', event => {
  const element = event.target;
  if (element.dataset.stageField === 'model') { const i = Number(element.closest('[data-index]').dataset.index); const m = model(element.value); if (!m.efforts.includes(draft.stages[i].effort)) draft.stages[i].effort = m.defaultEffort; updateEditor(); }
  if (element.id === 'show-hidden') { showHidden = element.checked; updateEditor(); }
  if (['file-picker', 'preview-entry'].includes(element.id)) { currentFile = element.value; renderInspector(true); }
  if (element.id === 'compare-stage') { compareStage = Number(element.value); renderInspector(true); }
});
document.addEventListener('submit', async event => {
  event.preventDefault(); const form = event.target; const button = $('button[type=submit],button:not([type])', form); if (button) button.disabled = true;
  try {
    if (form.id === 'chain-form') { updateDraft(); $('#start-chain').disabled = true; $('#start-chain').textContent = 'Starting…'; const run = await api('/api/runs', draft); upsert(run); selectRun(run.id); }
    if (form.id === 'test-form') { await api(`/api/runs/${selected}/stages/${selectedStage}/test`, { command: $('#test-command').value }); toast('Test started in a separate copy.'); }
    if (form.id === 'feedback-form') { const run = await api(`/api/runs/${selected}/feedback`, { stage: selectedStage, text: $('#feedback-text').value }); upsert(run); $('#feedback-text').value = ''; renderInspector(true); toast('Feedback saved for stages that have not started.'); }
  } catch (e) { toast(e.message); if ($('#start-chain')) { $('#start-chain').disabled = false; $('#start-chain').textContent = 'Start chain ↗'; } }
  finally { if (button?.isConnected) button.disabled = false; }
});
document.addEventListener('keydown', event => { if (event.key.toLowerCase() === 'n' && !event.metaKey && !event.ctrlKey && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName) && !$('#help-dialog').open) renderNew(); });

async function start() {
  boot = await api('/api/bootstrap'); runs = await api('/api/runs'); draft.stages = preset('balanced');
  const route = new URLSearchParams(location.hash.slice(1));
  const savedRun = runs.find(r => r.id === route.get('run'));
  if (savedRun) { selectRun(savedRun.id); selectedStage = Math.min(savedRun.stages.length - 1, Math.max(0, Number(route.get('stage')) || 0)); tab = ['overview', 'preview', 'code', 'compare', 'prompt', 'tests'].includes(route.get('tab')) ? route.get('tab') : 'overview'; renderRun(); } else renderNew();
  const events = new EventSource('/api/events');
  events.addEventListener('run', event => { const run = JSON.parse(event.data); upsert(run); if (selected === run.id) renderRun(); else renderSidebar(); });
  events.onopen = async () => { $('#connection').textContent = 'Connected · Codex'; try { runs = await api('/api/runs'); if (selected) renderRun(); else renderSidebar(); } catch {} };
  events.onerror = () => { $('#connection').textContent = 'Reconnecting…'; };
}
start().catch(e => { $('#content').innerHTML = `<div class="empty-panel"><h1>Unable to connect</h1><p>${esc(e.message)}</p><p>Make sure the local runner is running, then reload this page.</p></div>`; });
