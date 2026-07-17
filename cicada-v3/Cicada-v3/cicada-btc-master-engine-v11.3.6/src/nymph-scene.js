// Subterranean nymph scene. The world is a solid square of layered earth —
// soil strata, roots, stones — with trees rising from the surface. Nymphs DIG:
// every tunnel on screen is a bore some nymph excavated, drawn behind it as
// it goes. Stage 1: the nymph digs from root to root, feeding on sap at each
// joint. Stage 2: it digs a rising shaft to its tree, breaks the surface,
// climbs the bark to an exclusive perch, and moults in stages into the actual
// adult its seed renders — which hardens, expands its wings, and flies off,
// leaving the exuvia clinging to the bark.
import { CicadaNymphGenerator } from './cicada-nymph-renderer.js?v=11.3.8-molt.10';
import { mulberry32, clamp01, lerp } from './utils.js?v=11.3.5-nymph.2';
import { SHELL_PRESETS, EYE_PRESETS, CICADA_COLOR_PRESETS } from './config.js?v=11.3.8-molt.10';
import { getRenderInstructionsForSeed } from './cicada-traits.js?v=11.3.5-nymph.2';

// Mix a #rrggbb colour toward a pale ivory — teneral (freshly moulted) insects
// carry washed-out versions of their final colours until the cuticle hardens.
function paleMix(hex, t) {
    const n = parseInt(String(hex).replace('#', ''), 16);
    if (Number.isNaN(n)) return hex;
    const mix = (c, w) => Math.round(c + (w - c) * t);
    const r = mix((n >> 16) & 255, 245), g = mix((n >> 8) & 255, 242), b = mix(n & 255, 232);
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

const SCENE_STYLE_ID = 'nymph-scene-style';
const rand = (r, lo, hi) => lo + r() * (hi - lo);
const normalizeAdultSeed = s => {
    const n = Math.floor(Number(s) || 1);
    return Math.max(1, Math.min(3301, n));
};

function injectSceneStyles() {
    if (document.getElementById(SCENE_STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = SCENE_STYLE_ID;
    style.textContent = `
        .nymph-scene{position:absolute;inset:0;overflow:hidden;background:
            radial-gradient(120% 80% at 50% -10%, #3a2a17 0%, #26190d 26%, #180f07 55%, #0d0805 100%);}
        .nymph-scene-env,.nymph-scene-disturb,.nymph-scene-carve{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;}
        .nymph-scene-env{z-index:0;}
        .nymph-scene-carve{z-index:1;}
        .nymph-scene-disturb{z-index:2;}
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

    // No pre-carved tunnels: the world is a solid block of earth. Nymphs dig
    // their own bores as they travel, so every tunnel on screen is a trail
    // some nymph actually excavated.

    // Roots — branching descents from the surface, tapering as they go. Their
    // sampled joints double as FOOD NODES: cicada nymphs feed on root xylem,
    // and stage 1 of a nymph's life here is digging from root to root.
    const foodNodes = [];
    let roots = '';
    const rootCount = 5 + Math.floor(r() * 3);
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
            // Joints deep enough to dig to become feeding spots.
            if (ny > 380 && ny < 930 && nx > 60 && nx < W - 60) foodNodes.push({ x: nx, y: ny });
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

    // Tree trunks rise from the surface, spread across the block, giving
    // emerging nymphs something to dig up to, climb, and moult on. Each trunk
    // is broad and tall enough to host several moulting spots, returned as
    // slots at varying heights and lateral positions so climbers never share
    // a perch.
    const trunkSlots = [];
    let trunksMarkup = '';
    const trunkCount = 2 + (r() < 0.5 ? 1 : 0);
    for (let ti = 0; ti < trunkCount; ti++) {
        const tx = Math.max(90, Math.min(W - 90, (ti + 0.5) * W / trunkCount + rand(r, -80, 80)));
        const half = rand(r, 46, 62);
        const baseY = 96;   // just below the surface light band
        const footY = rand(r, 215, 265);
        trunksMarkup += `<g>
            <path d="M${(tx - half).toFixed(0)} 0 L${(tx - half * 0.86).toFixed(0)} ${baseY} C${(tx - half * 1.5).toFixed(0)} ${footY}, ${(tx - half * 1.9).toFixed(0)} ${(footY + 16).toFixed(0)}, ${(tx - half * 2.3).toFixed(0)} ${(footY + 22).toFixed(0)} L${(tx + half * 2.3).toFixed(0)} ${(footY + 22).toFixed(0)} C${(tx + half * 1.9).toFixed(0)} ${(footY + 16).toFixed(0)}, ${(tx + half * 1.5).toFixed(0)} ${footY}, ${(tx + half * 0.86).toFixed(0)} ${baseY} L${(tx + half).toFixed(0)} 0 Z"
                fill="url(#trunkGrad)" stroke="#160d06" stroke-width="2"/>
            <path d="M${(tx - half * 0.5).toFixed(0)} 4 C${(tx - half * 0.42).toFixed(0)} ${(footY * 0.5).toFixed(0)}, ${(tx - half * 0.58).toFixed(0)} ${(footY * 0.8).toFixed(0)}, ${(tx - half * 0.62).toFixed(0)} ${(footY + 10).toFixed(0)}
                     M${(tx + half * 0.24).toFixed(0)} 2 C${(tx + half * 0.3).toFixed(0)} ${(footY * 0.45).toFixed(0)}, ${(tx + half * 0.2).toFixed(0)} ${(footY * 0.82).toFixed(0)}, ${(tx + half * 0.3).toFixed(0)} ${(footY + 8).toFixed(0)}"
                fill="none" stroke="#1c1109" stroke-width="2.4" opacity="0.55"/>
            <path d="M${tx.toFixed(0)} 6 C${(tx - half * 0.1).toFixed(0)} ${(footY * 0.5).toFixed(0)}, ${(tx + half * 0.08).toFixed(0)} ${(footY * 0.8).toFixed(0)}, ${tx.toFixed(0)} ${(footY + 6).toFixed(0)}"
                fill="none" stroke="#6b4c2a" stroke-width="1.8" opacity="0.4"/>
        </g>`;
        // Moulting slots stacked up the trunk face at clearly different
        // heights, alternating sides, so several nymphs can emerge on one
        // tree without ever touching (pairwise ~85+ scene units apart).
        const slots = [];
        for (let k = 0; k < 3; k++) {
            slots.push({
                x: tx + (k % 2 ? -1 : 1) * half * 0.5 + rand(r, -6, 6),
                y: 66 + k * 68 + rand(r, -8, 8)
            });
        }
        trunkSlots.push(slots);
    }
    parts.push(trunksMarkup);

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

    const markup = `
        <svg class="nymph-scene-env" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">
            <defs>
                <radialGradient id="tunnelGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#c9a25a" stop-opacity="0.9"/>
                    <stop offset="60%" stop-color="#8a6a34" stop-opacity="0.2"/>
                    <stop offset="100%" stop-color="#8a6a34" stop-opacity="0"/>
                </radialGradient>
                <linearGradient id="trunkGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stop-color="#241509"/>
                    <stop offset="30%" stop-color="#4a2f17"/>
                    <stop offset="55%" stop-color="#5d3e20"/>
                    <stop offset="78%" stop-color="#3a2513"/>
                    <stop offset="100%" stop-color="#1c1008"/>
                </linearGradient>
                <linearGradient id="stoneGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#6f5c44"/>
                    <stop offset="55%" stop-color="#4a3d2c"/>
                    <stop offset="100%" stop-color="#2b2318"/>
                </linearGradient>
            </defs>
            ${parts.join('\n')}
        </svg>`;
    return { markup, trunkSlots, foodNodes };
}

export class NymphScene {
    constructor({ mount, seed = 1, count = 1, adultSeeds = null, renderCicada = null } = {}) {
        // adultSeeds pins which adults emerge. A single-nymph scene defaults to
        // the scene seed itself: you watch YOUR cicada come up.
        this.adultSeeds = Array.isArray(adultSeeds) && adultSeeds.length ? adultSeeds
            : (Math.max(1, Math.min(9, count)) === 1 ? [seed] : null);
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
        const env = buildEnvironmentSVG(seed);
        this.layer.innerHTML = env.markup;
        this.foodNodes = env.foodNodes || [];
        // Per-trunk moulting slots; owner tracking keeps one climber per slot.
        this.trunkSlots = (env.trunkSlots || []).map(slots => slots.map(s => ({ ...s, owner: null })));

        // Carve layer: the tunnels nymphs excavate as they dig. Each actor
        // extends its own bore paths here; the network is the history of every
        // dig the colony has made.
        this.carve = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.carve.setAttribute('class', 'nymph-scene-carve');
        this.carve.setAttribute('viewBox', '0 0 1000 1000');
        this.carve.setAttribute('preserveAspectRatio', 'none');
        this.layer.appendChild(this.carve);

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

    // Place an actor's host so its body centre sits on a tunnel point
    // (scene 0..1000 space maps directly to layer percentages).
    _placeActorAt(actor, point) {
        actor.pos = { x: point.x, y: point.y };
        // Sub-pixel precision: rebases must be visually seamless, and a 0.1%
        // grid (~1.5px on a wide stage) reads as a micro-snap every chunk.
        actor.host.style.left = `${(point.x / 10).toFixed(3)}%`;
        actor.host.style.top = `${(point.y / 10).toFixed(3)}%`;
        actor.host.style.zIndex = String(3 + Math.max(0, Math.floor(point.y / 100)));
    }

    // Digging: extend the actor's excavated bore to a new point. Three strokes
    // share one polyline — dark bore, lighter packed-earth lining, and a soft
    // glow so dug pathways read like the old lit tunnels. Carving stops at the
    // surface band (the trunk climb is above ground, not a dig).
    _carveTo(actor, pt) {
        if (pt.y < 235) return;
        if (!actor.carve) {
            const mk = (stroke, width, opacity) => {
                const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                p.setAttribute('fill', 'none');
                p.setAttribute('stroke', stroke);
                p.setAttribute('stroke-width', width);
                p.setAttribute('stroke-opacity', opacity);
                p.setAttribute('stroke-linecap', 'round');
                p.setAttribute('stroke-linejoin', 'round');
                this.carve.appendChild(p);
                return p;
            };
            actor.carve = {
                d: `M${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`,
                els: [
                    mk('url(#tunnelGlow)', rand(actor.rng, 48, 64).toFixed(0), '0.2'),
                    mk('#0c0704', rand(actor.rng, 26, 34).toFixed(0), '0.55'),
                    mk('#3c2a16', rand(actor.rng, 11, 15).toFixed(0), '0.4')
                ]
            };
        }
        actor.carve.d += ` L${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
        for (const el of actor.carve.els) el.setAttribute('d', actor.carve.d);
    }

    // Conversion factors: one scene unit (0..1000 space) expressed in the
    // nymph's local viewBox units (its square shell fits the 900-tall box).
    // The scene is stretched to the layer, so horizontal and vertical scene
    // units differ in on-screen size — the conversion MUST be anisotropic, or
    // the legs walk the wrong vertical distance and every rebase snaps the
    // body back onto course.
    _sceneToLocal(actor) {
        const rect = this.layer.getBoundingClientRect();
        const layerW = rect.width || 800;
        const layerH = rect.height || layerW;
        const sizePx = parseFloat(actor.host.style.width) || 190;
        const pxPerLocal = (0.96 * sizePx) / 900;   // uniform: the shell is square
        return {
            kx: (layerW / 1000) / pxPerLocal,
            ky: (layerH / 1000) / pxPerLocal
        };
    }

    // Walk the actor's legs the ENTIRE way to a scene point. The journey is
    // covered stride-chunk by stride-chunk inside the nymph's local space;
    // between chunks the host is rebased by exactly the distance walked, in
    // the same frame the local offset resets — visually seamless, so every
    // bit of displacement on screen comes from the gait itself.
    async _walkActorTo(actor, target, o = {}) {
        const nymph = actor.nymph;
        while (!this.destroyed && !actor.done) {
            // Recomputed every chunk so a window resize mid-journey can never
            // desynchronise the gait from the rebase.
            const { kx, ky } = this._sceneToLocal(actor);
            if (!Number.isFinite(kx) || !Number.isFinite(ky) || kx <= 0 || ky <= 0) break;
            const cur = actor.pos;
            const dx = target.x - cur.x, dy = target.y - cur.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 2) break;
            const chunkScene = Math.min(dist, 200 / Math.max(kx, ky));
            const fx = dx / dist * chunkScene, fy = dy / dist * chunkScene;
            const w = nymph.getWanderPos();
            // The local leg target uses per-axis conversion, so the distance
            // the legs cover on screen equals the rebase exactly on both axes.
            await nymph.walkTo(w.x + fx * kx, w.y + fy * ky, o);
            if (this.destroyed || actor.done) break;
            const heading = nymph.getWanderPos().heading;
            const next = { x: cur.x + fx, y: cur.y + fy };
            this._placeActorAt(actor, next);
            nymph.setWanderPos(0, 0, heading);
            // Underground movement excavates: the bore extends behind the
            // nymph as it digs, with loosened soil at the dig face.
            this._carveTo(actor, next);
            if (next.y >= 235 && actor.rng() < 0.5) {
                this._disturbAt(next.x + rand(actor.rng, -12, 12), next.y + rand(actor.rng, -8, 8), rand(actor.rng, 0.7, 1.2));
            }
        }
    }

    // Personal-space steering: nudge a target point away from every other
    // actor so the colony works around one another instead of overlapping.
    _separate(actor, point, sep = 95) {
        let x = point.x, y = point.y;
        for (const other of this.actors) {
            if (other === actor || !other.pos || other.done) continue;
            const dx = x - other.pos.x, dy = y - other.pos.y;
            const d = Math.hypot(dx, dy);
            if (d >= sep) continue;
            if (d < 0.001) { x += sep * 0.7; continue; }
            const push = (sep - d) / d;
            x += dx * push;
            y += dy * push;
        }
        return { x: Math.max(30, Math.min(970, x)), y: Math.max(60, Math.min(950, y)) };
    }

    // Claim an exclusive moulting slot on the actor's trunk. Every climber gets
    // its own spot/height; when the trunk is full a fresh perch is derived at a
    // clearly different height so emergences never stack.
    _claimTrunkSlot(actor) {
        const slots = (this.trunkSlots || [])[actor.trunkIdx];
        if (!slots || !slots.length) return null;
        const free = slots.filter(s => !s.owner);
        let slot = free.length ? free[Math.floor(actor.rng() * free.length)] : null;
        if (!slot) {
            const taken = slots.map(s => s.y);
            let y = 70 + actor.rng() * 160;
            for (let tries = 0; tries < 8 && taken.some(t => Math.abs(t - y) < 60); tries++) y = 60 + actor.rng() * 190;
            slot = { x: slots[0].x + (actor.rng() - 0.5) * 44, y, owner: null };
            slots.push(slot);
        }
        slot.owner = actor;
        return slot;
    }

    _releaseTrunkSlot(actor) {
        for (const slots of this.trunkSlots || []) {
            for (const s of slots) if (s.owner === actor) s.owner = null;
        }
    }

    _spawnActor(index) {
        if (this.destroyed) return;
        const r = mulberry32((this.seed * 2654435761 + index * 40503 + this._respawns(index)) >>> 0);
        const sizePx = rand(r, 150, 240);

        // Spawn deep in the earth block, clear of every other actor's personal
        // space. There are no pre-made tunnels — this nymph will dig its own.
        let spawn = { x: rand(r, 120, 880), y: rand(r, 500, 900) };
        for (let tries = 0; tries < 12; tries++) {
            const cand = { x: rand(r, 120, 880), y: rand(r, 480, 910) };
            const clear = this.actors.every(a => !a.pos || Math.hypot(cand.x - a.pos.x, cand.y - a.pos.y) >= 95);
            if (clear) { spawn = cand; break; }
        }
        // Each actor is assigned the trunk nearest its spawn for its eventual
        // dig to the surface (rebalanced by claim availability at emergence).
        const trunkIdx = (this.trunkSlots || []).length
            ? this.trunkSlots.reduce((best, slots, i) =>
                Math.abs(slots[0].x - spawn.x) < Math.abs(this.trunkSlots[best][0].x - spawn.x) ? i : best, 0)
            : -1;

        const host = document.createElement('div');
        host.className = 'nymph-actor';
        // New arrivals surface gradually out of the dark rather than popping in.
        host.style.opacity = '0';
        requestAnimationFrame(() => requestAnimationFrame(() => { host.style.opacity = '1'; }));
        host.style.width = `${sizePx.toFixed(0)}px`;
        host.style.height = `${(sizePx * 1.3).toFixed(0)}px`;
        // Centre the host on its tunnel point.
        host.style.marginLeft = `${(-sizePx / 2).toFixed(0)}px`;
        host.style.marginTop = `${(-sizePx * 0.65).toFixed(0)}px`;
        this.layer.appendChild(host);

        // One shared character design; independent per-instance seed for its
        // subtle finish (leg fidget) variation.
        const nymphSeed = (this.seed + index * 131 + Math.floor(r() * 997)) % 3301 + 1;
        const nymph = new CicadaNymphGenerator({
            mount: host,
            instructions: { seed: nymphSeed, unit: '%', size: 96, idleWander: false, rarityTier: 'common' }
        });

        // The adult this nymph will become is fixed at spawn, so the moult can
        // preview its true colours through the shell cracks before it emerges.
        // Pinned adult seeds (single-nymph and gallery views) take precedence.
        const adultSeed = this.adultSeeds
            ? normalizeAdultSeed(this.adultSeeds[index % this.adultSeeds.length])
            : (this.seed + index * 271 + 7) % 3301 + 1;
        const actor = { index, host, nymph, rng: r, done: false, emerging: false, trunkIdx, adultSeed };
        this.actors.push(actor);
        this._placeActorAt(actor, spawn);
        // The bore starts where the nymph hatched.
        this._carveTo(actor, spawn);

        if (this._reduced) {
            // Static placement only; still fully legible.
            nymph.setWanderPos(rand(r, -40, 40), rand(r, -30, 30), rand(r, -30, 30));
            return;
        }
        // Set the initial local offset now, while the actor is still invisible,
        // so the route later starts from where the nymph faded in.
        nymph.setWanderPos(rand(r, -30, 30), rand(r, -20, 20), rand(r, -40, 40));
        // Independent start delay, then run this actor's route.
        actor.startTimer = setTimeout(() => this._runRoute(actor), rand(r, 200, 2600));
    }

    _respawnCounts = {};
    _respawns(index) {
        return (this._respawnCounts[index] || 0) * 7919;
    }

    // STAGE 1 — foraging. The nymph digs through the solid earth from root to
    // root, carving its tunnel as it goes, and pauses at each root joint to
    // feed on the sap. When its timed underground life is spent, stage 2
    // begins: the dig up to the tree.
    async _runRoute(actor) {
        if (this.destroyed || actor.done) return;
        const r = actor.rng;
        const nymph = actor.nymph;

        const budgetMs = rand(r, 16000, 34000);
        const started = performance.now();
        let lastFood = null;

        try {
            while (!this.destroyed && !actor.done) {
                if (performance.now() - started > budgetMs) break;
                // Pick the next feeding spot: sample a few root joints and take
                // the nearest fresh one, so dig legs stay purposeful but varied.
                const nodes = this.foodNodes;
                let target;
                if (nodes && nodes.length) {
                    let best = null, bestD = Infinity;
                    for (let s = 0; s < 4; s++) {
                        const cand = nodes[Math.floor(r() * nodes.length)];
                        if (cand === lastFood) continue;
                        const d = Math.hypot(cand.x - actor.pos.x, cand.y - actor.pos.y);
                        if (d > 40 && d < bestD) { best = cand; bestD = d; }
                    }
                    target = best || nodes[Math.floor(r() * nodes.length)];
                    lastFood = target;
                } else {
                    target = { x: rand(r, 120, 880), y: rand(r, 420, 900) };
                }
                // Steer around any nearby colony member, then DIG there —
                // the bore extends behind the nymph the whole way.
                const to = this._separate(actor, target);
                await this._walkActorTo(actor, to, {
                    speed: rand(r, 0.035, 0.06),
                    tilt: rand(r, 1.6, 4.2),
                    bob: rand(r, 1.1, 2.4)
                });
                if (this.destroyed || actor.done) return;
                // Feed at the root: a longer, hungrier pause with soil settling
                // around the feeding site.
                for (let k = 0; k < 2 + Math.floor(r() * 3); k++) {
                    this._disturbAt(actor.pos.x + rand(r, -16, 16), actor.pos.y + rand(r, -10, 10), rand(r, 0.6, 1.1));
                }
                await nymph.holdPause(rand(r, 1600, 3600));
            }
        } catch (_) { /* actor torn down mid-walk */ }

        if (!this.destroyed && !actor.done) this._emerge(actor);
    }

    // Scene-relative timeout that self-cancels if the scene is torn down.
    _after(ms, fn) {
        const id = setTimeout(() => { if (!this.destroyed) fn(); }, ms);
        (this._timers ||= new Set()).add(id);
        return id;
    }

    // STAGE 2 — the dig up, then ecdysis. The nymph excavates a rising shaft
    // from wherever its foraging ended to the base of its tree, breaks the
    // surface, climbs the bark to its claimed perch, grips head-up, and
    // moults: the dorsal cuticle splits, the adult pulls free of the shell
    // stage by stage, its crumpled wings slowly expand and harden, and it
    // flies off — leaving the translucent exuvia still clinging to the bark.
    async _emerge(actor) {
        if (this.destroyed || actor.done || actor.emerging) return;
        actor.emerging = true;
        const r = actor.rng;
        const nymph = actor.nymph;

        actor.host.classList.add('is-emerging');
        const slot = this._claimTrunkSlot(actor);
        try {
            if (slot) {
                // Dig a rising shaft in two slanting pulls: first angling
                // toward the tree at mid depth, then straight up under the
                // trunk to break the surface at its foot.
                const mid = {
                    x: actor.pos.x + (slot.x - actor.pos.x) * rand(r, 0.55, 0.75),
                    y: Math.max(300, actor.pos.y * rand(r, 0.5, 0.65))
                };
                await this._walkActorTo(actor, this._separate(actor, mid), { speed: 0.04, tilt: 1.8, bob: 1.8 });
                if (this.destroyed || actor.done) return;
                await nymph.holdPause(rand(r, 300, 900));
                await this._walkActorTo(actor, { x: slot.x, y: 250 }, { speed: 0.035, tilt: 1.2, bob: 1.8 });
                if (this.destroyed || actor.done) return;
                // Break out at the trunk base and climb the bark to the perch
                // (above ground now — walking, not digging).
                await this._walkActorTo(actor, { x: slot.x, y: slot.y + 70 }, { speed: 0.04, tilt: 1.2, bob: 1.6, maxTurn: 160 });
                if (this.destroyed || actor.done) return;
                await this._walkActorTo(actor, slot, { speed: 0.028, tilt: 0.8, bob: 1.4, maxTurn: 160 });
            } else {
                // No tree available: dig straight up and moult at the surface.
                await this._walkActorTo(actor, { x: actor.pos.x, y: 250 }, { speed: 0.035, tilt: 1.2, bob: 1.8 });
            }
            // The final pull was straight up, so the gait ends at local origin
            // already facing up — no settle snap needed.
        } catch (_) {}
        if (this.destroyed || actor.done) return;

        // 3. Grip pause, then the staged moult: the dorsal cuticle cracks, the
        // shell backs part in two visible stages — each revealing more of the
        // pale teneral adult beneath — before the adult pulls free.
        await nymph.holdPause(rand(r, 1100, 1900));
        if (this.destroyed || actor.done) return;
        this._applyTeneralPalette(actor);
        nymph.beginMolt();                            // hairline crack
        await nymph.holdPause(rand(r, 1500, 2100));
        if (this.destroyed || actor.done) return;
        nymph.setMoltStage(1);                        // shell parts: first glimpse
        await nymph.holdPause(rand(r, 1700, 2300));
        if (this.destroyed || actor.done) return;
        nymph.setMoltStage(2);                        // wide open: dorsum exposed
        await nymph.holdPause(rand(r, 1400, 2000));
        if (this.destroyed || actor.done) return;
        nymph.setMoltStage(3);                        // head pushes out of the split
        await nymph.holdPause(rand(r, 2300, 3200));
        if (this.destroyed || actor.done) return;
        nymph.setMoltStage(4);                        // thorax + wing buds work free
        await nymph.holdPause(rand(r, 2300, 3200));
        if (this.destroyed || actor.done) return;
        nymph.setMoltStage(5);                        // fully out, above the shell
        await nymph.holdPause(rand(r, 1300, 1900));
        if (this.destroyed || actor.done) return;
        nymph.toExuvia();                             // the vacated shell empties
        await nymph.holdPause(rand(r, 900, 1500));
        if (this.destroyed || actor.done) return;
        this._moltReveal(actor);
    }

    // Look up the real traits of the adult this actor will emerge as, and tint
    // the teneral layer with washed-out versions of its true colours: shell
    // preset for the body, eye preset for the eye spots, and the seed's neon
    // accent as the glow lining the crack. The pale mix hardens into the full
    // palette when the actual adult renders.
    _applyTeneralPalette(actor) {
        let inst = null;
        try { inst = getRenderInstructionsForSeed(actor.adultSeed); } catch (_) { return; }
        if (!inst) return;
        const shell = SHELL_PRESETS[inst.shellColor] || SHELL_PRESETS.emerald;
        const eye = EYE_PRESETS[inst.eyeColor] || EYE_PRESETS.crimson;
        const glow = CICADA_COLOR_PRESETS[inst.color] || '#9fe3c8';
        actor.nymph.setTeneralColors({
            light: paleMix(shell.accent, 0.38),
            mid: paleMix(shell.light, 0.2),
            dark: paleMix(shell.dark, 0.08),
            edge: shell.dark,
            ridge: shell.accent,
            eye: eye.fill,
            glow
        });
    }

    // Crossfade + hardening + flight. By the time this runs the teneral has
    // already climbed fully out of the shell (moult stages 3-5); the real
    // adult now materialises exactly where the teneral stands, above the
    // vacated exuvia.
    _moltReveal(actor) {
        if (this.destroyed || actor.done) return;
        const r = actor.rng;
        const adultSeed = actor.adultSeed;

        let adult = null, adultMount = null;
        if (typeof this.renderCicada === 'function') {
            adultMount = document.createElement('div');
            // The adult rides its own wrapper so lift-off leaves the host (and
            // the clinging exuvia) behind on the trunk. It MORPHS from the
            // teneral: same position, teneral size, washed-out colours — then
            // slowly grows and darkens into its final form in place.
            // Same position AND same size as the fully-emerged teneral — the
            // handoff must be invisible; only the colours harden afterwards.
            adultMount.style.cssText = 'position:absolute;inset:0;opacity:0;' +
                'transform:translateY(-23%) scale(0.94);' +
                'filter:brightness(1.5) saturate(0.45);will-change:transform,opacity,filter;' +
                'transition:opacity 1.4s ease;';
            actor.host.appendChild(adultMount);
            try {
                adult = this.renderCicada({
                    seed: adultSeed, mount: adultMount, clearMount: true, pageStyles: false,
                    interactive: false, enableAudio: false, keyboard: false, accessibleLabel: false,
                    // No tree-bark backdrop inside the scene; the trunk is drawn
                    // by the environment itself.
                    instructionOverrides: { unit: '%', size: 96, idleWander: false, barkBackdrop: 'none' }
                });
            } catch (_) { adult = null; }
            actor.adult = adult;

            // Teneral state: wings crumpled small and milky until they expand.
            const wingBase = {
                '#left-wing': 'rotate(-3deg) scaleX(0.92)',
                '#right-wing': 'rotate(3deg) scaleX(0.92)',
                '#left-hindwing': 'rotate(-6deg) scaleX(0.88)',
                '#right-hindwing': 'rotate(6deg) scaleX(0.88)'
            };
            const wings = [];
            for (const [sel, base] of Object.entries(wingBase)) {
                const el = adult?.cicada?.root?.querySelector(sel);
                if (!el) continue;
                el.style.transform = `${base} scale(0.16)`;
                el.style.opacity = '0.35';
                wings.push([el, base]);
            }

            // Morph, phase 1 — identity swap at matched size and paleness: the
            // teneral fades out while the adult (teneral-sized, washed-out)
            // fades in over the exact same spot. Nothing appears to change but
            // the drawing hand.
            requestAnimationFrame(() => {
                adultMount.style.opacity = '1';
                actor.nymph.setAdultOut();
            });

            // Morph, phase 2 — no growth: only the colours harden from
            // teneral-pale into the seed's true palette, with the faintest
            // hardening swell (0.94 -> 1.0), slowly, in place.
            this._after(1600, () => {
                if (actor.done) return;
                adultMount.style.transition = 'transform 4.4s cubic-bezier(.3,0,.3,1), filter 4.4s ease, opacity 1.4s ease';
                adultMount.style.transform = 'translateY(-23%) scale(1)';
                adultMount.style.filter = '';
            });

            // Wing expansion — slow unfurl to full span once the body has
            // mostly hardened.
            this._after(5400, () => {
                if (actor.done) return;
                for (const [el, base] of wings) {
                    el.style.transition = 'transform 3.8s cubic-bezier(.3,0,.25,1), opacity 3.8s ease';
                    el.style.transform = base;
                    el.style.opacity = '';
                }
            });
        }

        // Stage 5-6: harden, then take flight — the adult alone lifts out of the
        // scene while the exuvia stays gripping the trunk.
        this._after(11800, () => {
            if (actor.done) return;
            try { adult?.cicada?.setFlying?.(true); } catch (_) {}
            if (adultMount) {
                adultMount.style.transition = 'transform 3.8s cubic-bezier(.4,0,.2,1), opacity 2.8s ease .8s';
                adultMount.style.transform = 'translateY(-170%) scale(1.05)';
                adultMount.style.opacity = '0';
            }
        });

        // The exuvia lingers on the bark, then weathers away before the actor
        // recycles into a fresh nymph deep in the tunnels.
        this._after(16500, () => {
            actor.nymph.host.style.transition = 'opacity 4s ease';
            actor.nymph.host.style.opacity = '0';
        });
        this._after(21000, () => {
            actor.done = true;
            this._releaseTrunkSlot(actor);
            // Old bores stay as the colony's tunnel network, but cap the layer
            // so it can't grow without bound over a long-running scene.
            while (this.carve.childElementCount > 45) this.carve.firstElementChild?.remove();
            try { actor.adult?.destroy?.(); } catch (_) {}
            try { actor.nymph.destroy(); } catch (_) {}
            actor.host.remove();
            this.actors = this.actors.filter(a => a !== actor);
            this._respawnCounts[actor.index] = (this._respawnCounts[actor.index] || 0) + 1;
            this._spawnActor(actor.index);
        });
    }

    destroy() {
        this.destroyed = true;
        for (const id of this._timers || []) clearTimeout(id);
        this._timers?.clear();
        for (const actor of this.actors) {
            if (actor.startTimer) clearTimeout(actor.startTimer);
            try { actor.adult?.destroy?.(); } catch (_) {}
            try { actor.nymph.destroy(); } catch (_) {}
        }
        this.actors = [];
        this.layer?.remove();
    }
}
