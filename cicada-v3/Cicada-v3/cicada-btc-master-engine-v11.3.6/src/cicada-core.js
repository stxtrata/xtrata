// Public browser API for rendering seeded cicadas.
import { CicadaGenerator } from './cicada-renderer.js?v=11.3.5-nymph.2';
import { CicadaNymphGenerator } from './cicada-nymph-renderer.js?v=11.3.8-molt.1';
import { NymphScene } from './nymph-scene.js?v=11.3.8-molt.1';
import { CicadaSynth } from './cicada-audio.js?v=11.3.5-nymph.2';
import { playSignatureCall, getSoundIdentity } from './motion-bridge.js?v=11.3.5-nymph.2';
import { createGroupChorus, groupGenesForSeed } from './group-chorus.js?v=11.3.5-nymph.2';
import {
    soundGenomeForSeed,
    soundIdentitySummaryForSeed,
    renderSignatureCall,
    analyseMotion,
    decodeAudioFingerprint,
    bitsForSeed,
    seedFromBits,
    TIER_SOUND_POLICY
} from './sound-identity.js?v=11.3.5-nymph.2';
import { getMetadataForSeed as coreMetadataForSeed } from './cicada-traits.js?v=11.3.5-nymph.2';

export {
    soundGenomeForSeed,
    soundIdentitySummaryForSeed,
    renderSignatureCall,
    analyseMotion,
    decodeAudioFingerprint,
    bitsForSeed,
    seedFromBits,
    TIER_SOUND_POLICY
} from './sound-identity.js?v=11.3.5-nymph.2';
export { playSignatureCall, getSoundIdentity } from './motion-bridge.js?v=11.3.5-nymph.2';
export { GroupChorusEngine, createGroupChorus, groupGenesForSeed, RHYTHM_MODES, GROUP_PRESETS } from './group-chorus.js?v=11.3.5-nymph.2';
import {
    COLLECTION_SIZE,
    normalizeSeed,
    generateInstructionsFromSeed,
    getRenderInstructionsForSeed
} from './cicada-traits.js?v=11.3.5-nymph.2';

export {
    COLLECTION_SIZE,
    availableColors,
    normalizeSeed,
    TRAIT_WEIGHTS,
    EFFECT_WEIGHTS,
    RARITY_TIERS,
    generateInstructionsFromSeed,
    getRenderInstructionsForSeed,
    getCollectionMetadata,
    buildCollectionMetadataAsync,
    getMetadataForSeed,
    getMetadataJSON,
    getMetadataCSV
} from './cicada-traits.js?v=11.3.5-nymph.2';
export { CicadaGenerator } from './cicada-renderer.js?v=11.3.5-nymph.2';
export { CicadaNymphGenerator } from './cicada-nymph-renderer.js?v=11.3.8-molt.1';
export { CicadaSynth } from './cicada-audio.js?v=11.3.5-nymph.2';

// v11.3: exported ZIPs may include a base64-encoded bark asset map. Load it
// opportunistically so self-contained inscriptions render without external files.
let EXPORT_BARK_ASSET_MAP = null;
try {
    EXPORT_BARK_ASSET_MAP = (await import('./bark-assets.js')).BARK_ASSET_MAP || null;
} catch (_) {
    // No inline bark assets present; fall back to external assets/bark/ files.
}

// v11: reduced-motion support is shipped in the base page styles so both the
// builder AND every exported inscription HTML honour the user's OS preference
// and any explicit `.cicada-reduced-motion` class set on the document root.
function applyBasePageStyles() {
        if (document.getElementById('cicada-base-page-style')) return;
        const style = document.createElement('style');
        style.id = 'cicada-base-page-style';
        style.textContent = `
            html, body {
                margin: 0;
                padding: 0;
                width: 100%;
                height: 100%;
                background: #0b110e;
                overflow: hidden;
                user-select: none;
                font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            }
            #stage {
                position: absolute;
                inset: 0;
                width: 100%;
                height: 100%;
                background: transparent;
            }
            #stage:focus-visible {
                outline: 2px solid #00ff88;
                outline-offset: -2px;
            }
            .cicada-seed-badge {
                position: fixed;
                left: 16px;
                bottom: 14px;
                z-index: 10;
                color: rgba(255,255,255,0.45);
                font-size: 12px;
                letter-spacing: .08em;
                text-transform: uppercase;
                pointer-events: none;
            }
            /* Reduced motion: freeze decorative animation while preserving the
               full static visual identity. Triggered by the OS setting or by an
               explicit class on <html> (the builder's Motion toggle). */
            @media (prefers-reduced-motion: reduce) {
                html:not(.cicada-motion-full) #stage *,
                html:not(.cicada-motion-full) #stage *::before,
                html:not(.cicada-motion-full) #stage *::after {
                    animation-duration: 0.001ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.001ms !important;
                }
            }
            html.cicada-reduced-motion #stage *,
            html.cicada-reduced-motion #stage *::before,
            html.cicada-reduced-motion #stage *::after {
                animation-duration: 0.001ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.001ms !important;
            }
        `;
        document.head.appendChild(style);
    }

    function resolveMount(mount) {
        if (typeof mount === 'string') {
            const found = document.querySelector(mount);
            if (found) return found;
        } else if (mount instanceof Element) {
            return mount;
        }

        let stage = document.getElementById('stage');
        if (!stage) {
            stage = document.createElement('div');
            stage.id = 'stage';
            document.body.appendChild(stage);
        }
        return stage;
    }

    let sharedAudioCtx = null;
    function getSharedAudioContext() {
        if (!sharedAudioCtx) {
            sharedAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        return sharedAudioCtx;
    }

    export function renderCicada(options = {}) {
        const {
            seed = 1,
            mount,
            clearMount = true,
            pageStyles = true,
            interactive = true,
            enableAudio = true,
            showSeedBadge = false,
            keyboard = true,
            accessibleLabel = true
        } = options;

        if (pageStyles) applyBasePageStyles();
        const seedNumber = normalizeSeed(seed);
        const target = resolveMount(mount);
        if (clearMount) target.replaceChildren();

        const instructions = { ...getRenderInstructionsForSeed(seedNumber), ...(options.instructionOverrides || {}) };
        if (options.barkAssetMap) instructions.barkAssetMap = options.barkAssetMap;
        else if (EXPORT_BARK_ASSET_MAP) instructions.barkAssetMap = EXPORT_BARK_ASSET_MAP;
        const cicada = new CicadaGenerator({ mount: target, instructions });

        let audioCtx = null;
        let droneSynth = null;

        function ensureAudio() {
            if (!enableAudio) return;
            if (!audioCtx) {
                audioCtx = getSharedAudioContext();
                droneSynth = new CicadaSynth(audioCtx);
                droneSynth.update(cicada.instructions);
            }
            if (audioCtx.state === 'suspended') audioCtx.resume();
        }

        function onBodyClick() {
            if (!interactive) return;
            ensureAudio();
            const nextState = !cicada.instructions.flying;
            cicada.setFlying(nextState);
            if (droneSynth) droneSynth.setFlyingAndMute(nextState);
        }

        let activeSignatureCall = null;
        let signatureQueue = [];
        let chorusEngine = null;

        function runSignatureCall(options = {}) {
            if (!audioCtx) return null;
            const tier = coreMetadataForSeed(seedNumber)?.rarityTier || 'Common';
            activeSignatureCall = playSignatureCall(audioCtx, seedNumber, tier, cicada, {
                ...options,
                onDone: () => {
                    activeSignatureCall = null;
                    options.onDone?.();
                    const next = signatureQueue.shift();
                    if (next) {
                        setTimeout(() => runSignatureCall(next), 40);
                    }
                }
            });
            return activeSignatureCall;
        }

        function requestSignatureCall(options = {}) {
            ensureAudio();
            if (!audioCtx) return null;
            if (activeSignatureCall) {
                // v11.3.4: repeated calls no longer cut off the current call.
                // They queue and begin immediately after the current signature
                // finishes, which lets gallery cascades build delayed layers
                // instead of constantly resetting the same singers.
                if (signatureQueue.length < 3) signatureQueue.push(options);
                return activeSignatureCall;
            }
            return runSignatureCall(options);
        }

        function onHeadClick() {
            if (!interactive) return;
            ensureAudio();
            if (!audioCtx) return;
            // The head click performs the seed's full signature call. Re-clicks
            // now queue one more call instead of stopping the call already in
            // progress.
            try {
                requestSignatureCall();
            } catch (error) {
                const callDuration = droneSynth?.playCallOut(seedNumber) || 3000;
                cicada.triggerCallVisual(callDuration);
            }
        }

        if (interactive) {
            cicada.host.addEventListener('cicadaclick', onBodyClick);
            cicada.host.addEventListener('cicadacall', onHeadClick);
        }

        // v11 accessibility: make the artwork container a focusable, labelled
        // control so the two core interactions (fly / signature call) are
        // reachable with the keyboard and announced to screen readers. The
        // inner SVG stays aria-hidden; the container carries the semantics.
        let keyHandler = null;
        if (accessibleLabel && target) {
            target.setAttribute('role', 'application');
            target.setAttribute('aria-label',
                `Seed ${seedNumber} of ${COLLECTION_SIZE} cicada. Press F or Enter to toggle flight and sound, C to play the signature call.`);
            if (target.tabIndex < 0) target.tabIndex = 0;
        }
        if (interactive && keyboard && target) {
            keyHandler = event => {
                if (event.defaultPrevented) return;
                const key = event.key.toLowerCase();
                if (key === 'f' || key === 'enter' || key === ' ' || key === 'spacebar') {
                    event.preventDefault();
                    onBodyClick();
                } else if (key === 'c') {
                    event.preventDefault();
                    onHeadClick();
                }
            };
            target.addEventListener('keydown', keyHandler);
        }

        let badge = null;
        if (showSeedBadge) {
            badge = document.createElement('div');
            badge.className = 'cicada-seed-badge';
            badge.textContent = `Seed ${seedNumber} / ${COLLECTION_SIZE}`;
            document.body.appendChild(badge);
        }

        return {
            seed: seedNumber,
            instructions,
            cicada,
            get audioContext() { return audioCtx; },
            get synth() { return droneSynth; },
            ensureAudio,
            toggleFlight() { onBodyClick(); },
            playSignature(options = {}) {
                return requestSignatureCall(options);
            },
            stopSignature() {
                signatureQueue = [];
                activeSignatureCall?.stop();
                activeSignatureCall = null;
            },
            getIdentity() {
                const tier = coreMetadataForSeed(seedNumber)?.rarityTier || 'Common';
                return getSoundIdentity(seedNumber, tier);
            },
            getGroupGenes() {
                const tier = coreMetadataForSeed(seedNumber)?.rarityTier || 'Common';
                return groupGenesForSeed(seedNumber, tier);
            },
            startChorus(options = {}) {
                ensureAudio();
                if (!audioCtx) return null;
                if (chorusEngine?.running) return chorusEngine;
                chorusEngine?.destroy();
                const tier = coreMetadataForSeed(seedNumber)?.rarityTier || 'Common';
                chorusEngine = createGroupChorus(audioCtx, seedNumber, tier, options);
                chorusEngine.start();
                return chorusEngine;
            },
            stopChorus() {
                chorusEngine?.stop();
            },
            get chorus() { return chorusEngine; },
            destroy() {
                signatureQueue = [];
                activeSignatureCall?.stop();
                chorusEngine?.destroy();
                chorusEngine = null;
                if (keyHandler && target) target.removeEventListener('keydown', keyHandler);
                badge?.remove();
                badge = null;
                droneSynth?.destroy();
                cicada.destroy();
            }
        };
    }

    export function renderCicadaNymph(options = {}) {
        const {
            seed = 1,
            mount,
            clearMount = true,
            pageStyles = true,
            interactive = true,
            showSeedBadge = false,
            keyboard = true,
            accessibleLabel = true
        } = options;

        if (pageStyles) applyBasePageStyles();
        const seedNumber = normalizeSeed(seed);
        const target = resolveMount(mount);
        if (clearMount) target.replaceChildren();

        const layout = options.instructionOverrides || {};
        const instructions = {
            seed: seedNumber,
            unit: layout.unit || 'vmin',
            size: layout.size ?? 80,
            rotation: layout.rotation ?? 0,
            xOffset: layout.xOffset ?? 0,
            yOffset: layout.yOffset ?? 0,
            idleWander: layout.idleWander,
            hueShift: 0,
            brightness: 1,
            rarityTier: 'common',
            lifeStage: 'nymph',
            flying: false
        };
        const nymph = new CicadaNymphGenerator({ mount: target, instructions });

        function onBodyClick() {
            if (!interactive) return;
            nymph.setFlying(!nymph.shell.classList.contains('is-alert'));
        }

        function onHeadClick() {
            if (!interactive) return;
            nymph.triggerCallVisual(900);
        }

        if (interactive) {
            nymph.host.addEventListener('cicadaclick', onBodyClick);
            nymph.host.addEventListener('cicadacall', onHeadClick);
        }

        let keyHandler = null;
        if (accessibleLabel && target) {
            target.setAttribute('role', 'application');
            target.setAttribute('aria-label',
                `Seed ${seedNumber} of ${COLLECTION_SIZE} cicada nymph. Press F or Enter for alert posture, C for a brief head response.`);
            if (target.tabIndex < 0) target.tabIndex = 0;
        }
        if (interactive && keyboard && target) {
            keyHandler = event => {
                if (event.defaultPrevented) return;
                const key = event.key.toLowerCase();
                if (key === 'f' || key === 'enter' || key === ' ' || key === 'spacebar') {
                    event.preventDefault();
                    onBodyClick();
                } else if (key === 'c') {
                    event.preventDefault();
                    onHeadClick();
                }
            };
            target.addEventListener('keydown', keyHandler);
        }

        let badge = null;
        if (showSeedBadge) {
            badge = document.createElement('div');
            badge.className = 'cicada-seed-badge';
            badge.textContent = `Nymph seed ${seedNumber} / ${COLLECTION_SIZE}`;
            document.body.appendChild(badge);
        }

        return {
            seed: seedNumber,
            instructions,
            cicada: nymph,
            toggleAlert() { onBodyClick(); },
            toggleFlight() { onBodyClick(); },
            triggerHeadResponse(durationMs = 900) {
                nymph.triggerCallVisual(durationMs);
            },
            destroy() {
                if (interactive) {
                    nymph.host.removeEventListener('cicadaclick', onBodyClick);
                    nymph.host.removeEventListener('cicadacall', onHeadClick);
                }
                if (keyHandler && target) target.removeEventListener('keydown', keyHandler);
                badge?.remove();
                badge = null;
                nymph.destroy();
            }
        };
    }

    // Subterranean nymph scene: a colony of shared-design nymphs moving through
    // a layered underground environment on independent routes, each emerging at
    // the top boundary into the adult cicada (the next visual state the engine
    // already renders).
    export function renderNymphScene(options = {}) {
        const {
            seed = 1,
            mount,
            clearMount = true,
            pageStyles = true,
            count = 5
        } = options;

        if (pageStyles) applyBasePageStyles();
        const seedNumber = normalizeSeed(seed);
        const target = resolveMount(mount);
        if (clearMount) target.replaceChildren();

        const scene = new NymphScene({ mount: target, seed: seedNumber, count, renderCicada });

        if (target) {
            target.setAttribute('role', 'img');
            target.setAttribute('aria-label',
                `Subterranean scene: a colony of cicada nymphs from seed ${seedNumber} moving through tunnels and emerging into adults.`);
        }

        return {
            seed: seedNumber,
            scene,
            destroy() {
                scene.destroy();
                if (target) { target.removeAttribute('role'); target.removeAttribute('aria-label'); }
            }
        };
    }

    export function init(seed = 1, options = {}) {
        return renderCicada({ ...options, seed });
    }
