// Builder controls, gallery view, rarity display, find-a-piece lookup, and
// collection export UI. v11 adds a non-blocking startup index, reduced-motion
// control, deep-linkable seeds, an IntersectionObserver-gated gallery, and a
// lazily-loaded export bundle so the heavy inscription module set is only
// fetched when the user actually exports.
import * as mod from './cicada-core.js?v=11.3.8-molt.1';
import { initTraitLab } from './trait-lab-ui.js?v=11.3.5-nymph.2';
import { buildInstructionOverrides } from './trait-registry.js?v=11.3.5-nymph.2';
import { createZip, tinyHtml } from './zip-utils.js?v=11.3.5-nymph.2';
import { initSoundIdentityPanel } from './sound-identity-ui.js?v=11.3.5-nymph.2';
import { createGalleryListenerNetwork } from './gallery-listener.js?v=11.3.5-nymph.2';
import { createGalleryFlightNetwork } from './gallery-flight-network.js?v=11.3.5-nymph.2';

const $ = id => document.getElementById(id);

const [
    stage, seedInput, traitsList, rarityBox, exportButton, randomButton, prevButton,
    nextButton, jumpButton, galleryButton, statusEl, progressWrap, progressFill,
    downloadSlot, galleryOverlay, closeGalleryButton, galleryGrid, traitLabPanel,
    galleryGroupButtons, galleryValueButtons, motionToggle, exportEstimate,
    rankInput, rankGoButton, findTier, findTrait, findValue, findResults,
    touchFly, touchCall, inlineBarkToggle, nymphToggle
] = [
    'stage', 'seed-input', 'traits-list', 'rarity-box', 'export-button', 'random-button',
    'prev-button', 'next-button', 'jump-button', 'gallery-button', 'status',
    'progress-wrap', 'progress-fill', 'download-slot', 'gallery-overlay',
    'close-gallery-button', 'gallery-grid', 'trait-lab-panel',
    'gallery-group-buttons', 'gallery-value-buttons', 'motion-toggle', 'export-estimate',
    'rank-input', 'rank-go-button', 'find-tier', 'find-trait', 'find-value', 'find-results',
    'touch-fly', 'touch-call', 'inline-bark-toggle', 'nymph-toggle'
].map($);

// ---- v11: motion preference (Auto follows OS, Reduced/Full force it) --------
const MOTION_KEY = 'cicada:motion';
const INLINE_BARK_KEY = 'cicada:inlineBark';
const NYMPH_MODE_KEY = 'cicada:nymphMode';
if (inlineBarkToggle) {
    inlineBarkToggle.checked = localStorage.getItem(INLINE_BARK_KEY) !== 'false';
    inlineBarkToggle.addEventListener('change', () => {
        try { localStorage.setItem(INLINE_BARK_KEY, String(inlineBarkToggle.checked)); } catch (_) {}
    });
}
function applyMotion(mode) {
    const html = document.documentElement;
    html.classList.remove('cicada-reduced-motion', 'cicada-motion-full');
    if (mode === 'reduced') html.classList.add('cicada-reduced-motion');
    else if (mode === 'full') html.classList.add('cicada-motion-full');
    const label = mode === 'auto' ? 'Auto' : mode === 'reduced' ? 'Reduced' : 'Full';
    motionToggle.textContent = `Motion: ${label}`;
    motionToggle.setAttribute('aria-label', `Motion preference: ${label}. Click to change.`);
}
let motionMode = localStorage.getItem(MOTION_KEY) || 'auto';
applyMotion(motionMode);
motionToggle.addEventListener('click', () => {
    motionMode = motionMode === 'auto' ? 'reduced' : motionMode === 'reduced' ? 'full' : 'auto';
    try { localStorage.setItem(MOTION_KEY, motionMode); } catch (_) {}
    applyMotion(motionMode);
});

let collectionMetadata = null;
let galleryRenders = [];
let activeGalleryFlightRender = null;
let currentRender = null;
let activeLabState = {};
let currentSeedNumber = mod.normalizeSeed(seedInput.value || 1);
let suppressHashUpdate = false;
let galleryListener = null;
let galleryFlight = null;
let nymphMode = localStorage.getItem(NYMPH_MODE_KEY) === 'true';
function applyNymphMode(active) {
    document.documentElement.classList.toggle('cicada-nymph-mode', active);
    if (nymphToggle) {
        nymphToggle.textContent = `Nymph: ${active ? 'On' : 'Off'}`;
        nymphToggle.setAttribute('aria-label', `Nymph mode: ${active ? 'On' : 'Off'}`);
        nymphToggle.setAttribute('aria-pressed', String(active));
    }
    if (touchFly) touchFly.textContent = active ? 'Alert / Settle' : 'Fly / Land';
}
applyNymphMode(nymphMode);
nymphToggle?.addEventListener('click', () => {
    nymphMode = !nymphMode;
    try { localStorage.setItem(NYMPH_MODE_KEY, String(nymphMode)); } catch (_) {}
    applyNymphMode(nymphMode);
    if (collectionMetadata) {
        showSeed(seedInput.value || currentSeedNumber);
    } else {
        statusEl.textContent = `${nymphMode ? 'Nymph' : 'Adult'} mode selected. It will apply when indexing finishes.`;
    }
});

// ---- v11: non-blocking collection index with live progress ------------------
statusEl.textContent = 'Indexing the 3,301-seed collection…';
progressWrap.style.display = 'block';
collectionMetadata = await mod.buildCollectionMetadataAsync(progress => {
    if (!progress || !progress.total) return;
    const pct = Math.round((progress.done / progress.total) * 100);
    progressFill.style.width = `${pct}%`;
    statusEl.textContent = `Indexing collection… ${progress.done.toLocaleString()} / ${progress.total.toLocaleString()} (${pct}%)`;
});
progressWrap.style.display = 'none';
progressFill.style.width = '0%';

const soundPanelHost = document.getElementById('sound-identity-panel');
const soundPanel = soundPanelHost ? initSoundIdentityPanel({
    container: soundPanelHost,
    getCurrentRender: () => currentRender,
    getMetadataForSeed: seed => collectionMetadata.bySeed[seed]
}) : null;
galleryListener = createGalleryListenerNetwork({
    getRenders: () => galleryRenders,
    getMetadataForSeed: seed => collectionMetadata.bySeed[seed],
    setStatus: message => { statusEl.textContent = message; }
});
galleryFlight = createGalleryFlightNetwork({
    getRenders: () => galleryRenders,
    getMetadataForSeed: seed => collectionMetadata.bySeed[seed],
    setStatus: message => { statusEl.textContent = message; }
});

const GALLERY_FILTERS = Object.freeze({
    sequential: [{ value: 'current-sequence', label: 'Current seed onwards' }],
    rarity: ['Mythic', 'Legendary', 'Epic', 'Rare', 'Uncommon', 'Common'].map(value => ({ value, label: value })),
    primeEngine: [
        { value: 'any-prime-engine', label: 'Any prime engine' },
        { value: 'prime-pulse', label: 'Prime Pulse' },
        { value: 'prime-grid', label: 'Prime Grid' },
        { value: 'prime-bloom', label: 'Prime Bloom' },
        { value: 'prime-swarm', label: 'Prime Swarm' },
        { value: 'prime-interference', label: 'Prime Interference' },
        { value: 'ulam-spiral', label: 'Ulam Spiral' },
        { value: 'twin-prime-orbit', label: 'Twin Prime Orbit' },
        { value: 'prime-gap-sweep', label: 'Prime Gap Sweep' },
        { value: 'residue-bloom', label: 'Residue Bloom' },
        { value: '3301-beacon', label: '3301 Beacon' }
    ],
    primeSet: [
        { value: 'any-prime-set', label: 'Any prime set' },
        { value: '11', label: '11' },
        { value: '13', label: '13' },
        { value: '17', label: '17' },
        { value: '11-13', label: '11 / 13' },
        { value: '13-17', label: '13 / 17' },
        { value: '11-13-17', label: '11 / 13 / 17' }
    ],
    ambientField: [
        { value: 'any-ambient', label: 'Any ambient cipher' },
        { value: 'sieve-snow', label: 'Sieve Snow' },
        { value: 'prime-ash', label: 'Prime Ash' },
        { value: 'ember-drift', label: 'Ember Drift' }
    ],
    barkFamily: [
        { value: 'any-bark', label: 'Any bark family' },
        { value: 'deciduous-hardwood', label: 'Deciduous Hardwood' },
        { value: 'evergreen', label: 'Evergreen' },
        { value: 'australian-native', label: 'Australian Native' },
        { value: 'orchard-fruit', label: 'Orchard / Fruit' },
        { value: 'softwood-weeping', label: 'Softwood / Weeping' },
        { value: 'legume', label: 'Legume' },
        { value: 'none', label: 'Studio Dark' }
    ],
    special: [
        { value: 'has-glitch', label: 'Glitch seeds' },
        { value: 'has-aura', label: 'Aura seeds' },
        { value: 'split-materials', label: 'Split materials' },
        { value: 'cipher-marked', label: 'Cipher-marked' },
        { value: 'bone-gold', label: 'Bone / gold palette' }
    ]
});
const GALLERY_GROUPS = [
    { value: 'sequential', label: 'Sequential' },
    { value: 'rarity', label: 'Rarity' },
    { value: 'barkFamily', label: 'Bark Family' },
    { value: 'primeEngine', label: 'Prime Engine' },
    { value: 'primeSet', label: 'Prime Set' },
    { value: 'ambientField', label: 'Ambient Cipher' },
    { value: 'special', label: 'Special' }
];

function padSeed(seed) { return String(seed).padStart(5, '0'); }
function formatValue(val) {
    if (Array.isArray(val)) return val.length ? val.join(', ') : 'None';
    if (typeof val === 'boolean') return val ? 'Yes' : 'No';
    return String(val);
}
function officialInstructionsFor(seed) { return mod.getRenderInstructionsForSeed(mod.normalizeSeed(seed)); }
function activeInstructionOverrides(seed) { return buildInstructionOverrides(activeLabState, officialInstructionsFor(seed)); }
function hasActiveLabState() { return Object.entries(activeLabState || {}).some(([, value]) => value && value !== 'official'); }
function currentOverrideJSON(state = activeLabState) {
    const seed = mod.normalizeSeed(seedInput.value || currentSeedNumber);
    const instructionOverrides = buildInstructionOverrides(state, officialInstructionsFor(seed));
    return JSON.stringify({ seed, instructionOverrides }, null, 2);
}

function renderRarity(metadata) {
    const rarestTrait = metadata.rarestTrait ? `${metadata.rarestTrait.category}: ${metadata.rarestTrait.value} (${metadata.rarestTrait.percentage}%)` : 'None';
    const rarestCombo = metadata.rarestCombo ? `${metadata.rarestCombo.name} (${metadata.rarestCombo.percentage}%)` : 'None';
    rarityBox.innerHTML = `
        <div class="rarity-title">Rarity Position</div>
        <div class="rarity-line"><span>Rank</span><strong>#${metadata.rank.toLocaleString()} / ${mod.COLLECTION_SIZE.toLocaleString()}</strong></div>
        <div class="rarity-line"><span>Tier</span><strong>${metadata.rarityTier}</strong></div>
        <div class="rarity-line"><span>Score</span><strong>${metadata.rarityScore}</strong></div>
        <div class="rarity-line"><span>Rarest Trait</span><strong>${rarestTrait}</strong></div>
        <div class="rarity-line"><span>Rarest Combo</span><strong>${rarestCombo}</strong></div>
    `;
}

function renderTraits(instructions, metadata) {
    const overrides = { Wireframe: instructions.wireframe, 'Lightning FX': instructions.lightningType !== 'none' ? `${instructions.lightningColor} ${instructions.lightningType}` : 'no' };
    const traitRows = [
        ['Seed', instructions.seed, null],
        ...metadata.traitBreakdown.map(stat => [stat.category, Object.hasOwn(overrides, stat.category) ? overrides[stat.category] : metadata.traits[stat.category], stat]),
        ['Size', `${instructions.size}vmin`, null],
        ['Rotation', `${instructions.rotation}°`, null],
        ['Offset', `${instructions.xOffset}, ${instructions.yOffset}`, null],
        ['Hue Shift', `${instructions.hueShift}°`, null],
        ['Prime Engine', instructions.motionField || 'none', null],
        ['Prime Set', instructions.primeSet || 'none', null],
        ['Ambient Cipher', instructions.ambientField || 'none', null]
    ];
    const labOverrides = activeInstructionOverrides(instructions.seed);
    if (Object.keys(labOverrides).length) {
        traitRows.push(['Trait Lab', 'active overrides', null]);
        for (const [key, value] of Object.entries(labOverrides)) traitRows.push([`Lab: ${key}`, value, null]);
    }
    traitsList.innerHTML = traitRows.map(([key, value, stat]) => {
        const extra = stat ? `<small>${stat.count.toLocaleString()} / ${mod.COLLECTION_SIZE.toLocaleString()} · ${stat.percentage}% · +${stat.points}</small>` : '';
        return `<li><span class="trait-key">${key}</span><span class="trait-value">${formatValue(value)}${extra}</span></li>`;
    }).join('');
}

function showSeed(seed, { updateHash = true } = {}) {
    const seedNumber = mod.normalizeSeed(seed);
    currentSeedNumber = seedNumber;
    seedInput.value = seedNumber;
    if (currentRender) currentRender.destroy();
    stage.replaceChildren();
    if (nymphMode) {
        currentRender = mod.renderNymphScene({
            seed: seedNumber,
            mount: stage,
            clearMount: true,
            pageStyles: false,
            count: 5
        });
        rarityBox.innerHTML = '';
        traitsList.innerHTML = '';
        statusEl.textContent = `Nymph Mode: subterranean colony from seed ${seedNumber}. Nymphs travel the tunnels on independent routes and emerge into adults at the surface. Adult traits, rarity visuals, audio, and trait renderers are bypassed.`;
        try { localStorage.setItem('cicada:lastSeed', String(seedNumber)); } catch (_) {}
        if (updateHash) {
            suppressHashUpdate = true;
            location.hash = `seed=${seedNumber}`;
            suppressHashUpdate = false;
        }
        return;
    }
    const instructionOverrides = activeInstructionOverrides(seedNumber);
    currentRender = mod.init(seedNumber, { mount: stage, clearMount: true, pageStyles: false, interactive: true, enableAudio: true, instructionOverrides });
    const metadata = collectionMetadata.bySeed[seedNumber];
    renderRarity(metadata);
    renderTraits(currentRender.instructions, metadata);
    const labNote = hasActiveLabState() ? ' Trait Lab overrides are active and do not affect rarity.' : '';
    statusEl.textContent = `Previewing seed ${seedNumber} of ${mod.COLLECTION_SIZE}. Rank #${metadata.rank.toLocaleString()} (${metadata.rarityTier}).${labNote}`;
    soundPanel?.update(seedNumber);
    try { localStorage.setItem('cicada:lastSeed', String(seedNumber)); } catch (_) {}
    if (updateHash) {
        suppressHashUpdate = true;
        location.hash = `seed=${seedNumber}`;
        suppressHashUpdate = false;
    }
}

jumpButton.addEventListener('click', () => showSeed(seedInput.value));
seedInput.addEventListener('keydown', event => { if (event.key === 'Enter') showSeed(seedInput.value); });
prevButton.addEventListener('click', () => showSeed(Number(seedInput.value) - 1));
nextButton.addEventListener('click', () => showSeed(Number(seedInput.value) + 1));
randomButton.addEventListener('click', () => showSeed(1 + Math.floor(Math.random() * mod.COLLECTION_SIZE)));

// v11: keyboard- and touch-friendly interaction controls (the artwork itself is
// also focusable and responds to F / C / Enter via the renderer container).
touchFly?.addEventListener('click', () => currentRender?.toggleFlight?.());
touchCall?.addEventListener('click', () => {
    if (nymphMode) return;
    const handle = currentRender?.playSignature?.();
    if (handle?.identity) soundPanel?.update?.(currentSeedNumber);
});

// v11: deep-linkable seeds via the URL hash (#seed=N).
function seedFromHash() {
    const match = /seed=(\d+)/.exec(location.hash || '');
    return match ? Number(match[1]) : null;
}
window.addEventListener('hashchange', () => {
    if (suppressHashUpdate) return;
    const hashSeed = seedFromHash();
    if (hashSeed) showSeed(hashSeed, { updateHash: false });
});

// ---- v11: Find-a-piece lookup (rank jump + tier/trait/value filter) ---------
function populateFindControls() {
    const tiers = ['Any', 'Mythic', 'Legendary', 'Epic', 'Rare', 'Uncommon', 'Common'];
    findTier.innerHTML = tiers.map(t => `<option value="${t}">${t}</option>`).join('');
    const categories = Object.keys(collectionMetadata.traitsSummary).sort();
    findTrait.innerHTML = ['Any', ...categories].map(c => `<option value="${c}">${c}</option>`).join('');
    populateFindValues();
}
function populateFindValues() {
    const cat = findTrait.value;
    if (!cat || cat === 'Any') {
        findValue.innerHTML = `<option value="Any">Any</option>`;
        findValue.disabled = true;
        return;
    }
    findValue.disabled = false;
    const values = (collectionMetadata.traitsSummary[cat] || []).map(v => v.value);
    findValue.innerHTML = ['Any', ...values].map(v => `<option value="${v}">${v} </option>`).join('');
}
function runFind() {
    const tier = findTier.value;
    const cat = findTrait.value;
    const val = findValue.value;
    let pool = collectionMetadata.items;
    if (tier && tier !== 'Any') pool = pool.filter(item => item.rarityTier === tier);
    if (cat && cat !== 'Any' && val && val !== 'Any') pool = pool.filter(item => String(item.traits[cat]) === String(val));
    const ordered = pool.slice().sort((a, b) => a.rank - b.rank).slice(0, 80);
    if (!ordered.length) {
        findResults.innerHTML = `<div class="find-empty">No pieces match that filter.</div>`;
        return;
    }
    findResults.innerHTML = ordered.map(item =>
        `<button type="button" class="find-result" data-seed="${item.seed}"><span>Seed ${item.seed} · ${item.rarityTier}</span><span class="fr-rank">#${item.rank.toLocaleString()}</span></button>`
    ).join('');
    if (pool.length > ordered.length) {
        findResults.insertAdjacentHTML('beforeend', `<div class="find-empty">Showing first ${ordered.length} of ${pool.length.toLocaleString()} matches.</div>`);
    }
}
findTrait.addEventListener('change', () => { populateFindValues(); runFind(); });
findTier.addEventListener('change', runFind);
findValue.addEventListener('change', runFind);
findResults.addEventListener('click', event => {
    const button = event.target.closest('[data-seed]');
    if (!button) return;
    showSeed(Number(button.dataset.seed));
});
function gotoRank() {
    const rank = Number(rankInput.value);
    if (!Number.isFinite(rank) || rank < 1 || rank > mod.COLLECTION_SIZE) {
        statusEl.textContent = `Enter a rank between 1 and ${mod.COLLECTION_SIZE.toLocaleString()}.`;
        return;
    }
    const item = collectionMetadata.items.find(it => it.rank === rank);
    if (item) showSeed(item.seed);
}
rankGoButton.addEventListener('click', gotoRank);
rankInput.addEventListener('keydown', event => { if (event.key === 'Enter') gotoRank(); });

// ---- Gallery ----------------------------------------------------------------
let galleryObserver = null;
function ensureGalleryObserver() {
    if (galleryObserver || typeof IntersectionObserver !== 'function') return;
    galleryObserver = new IntersectionObserver(entries => {
        for (const entry of entries) entry.target.classList.toggle('offscreen', !entry.isIntersecting);
    }, { root: galleryGrid, rootMargin: '120px' });
}
function closeGallery() { galleryOverlay.style.display = 'none'; activeGalleryFlightRender = null; galleryListener.clear(); galleryFlight.clear(); clearGallery(); }
function clearGallery() {
    galleryListener.clear();
    galleryFlight.clear();
    if (galleryObserver) galleryObserver.disconnect();
    galleryRenders.forEach(r => r.destroy());
    galleryRenders = [];
    galleryGrid.replaceChildren();
}
closeGalleryButton.addEventListener('click', closeGallery);

let currentGalleryMode = 'sequential';
let currentGalleryFilter = 'current-sequence';
function renderFilterButtons(container, items, activeValue, className='') {
    container.innerHTML = items.map(item => `<button type="button" class="filter-btn ${className} ${item.value === activeValue ? 'active' : ''}" aria-pressed="${item.value === activeValue}" data-filter-value="${item.value}">${item.label}</button>`).join('');
}
function updateGalleryFilterButtons() {
    renderFilterButtons(galleryGroupButtons, GALLERY_GROUPS, currentGalleryMode);
    renderFilterButtons(galleryValueButtons, GALLERY_FILTERS[currentGalleryMode] || GALLERY_FILTERS.sequential, currentGalleryFilter, 'subtle');
}
function setGalleryMode(mode) {
    currentGalleryMode = mode;
    const options = GALLERY_FILTERS[mode] || GALLERY_FILTERS.sequential;
    currentGalleryFilter = options[0]?.value || 'current-sequence';
    updateGalleryFilterButtons();
}
function shuffleArray(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
function landGalleryRender(render) { if (render?.cicada?.instructions.flying) { render.cicada.setFlying(false); if (render.synth) render.synth.setFlyingAndMute(false); } }
function handleGalleryFlightChange(render) {
    if (!render?.cicada) return;
    const isNowFlying = Boolean(render.cicada.instructions.flying);
    if (isNowFlying) activeGalleryFlightRender = render;
    else if (activeGalleryFlightRender === render) activeGalleryFlightRender = null;
    // v11.3.4: the flight network now handles both launch and landing.
    // Followers stay airborne for the same window as the source and are
    // released here when the source lands.
    galleryFlight.handleSourceFlight(render);
}
function galleryPredicate() {
    if (currentGalleryMode === 'rarity') return item => item.rarityTier === currentGalleryFilter;
    if (currentGalleryMode === 'primeEngine') return currentGalleryFilter === 'any-prime-engine' ? item => item.instructions.motionField && item.instructions.motionField !== 'none' : item => item.instructions.motionField === currentGalleryFilter;
    if (currentGalleryMode === 'primeSet') return currentGalleryFilter === 'any-prime-set' ? item => item.instructions.primeSet && item.instructions.primeSet !== 'none' : item => item.instructions.primeSet === currentGalleryFilter;
    if (currentGalleryMode === 'ambientField') return currentGalleryFilter === 'any-ambient' ? item => item.instructions.ambientField && item.instructions.ambientField !== 'none' : item => item.instructions.ambientField === currentGalleryFilter;
    if (currentGalleryMode === 'barkFamily') return currentGalleryFilter === 'any-bark' ? item => item.barkFamily && item.barkFamily !== 'none' : item => item.barkFamily === currentGalleryFilter;
    if (currentGalleryMode === 'special') {
        if (currentGalleryFilter === 'has-glitch') return item => (item.instructions.effects || []).includes('glitch');
        if (currentGalleryFilter === 'has-aura') return item => item.instructions.aura !== 'none';
        if (currentGalleryFilter === 'split-materials') return item => (item.instructions.thoraxSkin || item.instructions.skin || 'none') !== (item.instructions.abdomenSkin || item.instructions.skin || 'none');
        if (currentGalleryFilter === 'cipher-marked') return item => item.instructions.markingLayer && item.instructions.markingLayer !== 'none';
        if (currentGalleryFilter === 'bone-gold') return item => item.instructions.paletteMode === 'bone-gold';
    }
    return null;
}
function renderGallery() {
    activeGalleryFlightRender = null;
    clearGallery();
    ensureGalleryObserver();
    let seedsToRender = [];
    if (currentGalleryMode === 'sequential') {
        const baseSeed = mod.normalizeSeed(seedInput.value);
        seedsToRender = Array.from({ length: 24 }, (_, index) => (baseSeed + index - 1) % mod.COLLECTION_SIZE + 1);
    } else {
        const predicate = galleryPredicate();
        const pool = predicate ? collectionMetadata.items.filter(predicate) : collectionMetadata.items;
        seedsToRender = shuffleArray(pool).slice(0, 24).map(item => item.seed);
    }
    seedsToRender.forEach(currentSeed => {
        const cell = document.createElement('div');
        cell.className = 'gallery-cell';
        const meta = collectionMetadata.bySeed[currentSeed];
        const label = document.createElement('button');
        label.className = 'gallery-cell-label';
        label.textContent = `Select Seed ${currentSeed}`;
        label.addEventListener('click', e => { e.stopPropagation(); closeGallery(); showSeed(currentSeed); });
        const tier = document.createElement('div');
        tier.className = 'gallery-cell-tier';
        tier.textContent = nymphMode ? 'NYMPH' : meta ? meta.rarityTier : '';
        const mountPoint = document.createElement('div');
        mountPoint.style.position = 'absolute';
        mountPoint.style.inset = '0';
        cell.appendChild(mountPoint); cell.appendChild(label); cell.appendChild(tier); galleryGrid.appendChild(cell);
        const render = nymphMode
            ? mod.renderCicadaNymph({ seed: currentSeed, mount: mountPoint, clearMount: true, pageStyles: false, interactive: true, accessibleLabel: false, instructionOverrides: { unit: '%', size: 90, xOffset: 0, yOffset: 0, rotation: 0, idleWander: true } })
            : mod.init(currentSeed, { mount: mountPoint, clearMount: true, pageStyles: false, interactive: true, enableAudio: true, accessibleLabel: false, instructionOverrides: { unit: '%', size: 90, xOffset: 0, yOffset: 0, rotation: 0 } });
        render.galleryCell = cell;
        render.galleryMeta = meta;
        if (!nymphMode) {
            render.cicada.host.addEventListener('cicadaclick', () => handleGalleryFlightChange(render));
            render.cicada.host.addEventListener('cicadacall', () => galleryListener.handleSourceCall(render));
        }
        galleryRenders.push(render);
        galleryObserver?.observe(cell);
    });
}

galleryGroupButtons.addEventListener('click', event => {
    const button = event.target.closest('[data-filter-value]');
    if (!button) return;
    setGalleryMode(button.dataset.filterValue);
    if (galleryOverlay.style.display === 'flex') renderGallery();
});
galleryValueButtons.addEventListener('click', event => {
    const button = event.target.closest('[data-filter-value]');
    if (!button) return;
    currentGalleryFilter = button.dataset.filterValue;
    updateGalleryFilterButtons();
    if (galleryOverlay.style.display === 'flex') renderGallery();
});
galleryButton.addEventListener('click', () => { closeGallery(); galleryOverlay.style.display = 'flex'; renderGallery(); });
setGalleryMode('sequential');

// ---- Export (lazy bundle load + size estimate) ------------------------------
let downloadUrl = null;
exportButton.addEventListener('click', async () => {
    exportButton.disabled = true;
    downloadSlot.innerHTML = '';
    progressWrap.style.display = 'block';
    progressFill.style.width = '0%';
    statusEl.textContent = 'Loading export module set…';
    let EXPORT_MODULE_SOURCES;
    try {
        ({ EXPORT_MODULE_SOURCES } = await import('./export-bundle-source.js?v=11.3.5-nymph.2'));
    } catch (error) {
        console.error(error);
        statusEl.textContent = 'Export bundle not built. Run `node tools/scaffold-from-v10.mjs` (or `node tools/build-export-bundle.mjs`) to generate src/export-bundle-source.js, then retry.';
        exportButton.disabled = false;
        progressWrap.style.display = 'none';
        return;
    }
    statusEl.textContent = 'Preparing collection entries…';
    const entries = [
        ...Object.entries(EXPORT_MODULE_SOURCES),
        ['metadata.json', JSON.stringify(collectionMetadata.seedItems, null, 2)],
        ['metadata.csv', mod.getMetadataCSV()],
        ['rarity-rankings.json', JSON.stringify(collectionMetadata.rankings, null, 2)],
        ['traits-summary.json', JSON.stringify({ traits: collectionMetadata.traitsSummary, combos: collectionMetadata.comboSummary }, null, 2)]
    ];
    for (let seed = 1; seed <= mod.COLLECTION_SIZE; seed++) entries.push([`${padSeed(seed)}.html`, tinyHtml(seed)]);
    // v11.2: bundle the 16 photographic bark backdrops so the exported collection
    // renders correctly (each tiny seed HTML references assets/bark/<slug>.jpg).
    // v11.3: optionally inline them as a shared base64 asset map for fully
    // self-contained on-chain inscriptions.
    statusEl.textContent = 'Adding bark backdrop images…';
    const BARK_SLUGS = ['oak', 'maple', 'hickory', 'apple', 'willow', 'elm', 'ash', 'birch', 'dogwood', 'linden', 'pear-cherry', 'poplar', 'eucalyptus', 'angophora', 'casuarina', 'acacia'];
    const inlineBark = inlineBarkToggle?.checked ?? true;
    if (inlineBark) {
        const barkAssetMap = {};
        for (const slug of BARK_SLUGS) {
            try {
                const res = await fetch(`assets/bark/${slug}.jpg`);
                if (!res.ok) continue;
                const bytes = new Uint8Array(await res.arrayBuffer());
                let binary = '';
                for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
                barkAssetMap[slug] = `data:image/jpeg;base64,${btoa(binary)}`;
            } catch (_) { /* image missing; skip */ }
        }
        if (Object.keys(barkAssetMap).length) {
            const mapModule = `export const BARK_ASSET_MAP=${JSON.stringify(barkAssetMap)};`;
            entries.push(['bark-assets.js', mapModule]);
        }
    } else {
        for (const slug of BARK_SLUGS) {
            try {
                const res = await fetch(`assets/bark/${slug}.jpg`);
                if (res.ok) entries.push([`assets/bark/${slug}.jpg`, new Uint8Array(await res.arrayBuffer())]);
            } catch (_) { /* image missing; skip */ }
        }
    }
    const approxBytes = entries.reduce((sum, [, content]) => sum + (typeof content === 'string' ? content.length : (content?.length || 0)), 0);
    exportEstimate.textContent = `~${(approxBytes / 1048576).toFixed(1)} MB uncompressed across ${entries.length.toLocaleString()} files.`;
    try {
        const zipBlob = await createZip(entries, (done, total) => {
            const pct = Math.round((done / total) * 100);
            progressFill.style.width = `${pct}%`;
            statusEl.textContent = `Packing ${done.toLocaleString()} / ${total.toLocaleString()} files (${pct}%).`;
        });
        if (downloadUrl) URL.revokeObjectURL(downloadUrl);
        downloadUrl = URL.createObjectURL(zipBlob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = 'cicada-3301-master-engine-v11.3.4-export.zip';
        a.className = 'download-link';
        a.textContent = 'Download ZIP';
        downloadSlot.appendChild(a);
        statusEl.textContent = `Ready: one shared module, rarity metadata, and ${mod.COLLECTION_SIZE.toLocaleString()} tiny seed HTML files.`;
    } catch (error) {
        console.error(error);
        statusEl.textContent = `Export failed: ${error.message}`;
    } finally {
        exportButton.disabled = false;
    }
});

initTraitLab({ mount: traitLabPanel, onChange(nextState) { activeLabState = nextState; showSeed(seedInput.value || currentSeedNumber); }, getOverrideJSON: currentOverrideJSON });
populateFindControls();
runFind();

// v11: restore from the URL hash, then the last-viewed seed, else seed 1.
const initialSeed = seedFromHash() || Number(localStorage.getItem('cicada:lastSeed')) || 1;
showSeed(initialSeed);
