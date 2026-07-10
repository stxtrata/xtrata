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
    // Each tunnel's curve is also sampled into a polyline the scene hands to
    // its actors, so nymph routes genuinely follow the lit pathways.
    const tunnelCount = 3 + Math.floor(r() * 2);
    const tunnelPaths = [];
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
        // Sample the cubic bezier into a polyline (index 0 = top / surface end).
        const pts = [];
        for (let s = 0; s <= 24; s++) {
            const t = s / 24, u = 1 - t;
            pts.push({
                x: u * u * u * startX + 3 * u * u * t * c1x + 3 * u * t * t * c2x + t * t * t * endX,
                y: u * u * u * topY + 3 * u * u * t * c1y + 3 * u * t * t * c2y + t * t * t * endY
            });
        }
        tunnelPaths.push(pts);
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

    // Tree trunks — one rises from the surface at each tunnel's top end, giving
    // emerging nymphs something to climb and moult on. Trunk anchor points are
    // returned so the scene can route climbers onto the bark.
    const trunkAnchors = [];
    let trunksMarkup = '';
    for (const pts of tunnelPaths) {
        const tx = Math.max(50, Math.min(W - 50, pts[0].x));
        const half = rand(r, 26, 36);
        const baseY = 96;   // just below the surface light band
        const footY = rand(r, 168, 200);
        trunksMarkup += `<g>
            <path d="M${(tx - half).toFixed(0)} 0 L${(tx - half * 0.86).toFixed(0)} ${baseY} C${(tx - half * 1.5).toFixed(0)} ${footY}, ${(tx - half * 1.9).toFixed(0)} ${(footY + 16).toFixed(0)}, ${(tx - half * 2.3).toFixed(0)} ${(footY + 22).toFixed(0)} L${(tx + half * 2.3).toFixed(0)} ${(footY + 22).toFixed(0)} C${(tx + half * 1.9).toFixed(0)} ${(footY + 16).toFixed(0)}, ${(tx + half * 1.5).toFixed(0)} ${footY}, ${(tx + half * 0.86).toFixed(0)} ${baseY} L${(tx + half).toFixed(0)} 0 Z"
                fill="url(#trunkGrad)" stroke="#160d06" stroke-width="2"/>
            <path d="M${(tx - half * 0.5).toFixed(0)} 4 C${(tx - half * 0.42).toFixed(0)} ${(footY * 0.5).toFixed(0)}, ${(tx - half * 0.58).toFixed(0)} ${(footY * 0.8).toFixed(0)}, ${(tx - half * 0.62).toFixed(0)} ${(footY + 10).toFixed(0)}
                     M${(tx + half * 0.24).toFixed(0)} 2 C${(tx + half * 0.3).toFixed(0)} ${(footY * 0.45).toFixed(0)}, ${(tx + half * 0.2).toFixed(0)} ${(footY * 0.82).toFixed(0)}, ${(tx + half * 0.3).toFixed(0)} ${(footY + 8).toFixed(0)}"
                fill="none" stroke="#1c1109" stroke-width="2.4" opacity="0.55"/>
            <path d="M${tx.toFixed(0)} 6 C${(tx - half * 0.1).toFixed(0)} ${(footY * 0.5).toFixed(0)}, ${(tx + half * 0.08).toFixed(0)} ${(footY * 0.8).toFixed(0)}, ${tx.toFixed(0)} ${(footY + 6).toFixed(0)}"
                fill="none" stroke="#6b4c2a" stroke-width="1.8" opacity="0.4"/>
        </g>`;
        trunkAnchors.push({ x: tx, y: footY - 34 });
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

    // Soft light pools drawn last, over the pathways.
    parts.push(`<g>${glow}</g>`);

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
    return { markup, tunnelPaths, trunkAnchors };
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
        const env = buildEnvironmentSVG(seed);
        this.layer.innerHTML = env.markup;
        this.tunnelPaths = env.tunnelPaths;
        this.trunkAnchors = env.trunkAnchors;

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
        actor.host.style.left = `${(point.x / 10).toFixed(1)}%`;
        actor.host.style.top = `${(point.y / 10).toFixed(1)}%`;
        actor.host.style.zIndex = String(3 + Math.max(0, Math.floor(point.y / 100)));
    }

    _spawnActor(index) {
        if (this.destroyed) return;
        const r = mulberry32((this.seed * 2654435761 + index * 40503 + this._respawns(index)) >>> 0);
        const sizePx = rand(r, 150, 240);

        // Route selection: each actor adopts one of the scene's tunnels and a
        // starting depth along it. Spread actors across tunnels round-robin so
        // every lit pathway carries traffic.
        const tunnels = this.tunnelPaths || [];
        const tunnelIdx = tunnels.length ? (index + Math.floor(r() * tunnels.length)) % tunnels.length : -1;
        const path = tunnelIdx >= 0 ? tunnels[tunnelIdx] : null;
        // Start deep in the tunnel; it will work upward. Depth is judged by the
        // sampled point's actual y (curves are not monotonic), keeping spawns
        // in the visible soil band below the surface.
        let ti = 0;
        if (path) {
            const deep = path.map((p, i) => i).filter(i => i >= 4 && path[i].y >= 460 && path[i].y <= 940);
            ti = deep.length ? deep[Math.floor(r() * deep.length)] : Math.floor(rand(r, path.length * 0.55, path.length - 1));
        }

        const host = document.createElement('div');
        host.className = 'nymph-actor';
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

        const actor = { index, host, nymph, rng: r, done: false, emerging: false, path, ti, tunnelIdx };
        this.actors.push(actor);
        this._placeActorAt(actor, path ? path[ti] : { x: rand(r, 100, 900), y: rand(r, 480, 720) });

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

    // Walk an independent route along the actor's chosen tunnel: each leg
    // advances a few samples along the pathway (mostly upward, with occasional
    // backtracks), while the nymph's local gait supplies articulation, turning
    // and pauses. After the timed budget it emerges at the tunnel's top end.
    async _runRoute(actor) {
        if (this.destroyed || actor.done) return;
        const r = actor.rng;
        const nymph = actor.nymph;
        nymph.setWanderPos(rand(r, -30, 30), rand(r, -20, 20), rand(r, -40, 40));

        const budgetMs = rand(r, 16000, 34000);
        const started = performance.now();

        try {
            while (!this.destroyed && !actor.done) {
                if (performance.now() - started > budgetMs) break;
                const path = actor.path;
                if (!path) break;
                // Route step: usually climb 1-3 samples toward the surface,
                // occasionally wander back down a sample.
                const step = r() < 0.22 ? 1 : -(1 + Math.floor(r() * 3));
                const nextTi = Math.max(2, Math.min(path.length - 1, actor.ti + step));
                const from = path[actor.ti], to = path[nextTi];
                actor.ti = nextTi;
                this._placeActorAt(actor, to);
                // Local gait leg in the direction of travel keeps legs, turning
                // and body bob coherent with the host's glide along the tunnel.
                const dx = to.x - from.x, dy = to.y - from.y;
                const mag = Math.hypot(dx, dy) || 1;
                await nymph.walkTo((dx / mag) * rand(r, 24, 44), (dy / mag) * rand(r, 18, 34), {
                    speed: rand(r, 0.018, 0.04),
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

    // Scene-relative timeout that self-cancels if the scene is torn down.
    _after(ms, fn) {
        const id = setTimeout(() => { if (!this.destroyed) fn(); }, ms);
        (this._timers ||= new Set()).add(id);
        return id;
    }

    // Staged ecdysis. The nymph climbs its tunnel to the surface, walks onto
    // the tree trunk rising there, grips head-up, and moults: the dorsal
    // cuticle splits, the adult pulls free of the shell stage by stage, its
    // crumpled wings slowly expand and harden, and it flies off — leaving the
    // translucent exuvia still clinging to the bark.
    async _emerge(actor) {
        if (this.destroyed || actor.done || actor.emerging) return;
        actor.emerging = true;
        const r = actor.rng;
        const nymph = actor.nymph;

        // 1. Climb: finish the tunnel, then walk up onto the trunk.
        try {
            await nymph.walkTo(rand(r, -20, 20), -110, { speed: rand(r, 0.03, 0.05), tilt: 1.2, bob: 2.2 });
        } catch (_) {}
        if (this.destroyed || actor.done) return;

        actor.host.classList.add('is-emerging');
        const trunk = (this.trunkAnchors || [])[actor.tunnelIdx];
        if (trunk) {
            this._placeActorAt(actor, trunk);
        } else if (actor.path) {
            const top = actor.path[Math.min(4, actor.path.length - 1)];
            this._placeActorAt(actor, { x: top.x, y: Math.max(90, top.y - rand(r, 0, 30)) });
        }
        // Face straight up the bark while the host glides onto the trunk.
        try {
            await nymph.walkTo(0, -30, { speed: 0.02, tilt: 0.8, bob: 1.6, maxTurn: 180 });
        } catch (_) {}
        if (this.destroyed || actor.done) return;
        nymph.setWanderPos(0, 0, 0);

        // 2. Grip pause, then the dorsal cuticle splits.
        await nymph.holdPause(rand(r, 1000, 1800));
        if (this.destroyed || actor.done) return;
        nymph.beginMolt();
        this._after(rand(r, 1400, 2000), () => this._moltReveal(actor));
    }

    // 3-6. Pull-out, wing expansion, hardening, flight; the exuvia remains.
    _moltReveal(actor) {
        if (this.destroyed || actor.done) return;
        const r = actor.rng;
        const adultSeed = (this.seed + actor.index * 271 + 7) % 3301 + 1;

        let adult = null, adultMount = null;
        if (typeof this.renderCicada === 'function') {
            adultMount = document.createElement('div');
            // The adult rides its own wrapper so lift-off leaves the host (and
            // the clinging exuvia) behind on the trunk.
            adultMount.style.cssText = 'position:absolute;inset:0;opacity:0;' +
                'transform:translateY(13%) scale(0.8);will-change:transform,opacity;' +
                'transition:opacity 2.4s ease, transform 3.2s cubic-bezier(.32,0,.3,1);';
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

            // Stage 3: the adult pulls free — rises out of the split shell while
            // the vacated cuticle turns to a translucent exuvia beneath it.
            requestAnimationFrame(() => {
                adultMount.style.opacity = '1';
                adultMount.style.transform = 'translateY(-9%) scale(0.97)';
            });
            this._after(600, () => actor.nymph.toExuvia());

            // Stage 4: wing expansion — slow unfurl to full span.
            this._after(3200, () => {
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
        this._after(8600, () => {
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
        this._after(13500, () => {
            actor.nymph.host.style.transition = 'opacity 4s ease';
            actor.nymph.host.style.opacity = '0';
        });
        this._after(18000, () => {
            actor.done = true;
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
