// Gallery flight contagion network.
// v11.3.4: triggered flyers are now linked to the source flight window.
// If the clicked cicada remains airborne, its startled followers remain
// airborne too; when the source lands, the network releases those followers.

import { mulberry32 } from './utils.js?v=11.3.5';

const FLIGHT_TIER_PROFILES = Object.freeze({
    Common: {
        minAffected: 1,
        maxAffected: 2,
        bridgeChance: 0,
        bridgeExtraMax: 0,
        wholeGalleryChance: 0,
        launchStagger: 140,
        label: 'small linked startle'
    },
    Uncommon: {
        minAffected: 1,
        maxAffected: 3,
        bridgeChance: 0.01,
        bridgeExtraMax: 1,
        wholeGalleryChance: 0,
        launchStagger: 128,
        label: 'nearby linked flutter'
    },
    Rare: {
        minAffected: 2,
        maxAffected: 4,
        bridgeChance: 0.05,
        bridgeExtraMax: 2,
        wholeGalleryChance: 0.01,
        launchStagger: 112,
        label: 'rare linked scatter'
    },
    Epic: {
        minAffected: 3,
        maxAffected: 6,
        bridgeChance: 0.18,
        bridgeExtraMax: 3,
        wholeGalleryChance: 0.06,
        launchStagger: 88,
        label: 'epic linked swarm-lift'
    },
    Legendary: {
        minAffected: 6,
        maxAffected: 12,
        bridgeChance: 0.45,
        bridgeExtraMax: 5,
        wholeGalleryChance: 0.25,
        launchStagger: 58,
        label: 'legendary linked launch'
    },
    Mythic: {
        minAffected: 999,
        maxAffected: 999,
        bridgeChance: 1,
        bridgeExtraMax: 999,
        wholeGalleryChance: 1,
        launchStagger: 30,
        label: 'mythic whole-gallery linked flight'
    }
});

const FLIGHT_SIMILARITY_TRAITS = Object.freeze([
    ['Motion Rig', 34],
    ['Wing Morph', 30],
    ['Wing Shape', 22],
    ['Normal Wing Veins', 14],
    ['Normal Wing Tint', 12],
    ['Normal Wing Edge', 10],
    ['Bark Family', 12],
    ['Bark Backdrop', 10],
    ['Skin Mat.', 8],
    ['Legs', 8],
    ['Core Color', 5],
    ['Shell Type', 4],
    ['Antennae', 3]
]);

function clampInt(value, min, max) {
    return Math.max(min, Math.min(max, Math.trunc(value)));
}

function tierProfile(tier) {
    return FLIGHT_TIER_PROFILES[tier] || FLIGHT_TIER_PROFILES.Common;
}

function metadataFor(render, getMetadataForSeed) {
    if (!render) return null;
    return render.galleryMeta || getMetadataForSeed?.(render.seed) || null;
}

function traitValue(meta, key) {
    return meta?.traits?.[key] ?? meta?.instructions?.[key] ?? null;
}

function isActiveCell(render) {
    const cell = render?.galleryCell;
    if (!cell || !cell.isConnected) return false;
    return !cell.classList.contains('offscreen');
}

function flightSimilarityScore(sourceMeta, targetMeta, random) {
    if (!sourceMeta || !targetMeta) return random() * 2;
    let score = random() * 4;
    for (const [key, weight] of FLIGHT_SIMILARITY_TRAITS) {
        const a = traitValue(sourceMeta, key);
        const b = traitValue(targetMeta, key);
        if (a != null && b != null && String(a) === String(b)) score += weight;
    }

    const distance = Math.abs((Number(sourceMeta.seed) || 0) - (Number(targetMeta.seed) || 0));
    if (distance === 1) score += 5;
    else if (distance <= 3) score += 2;

    const targetTier = targetMeta.rarityTier || 'Common';
    if (targetTier === 'Mythic') score += 12;
    else if (targetTier === 'Legendary') score += 8;
    else if (targetTier === 'Epic') score += 4;
    else if (targetTier === 'Rare') score += 2;
    return score;
}

function chooseFlightResponders(sourceRender, allRenders, getMetadataForSeed) {
    const sourceMeta = metadataFor(sourceRender, getMetadataForSeed);
    const sourceTier = sourceMeta?.rarityTier || sourceRender?.instructions?.rarityTier || 'Common';
    const profile = tierProfile(sourceTier);
    const candidates = allRenders.filter(render => render && render !== sourceRender && isActiveCell(render));
    if (!candidates.length) return { responders: [], sourceMeta, profile, wholeGallery: false, sourceTier };

    const random = mulberry32(((Number(sourceRender.seed) || 1) * 1000003 + Date.now() + 0xF11A7E) >>> 0);
    const wholeGallery = random() < profile.wholeGalleryChance;
    if (wholeGallery) {
        return {
            responders: candidates.slice(0, profile.maxAffected),
            sourceMeta,
            profile,
            wholeGallery: true,
            sourceTier,
            random
        };
    }

    const scored = candidates.map(render => ({
        render,
        meta: metadataFor(render, getMetadataForSeed),
        score: flightSimilarityScore(sourceMeta, metadataFor(render, getMetadataForSeed), random)
    })).sort((a, b) => b.score - a.score);

    const minAffected = Math.min(profile.minAffected, scored.length, profile.maxAffected);
    const maxAffected = Math.min(profile.maxAffected, scored.length);
    const targetCount = clampInt(
        profile.minAffected + Math.floor(random() * Math.max(1, profile.maxAffected - profile.minAffected + 1)),
        minAffected,
        maxAffected
    );
    const selected = scored.slice(0, targetCount);

    const selectedSet = new Set(selected.map(item => item.render));
    const canBridge = profile.bridgeExtraMax > 0 && selected.length < profile.maxAffected && random() < profile.bridgeChance;
    if (canBridge) {
        const bridgePool = scored.filter(item => !selectedSet.has(item.render)).reverse();
        const remainingCap = profile.maxAffected - selected.length;
        const bridgeCount = Math.min(remainingCap, 1 + Math.floor(random() * profile.bridgeExtraMax), bridgePool.length);
        for (let i = 0; i < bridgeCount; i++) selected.push(bridgePool[i]);
    }

    return {
        responders: selected.slice(0, profile.maxAffected).map(item => item.render),
        sourceMeta,
        profile,
        wholeGallery: false,
        sourceTier,
        random
    };
}

export function createGalleryFlightNetwork({ getRenders, getMetadataForSeed, setStatus } = {}) {
    let timeouts = [];
    let activeClasses = new Set();
    let activeWaves = new Map();
    let forcedFlightRefs = new Map();
    let forcedWasFlying = new Map();
    let lastSourceAt = new Map();

    function addClass(render, className, ms = 1200) {
        const cell = render?.galleryCell;
        if (!cell) return;
        cell.classList.add(className);
        activeClasses.add([cell, className]);
        if (ms > 0) {
            const timeout = setTimeout(() => {
                cell.classList.remove(className);
            }, ms);
            timeouts.push(timeout);
        }
    }

    function setVisualFlight(render, active) {
        try {
            render?.cicada?.setFlying?.(active);
            // Keep contagion primarily visual. Source cicadas keep their own
            // flight drone; followers use the visual rig so sound does not
            // become uncontrollable unless the call network triggers sound.
        } catch (_) {}
    }

    function forceFollowerFlight(render) {
        if (!render?.galleryCell?.isConnected) return;
        if (!forcedFlightRefs.has(render)) {
            forcedWasFlying.set(render, Boolean(render?.cicada?.instructions?.flying));
            forcedFlightRefs.set(render, 0);
        }
        forcedFlightRefs.set(render, forcedFlightRefs.get(render) + 1);
        setVisualFlight(render, true);
        render.galleryCell.classList.remove('gallery-cell-flight-alert');
        render.galleryCell.classList.add('gallery-cell-flight-following', 'gallery-cell-flight-linked');
        activeClasses.add([render.galleryCell, 'gallery-cell-flight-following']);
        activeClasses.add([render.galleryCell, 'gallery-cell-flight-linked']);
    }

    function releaseFollowerFlight(render) {
        if (!forcedFlightRefs.has(render)) return;
        const next = Math.max(0, forcedFlightRefs.get(render) - 1);
        if (next > 0) {
            forcedFlightRefs.set(render, next);
            return;
        }
        forcedFlightRefs.delete(render);
        const wasFlying = forcedWasFlying.get(render);
        forcedWasFlying.delete(render);
        render?.galleryCell?.classList?.remove('gallery-cell-flight-following', 'gallery-cell-flight-linked', 'gallery-cell-flight-alert');
        if (!wasFlying) setVisualFlight(render, false);
    }

    function clearWaveTimers(wave) {
        for (const timeout of wave.timeouts || []) clearTimeout(timeout);
        wave.timeouts = [];
    }

    function stopWave(sourceRender, reason = 'landed') {
        const wave = activeWaves.get(sourceRender);
        if (!wave) return [];
        clearWaveTimers(wave);
        for (const follower of wave.followers) releaseFollowerFlight(follower);
        sourceRender?.galleryCell?.classList?.remove('gallery-cell-flight-source');
        activeWaves.delete(sourceRender);
        if (reason !== 'clear') {
            setStatus?.(`Gallery flight: seed ${sourceRender.seed} landed, so its linked followers landed with it.`);
        }
        return Array.from(wave.followers);
    }

    function scheduleLinkedLaunch(sourceRender, follower, index, profile, wholeGallery, random, wave) {
        const stagger = 120 + index * (wholeGallery ? profile.launchStagger : profile.launchStagger + Math.floor(random() * 40));
        const alertTimeout = setTimeout(() => addClass(follower, 'gallery-cell-flight-alert', 0), Math.max(0, stagger - 160));
        const flightTimeout = setTimeout(() => {
            if (!sourceRender?.cicada?.instructions?.flying || !activeWaves.has(sourceRender)) return;
            wave.followers.add(follower);
            forceFollowerFlight(follower);
        }, stagger + 120);
        wave.timeouts.push(alertTimeout, flightTimeout);
        timeouts.push(alertTimeout, flightTimeout);
    }

    function startWave(sourceRender) {
        if (!sourceRender?.cicada?.instructions?.flying) {
            return stopWave(sourceRender);
        }
        if (activeWaves.has(sourceRender)) return [];

        const now = Date.now();
        const last = lastSourceAt.get(sourceRender.seed) || 0;
        if (now - last < 700) return [];
        lastSourceAt.set(sourceRender.seed, now);

        const allRenders = typeof getRenders === 'function' ? getRenders() : [];
        const { responders, profile, wholeGallery, sourceTier, random = Math.random } = chooseFlightResponders(sourceRender, allRenders, getMetadataForSeed);
        const wave = { source: sourceRender, followers: new Set(), timeouts: [] };
        activeWaves.set(sourceRender, wave);
        addClass(sourceRender, 'gallery-cell-flight-source', 0);

        if (!responders.length) {
            setStatus?.(`Gallery flight: seed ${sourceRender.seed} launched, but no visible neighbours were startled.`);
            return [];
        }

        responders.forEach((render, index) => scheduleLinkedLaunch(sourceRender, render, index, profile, wholeGallery, random, wave));

        const mode = wholeGallery ? 'whole visible gallery' : profile.label;
        setStatus?.(`Gallery flight: ${sourceTier} seed ${sourceRender.seed} linked ${responders.length} cicada${responders.length === 1 ? '' : 's'} to its flight window (${mode}). They will land when it lands.`);
        return responders;
    }

    function handleSourceFlight(sourceRender) {
        if (!sourceRender?.cicada?.instructions?.flying) return stopWave(sourceRender);
        return startWave(sourceRender);
    }

    function clear() {
        for (const timeout of timeouts) clearTimeout(timeout);
        timeouts = [];
        for (const sourceRender of Array.from(activeWaves.keys())) stopWave(sourceRender, 'clear');
        for (const render of Array.from(forcedFlightRefs.keys())) {
            forcedFlightRefs.set(render, 1);
            releaseFollowerFlight(render);
        }
        for (const [cell, className] of activeClasses) cell?.classList?.remove(className);
        activeClasses = new Set();
        activeWaves = new Map();
        forcedFlightRefs = new Map();
        forcedWasFlying = new Map();
        lastSourceAt = new Map();
    }

    return { handleSourceFlight, clear, profiles: FLIGHT_TIER_PROFILES };
}
