// Appearance UI used by the single release and per-track batch editors.
(function () {
  let nextId = 0;
  const names = {
    classic: ['Classic', 'Artwork with a clear listening panel'],
    sleeve: ['Sleeve', 'Full cover with a compact control band'],
    studio: ['Studio', 'Typography and a spacious timeline'],
    vinyl: ['Vinyl', 'Your cover as a record that spins'],
    poster: ['Poster', 'Artwork fills the player']
  };
  const fields = {
    palette: [
      'Colour palette',
      {
        cover: 'From the cover',
        charcoal: 'Charcoal',
        paper: 'Warm paper',
        midnight: 'Midnight',
        monochrome: 'Monochrome'
      }
    ],
    font: [
      'Typography',
      { sans: 'Clean sans-serif', serif: 'Editorial serif', mono: 'Studio monospace', rounded: 'Soft rounded' }
    ],
    artFit: ['Artwork framing', { contain: 'Show whole image', cover: 'Fill frame' }],
    position: [
      'Crop position',
      { center: 'Centre', top: 'Top', bottom: 'Bottom', left: 'Left', right: 'Right' }
    ],
    corners: ['Frame corners', { soft: 'Softly rounded', square: 'Square' }],
    timeline: ['Timeline', { progress: 'Simple progress bar', waveform: 'Audio waveform' }],
    placeholder: [
      'Without artwork',
      { gradient: 'Soft gradient', plain: 'Plain background', initials: 'Track initials' }
    ]
  };
  // Player extras, grouped as on the inscribe page. Sizes are measured additions to a player.
  const extras = [
    [
      'Artwork',
      [
        ['check', 'fullArt', 'Full-screen artwork', 'Tap the cover to fill the player', '+1.2 KB'],
        ['select', 'motion', 'Artwork motion', { still: 'Still', zoom: 'Slow zoom while playing', breathe: 'Breathes with the music', tilt: 'Tilts under the pointer' }, 'up to +1.5 KB'],
        ['select', 'backdrop', 'Backdrop', { solid: 'Solid colour', blur: 'Blurred cover', grain: 'Film grain', paper: 'Paper texture', scanlines: 'Scanlines' }, '+0.4 KB'],
        ['check', 'artGlow', 'Soft glow behind the cover', 'In the accent colour', '+0.1 KB'],
        ['check', 'artWhilePlaying', 'GIF covers move only while playing', 'Still until play is pressed', '+0.8 KB']
      ]
    ],
    [
      'Timeline',
      [
        ['select', 'wavePos', 'Position', { inline: 'Above the controls', below: 'Below the controls', edge: 'Along the bottom edge', cover: 'Across the artwork' }, 'no extra'],
        ['select', 'waveSize', 'Height', { regular: 'Regular', slim: 'Slim', tall: 'Tall' }, 'no extra'],
        ['select', 'waveStyle', 'Waveform style', { bars: 'Bars', mirror: 'Mirrored', line: 'Smooth shape', dots: 'Dotted outline', needles: 'Needles', blocks: 'Blocks' }, 'no extra'],
        ['color', 'waveColor', 'Played colour', 'The part already heard', 'no extra'],
        ['color', 'waveBase', 'Unplayed colour', 'The part still to come', 'no extra']
      ]
    ],
    [
      'Visualiser',
      [
        ['select', 'visualiser', 'Visualiser', { off: 'Off', bars: 'Bars', ring: 'Pulse round the cover' }, '+1.7 KB, +0.6 KB a minute'],
        ['select', 'vizPos', 'Bars position', { cover: 'Over the artwork', edge: 'Along the bottom edge' }, 'no extra'],
        ['color', 'vizColor', 'Visualiser colour', 'Bars, pulse and vinyl glow', 'no extra']
      ]
    ],
    [
      'Lyrics',
      [
        ['select', 'lyricsView', 'Synced lyrics', { panel: 'Lit up in the Lyrics panel', overlay: 'Also shown over the artwork' }, '+1 KB']
      ]
    ],
    [
      'Text and controls',
      [
        ['select', 'align', 'Text alignment', { left: 'Left', center: 'Centred' }, 'no extra'],
        ['select', 'titleSize', 'Song title size', { regular: 'Regular', large: 'Large' }, 'no extra'],
        ['select', 'button', 'Play button', { circle: 'Circle', square: 'Rounded square', pill: 'Pill' }, 'no extra'],
        ['check', 'repeat', 'Repeat button', 'Lets listeners loop the song', '+0.4 KB']
      ]
    ],
    [
      'Signature touches',
      [
        ['text', 'note', 'Artist note', 'One line from you to the listener', 200, '+0.3 KB'],
        ['text', 'signature', 'Signature on the cover', 'Your name or BNS name and the year', 60, '+0.2 KB'],
        ['check', 'stamp', 'On-chain stamp', 'The inscription number on the cover', '+0.6 KB'],
        ['text', 'cues', 'Cue markers', 'Moments to jump to, e.g. 0:45 Drop, 1:30 Verse 2', 300, '+1.1 KB']
      ]
    ]
  ];
  const clock = (t) => Math.floor(t / 60) + ':' + String(Math.floor(t % 60)).padStart(2, '0') + (t % 1 ? String(Math.round((t % 1) * 10) / 10).slice(1) : '');
  const cuesText = (cues) => cues.map((c) => clock(c.t) + ' ' + c.label).join(', ');
  // "0:45 Drop, 1:30 Verse 2" (or one per line). Seconds alone ("45 Drop") also work.
  const parseCues = (text) =>
    String(text || '')
      .split(/[,\n]+/)
      .map((part) => part.trim().match(/^(?:(\d{1,3}):)?(\d{1,2}(?:\.\d)?)\s+(.+)$/))
      .filter(Boolean)
      .map((m) => ({ t: Number(m[1] || 0) * 60 + Number(m[2]), label: m[3].trim() }));
  const accentOf = (state) =>
    state.accent ||
    (state.palette === 'cover'
      ? (state.coverColors && state.coverColors.accent) || '#c7e6a2'
      : window.XtrataMusicPlayer.palettes[state.palette].accent);
  const extrasOn = (a) => {
    const d = window.XtrataMusicPlayer.extraDefaults,
      on = [];
    if (a.fullArt) on.push('full-screen art');
    if (a.motion !== d.motion) on.push(fieldText('motion', a.motion).toLowerCase());
    if (a.backdrop !== d.backdrop) on.push(fieldText('backdrop', a.backdrop).toLowerCase());
    if (a.artWhilePlaying) on.push('GIF on play');
    if (a.timeline === 'waveform' && a.waveStyle !== d.waveStyle) on.push(fieldText('waveStyle', a.waveStyle).toLowerCase() + ' waveform');
    if (a.wavePos !== d.wavePos) on.push('timeline ' + fieldText('wavePos', a.wavePos).toLowerCase());
    if (a.waveSize !== d.waveSize) on.push(a.waveSize + ' timeline');
    if (a.waveColor || a.waveBase) on.push('timeline colours');
    if (a.visualiser !== d.visualiser) on.push('visualiser' + (a.visualiser === 'bars' && a.vizPos === 'edge' ? ' along the edge' : ''));
    if (a.artGlow) on.push('cover glow');
    if (a.align !== d.align) on.push('centred text');
    if (a.titleSize !== d.titleSize) on.push('large title');
    if (a.lyricsView !== d.lyricsView) on.push('lyrics over artwork');
    if (a.repeat) on.push('repeat');
    if (a.button !== d.button) on.push(a.button + ' button');
    if (a.note) on.push('artist note');
    if (a.signature) on.push('signature');
    if (a.stamp) on.push('on-chain stamp');
    if (a.cues.length) on.push(a.cues.length + ' cue' + (a.cues.length > 1 ? 's' : ''));
    return on;
  };
  function fieldText(key, value) {
    for (const [, rows] of extras) for (const row of rows) if (row[1] === key && row[0] === 'select') return row[3][value] || value;
    return value;
  }
  // One-line summaries for the collapsed sections on the inscribe page.
  const describe = (input) => {
    const a = window.XtrataMusicPlayer.normalize(input);
    return {
      look: [names[a.style][0], fields.palette[1][a.palette], fields.font[1][a.font], a.timeline === 'waveform' ? 'waveform' : ''].filter(Boolean).join(' · '),
      extras: extrasOn(a)
    };
  };
  function mount(host, value, onChange) {
    let state = window.XtrataMusicPlayer.normalize(value);
    const prefix = 'appearance-' + ++nextId + '-';
    const row = ([kind, key, label, ...rest]) => {
      const id = prefix + 'x-' + key;
      if (kind === 'check')
        return `<label class="mx-row mx-check" for="${id}"><input type="checkbox" id="${id}" data-x="${key}"><span><b>${label}</b><small>${rest[0]}</small></span><em>${rest[1]}</em></label>`;
      if (kind === 'select')
        return `<label class="mx-row" for="${id}"><span><b>${label}</b></span><select id="${id}" data-x="${key}">${Object.entries(rest[0])
          .map(([v, text]) => `<option value="${v}">${text}</option>`)
          .join('')}</select><em>${rest[1]}</em></label>`;
      if (kind === 'color')
        return `<div class="mx-row mx-colorrow"><span><b>${label}</b><small>${rest[0]}</small></span><span class="mx-color"><input type="color" id="${id}" data-xc="${key}" aria-label="${label}"><button type="button" class="mx-auto" data-xc-auto="${key}" aria-pressed="true">Auto</button></span><em>${rest[1]}</em></div>`;
      return `<label class="mx-row mx-text" for="${id}"><span><b>${label}</b><small>${rest[0]}</small></span><input type="text" id="${id}" data-xt="${key}" maxlength="${rest[1]}" autocomplete="off"><em>${rest[2]}</em></label>`;
    };
    host.classList.add('music-appearance');
    host.innerHTML =
      '<div class="music-look"><div class="music-style-cards" role="group" aria-label="Player style">' +
      Object.entries(names)
        .map(
          ([key, [label, description]]) =>
            '<button type="button" class="music-style-card" data-style="' +
            key +
            '" aria-pressed="false"><span class="music-style-sketch sketch-' +
            key +
            '" aria-hidden="true"><i></i><b></b><em></em></span><strong>' +
            label +
            '</strong><small>' +
            description +
            '</small></button>'
        )
        .join('') +
      '</div><div class="music-style-options">' +
      Object.entries(fields)
        .map(
          ([key, [label, options]]) =>
            '<label for="' +
            prefix +
            key +
            '">' +
            label +
            '<select id="' +
            prefix +
            key +
            '" data-option="' +
            key +
            '">' +
            Object.entries(options)
              .map(([v, text]) => '<option value="' + v + '">' + text + '</option>')
              .join('') +
            '</select></label>'
        )
        .join('') +
      '<label for="' +
      prefix +
      'accent">Accent colour<input id="' +
      prefix +
      'accent" type="color" data-accent aria-label="Custom accent colour"></label></div><p class="muted music-cover-note" data-cover-note hidden>Colours are picked from the cover when the player is built. With no cover, the player uses Charcoal.</p><div class="music-style-checks">' +
      Object.entries({
        showAlbum: 'Show album name',
        showLyrics: 'Offer lyrics',
        showCredits: 'Offer track details'
      })
        .map(
          ([key, label]) =>
            '<label><input type="checkbox" data-check="' + key + '"> ' + label + '</label>'
        )
        .join('') +
      '</div><div class="music-toolbar"><button class="btn ghost" type="button" data-reset>Reset this style</button><button class="btn ghost" type="button" data-palette-accent>Use palette accent</button></div></div>' +
      '<div class="music-extras" data-extras><div class="music-extras-head"><h3>Player extras</h3><p class="muted">Optional touches. All off unless you switch them on. Once any extra is on, about 0.9 KB of shared player code is added; each size below comes on top. For scale, a minute of Balanced audio is about 1 MB.</p></div>' +
      extras
        .map(
          ([group, rows]) =>
            `<fieldset class="mx-group"><legend>${group}</legend>${rows.map(row).join('')}</fieldset>`
        )
        .join('') +
      '<p class="muted mx-tip" data-wave-note>Waveform styles show when the Timeline (under Player look) is Audio waveform. Picking a style switches it on. Position, height and colours work for the plain progress bar too.</p><p class="muted mx-tip">Synced lyrics: paste timed lyrics such as <code>[01:02.50] a line</code> into Lyrics, or drop an <code>.lrc</code> file with your song.</p></div>' +
      '<p class="muted music-style-note">Colours keep readable play-button text. Details and lyrics appear when supplied. Your appearance is saved permanently with the player.</p>';
    // Elements are looked up once, so the page may move the look and extras blocks into its own sections.
    const all = (sel) => [...host.querySelectorAll(sel)];
    const el = {
      look: host.querySelector('.music-look'),
      extras: host.querySelector('[data-extras]'),
      styles: all('[data-style]'),
      options: all('[data-option]'),
      checks: all('[data-check]'),
      xs: all('[data-x]'),
      xts: all('[data-xt]'),
      xcs: all('[data-xc]'),
      xcAuto: all('[data-xc-auto]'),
      vizPos: host.querySelector('[data-x="vizPos"]'),
      vizColorRow: host.querySelector('[data-xc="vizColor"]'),
      wave: host.querySelector('[data-x="waveStyle"]'),
      waveNote: host.querySelector('[data-wave-note]'),
      coverNote: host.querySelector('[data-cover-note]'),
      accent: host.querySelector('[data-accent]'),
      reset: host.querySelector('[data-reset]'),
      paletteAccent: host.querySelector('[data-palette-accent]')
    };
    function render() {
      el.styles.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.style === state.style)));
      el.options.forEach((input) => {
        input.value = state[input.dataset.option];
      });
      el.checks.forEach((input) => {
        input.checked = state[input.dataset.check];
      });
      el.xs.forEach((input) => {
        if (input.type === 'checkbox') input.checked = !!state[input.dataset.x];
        else input.value = state[input.dataset.x];
      });
      el.xts.forEach((input) => {
        if (document.activeElement === input) return;
        input.value = input.dataset.xt === 'cues' ? cuesText(state.cues) : state[input.dataset.xt];
      });
      el.waveNote.hidden = state.timeline === 'waveform';
      const autoColour = (key) =>
        key === 'waveBase'
          ? state.palette === 'cover'
            ? (state.coverColors && state.coverColors.muted) || '#b9c3bd'
            : window.XtrataMusicPlayer.palettes[state.palette].muted
          : accentOf(state);
      el.xcs.forEach((input) => (input.value = state[input.dataset.xc] || autoColour(input.dataset.xc)));
      el.xcAuto.forEach((b) => b.setAttribute('aria-pressed', String(!state[b.dataset.xcAuto])));
      el.vizPos.disabled = state.visualiser !== 'bars';
      el.coverNote.hidden = state.palette !== 'cover';
      el.accent.value = accentOf(state);
      for (const node of [host, el.look, el.extras]) node.style.setProperty('--style-accent', accentOf(state));
    }
    function change() {
      render();
      onChange?.(state);
    }
    el.styles.forEach(
      (b) =>
        (b.onclick = () => {
          state.style = b.dataset.style;
          change();
        })
    );
    el.options.forEach(
      (input) =>
        (input.onchange = () => {
          state[input.dataset.option] = input.value;
          if (input.dataset.option === 'palette') state.accent = '';
          change();
        })
    );
    el.checks.forEach(
      (input) =>
        (input.onchange = () => {
          state[input.dataset.check] = input.checked;
          change();
        })
    );
    el.xs.forEach(
      (input) =>
        (input.onchange = () => {
          state[input.dataset.x] = input.type === 'checkbox' ? input.checked : input.value;
          // A waveform style needs the waveform timeline, so picking one turns it on.
          if (input.dataset.x === 'waveStyle' && input.value !== 'bars') state.timeline = 'waveform';
          change();
        })
    );
    el.xcs.forEach(
      (input) =>
        (input.onchange = () => {
          state[input.dataset.xc] = input.value;
          change();
        })
    );
    el.xcAuto.forEach(
      (b) =>
        (b.onclick = () => {
          state[b.dataset.xcAuto] = '';
          change();
        })
    );
    // Text extras apply when you leave the box, so the player is not rebuilt on every key.
    el.xts.forEach(
      (input) =>
        (input.onchange = () => {
          const key = input.dataset.xt;
          state = window.XtrataMusicPlayer.normalize({
            ...state,
            [key]: key === 'cues' ? parseCues(input.value) : input.value
          });
          input.value = key === 'cues' ? cuesText(state.cues) : state[key];
          change();
        })
    );
    el.accent.onchange = (e) => {
      state.accent = e.target.value;
      change();
    };
    el.reset.onclick = () => {
      state = window.XtrataMusicPlayer.normalize({ style: state.style });
      change();
    };
    el.paletteAccent.onclick = () => {
      state.accent = '';
      change();
    };
    render();
    return {
      get: () => ({ ...state }),
      set: (value) => {
        state = window.XtrataMusicPlayer.normalize(value);
        render();
      },
      parts: { look: el.look, extras: el.extras }
    };
  }
  function init() {
    const section = document.createElement('section');
    section.id = 'musicAppearancePanel';
    section.innerHTML =
      '<div class="music-appearance-heading"><div><span class="tag">Make it yours</span><h2>Choose your player</h2><p class="muted">Five styles and a handful of optional extras. One permanent home for your music.</p></div></div><div id="musicStyleControls"></div><button type="button" class="btn ghost" id="musicStyleApplyAll" hidden>Apply this appearance to all tracks</button><p id="musicStyleStatus" role="status" class="muted"></p>';
    const workspace = document.createElement('div');
    workspace.className = 'music-design-workspace';
    const preview = document.querySelector('#preview');
    preview.before(workspace);
    workspace.append(section, preview);
    const controls = mount(section.querySelector('#musicStyleControls'), {}, async () => {
      if (musicJobActive()) return;
      if (SB.active) {
        document.querySelector('#musicStyleStatus').textContent =
          'Defaults updated. Use “Apply this appearance to all tracks” to update the batch.';
        return;
      }
      if (!FILE) return;
      // The page's update queue rebuilds the preview and quote once changes settle, even if a
      // rebuild is running now. Without it (older page), rebuild straight away as before.
      if (window.musicScheduleApply) {
        markEditsDirty();
        window.musicScheduleApply(250);
        return;
      }
      if (building || SB.busy) return;
      markEditsDirty();
      document.querySelector('#musicStyleStatus').textContent = 'Updating player and quote…';
      await document.querySelector('#applyEdits').onclick();
      document.querySelector('#musicStyleStatus').textContent = EST
        ? 'Preview and quote updated. Audio preparation is reused.'
        : 'Quote unavailable. Apply changes again before inscribing.';
    });
    document.querySelector('#musicStyleApplyAll').onclick = async () => {
      if (building || SB.busy || musicJobActive()) return;
      SB.EST = null;
      ++SB.quoteRun;
      for (const item of SB.items) {
        item.overrides = { ...item.overrides, appearance: controls.get(), artFit: undefined };
        item.status = 'queued';
      }
      await sbProcess();
      document.querySelector('#musicStyleStatus').textContent =
        'Appearance applied to all tracks. Individual track styles can still be edited.';
    };
    const sizes = document.createElement('div');
    sizes.className = 'music-preview-sizes';
    sizes.innerHTML =
      '<span>Preview size</span><button type="button" data-preview-width="100%" aria-pressed="true">Full</button><button type="button" data-preview-width="390px" aria-pressed="false">Phone</button><button type="button" data-preview-width="280px" aria-pressed="false">Small viewer</button>';
    document.querySelector('#previewFrame').before(sizes);
    sizes.querySelectorAll('button').forEach(
      (b) =>
        (b.onclick = () => {
          const frame = document.querySelector('#previewFrame');
          frame.style.maxWidth = b.dataset.previewWidth;
          frame.style.marginInline = 'auto';
          sizes
            .querySelectorAll('button')
            .forEach((el) => el.setAttribute('aria-pressed', String(el === b)));
        })
    );
    const visibility = () => {
      const format = document.querySelector('#musicFormat').value;
      const hasPlayers =
        SB.active &&
        SB.items.some(
          (item) => (item.overrides?.format || item.info?.format || format) !== 'audio'
        );
      section.hidden = format === 'audio' && !hasPlayers;
      document.querySelector('#musicStyleApplyAll').hidden = !SB.active;
    };
    new MutationObserver(visibility).observe(document.querySelector('#musicBatch'), {
      attributes: true,
      attributeFilter: ['style']
    });
    visibility();
    return { ...controls, visibility };
  }
  window.XtrataMusicAppearance = { mount, init, describe, parseCues };
})();
