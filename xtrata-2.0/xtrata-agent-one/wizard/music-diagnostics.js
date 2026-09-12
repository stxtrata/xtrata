// Device-local preparation diagnostics. No file names, media contents, metadata or wallet data.
(function () {
  const started = Date.now(),
    lines = [];
  const panel = document.createElement('details');
  panel.id = 'musicDiagnostics';
  panel.open = false;
  panel.style.cssText =
    'margin:16px 0;padding:12px;border:1px solid var(--line);border-radius:10px';
  const summary = document.createElement('summary');
  summary.textContent = 'Audio preparation log';
  const pre = document.createElement('pre');
  pre.id = 'musicDiagnosticLog';
  pre.style.cssText =
    'white-space:pre-wrap;overflow-wrap:anywhere;max-height:220px;overflow:auto;font:12px/1.6 ui-monospace,monospace';
  const copy = document.createElement('button');
  copy.type = 'button';
  copy.className = 'btn ghost';
  copy.textContent = 'Copy diagnostic log';
  const note = document.createElement('p');
  note.className = 'muted';
  note.style.fontSize = '12px';
  note.textContent =
    'Local diagnostics only. No audio, file names, credits or wallet details are included.';
  panel.append(summary, pre, copy, note);
  const status = document.createElement('section');
  status.id = 'musicPreparation';
  status.hidden = true;
  status.innerHTML =
    '<div class="music-prep-heading"><strong id="musicPrepTitle">Preparing your audio</strong><span id="musicPrepElapsed"></span></div><p id="musicPrepMessage" role="status"></p><progress id="musicPrepProgress" max="100" aria-label="Audio preparation progress"></progress><p id="musicPrepAdvice" class="muted">The first run downloads the audio engine. Large WAV files can take several minutes to convert. Keep this tab open.</p>';
  document.querySelector('#drop').after(status);
  status.append(panel);
  const bar = status.querySelector('progress'),
    title = status.querySelector('strong'),
    messageEl = status.querySelector('#musicPrepMessage'),
    elapsed = status.querySelector('#musicPrepElapsed');
  let operationStart = 0,
    ticker = null;
  function showProgress(phase, message, percent) {
    if (['ready', 'environment'].includes(phase)) return;
    status.hidden = false;
    if (
      phase === 'prepare' ||
      (!ticker && !['error', 'quote-error', 'quote-ready'].includes(phase))
    ) {
      if (!ticker) {
        operationStart = Date.now();
        ticker = setInterval(() => {
          elapsed.textContent = Math.floor((Date.now() - operationStart) / 1000) + 's elapsed';
        }, 1000);
      }
    }
    if (phase === 'processing-wait') return;
    messageEl.textContent = message;
    const titles = {
      'engine-load': 'Loading audio engine',
      'engine-wait': 'Loading audio engine',
      input: 'Reading your recording',
      processing: 'Preparing your audio',
      progress: 'Converting your audio',
      packaging: 'Building your output',
      prepared: 'Audio prepared',
      quote: 'Calculating inscription cost',
      'quote-ready': 'Ready to review',
      error: 'Preparation stopped',
      'quote-error': 'Quote unavailable'
    };
    title.textContent =
      (titles[phase] || 'Preparing your audio') +
      (Number.isFinite(percent) ? ' · ' + percent + '%' : '');
    status.querySelector('#musicPrepAdvice').textContent =
      phase === 'quote-ready'
        ? 'Preview the finished audio and review the quote before inscribing.'
        : 'The first run downloads the audio engine. Large WAV files can take several minutes to convert. Keep this tab open.';
    if (Number.isFinite(percent)) {
      bar.value = percent;
      bar.setAttribute('aria-valuetext', percent + '% of audio converted');
    } else if (phase === 'quote-ready') {
      bar.value = 100;
      bar.setAttribute('aria-valuetext', 'Ready to review');
    } else {
      bar.removeAttribute('value');
      bar.removeAttribute('aria-valuetext');
    }
    if (['error', 'quote-error', 'quote-ready'].includes(phase)) {
      clearInterval(ticker);
      ticker = null;
      elapsed.textContent = Math.floor((Date.now() - operationStart) / 1000) + 's elapsed';
    }
    if (['error', 'quote-error'].includes(phase)) panel.open = true;
  }
  function log(phase, message, percent = null) {
    showProgress(phase, message, percent);
    const line =
      '[' +
      ((Date.now() - started) / 1000).toFixed(1) +
      's] ' +
      phase +
      ': ' +
      String(message).slice(0, 600);
    lines.push(line);
    if (lines.length > 150) lines.shift();
    pre.textContent = lines.join('\n');
    pre.scrollTop = pre.scrollHeight;
    console.info('[Xtrata Music]', line);
  }
  copy.onclick = async () => {
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      copy.textContent = 'Copied';
    } catch {
      copy.textContent = 'Select and copy the log above';
    }
  };
  window.addEventListener('xtrata:audio-diagnostic', (e) =>
    log(e.detail.phase, e.detail.message, e.detail.percent)
  );
  window.XtrataMusicDiagnostics = { log };
  log('ready', 'Diagnostics enabled. Engine load timeout: 120s.');
  log(
    'environment',
    'Secure context: ' +
      window.isSecureContext +
      '; cross-origin isolated: ' +
      !!window.crossOriginIsolated +
      '; WebAssembly: ' +
      (typeof WebAssembly !== 'undefined') +
      '.'
  );
})();
