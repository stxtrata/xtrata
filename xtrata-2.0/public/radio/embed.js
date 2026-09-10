(() => {
  const $ = (id) => document.getElementById(id);
  if (new URLSearchParams(location.search).get('mode') === 'minimal') document.body.classList.add('minimal');
  let api;
  let loading;
  const render = (state) => {
    $('play').textContent = state.playing ? 'Ⅱ' : '▶';
    $('play').setAttribute('aria-label', state.playing ? 'Pause radio' : 'Play radio');
    $('title').textContent = state.nowPlaying?.title || 'Music from the chain';
    $('status').textContent = state.on
      ? (state.nowPlaying ? (state.playing ? state.nowPlaying.artist || 'Playing on-chain music' : 'Paused') : 'Tuning in…')
      : 'Press play to tune in';
  };
  const load = () => loading || (loading = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = '/xtrata-radio.js';
    script.onload = () => {
      api = window.XtrataRadio;
      if (!api) { reject(new Error('Player unavailable')); return; }
      api.subscribe(render);
      resolve(api);
    };
    script.onerror = () => { script.remove(); reject(new Error('Player unavailable')); };
    document.head.append(script);
  }).catch((error) => { loading = null; throw error; }));
  $('play').onclick = async () => {
    if (api) { api.playPause(); return; }
    $('play').disabled = true;
    $('status').textContent = 'Loading player…';
    try {
      await load();
      // A second click preserves the browser's user-gesture requirement for audio.
      $('status').textContent = 'Ready — press play';
      $('title').textContent = 'Ready — press play';
    } catch { $('status').textContent = 'Could not load. Press play to retry.'; $('title').textContent = 'Connection interrupted'; }
    finally { $('play').disabled = false; }
  };
  $('next').onclick = () => api?.next();
  $('quieter').onclick = () => api?.nudgeVolume(-1);
  $('louder').onclick = () => api?.nudgeVolume(1);
  // Prepare controls without restoring playback or fetching audio.
  load().catch(() => { $('status').textContent = 'Press play to retry loading the player.'; });
})();
