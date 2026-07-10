// Subterranean nymph scene. Renders a layered underground environment (soil
// strata, tunnels, roots, stones, softly lit pathways) and populates it with a
// colony of grounded cicada nymphs. Every nymph shares one character design
// (CicadaNymphGenerator) but animates independently: each is given its own
// seeded route, speed, timing and pauses. Near the end of a nymph's timed
// progression it climbs toward the surface at the top boundary and transitions
// cleanly into the adult cicada — the next visual state the engine already
// supports — which then takes flight and leaves the scene.
import { CicadaNymphGenerator } from './cicada-nymph-renderer.js?v=11.3.5-nymph.2';
import { mulberry32, clamp01, lerp } from './utils.js?v=11.3.5-nymph.2';

const SCENE_STYLE_ID = 'nymph-scene-style';
const rand = (r, lo, hi) => lo + r() * (hi - lo);

function injectSceneStyles() {
    if (document.getElementById(SCENE_STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = SCENE_STYLE_ID;
    style.textContent = `
        .nymph-scene{position:absolute;inset:0;overflow:hidden;background:
            radial-gradient(120% 80% at 50% -10%, #3a2a17 0%, #26190d 26%, #180f07 55%, #0d0805 100%);}
        .nymph-scene-env,.nymph-scene-disturb{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;}
        .nymph-scene-env{z-index:0;}
        .nymph-scene-disturb{z-index:1;}
        .nymph-actor{position:absolute;overflow:visible;pointer-events:none;
            transition:transform 1.6s cubic-bezier(.4,0,.3,1), opacity 1.2s ease;will-change:transform,opacity;}
        .nymph-actor.is-emerging{transition:transform 3.4s cubic-bezier(.35,0,.2,1), opacity 2.4s ease;}
        .nymph-scene-surface{position:absolute;left:0;right:0;top:0;height:8%;z-index:2;pointer-events:none;
            background:linear-gradient(to bottom, rgba(120,150,90,.20), rgba(40,60,25,.06) 60%, transparent);}
        html.cicada-reduced-motion .nymph-actor{transition:none;}
    `;
    document.head.appendChild(style);
}

// Build the deterministic environment SVG: soil bands, root systems, stones,
// tunnels and the soft light that pools along the pathways.
function buildEnvironmentSVG(seed) {
    const r = mulberry32((seed ^ 0x50113E) >>> 0);
    const W = 1000, H = 1000;
    const parts = [];

    // Soil strata — stacked bands of shifting warm browns for depth.
    const bandColors = ['#4a3319', '#3d2a14', '#332310', '#2a1c0d', '#20150a', '#170e06'];
    let y = 70;
    parts.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="#1a1006"/>`);
    for (let i = 0; i < bandColors.length; i++) {
        const next = y + rand(r, 120, 180);
        const wob = rand(r, 12, 34);
        parts.push(`<path d="M0 ${y.toFixed(0)} C ${W * 0.3} ${(y - wob).toFixed(0)}, ${W * 0.7} ${(y + wob).toFixed(0)}, ${W} ${y.toFixed(0)} L ${W} ${H} L 0 ${H} Z" fill="${bandColors[i]}"/>`);
        y = next;
    }

    // Grain / speckle texture scattered through the soil.
    let speck = '';
    for (let i = 0; i < 260; i++) {
        const sx = rand(r, 0, W), sy = rand(r, 90, H), rr = rand(r, 0.6, 2.4);
        const shade = r() > 0.5 ? '#5a3f20' : '#120b05';
        speck += `<circle cx="${sx.toFixed(0)}" cy="${sy.toFixed(0)}" r="${rr.toFixed(1)}" fill="${shade}" opacity="${(0.12 + r() * 0.22).toFixed(2)}"/>`;
    }
    parts.push(`<g>${speck}</g>`);

    // Tunnels — curved bores carved through the soil, each lined with a soft
    // lit pathway so the colony reads as travelling along glowing channels.
    const tunnelCount = 3 + Math.floor(r() * 2);
    let tunnels = '', glow = '';
    for (let i = 0; i < tunnelCount; i++) {
        const startX = rand(r, 40, W - 40);
        const topY = rand(r, 110, 240);
        const c1x = startX + rand(r, -260, 260), c1y = rand(r, 320, 500);
        const c2x = rand(r, 60, W - 60), c2y = rand(r, 560, 760);
        const endX = rand(r, 60, W - 60), endY = rand(r, 820, 960);
        const d = `M${startX.toFixed(0)} ${topY.toFixed(0)} C ${c1x.toFixed(0)} ${c1y.toFixed(0)}, ${c2x.toFixed(0)} ${c2y.toFixed(0)}, ${endX.toFixed(0)} ${endY.toFixed(0)}`;
        glow += `<path d="${d}" fill="none" stroke="url(#tunnelGlow)" stroke-width="${rand(r, 46, 74).toFixed(0)}" stroke-linecap="round" opacity="${(0.16 + r() * 0.14).toFixed(2)}"/>`;
        tunnels += `<path d="${d}" fill="none" stroke="#0c0704" stroke-width="${rand(r, 26, 40).toFixed(0)}" stroke-linecap="round" opacity="0.55"/>`;
        tunnels += `<path d="${d}" fill="none" stroke="#3c2a16" stroke-width="${rand(r, 10, 18).toFixed(0)}" stroke-linecap="round" opacity="0.4"/>`;
    }
    parts.push(`<g>${tunnels}</g>`);

    // Roots — branching descents from the surface, tapering as they go.
    let roots = '';
    const rootCount = 4 + Math.floor(r() * 3);
    for (let i = 0; i < rootCount; i++) {
        let px = rand(r, 30, W - 30), py = rand(r, 60, 120);
        let width = rand(r, 7, 13);
        let path = `M${px.toFixed(0)} ${py.toFixed(0)}`;
        const segs = 4 + Math.floor(r() * 4);
        for (let s = 0; s < segs; s++) {
            const nx = px + rand(r, -70, 70);
            const ny = py + rand(r, 90, 150);
            path += ` Q ${(px + rand(r, -40, 40)).toFixed(0)} ${((py + ny) / 2).toFixed(0)}, ${nx.toFixed(0)} ${ny.toFixed(0)}`;
            px = nx; py = ny;
        }
        roots += `<path d="${path}" fill="none" stroke="#25160b" stroke-width="${width.toFixed(1)}" stroke-linecap="round" opacity="0.85"/>`;
        roots += `<path d="${path}" fill="none" stroke="#6b4a26" stroke-width="${(width * 0.4).toFixed(1)}" stroke-linecap="round" opacity="0.4"/>`;
        // A couple of fine offshoots.
        for (let k = 0; k < 2; k++) {
            const ox = px + rand(r, -120, 120), oy = py - rand(r, 40, 160);
            roots += `<path d="M${px.toFixed(0)} ${py.toFixed(0)} Q ${(px + ox) / 2} ${(py + oy) / 2}, ${ox.toFixed(0)} ${oy.toFixed(0)}" fill="none" stroke="#25160b" stroke-width="${rand(r, 2, 4).toFixed(1)}" stroke-linecap="round" opacity="0.6"/>`;
        }
    }
    parts.push(`<g>${roots}</g>`);

    // Stones — embedded pebbles with a lit top edge and a shadow underside.
    let stones = '';
    const stoneCount = 7 + Math.floor(r() * 6);
    for (let i = 0; i < stoneCount; i++) {
        const cx = rand(r, 40, W - 40), cy = rand(r, 220, 960);
        const rx = rand(r, 16, 46), ry = rx * rand(r, 0.6, 0.85);
        const rot = rand(r, -20, 20);
        stones += `<g transform="translate(${cx.toFixed(0)} ${cy.toFixed(0)}) rotate(${rot.toFixed(0)})">
            <ellipse cx="0" cy="4" rx="${(rx * 1.05).toFixed(0)}" ry="${ry.toFixed(0)}" fill="#0b0703" opacity="0.5"/>
            <ellipse cx="0" cy="0" rx="${rx.toFixed(0)}" ry="${ry.toFixed(0)}" fill="url(#stoneGrad)"/>
            <ellipse cx="${(-rx * 0.28).toFixed(0)}" cy="${(-ry * 0.34).toFixed(0)}" rx="${(rx * 0.42).toFixed(0)}" ry="${(ry * 0.34).toFixed(0)}" fill="#8a7150" opacity="0.35"/>
        </g>`;
    }
    parts.push(`<g>${stones}</g>`);

    // Soft light pools drawn last, over the pathways.
    parts.push(`<g>${glow}</g>`);

    return `
        <svg class="nymph-scene-env" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <defs>
                <radialGradient id="tunnelGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#c9a25a" stop-opacity="0.9"/>
                    <stop offset="60%" stop-color="#8a6a34" stop-opacity="0.2"/>
                    <stop offset="100%" stop-color="#8a6a34" stop-opacity="0"/>
                </radialGradient>
                <linearGradient id="stoneGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#6f5c44"/>
                    <stop offset="55%" stop-color="#4a3d2c"/>
                    <stop offset="100%" stop-color="#2b2318"/>
                </linearGradient>
            </defs>
            ${parts.join('\n')}
        </svg>`;
}

export class NymphScene {
    constructor({ mount, seed = 1, count = 5, renderCicada = null } = {}) {
        injectSceneStyles();
        this.mount = mount;
        this.seed = seed;
        this.renderCicada = renderCicada;
        this.actors = [];
        this.destroyed = false;
        this.rng = mulberry32((seed ^ 0x9E37A1) >>> 0);
        this.count = Math.max(1, Math.min(9, count));

        this.layer = document.createElement('div');
        this.layer.className = 'nymph-scene';
        this.layer.innerHTML = buildEnvironmentSVG(seed);

        this.disturb = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.disturb.setAttribute('class', 'nymph-scene-disturb');
        this.disturb.setAttribute('viewBox', '0 0 1000 1000');
        this.disturb.setAttribute('preserveAspectRatio', 'none');
        this.layer.appendChild(this.disturb);

        const surface = document.createElement('div');
        surface.className = 'nymph-scene-surface';
        this.layer.appendChild(surface);

        this.mount.appendChild(this.layer);

        this._reduced = document.documentElement.classList.contains('cicada-reduced-motion');
        for (let i = 0; i < this.count; i++) this._spawnActor(i);
    }

    // Drop a faint disturbed-soil mark at a scene point (0..1000 space).
    _disturbAt(nx, ny, scale = 1) {
        if (this.destroyed || this._reduced) return;
        const c = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        c.setAttribute('cx', nx.toFixed(1));
        c.setAttribute('cy', ny.toFixed(1));
        c.setAttribute('rx', (rand(this.rng, 5, 11) * scale).toFixed(1));
        c.setAttribute('ry', (rand(this.rng, 2, 4.5) * scale).toFixed(1));
        c.setAttribute('fill', this.rng() > 0.5 ? '#1b1108' : '#3a2814');
        c.setAttribute('opacity', '0.0');
        this.disturb.appendChild(c);
        requestAnimationFrame(() => c.setAttribute('opacity', (0.14 + this.rng() * 0.14).toFixed(2)));
        // Fade the trail back into the soil so it never accumulates.
        setTimeout(() => {
            c.style.transition = 'opacity 4s ease';
            c.setAttribute('opacity', '0');
            setTimeout(() => c.remove(), 4200);
        }, 2600 + this.rng() * 2000);
    }

    _actorScenePoint(actor) {
        // Approximate the actor's on-screen foot position in 0..1000 scene space.
        const lr = this.layer.getBoundingClientRect();
        const ar = actor.host.getBoundingClientRect();
        if (!lr.width || !lr.height) return { x: 500, y: 500 };
        const cx = ar.left + ar.width / 2 - lr.left;
        const cy = ar.top + ar.height * 0.72 - lr.top;
        return { x: (cx / lr.width) * 1000, y: (cy / lr.height) * 1000 };
    }

    _spawnActor(index) {
        if (this.destroyed) return;
        const r = mulberry32((this.seed * 2654435761 + index * 40503 + this._respawns(index)) >>> 0);
        // Distribute regions across the scene; keep them below the surface band.
        // (In the builder the upper stage is overlaid by the controls panel, so
        // patrol regions start lower; the export/standalone stage is unobscured.)
        const leftPct = rand(r, 8, 80);
        const topPct = rand(r, 48, 72);
        const sizePx = rand(r, 150, 240);

        const host = document.createElement('div');
        host.className = 'nymph-actor';
        host.style.left = `${leftPct.toFixed(1)}%`;
        host.style.top = `${topPct.toFixed(1)}%`;
        host.style.width = `${sizePx.toFixed(0)}px`;
        host.style.height = `${(sizePx * 1.3).toFixed(0)}px`;
        host.style.zIndex = String(3 + Math.floor(topPct / 10));
        this.layer.appendChild(host);

        // One shared character design; independent per-instance seed for its
        // subtle finish (leg fidget) variation.
        const nymphSeed = (this.seed + index * 131 + Math.floor(r() * 997)) % 3301 + 1;
        const nymph = new CicadaNymphGenerator({
            mount: host,
            instructions: { seed: nymphSeed, unit: '%', size: 96, idleWander: false, rarityTier: 'common' }
        });

        const actor = { index, host, nymph, rng: r, done: false, emerging: false };
        this.actors.push(actor);

        if (this._reduced) {
            // Static placement only; still fully legible.
            nymph.setWanderPos(rand(r, -40, 40), rand(r, -30, 30), rand(r, -30, 30));
            return;
        }
        // Independent start delay, then run this actor's route.
        actor.startTimer = setTimeout(() => this._runRoute(actor), rand(r, 200, 2600));
    }

    _respawnCounts = {};
    _respawns(index) {
        return (this._respawnCounts[index] || 0) * 7919;
    }

    // Build and walk an independent multi-waypoint route, with per-leg pauses
    // and speed variation, then emerge at the top boundary.
    async _runRoute(actor) {
        if (this.destroyed || actor.done) return;
        const r = actor.rng;
        const nymph = actor.nymph;
        nymph.setWanderPos(rand(r, -120, 120), rand(r, -90, 90), rand(r, -40, 40));

        const legs = 3 + Math.floor(r() * 4);
        const budgetMs = rand(r, 16000, 34000);
        const started = performance.now();

        try {
            for (let i = 0; i < legs; i++) {
                if (this.destroyed || actor.done) return;
                if (performance.now() - started > budgetMs) break;
                const tx = rand(r, -150, 150);
                const ty = rand(r, -110, 110);
                await nymph.walkTo(tx, ty, {
                    speed: rand(r, 0.018, 0.045),
                    tilt: rand(r, 1.6, 4.2),
                    bob: rand(r, 1.1, 2.4),
                    onStep: () => {
                        if (r() < 0.06) {
                            const p = this._actorScenePoint(actor);
                            this._disturbAt(p.x, p.y, rand(r, 0.7, 1.3));
                        }
                    }
                });
                if (this.destroyed || actor.done) return;
                await nymph.holdPause(rand(r, 400, 2400)); // brief, varied pause
            }
        } catch (_) { /* actor torn down mid-walk */ }

        if (!this.destroyed && !actor.done) this._emerge(actor);
    }

    // Move to the upper boundary and transition into the adult cicada.
    async _emerge(actor) {
        if (this.destroyed || actor.done || actor.emerging) return;
        actor.emerging = true;
        const r = actor.rng;
        const nymph = actor.nymph;

        try {
            // Climb toward the top of the local region, facing up.
            await nymph.walkTo(rand(r, -30, 30), -120, { speed: rand(r, 0.03, 0.05), tilt: 1.2, bob: 2.2 });
        } catch (_) {}
        if (this.destroyed) return;

        // Drift the actor up to the surface band as it prepares to emerge.
        actor.host.classList.add('is-emerging');
        const curTop = parseFloat(actor.host.style.top) || 40;
        // A modest climb keeps the freshly emerged adult visible in the scene
        // band; the lift-off translate then carries it up and out of frame.
        actor.host.style.top = `${Math.max(8, curTop - rand(r, 6, 14)).toFixed(1)}%`;

        // Swap the nymph for the adult — the next visual state already supported
        // by the engine — then let it take flight and leave the scene upward.
        setTimeout(() => {
            if (this.destroyed) return;
            this._transitionToAdult(actor);
        }, 1400);
    }

    _transitionToAdult(actor) {
        if (this.destroyed) return;
        const r = actor.rng;
        const adultSeed = (this.seed + actor.index * 271 + 7) % 3301 + 1;

        // Fade the shed nymph out.
        actor.nymph.host.style.transition = 'opacity 1s ease';
        actor.nymph.host.style.opacity = '0';

        let adult = null;
        if (typeof this.renderCicada === 'function') {
            const adultMount = document.createElement('div');
            adultMount.style.cssText = 'position:absolute;inset:0;opacity:0;transition:opacity 1.2s ease;';
            actor.host.appendChild(adultMount);
            try {
                adult = this.renderCicada({
                    seed: adultSeed, mount: adultMount, clearMount: true, pageStyles: false,
                    interactive: false, enableAudio: false, keyboard: false, accessibleLabel: false,
                    // No tree-bark backdrop: the adult emerges against the soil,
                    // not its above-ground tree, until it flies out of the scene.
                    instructionOverrides: { unit: '%', size: 96, idleWander: true, barkBackdrop: 'none' }
                });
            } catch (_) { adult = null; }
            requestAnimationFrame(() => { adultMount.style.opacity = '1'; });
            actor.adult = adult;
        }

        // Wing-spreading beat, then lift off and climb out of the top boundary.
        setTimeout(() => {
            if (this.destroyed) return;
            try { adult?.cicada?.setFlying?.(true); } catch (_) {}
            actor.host.style.transition = 'transform 3.6s cubic-bezier(.4,0,.2,1), opacity 2.6s ease';
            actor.host.style.transform = 'translateY(-140%) scale(1.04)';
            actor.host.style.opacity = '0';
        }, 900);

        // Recycle: remove this actor and spawn a fresh nymph to keep the colony
        // populated and the scene alive.
        setTimeout(() => {
            if (this.destroyed) return;
            actor.done = true;
            try { actor.adult?.destroy?.(); } catch (_) {}
            try { actor.nymph.destroy(); } catch (_) {}
            actor.host.remove();
            this.actors = this.actors.filter(a => a !== actor);
            this._respawnCounts[actor.index] = (this._respawnCounts[actor.index] || 0) + 1;
            this._spawnActor(actor.index);
        }, 4200);
    }

    destroy() {
        this.destroyed = true;
        for (const actor of this.actors) {
            if (actor.startTimer) clearTimeout(actor.startTimer);
            try { actor.adult?.destroy?.(); } catch (_) {}
            try { actor.nymph.destroy(); } catch (_) {}
        }
        this.actors = [];
        this.layer?.remove();
    }
}
