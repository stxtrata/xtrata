// Appearance UI used by the single release and per-track batch editors.
(function () {
  let nextId = 0;
  const names = {
    classic: ['Classic', 'Artwork with a clear listening panel'],
    sleeve: ['Sleeve', 'Full cover with a compact control band'],
    studio: ['Studio', 'Typography and a spacious timeline']
  };
  const fields = {
    palette: [
      'Colour palette',
      { charcoal: 'Charcoal', paper: 'Warm paper', midnight: 'Midnight', monochrome: 'Monochrome' }
    ],
    font: [
      'Typography',
      { sans: 'Clean sans-serif', serif: 'Editorial serif', mono: 'Studio monospace' }
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
  function mount(host, value, onChange) {
    let state = window.XtrataMusicPlayer.normalize(value);
    const prefix = 'appearance-' + ++nextId + '-';
    host.classList.add('music-appearance');
    host.innerHTML =
      '<div class="music-style-cards" role="group" aria-label="Player style">' +
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
      'accent" type="color" data-accent aria-label="Custom accent colour"></label></div><div class="music-style-checks">' +
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
      '</div><div class="music-toolbar"><button class="btn ghost" type="button" data-reset>Reset this style</button><button class="btn ghost" type="button" data-palette-accent>Use palette accent</button></div><p class="muted music-style-note">Colours keep readable play-button text. Details and lyrics appear when supplied. Your appearance is saved permanently with the player.</p>';
    function render() {
      host
        .querySelectorAll('[data-style]')
        .forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.style === state.style)));
      host.querySelectorAll('[data-option]').forEach((el) => {
        el.value = state[el.dataset.option];
      });
      host.querySelectorAll('[data-check]').forEach((el) => {
        el.checked = state[el.dataset.check];
      });
      host.querySelector('[data-accent]').value =
        state.accent || window.XtrataMusicPlayer.palettes[state.palette].accent;
      host.style.setProperty(
        '--style-accent',
        state.accent || window.XtrataMusicPlayer.palettes[state.palette].accent
      );
    }
    function change() {
      render();
      onChange?.(state);
    }
    host.querySelectorAll('[data-style]').forEach(
      (el) =>
        (el.onclick = () => {
          state.style = el.dataset.style;
          change();
        })
    );
    host.querySelectorAll('[data-option]').forEach(
      (el) =>
        (el.onchange = () => {
          state[el.dataset.option] = el.value;
          if (el.dataset.option === 'palette') state.accent = '';
          change();
        })
    );
    host.querySelectorAll('[data-check]').forEach(
      (el) =>
        (el.onchange = () => {
          state[el.dataset.check] = el.checked;
          change();
        })
    );
    host.querySelector('[data-accent]').onchange = (e) => {
      state.accent = e.target.value;
      change();
    };
    host.querySelector('[data-reset]').onclick = () => {
      state = window.XtrataMusicPlayer.normalize({ style: state.style });
      change();
    };
    host.querySelector('[data-palette-accent]').onclick = () => {
      state.accent = '';
      change();
    };
    render();
    return {
      get: () => ({ ...state }),
      set: (value) => {
        state = window.XtrataMusicPlayer.normalize(value);
        render();
      }
    };
  }
  function init() {
    const section = document.createElement('section');
    section.id = 'musicAppearancePanel';
    section.innerHTML =
      '<div class="music-appearance-heading"><div><span class="tag">Make it yours</span><h2>Choose your player</h2><p class="muted">Three styles. One permanent home for your music.</p></div></div><div id="musicStyleControls"></div><button type="button" class="btn ghost" id="musicStyleApplyAll" hidden>Apply this appearance to all tracks</button><p id="musicStyleStatus" role="status" class="muted"></p>';
    const workspace = document.createElement('div');
    workspace.className = 'music-design-workspace';
    const preview = document.querySelector('#preview');
    preview.before(workspace);
    workspace.append(section, preview);
    const controls = mount(section.querySelector('#musicStyleControls'), {}, async () => {
      if (building || SB.busy || musicJobActive()) return;
      if (SB.active) {
        document.querySelector('#musicStyleStatus').textContent =
          'Defaults updated. Use “Apply this appearance to all tracks” to update the batch.';
        return;
      }
      if (FILE) {
        markEditsDirty();
        document.querySelector('#musicStyleStatus').textContent = 'Updating player and quote…';
        await document.querySelector('#applyEdits').onclick();
        document.querySelector('#musicStyleStatus').textContent = EST
          ? 'Preview and quote updated. Audio preparation is reused.'
          : 'Quote unavailable. Apply changes again before inscribing.';
      }
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
  window.XtrataMusicAppearance = { mount, init };
})();
