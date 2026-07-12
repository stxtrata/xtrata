// Gallery call-and-response network.
// v11.3.4: calls no longer reset the existing chorus. Each cicada keeps a
// tiny per-cell call queue, and rarity-capped cascades can now spread with
// staggered wildfire-style delays before burning out.
// v11.3.5: replies are now musically scheduled. Responder delays follow the
// SOURCE seed's pulse group (e.g. 2-2-3 lands replies in grouped bursts with
// breath gaps), large responses can split into two antiphonal choirs, Epic+
// calls can trigger a soft delayed echo wave, and every reply is spatialised
// (seeded stereo pan, slight rate variation, cascade-depth distance blur).
// Repeated calls from the same source evolve: each call ordinal reseeds the
// event PRNG so the network answers differently — but deterministically —
// on the 1st, 2nd, 3rd click.

import { mulberry32 } from './utils.js?v=11.3.5';

const TIER_PROFILES = Object.freeze({
    Common: {
        minReplies: 2,
        maxReplies: 3,
        maxTotalReplies: 3,
        allGalleryChance: 0,
        bridgeChance: 0,
        bridgeExtraMax: 0,
        cascadeChance: 0,
        maxDepth: 0,
        chainFanout: 0,
        label: 'local pocket'
    },
    Uncommon: {
        minReplies: 2,
        maxReplies: 4,
        maxTotalReplies: 5,
        allGalleryChance: 0,
        bridgeChance: 0.01,
        bridgeExtraMax: 1,
        cascadeChance: 0.05,
        maxDepth: 1,
        chainFanout: 1,
        label: 'nearby pocket'
    },
    Rare: {
        minReplies: 3,
        maxReplies: 5,
        maxTotalReplies: 8,
        allGalleryChance: 0.015,
        bridgeChance: 0.07,
        bridgeExtraMax: 2,
        cascadeChance: 0.22,
        maxDepth: 1,
        chainFanout: 2,
        label: 'rare bridge'
    },
    Epic: {
        minReplies: 4,
        maxReplies: 7,
        maxTotalReplies: 14,
        allGalleryChance: 0.10,
        bridgeChance: 0.24,
        bridgeExtraMax: 3,
        cascadeChance: 0.48,
        maxDepth: 2,
        chainFanout: 2,
        label: 'epic cascade'
    },
    Legendary: {
        minReplies: 7,
        maxReplies: 12,
        maxTotalReplies: 24,
        allGalleryChance: 0.45,
        bridgeChance: 0.65,
        bridgeExtraMax: 5,
        cascadeChance: 0.74,
        maxDepth: 3,
        chainFanout: 3,
        label: 'legendary swarm'
    },
    Mythic: {
        minReplies: 999,
        maxReplies: 999,
        maxTotalReplies: 999,
        allGalleryChance: 1,
        bridgeChance: 1,
        bridgeExtraMax: 999,
        cascadeChance: 1,
        maxDepth: 2,
        chainFanout: 4,
        label: 'mythic whole-gallery call'
    }
});

const SIMILARITY_TRAITS = Object.freeze([
    ['Pulse Group', 34],
    ['Acoustic Family', 30],
    ['Rhythm Genome', 24],
    ['Motion Rig', 18],
    ['Call Shape', 14],
    ['Call Rhythm', 12],
    ['Call Voice', 10],
    ['Bark Family', 9],
    ['Bark Backdrop', 7],
    ['Song Rhythm', 6],
    ['Core Color', 3]
]);

const MAX_PENDING_CALLS_PER_CELL = 3;

function clampInt(value, min, max) {
    return Math.max(min, Math.min(max, Math.trunc(value)));
}

function tierProfile(tier) {
    return TIER_PROFILES[tier] || TIER_PROFILES.Common;
}

function metadataFor(render, getMetadataForSeed) {
    if (!render) return null;
    return render.galleryMeta || getMetadataForSeed?.(render.seed) || null;
}

function traitValue(meta, key) {
    return meta?.traits?.[key] ?? meta?.instructions?.[key] ?? null;
}

// v11.3.5: parse the source's pulse group trait ("2-2-3") into a reply-timing
// pattern so the gallery answers in the caller's own rhythm genome.
function pulseGroupFor(meta) {
    const raw = traitValue(meta, 'Pulse Group');
    if (typeof raw !== 'string') return [2, 2, 3];
    const parts = raw.split('-').map(n => Number.parseInt(n, 10)).filter(n => Number.isFinite(n) && n > 0);
    return parts.length ? parts : [2, 2, 3];
}

// Build per-responder delays that land in grouped bursts: replies inside a
// group are one "beat" apart, groups are separated by a breath gap.
function rhythmicReplyDelays(count, group, random, baseDelay, beatMs) {
    const delays = [];
    let t = baseDelay;
    let gi = 0, used = 0;
    for (let i = 0; i < count; i++) {
        delays.push(Math.round(t + (random() - 0.5) * beatMs * 0.22));
        used += 1;
        if (used >= (group[gi % group.length] || 1)) {
            gi += 1; used = 0;
            t += beatMs * (1.7 + random() * 0.9); // breath gap between pulse groups
        } else {
            t += beatMs;
        }
    }
    return delays;
}

// Deterministic per-seed stereo position so each responder always answers
// from "its" place in the field.
function seededPan(seed) {
    const h = (Math.imul((Number(seed) || 1), 2654435761) >>> 8) % 1000;
    return (h / 1000) * 1.6 - 0.8;
}

function similarityScore(sourceMeta, targetMeta, random) {
    if (!sourceMeta || !targetMeta) return random() * 2;
    let score = random() * 4;
    for (const [key, weight] of SIMILARITY_TRAITS) {
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

function isActiveCell(render) {
    const cell = render?.galleryCell;
    if (!cell || !cell.isConnected) return false;
    return !cell.classList.contains('offscreen');
}

function candidateList(sourceRender, allRenders, getMetadataForSeed, random, exclude = new Set()) {
    const sourceMeta = metadataFor(sourceRender, getMetadataForSeed);
    return allRenders
        .filter(render => render && render !== sourceRender && isActiveCell(render) && !exclude.has(render))
        .map(render => ({
            render,
            meta: metadataFor(render, getMetadataForSeed),
            score: similarityScore(sourceMeta, metadataFor(render, getMetadataForSeed), random)
        }))
        .sort((a, b) => b.score - a.score);
}

function chooseResponders(sourceRender, allRenders, getMetadataForSeed, options = {}) {
    const sourceMeta = metadataFor(sourceRender, getMetadataForSeed);
    const sourceTier = sourceMeta?.rarityTier || sourceRender?.instructions?.rarityTier || 'Common';
    const profile = options.profile || tierProfile(sourceTier);
    const exclude = options.exclude || new Set();
    const random = options.random || mulberry32(((Number(sourceRender.seed) || 1) * 1000003 + Date.now()) >>> 0);
    const candidates = allRenders.filter(render => render && render !== sourceRender && isActiveCell(render) && !exclude.has(render));
    if (!candidates.length) return { responders: [], sourceMeta, profile, wholeGallery: false, sourceTier, random };

    const availableBudget = Number.isFinite(options.remainingBudget) ? Math.max(0, options.remainingBudget) : profile.maxReplies;
    if (availableBudget <= 0) return { responders: [], sourceMeta, profile, wholeGallery: false, sourceTier, random };

    const wholeGallery = options.allowWholeGallery !== false && random() < profile.allGalleryChance;
    if (wholeGallery) {
        return {
            responders: candidates.slice(0, Math.min(profile.maxReplies, availableBudget)),
            sourceMeta,
            profile,
            wholeGallery: true,
            sourceTier,
            random
        };
    }

    const scored = candidateList(sourceRender, allRenders, getMetadataForSeed, random, exclude);
    const maxReplies = Math.min(options.maxReplies || profile.maxReplies, scored.length, availableBudget);
    const minReplies = Math.min(options.minReplies ?? profile.minReplies, scored.length, maxReplies);
    if (maxReplies <= 0) return { responders: [], sourceMeta, profile, wholeGallery: false, sourceTier, random };

    const targetCount = clampInt(
        minReplies + Math.floor(random() * Math.max(1, maxReplies - minReplies + 1)),
        minReplies,
        maxReplies
    );
    const selected = scored.slice(0, targetCount);

    const selectedSet = new Set(selected.map(item => item.render));
    const canBridge = options.allowBridge !== false
        && profile.bridgeExtraMax > 0
        && selected.length < maxReplies
        && random() < profile.bridgeChance;
    if (canBridge) {
        const bridgePool = scored.filter(item => !selectedSet.has(item.render)).reverse();
        const remainingCap = maxReplies - selected.length;
        const bridgeCount = Math.min(remainingCap, 1 + Math.floor(random() * profile.bridgeExtraMax), bridgePool.length);
        for (let i = 0; i < bridgeCount; i++) selected.push(bridgePool[i]);
    }

    return {
        responders: selected.slice(0, maxReplies).map(item => item.render),
        sourceMeta,
        profile,
        wholeGallery: false,
        sourceTier,
        random
    };
}

function chooseChainTargets(sourceRender, event, allRenders, getMetadataForSeed, depth) {
    if (depth > event.profile.maxDepth || event.remaining <= 0) return [];
    const random = event.random;
    const sourceMeta = metadataFor(sourceRender, getMetadataForSeed);
    const sourceTier = sourceMeta?.rarityTier || 'Common';
    const sourceProfile = tierProfile(sourceTier);
    const depthFalloff = Math.max(0.28, 1 - depth * 0.22);
    const cascadeChance = Math.max(event.profile.cascadeChance, sourceProfile.cascadeChance * 0.65) * depthFalloff;
    if (random() > cascadeChance) return [];

    const scored = candidateList(sourceRender, allRenders, getMetadataForSeed, random, event.touched);
    if (!scored.length) return [];
    const maxFanout = Math.min(event.profile.chainFanout, event.remaining, scored.length);
    if (maxFanout <= 0) return [];
    const count = Math.min(maxFanout, 1 + Math.floor(random() * maxFanout));
    return scored.slice(0, count).map(item => item.render);
}

export function createGalleryListenerNetwork({ getRenders, getMetadataForSeed, setStatus } = {}) {
    let timeouts = [];
    let activeClasses = new Set();
    let callStates = new Map();
    let activeEvents = 0;

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

    function stateFor(render) {
        if (!callStates.has(render)) callStates.set(render, { active: false, pending: [] });
        return callStates.get(render);
    }

    function finishQueuedCall(render, state) {
        render.galleryCell?.classList?.remove('gallery-cell-responding');
        state.active = false;
        if (state.pending.length > 0 && render?.galleryCell?.isConnected) {
            const nextOptions = state.pending.shift();
            addClass(render, 'gallery-cell-call-queued', 700);
            const timeout = setTimeout(() => startQueuedCall(render, state, true, nextOptions), 90);
            timeouts.push(timeout);
        }
    }

    function startQueuedCall(render, state = stateFor(render), fromQueue = false, callOptions = null) {
        if (!render?.galleryCell?.isConnected) return;
        if (state.active) {
            if (state.pending.length < MAX_PENDING_CALLS_PER_CELL) state.pending.push(callOptions);
            addClass(render, 'gallery-cell-call-queued', 900);
            return;
        }
        state.active = true;
        render.galleryCell.classList.remove('gallery-cell-call-queued');
        addClass(render, fromQueue ? 'gallery-cell-responding' : 'gallery-cell-responding', 0);
        try {
            const handle = render.playSignature?.({
                ...(callOptions || {}),
                onDone: () => finishQueuedCall(render, state)
            });
            if (!handle) {
                const timeout = setTimeout(() => finishQueuedCall(render, state), 1800);
                timeouts.push(timeout);
            }
        } catch (_) {
            render.cicada?.triggerCallVisual?.(1500);
            const timeout = setTimeout(() => finishQueuedCall(render, state), 1500);
            timeouts.push(timeout);
        }
    }

    function queueCall(render, callOptions = null) {
        const state = stateFor(render);
        if (state.active) {
            if (state.pending.length < MAX_PENDING_CALLS_PER_CELL) state.pending.push(callOptions);
            addClass(render, 'gallery-cell-call-queued', 900);
            return;
        }
        startQueuedCall(render, state, false, callOptions);
    }

    function scheduleResponder(render, delay, event, depth) {
        if (!render || event.remaining <= 0 || event.touched.has(render)) return;
        event.touched.add(render);
        event.remaining -= 1;
        // v11.3.5: spatialised, varied replies. Each responder answers from its
        // seeded stereo position, at a slightly individual rate, and cascade
        // depth pushes the voice further away (distance blur + softer gain).
        const distance = Math.min(0.75, depth * 0.26 + (event.random() * 0.10));
        const callOptions = {
            pan: seededPan(render.seed),
            playbackRate: 1 + (event.random() - 0.5) * 0.05,
            gain: Math.max(0.28, 0.82 - depth * 0.16) * (0.9 + event.random() * 0.2),
            distance
        };
        const listenDelay = Math.max(0, delay - 220);
        const listenTimeout = setTimeout(() => addClass(render, 'gallery-cell-listening', 900), listenDelay);
        const replyTimeout = setTimeout(() => {
            queueCall(render, callOptions);
            scheduleCascadeFrom(render, event, depth + 1, 760 + Math.floor(event.random() * 620));
        }, delay);
        timeouts.push(listenTimeout, replyTimeout);
    }

    function scheduleCascadeFrom(render, event, depth, extraDelay) {
        if (depth > event.profile.maxDepth || event.remaining <= 0) return;
        const timeout = setTimeout(() => {
            const allRenders = typeof getRenders === 'function' ? getRenders() : [];
            const targets = chooseChainTargets(render, event, allRenders, getMetadataForSeed, depth);
            targets.forEach((target, index) => {
                const delay = 260 + index * (170 + Math.floor(event.random() * 120));
                scheduleResponder(target, delay, event, depth);
            });
        }, extraDelay);
        timeouts.push(timeout);
    }

    function clear() {
        for (const timeout of timeouts) clearTimeout(timeout);
        timeouts = [];
        for (const render of callStates.keys()) render?.stopSignature?.();
        callStates = new Map();
        for (const [cell, className] of activeClasses) cell?.classList?.remove(className);
        activeClasses = new Set();
        activeEvents = 0;
    }

    const callOrdinals = new Map();

    function handleSourceCall(sourceRender) {
        const allRenders = typeof getRenders === 'function' ? getRenders() : [];
        const sourceSeed = Number(sourceRender?.seed) || 1;
        // v11.3.5: the event PRNG evolves with the call ordinal, so clicking the
        // same cicada again produces a different — but deterministic — response
        // shape (who answers, in what rhythm, whether it echoes).
        const ordinal = (callOrdinals.get(sourceSeed) || 0) + 1;
        callOrdinals.set(sourceSeed, ordinal);
        const random = mulberry32(((sourceSeed * 1000003) + ordinal * 7919 + activeEvents * 104729) >>> 0);
        const sourceMeta = metadataFor(sourceRender, getMetadataForSeed);
        const sourceMetaFull = sourceMeta;
        const sourceTier = sourceMeta?.rarityTier || sourceRender?.instructions?.rarityTier || 'Common';
        const profile = tierProfile(sourceTier);
        const event = {
            id: `${sourceSeed}:${Date.now()}:${activeEvents++}`,
            origin: sourceRender,
            profile,
            random,
            touched: new Set([sourceRender]),
            remaining: profile.maxTotalReplies
        };

        const { responders, wholeGallery } = chooseResponders(sourceRender, allRenders, getMetadataForSeed, {
            random,
            profile,
            exclude: event.touched,
            remainingBudget: event.remaining
        });
        addClass(sourceRender, 'gallery-cell-calling', 1600);

        if (!responders.length) {
            setStatus?.(`Gallery listening: seed ${sourceRender.seed} called, but no visible neighbours were close enough to answer.`);
            return [];
        }

        // v11.3.5: replies land in the SOURCE's own rhythm. The seed's pulse
        // group (e.g. 2-2-3) shapes grouped reply bursts separated by breath
        // gaps; whole-gallery events use a faster beat so the wave still rolls.
        const pulseGroup = pulseGroupFor(sourceMetaFull);
        const beatMs = wholeGallery ? 95 + Math.floor(random() * 50) : 150 + Math.floor(random() * 80);
        const baseDelay = wholeGallery ? 300 : 420;
        const delays = rhythmicReplyDelays(responders.length, pulseGroup, random, baseDelay, beatMs);

        // Antiphony: larger responses can split into two alternating choirs —
        // the second choir answers the first, offset by half a breath.
        const antiphonal = responders.length >= 4 && random() < 0.38;
        const antiphonyOffset = Math.round(beatMs * (1.4 + random() * 0.8));

        responders.forEach((render, index) => {
            let delay = delays[index] ?? (baseDelay + index * beatMs);
            if (antiphonal && index % 2 === 1) delay += antiphonyOffset;
            scheduleResponder(render, delay, event, 0);
        });

        // Echo wave: Epic+ sources can pull a few of their responders back for
        // a soft, distant second answer after the first wave settles.
        const echoCapable = ['Epic', 'Legendary', 'Mythic'].includes(sourceTier);
        let echoed = 0;
        if (echoCapable && random() < 0.42 && responders.length >= 2) {
            const lastDelay = delays[delays.length - 1] || baseDelay;
            const echoCount = Math.min(3, 1 + Math.floor(random() * 3), responders.length);
            for (let i = 0; i < echoCount; i++) {
                const render = responders[Math.floor(random() * responders.length)];
                const echoDelay = lastDelay + 2600 + Math.floor(random() * 1700) + i * (420 + Math.floor(random() * 260));
                const echoOptions = {
                    pan: seededPan(render.seed),
                    playbackRate: 0.985 + random() * 0.03,
                    gain: 0.30 + random() * 0.14,
                    distance: 0.55 + random() * 0.20
                };
                const timeout = setTimeout(() => {
                    if (render?.galleryCell?.isConnected) {
                        addClass(render, 'gallery-cell-echoing', 1400);
                        queueCall(render, echoOptions);
                    }
                }, echoDelay);
                timeouts.push(timeout);
                echoed += 1;
            }
        }

        const mode = wholeGallery ? 'whole visible gallery' : profile.label;
        const cascadeText = profile.maxDepth > 0 ? `, with delayed cascade potential` : '';
        const rhythmText = `, replies in ${pulseGroup.join('-')} rhythm${antiphonal ? ', antiphonal' : ''}${echoed ? `, ${echoed} echo${echoed === 1 ? '' : 'es'}` : ''}`;
        setStatus?.(`Gallery listening: ${sourceTier} seed ${sourceRender.seed} queued ${responders.length} direct repl${responders.length === 1 ? 'y' : 'ies'} (${mode}${cascadeText}${rhythmText}).`);
        return responders;
    }

    return { handleSourceCall, clear, profiles: TIER_PROFILES };
}
