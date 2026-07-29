// HTML_Template.js
(function () {

const XTRATA_PLAYER_TEMPLATE_VERSION = 'xtrata-opus-player-v6';

const escapeHtml = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char]);

const escapeAttr = escapeHtml;

const escapeJsonForScript = (value) =>
  JSON.stringify(value, null, 2).replace(/</g, '\\u003c');

const stripDataUriPrefix = (value) => {
  const text = String(value ?? '').trim();
  const commaIndex = text.indexOf(',');
  return commaIndex >= 0 ? text.slice(commaIndex + 1) : text;
};

const normalizeBase64 = (value) => stripDataUriPrefix(value).replace(/\s+/g, '');

const normalizeMimeForDataUri = (mimeType, fallback) => {
  const raw = String(mimeType || fallback || '').trim();
  return (raw || fallback).replace(/\s*;\s*/g, ';');
};

const sanitizeAudioMimeType = (mimeType) => {
  const raw = String(mimeType || '').trim();
  return raw.startsWith('audio/') ? raw : 'audio/webm; codecs=opus';
};

const sanitizeVisualMimeType = (mimeType) => {
  const raw = String(mimeType || '').trim();
  return raw.startsWith('image/') || raw.startsWith('video/') ? raw : 'image/png';
};

const sanitizeImageMimeType = sanitizeVisualMimeType;

const AUDIO_ASSET_TYPE_LABELS = {
  song: 'Song',
  sample: 'Sample',
  stem: 'Stem',
  loop: 'Loop',
  voice: 'Voice',
  other: 'Audio'
};

const normalizeAssetType = (value) => {
  const key = String(value || '').trim().toLowerCase();
  return Object.prototype.hasOwnProperty.call(AUDIO_ASSET_TYPE_LABELS, key)
    ? key
    : 'song';
};

const buildInitials = (value) => {
  const words = String(value || 'X')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length > 1) {
    return words.slice(0, 2).map((word) => word.slice(0, 1)).join('').toUpperCase();
  }
  return (words[0] || 'X').slice(0, 2).toUpperCase();
};

const sanitizeTokenId = (value) => {
  const text = String(value ?? '').trim().replace(/^#/, '');
  return /^\d+$/.test(text) ? text : '';
};

const sanitizeNetwork = (value) =>
  String(value || 'mainnet').trim().toLowerCase() === 'testnet'
    ? 'testnet'
    : 'mainnet';

const sanitizeEndpointMode = (value) =>
  String(value || '').trim().toLowerCase() === 'compact'
    ? 'compact'
    : 'readable';

const dedupe = (values) => Array.from(new Set(values.filter(Boolean)));

const getVisualSourceMode = (config) => {
  if (config.visualSourceMode === 'recursive') return 'recursive';
  if (config.visualSourceMode === 'embedded') return 'embedded';
  const recursive = config.recursive || {};
  return sanitizeTokenId(recursive.coverTokenId) || String(recursive.coverUrl || '').trim()
    ? 'recursive'
    : 'embedded';
};

const buildRuntimeContentUrl = ({ tokenId, contractId, network, endpointMode }) => {
  const safeTokenId = sanitizeTokenId(tokenId);
  const safeContractId = String(contractId || '').trim();
  const safeNetwork = sanitizeNetwork(network);
  if (!safeTokenId) {
    return '';
  }
  if (safeNetwork === 'mainnet') {
    const route = sanitizeEndpointMode(endpointMode) === 'compact'
      ? 'i'
      : 'inscription';
    return `https://xtrata.xyz/${route}/${safeTokenId}`;
  }
  if (safeContractId) {
    const params = new URLSearchParams({
      contractId: safeContractId,
      tokenId: safeTokenId,
      network: safeNetwork
    });
    return `https://xtrata.xyz/runtime/content?${params.toString()}`;
  }
  return `https://xtrata.xyz/inscription/${safeTokenId}`;
};

const buildPlayerSource = (config) => {
  const mode =
    config.audioSourceMode === 'recursive' || config.mode === 'recursive'
      ? 'recursive'
      : 'embedded';
  const audioMimeType = sanitizeAudioMimeType(config.audioMimeType);
  if (mode === 'recursive') {
    const recursive = config.recursive || {};
    const explicitUrl = String(recursive.audioUrl || '').trim();
    const generatedUrl = buildRuntimeContentUrl({
      tokenId: recursive.audioTokenId || recursive.tokenId,
      contractId: recursive.contractId,
      network: recursive.network,
      endpointMode: recursive.endpointMode
    });
    return {
      mode,
      audioMimeType,
      source: explicitUrl || generatedUrl,
      sourceKind: explicitUrl ? 'custom-url' : generatedUrl ? 'xtrata-runtime' : ''
    };
  }

  const audioBase64 = normalizeBase64(config.audioBase64);
  return {
    mode,
    audioMimeType,
    source: audioBase64
      ? `data:${normalizeMimeForDataUri(audioMimeType, 'audio/webm;codecs=opus')};base64,${audioBase64}`
      : '',
    sourceKind: 'embedded-base64'
  };
};

const buildDependencies = (config) => {
  const recursive = config.recursive || {};
  return dedupe([
    config.audioSourceMode === 'recursive' || config.mode === 'recursive'
      ? sanitizeTokenId(recursive.audioTokenId || recursive.tokenId)
      : '',
    getVisualSourceMode(config) === 'recursive'
      ? sanitizeTokenId(recursive.coverTokenId)
      : ''
  ]);
};

const getRecursiveCoverKind = (config) => {
  const kind = String(config.recursive?.coverKind || '').trim().toLowerCase();
  return kind === 'video' ? 'video' : 'image';
};

const buildRecursiveCoverSource = (config) => {
  const recursive = config.recursive || {};
  const explicitUrl = String(recursive.coverUrl || '').trim();
  if (explicitUrl) {
    return {
      source: explicitUrl,
      kind: getRecursiveCoverKind(config),
      sourceKind: 'custom-url'
    };
  }
  const generatedUrl = buildRuntimeContentUrl({
    tokenId: recursive.coverTokenId,
    contractId: recursive.coverContractId || recursive.contractId,
    network: recursive.coverNetwork || recursive.network,
    endpointMode: recursive.coverEndpointMode || recursive.endpointMode
  });
  return {
    source: generatedUrl,
    kind: getRecursiveCoverKind(config),
    sourceKind: generatedUrl ? 'xtrata-runtime' : ''
  };
};

const buildVisualSource = (config) => {
  const sourceMode = getVisualSourceMode(config);
  if (sourceMode === 'recursive') {
    return buildRecursiveCoverSource(config);
  }

  const visualBase64 = normalizeBase64(config.visualBase64 || config.imageBase64);
  if (!visualBase64) {
    return { source: '', kind: 'placeholder', sourceKind: '' };
  }
  const visualMimeType = sanitizeVisualMimeType(
    config.visualMimeType || config.imageMimeType
  );
  return {
    source: `data:${normalizeMimeForDataUri(
      visualMimeType,
      'image/png'
    )};base64,${visualBase64}`,
    kind: visualMimeType.startsWith('video/') ? 'video' : 'image',
    sourceKind: 'embedded-base64'
  };
};

const normalizeArtFit = (value) =>
  String(value || '').trim().toLowerCase() === 'contain' ? 'contain' : 'cover';

const buildExportAssets = ({ config, source, visual }) => {
  // NOTE: For embedded assets the actual base64 payload already lives in the
  // DOM (the <audio><source src="data:..."> element and the cover markup).
  // We deliberately do NOT repeat the base64 here. Doing so doubled the size of
  // every embedded inscription (e.g. a 2MB audio + 360KB image produced a ~6MB
  // file). The manifest keeps only the descriptive metadata; the runtime reads
  // the media straight from the DOM, never from manifest.assets.
  return {
    audio:
      source.sourceKind === 'embedded-base64'
        ? {
            encoding: 'base64',
            mimeType: source.audioMimeType,
            inlinedIn: 'audio#xtrataAudio'
          }
        : {
            source: source.source,
            sourceKind: source.sourceKind,
            mimeType: source.audioMimeType
          },
    visual:
      visual.sourceKind === 'embedded-base64'
        ? {
            encoding: 'base64',
            mimeType: sanitizeVisualMimeType(config.visualMimeType || config.imageMimeType),
            kind: visual.kind,
            inlinedIn: 'cover'
          }
        : {
            source: visual.source,
            sourceKind: visual.sourceKind,
            mimeType: sanitizeVisualMimeType(config.visualMimeType || config.imageMimeType),
            kind: visual.kind
          }
  };
};

const buildCoverMarkup = (config, title) => {
  const visual = buildVisualSource(config);
  if (!visual.source) {
    return `<div class="cover-placeholder" aria-hidden="true">${escapeHtml(
      buildInitials(title)
    )}</div>`;
  }
  if (visual.kind === 'video') {
    const typeAttribute =
      visual.source.startsWith('data:') && config.visualMimeType
        ? ` type="${escapeAttr(sanitizeVisualMimeType(config.visualMimeType))}"`
        : '';
    return `<video muted loop playsinline autoplay preload="metadata" aria-label="${escapeAttr(
      title
    )} visual"><source src="${escapeAttr(
      visual.source
    )}"${typeAttribute} data-xtrata-asset="visual">This browser cannot play the visual.</video>`;
  }
  return `<img src="${escapeAttr(
    visual.source
  )}" alt="${escapeAttr(title)} cover art" data-xtrata-asset="visual">`;
};

const buildXtrataAudioPlayerHtml = (config) => {
  const metadata = config.metadata || {};
  const title = String(metadata.title || 'Xtrata Audio Player').trim();
  const assetType = normalizeAssetType(metadata.assetType);
  const assetTypeLabel = AUDIO_ASSET_TYPE_LABELS[assetType];
  const artist = String(metadata.artist || '').trim();
  const album = String(metadata.album || '').trim();
  const stemRole = String(metadata.stemRole || '').trim();
  const instrument = String(metadata.instrument || '').trim();
  const note = String(metadata.note || '').trim();
  const frequency = String(metadata.frequency || '').trim();
  const description = String(metadata.description || '').trim();
  const license = String(metadata.license || '').trim();
  const isLoop = Boolean(metadata.isLoop);
  const bpm = String(metadata.bpm || '').trim();
  const lyrics = String(metadata.lyrics || '').trim();   // Xtrata Agent One: optional lyrics panel (enhancement over upstream tool)
  const source = buildPlayerSource(config);
  const visual = buildVisualSource(config);
  const dependencies = buildDependencies(config);
  const artFit = normalizeArtFit(config.artFit || metadata.artFit);

  if (!source.source) {
    return `<!DOCTYPE html><html><head><title>Error</title></head><body><h1>Error generating Xtrata audio player: missing audio source.</h1></body></html>`;
  }

  const modeLabel =
    source.mode === 'recursive'
      ? 'Recursive Xtrata audio player'
      : 'Standalone embedded audio player';
  const manifest = {
    template: XTRATA_PLAYER_TEMPLATE_VERSION,
    mode: source.mode,
    sourceKind: source.sourceKind,
    audioMimeType: source.audioMimeType,
    visualSourceMode: getVisualSourceMode(config),
    visualSourceKind: visual.sourceKind,
    visualMimeType: sanitizeVisualMimeType(config.visualMimeType || config.imageMimeType),
    assets: buildExportAssets({ config, source, visual }),
    dependencies,
    metadata: {
      assetType,
      title,
      artist,
      album,
      stemRole,
      instrument,
      note,
      frequency,
      description,
      license,
      isLoop,
      bpm
    }
  };

  // Type and Loop are deliberately omitted from the visible metadata panel —
  // artist + title lead, everything else only shows when supplied.
  const detailRows = [
    ['Artist', artist],
    ['Album', album],
    ['Stem', stemRole],
    ['Instrument', instrument],
    ['Note', note],
    ['Frequency', frequency],
    ['BPM', bpm],
    ['License', license],
    ['Dependencies', dependencies.join(', ')]
  ]
    .filter(([, value]) => String(value || '').trim())
    .map(
      ([label, value]) =>
        `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`
    )
    .join('\n');

  const externalLink =
    source.mode === 'recursive' && /^https?:\/\//i.test(source.source)
      ? `<a class="source-link" href="${escapeAttr(
          source.source
        )}" target="_blank" rel="noopener noreferrer">Open audio source</a>`
      : '';
  const subtitle = [artist, album].filter(Boolean).join(' - ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <style>
    :root {
      color-scheme: dark;
      --page: #10120f;
      --ink: #f8f3e7;
      --muted: rgba(248, 243, 231, 0.72);
      --line: rgba(248, 243, 231, 0.18);
      --panel: rgba(16, 18, 15, 0.78);
      --panel-strong: rgba(16, 18, 15, 0.92);
      --accent: #b8e08d;
      --accent-strong: #f1c75b;
      --error: #f09aaa;
    }

    * { box-sizing: border-box; }

    html {
      width: 100%;
      height: 100%;
    }

    body {
      margin: 0;
      min-width: 0;
      min-height: 100vh;
      min-height: 100dvh;
      width: 100%;
      display: grid;
      place-items: center;
      background: var(--page);
      color: var(--ink);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      line-height: 1.45;
      padding: 0;
      overflow: hidden;
    }

    .player {
      position: relative;
      width: min(100vmin, 760px);
      height: auto;
      max-width: 100%;
      max-height: 100%;
      aspect-ratio: 1 / 1;
      border: 1px solid rgba(255, 255, 255, 0.16);
      border-radius: 8px;
      background: #151812;
      box-shadow: 0 24px 80px rgba(0, 0, 0, 0.38);
      overflow: hidden;
      container-type: size;
    }

    .stage {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      background: #dfe8df;
      overflow: hidden;
      cursor: pointer;
      user-select: none;
      touch-action: manipulation;
    }

    .stage:focus-visible {
      outline: 3px solid var(--accent);
      outline-offset: -6px;
    }

    .cover-media {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      background: #dfe8df;
    }

    .cover-media img,
    .cover-media video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      pointer-events: none;
    }

    .player[data-art-fit="contain"] .cover-media img,
    .player[data-art-fit="contain"] .cover-media video {
      object-fit: contain;
      background: #dfe8df;
    }

    .cover-placeholder {
      width: min(40%, 220px);
      aspect-ratio: 1 / 1;
      display: grid;
      place-items: center;
      border: 2px solid rgba(36, 95, 69, 0.4);
      border-radius: 50%;
      color: #245f45;
      font-size: clamp(3rem, 13vmin, 7rem);
      font-weight: 900;
      background: rgba(36, 95, 69, 0.08);
    }

    .stage-scrim {
      position: absolute;
      inset: 0;
      pointer-events: none;
      background:
        linear-gradient(180deg, rgba(0, 0, 0, 0.62), transparent 24%),
        linear-gradient(0deg, rgba(0, 0, 0, 0.7), transparent 44%);
    }

    .top-bar {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      z-index: 3;
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 10px;
      align-items: start;
      padding: 12px;
      pointer-events: none;
    }

    .track-copy {
      min-width: 0;
      color: var(--ink);
      text-shadow: 0 2px 18px rgba(0, 0, 0, 0.42);
      transition: opacity 0.18s ease, transform 0.18s ease;
    }

    .eyebrow {
      margin: 0 0 6px;
      color: var(--accent);
      font-size: 0.78rem;
      font-weight: 900;
      letter-spacing: 0;
      text-transform: uppercase;
    }

    h1 {
      margin: 0;
      font-size: clamp(1.15rem, 5.6vmin, 2.35rem);
      line-height: 1.05;
      letter-spacing: 0;
      max-width: 16ch;
      overflow-wrap: anywhere;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .artist {
      margin: 6px 0 0;
      color: rgba(248, 243, 231, 0.82);
      font-size: clamp(0.82rem, 2vmin, 1rem);
      font-weight: 700;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .top-actions,
    .transport-row,
    .drawer-tabs {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .top-actions {
      pointer-events: auto;
      transition: opacity 0.18s ease;
    }

    .player[data-playback="playing"][data-panel="closed"] .track-copy {
      opacity: 0;
      transform: translateY(-4px);
    }

    .player[data-playback="playing"][data-panel="closed"] .top-actions {
      opacity: 0.72;
    }

    .player[data-playback="playing"][data-panel="closed"]:hover .track-copy,
    .player[data-playback="playing"][data-panel="closed"]:focus-within .track-copy {
      opacity: 1;
      transform: translateY(0);
    }

    /* Cursor-idle fade: 2 s after the cursor stops moving, EVERY programmatically
       layered overlay (title/artist, action buttons, hint, hover transport) fades
       away so the artwork can be viewed clean — in every state, including during
       playback and with the drawer open. Any pointer movement or key press brings
       them back (keyboard users stay covered via the keydown wake). */
    .track-copy,
    .click-hint,
    .hover-transport {
      transition: opacity 0.35s ease, transform 0.18s ease;
    }

    .player[data-idle="true"] .track-copy,
    .player[data-idle="true"] .top-actions,
    .player[data-idle="true"] .click-hint,
    .player[data-idle="true"] .hover-transport {
      opacity: 0 !important;
    }


    button {
      min-height: 34px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(16, 18, 15, 0.62);
      color: var(--ink);
      font: inherit;
      font-weight: 900;
      cursor: pointer;
    }

    button:hover,
    button:focus-visible {
      border-color: rgba(248, 243, 231, 0.42);
      background: rgba(248, 243, 231, 0.16);
    }

    button:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
    }

    .icon-button {
      width: 38px;
      padding: 0;
      display: inline-grid;
      place-items: center;
    }

    .eye-icon {
      position: relative;
      width: 18px;
      height: 12px;
      border: 2px solid currentColor;
      border-radius: 50%;
    }

    .eye-icon::after {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: currentColor;
      transform: translate(-50%, -50%);
    }

    .dots-icon {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: currentColor;
      box-shadow: -7px 0 0 currentColor, 7px 0 0 currentColor;
    }

    .click-hint {
      position: absolute;
      z-index: 2;
      left: 50%;
      bottom: 54px;
      max-width: calc(100% - 32px);
      transform: translateX(-50%);
      border: 1px solid rgba(248, 243, 231, 0.22);
      border-radius: 8px;
      background: rgba(16, 18, 15, 0.6);
      color: var(--ink);
      padding: 6px 10px;
      font-size: clamp(0.74rem, 2vmin, 0.9rem);
      font-weight: 900;
      text-align: center;
      pointer-events: none;
      transition: opacity 0.18s ease;
    }

    .player[data-playback="playing"] .click-hint {
      opacity: 0;
    }

    .player[data-panel]:not([data-panel="closed"]) .click-hint {
      opacity: 0;
    }

    .audio-native {
      position: absolute;
      width: 1px;
      height: 1px;
      opacity: 0;
      pointer-events: none;
    }

    .status {
      min-height: 24px;
      margin: 0;
      color: var(--muted);
      font-size: 0.88rem;
      font-weight: 700;
    }

    .status.error { color: var(--error); }

    .drawer {
      position: absolute;
      z-index: 4;
      left: 0;
      right: 0;
      bottom: 0;
      height: 49%;
      display: grid;
      grid-template-rows: minmax(0, 1fr);
      border-top: 1px solid rgba(248, 243, 231, 0.16);
      background: linear-gradient(180deg, rgba(16, 18, 15, 0.72), rgba(16, 18, 15, 0.96));
      color: var(--ink);
      backdrop-filter: blur(16px);
      transform: translateY(100%);
      transition: transform 0.2s ease;
      pointer-events: auto;
    }

    .player[data-panel="controls"] .drawer,
    .player[data-panel="info"] .drawer,
    .player[data-panel="metadata"] .drawer,
    .player[data-panel="lyrics"] .drawer {
      transform: translateY(0);
    }

    .drawer-body {
      min-height: 0;
      display: grid;
      grid-template-rows: auto minmax(0, 1fr);
      gap: 10px;
      padding: 0 12px 12px;
    }

    .drawer-tabs {
      min-width: 0;
    }

    .drawer-tabs button {
      flex: 1 1 0;
      min-width: 0;
      min-height: 32px;
      padding: 0 8px;
      font-size: 0.78rem;
    }

    .drawer-tabs button.is-active {
      border-color: var(--accent);
      background: rgba(184, 224, 141, 0.18);
      color: var(--accent);
    }

    .panel-view {
      min-height: 0;
      display: grid;
      align-content: start;
      gap: 10px;
      overflow: hidden;
    }

    .panel-view[hidden] {
      display: none;
    }

    .panel-lyrics {
      overflow: hidden;
      min-height: 0;
      grid-template-rows: auto minmax(0, 1fr);
    }

    .lyrics {
      margin: 0;
      max-height: 100%;
      overflow-y: auto;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      font-family: inherit;
      font-size: 0.84rem;
      font-weight: 600;
      line-height: 1.5;
      color: var(--ink);
      -webkit-overflow-scrolling: touch;
    }

    .transport-row {
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
    }

    .transport-row button {
      min-width: 0;
      min-height: 36px;
      padding: 0 8px;
      font-size: 0.78rem;
    }

    .play-toggle {
      background: var(--accent);
      border-color: var(--accent);
      color: #10120f;
    }

    .time-row {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      gap: 10px;
      align-items: center;
      color: var(--muted);
      font-size: 0.78rem;
      font-weight: 900;
    }

    .waveform {
      position: relative;
      min-height: 58px;
      border: 1px solid rgba(248, 243, 231, 0.14);
      border-radius: 8px;
      background: rgba(248, 243, 231, 0.08);
      overflow: hidden;
    }

    .waveform-bars {
      position: absolute;
      inset: 8px;
      display: grid;
      grid-template-columns: repeat(64, minmax(1px, 1fr));
      gap: 2px;
      align-items: center;
      pointer-events: none;
    }

    .waveform-bars span {
      display: block;
      height: var(--bar-height, 44%);
      min-height: 6px;
      border-radius: 999px;
      background: rgba(248, 243, 231, 0.28);
    }

    .waveform-bars span.is-played {
      background: var(--accent-strong);
    }

    .waveform-range {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      margin: 0;
      cursor: pointer;
      opacity: 0;
    }

    /* Hover transport: high-res waveform + seek bar over the bottom of the artwork.
       Shown while the cursor is moving over the stage; fades out 2s after the
       cursor stops. Kept above the scrim, below the drawer. */
    .hover-transport {
      position: absolute;
      z-index: 3;
      left: 0;
      right: 0;
      bottom: 0;
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      gap: 10px;
      align-items: center;
      padding: 14px 14px 12px;
      background: linear-gradient(0deg, rgba(16, 18, 15, 0.82), rgba(16, 18, 15, 0.4) 70%, transparent);
      color: var(--muted);
      font-size: 0.74rem;
      font-weight: 900;
      opacity: 0;
      transform: translateY(6px);
      transition: opacity 0.22s ease, transform 0.22s ease;
      pointer-events: none;
    }

    .player[data-transport="visible"] .hover-transport,
    .hover-transport:focus-within {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }

    .player:not([data-panel="closed"]) .hover-transport {
      opacity: 0;
      pointer-events: none;
    }

    .hover-wave {
      position: relative;
      height: 64px;
      min-width: 0;
    }

    .hover-wave canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      display: block;
      border-radius: 6px;
    }

    .lyrics-scroll-switch {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: var(--muted);
      font-size: 0.72rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      cursor: pointer;
      user-select: none;
    }

    .lyrics-scroll-switch input {
      appearance: none;
      width: 34px;
      height: 18px;
      margin: 0;
      border: 1px solid var(--line);
      border-radius: 999px;
      background: rgba(248, 243, 231, 0.12);
      position: relative;
      cursor: pointer;
      transition: background 0.15s ease, border-color 0.15s ease;
    }

    .lyrics-scroll-switch input::after {
      content: "";
      position: absolute;
      top: 2px;
      left: 2px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--ink);
      transition: transform 0.15s ease;
    }

    .lyrics-scroll-switch input:checked {
      background: rgba(184, 224, 141, 0.4);
      border-color: var(--accent);
    }

    .lyrics-scroll-switch input:checked::after {
      transform: translateX(16px);
      background: var(--accent);
    }

    .description {
      margin: 0;
      color: var(--muted);
      font-size: 0.84rem;
      font-weight: 700;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .metadata-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 6px;
      margin: 0;
    }

    .metadata-grid div {
      border: 1px solid rgba(248, 243, 231, 0.12);
      border-radius: 8px;
      padding: 6px 8px;
      background: rgba(248, 243, 231, 0.08);
      min-width: 0;
    }

    dt {
      color: var(--muted);
      font-size: 0.62rem;
      font-weight: 900;
      text-transform: uppercase;
    }

    dd {
      margin: 3px 0 0;
      overflow-wrap: anywhere;
      font-weight: 800;
      font-size: 0.78rem;
    }

    .source-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 34px;
      border: 1px solid var(--line);
      border-radius: 8px;
      color: var(--accent);
      padding: 0 10px;
      font-weight: 900;
      text-decoration: none;
      font-size: 0.78rem;
    }

    @media (max-width: 560px) {
      .player { width: min(96vmin, 100%); }
      .drawer { height: 54%; }
      .metadata-grid { grid-template-columns: 1fr; }
      .top-bar { padding: 10px; }
      .transport-row button { font-size: 0.72rem; }
    }

    @container (max-width: 320px) {
      .player {
        width: 100%;
        height: 100%;
        border-radius: 6px;
        box-shadow: none;
      }

      .top-bar {
        grid-template-columns: minmax(0, 1fr);
        padding: clamp(6px, 5cqw, 10px);
      }

      .eyebrow,
      .artist,
      .click-hint {
        display: none;
      }

      .top-actions {
        justify-self: end;
        gap: 5px;
      }

      .icon-button {
        width: clamp(26px, 12cqw, 34px);
        min-height: clamp(26px, 12cqw, 34px);
        border-radius: 6px;
      }

      .eye-icon {
        width: 14px;
        height: 9px;
      }

      .eye-icon::after {
        width: 4px;
        height: 4px;
      }

      .dots-icon {
        width: 3px;
        height: 3px;
        box-shadow: -5px 0 0 currentColor, 5px 0 0 currentColor;
      }

      .drawer {
        height: min(78%, 240px);
        grid-template-rows: minmax(0, 1fr);
        transform: translateY(100%);
      }

      .drawer-body {
        gap: 6px;
        padding: 8px;
      }

      .drawer-tabs {
        gap: 4px;
      }

      .drawer-tabs button,
      .transport-row button {
        min-height: clamp(26px, 12cqw, 32px);
        padding: 0 4px;
        font-size: clamp(0.58rem, 4cqw, 0.72rem);
      }

      .transport-row {
        gap: 4px;
      }

      .time-row {
        gap: 6px;
        font-size: clamp(0.58rem, 4cqw, 0.72rem);
      }

      .waveform {
        min-height: clamp(34px, 18cqw, 48px);
      }

      .description,
      dd {
        font-size: clamp(0.62rem, 4cqw, 0.76rem);
      }

      dt {
        font-size: clamp(0.5rem, 3cqw, 0.62rem);
      }

      h1 {
        max-width: 13ch;
        font-size: clamp(0.72rem, 8cqw, 1.15rem);
        line-height: 1.02;
        -webkit-line-clamp: 2;
      }

      .stage-scrim {
        background:
          linear-gradient(180deg, rgba(0, 0, 0, 0.58), transparent 34%),
          linear-gradient(0deg, rgba(0, 0, 0, 0.35), transparent 34%);
      }

      .cover-placeholder {
        width: 40%;
        font-size: clamp(1.8rem, 18cqw, 3.2rem);
      }
    }

    @media (max-width: 320px), (max-height: 320px) {
      .player {
        width: 100vmin;
        height: 100vmin;
        box-shadow: none;
      }

      .eyebrow,
      .artist,
      .click-hint {
        display: none;
      }

      .top-actions {
        justify-self: end;
        gap: 5px;
      }

      .icon-button {
        width: clamp(26px, 12vmin, 34px);
        min-height: clamp(26px, 12vmin, 34px);
        border-radius: 6px;
      }

      .eye-icon {
        width: 14px;
        height: 9px;
      }

      .eye-icon::after {
        width: 4px;
        height: 4px;
      }

      .dots-icon {
        width: 3px;
        height: 3px;
        box-shadow: -5px 0 0 currentColor, 5px 0 0 currentColor;
      }

      .drawer {
        height: min(78%, 240px);
        grid-template-rows: minmax(0, 1fr);
        transform: translateY(100%);
      }

      .drawer-body {
        gap: 6px;
        padding: 8px;
      }

      .drawer-tabs {
        gap: 4px;
      }

      .drawer-tabs button,
      .transport-row button {
        min-height: clamp(26px, 12vmin, 32px);
        padding: 0 4px;
        font-size: clamp(0.58rem, 4vmin, 0.72rem);
      }

      .transport-row {
        gap: 4px;
      }

      .time-row {
        gap: 6px;
        font-size: clamp(0.58rem, 4vmin, 0.72rem);
      }

      .waveform {
        min-height: clamp(34px, 18vmin, 48px);
      }

      .description,
      dd {
        font-size: clamp(0.62rem, 4vmin, 0.76rem);
      }

      dt {
        font-size: clamp(0.5rem, 3vmin, 0.62rem);
      }

      .top-bar {
        grid-template-columns: minmax(0, 1fr);
        padding: 8px;
      }

      h1 {
        max-width: 13ch;
        font-size: clamp(0.72rem, 8vmin, 1.15rem);
        line-height: 1.02;
        -webkit-line-clamp: 2;
      }
    }
  </style>
</head>
<body>
  <main id="xtrataPlayer" class="player" data-panel="closed" data-playback="idle" data-xtrata-player-mode="${escapeAttr(
    source.mode
  )}" data-xtrata-dependencies="${escapeAttr(
    dependencies.join(',')
  )}" data-art-fit="${escapeAttr(artFit)}" data-xtrata-template="${escapeAttr(
    XTRATA_PLAYER_TEMPLATE_VERSION
  )}">
    <section id="xtrataCover" class="stage" role="button" tabindex="0" aria-label="Click artwork to play or pause. Double click to stop and reset." title="Click to play or pause. Double click to stop and reset.">
      <div class="cover-media" aria-hidden="true">${buildCoverMarkup(config, title)}</div>
      <div class="stage-scrim" aria-hidden="true"></div>
      <header class="top-bar">
        <div class="track-copy">
          <h1>${escapeHtml(title)}</h1>
          ${subtitle ? `<p class="artist">${escapeHtml(subtitle)}</p>` : ''}
        </div>
        <div class="top-actions" data-player-control>
          <button id="infoToggle" class="icon-button" type="button" aria-expanded="false" aria-controls="playerDrawer" title="Show waveform controls" aria-label="Show waveform controls"><span class="eye-icon" aria-hidden="true"></span></button>
          <button id="controlsToggle" class="icon-button" type="button" aria-expanded="false" aria-controls="playerDrawer" title="Show player info" aria-label="Show player info"><span class="dots-icon" aria-hidden="true"></span></button>
        </div>
      </header>
      <div id="clickHint" class="click-hint" aria-hidden="true">Click artwork to play</div>
      <div id="hoverTransport" class="hover-transport" data-player-control>
        <span id="hoverCurrentTime">0:00</span>
        <div class="hover-wave">
          <canvas id="hoverWaveCanvas" aria-hidden="true"></canvas>
          <input id="hoverSeekRange" class="waveform-range" type="range" min="0" max="1000" value="0" aria-label="Seek playback position">
        </div>
        <span id="hoverDurationTime">0:00</span>
      </div>
      <section id="playerDrawer" class="drawer" data-player-control aria-label="Player controls and information">
        <div id="drawerBody" class="drawer-body">
          <div class="drawer-tabs" role="tablist" aria-label="Player panel">
            <button type="button" role="tab" data-panel-target="controls" aria-selected="false">Controls</button>
            <button type="button" role="tab" data-panel-target="info" aria-selected="false">Info</button>
            <button type="button" role="tab" data-panel-target="metadata" aria-selected="false">Metadata</button>
            ${lyrics ? '<button type="button" role="tab" data-panel-target="lyrics" aria-selected="false">Lyrics</button>' : ''}
          </div>

          <section class="panel-view" data-panel-view="controls" role="tabpanel" hidden>
            <div class="transport-row">
              <button id="restartButton" type="button">Restart</button>
              <button id="backButton" type="button">-15</button>
              <button id="playToggleButton" class="play-toggle" type="button">Play</button>
              <button id="forwardButton" type="button">+15</button>
              <button id="muteButton" type="button">Mute</button>
            </div>
            <div class="time-row">
              <span id="currentTime">0:00</span>
              <div id="waveform" class="waveform">
                <div id="waveformBars" class="waveform-bars" aria-hidden="true"></div>
                <input id="seekRange" class="waveform-range" type="range" min="0" max="1000" value="0" aria-label="Seek playback position">
              </div>
              <span id="durationTime">0:00</span>
            </div>
            <p id="playerStatus" class="status">Ready.</p>
          </section>

          <section class="panel-view" data-panel-view="info" role="tabpanel" hidden>
            <p class="description">Click the artwork to play or pause. Double click it to stop and reset to the beginning. Open controls for seek, restart, mute, and waveform-style scrubbing.</p>
            <p class="description">Keyboard: Enter or Space toggles playback. Escape stops and resets.</p>
          </section>

          <section class="panel-view" data-panel-view="metadata" role="tabpanel" hidden>
            ${description ? `<p class="description">${escapeHtml(description)}</p>` : ''}
            ${detailRows ? `<dl class="metadata-grid">${detailRows}</dl>` : '<p class="description">No extra metadata supplied.</p>'}
            ${externalLink}
          </section>
          ${lyrics ? `<section class="panel-view panel-lyrics" data-panel-view="lyrics" role="tabpanel" hidden><label class="lyrics-scroll-switch"><input type="checkbox" id="lyricsAutoScroll" checked> Auto-scroll</label><pre id="lyricsText" class="lyrics">${escapeHtml(lyrics)}</pre></section>` : ''}
        </div>
      </section>
    </section>
    <audio id="xtrataAudio" class="audio-native" preload="auto" data-xtrata-asset="audio"${
      isLoop ? ' loop' : ''
    }>
      <source src="${escapeAttr(source.source)}" type="${escapeAttr(
        source.audioMimeType
      )}">
    </audio>
  </main>
  <script type="application/json" id="xtrataPlayerManifest">${escapeJsonForScript(
    manifest
  )}<\/script>
  <script>
    (function () {
      const player = document.getElementById('xtrataPlayer');
      const audio = document.getElementById('xtrataAudio');
      const cover = document.getElementById('xtrataCover');
      const status = document.getElementById('playerStatus');
      const infoToggle = document.getElementById('infoToggle');
      const controlsToggle = document.getElementById('controlsToggle');
      const playToggleButton = document.getElementById('playToggleButton');
      const restartButton = document.getElementById('restartButton');
      const backButton = document.getElementById('backButton');
      const forwardButton = document.getElementById('forwardButton');
      const muteButton = document.getElementById('muteButton');
      const seekRange = document.getElementById('seekRange');
      const currentTimeLabel = document.getElementById('currentTime');
      const durationTimeLabel = document.getElementById('durationTime');
      const clickHint = document.getElementById('clickHint');
      const waveformBars = document.getElementById('waveformBars');
      const hoverTransport = document.getElementById('hoverTransport');
      const hoverWaveCanvas = document.getElementById('hoverWaveCanvas');
      const hoverSeekRange = document.getElementById('hoverSeekRange');
      const hoverCurrentTime = document.getElementById('hoverCurrentTime');
      const hoverDurationTime = document.getElementById('hoverDurationTime');
      const lyricsAutoScroll = document.getElementById('lyricsAutoScroll');
      const lyricsText = document.getElementById('lyricsText');
      const panelButtons = Array.from(document.querySelectorAll('[data-panel-target]'));
      const panelViews = Array.from(document.querySelectorAll('[data-panel-view]'));
      const manifestNode = document.getElementById('xtrataPlayerManifest');
      let coverClickTimer = 0;
      let activePanel = 'closed';
      // Buffering gate: hold the "click to play" affordance until enough audio is
      // buffered that the first click starts cleanly at 0:00 with no clipped intro.
      let isAudioReady = false;
      const BUFFER_TARGET_SECONDS = 8;
      let manifest = {};
      try {
        manifest = JSON.parse(manifestNode.textContent || '{}');
      } catch (_error) {
        manifest = {};
      }

      const formatTime = (seconds) => {
        if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const wholeSeconds = Math.floor(seconds % 60);
        return minutes + ':' + String(wholeSeconds).padStart(2, '0');
      };

      const setStatus = (message, isError) => {
        if (!status) return;
        status.textContent = message;
        status.classList.toggle('error', Boolean(isError));
      };

      if (!audio) return;

      // Waveform peaks. Starts as a seeded placeholder, replaced by the real
      // decoded waveform (Web Audio) as soon as the track is available.
      let wavePeaks = null;
      const HOVER_PEAK_COUNT = 480;

      const placeholderPeaks = () => {
        const title = (manifest.metadata && manifest.metadata.title) || document.title || 'xtrata';
        const seed = title.split('').reduce((total, char) => total + char.charCodeAt(0), 0) || 42;
        const peaks = new Array(HOVER_PEAK_COUNT);
        for (let index = 0; index < HOVER_PEAK_COUNT; index += 1) {
          peaks[index] = 0.2 + Math.abs(Math.sin((index + 1) * (seed % 17 + 5)) * Math.cos((index + 3) * 0.37)) * 0.76;
        }
        return peaks;
      };

      const samplePeak = (fraction) => {
        if (!wavePeaks || !wavePeaks.length) return 0.4;
        const index = Math.min(wavePeaks.length - 1, Math.max(0, Math.round(fraction * (wavePeaks.length - 1))));
        return wavePeaks[index];
      };

      const renderWaveform = () => {
        if (!waveformBars) return;
        waveformBars.innerHTML = '';
        for (let index = 0; index < 64; index += 1) {
          const bar = document.createElement('span');
          const height = Math.round(20 + samplePeak(index / 63) * 76);
          bar.style.setProperty('--bar-height', height + '%');
          waveformBars.appendChild(bar);
        }
      };

      // High-res waveform canvas over the artwork (crisp at devicePixelRatio).
      const drawHoverWave = () => {
        if (!hoverWaveCanvas || !wavePeaks) return;
        const rect = hoverWaveCanvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const scale = Math.min(window.devicePixelRatio || 1, 3);
        const width = Math.round(rect.width * scale);
        const height = Math.round(rect.height * scale);
        if (hoverWaveCanvas.width !== width) hoverWaveCanvas.width = width;
        if (hoverWaveCanvas.height !== height) hoverWaveCanvas.height = height;
        const context = hoverWaveCanvas.getContext('2d');
        if (!context) return;
        context.clearRect(0, 0, width, height);
        const duration = getDuration();
        const current = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
        const playedFraction = duration ? Math.max(0, Math.min(1, current / duration)) : 0;
        const count = wavePeaks.length;
        const step = width / count;
        const barWidth = Math.max(1, step - Math.max(1, Math.round(scale)));
        const middle = height / 2;
        for (let index = 0; index < count; index += 1) {
          const peak = wavePeaks[index];
          const barHeight = Math.max(2 * scale, peak * (height - 4 * scale));
          const x = index * step;
          context.fillStyle = index / count <= playedFraction
            ? 'rgba(241, 199, 91, 0.95)'
            : 'rgba(248, 243, 231, 0.42)';
          context.fillRect(x, middle - barHeight / 2, barWidth, barHeight);
        }
      };

      // Decode the actual audio into peaks for the real waveform. Works for
      // embedded base64 data URIs and remote recursive sources alike; on any
      // failure the seeded placeholder remains.
      const loadRealWaveform = () => {
        const sourceNode = audio.querySelector('source');
        const src = sourceNode ? sourceNode.getAttribute('src') : '';
        if (!src || typeof window.fetch !== 'function') return;
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        fetch(src)
          .then((response) => response.arrayBuffer())
          .then((buffer) => {
            const context = new AudioContextClass();
            return context.decodeAudioData(buffer).then((decoded) => {
              try { context.close(); } catch (_error) {}
              return decoded;
            });
          })
          .then((decoded) => {
            const channel = decoded.getChannelData(0);
            const bucketSize = Math.max(1, Math.floor(channel.length / HOVER_PEAK_COUNT));
            const peaks = new Array(HOVER_PEAK_COUNT);
            let maxPeak = 0;
            for (let index = 0; index < HOVER_PEAK_COUNT; index += 1) {
              const start = index * bucketSize;
              const end = Math.min(channel.length, start + bucketSize);
              let peak = 0;
              for (let cursor = start; cursor < end; cursor += 1) {
                const value = Math.abs(channel[cursor]);
                if (value > peak) peak = value;
              }
              peaks[index] = peak;
              if (peak > maxPeak) maxPeak = peak;
            }
            if (maxPeak > 0) {
              for (let index = 0; index < HOVER_PEAK_COUNT; index += 1) {
                peaks[index] = Math.max(0.04, peaks[index] / maxPeak);
              }
            }
            wavePeaks = peaks;
            renderWaveform();
            updateProgress();
            drawHoverWave();
          })
          .catch(() => {
            // Keep the placeholder waveform.
          });
      };

      const waveformBarNodes = () =>
        waveformBars ? Array.from(waveformBars.children) : [];

      const getDuration = () =>
        Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 0;

      const setPanel = (panelName) => {
        activePanel = panelName;
        if (player) player.dataset.panel = panelName;
        const isOpen = panelName !== 'closed';
        [infoToggle, controlsToggle].forEach((button) => {
          if (button) button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
        panelButtons.forEach((button) => {
          const selected = button.dataset.panelTarget === panelName;
          button.classList.toggle('is-active', selected);
          button.setAttribute('aria-selected', selected ? 'true' : 'false');
        });
        panelViews.forEach((view) => {
          view.hidden = view.dataset.panelView !== panelName;
        });
      };

      const togglePanel = (panelName) => {
        setPanel(activePanel === panelName ? 'closed' : panelName);
      };

      const clearCoverClickTimer = () => {
        if (!coverClickTimer) return;
        window.clearTimeout(coverClickTimer);
        coverClickTimer = 0;
      };

      const resetAudioToStart = () => {
        clearCoverClickTimer();
        audio.pause();
        try {
          audio.currentTime = 0;
        } catch (_error) {
          // Some browsers reject seeking before media metadata is available.
        }
        setStatus('Stopped. Ready from beginning.');
        updateProgress();
        updatePlaybackUi();
      };

      const toggleAudioPlayback = () => {
        clearCoverClickTimer();
        if (!audio.paused && !audio.ended) {
          audio.pause();
          setStatus('Paused.');
          return;
        }

        // NEVER defer the play() call. A tap is the browser's permission to make
        // sound, and it only counts while the handler is still running — calling
        // play() later, from a buffering event, is blocked outright on mobile. This
        // used to return here and wait for readiness, so the first tap was swallowed
        // and the queued play was refused; only a tap that happened to land AFTER
        // buffering finished ever worked, which is why it felt like a gate opening
        // at random and rewarded frantic tapping.
        //
        // Calling play() on an element that is still loading is well-defined: it
        // starts as soon as there is data, from currentTime 0, and keeps the gesture
        // authorisation. The buffering state is still shown, it just no longer gates.
        if (audio.ended) {
          try {
            audio.currentTime = 0;
          } catch (_error) {}
        }

        if (!isAudioReady) setStatus('Buffering audio… playback will start automatically.');
        const playResult = audio.play();
        if (playResult && typeof playResult.catch === 'function') {
          playResult
            .then(() => setStatus('Playing.'))
            .catch(() => {
              setStatus('Playback was blocked. Use the audio controls to start playback.', true);
            });
        } else {
          setStatus('Playing.');
        }
      };

      const seekBy = (seconds) => {
        const duration = getDuration();
        const next = Math.max(0, Math.min(duration || audio.currentTime + seconds, audio.currentTime + seconds));
        try {
          audio.currentTime = next;
        } catch (_error) {}
        updateProgress();
      };

      const updatePlaybackUi = () => {
        const isPlaying = !audio.paused && !audio.ended;
        if (player) {
          player.dataset.playback = isPlaying ? 'playing' : audio.currentTime > 0 ? 'paused' : 'idle';
        }
        if (playToggleButton) {
          playToggleButton.textContent = isPlaying ? 'Pause' : 'Play';
          // Never disabled while buffering: that tap is the only thing that can
          // authorise sound on mobile, and swallowing it is what broke playback.
          playToggleButton.disabled = false;
        }
        if (clickHint) {
          clickHint.textContent = !isAudioReady
            ? 'Buffering audio…'
            : isPlaying
              ? 'Click artwork to pause'
              : 'Click artwork to play';
        }
        if (muteButton) muteButton.textContent = audio.muted ? 'Unmute' : 'Mute';
      };

      const updateProgress = () => {
        const duration = getDuration();
        const current = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
        const fraction = duration ? Math.max(0, Math.min(1, current / duration)) : 0;
        if (currentTimeLabel) currentTimeLabel.textContent = formatTime(current);
        if (durationTimeLabel) durationTimeLabel.textContent = formatTime(duration);
        if (seekRange && document.activeElement !== seekRange) {
          seekRange.value = Math.round(fraction * 1000);
          seekRange.setAttribute('aria-valuetext', formatTime(current) + ' of ' + formatTime(duration));
        }
        if (hoverCurrentTime) hoverCurrentTime.textContent = formatTime(current);
        if (hoverDurationTime) hoverDurationTime.textContent = formatTime(duration);
        if (hoverSeekRange && document.activeElement !== hoverSeekRange) {
          hoverSeekRange.value = Math.round(fraction * 1000);
          hoverSeekRange.setAttribute('aria-valuetext', formatTime(current) + ' of ' + formatTime(duration));
        }
        const bars = waveformBarNodes();
        bars.forEach((bar, index) => {
          bar.classList.toggle('is-played', bars.length ? index / bars.length <= fraction : false);
        });
        drawHoverWave();
        syncLyricsScroll();
      };

      // --- Hover transport visibility -------------------------------------
      // Appears when the cursor moves over the artwork; fades out 2 seconds
      // after movement stops; reappears on the next movement.
      const HOVER_HIDE_DELAY_MS = 2000;
      let hoverHideTimer = 0;

      const hideHoverTransport = () => {
        if (hoverTransport && hoverTransport.contains(document.activeElement)) return;
        if (player) player.dataset.transport = 'hidden';
      };

      // Auto-hiding controls is a MOUSE idea. It works because a mouse produces a
      // continuous pointermove stream that keeps waking them, and because the cursor
      // can rest over the artwork without touching anything.
      //
      // A finger does neither. It produces one pointerdown, then nothing, and
      // pointerleave fires the instant it lifts. So on a phone every tap was followed
      // immediately by the controls hiding again, and the next tap landed on something
      // fading out from under it. That is why playing a track took twenty taps and the
      // player looked like it was flashing.
      //
      // Gating on the '(hover: hover)' media query was not enough. That is a guess about
      // the DEVICE, and it is true on iPadOS, on Android tablets in desktop mode, and on
      // any phone with a trackpad or mouse paired — on all of which the controls went
      // back to fading out from under a finger.
      //
      // The pointerType on the ACTUAL event is ground truth: a touch says 'touch'
      // whatever the device claims it can do. Auto-hide is therefore armed only once a
      // real mouse has been seen, and a single touch disarms it again.
      let usingMouse = false;
      const notePointerType = (event) => {
        if (event && event.pointerType === 'touch') usingMouse = false;
        else if (event && event.pointerType === 'mouse') usingMouse = true;
      };

      const showHoverTransport = (event) => {
        notePointerType(event);
        if (player) player.dataset.transport = 'visible';
        if (hoverHideTimer) window.clearTimeout(hoverHideTimer);
        if (usingMouse) {
          hoverHideTimer = window.setTimeout(hideHoverTransport, HOVER_HIDE_DELAY_MS);
        }
        drawHoverWave();
      };

      if (cover) {
        cover.addEventListener('pointermove', showHoverTransport);
        cover.addEventListener('pointerdown', showHoverTransport);
        cover.addEventListener('pointerleave', (event) => {
          if (!usingMouse || (event && event.pointerType === 'touch')) return;
          if (hoverHideTimer) window.clearTimeout(hoverHideTimer);
          hideHoverTransport();
        });
      }

      // --- Cursor-idle overlay fade ----------------------------------------
      // 2 s after the cursor stops moving, ALL layered overlays (title, buttons,
      // hint, transport) fade so the artwork shows clean; movement wakes them.
      const IDLE_HIDE_DELAY_MS = 2000;
      let idleTimer = 0;
      const goIdle = () => { if (player) player.dataset.idle = 'true'; };
      const wakeOverlays = (event) => {
        notePointerType(event);
        if (player) player.dataset.idle = 'false';
        if (idleTimer) window.clearTimeout(idleTimer);
        // Same reasoning as the transport above: a finger produces no movement to wake
        // these again, so fading them only takes the controls away.
        if (usingMouse) idleTimer = window.setTimeout(goIdle, IDLE_HIDE_DELAY_MS);
      };
      if (player) {
        ['pointermove', 'pointerdown', 'keydown'].forEach((eventName) => player.addEventListener(eventName, wakeOverlays));
        {
          player.addEventListener('pointerleave', (event) => {
            if (!usingMouse || (event && event.pointerType === 'touch')) return;
            if (idleTimer) window.clearTimeout(idleTimer);
            goIdle();
          });
        }
        wakeOverlays();
      }

      // --- Lyrics auto-scroll ----------------------------------------------
      // Scrolls the lyrics in sync with playback position when the switch is on.
      const syncLyricsScroll = () => {
        if (!lyricsText || !lyricsAutoScroll || !lyricsAutoScroll.checked) return;
        const duration = getDuration();
        if (!duration) return;
        const range = lyricsText.scrollHeight - lyricsText.clientHeight;
        if (range <= 0) return;
        const fraction = Math.max(0, Math.min(1, audio.currentTime / duration));
        lyricsText.scrollTop = fraction * range;
      };

      let lyricsFrame = 0;
      const lyricsScrollLoop = () => {
        lyricsFrame = 0;
        if (!audio.paused && !audio.ended) {
          syncLyricsScroll();
          lyricsFrame = window.requestAnimationFrame(lyricsScrollLoop);
        }
      };

      const startLyricsLoop = () => {
        if (!lyricsFrame && lyricsText) {
          lyricsFrame = window.requestAnimationFrame(lyricsScrollLoop);
        }
      };

      if (lyricsAutoScroll) {
        lyricsAutoScroll.addEventListener('change', () => {
          if (lyricsAutoScroll.checked) {
            syncLyricsScroll();
            startLyricsLoop();
          }
        });
      }

      const isPlayerControlTarget = (event) =>
        Boolean(event.target.closest('button, input, a, [data-player-control]'));

      if (cover) {
        // Act on the FIRST click, immediately. This used to wait 300ms on a timer to
        // tell a single click from a double one — but a setTimeout callback carries no
        // user gesture, so the play() it eventually made was refused by mobile every
        // single time. Tapping the artwork, which is the obvious thing to do, could
        // therefore never start playback at all.
        //
        // The double-click case is handled by UNDOING instead: a second click within
        // the window rewinds to the start, which is what it did before. Acting first
        // and correcting is the only ordering that keeps the gesture.
        cover.addEventListener('click', (event) => {
          if (isPlayerControlTarget(event)) return;
          event.preventDefault();
          const isSecondClick = Boolean(coverClickTimer);
          clearCoverClickTimer();
          if (isSecondClick) { resetAudioToStart(); return; }
          coverClickTimer = window.setTimeout(clearCoverClickTimer, 300);
          toggleAudioPlayback();
        });

        // dblclick still fires after the two clicks above; the second click has already
        // reset, so this must not toggle playback again.
        cover.addEventListener('dblclick', (event) => {
          if (isPlayerControlTarget(event)) return;
          event.preventDefault();
        });

        cover.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleAudioPlayback();
          } else if (event.key === 'Escape') {
            event.preventDefault();
            resetAudioToStart();
          }
        });
      }

      // Eye opens the waveform controls tab; the dots button opens player info.
      if (infoToggle) infoToggle.addEventListener('click', () => togglePanel('controls'));
      if (controlsToggle) controlsToggle.addEventListener('click', () => togglePanel('info'));
      panelButtons.forEach((button) => {
        button.addEventListener('click', () => togglePanel(button.dataset.panelTarget || 'controls'));
      });
      if (playToggleButton) playToggleButton.addEventListener('click', toggleAudioPlayback);
      if (restartButton) restartButton.addEventListener('click', resetAudioToStart);
      if (backButton) backButton.addEventListener('click', () => seekBy(-15));
      if (forwardButton) forwardButton.addEventListener('click', () => seekBy(15));
      if (muteButton) {
        muteButton.addEventListener('click', () => {
          audio.muted = !audio.muted;
          updatePlaybackUi();
        });
      }
      if (seekRange) {
        seekRange.addEventListener('input', () => {
          const duration = getDuration();
          if (!duration) return;
          audio.currentTime = duration * (Number(seekRange.value) / 1000);
          updateProgress();
        });
      }
      if (hoverSeekRange) {
        hoverSeekRange.addEventListener('input', () => {
          const duration = getDuration();
          if (!duration) return;
          audio.currentTime = duration * (Number(hoverSeekRange.value) / 1000);
          updateProgress();
          showHoverTransport();
        });
      }

      const support = audio.canPlayType(manifest.audioMimeType || '');
      if (!support) {
        setStatus('This browser may not support this audio type. Try a newer Safari, Chrome, Firefox, or an MP3 fallback.', true);
      }

      // How many contiguous seconds from 0:00 are currently buffered.
      const bufferedFromStart = () => {
        try {
          for (let i = 0; i < audio.buffered.length; i += 1) {
            if (audio.buffered.start(i) <= 0.05) return audio.buffered.end(i);
          }
        } catch (_error) {}
        return 0;
      };

      const markAudioReady = () => {
        if (isAudioReady) return;
        isAudioReady = true;
        // Ensure the first play begins exactly at the start (no clipped intro).
        try { if (audio.currentTime > 0 && audio.paused) audio.currentTime = 0; } catch (_error) {}
        updatePlaybackUi();
        // Deliberately does NOT start playback. Reaching this point from a buffering
        // event means there is no user gesture in scope, and mobile refuses a play()
        // made there — the request is already in flight from the tap itself.
        if (audio.paused) setStatus('Ready to play.');
      };

      // Consider playback safe once the whole track (short clips/loops) or at
      // least BUFFER_TARGET_SECONDS from the start is buffered.
      const evaluateReadiness = () => {
        if (isAudioReady) return;
        const duration = getDuration();
        const buffered = bufferedFromStart();
        const target = duration ? Math.min(BUFFER_TARGET_SECONDS, duration - 0.1) : BUFFER_TARGET_SECONDS;
        if (buffered >= target && buffered > 0) {
          markAudioReady();
        } else {
          const pct = duration ? Math.min(99, Math.round((buffered / duration) * 100)) : null;
          setStatus(pct !== null ? 'Buffering audio… ' + pct + '%' : 'Buffering audio…');
        }
      };

      audio.addEventListener('loadedmetadata', () => {
        const duration = Number.isFinite(audio.duration)
          ? Math.round(audio.duration)
          : null;
        if (!isAudioReady) {
          setStatus(duration ? 'Buffering audio… (' + duration + 's track)' : 'Buffering audio…');
        }
        updateProgress();
        evaluateReadiness();
      });

      audio.addEventListener('progress', evaluateReadiness);
      audio.addEventListener('canplay', evaluateReadiness);
      // Whole file decoded end-to-end — definitely safe to play.
      audio.addEventListener('canplaythrough', markAudioReady);
      // Kick off buffering immediately (preload="auto" already requests this).
      try { audio.load(); } catch (_error) {}
      updatePlaybackUi();

      audio.addEventListener('timeupdate', updateProgress);
      audio.addEventListener('durationchange', updateProgress);
      audio.addEventListener('play', startLyricsLoop);
      audio.addEventListener('play', updatePlaybackUi);
      audio.addEventListener('pause', updatePlaybackUi);
      audio.addEventListener('ended', () => {
        setStatus('Finished. Click artwork to play from the beginning.');
        updatePlaybackUi();
        updateProgress();
      });

      audio.addEventListener('error', () => {
        const code = audio.error ? audio.error.code : 'unknown';
        setStatus('Playback failed in this browser. Media error code: ' + code + '.', true);
      });

      if ('mediaSession' in navigator) {
        try {
          const metadata = manifest.metadata || {};
          navigator.mediaSession.metadata = new MediaMetadata({
            title: metadata.title || document.title,
            artist: metadata.artist || '',
            album: metadata.album || ''
          });
          navigator.mediaSession.setActionHandler('play', toggleAudioPlayback);
          navigator.mediaSession.setActionHandler('pause', toggleAudioPlayback);
          navigator.mediaSession.setActionHandler('stop', resetAudioToStart);
          navigator.mediaSession.setActionHandler('seekbackward', () => seekBy(-15));
          navigator.mediaSession.setActionHandler('seekforward', () => seekBy(15));
        } catch (_error) {}
      }

      wavePeaks = placeholderPeaks();
      // Start VISIBLE. Hidden-at-init meant the transport — waveform, seek bar and the
      // play button itself — was opacity:0 AND pointer-events:none until some pointer
      // event revealed it. On a phone that left the artwork as the only thing you could
      // tap, with no visible control to aim at. A mouse hides it again 2s after it
      // starts moving; a finger never does.
      if (player) player.dataset.transport = 'visible';
      renderWaveform();
      setPanel('closed');
      updatePlaybackUi();
      updateProgress();
      loadRealWaveform();
      // iOS fires resize continuously while scrolling, as the URL bar hides and shows.
      // Redrawing the canvas on every one of those made the controls flash and swallowed
      // taps. Coalesce to one redraw per frame.
      let hoverWaveFrame = 0;
      window.addEventListener('resize', () => {
        if (hoverWaveFrame) return;
        hoverWaveFrame = requestAnimationFrame(() => { hoverWaveFrame = 0; drawHoverWave(); });
      });
    })();
  <\/script>
</body>
</html>`;
};

function HTML_Template(
  titleOrConfig,
  instrument,
  note,
  frequency,
  isLoop,
  bpm,
  audionalBase64Data,
  audionalVisualBase64Data,
  audionalMimeType = 'audio/webm; codecs=opus',
  options = {}
) {
  if (
    titleOrConfig &&
    typeof titleOrConfig === 'object' &&
    !Array.isArray(titleOrConfig)
  ) {
    return buildXtrataAudioPlayerHtml(titleOrConfig);
  }

  return buildXtrataAudioPlayerHtml({
    mode: options.mode || 'embedded',
    metadata: {
      title: titleOrConfig,
      instrument,
      note,
      frequency,
      isLoop,
      bpm
    },
    audioBase64: audionalBase64Data,
    imageBase64: audionalVisualBase64Data,
    audioMimeType: audionalMimeType,
    imageMimeType: options.imageMimeType,
    recursive: options.recursive
  });
}

window.HTML_Template = HTML_Template;
window.buildXtrataAudioPlayerHtml = buildXtrataAudioPlayerHtml;
})();
