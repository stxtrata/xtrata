// Grounded cicada nymph renderer. Shares the adult model's coordinate space,
// leg geometry, leg IDs, and landed/walking movement hooks, but replaces the
// adult winged body with a compact real-world nymph silhouette.
import { buildLegMarkup, LEG_SPECS } from './cicada-renderer.js?v=11.3.5-nymph.2';
import { numberOr, easeInOut, lerp, setAttributes, setProperties, mulberry32 } from './utils.js?v=11.3.5-nymph.2';
import { PlantedFootGait } from './ground-gait.js?v=11.3.7-gait';

const legsLayerMarkup = buildLegMarkup();

const FINISH_TIER_SCALE = Object.freeze({
    common:    { fidget: 0.6, wander: 0.8 },
    uncommon:  { fidget: 0.8, wander: 0.9 },
    rare:      { fidget: 1.0, wander: 1.0 },
    epic:      { fidget: 1.4, wander: 1.15 },
    legendary: { fidget: 1.9, wander: 1.3 },
    mythic:    { fidget: 2.6, wander: 1.5 }
});

const NYMPH_PALETTES = Object.freeze([
    { base: '#9b6a36', light: '#d3ad73', mid: '#8a5a2e', dark: '#392313', edge: '#1d1209', eye: '#9d160c' },
    { base: '#a47a46', light: '#e0c28b', mid: '#7a502c', dark: '#332013', edge: '#20140b', eye: '#b41f12' },
    { base: '#8f5c30', light: '#c99555', mid: '#704423', dark: '#2b1b10', edge: '#180f08', eye: '#8f120b' },
    { base: '#b78b52', light: '#e8cc94', mid: '#8b6136', dark: '#3c2817', edge: '#21140b', eye: '#a91a10' }
]);

const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host{--nymph-base:#9b6a36;--nymph-light:#d3ad73;--nymph-mid:#8a5a2e;--nymph-dark:#392313;--nymph-edge:#1d1209;--nymph-eye:#17100b;display:block;position:absolute;inset:0;overflow:visible;pointer-events:auto;}
        .stage{position:relative;width:100%;height:100%;overflow:visible;}
        .cicada-shell{position:absolute;aspect-ratio:1/1;overflow:visible;pointer-events:none;}
        .cicada-shell svg{display:block;width:100%;height:100%;overflow:visible;pointer-events:none;}
        #effect-wrapper{transform-origin:200px 250px;will-change:transform,filter,opacity;transition:filter .3s ease,opacity .3s ease;pointer-events:visiblePainted;cursor:pointer;}
        #cicada-body-group{transform-origin:200px 250px;filter:drop-shadow(0 15px 15px rgba(0,0,0,.62));transition:filter .3s ease;}
        #head{cursor:crosshair;pointer-events:visiblePainted;}
        #head-hitbox{cursor:crosshair;pointer-events:all;fill:transparent;}

        #legs-layer{--shell-dark:var(--nymph-edge);--shell-light:var(--nymph-mid);--shell-accent:var(--nymph-light);}
        #legs-layer g{transition:transform 1.25s ease-in-out;}
        #front-leg-left{transform-origin:170px 190px;}
        #front-leg-right{transform-origin:230px 190px;}
        #middle-leg-left{transform-origin:175px 230px;}
        #middle-leg-right{transform-origin:225px 230px;}
        #hind-leg-left{transform-origin:180px 280px;}
        #hind-leg-right{transform-origin:220px 280px;}
        .is-alert #front-leg-left{transform:rotate(12deg) translateY(-4px);}
        .is-alert #front-leg-right{transform:rotate(-12deg) translateY(-4px);}
        .is-alert #middle-leg-left{transform:rotate(-8deg) translateX(2px);}
        .is-alert #middle-leg-right{transform:rotate(8deg) translateX(-2px);}
        #legs-layer .leg-shadow{stroke:rgba(25,14,7,.52);opacity:.7;}
        #legs-layer .leg-upper{stroke:var(--nymph-dark);}
        #legs-layer .leg-lower{stroke:var(--nymph-mid);}
        #legs-layer .leg-tip{stroke:var(--nymph-edge);}
        #legs-layer .leg-detail{stroke:var(--nymph-light);opacity:.45;}
        #legs-layer .leg-anchor{fill:var(--nymph-mid);stroke:var(--nymph-edge);stroke-width:1.4;}
        #legs-layer .leg-anchor-mid{fill:var(--nymph-dark);stroke:var(--nymph-light);stroke-width:.9;opacity:.85;}
        #legs-layer .leg-pad{fill:var(--nymph-edge);stroke:var(--nymph-light);stroke-width:1;opacity:.95;}
        #front-leg-left,#front-leg-right{opacity:0;pointer-events:none;}

        @keyframes legGroundFidget{from{transform:rotate(calc(var(--leg-fidget-amp,.5deg) * -1)) translateY(0);}55%{transform:rotate(calc(var(--leg-fidget-amp,.5deg) * .4)) translateY(calc(var(--leg-fidget-lift,.3px) * -1));}to{transform:rotate(var(--leg-fidget-amp,.5deg)) translateY(0);}}
        .is-alert .leg-ground-fidget{animation:none !important;}
        /* Walking is solved in JS so stance feet remain fixed to the bark. */
        .cicada-shell.is-walking:not(.is-alert) #legs-layer .leg-unit{animation:none !important;}

        .ground-shadow{fill:#000;opacity:.24;filter:blur(4px);}
        .body-fill{fill:url(#nymphBodyGrad);stroke:var(--nymph-edge);stroke-width:2.2;}
        .plate-fill{fill:url(#nymphPlateGrad);stroke:var(--nymph-edge);stroke-width:2;}
        .head-fill{fill:url(#nymphHeadGrad);stroke:var(--nymph-edge);stroke-width:2;}
        .segment-line{fill:none;stroke:var(--nymph-edge);stroke-width:3;stroke-linecap:round;opacity:.58;}
        .ridge-line{fill:none;stroke:var(--nymph-light);stroke-width:1.8;stroke-linecap:round;opacity:.36;}
        .dark-ridge{fill:none;stroke:#160d07;stroke-width:1.6;stroke-linecap:round;opacity:.28;}
        .texture-dot{fill:var(--nymph-edge);opacity:.22;}
        .nymph-eye{fill:var(--nymph-eye);stroke:#5b0704;stroke-width:1.2;filter:drop-shadow(0 0 3px rgba(80,0,0,.42));}
        .eye-glint{fill:#ffd9a6;opacity:.42;}
        #front-leg-left .leg-upper,#front-leg-right .leg-upper{stroke-width:12px;}
        #front-leg-left .leg-lower,#front-leg-right .leg-lower{stroke-width:8px;}
        #front-leg-left .leg-tip,#front-leg-right .leg-tip{stroke-width:5.5px;}
        #front-leg-left .leg-detail,#front-leg-right .leg-detail{stroke-width:2.4px;opacity:.62;}
        .foreclaw-arm{fill:url(#nymphClawGrad);stroke:var(--nymph-edge);stroke-width:2.1;stroke-linejoin:round;}
        .foreclaw-tip{fill:#221309;stroke:#0f0804;stroke-width:1.4;}
        .foreclaw-ridge{fill:none;stroke:var(--nymph-light);stroke-width:1.5;stroke-linecap:round;opacity:.5;}
        .underside-shadow{fill:#1b1008;opacity:.2;}
        .is-alert #cicada-body-group{filter:drop-shadow(0 18px 16px rgba(0,0,0,.68)) saturate(1.04);}
        .is-alert #nymph-thorax{transform:translateY(-3px);transform-origin:200px 205px;transition:transform .24s ease;}
        .is-alert #head{transform:translateY(-5px);transform-origin:200px 138px;transition:transform .24s ease;}
        .is-calling .nymph-eye{filter:brightness(1.7);}
    </style>

    <div class="stage">
        <div class="cicada-shell" data-life-stage="nymph" data-rarity-tier="common">
            <svg viewBox="-100 -150 600 900" width="100%" height="100%" aria-hidden="true">
                <defs>
                    <linearGradient id="nymphBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="var(--nymph-light)"/>
                        <stop offset="42%" stop-color="var(--nymph-base)"/>
                        <stop offset="100%" stop-color="var(--nymph-dark)"/>
                    </linearGradient>
                    <radialGradient id="nymphPlateGrad" cx="50%" cy="32%" r="75%">
                        <stop offset="0%" stop-color="var(--nymph-light)"/>
                        <stop offset="54%" stop-color="var(--nymph-base)"/>
                        <stop offset="100%" stop-color="var(--nymph-dark)"/>
                    </radialGradient>
                    <radialGradient id="nymphHeadGrad" cx="50%" cy="35%" r="68%">
                        <stop offset="0%" stop-color="var(--nymph-light)"/>
                        <stop offset="58%" stop-color="var(--nymph-mid)"/>
                        <stop offset="100%" stop-color="var(--nymph-dark)"/>
                    </radialGradient>
                    <linearGradient id="nymphClawGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="var(--nymph-light)"/>
                        <stop offset="55%" stop-color="var(--nymph-mid)"/>
                        <stop offset="100%" stop-color="var(--nymph-dark)"/>
                    </linearGradient>
                    <clipPath id="nymph-body-clip">
                        <path d="M128 158C118 202 132 247 154 272C126 312 135 391 200 438C265 391 274 312 246 272C268 247 282 202 272 158C252 129 225 118 200 120C175 118 148 129 128 158Z"/>
                    </clipPath>
                </defs>

                <ellipse class="ground-shadow" cx="200" cy="424" rx="170" ry="35"/>

                <g id="effect-wrapper">
                    <g id="cicada-body-group">
                        <g id="all-art">
                            <g id="legs-layer" stroke="var(--nymph-edge)" fill="none" stroke-linejoin="round" stroke-linecap="round">
                                ${legsLayerMarkup}
                            </g>

                            <g id="foreclaw-layer">
                                <g id="nymph-foreclaw-left">
                                    <path class="foreclaw-arm" d="M166 206C139 198 111 181 84 154C72 142 57 153 64 169C79 203 119 226 158 224C165 219 169 212 166 206Z"/>
                                    <path class="foreclaw-tip" d="M67 164C46 159 30 171 18 191C42 192 62 184 82 172Z"/>
                                    <path class="foreclaw-ridge" d="M155 213C128 205 101 184 72 160"/>
                                </g>
                                <g id="nymph-foreclaw-right">
                                    <path class="foreclaw-arm" d="M234 206C261 198 289 181 316 154C328 142 343 153 336 169C321 203 281 226 242 224C235 219 231 212 234 206Z"/>
                                    <path class="foreclaw-tip" d="M333 164C354 159 370 171 382 191C358 192 338 184 318 172Z"/>
                                    <path class="foreclaw-ridge" d="M245 213C272 205 299 184 328 160"/>
                                </g>
                            </g>

                            <g id="nymph-underbody" clip-path="url(#nymph-body-clip)">
                                <ellipse class="underside-shadow" cx="200" cy="302" rx="72" ry="154"/>
                                <circle class="texture-dot" cx="160" cy="206" r="2.2"/>
                                <circle class="texture-dot" cx="242" cy="213" r="2"/>
                                <circle class="texture-dot" cx="177" cy="298" r="1.9"/>
                                <circle class="texture-dot" cx="226" cy="338" r="2.3"/>
                                <circle class="texture-dot" cx="188" cy="388" r="1.8"/>
                            </g>

                            <g id="abdomen">
                                <path class="body-fill" d="M150 250C126 296 132 380 200 438C268 380 274 296 250 250C235 270 222 280 200 282C178 280 165 270 150 250Z"/>
                                <path class="segment-line" d="M151 284C178 304 222 304 249 284"/>
                                <path class="segment-line" d="M142 319C174 344 226 344 258 319"/>
                                <path class="segment-line" d="M145 356C177 384 223 384 255 356"/>
                                <path class="segment-line" d="M162 394C185 415 215 415 238 394"/>
                                <path class="ridge-line" d="M200 268C194 314 194 374 200 426"/>
                                <path class="dark-ridge" d="M174 274C161 318 162 370 181 414M226 274C239 318 238 370 219 414"/>
                            </g>

                            <g id="nymph-thorax">
                                <path class="plate-fill" d="M128 158C112 208 130 256 164 282C184 295 216 295 236 282C270 256 288 208 272 158C252 129 225 118 200 120C175 118 148 129 128 158Z"/>
                                <path class="segment-line" d="M132 190C160 213 240 213 268 190"/>
                                <path class="segment-line" d="M139 230C166 253 234 253 261 230"/>
                                <path class="ridge-line" d="M200 129C190 174 190 230 200 274"/>
                                <path class="ridge-line" d="M155 164C169 176 185 180 200 180C215 180 231 176 245 164"/>
                                <path class="dark-ridge" d="M150 204C171 218 229 218 250 204"/>
                            </g>

                            <g id="head">
                                <path class="head-fill" d="M150 145C150 105 250 105 250 145Z"/>
                                <g id="eye-classic">
                                    <ellipse class="base-eye nymph-eye" cx="143" cy="128" rx="15" ry="22" transform="rotate(-28 143 128)"/>
                                    <ellipse class="base-eye nymph-eye" cx="257" cy="128" rx="15" ry="22" transform="rotate(28 257 128)"/>
                                    <ellipse class="eye-glint" cx="137" cy="113" rx="4.2" ry="6.6" transform="rotate(-28 137 113)"/>
                                    <ellipse class="eye-glint" cx="263" cy="113" rx="4.2" ry="6.6" transform="rotate(28 263 113)"/>
                                </g>
                                <path class="ridge-line" d="M166 145C183 153 217 153 234 145"/>
                                <path class="dark-ridge" d="M190 155L181 169M210 155L219 169M194 160H206"/>
                            </g>

                            <path id="head-hitbox" d="M126 102C126 72 150 48 200 48C250 48 274 72 274 102L274 154C274 184 248 198 200 198C152 198 126 184 126 154Z"/>
                        </g>
                    </g>
                </g>
            </svg>
        </div>
    </div>
`;

export class CicadaNymphGenerator {
    constructor({ mount, instructions = {} } = {}) {
        this.mount = typeof mount === 'string' ? document.querySelector(mount) : mount;
        this.host = document.createElement('div');
        this.root = this.host.attachShadow({ mode: 'open' });
        this.root.appendChild(template.content.cloneNode(true));
        this.shell = this.root.querySelector('.cicada-shell');
        this.mount.appendChild(this.host);
        this.gait = new PlantedFootGait(this.root, LEG_SPECS);

        for (const [selector, eventName] of [['#head, #head-hitbox', 'cicadacall'], ['#effect-wrapper', 'cicadaclick']]) {
            this.root.querySelectorAll(selector).forEach(element => {
                element.addEventListener('click', event => {
                    event.stopPropagation();
                    this.host.dispatchEvent(new CustomEvent(eventName, { bubbles: true, composed: true }));
                });
            });
        }

        this.applyInstructions(instructions);
        this._startIdleBehavior();
    }

    applyInstructions(instructions) {
        this.instructions = { ...this.instructions, ...instructions, lifeStage: 'nymph' };
        const { unit = 'vmin' } = this.instructions;
        const size = numberOr(this.instructions.size, 80);
        const rotation = numberOr(this.instructions.rotation, 0);
        const xOffset = numberOr(this.instructions.xOffset, 0);
        const yOffset = numberOr(this.instructions.yOffset, 0);
        const hueShift = numberOr(this.instructions.hueShift, 0);
        const brightness = numberOr(this.instructions.brightness, 1);
        const seed = numberOr(this.instructions.seed, 0);
        const palette = NYMPH_PALETTES[0];
        const rarityTier = String(this.instructions.rarityTier || 'common').toLowerCase();

        Object.assign(this.shell.style, {
            width: `${size}${unit}`,
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) translate(${xOffset}${unit}, ${yOffset}${unit}) rotate(${rotation}deg)`,
            filter: `hue-rotate(${hueShift}deg) brightness(${brightness})`
        });

        setAttributes(this.shell, {
            'data-life-stage': 'nymph',
            'data-seed': seed ? String(seed) : '',
            'data-rarity-tier': rarityTier
        });

        setProperties(this.host.style, {
            '--nymph-base': palette.base,
            '--nymph-light': palette.light,
            '--nymph-mid': palette.mid,
            '--nymph-dark': palette.dark,
            '--nymph-edge': palette.edge,
            '--nymph-eye': palette.eye
        });

        this._applyLegFinish(seed, rarityTier);
    }

    setFlying(active) {
        this._endWalk();
        this.instructions.flying = false;
        this.shell.classList.toggle('is-alert', Boolean(active));
    }

    _applyLegFinish(seed, tierKey) {
        if (!seed || this._legFinishSeed === `${seed}|${tierKey}`) return;
        this._legFinishSeed = `${seed}|${tierKey}`;
        const rng = mulberry32((seed ^ 0x77F1A6) >>> 0);
        const tier = FINISH_TIER_SCALE[tierKey] || FINISH_TIER_SCALE.common;
        const legUnits = this.root.querySelectorAll('#legs-layer .leg-unit');
        legUnits.forEach((leg, index) => {
            const amp = Math.min(2.6, (0.4 + rng() * 0.5) * tier.fidget);
            const dur = Math.max(2.2, (4.5 + rng() * 4) / (0.6 + tier.fidget * 0.4));
            leg.classList.add('leg-ground-fidget');
            leg.style.setProperty('--leg-fidget-amp', `${amp.toFixed(2)}deg`);
            leg.style.setProperty('--leg-fidget-lift', `${(amp * 0.45).toFixed(2)}px`);
            leg.style.animation = `legGroundFidget ${dur.toFixed(1)}s ease-in-out ${(rng() * 3 + index * 0.35).toFixed(2)}s infinite alternate`;
        });
    }

    _wanderTarget() {
        if (!this._wanderEl || !this._wanderEl.isConnected) {
            this._wanderEl = this.root.querySelector('#effect-wrapper');
        }
        return this._wanderEl;
    }

    _applyWanderTransform(sway = 0) {
        const el = this._wanderTarget();
        if (!el) return;
        const w = this._wander || { x: 0, y: 0 };
        if (!w.x && !w.y && !sway) {
            el.style.removeProperty('transform');
            return;
        }
        el.style.transform = `translate(${w.x.toFixed(1)}px, ${w.y.toFixed(1)}px) rotate(${sway.toFixed(2)}deg)`;
    }

    _reducedMotion() {
        const doc = document.documentElement;
        if (doc.classList.contains('cicada-reduced-motion')) return true;
        if (doc.classList.contains('cicada-motion-full')) return false;
        return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    _startIdleBehavior() {
        if (this.instructions.idleWander === false) return;
        const seed = numberOr(this.instructions.seed, 0);
        if (!seed) return;
        this._wanderRng = mulberry32((seed ^ 0x3A11ED77) >>> 0);
        this._wander = { x: 0, y: 0, timer: null, frame: null, active: false };
        const tierKey = String(this.instructions.rarityTier || 'common').toLowerCase();
        const tier = FINISH_TIER_SCALE[tierKey] || FINISH_TIER_SCALE.common;
        const schedule = () => {
            const delay = (4.5 + this._wanderRng() * 10) * 1000 / (0.65 + tier.wander * 0.35);
            this._wander.timer = setTimeout(() => {
                this._idleAct(tier);
                schedule();
            }, delay);
        };
        schedule();
    }

    _idleAct(tier) {
        if (!this.shell?.isConnected || document.hidden || this._reducedMotion()) return;
        if (this._wander.active) return;
        if (this.shell.classList.contains('is-alert') || this.shell.classList.contains('is-calling')) return;
        this._walkStep(this._wanderRng, tier);
    }

    _walkStep(r, tier) {
        const target = this._wanderTarget();
        if (!target) return;
        const maxRange = 80 * tier.wander;
        const step = 400 * (0.06 + r() * 0.08);
        let ang = r() * Math.PI * 2;
        let tx = this._wander.x + Math.cos(ang) * step;
        let ty = this._wander.y + Math.sin(ang) * step * 0.6;
        if (Math.hypot(tx, ty) > maxRange) {
            ang = Math.atan2(-this._wander.y, -this._wander.x) + (r() - 0.5) * 0.9;
            tx = this._wander.x + Math.cos(ang) * step;
            ty = this._wander.y + Math.sin(ang) * step * 0.6;
        }
        const fromX = this._wander.x, fromY = this._wander.y;
        const dist = Math.hypot(tx - fromX, ty - fromY);
        if (dist < 3) return;
        const duration = Math.max(900, dist / (0.026 + r() * 0.018));
        const tiltDir = Math.cos(ang) >= 0 ? 1 : -1;
        const maxTilt = 2.2 + r() * 2.6;
        this._wander.active = true;
        this._savedWrapperTransition = target.style.transition;
        target.style.transition = 'none';
        target.style.transformOrigin = '200px 250px';
        target.style.transformBox = 'view-box';
        this.shell.style.setProperty('--walk-step-dur', `${(0.32 + r() * 0.18).toFixed(2)}s`);
        this.shell.classList.add('is-walking');
        const start = performance.now();
        const direction = { x: (tx - fromX) / dist, y: (ty - fromY) / dist };
        this.gait.begin({ x: fromX, y: fromY, sway: 0 });
        const frame = now => {
            if (!this.shell.isConnected || this.shell.classList.contains('is-alert')) return this._endWalk();
            const p = Math.min(1, (now - start) / duration);
            const e = easeInOut(p);
            this._wander.x = lerp(fromX, tx, e);
            this._wander.y = lerp(fromY, ty, e);
            const sway = Math.sin(p * Math.PI) * maxTilt * tiltDir;
            this._applyWanderTransform(sway);
            this.gait.update({ x: this._wander.x, y: this._wander.y, sway }, now - start, direction);
            if (p < 1) this._wander.frame = requestAnimationFrame(frame);
            else this._endWalk();
        };
        this._wander.frame = requestAnimationFrame(frame);
    }

    _endWalk() {
        if (!this._wander) return;
        if (this._wander.frame) cancelAnimationFrame(this._wander.frame);
        this._wander.frame = null;
        this._wander.active = false;
        this.shell.classList.remove('is-walking');
        this.gait?.end();
        this._applyWanderTransform(0);
        const target = this._wanderTarget();
        if (target && this._savedWrapperTransition !== undefined) {
            target.style.transition = this._savedWrapperTransition;
            this._savedWrapperTransition = undefined;
        }
    }

    triggerCallVisual(durationMs = 600) {
        this.shell.classList.add('is-calling');
        if (this.callTimeout) clearTimeout(this.callTimeout);
        this.callTimeout = setTimeout(() => {
            this.shell.classList.remove('is-calling');
        }, durationMs);
    }

    destroy() {
        if (this.callTimeout) clearTimeout(this.callTimeout);
        if (this._wander?.timer) clearTimeout(this._wander.timer);
        if (this._wander?.frame) cancelAnimationFrame(this._wander.frame);
        this.host.remove();
    }
}
