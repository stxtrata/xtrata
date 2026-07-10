// SVG template, visual traits, animation states, and click event bridge.
import {
    DEFAULT_NEON_COLOR,
    SUPPORTED_EFFECTS,
    CICADA_COLOR_PRESETS,
    SHELL_PRESETS,
    EYE_PRESETS,
    LASER_COLORS
} from './config.js?v=11.3.5';
import { numberOr, clamp01, easeInOut, lerp, setAttributes, setProperties, mulberry32 } from './utils.js?v=11.3.5';
import { PlantedFootGait } from './ground-gait.js?v=11.3.7-gait';

const STRIPE_Y = Object.freeze([230, 262, 294, 326, 358, 390, 422]);

    // Layered leg construction. Each leg keeps its original waypoints and overall
    // silhouette, but is built from simple stacked graphic parts (shadow base,
    // main upper stroke, narrower lower stroke, slim end stroke, connection
    // points, contact pad, and a light detail line) for depth and polish.
    export const LEG_SPECS = Object.freeze([
        { id: 'hind-leg-left', width: 8, points: [[180, 280], [140, 330], [110, 385], [115, 400]] },
        { id: 'hind-leg-right', width: 8, points: [[220, 280], [260, 330], [290, 385], [285, 400]] },
        { id: 'middle-leg-left', width: 7, points: [[175, 230], [125, 250], [85, 305], [80, 320]] },
        { id: 'middle-leg-right', width: 7, points: [[225, 230], [275, 250], [315, 305], [320, 320]] },
        { id: 'front-leg-left', width: 8.5, points: [[170, 190], [130, 160], [100, 120], [90, 125]] },
        { id: 'front-leg-right', width: 8.5, points: [[230, 190], [270, 160], [300, 120], [310, 125]] }
    ]);

    function legSegmentPath(a, b) {
        return `M${a[0]} ${a[1]}L${b[0]} ${b[1]}`;
    }

    export function buildLegMarkup() {
        return LEG_SPECS.map(spec => {
            const [p0, p1, p2, p3] = spec.points;
            const w = spec.width;
            const full = `M${p0[0]} ${p0[1]}L${p1[0]} ${p1[1]}L${p2[0]} ${p2[1]}L${p3[0]} ${p3[1]}`;
            // Light detail line sits just off the upper stroke, toward the light.
            const ux = p1[0] - p0[0], uy = p1[1] - p0[1];
            const ul = Math.hypot(ux, uy) || 1;
            let nx = -uy / ul, ny = ux / ul;
            if (ny > 0) { nx = -nx; ny = -ny; }
            const d0 = [p0[0] + nx * 1.6, p0[1] + ny * 1.6];
            const d1 = [p1[0] + nx * 1.6, p1[1] + ny * 1.6];
            // Contact pad aligned with the slim end stroke.
            const padAngle = Math.atan2(p3[1] - p2[1], p3[0] - p2[0]) * 180 / Math.PI;
            return `
                <g id="${spec.id}" class="leg-unit">
                    <path class="leg-shadow" d="${full}" stroke-width="${(w + 2.2).toFixed(1)}" transform="translate(0.6 1.6)"></path>
                    <path class="leg-upper" d="${legSegmentPath(p0, p1)}" stroke-width="${w}"></path>
                    <path class="leg-lower" d="${legSegmentPath(p1, p2)}" stroke-width="${(w * 0.74).toFixed(2)}"></path>
                    <path class="leg-tip" d="${legSegmentPath(p2, p3)}" stroke-width="${(w * 0.5).toFixed(2)}"></path>
                    <path class="leg-detail" d="M${d0[0].toFixed(1)} ${d0[1].toFixed(1)}L${d1[0].toFixed(1)} ${d1[1].toFixed(1)}" stroke-width="${(w * 0.26).toFixed(2)}"></path>
                    <circle class="leg-anchor" cx="${p0[0]}" cy="${p0[1]}" r="${(w * 0.62).toFixed(2)}"></circle>
                    <circle class="leg-anchor leg-anchor-mid" cx="${p1[0]}" cy="${p1[1]}" r="${(w * 0.40).toFixed(2)}"></circle>
                    <circle class="leg-anchor leg-anchor-mid" cx="${p2[0]}" cy="${p2[1]}" r="${(w * 0.30).toFixed(2)}"></circle>
                    <ellipse class="leg-pad" cx="${p3[0]}" cy="${p3[1]}" rx="${(w * 0.52).toFixed(2)}" ry="${(w * 0.34).toFixed(2)}" transform="rotate(${padAngle.toFixed(1)} ${p3[0]} ${p3[1]})"></ellipse>
                </g>`;
        }).join('');
    }
    const legsLayerMarkup = buildLegMarkup();

    // How strongly the seeded finish and idle movement express per rarity tier.
    // Common stays grounded and naturalistic; rarer tiers grow more vivid:
    // wider sway, brighter sheen, stronger creasing, livelier ground fidget.
    const FINISH_TIER_SCALE = Object.freeze({
        common:    { sway: 1.00, sheen: 1.00, fold: 1.00, extraLayers: 0, fidget: 0.6, wander: 0.8 },
        uncommon:  { sway: 1.15, sheen: 1.10, fold: 1.15, extraLayers: 0, fidget: 0.8, wander: 0.9 },
        rare:      { sway: 1.40, sheen: 1.25, fold: 1.35, extraLayers: 0, fidget: 1.0, wander: 1.0 },
        epic:      { sway: 1.80, sheen: 1.50, fold: 1.65, extraLayers: 1, fidget: 1.4, wander: 1.15 },
        legendary: { sway: 2.30, sheen: 1.80, fold: 2.00, extraLayers: 1, fidget: 1.9, wander: 1.3 },
        mythic:    { sway: 3.00, sheen: 2.20, fold: 2.50, extraLayers: 2, fidget: 2.6, wander: 1.5 }
    });


    const EYE_STYLE_COLOR_PRESETS = Object.freeze({
        'match-eye': { primary: null, alt: null, glow: null, altGlow: null },
        gold: { primary: '#ffd700', alt: '#ffea77', glow: '#ffea00', altGlow: 'rgba(255,234,119,.85)' },
        ember: { primary: '#ff8c42', alt: '#ffd27a', glow: '#ff9a3d', altGlow: 'rgba(255,166,80,.78)' },
        toxic: { primary: '#4dff88', alt: '#b8ff9a', glow: '#4dff88', altGlow: 'rgba(77,255,136,.72)' },
        cyan: { primary: '#7cecff', alt: '#d8fbff', glow: '#7cecff', altGlow: 'rgba(124,236,255,.72)' },
        phantom: { primary: '#ffffff', alt: '#f4f6ff', glow: '#ffffff', altGlow: 'rgba(255,255,255,.82)' },
        violet: { primary: '#c08cff', alt: '#ead6ff', glow: '#d2a4ff', altGlow: 'rgba(210,164,255,.78)' },
        crimson: { primary: '#ff5a74', alt: '#ffd0d8', glow: '#ff5a74', altGlow: 'rgba(255,90,116,.72)' },
        rainbow: { primary: '#ff4f8b', alt: '#73f0ff', glow: '#ffe86a', altGlow: 'rgba(115,240,255,.72)' }
    });
    const RAINBOW_STRIPES = Object.freeze(['#ff0055', '#ff9900', '#ffee00', '#00ff88', '#0088ff', '#aa00ff', '#ff0055']);

    function stripeGroup(id, colors, curved = false, opacity = 0.85) {
        const stripes = STRIPE_Y.map((y, index) => {
            const color = colors[index % colors.length];
            if (curved) {
                const curveY = y + 10;
                return `<path d="M100 ${curveY} Q200 ${curveY + 40} 300 ${curveY}" fill="none" stroke="${color}" stroke-width="33" opacity="${opacity}"/>`;
            }
            return `<rect x="100" y="${y}" width="200" height="33" fill="${color}" opacity="${opacity}"/>`;
        }).join('');
        return `<g id="${id}" clip-path="url(#abdomen-shape)">${stripes}</g>`;
    }

    const experimentalAbdomenPatterns = `
        <g id="abd-tartan-bands" clip-path="url(#abdomen-shape)">
            <rect x="100" y="240" width="200" height="190" fill="rgba(8,14,11,.35)"/>
            <path d="M110 250H290M110 292H290M110 334H290M110 376H290" stroke="var(--neon-color)" stroke-width="16" opacity=".58"/>
            <path d="M142 240V430M190 240V430M238 240V430" stroke="#fff" stroke-width="9" opacity=".22"/>
            <path d="M165 240V430M214 240V430M264 240V430" stroke="var(--shell-dark)" stroke-width="15" opacity=".45"/>
        </g>
        <g id="abd-molten-cracks" clip-path="url(#abdomen-shape)">
            <rect x="100" y="240" width="200" height="190" fill="rgba(10,0,0,.18)"/>
            <path d="M186 248l26 28l-18 24l32 38l-34 20l22 50M160 278l30 24l-24 31l32 30M240 270l-26 33l30 22l-18 44" fill="none" stroke="#ffcc33" stroke-width="7" stroke-linecap="round" opacity=".9" filter="drop-shadow(0 0 8px #ff3300)"/>
        </g>
        <g id="abd-neon-cells" clip-path="url(#abdomen-shape)">
            <rect x="100" y="240" width="200" height="190" fill="rgba(0,0,0,.14)"/>
            <path d="M150 265h100M145 310h110M155 355h90M172 400h56M173 242v170M200 240v188M227 242v170" stroke="var(--neon-color)" stroke-width="4" opacity=".72"/>
            <circle cx="174" cy="288" r="8" fill="var(--neon-color)" opacity=".65"/>
            <circle cx="224" cy="335" r="7" fill="#fff" opacity=".42"/>
            <circle cx="199" cy="384" r="10" fill="var(--neon-color)" opacity=".5"/>
        </g>
        <g id="abd-bone-segments" clip-path="url(#abdomen-shape)">
            <path d="M155 250Q200 275 245 250L238 282Q200 305 162 282Z" fill="#dfcda4" opacity=".78"/>
            <path d="M150 295Q200 322 250 295L240 330Q200 352 160 330Z" fill="#f4e2b7" opacity=".84"/>
            <path d="M158 342Q200 365 242 342L230 382Q200 407 170 382Z" fill="#c7ad7c" opacity=".82"/>
            <path d="M160 250Q200 278 240 250M154 295Q200 323 246 295M162 342Q200 365 238 342" fill="none" stroke="#5a442c" stroke-width="3" opacity=".75"/>
        </g>`;

    const abdomenStripes = [
        stripeGroup('abd-banded-straight', ['var(--neon-color)', 'var(--shell-dark)']),
        stripeGroup('abd-banded-curved', ['var(--neon-color)', 'var(--shell-dark)'], true),
        stripeGroup('abd-twotone-straight', ['var(--neon-color)', '#ffffff']),
        stripeGroup('abd-twotone-curved', ['var(--neon-color)', '#ffffff'], true),
        stripeGroup('abd-rainbow-straight', RAINBOW_STRIPES, false, 0.9),
        stripeGroup('abd-rainbow-curved', RAINBOW_STRIPES, true, 0.9),
        stripeGroup('abd-oil-slick-bands', ['#ff0055', '#ff9900', '#00ff88', '#00ddff', '#aa00ff'], true, 0.76),
        experimentalAbdomenPatterns
    ].join('');


    const abdomenVariantOverlays = `
        <g id="abd-variant-centre-spine" class="abdomen-variant-option">
            <path d="M200 252C196 295 197 354 200 406" fill="none" stroke="var(--shell-dark)" stroke-width="3.4" opacity=".48"/>
            <path d="M200 258C199 302 200 350 201 396" fill="none" stroke="var(--neon-color)" stroke-width="2" opacity=".55"/>
        </g>
        <g id="abd-variant-double-spine" class="abdomen-variant-option">
            <path d="M188 256C184 300 186 350 190 398M212 256C216 300 214 350 210 398" fill="none" stroke="var(--shell-dark)" stroke-width="3.2" opacity=".5"/>
            <path d="M188 260C186 302 188 346 190 392M212 260C214 302 212 346 210 392" fill="none" stroke="var(--neon-color)" stroke-width="1.8" opacity=".54"/>
        </g>
        <g id="abd-variant-broken-bands" class="abdomen-variant-option" clip-path="url(#abdomen-shape)">
            <path d="M128 278h36m28 0h24m32 0h26M134 330h30m20 0h18m30 0h36M146 382h28m20 0h24m24 0h20" fill="none" stroke="#0b110e" stroke-width="9" stroke-linecap="round" opacity=".95"/>
            <path d="M140 266h32m36 0h34M146 318h24m32 0h28m20 0h24M154 370h20m26 0h32m18 0h18" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="2.5" stroke-linecap="round" opacity=".5"/>
        </g>
        <g id="abd-variant-asymmetric-left" class="abdomen-variant-option">
            <path d="M160 266c-10 22-16 54-12 94c2 24 8 42 18 58" fill="none" stroke="var(--neon-color)" stroke-width="3" opacity=".35"/>
        </g>
        <g id="abd-variant-asymmetric-right" class="abdomen-variant-option">
            <path d="M240 266c10 22 16 54 12 94c-2 24-8 42-18 58" fill="none" stroke="var(--neon-color)" stroke-width="3" opacity=".35"/>
        </g>`;

    const antennaeVariantOverlays = `
        <g id="ant-variant-hooked-tips" class="antennae-variant-option" fill="none" stroke="var(--shell-dark)" stroke-width="2.4" stroke-linecap="round">
            <path d="M120 40q-8 8-2 16M280 40q8 8 2 16"/>
        </g>
        <g id="ant-variant-sensor-tips" class="antennae-variant-option" fill="var(--neon-color)">
            <circle cx="120" cy="40" r="4.6" opacity=".8"/><circle cx="280" cy="40" r="4.6" opacity=".8"/>
            <circle cx="120" cy="40" r="2" fill="#fff" opacity=".6"/><circle cx="280" cy="40" r="2" fill="#fff" opacity=".6"/>
        </g>`;

    const BODY_SKIN_NAMES = ['carbon', 'hazard', 'polka', 'camo', 'wood', 'magma', 'synthwave', 'iridescent', 'porcelain', 'circuit-tattoo', 'static-noise', 'bio-lattice'];
    const SKIN_STYLE_RULES = {
        carbon: 'mix-blend-mode:multiply;opacity:0.9;',
        hazard: 'mix-blend-mode:hard-light;opacity:0.7;',
        polka: 'opacity:0.85;',
        camo: 'mix-blend-mode:multiply;opacity:0.6;',
        wood: 'mix-blend-mode:multiply;opacity:0.75;',
        magma: 'mix-blend-mode:color-dodge;opacity:0.95;',
        synthwave: 'mix-blend-mode:screen;opacity:0.85;',
        iridescent: 'mix-blend-mode:screen;opacity:0.82;animation:traitHue 4.2s infinite linear;',
        porcelain: 'mix-blend-mode:screen;opacity:0.62;',
        'circuit-tattoo': 'mix-blend-mode:screen;opacity:0.78;',
        'static-noise': 'mix-blend-mode:screen;opacity:0.55;',
        'bio-lattice': 'mix-blend-mode:overlay;opacity:0.78;'
    };
    const buildSkinRects = (area, x, y, width, height) => BODY_SKIN_NAMES
        .map(name => `<rect id="${area}-skin-${name}-rect" class="section-skin-rect" x="${x}" y="${y}" width="${width}" height="${height}" fill="url(#skin-${name})"/>`)
        .join('');
    const THORAX_PATH = 'M160 150C140 180 145 240 200 250C255 240 260 180 240 150Z';
    const thoraxSkinRects = buildSkinRects('thorax', 125, 130, 150, 130);
    const thoraxMaterialOverlays = BODY_SKIN_NAMES
        .map(name => `<path id="thorax-material-${name}" class="thorax-material-overlay" d="${THORAX_PATH}" fill="url(#skin-${name})"/>`)
        .join('');
    const abdomenSkinRects = buildSkinRects('abdomen', 100, 240, 200, 190);
    const createSkinCss = area => [
        `.cicada-shell[data-${area}-skin="none"] #${area}-skin-layer{display:none;}`,
        ...BODY_SKIN_NAMES.map(name => `.cicada-shell[data-${area}-skin="${name}"] #${area}-skin-${name}-rect{display:block;${SKIN_STYLE_RULES[name]}}`)
    ].join('\\n');
    const skinCssRules = [
        `.section-skin-rect{display:none;pointer-events:none;}`,
        createSkinCss('thorax'),
        createSkinCss('abdomen'),
        `#thorax-skin-layer .section-skin-rect{mix-blend-mode:normal !important;opacity:.92 !important;filter:saturate(1.25) contrast(1.1);}`,
        `.cicada-shell[data-thorax-skin="none"] #thorax-skin-layer{display:none;}`,
        `.cicada-shell[data-abdomen-skin="none"] #abdomen-skin-layer{display:none;}`
    ].join('\\n');


    function polarPoint(cx, cy, radius, index, total, phase = -Math.PI / 2) {
        const angle = phase + (index / total) * Math.PI * 2;
        return [Number((cx + Math.cos(angle) * radius).toFixed(2)), Number((cy + Math.sin(angle) * radius).toFixed(2)), angle];
    }

    function primeOrbitTicks(total, radius, length = 15, width = 2, opacity = '.5') {
        return Array.from({ length: total }, (_, index) => {
            const [x1, y1, angle] = polarPoint(200, 250, radius, index, total);
            const x2 = Number((200 + Math.cos(angle) * (radius + length)).toFixed(2));
            const y2 = Number((250 + Math.sin(angle) * (radius + length)).toFixed(2));
            return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="${width}" opacity="${opacity}"/>`;
        }).join('');
    }

    function primeDots(total, radius, dotRadius = 3.2, opacity = '.58') {
        return Array.from({ length: total }, (_, index) => {
            const [x, y] = polarPoint(200, 250, radius, index, total);
            return `<circle cx="${x}" cy="${y}" r="${dotRadius}" opacity="${opacity}"/>`;
        }).join('');
    }

    function isPrimeGlyph(n) {
        if (n < 2) return false;
        for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
        return true;
    }
    const twinPrimeNodes = [3,5,5,7,11,13,17,19,29,31,41,43,59,61,71,73]
        .map((prime, index) => {
            const [x, y] = polarPoint(200, 250, 242 + (index % 2) * 22, index, 16);
            return `<circle cx="${x}" cy="${y}" r="${index % 2 ? 3.3 : 4.8}" data-prime="${prime}"/>`;
        }).join('');
    const ulamPrimeDots = Array.from({ length: 121 }, (_, index) => {
        const n = index + 1;
        const col = index % 11;
        const row = Math.floor(index / 11);
        const x = 200 + (col - 5) * 28;
        const y = 250 + (row - 5) * 28;
        const prime = isPrimeGlyph(n);
        return `<circle cx="${x}" cy="${y}" r="${prime ? 3.1 : 1.1}" opacity="${prime ? '.64' : '.14'}"/>`;
    }).join('');
    const primeGapSpokes = [2,3,5,7,11,13,17,19,23,29,31]
        .map((prime, index, arr) => {
            const [x1, y1, angle] = polarPoint(200, 250, 88, index, arr.length);
            const gap = prime - (arr[index - 1] || 0);
            const x2 = Number((200 + Math.cos(angle) * (176 + gap * 5)).toFixed(2));
            const y2 = Number((250 + Math.sin(angle) * (176 + gap * 5)).toFixed(2));
            return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="${1.2 + (gap % 5) * .45}" opacity="${.24 + (gap % 7) * .05}"/>`;
        }).join('');
    const residueBloomPetals = Array.from({ length: 17 }, (_, index) => {
        const [x, y, angle] = polarPoint(200, 250, 150, index, 17);
        const deg = angle * 180 / Math.PI + 90;
        return `<ellipse cx="${x}" cy="${y}" rx="10" ry="44" transform="rotate(${deg.toFixed(2)} ${x} ${y})" opacity="${index % 2 ? '.24' : '.42'}"/>`;
    }).join('');
    const beacon3301Dots = primeDots(33, 256, 2.8, '.42');
    const primePulseMarkup = {
        '11': `<g data-prime-set="11" fill="none" stroke="var(--neon-color)"><circle cx="200" cy="250" r="70" stroke-width="1.6" opacity=".24"/><circle cx="200" cy="250" r="118" stroke-width="1.3" opacity=".34"/>${Array.from({ length: 11 }, (_, index) => { const [x,y] = polarPoint(200,250,188,index,11); return `<circle cx="${x}" cy="${y}" r="5.2" fill="var(--neon-color)" opacity="${index % 2 ? '.42' : '.72'}"/>`; }).join('')}</g>`,
        '13': `<g data-prime-set="13" fill="none" stroke="var(--neon-color)"><circle cx="200" cy="250" r="82" stroke-width="1.2" stroke-dasharray="3 13" opacity=".32"/>${Array.from({ length: 13 }, (_, index) => { const [x,y] = polarPoint(200,250,152,index,13); return `<line x1="200" y1="250" x2="${x}" y2="${y}" stroke-width="1" opacity=".11"/><circle cx="${x}" cy="${y}" r="4.3" fill="var(--neon-color)" opacity="${index % 3 ? '.48' : '.78'}"/>`; }).join('')}</g>`,
        '17': `<g data-prime-set="17" fill="none" stroke="var(--neon-color)"><circle cx="200" cy="250" r="96" stroke-width="1.1" stroke-dasharray="5 17" opacity=".3"/>${Array.from({ length: 17 }, (_, index) => { const [x,y] = polarPoint(200,250,210,index,17); return `<circle cx="${x}" cy="${y}" r="${index % 4 ? '3.1' : '5.1'}" fill="var(--neon-color)" opacity="${index % 2 ? '.34' : '.68'}"/>`; }).join('')}</g>`,
        '11-13': `<g data-prime-set="11-13" fill="none" stroke="var(--neon-color)">${Array.from({ length: 11 }, (_, index) => { const [x,y] = polarPoint(200,250,128,index,11); return `<circle cx="${x}" cy="${y}" r="3.8" fill="var(--neon-color)" opacity=".65"/>`; }).join('')}${Array.from({ length: 13 }, (_, index) => { const [x,y] = polarPoint(200,250,196,index,13); return `<circle cx="${x}" cy="${y}" r="3.2" fill="#fff" opacity=".44"/>`; }).join('')}</g>`,
        '13-17': `<g data-prime-set="13-17" fill="none" stroke="var(--neon-color)">${Array.from({ length: 13 }, (_, index) => { const [x,y] = polarPoint(200,250,140,index,13); return `<line x1="${x}" y1="${y}" x2="200" y2="250" stroke-width=".9" opacity=".16"/>`; }).join('')}${Array.from({ length: 17 }, (_, index) => { const [x,y] = polarPoint(200,250,222,index,17); return `<circle cx="${x}" cy="${y}" r="${index % 3 ? '3.2' : '5.4'}" fill="var(--neon-color)" opacity="${index % 2 ? '.36' : '.72'}"/>`; }).join('')}</g>`,
        '11-13-17': `<g data-prime-set="11-13-17" fill="none" stroke="var(--neon-color)"><circle cx="200" cy="250" r="66" stroke-width="1.8" opacity=".28"/><circle cx="200" cy="250" r="126" stroke-width="1.2" opacity=".26"/><circle cx="200" cy="250" r="198" stroke-width="1" opacity=".22" stroke-dasharray="3 17"/>${Array.from({ length: 11 }, (_, i) => { const [x,y] = polarPoint(200,250,84,i,11); return `<circle cx="${x}" cy="${y}" r="2.5" fill="#fff" opacity=".4"/>`; }).join('')}${Array.from({ length: 13 }, (_, i) => { const [x,y] = polarPoint(200,250,146,i,13); return `<circle cx="${x}" cy="${y}" r="3.2" fill="var(--neon-color)" opacity=".55"/>`; }).join('')}${Array.from({ length: 17 }, (_, i) => { const [x,y] = polarPoint(200,250,224,i,17); return `<circle cx="${x}" cy="${y}" r="4.6" fill="var(--neon-color)" opacity="${i % 2 ? '.42' : '.78'}"/>`; }).join('')}</g>`
    };
    const gridCells = (cols, rows, sx, sy, fill='var(--neon-color)') => Array.from({ length: cols * rows }, (_, index) => {
        const c = index % cols; const r = Math.floor(index / cols);
        const x = 200 + (c - (cols - 1) / 2) * sx; const y = 250 + (r - (rows - 1) / 2) * sy;
        const active = isPrimeGlyph(index + 2);
        return `<rect x="${(x - 4).toFixed(2)}" y="${(y - 4).toFixed(2)}" width="8" height="8" rx="1.5" fill="${fill}" opacity="${active ? '.62' : '.12'}"/>`;
    }).join('');
    const primeGridMarkup = {
        '11': `<g data-prime-set="11" fill="none"><rect x="110" y="138" width="180" height="224" stroke="var(--neon-color)" stroke-width="1" opacity=".22"/>${gridCells(11,11,18,18)}</g>`,
        '13': `<g data-prime-set="13" fill="none"><rect x="96" y="154" width="208" height="192" stroke="var(--neon-color)" stroke-width="1" opacity=".22"/>${gridCells(13,9,16,18)}</g>`,
        '17': `<g data-prime-set="17" fill="none"><rect x="72" y="182" width="256" height="136" stroke="var(--neon-color)" stroke-width="1" opacity=".22"/>${gridCells(17,7,16,16)}</g>`,
        '11-13': `<g data-prime-set="11-13" fill="none"><rect x="112" y="144" width="176" height="212" stroke="var(--neon-color)" stroke-width="1" opacity=".18"/>${gridCells(11,13,16,16)}<path d="M112 250H288M200 144V356" stroke="#fff" stroke-width="1" opacity=".12"/></g>`,
        '13-17': `<g data-prime-set="13-17" fill="none"><rect x="96" y="154" width="208" height="192" stroke="var(--neon-color)" stroke-width="1" opacity=".18"/>${gridCells(13,17,12.5,11.2)}<path d="M96 250H304" stroke="#fff" stroke-width="1" opacity=".1"/></g>`,
        '11-13-17': `<g data-prime-set="11-13-17" fill="none">${gridCells(11,11,18,18)}${gridCells(13,13,15,15,'#fff')}<rect x="90" y="140" width="220" height="220" stroke="var(--neon-color)" stroke-width="1" opacity=".2"/></g>`
    };
    const bloomPetals = (count, radius, rx, ry) => Array.from({ length: count }, (_, index) => { const [x,y,angle] = polarPoint(200,250,radius,index,count); const deg = angle * 180 / Math.PI + 90; return `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" transform="rotate(${deg.toFixed(2)} ${x} ${y})" opacity="${index % 2 ? '.22' : '.42'}"/>`; }).join('');
    const primeBloomMarkup = {
        '11': `<g data-prime-set="11" fill="var(--neon-color)" stroke="var(--neon-color)">${bloomPetals(11,110,10,30)}<circle cx="200" cy="250" r="44" fill="none" stroke-width="1.2" opacity=".34"/></g>`,
        '13': `<g data-prime-set="13" fill="var(--neon-color)" stroke="var(--neon-color)">${bloomPetals(13,128,9,36)}<circle cx="200" cy="250" r="60" fill="none" stroke-width="1.2" opacity=".32"/></g>`,
        '17': `<g data-prime-set="17" fill="var(--neon-color)" stroke="var(--neon-color)">${bloomPetals(17,148,8,41)}<circle cx="200" cy="250" r="74" fill="none" stroke-width="1.1" opacity=".3"/></g>`,
        '11-13': `<g data-prime-set="11-13" fill="var(--neon-color)" stroke="var(--neon-color)">${bloomPetals(11,102,9,24)}${bloomPetals(13,152,8,28)}<circle cx="200" cy="250" r="84" fill="none" stroke-width="1.1" opacity=".28"/></g>`,
        '13-17': `<g data-prime-set="13-17" fill="var(--neon-color)" stroke="var(--neon-color)">${bloomPetals(13,118,8,26)}${bloomPetals(17,174,7,24)}<circle cx="200" cy="250" r="95" fill="none" stroke="#fff" stroke-width="1" opacity=".2"/></g>`,
        '11-13-17': `<g data-prime-set="11-13-17" fill="var(--neon-color)" stroke="var(--neon-color)">${bloomPetals(11,88,8,22)}${bloomPetals(13,136,7,24)}${bloomPetals(17,188,6,22)}<circle cx="200" cy="250" r="28" fill="var(--neon-color)" opacity=".18"/></g>`
    };
    const swarmDots = (count, radiusBase, spread, color='var(--neon-color)') => Array.from({ length: count }, (_, index) => { const [x,y] = polarPoint(200,250,radiusBase + ((index * spread) % 40), index, count); return `<circle cx="${x}" cy="${y}" r="${2 + (index % 5) * .55}" fill="${color}" opacity="${.24 + (index % 4) * .12}"/>`; }).join('');
    const primeSwarmMarkup = {
        '11': `<g data-prime-set="11">${swarmDots(11,98,7)}${swarmDots(22,156,5,'#fff')}</g>`,
        '13': `<g data-prime-set="13">${swarmDots(13,106,9)}${swarmDots(26,172,7,'#fff')}</g>`,
        '17': `<g data-prime-set="17">${swarmDots(17,118,11)}${swarmDots(34,188,9,'#fff')}</g>`,
        '11-13': `<g data-prime-set="11-13">${swarmDots(11,88,5)}${swarmDots(13,142,6,'#fff')}<path d="M104 188Q200 124 296 188" fill="none" stroke="var(--neon-color)" opacity=".16"/></g>`,
        '13-17': `<g data-prime-set="13-17">${swarmDots(13,98,7)}${swarmDots(17,168,8,'#fff')}<path d="M78 288Q200 126 322 288" fill="none" stroke="var(--neon-color)" opacity=".12"/></g>`,
        '11-13-17': `<g data-prime-set="11-13-17">${swarmDots(11,76,5)}${swarmDots(13,132,6,'#fff')}${swarmDots(17,194,7)}<circle cx="200" cy="250" r="214" fill="none" stroke="var(--neon-color)" stroke-width="1" stroke-dasharray="1 17" opacity=".18"/></g>`
    };
    const primeInterferenceMarkup = {
        '11': `<g data-prime-set="11" fill="none" stroke="var(--neon-color)"><circle cx="200" cy="250" r="150" stroke-width="1" stroke-dasharray="11 7" opacity=".26"/><circle cx="200" cy="250" r="198" stroke-width="1" stroke-dasharray="3 11" opacity=".2"/></g>`,
        '13': `<g data-prime-set="13" fill="none" stroke="var(--neon-color)"><path d="M84 250Q200 108 316 250Q200 392 84 250Z" stroke-width="1.2" opacity=".24"/><circle cx="200" cy="250" r="174" stroke-width="1" stroke-dasharray="13 5" opacity=".18"/></g>`,
        '17': `<g data-prime-set="17" fill="none" stroke="var(--neon-color)"><path d="M102 182Q200 84 298 182Q396 280 298 378Q200 476 102 378Q4 280 102 182Z" stroke-width="1" opacity=".2"/><circle cx="200" cy="250" r="206" stroke-width="1" stroke-dasharray="17 7" opacity=".2"/></g>`,
        '11-13': `<g data-prime-set="11-13" fill="none" stroke="var(--neon-color)"><circle cx="200" cy="250" r="144" stroke-width="1.1" stroke-dasharray="11 13" opacity=".28"/><circle cx="200" cy="250" r="204" stroke-width="1" stroke-dasharray="13 11" opacity=".18"/><path d="M80 200Q200 300 320 200" stroke="#fff" stroke-width="1" opacity=".18"/></g>`,
        '13-17': `<g data-prime-set="13-17" fill="none" stroke="var(--neon-color)"><circle cx="200" cy="250" r="132" stroke-width="1.1" stroke-dasharray="13 17" opacity=".28"/><circle cx="200" cy="250" r="218" stroke-width="1" stroke-dasharray="17 13" opacity=".18"/><path d="M82 308Q200 168 318 308" stroke="#fff" stroke-width="1" opacity=".18"/></g>`,
        '11-13-17': `<g data-prime-set="11-13-17" fill="none" stroke="var(--neon-color)"><circle cx="200" cy="250" r="118" stroke-width="1.2" stroke-dasharray="11 13" opacity=".28"/><circle cx="200" cy="250" r="168" stroke-width="1.1" stroke-dasharray="13 17" opacity=".22"/><circle cx="200" cy="250" r="222" stroke-width="1" stroke-dasharray="17 11" opacity=".18"/><circle cx="200" cy="250" r="33" fill="none" stroke="#fff" stroke-width="1" opacity=".3"/></g>`
    };
    const sieveSnowFlakes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47]
        .map((prime, index) => `<circle class="sieve-snow-flake" cx="${(prime * 11) % 500 - 50}" cy="${(index * 37) % 380 - 80}" r="${2 + (prime % 5) * .45}" opacity="${.45 + (prime % 7) * .045}"/>`).join('');
    const primeAshSparks = [13,17,19,23,29,31,37,41,43,47,53]
        .map((prime, index) => `<circle class="prime-ash-spark" cx="${35 + (prime * 7) % 350}" cy="${335 + (index * 31) % 145}" r="${2.2 + (prime % 7) * .35}" opacity="${.35 + (prime % 5) * .07}"/>`).join('');
    const emberDriftSparks = [
        [24,118,3.2,'#ffb347',.92],[58,166,2.2,'#ff7a18',.78],[86,214,1.7,'#ffd27a',.82],[122,92,2.8,'#ff8c42',.86],
        [154,278,1.9,'#ffc46b',.74],[192,144,2.6,'#ff6a00',.8],[224,238,2.1,'#ffb85c',.76],[256,186,1.6,'#ffd6a1',.68],
        [288,122,2.9,'#ff9433',.88],[318,262,1.8,'#ffb347',.72],[346,154,2.4,'#ff7f2a',.8],[374,102,1.5,'#ffe1ab',.7]
    ].map(([cx, cy, r, fill, opacity]) => `<circle class="ember-drift-spark" cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" opacity="${opacity}"/>`).join('');
    const cipherMarkings = `
        <g id="marking-prime-ticks" class="cipher-marking" stroke="var(--cipher-color)" fill="none">
            <g clip-path="url(#abdomen-shape)">
                <path d="M150 255H250M145 285H255M152 315H248M160 345H240M168 375H232" stroke-width="4" opacity=".44"/>
                <path d="M160 247v28M185 279v28M210 311v28M235 343v28" stroke-width="2.4" opacity=".72"/>
            </g>
            <g clip-path="url(#thorax-shape)">
                <path d="M170 170H230M182 190H218M188 210H212" stroke-width="3" opacity=".5"/>
            </g>
        </g>
        <g id="marking-residue-dots" class="cipher-marking" fill="var(--cipher-color)">
            <g clip-path="url(#thorax-shape)">
                <circle cx="175" cy="175" r="3.2" opacity=".55"/><circle cx="200" cy="168" r="2.4" opacity=".44"/><circle cx="224" cy="178" r="3.1" opacity=".6"/>
                <circle cx="186" cy="203" r="2.5" opacity=".48"/><circle cx="214" cy="208" r="2.8" opacity=".54"/>
            </g>
            <g clip-path="url(#abdomen-shape)">
                <circle cx="154" cy="270" r="3" opacity=".48"/><circle cx="195" cy="284" r="2.2" opacity=".44"/><circle cx="238" cy="272" r="3.4" opacity=".56"/>
                <circle cx="170" cy="322" r="2.8" opacity=".5"/><circle cx="218" cy="330" r="2.2" opacity=".4"/><circle cx="248" cy="348" r="3.2" opacity=".52"/>
                <circle cx="185" cy="382" r="2.4" opacity=".42"/><circle cx="225" cy="396" r="3.2" opacity=".58"/>
            </g>
        </g>
        <g id="marking-cipher-glyphs" class="cipher-marking" stroke="var(--cipher-color)" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <g clip-path="url(#thorax-shape)">
                <path d="M174 172l10 10l-10 10l10 10" stroke-width="3.2" opacity=".78"/>
                <path d="M226 172l-10 10l10 10l-10 10" stroke-width="3.2" opacity=".78"/>
                <circle cx="200" cy="205" r="10" stroke-width="2.2" opacity=".5"/>
            </g>
            <g clip-path="url(#abdomen-shape)">
                <path d="M165 274h25l-12 20z" stroke-width="2.6" opacity=".72"/>
                <path d="M215 304h28m-14-14v28" stroke-width="2.6" opacity=".58"/>
                <path d="M170 360q30-16 60 0q30 16 60 0" stroke-width="2.6" opacity=".5"/>
            </g>
        </g>
        <g id="marking-hash-fragments" class="cipher-marking" stroke="var(--cipher-color)" fill="none" stroke-linecap="round">
            <path d="M112 246l34 18M126 288l42 20M96 334l48 26M256 252l32 18M238 298l44 18M246 348l52 22" stroke-width="2.4" opacity=".42"/>
            <path d="M82 222l20 10M300 222l18 8M72 386l22 12M306 392l24 12" stroke-width="1.8" opacity=".32"/>
        </g>
        <g id="marking-coordinate-arcs" class="cipher-marking" stroke="var(--cipher-color)" fill="none">
            <path d="M120 162q80-44 160 0" stroke-width="2.8" opacity=".42"/>
            <path d="M132 226q68 24 136 0" stroke-width="2.2" opacity=".38"/>
            <path d="M116 286q84-30 168 0" stroke-width="2" opacity=".34"/>
            <path d="M138 352q62 34 124 0" stroke-width="2.4" opacity=".36"/>
            <circle cx="200" cy="250" r="132" stroke-width="1.2" stroke-dasharray="3 15" opacity=".22"/>
        </g>`;

    const template = document.createElement('template');
    template.innerHTML = `
        <style>
    :host{--neon-color:${DEFAULT_NEON_COLOR}
    ;--neon-glow:rgba(255,0,85,0.6);--shell-light:#2a3826;--shell-dark:#111610;--shell-accent:#4a5d43;--eye-color:#cc0000;--eye-glow:#ff0000;--laser-color:#ff0033;--cipher-color:#ffffff;--ambient-color:#ff9900;display:block;position:absolute;inset:0;overflow:visible;pointer-events:auto;}
    .stage{position:relative;width:100%;height:100%;overflow:visible;}
    .cicada-shell{position:absolute;aspect-ratio:1/1;overflow:visible;pointer-events:none;}
    .cicada-shell svg{display:block;width:100%;height:100%;overflow:visible;pointer-events:none;}
    /* Interactive Head Hitbox */
    #head{cursor:crosshair;pointer-events:visiblePainted;}
    #head-hitbox{cursor:crosshair;pointer-events:all;fill:transparent;}
    #head:hover .base-eye,#head:hover .eye-light-accent,#head:hover .eye-style-option{filter:brightness(1.4) drop-shadow(0 0 12px var(--eye-glow));}
    /* Call Animation Visuals */
    .is-calling .base-eye,.is-calling .eye-light-accent,.is-calling .eye-style-option{filter:brightness(2.5) drop-shadow(0 0 30px var(--eye-glow)) !important;animation:none !important;transition:filter 0.1s ease;}
    .cicada-shell[data-rarity-tier="common"] .base-eye{filter:none;}
    .cicada-shell[data-rarity-tier="common"] #head:hover .base-eye{filter:none;}
    .is-calling .cicada-shell[data-rarity-tier="common"] .base-eye{filter:none !important;animation:none !important;opacity:1 !important;}
    .is-calling #laser-beams{filter:brightness(2) saturate(1.5) drop-shadow(0 0 20px var(--laser-color)) !important;opacity:1;transition:filter 0.1s ease,opacity 0.1s ease;}
    /* EXPERIMENTAL LAB: tymbal plates are visual-only call organs. They do not affect rarity or audio. */
    #tymbal-layer{pointer-events:none;filter:drop-shadow(0 0 4px rgba(0,0,0,.5));}
    .tymbal-option{display:none;transform-origin:200px 232px;will-change:transform,opacity,filter;}
    .tymbal-rib,.tymbal-core,.tymbal-node{transform-origin:center;will-change:transform,opacity,filter;}
    .cicada-shell[data-tymbal-layer="bronze-plates"] #tymbal-bronze-plates,
    .cicada-shell[data-tymbal-layer="glass-membranes"] #tymbal-glass-membranes,
    .cicada-shell[data-tymbal-layer="circuit-tymbals"] #tymbal-circuit-tymbals,
    .cicada-shell[data-tymbal-layer="ribbed-speakers"] #tymbal-ribbed-speakers,
    .cicada-shell[data-tymbal-layer="mythic-resonators"] #tymbal-mythic-resonators{display:block;}
    .cicada-shell[data-tymbal-layer="none"] #tymbal-layer{display:none;}
    @keyframes tymbalPulse{0%,100%{transform:scale(1);filter:brightness(1);}35%{transform:scale(1.08);filter:brightness(1.55) drop-shadow(0 0 10px var(--neon-color));}62%{transform:scale(.97);filter:brightness(1.25);}}
    @keyframes tymbalRibBuzz{0%,100%{transform:translateX(0) scaleX(1);opacity:.72;}25%{transform:translateX(-1px) scaleX(1.08);opacity:1;}50%{transform:translateX(1px) scaleX(.94);opacity:.86;}75%{transform:translateX(-.5px) scaleX(1.04);opacity:1;}}
    @keyframes tymbalNodeBlink{0%,100%{opacity:.35;}35%{opacity:1;filter:drop-shadow(0 0 7px var(--neon-color));}65%{opacity:.7;}}
    .is-calling #tymbal-layer .tymbal-option{animation:tymbalPulse .16s infinite ease-in-out;}
    .is-calling #tymbal-layer .tymbal-rib{animation:tymbalRibBuzz .055s infinite linear;}
    .is-calling #tymbal-layer .tymbal-node,.is-calling #tymbal-layer .tymbal-core{animation:tymbalNodeBlink .13s infinite steps(2,end);}
    .is-flying #tymbal-layer{filter:drop-shadow(0 0 6px rgba(0,0,0,.45)) saturate(1.1);}
    #effect-wrapper{transform-origin:200px 250px;will-change:transform,filter,opacity;transition:all 0.3s ease;pointer-events:visiblePainted;cursor:pointer;}
    #cicada-body-group{transform-origin:200px 250px;filter:drop-shadow(0 15px 15px rgba(0,0,0,0.7));transition:filter 0.3s ease;}
    /* WINGS & FLAPPING */
    .wing{transition:transform 0.3s ease;will-change:transform;}
    #left-wing{transform-origin:180px 185px;transform:rotate(-3deg) scaleX(0.92);}
    #right-wing{transform-origin:220px 185px;transform:rotate(3deg) scaleX(0.92);}
    #left-hindwing{transform-origin:180px 185px;transform:rotate(-6deg) scaleX(0.88);}
    #right-hindwing{transform-origin:220px 185px;transform:rotate(6deg) scaleX(0.88);}
    /* LEGS - SLOWED DOWN TRANSITION */
    #legs-layer g{transition:transform 1.25s ease-in-out;}
    #front-leg-left{transform-origin:170px 190px;}
    #front-leg-right{transform-origin:230px 190px;}
    #middle-leg-left{transform-origin:175px 230px;}
    #middle-leg-right{transform-origin:225px 230px;}
    #hind-leg-left{transform-origin:180px 280px;}
    #hind-leg-right{transform-origin:220px 280px;}
    .is-flying #front-leg-left{transform:rotate(40deg) translateY(-8px);}
    .is-flying #front-leg-right{transform:rotate(-40deg) translateY(-8px);}
    .is-flying #middle-leg-left{transform:rotate(-20deg) scaleX(0.7) translateX(5px);}
    .is-flying #middle-leg-right{transform:rotate(20deg) scaleX(0.7) translateX(-5px);}
    .is-flying #hind-leg-left{transform:rotate(-20deg) scaleX(0.65) translateX(5px);}
    .is-flying #hind-leg-right{transform:rotate(20deg) scaleX(0.65) translateX(-5px);}
    @keyframes flapForeLeft{0%,100%{transform:rotate(-7deg) scaleX(0.9) skewY(-2deg);}
    28%{transform:rotate(82deg) scaleX(1.16) scaleY(0.94) skewY(-20deg) translate(-2px,-3px);}
    61%{transform:rotate(88deg) scaleX(1.22) scaleY(0.9) skewY(-24deg) translate(-3px,-4px);}
    }
    @keyframes flapForeRight{0%,100%{transform:rotate(7deg) scaleX(0.9) skewY(2deg);}
    28%{transform:rotate(-82deg) scaleX(1.16) scaleY(0.94) skewY(20deg) translate(2px,-3px);}
    61%{transform:rotate(-88deg) scaleX(1.22) scaleY(0.9) skewY(24deg) translate(3px,-4px);}
    }
    @keyframes flapHindLeft{0%,100%{transform:rotate(-8deg) scaleX(0.88) skewY(-2deg);}
    55%{transform:rotate(63deg) scaleX(1.02) skewY(-13deg) translateY(-2px);}
    }
    @keyframes flapHindRight{0%,100%{transform:rotate(8deg) scaleX(0.88) skewY(2deg);}
    55%{transform:rotate(-63deg) scaleX(1.02) skewY(13deg) translateY(-2px);}
    }
    @keyframes body-vibrate{0%,100%{transform:translate(0,0);}
    25%{transform:translate(1px,-1px);}
    75%{transform:translate(1px,-2px);}
    }
    .is-flying #left-wing{animation:flapForeLeft var(--fore-flap-speed,0.022s) infinite cubic-bezier(.2,.5,.4,1);}
    .is-flying #right-wing{animation:flapForeRight var(--fore-flap-speed,0.022s) infinite cubic-bezier(.2,.5,.4,1);}
    .is-flying #left-hindwing{animation:flapHindLeft var(--hind-flap-speed,0.019s) infinite cubic-bezier(.3,.4,.5,1);}
    .is-flying #right-hindwing{animation:flapHindRight var(--hind-flap-speed,0.019s) infinite cubic-bezier(.3,.4,.5,1);}
    .is-flying #cicada-body-group{animation:body-vibrate var(--body-vibe-speed,0.028s) infinite linear;filter:drop-shadow(0 35px 35px rgba(0,0,0,0.35));}
    .is-taking-off #cicada-body-group{filter:drop-shadow(0 24px 24px rgba(0,0,0,0.48));}
    .is-landing #cicada-body-group{filter:drop-shadow(0 18px 18px rgba(0,0,0,0.62));}
    /* WIREFRAME & RAINBOW */
    .is-wireframe #cicada-body-group:is(path,ellipse,circle,rect){fill:transparent !important;stroke:var(--neon-color);transition:stroke 0.3s;}
    .is-wireframe #cicada-body-group{filter:drop-shadow(0 0 8px var(--neon-color)) drop-shadow(0 0 20px var(--neon-glow));}
    .is-wireframe .laser polygon{fill:transparent !important;stroke:var(--laser-color);stroke-width:2;}
    @keyframes spectralHue{0%,100%{stroke:#ff3355;filter:drop-shadow(0 0 8px rgba(255,51,85,0.85));}
    33%{stroke:#ffe600;filter:drop-shadow(0 0 8px rgba(255,230,0,0.9));}
    66%{stroke:#00eaff;filter:drop-shadow(0 0 10px rgba(0,234,255,0.95));}
    }
    .is-rainbow.is-wireframe #cicada-body-group:is(path,ellipse,circle,rect){animation:spectralHue 3.2s infinite linear;stroke-width:2.2;}
    .is-rainbow #cicada-body-group{filter:brightness(1.2) saturate(1.5);}
    /* === TRAIT STYLES === */

    /* Low-tier wing restraint: Common and Uncommon keep transparent, neutral wings. */
    .cicada-shell[data-rarity-tier="common"] .wing-element{opacity:.78;filter:saturate(.38) brightness(.86);}
    .cicada-shell[data-rarity-tier="uncommon"] .wing-element{opacity:.86;filter:saturate(.55) brightness(.92);}
    .cicada-shell[data-rarity-tier="common"] .wing-element path,.cicada-shell[data-rarity-tier="uncommon"] .wing-element path{stroke:rgba(214,230,222,.42);}
    .cicada-shell[data-rarity-tier="common"] #tymbal-layer,.cicada-shell[data-rarity-tier="uncommon"] #tymbal-layer{opacity:.72;}
    /* NORMAL WING VEINS: official subtle biological detail for glass wings only. */
    @keyframes wingIdleSway{from{transform:rotate(calc(var(--wing-idle-amp,.5deg) * -1));}to{transform:rotate(var(--wing-idle-amp,.5deg));}}
    .wing-rim{fill:none;stroke:var(--shell-light);pointer-events:none;}
    .wing-sheen{fill:none;stroke:#ffffff;stroke-linecap:round;pointer-events:none;mix-blend-mode:screen;}
    .wing-fold{fill:none;stroke:var(--shell-light);stroke-linecap:round;pointer-events:none;}
    .is-flying .wing-micro-idle{animation:none !important;}
    @keyframes legGroundFidget{from{transform:rotate(calc(var(--leg-fidget-amp,.5deg) * -1)) translateY(0);}55%{transform:rotate(calc(var(--leg-fidget-amp,.5deg) * .4)) translateY(calc(var(--leg-fidget-lift,.3px) * -1));}to{transform:rotate(var(--leg-fidget-amp,.5deg)) translateY(0);}}
    .is-flying .leg-ground-fidget,.is-taking-off .leg-ground-fidget,.is-landing .leg-ground-fidget{animation:none !important;}

    /* v11.3.5 GROUND WANDER: seeded walking. The shell strolls a short seeded
       path while landed; legs scuttle in an alternating gait, the body bobs,
       and flight/takeoff/landing always override. */
    /* Walking is solved in JS so stance feet remain fixed to the bark. */
    .cicada-shell.is-walking:not(.is-flying) #legs-layer .leg-unit{animation:none !important;}

    /* v11.3.5 WING SHUFFLE: a quick seeded resettle — the wings flick out,
       rustle, and fold back. One-shot; never runs while flying. */
    @keyframes wingShuffleFL{0%,100%{transform:rotate(-3deg) scaleX(0.92);}16%{transform:rotate(calc(-3deg - var(--wing-shuffle-amp,13deg))) scaleX(0.97);}34%{transform:rotate(-6deg) scaleX(0.93);}52%{transform:rotate(calc(-3deg - var(--wing-shuffle-amp,13deg) * .6)) scaleX(0.95);}72%{transform:rotate(-4.5deg) scaleX(0.92);}}
    @keyframes wingShuffleFR{0%,100%{transform:rotate(3deg) scaleX(0.92);}16%{transform:rotate(calc(3deg + var(--wing-shuffle-amp,13deg))) scaleX(0.97);}34%{transform:rotate(6deg) scaleX(0.93);}52%{transform:rotate(calc(3deg + var(--wing-shuffle-amp,13deg) * .6)) scaleX(0.95);}72%{transform:rotate(4.5deg) scaleX(0.92);}}
    @keyframes wingShuffleHL{0%,100%{transform:rotate(-6deg) scaleX(0.88);}24%{transform:rotate(calc(-6deg - var(--wing-shuffle-amp,13deg) * .5)) scaleX(0.90);}58%{transform:rotate(-8deg) scaleX(0.88);}}
    @keyframes wingShuffleHR{0%,100%{transform:rotate(6deg) scaleX(0.88);}24%{transform:rotate(calc(6deg + var(--wing-shuffle-amp,13deg) * .5)) scaleX(0.90);}58%{transform:rotate(8deg) scaleX(0.88);}}
    .cicada-shell.is-wing-shuffling:not(.is-flying) #left-wing{animation:wingShuffleFL var(--wing-shuffle-dur,.9s) ease-out;}
    .cicada-shell.is-wing-shuffling:not(.is-flying) #right-wing{animation:wingShuffleFR var(--wing-shuffle-dur,.9s) ease-out;}
    .cicada-shell.is-wing-shuffling:not(.is-flying) #left-hindwing{animation:wingShuffleHL var(--wing-shuffle-dur,.9s) ease-out;}
    .cicada-shell.is-wing-shuffling:not(.is-flying) #right-hindwing{animation:wingShuffleHR var(--wing-shuffle-dur,.9s) ease-out;}

    /* v11.3.7 WING GESTURE REPERTOIRE — one-shot, seeded, never while flying.
       Each gesture has a distinct character and trigger:
       - FLICK: sharp snap-out/snap-back (startle, dust-shake, post-landing resettle)
       - TREMBLE: rapid tiny quiver (post-call wind-down, pre-flight nerves)
       - ONE-WING FLICK: a single forewing grooms itself (idle subconscious tic)
       - STRETCH: slow deliberate part-hold-fold (comfort move, rare) */
    @keyframes wingFlickFL{0%,100%{transform:rotate(-3deg) scaleX(0.92);}12%{transform:rotate(calc(-3deg - var(--wing-flick-amp,20deg))) scaleX(0.97);}34%{transform:rotate(-1.2deg) scaleX(0.91);}58%{transform:rotate(-3.8deg) scaleX(0.92);}}
    @keyframes wingFlickFR{0%,100%{transform:rotate(3deg) scaleX(0.92);}12%{transform:rotate(calc(3deg + var(--wing-flick-amp,20deg))) scaleX(0.97);}34%{transform:rotate(1.2deg) scaleX(0.91);}58%{transform:rotate(3.8deg) scaleX(0.92);}}
    @keyframes wingFlickHL{0%,100%{transform:rotate(-6deg) scaleX(0.88);}20%{transform:rotate(calc(-6deg - var(--wing-flick-amp,20deg) * .45)) scaleX(0.90);}52%{transform:rotate(-6.8deg) scaleX(0.88);}}
    @keyframes wingFlickHR{0%,100%{transform:rotate(6deg) scaleX(0.88);}20%{transform:rotate(calc(6deg + var(--wing-flick-amp,20deg) * .45)) scaleX(0.90);}52%{transform:rotate(6.8deg) scaleX(0.88);}}
    .cicada-shell.is-wing-flicking:not(.is-flying) #left-wing{animation:wingFlickFL var(--wing-flick-dur,.24s) cubic-bezier(.2,.9,.3,1);}
    .cicada-shell.is-wing-flicking:not(.is-flying) #right-wing{animation:wingFlickFR var(--wing-flick-dur,.24s) cubic-bezier(.2,.9,.3,1);}
    .cicada-shell.is-wing-flicking:not(.is-flying) #left-hindwing{animation:wingFlickHL var(--wing-flick-dur,.24s) cubic-bezier(.2,.9,.3,1);}
    .cicada-shell.is-wing-flicking:not(.is-flying) #right-hindwing{animation:wingFlickHR var(--wing-flick-dur,.24s) cubic-bezier(.2,.9,.3,1);}

    @keyframes wingTrembleL{from{transform:rotate(calc(-3deg - var(--wing-tremble-amp,1.6deg))) scaleX(0.92);}to{transform:rotate(calc(-3deg + var(--wing-tremble-amp,1.6deg))) scaleX(0.925);}}
    @keyframes wingTrembleR{from{transform:rotate(calc(3deg + var(--wing-tremble-amp,1.6deg))) scaleX(0.92);}to{transform:rotate(calc(3deg - var(--wing-tremble-amp,1.6deg))) scaleX(0.925);}}
    .cicada-shell.is-wing-trembling:not(.is-flying) #left-wing{animation:wingTrembleL var(--wing-tremble-beat,.07s) linear var(--wing-tremble-reps,10) alternate;}
    .cicada-shell.is-wing-trembling:not(.is-flying) #right-wing{animation:wingTrembleR var(--wing-tremble-beat,.07s) linear var(--wing-tremble-reps,10) alternate;}

    .cicada-shell.is-wing-flicking-left:not(.is-flying) #left-wing{animation:wingFlickFL var(--wing-flick-dur,.24s) cubic-bezier(.2,.9,.3,1);}
    .cicada-shell.is-wing-flicking-left:not(.is-flying) #left-hindwing{animation:wingFlickHL var(--wing-flick-dur,.24s) cubic-bezier(.2,.9,.3,1);}
    .cicada-shell.is-wing-flicking-right:not(.is-flying) #right-wing{animation:wingFlickFR var(--wing-flick-dur,.24s) cubic-bezier(.2,.9,.3,1);}
    .cicada-shell.is-wing-flicking-right:not(.is-flying) #right-hindwing{animation:wingFlickHR var(--wing-flick-dur,.24s) cubic-bezier(.2,.9,.3,1);}

    @keyframes wingStretchFL{0%,100%{transform:rotate(-3deg) scaleX(0.92);}26%{transform:rotate(calc(-3deg - var(--wing-stretch-amp,17deg))) scaleX(0.99);}58%{transform:rotate(calc(-3deg - var(--wing-stretch-amp,17deg) * .92)) scaleX(0.985);}}
    @keyframes wingStretchFR{0%,100%{transform:rotate(3deg) scaleX(0.92);}26%{transform:rotate(calc(3deg + var(--wing-stretch-amp,17deg))) scaleX(0.99);}58%{transform:rotate(calc(3deg + var(--wing-stretch-amp,17deg) * .92)) scaleX(0.985);}}
    @keyframes wingStretchHL{0%,100%{transform:rotate(-6deg) scaleX(0.88);}30%{transform:rotate(calc(-6deg - var(--wing-stretch-amp,17deg) * .7)) scaleX(0.92);}60%{transform:rotate(calc(-6deg - var(--wing-stretch-amp,17deg) * .62)) scaleX(0.915);}}
    @keyframes wingStretchHR{0%,100%{transform:rotate(6deg) scaleX(0.88);}30%{transform:rotate(calc(6deg + var(--wing-stretch-amp,17deg) * .7)) scaleX(0.92);}60%{transform:rotate(calc(6deg + var(--wing-stretch-amp,17deg) * .62)) scaleX(0.915);}}
    .cicada-shell.is-wing-stretching:not(.is-flying) #left-wing{animation:wingStretchFL var(--wing-stretch-dur,3s) ease-in-out;}
    .cicada-shell.is-wing-stretching:not(.is-flying) #right-wing{animation:wingStretchFR var(--wing-stretch-dur,3s) ease-in-out;}
    .cicada-shell.is-wing-stretching:not(.is-flying) #left-hindwing{animation:wingStretchHL var(--wing-stretch-dur,3s) ease-in-out;}
    .cicada-shell.is-wing-stretching:not(.is-flying) #right-hindwing{animation:wingStretchHR var(--wing-stretch-dur,3s) ease-in-out;}
    .normal-wing-veins{display:none;fill:none;stroke:var(--normal-wing-vein-color,rgba(218,232,224,.62));stroke-linecap:round;stroke-linejoin:round;pointer-events:none;mix-blend-mode:screen;}
    .normal-wing-veins .vein-main{stroke-width:1.55;opacity:.72;}
    .normal-wing-veins .vein-cross{stroke-width:1.05;opacity:.48;}
    .normal-wing-veins .vein-structured{display:none;stroke-width:.9;opacity:.38;}
    .cicada-shell[data-wing="glass"][data-normal-wing-veins="faint-veins"] .normal-wing-veins{display:block;opacity:.15;}
    .cicada-shell[data-wing="glass"][data-normal-wing-veins="soft-veins"] .normal-wing-veins{display:block;opacity:.23;}
    .cicada-shell[data-wing="glass"][data-normal-wing-veins="structured-veins"] .normal-wing-veins{display:block;opacity:.31;}
    .cicada-shell[data-wing="glass"][data-normal-wing-veins="structured-veins"] .vein-structured{display:block;}
    .cicada-shell[data-rarity-tier="common"][data-normal-wing-veins="faint-veins"] .normal-wing-veins{opacity:.13;}
    .cicada-shell[data-rarity-tier="common"][data-normal-wing-veins="soft-veins"] .normal-wing-veins{opacity:.18;}
    .cicada-shell[data-rarity-tier="uncommon"][data-normal-wing-veins="structured-veins"] .normal-wing-veins{opacity:.27;}

    /* NORMAL WING TINT: subtle membrane colouration for glass wings only. */
    .normal-wing-tint{display:none;pointer-events:none;mix-blend-mode:multiply;fill:var(--normal-wing-tint-color,rgba(255,255,255,.04));}
    .cicada-shell[data-wing="glass"][data-normal-wing-tint="smoke-grey"] .normal-wing-tint,
    .cicada-shell[data-wing="glass"][data-normal-wing-tint="warm-amber"] .normal-wing-tint,
    .cicada-shell[data-wing="glass"][data-normal-wing-tint="olive-smoke"] .normal-wing-tint,
    .cicada-shell[data-wing="glass"][data-normal-wing-tint="cool-blue-grey"] .normal-wing-tint{display:block;opacity:var(--normal-wing-tint-opacity,.10);}
    .cicada-shell[data-rarity-tier="common"] .normal-wing-tint{opacity:calc(var(--normal-wing-tint-opacity,.10) * .92);}

    /* NORMAL WING EDGE WEAR: tiny nicks and frays for restrained natural wings. */
    .normal-wing-edge-wear{display:none;pointer-events:none;fill:var(--wing-wear-cutout,#0b110e);opacity:.95;}
    .normal-wing-edge-wear .edge-notch.soft{display:none;}
    .normal-wing-edge-wear .edge-notch.fray{display:none;}
    .normal-wing-edge-wear .edge-notch.tear{display:none;}
    .cicada-shell[data-wing="glass"][data-normal-wing-edge="soft-nicks"] .normal-wing-edge-wear,
    .cicada-shell[data-wing="glass"][data-normal-wing-edge="minor-fray"] .normal-wing-edge-wear,
    .cicada-shell[data-wing="glass"][data-normal-wing-edge="tiny-tears"] .normal-wing-edge-wear{display:block;}
    .cicada-shell[data-wing="glass"][data-normal-wing-edge="soft-nicks"] .normal-wing-edge-wear .edge-notch.soft{display:block;}
    .cicada-shell[data-wing="glass"][data-normal-wing-edge="minor-fray"] .normal-wing-edge-wear .edge-notch.soft,
    .cicada-shell[data-wing="glass"][data-normal-wing-edge="minor-fray"] .normal-wing-edge-wear .edge-notch.fray{display:block;}
    .cicada-shell[data-wing="glass"][data-normal-wing-edge="tiny-tears"] .normal-wing-edge-wear .edge-notch.soft,
    .cicada-shell[data-wing="glass"][data-normal-wing-edge="tiny-tears"] .normal-wing-edge-wear .edge-notch.fray,
    .cicada-shell[data-wing="glass"][data-normal-wing-edge="tiny-tears"] .normal-wing-edge-wear .edge-notch.tear{display:block;}
    /* WING PATTERNS */
    .cicada-shell[data-wing="circuit"] .wing-element path{fill:url(#pat-circuit);}
    .cicada-shell[data-wing="hex"] .wing-element path{fill:url(#pat-hex);}
    .cicada-shell[data-wing="prism"] .wing-element path{fill:url(#pat-prism);}
    .cicada-shell[data-wing="stellar"] .wing-element path{fill:url(#pat-stellar);}
    .cicada-shell[data-wing="corrupt"] .wing-element path{fill:url(#pat-circuit);filter:hue-rotate(110deg) saturate(1.8) contrast(1.3);}
    .cicada-shell[data-wing="stained-glass"] .wing-element path{fill:url(#pat-stained-glass);stroke:var(--neon-color);stroke-width:2;}
    .cicada-shell[data-wing="vein-map"] .wing-element path{fill:url(#pat-vein-map);filter:contrast(1.25) saturate(1.2);}
    .cicada-shell[data-wing="rain-map"] .wing-element path{fill:url(#pat-rain-map);}
    .cicada-shell[data-wing="sonar-rings"] .wing-element path{fill:url(#pat-sonar-rings);}
    /* WING SHAPES */
    .cicada-shell[data-wing-shape="classic"] .wing-shape-dragonfly,.cicada-shell[data-wing-shape="classic"] .wing-shape-moth{display:none;}
    .cicada-shell[data-wing-shape="dragonfly"] .wing-shape-classic,.cicada-shell[data-wing-shape="dragonfly"] .wing-shape-moth{display:none;}
    .cicada-shell[data-wing-shape="moth"] .wing-shape-classic,.cicada-shell[data-wing-shape="moth"] .wing-shape-dragonfly{display:none;}
    /* ANTENNAE */
    .cicada-shell[data-antennae="none"] #ant-classic,.cicada-shell[data-antennae="none"] #ant-moth,.cicada-shell[data-antennae="none"] #ant-cyber{display:none;}
    .cicada-shell[data-antennae="classic"] #ant-moth,.cicada-shell[data-antennae="classic"] #ant-cyber{display:none;}
    .cicada-shell[data-antennae="moth"] #ant-classic,.cicada-shell[data-antennae="moth"] #ant-cyber{display:none;}
    .cicada-shell[data-antennae="cyber"] #ant-classic,.cicada-shell[data-antennae="cyber"] #ant-moth{display:none;}
    /* ANTENNAE VARIANTS */
    .antennae-variant-option {
        display: none;
    }

    .cicada-shell[data-antennae="none"] #antennae-variant-overlay {
        display: none;
    }

    /* Current tip coordinates match the classic antenna endpoints only */
    .cicada-shell[data-antennae="classic"][data-antennae-variant="hooked-tips"] #ant-variant-hooked-tips,
    .cicada-shell[data-antennae="classic"][data-antennae-variant="sensor-tips"] #ant-variant-sensor-tips {
        display: inline;
    }
    /* OCULAR MUTATIONS & BEHAVIORS */
    .base-eye{fill:var(--eye-color);filter:drop-shadow(0 0 8px var(--eye-glow));transition:fill 0.3s;}
    .eye-light-accent{display:none;fill:#fff;opacity:.82;filter:drop-shadow(0 0 8px var(--eye-glow));transition:fill 0.3s, opacity 0.3s;}
    .eye-style-option{display:none;pointer-events:none;transition:opacity .25s ease, filter .25s ease;}
    .eye-style-stroke{fill:none;stroke:var(--eye-style-color);filter:drop-shadow(0 0 10px var(--eye-style-glow));}
    .eye-style-fill{fill:var(--eye-style-color);filter:drop-shadow(0 0 8px var(--eye-style-glow));}
    .eye-style-white{fill:var(--eye-style-alt-color);opacity:.84;filter:drop-shadow(0 0 8px var(--eye-style-glow));}
    .eye-style-warm{fill:var(--eye-style-alt-color);opacity:.86;filter:drop-shadow(0 0 8px var(--eye-style-alt-glow));}
    .eye-style-dashed{stroke-dasharray:5 5;}
    .eye-style-thin{stroke-width:1.35;}
    .eye-style-mid{stroke-width:2.1;}
    .eye-style-bold{stroke-width:2.6;}
    .cicada-shell[data-rarity-tier="rare"] .eye-light-accent,.cicada-shell[data-rarity-tier="epic"] .eye-light-accent,.cicada-shell[data-rarity-tier="legendary"] .eye-light-accent,.cicada-shell[data-rarity-tier="mythic"] .eye-light-accent{display:block;}
    .cicada-shell[data-eye-style="halo-single"] .eye-style-halo-single,
    .cicada-shell[data-eye-style="halo-double"] .eye-style-halo-single,
    .cicada-shell[data-eye-style="halo-double"] .eye-style-halo-double,
    .cicada-shell[data-eye-style="brow-arcs"] .eye-style-brow-arcs,
    .cicada-shell[data-eye-style="side-flares"] .eye-style-side-flares,
    .cicada-shell[data-eye-style="top-glints"] .eye-style-top-glints,
    .cicada-shell[data-eye-style="orbit-dots"] .eye-style-orbit-dots,
    .cicada-shell[data-eye-style="lower-crescents"] .eye-style-lower-crescents,
    .cicada-shell[data-eye-style="bracket-corners"] .eye-style-bracket-corners,
    .cicada-shell[data-eye-style="scan-bars"] .eye-style-scan-bars,
    .cicada-shell[data-eye-style="ember-specks"] .eye-style-ember-specks{display:block;}
    .eye-orbit-left{transform-origin:143px 128px;animation:eyeOrbitLeft 3.2s linear infinite;}
    .eye-orbit-right{transform-origin:257px 128px;animation:eyeOrbitRight 3.8s linear infinite;}
    .eye-orbit-centre{transform-origin:200px 128px;animation:eyeOrbitLeft 3.5s linear infinite;}
    @keyframes eyeOrbitLeft{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
    @keyframes eyeOrbitRight{from{transform:rotate(360deg);}to{transform:rotate(0deg);}}
    .cicada-shell[data-eye="classic"] #eye-void,.cicada-shell[data-eye="classic"] #eye-cyclops{display:none;}
    .cicada-shell[data-eye="void"] #eye-classic,.cicada-shell[data-eye="void"] #eye-cyclops{display:none;}
    .cicada-shell[data-eye="cyclops"] #eye-classic,.cicada-shell[data-eye="cyclops"] #eye-void{display:none;}
    @keyframes eyeStrobe{0%,49%{opacity:1;}
    50%,100%{opacity:0;}
    }
    @keyframes eyeBreathe{0%{opacity:0.3;filter:brightness(0.5);}
    100%{opacity:1;filter:brightness(1.5) drop-shadow(0 0 15px var(--eye-glow));}
    }
    @keyframes eyeRGB{0%,100%{fill:#ff0055;filter:drop-shadow(0 0 10px #ff0055);}
    33%{fill:#00ff88;filter:drop-shadow(0 0 10px #00ff88);}
    66%{fill:#0088ff;filter:drop-shadow(0 0 10px #0088ff);}
    }
    .cicada-shell[data-eye-behavior="strobe"] .base-eye,.cicada-shell[data-eye-behavior="strobe"] .eye-light-accent,.cicada-shell[data-eye-behavior="strobe"] .eye-style-option{animation:eyeStrobe 0.08s infinite steps(2);}
    .cicada-shell[data-eye-behavior="breathe"] .base-eye,.cicada-shell[data-eye-behavior="breathe"] .eye-light-accent,.cicada-shell[data-eye-behavior="breathe"] .eye-style-option{animation:eyeBreathe 1.5s infinite alternate ease-in-out;}
    .cicada-shell[data-eye-behavior="rgb"] .base-eye,.cicada-shell[data-eye-behavior="rgb"] .eye-light-accent,.cicada-shell[data-eye-behavior="rgb"] .eye-style-option{animation:eyeRGB 4s infinite linear;}
    .cicada-shell[data-eye-behavior="scanner"] .base-eye,.cicada-shell[data-eye-behavior="scanner"] .eye-light-accent,.cicada-shell[data-eye-behavior="scanner"] .eye-style-option{animation:eyeScanner .85s infinite alternate ease-in-out;}
        @keyframes eyeScanner{0%{filter:brightness(.7) drop-shadow(-10px 0 6px var(--eye-glow));}100%{filter:brightness(2.4) drop-shadow(10px 0 16px var(--eye-glow));}}
    /* LASER EYES */
    .cicada-shell[data-laser="none"] #laser-beams{display:none;}
    #laser-beams{pointer-events:none;mix-blend-mode:screen;opacity:var(--laser-opacity,0);filter:brightness(var(--laser-brightness,0.7)) saturate(var(--laser-saturation,0.8)) drop-shadow(0 0 var(--laser-glow,0px) var(--laser-color));transition:opacity 0.12s linear,filter 0.2s ease;}
    .laser-left{transform-origin:143px 128px;}
    .laser-right{transform-origin:257px 128px;}
    .laser{opacity:0.9;transform:scaleY(var(--laser-length,0.001));transform-box:view-box;transition:transform 0.12s linear;}
    .is-calling{--laser-length:1;--laser-opacity:1;--laser-brightness:2;--laser-saturation:1.5;--laser-glow:20px;}
    .is-flying #laser-beams{opacity:var(--laser-opacity,0.9);}
    .is-landing #laser-beams{opacity:var(--laser-opacity,0.15);}
    .cicada-shell[data-laser="straight"].is-flying .laser,.cicada-shell[data-laser="straight"].is-calling .laser{animation:laserShimmer 0.1s infinite alternate;}
    @keyframes laserShimmer{0%{opacity:0.72;}
    100%{opacity:1;filter:brightness(1.2);}
    }
    .cicada-shell[data-laser="sweeping"].is-flying .laser-left,.cicada-shell[data-laser="sweeping"].is-calling .laser-left{animation:sweepL 2s ease-in-out infinite alternate;}
    .cicada-shell[data-laser="sweeping"].is-flying .laser-right,.cicada-shell[data-laser="sweeping"].is-calling .laser-right{animation:sweepR 2s ease-in-out infinite alternate;}
    @keyframes sweepL{0%{transform:rotate(-25deg) scaleY(var(--laser-length,1));}
    100%{transform:rotate(15deg) scaleY(var(--laser-length,1));}
    }
    @keyframes sweepR{0%{transform:rotate(-15deg) scaleY(var(--laser-length,1));}
    100%{transform:rotate(25deg) scaleY(var(--laser-length,1));}
    }
    /* LEG MUTATIONS */
    #legs-layer .leg-shadow{opacity:.42;}
    #legs-layer .leg-detail{stroke:var(--shell-accent);opacity:.55;}
    #legs-layer .leg-anchor{fill:var(--shell-light);stroke:var(--shell-dark);stroke-width:1.4;}
    #legs-layer .leg-anchor-mid{fill:var(--shell-dark);stroke:var(--shell-accent);stroke-width:.9;opacity:.85;}
    #legs-layer .leg-pad{fill:var(--shell-dark);stroke:var(--shell-accent);stroke-width:1;opacity:.95;}
    .cicada-shell[data-legs="mecha"] #legs-layer .leg-upper{stroke-dasharray:6 4;stroke-linecap:square;}
    .cicada-shell[data-legs="mecha"] #legs-layer .leg-lower{stroke-dasharray:5 3;stroke-linecap:square;}
    .cicada-shell[data-legs="mecha"] #legs-layer .leg-tip{stroke-dasharray:3 2;stroke-linecap:square;}
    .cicada-shell[data-legs="mecha"] #legs-layer .leg-shadow{stroke-dasharray:6 4;opacity:.3;}
    .cicada-shell[data-legs="mecha"] #legs-layer .leg-detail{stroke:var(--neon-color);opacity:.85;}
    .cicada-shell[data-legs="mecha"] #legs-layer .leg-anchor{fill:var(--shell-dark);stroke:var(--neon-color);stroke-width:1.2;}
    .cicada-shell[data-legs="mecha"] #legs-layer .leg-pad{stroke:var(--neon-color);}
    /* ABDOMEN ENGRAVINGS & BANDS */
    .cicada-shell g[id^="abd-"]{display:none;}
    .cicada-shell[data-abdomen="smooth"] #abd-classic{display:block;}
    .cicada-shell[data-abdomen="ribbed"] #abd-ribbed{display:block;}
    .cicada-shell[data-abdomen="barcode"] #abd-barcode{display:block;}
    .cicada-shell[data-abdomen="plating"] #abd-plating{display:block;}
    .cicada-shell[data-abdomen="glyph"] #abd-glyph{display:block;}
    .cicada-shell[data-abdomen="banded-straight"] #abd-banded-straight{display:block;}
    .cicada-shell[data-abdomen="banded-curved"] #abd-banded-curved{display:block;}
    .cicada-shell[data-abdomen="twotone-straight"] #abd-twotone-straight{display:block;}
    .cicada-shell[data-abdomen="twotone-curved"] #abd-twotone-curved{display:block;}
    .cicada-shell[data-abdomen="rainbow-straight"] #abd-rainbow-straight{display:block;}
    .cicada-shell[data-abdomen="rainbow-curved"] #abd-rainbow-curved{display:block;}
    .cicada-shell[data-abdomen="oil-slick-bands"] #abd-oil-slick-bands{display:block;mix-blend-mode:screen;filter:saturate(1.8) hue-rotate(0deg);animation:traitHue 5s infinite linear;}
    .cicada-shell[data-abdomen="tartan-bands"] #abd-tartan-bands{display:block;}
    .cicada-shell[data-abdomen="molten-cracks"] #abd-molten-cracks{display:block;}
    .cicada-shell[data-abdomen="neon-cells"] #abd-neon-cells{display:block;}
    .cicada-shell[data-abdomen="bone-segments"] #abd-bone-segments{display:block;}

    #abdomen-pattern-layer{transform-origin:200px 335px;transition:transform .28s ease;}
    .abdomen-variant-option{display:none;pointer-events:none;}
    .cicada-shell[data-abdomen-variant="thin-bands"] #abdomen-pattern-layer{transform:translateY(4px) scaleY(.9) scaleX(.97);}
    .cicada-shell[data-abdomen-variant="wide-bands"] #abdomen-pattern-layer{transform:translateY(-3px) scaleY(1.08) scaleX(1.02);}
    .cicada-shell[data-abdomen-variant="offset-bands"] #abdomen-pattern-layer{transform:translateX(8px) rotate(2deg);} 
    .cicada-shell[data-abdomen-variant="broken-bands"] #abd-variant-broken-bands{display:block;}
    .cicada-shell[data-abdomen-variant="centre-spine"] #abd-variant-centre-spine{display:block;}
    .cicada-shell[data-abdomen-variant="double-spine"] #abd-variant-double-spine{display:block;}
    .cicada-shell[data-abdomen-variant="asymmetric-left"] #abdomen-pattern-layer{transform:translateX(-7px) skewX(-3deg);} 
    .cicada-shell[data-abdomen-variant="asymmetric-left"] #abd-variant-asymmetric-left{display:block;}
    .cicada-shell[data-abdomen-variant="asymmetric-right"] #abdomen-pattern-layer{transform:translateX(7px) skewX(3deg);} 
    .cicada-shell[data-abdomen-variant="asymmetric-right"] #abd-variant-asymmetric-right{display:block;}
    @keyframes traitHue{100%{filter:saturate(1.8) hue-rotate(360deg);}}
    /* SKIN & MATERIAL PATTERNS */
    ${skinCssRules}
    /* ETHEREAL AURA */
    .cicada-shell[data-aura="none"] .aura{display:none;}
    .cicada-shell[data-aura="halo"] #aura-orbit{display:none;}
    .cicada-shell[data-aura="orbit"] #aura-halo{display:none;}
    @keyframes spinHalo{100%{transform:rotate(360deg);}
    }
    @keyframes spinOrbitRev{100%{transform:rotate(-360deg);}
    }
    .aura{transform-origin:200px 250px;mix-blend-mode:screen;}
    #aura-halo{animation:spinHalo 20s linear infinite;}
    #aura-orbit .ring-1{animation:spinHalo 10s linear infinite;transform-origin:200px 250px;}
    #aura-orbit .ring-2{animation:spinOrbitRev 15s linear infinite;transform-origin:200px 250px;}
    #aura-orbit .ring-3{animation:spinHalo 8s linear infinite;transform-origin:200px 250px;}
    /* === EFFECTS LAYER === */
    .glitch-layer{display:block;opacity:0;pointer-events:none;mix-blend-mode:screen;transition:opacity 0.35s ease-out;animation:none;clip-path:inset(0 0 0 0);}
    .is-glitch.is-landing #effect-wrapper{animation:none;}
    .cicada-shell[data-glitch-style="whole-body-rgb-split"].is-glitch.is-flying #effect-wrapper{filter:drop-shadow(18px 0 0 rgba(0,255,255,.55)) drop-shadow(-18px 0 0 rgba(255,0,255,.55));animation:wholeRgbSplit .16s infinite steps(2);}
    .cicada-shell[data-glitch-style="whole-body-rgb-split"].is-glitch.is-flying .glitch-layer-1{opacity:.28;filter:drop-shadow(24px 0 0 rgba(0,255,255,.4));}
    .cicada-shell[data-glitch-style="whole-body-rgb-split"].is-glitch.is-flying .glitch-layer-2{opacity:.24;filter:drop-shadow(-24px 0 0 rgba(255,0,255,.38));}
    .cicada-shell[data-glitch-style="double-vision"].is-glitch.is-flying #effect-wrapper{filter:drop-shadow(26px 8px 0 rgba(255,255,255,.22)) drop-shadow(-20px -6px 0 rgba(0,255,136,.28));animation:doubleVision 1.4s infinite ease-in-out alternate;}
    .cicada-shell[data-glitch-style="focus-drift"].is-glitch.is-flying #effect-wrapper{animation:focusDrift 2.2s infinite ease-in-out alternate;filter:blur(.7px) drop-shadow(0 0 18px var(--neon-color));}
    .cicada-shell[data-glitch-style="datamosh-smear"].is-glitch.is-flying #effect-wrapper{animation:datamoshSmear .55s infinite steps(3);filter:saturate(2) contrast(1.35);}
                @keyframes wholeRgbSplit{0%{transform:translate(-2px,1px) skewX(-1deg);}100%{transform:translate(3px,-1px) skewX(1deg);}}
    @keyframes doubleVision{0%{transform:translate(-6px,2px) scale(1.01);}100%{transform:translate(7px,-2px) scale(.995);}}
    @keyframes focusDrift{0%{transform:scale(.985) translate(-8px,5px);filter:blur(2.5px) drop-shadow(0 0 20px var(--neon-color));}50%{filter:blur(0) drop-shadow(0 0 8px var(--neon-color));}100%{transform:scale(1.015) translate(9px,-5px);filter:blur(1.3px) drop-shadow(0 0 30px var(--neon-color));}}
    @keyframes datamoshSmear{0%{transform:translate(0,0) scaleX(1);}33%{transform:translate(16px,-2px) scaleX(1.08);}66%{transform:translate(-13px,3px) scaleX(.94);}100%{transform:translate(4px,-1px) scaleX(1.03);}}
            
    /* PRIME FIELD + AMBIENT CIPHER: mathematical movement layers for Epic+ cicadas */
    .cipher-markings-layer{display:none;pointer-events:none;mix-blend-mode:screen;opacity:.72;}
    .cipher-marking{display:none;vector-effect:non-scaling-stroke;}
    .cicada-shell[data-marking-layer="prime-ticks"] #marking-prime-ticks{display:block;}
    .cicada-shell[data-marking-layer="residue-dots"] #marking-residue-dots{display:block;}
    .cicada-shell[data-marking-layer="cipher-glyphs"] #marking-cipher-glyphs{display:block;}
    .cicada-shell[data-marking-layer="hash-fragments"] #marking-hash-fragments{display:block;}
    .cicada-shell[data-marking-layer="coordinate-arcs"] #marking-coordinate-arcs{display:block;}
    .cicada-shell:not([data-marking-layer="none"]) #cipher-markings-layer{display:block;}
    .ambient-field-layer,.motion-field-layer{display:none;pointer-events:none;mix-blend-mode:screen;transform-origin:200px 250px;}
    .ambient-field-layer{opacity:.54;filter:drop-shadow(0 0 8px rgba(255,255,255,.08));}
    .motion-field-layer{opacity:.78;}
    .motion-field-option,.ambient-field-option{display:none;transform-origin:200px 250px;}
    .cicada-shell:not([data-motion-field="none"]) #motion-field-layer{display:block;}
    .cicada-shell:not([data-ambient-field="none"]) #ambient-field-layer{display:block;}
    .motion-field-layer *,.ambient-field-layer *{vector-effect:non-scaling-stroke;}
    .cicada-shell[data-motion-field="ulam-spiral"] #motion-ulam-spiral{display:block;animation:motionPulse 5.1s ease-in-out infinite alternate;}
    .cicada-shell[data-motion-field="twin-prime-orbit"] #motion-twin-prime-orbit{display:block;animation:motionSpin 19s linear infinite;}
    .cicada-shell[data-motion-field="prime-gap-sweep"] #motion-prime-gap-sweep{display:block;animation:motionSpin 11s linear infinite;}
    .cicada-shell[data-motion-field="residue-bloom"] #motion-residue-bloom{display:block;animation:motionSpin 23s linear infinite reverse;}
    .cicada-shell[data-motion-field="3301-beacon"] #motion-3301-beacon{display:block;animation:motionSpin 33s linear infinite;}
    .cicada-shell[data-motion-field="3301-beacon"] #beacon-core{animation:beaconPulse 3.301s ease-in-out infinite;}
    .cicada-shell[data-ambient-field="sieve-snow"] #ambient-sieve-snow{display:block;}
    .cicada-shell[data-ambient-field="prime-ash"] #ambient-prime-ash{display:block;}
    .cicada-shell[data-ambient-field="ember-drift"] #ambient-ember-drift{display:block;}
    #ambient-sieve-snow .sieve-snow-flake{animation:sieveSnowFall 7.3s linear infinite;}
    #ambient-sieve-snow .sieve-snow-flake:nth-child(2n){animation-duration:11s;animation-delay:-3.1s;}
    #ambient-sieve-snow .sieve-snow-flake:nth-child(3n){animation-duration:5.9s;animation-delay:-1.7s;}
    #ambient-prime-ash .prime-ash-spark{animation:primeAshRise 6.1s ease-in-out infinite;}
    #ambient-prime-ash .prime-ash-spark:nth-child(2n){animation-duration:4.9s;animation-delay:-1.3s;}
    #ambient-prime-ash .prime-ash-spark:nth-child(3n){animation-duration:7.1s;animation-delay:-2.9s;}
    #ambient-ember-drift .ember-drift-spark{animation:emberDrift 9.5s linear infinite;transform-box:fill-box;transform-origin:center;}
    #ambient-ember-drift .ember-drift-spark:nth-child(2n){animation-duration:12.8s;animation-delay:-3.7s;}
    #ambient-ember-drift .ember-drift-spark:nth-child(3n){animation-duration:8.6s;animation-delay:-1.9s;}
    #ambient-ember-drift .ember-drift-spark:nth-child(4n){animation-duration:14.2s;animation-delay:-5.1s;}
    @keyframes motionSpin{100%{transform:rotate(360deg);}}
    @keyframes motionPulse{0%{opacity:.32;transform:scale(.96);}100%{opacity:.92;transform:scale(1.045);}}
    @keyframes gridDrift{0%{opacity:.36;transform:translateY(-6px) scale(.98);}100%{opacity:.88;transform:translateY(7px) scale(1.02);}}
    @keyframes bloomBreathe{0%{opacity:.26;transform:scale(.92);}100%{opacity:.9;transform:scale(1.08);}}
    @keyframes swarmDrift{0%{opacity:.3;transform:translate(-9px,6px) scale(.97);}100%{opacity:.86;transform:translate(10px,-7px) scale(1.03);}}
    @keyframes interferenceShift{0%{opacity:.28;transform:scale(.97) rotate(-2deg);}100%{opacity:.84;transform:scale(1.03) rotate(2deg);}}
    @keyframes motionDash{100%{stroke-dashoffset:-330.1;}}
    @keyframes beaconPulse{0%,100%{opacity:.25;transform:scale(.7);}33%{opacity:.92;transform:scale(1.06);}66%{opacity:.45;transform:scale(.88);}}
    @keyframes sieveSnowFall{0%{transform:translate(-8px,-270px) scale(.82);opacity:0;}13%{opacity:.72;}50%{transform:translate(17px,-35px) scale(1);}100%{transform:translate(-13px,260px) scale(.9);opacity:0;}}
    @keyframes primeAshRise{0%{transform:translate(0,165px) scale(.55);opacity:0;}17%{opacity:.85;}100%{transform:translate(21px,-235px) scale(1.12);opacity:0;}}
    @keyframes emberDrift{0%{transform:translate(-36px,18px) scale(.82);opacity:0;}12%{opacity:.78;}55%{opacity:.92;}100%{transform:translate(48px,-20px) scale(1.15);opacity:0;}}

    /* DYNAMIC THUNDERSTORM (Legendary+) */
    .cicada-shell[data-lightning-color="white"]{--l-base:#eef;--l-glow:#fff;--l-dim:#aaddff;}
    .cicada-shell[data-lightning-color="red"]{--l-base:#ffcccc;--l-glow:#ff0033;--l-dim:#aa0022;}
    .cicada-shell[data-lightning-color="orange"]{--l-base:#ffeedd;--l-glow:#ff9900;--l-dim:#aa6600;}
    .cicada-shell[data-lightning-color="green"]{--l-base:#ccffcc;--l-glow:#00ff33;--l-dim:#00aa22;}
    .cicada-shell[data-lightning-color="rainbow"]{--l-base:#ff0055;--l-glow:#ff0055;--l-dim:#aa0033;}
    #bark-backdrop-layer{display:block;pointer-events:none;}
    .cicada-shell[data-bark-backdrop="none"] #bark-backdrop-layer{display:none;}
    .cicada-body-texture{pointer-events:none;mix-blend-mode:multiply;}
    .cicada-shell[data-wireframe="true"] .cicada-body-texture{display:none;}
    .bg-lightning-layer{display:none;}
    .is-lightning .bg-lightning-layer{display:block;}
    .cicada-shell[data-lightning-color="rainbow"] .bg-lightning-layer{animation:rainbowLightningHue 2s infinite linear;}
    @keyframes rainbowLightningHue{0%{filter:hue-rotate(0deg) saturate(2);}
    100%{filter:hue-rotate(360deg) saturate(2);}
    }
    .is-lightning #effect-wrapper{animation:stormBody 23s infinite;}
    .is-lightning .bolt-1{animation:stormB1 23s infinite;}
    .is-lightning .bolt-2{animation:stormB2 23s infinite;}
    .is-lightning .bolt-3{animation:stormB3 23s infinite;}
    .is-lightning .bolt-4{animation:stormB4 23s infinite;}
    .is-lightning .bolt-5{animation:stormB5 23s infinite;}
    /* DIRECT X-RAY STRIKE */
    .cicada-shell[data-lightning-type="strike"] .bolt-strike{display:block;animation:stormStrike 23s infinite;}
    .bolt-strike{display:none;}
    .cicada-shell[data-lightning-type="strike"] #all-art{animation:xrayFlash 23s infinite;}
    @keyframes xrayFlash{0%,87.9%,92%,100%{filter:none;}
    88%{filter:invert(1) grayscale(1) brightness(2.5) drop-shadow(0 0 40px var(--l-glow));}
    88.5%{filter:none;}
    89.1%{filter:invert(0.8) sepia(1) hue-rotate(180deg) brightness(2);}
    90%{filter:none;}
    }
    @keyframes stormBody{0%,4.9%,8%,21.9%,25%,44.9%,48%,67.9%,71%,87.9%,92%,100%{filter:brightness(1) drop-shadow(0 0 0px transparent);}
    5%{filter:brightness(3.5) drop-shadow(0 0 80px var(--l-glow));}
    6%{filter:brightness(1.5) drop-shadow(0 0 20px var(--l-base));}
    6.1%{filter:brightness(4.0) drop-shadow(0 0 100px var(--l-glow));}
    22%{filter:brightness(4.5) drop-shadow(0 0 120px var(--l-glow));}
    23%{filter:brightness(1.5) drop-shadow(0 0 20px var(--l-base));}
    23.1%{filter:brightness(3.0) drop-shadow(0 0 60px var(--l-glow));}
    45%{filter:brightness(2.5) drop-shadow(0 0 50px var(--l-glow));}
    45.5%{filter:brightness(1.5) drop-shadow(0 0 10px var(--l-base));}
    45.6%{filter:brightness(5.0) drop-shadow(0 0 150px var(--l-glow));}
    46.5%{filter:brightness(1.5);}
    46.6%{filter:brightness(3.5) drop-shadow(0 0 80px var(--l-glow));}
    68%{filter:brightness(2.0) drop-shadow(0 0 30px var(--l-dim));}
    69%{filter:brightness(1.1);}
    69.1%{filter:brightness(2.5) drop-shadow(0 0 40px var(--l-glow));}
    88%{filter:brightness(6.0) drop-shadow(0 0 200px var(--l-glow));}
    89%{filter:brightness(1.5);}
    89.1%{filter:brightness(4.0) drop-shadow(0 0 100px var(--l-glow));}
    90%{filter:brightness(1.2);}
    }
    @keyframes stormB1{0%,4.9%,8%,67.9%,71%,100%{opacity:0;}
    5%{opacity:1;filter:drop-shadow(0 0 15px var(--l-glow));}
    6%{opacity:0;}
    6.1%{opacity:0.8;filter:drop-shadow(0 0 25px var(--l-glow));}
    68%{opacity:0.7;filter:drop-shadow(0 0 10px var(--l-dim));}
    69%{opacity:0;}
    69.1%{opacity:0.9;}
    }
    @keyframes stormB2{0%,21.9%,25%,87.9%,92%,100%{opacity:0;}
    22%{opacity:1;filter:drop-shadow(0 0 20px var(--l-glow));}
    23%{opacity:0;}
    23.1%{opacity:0.9;}
    88%{opacity:1;filter:drop-shadow(0 0 25px var(--l-glow));transform:translateX(-10px);}
    89%{opacity:0;transform:translateX(0);}
    89.1%{opacity:0.8;filter:drop-shadow(0 0 15px var(--l-base));transform:translateX(-5px);}
    90%{opacity:0;}
    }
    @keyframes stormB3{0%,4.9%,8%,44.9%,48%,100%{opacity:0;}
    5.5%{opacity:0.6;}
    6.5%{opacity:0;}
    45%{opacity:1;filter:drop-shadow(0 0 25px var(--l-glow));}
    45.5%{opacity:0;}
    45.6%{opacity:1;filter:drop-shadow(0 0 30px var(--l-base));transform:translateX(5px);}
    46.5%{opacity:0;}
    46.6%{opacity:0.8;transform:translateX(-5px);}
    }
    @keyframes stormB4{0%,87.9%,92%,100%{opacity:0;}
    88%{opacity:1;filter:drop-shadow(0 0 20px var(--l-glow));}
    89%{opacity:0;}
    89.1%{opacity:0.9;}
    90%{opacity:0;}
    }
    @keyframes stormB5{0%,44.9%,48%,67.9%,71%,100%{opacity:0;}
    45%{opacity:0.8;filter:drop-shadow(0 0 15px var(--l-dim));}
    46%{opacity:0;}
    46.6%{opacity:1;}
    68.5%{opacity:0.9;}
    69%{opacity:0;}
    }
    @keyframes stormStrike{0%,87.9%,92%,100%{opacity:0;}
    88%{opacity:1;filter:drop-shadow(0 0 30px var(--l-glow));}
    88.5%{opacity:0;}
    89.1%{opacity:0.9;filter:drop-shadow(0 0 20px var(--l-base));}
    90%{opacity:0;}
    }
    .is-ghost #effect-wrapper{opacity:0.4;mix-blend-mode:screen;animation:ghostFloat 4s infinite alternate ease-in-out;}
    @keyframes ghostFloat{0%{filter:blur(2px) drop-shadow(0 0 10px var(--neon-color));transform:translateY(20px) scale(0.95);opacity:0.2;}
    100%{filter:blur(1px) drop-shadow(0 0 40px var(--neon-color));transform:translateY(-20px) scale(1.05);opacity:0.65;}
    }
</style>

        <div class="stage">
            <div class="cicada-shell" data-wing="glass" data-wing-shape="classic" data-thorax-skin="none" data-abdomen-skin="none" data-eye="classic" data-eye-behavior="static" data-abdomen="smooth" data-aura="none" data-legs="organic" data-laser="none" data-antennae="none" data-marking-layer="none" data-motion-field="none" data-prime-set="none" data-ambient-field="none" data-rarity-tier="common" data-normal-wing-veins="clean" data-normal-wing-tint="clear" data-normal-wing-edge="clean-edge" data-abdomen-variant="balanced" data-antennae-variant="standard" data-eye-style="none" data-eye-style-color="match-eye">
                <svg viewBox="-100 -150 600 900" width="100%" height="100%" aria-hidden="true">
                    <defs>
                        <radialGradient id="bodyGrad" cx="50%" cy="40%" r="60%">
                            <stop offset="0%" stop-color="var(--shell-accent)"></stop>
                            <stop offset="40%" stop-color="var(--shell-light)"></stop>
                            <stop offset="100%" stop-color="var(--shell-dark)"></stop>
                        </radialGradient>

                        <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="rgba(220,255,235,0.5)"></stop>
                            <stop offset="40%" stop-color="rgba(255,220,245,0.15)"></stop>
                            <stop offset="100%" stop-color="rgba(255,255,255,0.25)"></stop>
                        </linearGradient>

                        <linearGradient id="laserGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stop-color="var(--laser-color)" stop-opacity="0"></stop>
                            <stop offset="100%" stop-color="var(--laser-color)" stop-opacity="0.9"></stop>
                        </linearGradient>

                        <filter id="cicada-body-texture-filter" x="-20%" y="-20%" width="140%" height="140%">
                            <feTurbulence type="fractalNoise" baseFrequency="0.055 0.18" numOctaves="4" seed="13" result="grain"/>
                            <feColorMatrix in="grain" type="saturate" values="0" result="mono"/>
                            <feComponentTransfer in="mono" result="contrast">
                                <feFuncR type="gamma" amplitude="1.35" exponent="1.7" offset="-0.18"/>
                                <feFuncG type="gamma" amplitude="1.35" exponent="1.7" offset="-0.18"/>
                                <feFuncB type="gamma" amplitude="1.35" exponent="1.7" offset="-0.18"/>
                            </feComponentTransfer>
                            <feBlend in="SourceGraphic" in2="contrast" mode="multiply"/>
                        </filter>

                        <!-- WING PATTERNS -->
                        <pattern id="pat-circuit" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                            <path d="M20,0 L20,20 L40,20 M0,40 L20,40 L20,20" fill="none" stroke="var(--neon-color)" stroke-width="1.5" opacity="0.6"/>
                            <circle cx="20" cy="20" r="3" fill="var(--neon-color)" opacity="0.8"/>
                        </pattern>
                        <pattern id="pat-hex" width="34.64" height="60" patternUnits="userSpaceOnUse">
                            <path d="M17.32 0 L34.64 10 L34.64 30 L17.32 40 L0 30 L0 10 Z" fill="none" stroke="var(--neon-color)" stroke-width="1.5" opacity="0.4"/>
                            <path d="M17.32 60 L34.64 50 L34.64 30" fill="none" stroke="var(--neon-color)" stroke-width="1.5" opacity="0.4"/>
                            <path d="M17.32 60 L0 50 L0 30" fill="none" stroke="var(--neon-color)" stroke-width="1.5" opacity="0.4"/>
                        </pattern>
                        <pattern id="pat-prism" width="50" height="50" patternUnits="userSpaceOnUse">
                            <path d="M0,0 L50,25 L0,50 Z" fill="none" stroke="var(--neon-color)" stroke-width="1" opacity="0.5"/>
                            <path d="M50,0 L0,25 L50,50 Z" fill="none" stroke="var(--neon-color)" stroke-width="1" opacity="0.5"/>
                        </pattern>
                        <pattern id="pat-stellar" width="30" height="30" patternUnits="userSpaceOnUse">
                            <circle cx="15" cy="15" r="1.5" fill="var(--neon-color)" opacity="0.8"/>
                            <circle cx="5" cy="5" r="0.8" fill="var(--neon-color)" opacity="0.4"/>
                            <circle cx="25" cy="25" r="0.8" fill="var(--neon-color)" opacity="0.4"/>
                            <path d="M15,15 L25,25 M15,15 L5,5" stroke="var(--neon-color)" stroke-width="0.5" opacity="0.2"/>
                        </pattern>
                        <pattern id="pat-stained-glass" width="70" height="70" patternUnits="userSpaceOnUse">
                            <path d="M0 0h70v70H0Z" fill="rgba(255,255,255,.08)"/>
                            <path d="M0 20L70 0M0 50L70 20M20 70L70 45M25 0L0 70M55 0L30 70" stroke="var(--neon-color)" stroke-width="2" opacity=".48"/>
                            <circle cx="35" cy="35" r="13" fill="#fff" opacity=".08"/>
                        </pattern>
                        <pattern id="pat-vein-map" width="56" height="56" patternUnits="userSpaceOnUse">
                            <path d="M2 54C20 38 20 18 54 2M6 18c16 6 22 15 22 36M16 6c4 20 16 26 36 30" fill="none" stroke="var(--neon-color)" stroke-width="2" opacity=".42"/>
                            <path d="M0 0h56v56H0Z" fill="rgba(255,255,255,.05)"/>
                        </pattern>
                        <pattern id="pat-rain-map" width="26" height="48" patternUnits="userSpaceOnUse" patternTransform="rotate(12)">
                            <path d="M8 0v30M20 14v34" stroke="rgba(180,240,255,.62)" stroke-width="2"/>
                            <path d="M8 30q4 8 8 0" fill="none" stroke="var(--neon-color)" stroke-width="1.2" opacity=".38"/>
                        </pattern>
                        <pattern id="pat-sonar-rings" width="60" height="60" patternUnits="userSpaceOnUse">
                            <circle cx="30" cy="30" r="9" fill="none" stroke="var(--neon-color)" stroke-width="1.5" opacity=".65"/>
                            <circle cx="30" cy="30" r="22" fill="none" stroke="var(--neon-color)" stroke-width="1" opacity=".38"/>
                        </pattern>

                        <!-- SKIN & MATERIAL PATTERNS -->
                        <pattern id="skin-carbon" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                            <rect width="12" height="12" fill="#111"/>
                            <path d="M-1,1 l3,-3 M0,12 l12,-12 M11,13 l3,-3" stroke="#444" stroke-width="3"/>
                        </pattern>
                        <pattern id="skin-hazard" width="30" height="30" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                            <rect width="30" height="30" fill="#ffcc00"/>
                            <rect width="15" height="30" fill="#222"/>
                        </pattern>
                        <pattern id="skin-polka" width="24" height="24" patternUnits="userSpaceOnUse">
                            <rect width="24" height="24" fill="var(--shell-dark)"/>
                            <circle cx="12" cy="12" r="5" fill="var(--neon-color)"/>
                        </pattern>
                        <pattern id="skin-camo" width="60" height="60" patternUnits="userSpaceOnUse">
                            <path d="M0,30 Q15,10 30,30 T60,30 T90,30" fill="none" stroke="#2a3826" stroke-width="15" opacity="0.8"/>
                            <path d="M0,0 Q20,20 40,0 T80,0" fill="none" stroke="#111610" stroke-width="20" opacity="0.6"/>
                        </pattern>
                        <pattern id="skin-wood" width="20" height="100" patternUnits="userSpaceOnUse">
                            <path d="M5,0 Q10,25 5,50 T5,100 M15,0 Q10,25 15,50 T15,100" fill="none" stroke="#111610" stroke-width="2" opacity="0.4"/>
                        </pattern>
                        <pattern id="skin-magma" width="40" height="40" patternUnits="userSpaceOnUse">
                            <rect width="40" height="40" fill="#220000"/>
                            <path d="M0,20 Q10,10 20,20 T40,20" fill="none" stroke="#ff3300" stroke-width="3" filter="drop-shadow(0 0 4px #ff0000)"/>
                            <path d="M20,0 Q30,10 20,20 T20,40" fill="none" stroke="#ffcc00" stroke-width="1.5"/>
                        </pattern>
                        <pattern id="skin-synthwave" width="20" height="20" patternUnits="userSpaceOnUse">
                            <rect width="20" height="20" fill="#110022"/>
                            <path d="M0,20 L20,20 M10,0 L10,20" fill="none" stroke="var(--neon-color)" stroke-width="1.5" filter="drop-shadow(0 0 2px var(--neon-color))"/>
                        </pattern>
                        <pattern id="skin-iridescent" width="64" height="64" patternUnits="userSpaceOnUse">
                            <linearGradient id="skinIridescentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#ff00aa" stop-opacity=".7"/>
                                <stop offset="45%" stop-color="#00ffee" stop-opacity=".5"/>
                                <stop offset="100%" stop-color="#ffee00" stop-opacity=".55"/>
                            </linearGradient>
                            <rect width="64" height="64" fill="url(#skinIridescentGrad)"/>
                        </pattern>
                        <pattern id="skin-porcelain" width="42" height="42" patternUnits="userSpaceOnUse">
                            <rect width="42" height="42" fill="#f6eedf" opacity=".9"/>
                            <path d="M0 26Q18 4 42 20M8 42Q18 22 42 36" fill="none" stroke="#5d86b8" stroke-width="2" opacity=".42"/>
                        </pattern>
                        <pattern id="skin-circuit-tattoo" width="36" height="36" patternUnits="userSpaceOnUse">
                            <rect width="36" height="36" fill="rgba(0,0,0,.18)"/>
                            <path d="M4 8h14v12h14M18 20v12M8 28h10M28 4v14" fill="none" stroke="var(--neon-color)" stroke-width="2"/>
                            <circle cx="18" cy="20" r="3" fill="var(--neon-color)"/>
                        </pattern>
                        <pattern id="skin-static-noise" width="10" height="10" patternUnits="userSpaceOnUse">
                            <rect width="10" height="10" fill="#111"/>
                            <rect x="0" y="0" width="2" height="2" fill="#fff" opacity=".5"/>
                            <rect x="6" y="3" width="3" height="2" fill="var(--neon-color)" opacity=".6"/>
                            <rect x="3" y="7" width="2" height="3" fill="#fff" opacity=".22"/>
                        </pattern>
                        <pattern id="skin-bio-lattice" width="32" height="32" patternUnits="userSpaceOnUse">
                            <path d="M0 16Q8 0 16 16T32 16M0 16Q8 32 16 16T32 16" fill="none" stroke="var(--neon-color)" stroke-width="2" opacity=".5"/>
                            <circle cx="16" cy="16" r="4" fill="var(--neon-color)" opacity=".35"/>
                        </pattern>

                        <!-- CLIPPING MASKS FOR BODY MATERIALS -->
                        <clipPath id="abdomen-shape">
                            <path d="M155 240C155 240 140 360 200 430C260 360 245 240 245 240Z"></path>
                        </clipPath>
                        <clipPath id="thorax-shape">
                            <path d="M160 150C140 180 145 240 200 250C255 240 260 180 240 150Z"></path>
                        </clipPath>
                        <clipPath id="body-shape">
                            <path d="M155 240C155 240 140 360 200 430C260 360 245 240 245 240Z"></path>
                            <path d="M160 150C140 180 145 240 200 250C255 240 260 180 240 150Z"></path>
                        </clipPath>
                    </defs>

                    <!-- PHOTOGRAPHIC BARK BACKDROP (natural source image, painted first) -->
                    <g id="bark-backdrop-layer"></g>

                    <!-- DYNAMIC BACKGROUND LIGHTNING LAYER -->
                    <g class="bg-lightning-layer" stroke="var(--l-base, #eef)" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <g class="bolt-1">
                            <path d="M -20,-100 L 80,0 L 50,60 L 120,180 L 80,280" stroke-width="4" opacity="0.9" />
                            <path d="M 80,0 L 130,50 L 110,100" stroke-width="2" opacity="0.6" />
                        </g>
                        <g class="bolt-2">
                            <path d="M 420,-150 L 320,-20 L 360,70 L 280,200 L 330,350" stroke-width="5" opacity="0.85" />
                            <path d="M 320,-20 L 260,30 L 280,100" stroke-width="2" opacity="0.5" />
                        </g>
                        <g class="bolt-3">
                            <path d="M 200,-200 L 220,-80 L 160,-20 L 240,60" stroke-width="6" opacity="0.9" />
                            <path d="M 220,-80 L 280,-40 L 260,30" stroke-width="3" opacity="0.7" />
                        </g>
                        <g class="bolt-4">
                            <path d="M -80,50 L 0,120 L -30,180 L 40,300" stroke-width="2" opacity="0.4" />
                        </g>
                        <g class="bolt-5">
                            <path d="M 450,150 L 380,220 L 410,290 L 340,400" stroke-width="3" opacity="0.5" />
                        </g>
                        <g class="bolt-strike">
                            <path d="M 200,-250 L 180,-50 L 230,80 L 190,160 L 200,240" stroke-width="8" opacity="0.95" />
                            <path d="M 180,-50 L 130,20 L 150,60" stroke-width="3" opacity="0.6" />
                            <path d="M 230,80 L 280,140" stroke-width="3" opacity="0.6" />
                        </g>
                    </g>

                    <!-- AMBIENT CIPHER LAYER -->
                    <g id="ambient-field-layer" class="ambient-field-layer" opacity="0.72">
                        <g id="ambient-sieve-snow" class="ambient-field-option" fill="#fff">
                            ${sieveSnowFlakes}
                        </g>
                        <g id="ambient-prime-ash" class="ambient-field-option" fill="var(--ambient-color)">
                            ${primeAshSparks}
                        </g>
                        <g id="ambient-ember-drift" class="ambient-field-option">
                            ${emberDriftSparks}
                        </g>
                    </g>

                    <!-- PRIME FIELD LAYER: sits behind the cicada artwork -->
                    <g id="motion-field-layer" class="motion-field-layer" opacity="0.8">
                        <g id="motion-prime-pulse" class="motion-field-option" fill="none" stroke="var(--neon-color)">
                            ${primePulseMarkup['11']}
                            ${primePulseMarkup['13']}
                            ${primePulseMarkup['17']}
                            ${primePulseMarkup['11-13']}
                            ${primePulseMarkup['13-17']}
                            ${primePulseMarkup['11-13-17']}
                        </g>
                        <g id="motion-prime-grid" class="motion-field-option" fill="var(--neon-color)">
                            ${primeGridMarkup['11']}
                            ${primeGridMarkup['13']}
                            ${primeGridMarkup['17']}
                            ${primeGridMarkup['11-13']}
                            ${primeGridMarkup['13-17']}
                            ${primeGridMarkup['11-13-17']}
                        </g>
                        <g id="motion-prime-bloom" class="motion-field-option" fill="var(--neon-color)">
                            ${primeBloomMarkup['11']}
                            ${primeBloomMarkup['13']}
                            ${primeBloomMarkup['17']}
                            ${primeBloomMarkup['11-13']}
                            ${primeBloomMarkup['13-17']}
                            ${primeBloomMarkup['11-13-17']}
                        </g>
                        <g id="motion-prime-swarm" class="motion-field-option" fill="var(--neon-color)">
                            ${primeSwarmMarkup['11']}
                            ${primeSwarmMarkup['13']}
                            ${primeSwarmMarkup['17']}
                            ${primeSwarmMarkup['11-13']}
                            ${primeSwarmMarkup['13-17']}
                            ${primeSwarmMarkup['11-13-17']}
                        </g>
                        <g id="motion-prime-interference" class="motion-field-option" fill="none" stroke="var(--neon-color)">
                            ${primeInterferenceMarkup['11']}
                            ${primeInterferenceMarkup['13']}
                            ${primeInterferenceMarkup['17']}
                            ${primeInterferenceMarkup['11-13']}
                            ${primeInterferenceMarkup['13-17']}
                            ${primeInterferenceMarkup['11-13-17']}
                        </g>
                        <g id="motion-ulam-spiral" class="motion-field-option" fill="var(--neon-color)">
                            <rect x="46" y="96" width="308" height="308" fill="none" stroke="var(--neon-color)" stroke-width="1" stroke-dasharray="5 13" opacity=".18"/>
                            ${ulamPrimeDots}
                        </g>
                        <g id="motion-twin-prime-orbit" class="motion-field-option" fill="var(--neon-color)" stroke="var(--neon-color)">
                            <circle cx="200" cy="250" r="242" fill="none" stroke-width="1.2" stroke-dasharray="2 23" opacity=".25"/>
                            <circle cx="200" cy="250" r="264" fill="none" stroke-width="1.1" stroke-dasharray="2 31" opacity=".18"/>
                            <path d="M88 64 Q200 20 312 64 M468 250 Q200 510 -68 250 M88 436 Q200 480 312 436" fill="none" stroke="#fff" stroke-width="1" opacity=".18"/>
                            ${twinPrimeNodes}
                        </g>
                        <g id="motion-prime-gap-sweep" class="motion-field-option" stroke="var(--neon-color)" fill="none" stroke-linecap="round">
                            <path d="M200 250 L200 -34 A284 284 0 0 1 446 108 Z" fill="var(--neon-color)" opacity=".09" stroke="none"/>
                            ${primeGapSpokes}
                            <circle cx="200" cy="250" r="232" stroke="#fff" stroke-width="1" stroke-dasharray="2 17 2 29" opacity=".28"/>
                        </g>
                        <g id="motion-residue-bloom" class="motion-field-option" fill="var(--neon-color)" stroke="var(--neon-color)">
                            ${residueBloomPetals}
                            <circle cx="200" cy="250" r="177" fill="none" stroke="#fff" stroke-width="1.1" stroke-dasharray="7 17" opacity=".3"/>
                            <circle cx="200" cy="250" r="113" fill="none" stroke="var(--neon-color)" stroke-width="1.4" stroke-dasharray="5 13" opacity=".38"/>
                        </g>
                        <g id="motion-3301-beacon" class="motion-field-option" fill="none" stroke="var(--neon-color)">
                            <circle cx="200" cy="250" r="260" stroke-width="1.2" stroke-dasharray="33 1" opacity=".16"/>
                            <g fill="var(--neon-color)" stroke="none">${beacon3301Dots}</g>
                            <path d="M200 -22 L214 38 L200 72 L186 38 Z M448 250 L388 264 L354 250 L388 236 Z M200 522 L214 462 L200 428 L186 462 Z M-48 250 L12 264 L46 250 L12 236 Z" fill="var(--neon-color)" stroke="none" opacity=".26"/>
                            <circle id="beacon-core" cx="200" cy="250" r="33.01" fill="var(--neon-color)" stroke="none" opacity=".5"/>
                            <circle cx="200" cy="250" r="101" stroke="#fff" stroke-width="1" stroke-dasharray="3 3 0 1" opacity=".3"/>
                        </g>
                    </g>

                    <!-- AURA LAYERS -->
                    <g id="aura-halo" class="aura">
                        <circle cx="200" cy="250" r="260" fill="none" stroke="var(--neon-color)" stroke-width="2" stroke-dasharray="10 30 50 30" opacity="0.2"/>
                        <circle cx="200" cy="250" r="230" fill="none" stroke="var(--neon-color)" stroke-width="1" stroke-dasharray="5 15" opacity="0.4"/>
                        <circle cx="200" cy="250" r="245" fill="none" stroke="var(--neon-color)" stroke-width="4" stroke-dasharray="1 40" opacity="0.6"/>
                    </g>

                    <g id="aura-orbit" class="aura">
                        <circle class="ring-1" cx="200" cy="250" r="270" fill="none" stroke="var(--neon-color)" stroke-width="3" stroke-dasharray="2 100 20 50" opacity="0.8"/>
                        <circle class="ring-2" cx="200" cy="250" r="210" fill="none" stroke="var(--neon-color)" stroke-width="1" stroke-dasharray="50 150" opacity="0.5"/>
                        <circle class="ring-3" cx="200" cy="250" r="180" fill="none" stroke="var(--neon-color)" stroke-width="2" stroke-dasharray="1 10" opacity="0.6"/>
                    </g>

                    <g id="effect-wrapper">
                        <g id="cicada-body-group">
                            <g id="all-art">
                                <!-- LEGS -->
                                <g id="legs-layer" stroke="var(--shell-dark)" fill="none" stroke-linejoin="round" stroke-linecap="round">
                                    ${legsLayerMarkup}
                                </g>

                                <!-- ABDOMEN -->
                                <g id="abdomen">
                                    <path d="M155 240C155 240 140 360 200 430C260 360 245 240 245 240Z" fill="url(#bodyGrad)" stroke="var(--shell-dark)" stroke-width="2"></path>

                                    <g id="abdomen-skin-layer" clip-path="url(#abdomen-shape)">
                                        ${abdomenSkinRects}
                                    </g>
                                    <g id="abdomen-organic-texture" class="cicada-body-texture" clip-path="url(#abdomen-shape)" opacity="0.42">
                                        <rect x="100" y="238" width="200" height="196" fill="#0b110e" filter="url(#cicada-body-texture-filter)" opacity="0.38"/>
                                        <path d="M162 268C186 282 214 282 238 268M156 304C184 318 216 318 244 304M158 340C184 356 216 356 242 340M168 378C188 392 212 392 232 378" fill="none" stroke="#fff8df" stroke-width="2.1" stroke-linecap="round" opacity="0.18"/>
                                        <path d="M182 254C171 300 172 358 190 413M218 254C229 300 228 358 210 413" fill="none" stroke="#050806" stroke-width="2.4" stroke-linecap="round" opacity="0.2"/>
                                    </g>

                                    <g id="abdomen-pattern-layer">
                                        <g id="abd-classic">
                                            <path d="M153 260Q200 280 247 260M150 285Q200 305 250 285M148 310Q200 330 252 310M151 335Q200 355 249 335M158 360Q200 380 242 360M166 385Q200 405 234 385" fill="none" stroke="var(--shell-dark)" stroke-width="3" opacity="0.8"></path>
                                        </g>

                                        <g id="abd-ribbed">
                                            <path d="M153 260Q200 280 247 260M150 285Q200 305 250 285M148 310Q200 330 252 310M151 335Q200 355 249 335M158 360Q200 380 242 360M166 385Q200 405 234 385" fill="none" stroke="var(--neon-color)" stroke-width="4" opacity="0.9"></path>
                                        </g>

                                        <g id="abd-barcode">
                                            <rect x="180" y="250" width="4" height="150" fill="var(--neon-color)" opacity="0.8"/>
                                            <rect x="190" y="250" width="10" height="150" fill="var(--neon-color)" opacity="0.8"/>
                                            <rect x="206" y="250" width="2" height="150" fill="var(--neon-color)" opacity="0.8"/>
                                            <rect x="214" y="250" width="8" height="150" fill="var(--neon-color)" opacity="0.8"/>
                                        </g>

                                        <g id="abd-plating">
                                            <path d="M150 270 L200 290 L250 270 L240 300 L200 320 L160 300 Z" fill="var(--shell-light)" stroke="var(--shell-dark)" stroke-width="2"/>
                                            <path d="M155 310 L200 330 L245 310 L235 340 L200 360 L165 340 Z" fill="var(--shell-light)" stroke="var(--shell-dark)" stroke-width="2"/>
                                            <path d="M165 350 L200 370 L235 350 L220 380 L200 400 L180 380 Z" fill="var(--shell-light)" stroke="var(--shell-dark)" stroke-width="2"/>
                                        </g>

                                        <g id="abd-glyph">
                                            <path d="M200 255 L218 288 L200 321 L182 288 Z M200 330 L226 360 L200 398 L174 360 Z" fill="none" stroke="var(--neon-color)" stroke-width="5" stroke-linejoin="round" opacity="0.9"/>
                                            <circle cx="200" cy="288" r="5" fill="var(--neon-color)" opacity="0.95"/>
                                            <circle cx="200" cy="360" r="5" fill="var(--neon-color)" opacity="0.95"/>
                                        </g>

                                        ${abdomenStripes}
                                    </g>
                                    <g id="abdomen-variant-overlay">${abdomenVariantOverlays}</g>
                                </g>

                                <!-- THORAX -->
                                <g id="thorax">
                                    <path d="M160 150C140 180 145 240 200 250C255 240 260 180 240 150Z" fill="var(--shell-light)" stroke="var(--shell-dark)" stroke-width="2"></path>
                                    <g id="thorax-skin-layer" clip-path="url(#thorax-shape)">
                                        ${thoraxSkinRects}
                                    </g>
                                    <g id="thorax-organic-texture" class="cicada-body-texture" clip-path="url(#thorax-shape)" opacity="0.36">
                                        <rect x="126" y="128" width="148" height="132" fill="#0b110e" filter="url(#cicada-body-texture-filter)" opacity="0.34"/>
                                        <path d="M165 176C184 164 216 164 235 176M156 206C182 222 218 222 244 206M170 232C190 242 210 242 230 232" fill="none" stroke="#fff8df" stroke-width="2" stroke-linecap="round" opacity="0.16"/>
                                        <path d="M200 156C194 184 194 216 200 246" fill="none" stroke="#050806" stroke-width="3" stroke-linecap="round" opacity="0.2"/>
                                    </g>
                                    <path class="thorax-material-outline" d="M160 150C140 180 145 240 200 250C255 240 260 180 240 150Z" fill="none" stroke="var(--shell-dark)" stroke-width="2.4" opacity="0.95"></path>
                                    <path d="M175 210Q185 190 200 215Q215 190 225 210L210 235L190 235Z" fill="var(--shell-accent)" opacity="0.78"></path>
                                </g>

                                <!-- HEAD & EYES (The specific Call Hitbox) -->
                                    <g id="head">
                                        <!-- ANTENNAE -->
                                        <!-- Root points have been tucked slightly down into the head curve so every antenna
                                            visually connects cleanly. The head path is drawn after the antennae, so the
                                            overlap is hidden and the antennae appear to emerge naturally from the shell. -->
                                        <g id="antennae" stroke="var(--shell-dark)" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                            <g id="ant-classic">
                                                <path d="M170 123 Q140 60 120 40 M230 123 Q260 60 280 40" />
                                            </g>

                                            <g id="ant-moth">
                                                <path d="M165 126 Q120 30 70 20 M235 126 Q280 30 330 20" stroke-width="4" />
                                                <path d="M150 90 L130 80 M140 70 L110 60 M120 50 L85 45" stroke-width="2" />
                                                <path d="M250 90 L270 80 M260 70 L290 60 M280 50 L315 45" stroke-width="2" />
                                            </g>

                                            <g id="ant-cyber">
                                                <path d="M175 122 L160 70 L130 50 M225 122 L240 70 L270 50" stroke="var(--neon-color)" stroke-width="2" />
                                                <circle cx="130" cy="50" r="4" fill="var(--neon-color)" stroke="none" />
                                                <circle cx="270" cy="50" r="4" fill="var(--neon-color)" stroke="none" />
                                            </g>
                                        </g>

                                        <g id="antennae-variant-overlay">${antennaeVariantOverlays}</g>

                                        <path d="M150 145C150 105 250 105 250 145Z" fill="var(--shell-accent)" stroke="var(--shell-dark)" stroke-width="2"></path>
                                    <g id="eye-classic">
                                        <ellipse class="base-eye" cx="143" cy="128" rx="15" ry="22" transform="rotate(-28 143 128)"></ellipse>
                                        <ellipse class="base-eye" cx="257" cy="128" rx="15" ry="22" transform="rotate(28 257 128)"></ellipse>
                                        <g class="eye-style-option eye-style-halo-single">
                                            <ellipse class="eye-style-stroke eye-style-bold" cx="143" cy="128" rx="18.5" ry="25.5" transform="rotate(-28 143 128)"></ellipse>
                                            <ellipse class="eye-style-stroke eye-style-bold" cx="257" cy="128" rx="18.5" ry="25.5" transform="rotate(28 257 128)"></ellipse>
                                        </g>
                                        <g class="eye-style-option eye-style-halo-double">
                                            <ellipse class="eye-style-stroke eye-style-dashed eye-style-thin" cx="143" cy="128" rx="22" ry="29" transform="rotate(-28 143 128)"></ellipse>
                                            <ellipse class="eye-style-stroke eye-style-dashed eye-style-thin" cx="257" cy="128" rx="22" ry="29" transform="rotate(28 257 128)"></ellipse>
                                        </g>
                                        <g class="eye-style-option eye-style-brow-arcs">
                                            <path class="eye-style-stroke eye-style-mid" d="M127 104q16-12 34-6"/>
                                            <path class="eye-style-stroke eye-style-mid" d="M239 98q18-6 34 6"/>
                                        </g>
                                        <g class="eye-style-option eye-style-side-flares">
                                            <path class="eye-style-stroke eye-style-mid" d="M126 122q-12 4-20 0"/>
                                            <path class="eye-style-stroke eye-style-mid" d="M274 122q12 4 20 0"/>
                                            <path class="eye-style-stroke eye-style-thin" d="M124 130q-10 7-16 7"/>
                                            <path class="eye-style-stroke eye-style-thin" d="M276 130q10 7 16 7"/>
                                        </g>
                                        <g class="eye-style-option eye-style-top-glints">
                                            <ellipse class="eye-style-white" cx="137" cy="113" rx="4.2" ry="6.6" transform="rotate(-28 137 113)"></ellipse>
                                            <ellipse class="eye-style-white" cx="263" cy="113" rx="4.2" ry="6.6" transform="rotate(28 263 113)"></ellipse>
                                        </g>
                                        <g class="eye-style-option eye-style-orbit-dots">
                                            <g class="eye-orbit-left">
                                                <circle class="eye-style-fill" cx="143" cy="99" r="2.6"></circle><circle class="eye-style-fill" cx="121" cy="135" r="2.2"></circle><circle class="eye-style-fill" cx="160" cy="150" r="2.3"></circle>
                                            </g>
                                            <g class="eye-orbit-right">
                                                <circle class="eye-style-fill" cx="257" cy="99" r="2.6"></circle><circle class="eye-style-fill" cx="279" cy="135" r="2.2"></circle><circle class="eye-style-fill" cx="240" cy="150" r="2.3"></circle>
                                            </g>
                                        </g>
                                        <g class="eye-style-option eye-style-lower-crescents">
                                            <path class="eye-style-stroke eye-style-mid" d="M128 146q14 10 29 2"/>
                                            <path class="eye-style-stroke eye-style-mid" d="M243 148q15 8 29-2"/>
                                        </g>
                                        <g class="eye-style-option eye-style-bracket-corners">
                                            <path class="eye-style-stroke eye-style-thin" d="M122 107h10v10M164 138h-10v10M278 107h-10v10M236 138h10v10"/>
                                        </g>
                                        <g class="eye-style-option eye-style-scan-bars">
                                            <path class="eye-style-stroke eye-style-thin" d="M128 128h28M242 128h28"/>
                                            <path class="eye-style-stroke eye-style-thin" d="M130 133h24M246 133h24" opacity=".66"/>
                                        </g>
                                        <g class="eye-style-option eye-style-ember-specks">
                                            <circle class="eye-style-warm" cx="118" cy="116" r="2.3"></circle><circle class="eye-style-warm" cx="110" cy="126" r="1.5"></circle><circle class="eye-style-warm" cx="282" cy="116" r="2.3"></circle><circle class="eye-style-warm" cx="290" cy="126" r="1.5"></circle>
                                        </g>
                                        <circle cx="200" cy="133" r="2.5" class="eye-light-accent"></circle>
                                        <circle cx="194" cy="126" r="2.5" class="eye-light-accent"></circle>
                                        <circle cx="206" cy="126" r="2.5" class="eye-light-accent"></circle>
                                    </g>

                                    <g id="eye-void">
                                        <ellipse cx="143" cy="128" rx="16" ry="24" fill="#030303" transform="rotate(-28 143 128)"></ellipse>
                                        <ellipse cx="257" cy="128" rx="16" ry="24" fill="#030303" transform="rotate(28 257 128)"></ellipse>
                                        <g class="eye-style-option eye-style-halo-single">
                                            <ellipse class="eye-style-stroke eye-style-bold" cx="143" cy="128" rx="19" ry="27" transform="rotate(-28 143 128)"></ellipse>
                                            <ellipse class="eye-style-stroke eye-style-bold" cx="257" cy="128" rx="19" ry="27" transform="rotate(28 257 128)"></ellipse>
                                        </g>
                                        <g class="eye-style-option eye-style-halo-double">
                                            <ellipse class="eye-style-stroke eye-style-dashed eye-style-thin" cx="143" cy="128" rx="22.4" ry="30.4" transform="rotate(-28 143 128)"></ellipse>
                                            <ellipse class="eye-style-stroke eye-style-dashed eye-style-thin" cx="257" cy="128" rx="22.4" ry="30.4" transform="rotate(28 257 128)"></ellipse>
                                        </g>
                                        <g class="eye-style-option eye-style-brow-arcs">
                                            <path class="eye-style-stroke eye-style-mid" d="M126 102q16-12 34-6"/>
                                            <path class="eye-style-stroke eye-style-mid" d="M240 96q18-6 34 6"/>
                                        </g>
                                        <g class="eye-style-option eye-style-side-flares">
                                            <path class="eye-style-stroke eye-style-mid" d="M123 122q-12 4-20 0"/>
                                            <path class="eye-style-stroke eye-style-mid" d="M277 122q12 4 20 0"/>
                                        </g>
                                        <g class="eye-style-option eye-style-top-glints">
                                            <ellipse class="eye-style-white" cx="136" cy="111" rx="4.4" ry="6.8" transform="rotate(-28 136 111)"></ellipse>
                                            <ellipse class="eye-style-white" cx="264" cy="111" rx="4.4" ry="6.8" transform="rotate(28 264 111)"></ellipse>
                                        </g>
                                        <g class="eye-style-option eye-style-orbit-dots">
                                            <g class="eye-orbit-left">
                                                <circle class="eye-style-fill" cx="143" cy="97" r="2.6"></circle><circle class="eye-style-fill" cx="119" cy="136" r="2.2"></circle><circle class="eye-style-fill" cx="162" cy="153" r="2.3"></circle>
                                            </g>
                                            <g class="eye-orbit-right">
                                                <circle class="eye-style-fill" cx="257" cy="97" r="2.6"></circle><circle class="eye-style-fill" cx="281" cy="136" r="2.2"></circle><circle class="eye-style-fill" cx="238" cy="153" r="2.3"></circle>
                                            </g>
                                        </g>
                                        <g class="eye-style-option eye-style-lower-crescents">
                                            <path class="eye-style-stroke eye-style-mid" d="M126 149q15 8 31 0"/>
                                            <path class="eye-style-stroke eye-style-mid" d="M243 149q16 8 31 0"/>
                                        </g>
                                        <g class="eye-style-option eye-style-bracket-corners">
                                            <path class="eye-style-stroke eye-style-thin" d="M120 104h11v11M166 140h-11v11M280 104h-11v11M234 140h11v11"/>
                                        </g>
                                        <g class="eye-style-option eye-style-scan-bars">
                                            <path class="eye-style-stroke eye-style-thin" d="M126 128h30M244 128h30"/>
                                            <path class="eye-style-stroke eye-style-thin" d="M128 133h26M248 133h26" opacity=".66"/>
                                        </g>
                                        <g class="eye-style-option eye-style-ember-specks">
                                            <circle class="eye-style-warm" cx="116" cy="116" r="2.3"></circle><circle class="eye-style-warm" cx="108" cy="126" r="1.5"></circle><circle class="eye-style-warm" cx="284" cy="116" r="2.3"></circle><circle class="eye-style-warm" cx="292" cy="126" r="1.5"></circle>
                                        </g>
                                    </g>

                                    <g id="eye-cyclops">
                                        <ellipse cx="143" cy="128" rx="10" ry="15" fill="var(--shell-dark)" transform="rotate(-28 143 128)"></ellipse>
                                        <ellipse cx="257" cy="128" rx="10" ry="15" fill="var(--shell-dark)" transform="rotate(28 257 128)"></ellipse>
                                        <circle class="base-eye" cx="200" cy="128" r="12"></circle>
                                        <g class="eye-style-option eye-style-halo-single"><circle class="eye-style-stroke eye-style-bold" cx="200" cy="128" r="16.2"></circle></g>
                                        <g class="eye-style-option eye-style-halo-double"><circle class="eye-style-stroke eye-style-dashed eye-style-thin" cx="200" cy="128" r="20.3"></circle></g>
                                        <g class="eye-style-option eye-style-brow-arcs"><path class="eye-style-stroke eye-style-mid" d="M184 108q16-10 32 0"/></g>
                                        <g class="eye-style-option eye-style-side-flares"><path class="eye-style-stroke eye-style-mid" d="M180 128q-12 2-19 0M220 128q12 2 19 0"/></g>
                                        <g class="eye-style-option eye-style-top-glints"><ellipse class="eye-style-white" cx="196" cy="121" rx="3.7" ry="5.5"></ellipse></g>
                                        <g class="eye-style-option eye-style-orbit-dots"><g class="eye-orbit-centre"><circle class="eye-style-fill" cx="200" cy="100" r="2.2"></circle><circle class="eye-style-fill" cx="176" cy="140" r="2.2"></circle><circle class="eye-style-fill" cx="224" cy="140" r="2.2"></circle></g></g>
                                        <g class="eye-style-option eye-style-lower-crescents"><path class="eye-style-stroke eye-style-mid" d="M188 143q12 8 24 0"/></g>
                                        <g class="eye-style-option eye-style-bracket-corners"><path class="eye-style-stroke eye-style-thin" d="M182 114h8v8M218 114h-8v8M182 142h8v-8M218 142h-8v-8"/></g>
                                        <g class="eye-style-option eye-style-scan-bars"><path class="eye-style-stroke eye-style-thin" d="M188 128h24M191 133h18" opacity=".76"/></g>
                                        <g class="eye-style-option eye-style-ember-specks"><circle class="eye-style-warm" cx="181" cy="118" r="2.1"></circle><circle class="eye-style-warm" cx="219" cy="118" r="2.1"></circle><circle class="eye-style-warm" cx="200" cy="147" r="1.4"></circle></g>
                                        <circle class="eye-light-accent" cx="200" cy="128" r="4"></circle>
                                    </g>
                                </g>

                                <!-- LASER BEAMS -->
                                <g id="laser-beams">
                                    <g class="laser laser-left">
                                        <polygon points="143,128 -40,-200 140,-200" fill="url(#laserGrad)" opacity="0.7"></polygon>
                                        <polygon points="143,128 30,-200 70,-200" fill="#fff" opacity="0.9"></polygon>
                                    </g>
                                    <g class="laser laser-right">
                                        <polygon points="257,128 260,-200 440,-200" fill="url(#laserGrad)" opacity="0.7"></polygon>
                                        <polygon points="257,128 330,-200 370,-200" fill="#fff" opacity="0.9"></polygon>
                                    </g>
                                </g>

                                <!-- Thorax material overlay -->
                                <g id="thorax-material-overlay-layer">
                                    ${thoraxMaterialOverlays}
                                    <path d="M160 150C140 180 145 240 200 250C255 240 260 180 240 150Z" fill="none" stroke="var(--shell-dark)" stroke-width="3" opacity=".98"/>
                                    <path d="M175 210Q185 190 200 215Q215 190 225 210L210 235L190 235Z" fill="var(--shell-accent)" opacity=".55"/>
                                </g>

                                <!-- EXPERIMENTAL LAB: call-reactive tymbal plates -->
                                <g id="tymbal-layer" stroke-linecap="round" stroke-linejoin="round">
                                    <g id="tymbal-bronze-plates" class="tymbal-option">
                                        <ellipse cx="163" cy="232" rx="19" ry="35" fill="#8b5a2b" stroke="#2b1606" stroke-width="2.2" opacity=".88" transform="rotate(-15 163 232)"/>
                                        <ellipse cx="237" cy="232" rx="19" ry="35" fill="#8b5a2b" stroke="#2b1606" stroke-width="2.2" opacity=".88" transform="rotate(15 237 232)"/>
                                        <path class="tymbal-rib" d="M154 211Q169 230 154 253M164 204Q181 230 164 260M172 209Q187 230 172 253" fill="none" stroke="#f0b15a" stroke-width="3" opacity=".74"/>
                                        <path class="tymbal-rib" d="M246 211Q231 230 246 253M236 204Q219 230 236 260M228 209Q213 230 228 253" fill="none" stroke="#f0b15a" stroke-width="3" opacity=".74"/>
                                    </g>
                                    <g id="tymbal-glass-membranes" class="tymbal-option">
                                        <ellipse cx="164" cy="230" rx="22" ry="38" fill="rgba(255,255,255,.2)" stroke="var(--neon-color)" stroke-width="2" opacity=".82" transform="rotate(-14 164 230)"/>
                                        <ellipse cx="236" cy="230" rx="22" ry="38" fill="rgba(255,255,255,.2)" stroke="var(--neon-color)" stroke-width="2" opacity=".82" transform="rotate(14 236 230)"/>
                                        <path class="tymbal-rib" d="M150 226Q164 216 178 226M150 239Q164 229 178 239M222 226Q236 216 250 226M222 239Q236 229 250 239" fill="none" stroke="#fff" stroke-width="1.8" opacity=".55"/>
                                        <circle class="tymbal-core" cx="164" cy="230" r="5" fill="var(--neon-color)" opacity=".52"/>
                                        <circle class="tymbal-core" cx="236" cy="230" r="5" fill="var(--neon-color)" opacity=".52"/>
                                    </g>
                                    <g id="tymbal-circuit-tymbals" class="tymbal-option">
                                        <path d="M146 204h36v58h-36zM218 204h36v58h-36z" fill="rgba(0,0,0,.42)" stroke="var(--neon-color)" stroke-width="2" opacity=".84"/>
                                        <path class="tymbal-rib" d="M154 214h18v12h-9v13h16M226 214h18v12h-9v13h16M154 250h13M226 250h13" fill="none" stroke="#fff" stroke-width="2" opacity=".55"/>
                                        <circle class="tymbal-node" cx="172" cy="226" r="3.5" fill="var(--neon-color)"/>
                                        <circle class="tymbal-node" cx="163" cy="239" r="3" fill="var(--neon-color)"/>
                                        <circle class="tymbal-node" cx="244" cy="226" r="3.5" fill="var(--neon-color)"/>
                                        <circle class="tymbal-node" cx="235" cy="239" r="3" fill="var(--neon-color)"/>
                                    </g>
                                    <g id="tymbal-ribbed-speakers" class="tymbal-option" fill="none" stroke="var(--shell-dark)">
                                        <ellipse cx="162" cy="232" rx="24" ry="36" fill="rgba(0,0,0,.22)" stroke="var(--shell-dark)" stroke-width="2" transform="rotate(-13 162 232)"/>
                                        <ellipse cx="238" cy="232" rx="24" ry="36" fill="rgba(0,0,0,.22)" stroke="var(--shell-dark)" stroke-width="2" transform="rotate(13 238 232)"/>
                                        <path class="tymbal-rib" d="M145 217Q162 207 179 217M140 231Q162 216 184 231M145 245Q162 255 179 245" stroke="var(--neon-color)" stroke-width="3" opacity=".8"/>
                                        <path class="tymbal-rib" d="M221 217Q238 207 255 217M216 231Q238 216 260 231M221 245Q238 255 255 245" stroke="var(--neon-color)" stroke-width="3" opacity=".8"/>
                                        <circle class="tymbal-core" cx="162" cy="232" r="6" fill="var(--neon-color)" stroke="none" opacity=".72"/>
                                        <circle class="tymbal-core" cx="238" cy="232" r="6" fill="var(--neon-color)" stroke="none" opacity=".72"/>
                                    </g>
                                    <g id="tymbal-mythic-resonators" class="tymbal-option" fill="none" stroke="var(--neon-color)">
                                        <circle cx="164" cy="232" r="27" stroke-width="2" opacity=".42"/>
                                        <circle cx="236" cy="232" r="27" stroke-width="2" opacity=".42"/>
                                        <circle class="tymbal-core" cx="164" cy="232" r="11" fill="var(--neon-color)" stroke="none" opacity=".4"/>
                                        <circle class="tymbal-core" cx="236" cy="232" r="11" fill="var(--neon-color)" stroke="none" opacity=".4"/>
                                        <path class="tymbal-rib" d="M164 191v14M164 259v14M123 232h14M191 232h14M236 191v14M236 259v14M195 232h14M263 232h14" stroke-width="3" opacity=".75"/>
                                        <path d="M136 204q28-22 56 0M208 204q28-22 56 0M136 260q28 22 56 0M208 260q28 22 56 0" stroke="#fff" stroke-width="1.5" opacity=".38"/>
                                    </g>
                                </g>

                                <!-- Cipher marking overlay -->
                                <g id="cipher-markings-layer" class="cipher-markings-layer">
                                    ${cipherMarkings}
                                </g>

                                <!-- WINGS moved to the top art layer so they sit above the thorax overlay -->
                                <g class="wing-element">
                                    <g id="left-hindwing" class="wing">
                                        <path class="wing-shape-classic" d="M180 185C110 200 60 290 85 345C115 380 165 280 180 185Z" fill="url(#wingGrad)" stroke="var(--shell-accent)" stroke-width="1.5"></path>
                                        <path class="wing-shape-classic normal-wing-tint" d="M180 185C110 200 60 290 85 345C115 380 165 280 180 185Z"></path>
                                        <g class="wing-shape-classic normal-wing-veins">
                                            <path class="vein-main" d="M178 194C145 229 119 281 98 332"/>
                                            <path class="vein-main" d="M174 208C139 232 113 260 92 298"/>
                                            <path class="vein-cross" d="M118 274C138 278 154 288 166 306"/>
                                            <path class="vein-structured" d="M156 236C143 266 133 304 126 346"/>
                                        </g>
                                        <path class="wing-shape-dragonfly" d="M180 185C130 190 90 280 100 335C125 360 165 260 180 185Z" fill="url(#wingGrad)" stroke="var(--shell-accent)" stroke-width="1.5"></path>
                                        <path class="wing-shape-moth" d="M180 185C80 200 40 320 75 385C125 420 175 300 180 185Z" fill="url(#wingGrad)" stroke="var(--shell-accent)" stroke-width="1.5"></path>
                                    </g>
                                    <g id="right-hindwing" class="wing">
                                        <path class="wing-shape-classic" d="M220 185C290 200 340 290 315 345C285 380 235 280 220 185Z" fill="url(#wingGrad)" stroke="var(--shell-accent)" stroke-width="1.5"></path>
                                        <path class="wing-shape-classic normal-wing-tint" d="M220 185C290 200 340 290 315 345C285 380 235 280 220 185Z"></path>
                                        <g class="wing-shape-classic normal-wing-veins">
                                            <path class="vein-main" d="M222 194C255 229 281 281 302 332"/>
                                            <path class="vein-main" d="M226 208C261 232 287 260 308 298"/>
                                            <path class="vein-cross" d="M282 274C262 278 246 288 234 306"/>
                                            <path class="vein-structured" d="M244 236C257 266 267 304 274 346"/>
                                        </g>
                                        <path class="wing-shape-dragonfly" d="M220 185C270 190 310 280 300 335C275 360 235 260 220 185Z" fill="url(#wingGrad)" stroke="var(--shell-accent)" stroke-width="1.5"></path>
                                        <path class="wing-shape-moth" d="M220 185C320 200 360 320 325 385C275 420 225 300 220 185Z" fill="url(#wingGrad)" stroke="var(--shell-accent)" stroke-width="1.5"></path>
                                    </g>
                                    <g id="left-wing" class="wing">
                                        <g class="wing-shape-classic">
                                            <path d="M180 185C60 185-10 340 35 465C70 515 170 380 180 185Z" fill="url(#wingGrad)" stroke="var(--shell-light)" stroke-width="1.5"></path>
                                            <path class="normal-wing-tint" d="M180 185C60 185-10 340 35 465C70 515 170 380 180 185Z"></path>
                                            <path d="M180 185C60 185-10 340 35 465" fill="none" stroke="var(--shell-light)" stroke-width="5" stroke-linecap="round"></path>
                                            <g class="normal-wing-veins">
                                                <path class="vein-main" d="M178 195C128 252 86 335 44 454"/>
                                                <path class="vein-main" d="M166 214C112 240 65 302 30 388"/>
                                                <path class="vein-main" d="M151 246C104 283 70 350 43 429"/>
                                                <path class="vein-cross" d="M83 290C116 300 143 318 164 346"/>
                                                <path class="vein-cross" d="M59 366C96 371 128 394 151 423"/>
                                                <path class="vein-structured" d="M137 218C126 278 128 348 139 432"/>
                                                <path class="vein-structured" d="M112 262C100 316 102 380 111 456"/>
                                            </g>
                                            <g class="normal-wing-edge-wear">
                                                <ellipse class="edge-notch soft" cx="359" cy="449" rx="8" ry="13" transform="rotate(18 359 449)"/>
                                                <ellipse class="edge-notch fray" cx="344" cy="401" rx="6" ry="11" transform="rotate(12 344 401)"/>
                                                <ellipse class="edge-notch tear" cx="324" cy="339" rx="5" ry="9" transform="rotate(10 324 339)"/>
                                            </g>
                                        </g>
                                        <g class="wing-shape-dragonfly">
                                            <path d="M180 185C130 170 50 250 30 480C20 540 140 320 180 185Z" fill="url(#wingGrad)" stroke="var(--shell-light)" stroke-width="1.5"></path>
                                            <path d="M180 185C130 170 50 250 30 480" fill="none" stroke="var(--shell-light)" stroke-width="4" stroke-linecap="round"></path>
                                        </g>
                                        <g class="wing-shape-moth">
                                            <path d="M180 185C30 150 -50 300 20 440C90 580 180 400 180 185Z" fill="url(#wingGrad)" stroke="var(--shell-light)" stroke-width="1.5"></path>
                                            <path d="M180 185C30 150 -50 300 20 440" fill="none" stroke="var(--shell-light)" stroke-width="6" stroke-linecap="round"></path>
                                        </g>
                                    </g>
                                    <g id="right-wing" class="wing">
                                        <g class="wing-shape-classic">
                                            <path d="M220 185C340 185 410 340 365 465C330 515 230 380 220 185Z" fill="url(#wingGrad)" stroke="var(--shell-light)" stroke-width="1.5"></path>
                                            <path class="normal-wing-tint" d="M220 185C340 185 410 340 365 465C330 515 230 380 220 185Z"></path>
                                            <path d="M220 185C340 185 410 340 365 465" fill="none" stroke="var(--shell-light)" stroke-width="5" stroke-linecap="round"></path>
                                            <g class="normal-wing-veins">
                                                <path class="vein-main" d="M222 195C272 252 314 335 356 454"/>
                                                <path class="vein-main" d="M234 214C288 240 335 302 370 388"/>
                                                <path class="vein-main" d="M249 246C296 283 330 350 357 429"/>
                                                <path class="vein-cross" d="M317 290C284 300 257 318 236 346"/>
                                                <path class="vein-cross" d="M341 366C304 371 272 394 249 423"/>
                                                <path class="vein-structured" d="M263 218C274 278 272 348 261 432"/>
                                                <path class="vein-structured" d="M288 262C300 316 298 380 289 456"/>
                                            </g>
                                            <g class="normal-wing-edge-wear">
                                                <ellipse class="edge-notch soft" cx="359" cy="449" rx="8" ry="13" transform="rotate(18 359 449)"/>
                                                <ellipse class="edge-notch fray" cx="344" cy="401" rx="6" ry="11" transform="rotate(12 344 401)"/>
                                                <ellipse class="edge-notch tear" cx="324" cy="339" rx="5" ry="9" transform="rotate(10 324 339)"/>
                                            </g>
                                        </g>
                                        <g class="wing-shape-dragonfly">
                                            <path d="M220 185C270 170 350 250 370 480C380 540 260 320 220 185Z" fill="url(#wingGrad)" stroke="var(--shell-light)" stroke-width="1.5"></path>
                                            <path d="M220 185C270 170 350 250 370 480" fill="none" stroke="var(--shell-light)" stroke-width="4" stroke-linecap="round"></path>
                                        </g>
                                        <g class="wing-shape-moth">
                                            <path d="M220 185C370 150 450 300 380 440C310 580 220 400 220 185Z" fill="url(#wingGrad)" stroke="var(--shell-light)" stroke-width="1.5"></path>
                                            <path d="M220 185C370 150 450 300 380 440" fill="none" stroke="var(--shell-light)" stroke-width="6" stroke-linecap="round"></path>
                                        </g>
                                    </g>
                                </g>
                            </g>

                            <!-- Glitch Slicing Layers -->
                            <use href="#all-art" class="glitch-layer glitch-layer-1" />
                            <use href="#all-art" class="glitch-layer glitch-layer-2" />

                            <!-- Topmost transparent call target, so animated wings cannot steal head clicks in flight. -->
                            <path id="head-hitbox" d="M126 102C126 72 150 48 200 48C250 48 274 72 274 102L274 154C274 184 248 198 200 198C152 198 126 184 126 154Z" fill="transparent" />
                        </g>
                    </g>
                </svg>
            </div>
        </div>
    `;

    export class CicadaGenerator {
        constructor({ mount, instructions = {} } = {}) {
            this.mount = typeof mount === 'string' ? document.querySelector(mount) : mount;
            this.host = document.createElement('div');
            this.root = this.host.attachShadow({ mode: 'open' });
            this.root.appendChild(template.content.cloneNode(true));
            this.shell = this.root.querySelector('.cicada-shell');
            this.mount.appendChild(this.host);
            this.gait = new PlantedFootGait(this.root, LEG_SPECS);
            this.flightRampFrame = null;
            this.flightProgress = 0;

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
            this.instructions = { ...this.instructions, ...instructions };
            const { unit = 'vmin' } = this.instructions;
            const size = numberOr(this.instructions.size, 80);
            const rotation = numberOr(this.instructions.rotation, 0);
            const xOffset = numberOr(this.instructions.xOffset, 0);
            const yOffset = numberOr(this.instructions.yOffset, 0);
            const hueShift = numberOr(this.instructions.hueShift, 0);
            const brightness = numberOr(this.instructions.brightness, 1);

            Object.assign(this.shell.style, {
                width: `${size}${unit}`,
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) translate(${xOffset}${unit}, ${yOffset}${unit}) rotate(${rotation}deg)`,
                filter: `hue-rotate(${hueShift}deg) brightness(${brightness})`
            });
            if (this.instructions.seed !== undefined) this.shell.setAttribute('data-seed', String(this.instructions.seed));
            this._applyWingMicroFinish();
            this._applyBarkBackdrop();

            this.shell.classList.toggle('is-flying', Boolean(this.instructions.flying));
            this.shell.classList.remove('is-taking-off', 'is-landing');
            this._setFlightVisualProgress(this.instructions.flying ? 1 : 0);
            this.shell.classList.toggle('is-wireframe', this.instructions.wireframe);

            const defaultSkin = this.instructions.skin || 'none';
            const thoraxSkin = this.instructions.thoraxSkin || defaultSkin;
            const abdomenSkin = this.instructions.abdomenSkin || defaultSkin;
            const rarityTier = String(this.instructions.rarityTier || 'common').toLowerCase();

            setAttributes(this.shell, {
                'data-wing': this.instructions.wingPattern || 'glass',
                'data-wing-shape': 'classic',
                'data-normal-wing-veins': this.instructions.normalWingVeins || 'clean',
                'data-normal-wing-tint': this.instructions.normalWingTint || 'clear',
                'data-normal-wing-edge': this.instructions.normalWingEdge || 'clean-edge',
                'data-antennae': this.instructions.antennae || 'none',
                'data-antennae-variant': this.instructions.antennaeVariant || (this.instructions.antennae === 'none' ? 'none' : 'standard'),
                'data-eye': this.instructions.eyeType || 'classic',
                'data-eye-behavior': this.instructions.eyeBehavior || 'static',
                'data-eye-style': this.instructions.eyeStyle || 'none',
                'data-eye-style-color': this.instructions.eyeStyleColor || 'match-eye',
                'data-abdomen': this.instructions.abdomen || 'smooth',
                'data-abdomen-variant': this.instructions.abdomenVariant || 'balanced',
                'data-thorax-skin': thoraxSkin,
                'data-abdomen-skin': abdomenSkin,
                'data-aura': this.instructions.aura || 'none',
                'data-legs': this.instructions.legs || 'organic',
                'data-laser': this.instructions.laserType || 'none',
                'data-lightning-type': this.instructions.lightningType || 'ambient',
                'data-lightning-color': this.instructions.lightningColor || 'white',
                'data-glitch-style': this.instructions.glitchStyle || 'whole-body-rgb-split',
                'data-marking-layer': this.instructions.markingLayer || 'none',
                'data-motion-field': this.instructions.motionField || 'none',
                'data-prime-set': this.instructions.primeSet || 'none',
                'data-ambient-field': this.instructions.ambientField || 'none',
                'data-bark-backdrop': this.instructions.barkBackdrop || 'none',
                'data-rarity-tier': rarityTier,
                'data-tymbal-layer': this.instructions.tymbalLayer || 'none'
            });

            const shellParams = SHELL_PRESETS[this.instructions.shellColor] || SHELL_PRESETS.emerald;
            const eyeParams = EYE_PRESETS[this.instructions.eyeColor] || EYE_PRESETS.crimson;
            const eyeStylePreset = EYE_STYLE_COLOR_PRESETS[this.instructions.eyeStyleColor] || EYE_STYLE_COLOR_PRESETS['match-eye'];
            const eyeStyleColor = eyeStylePreset.primary || eyeParams.fill;
            const eyeStyleAltColor = eyeStylePreset.alt || eyeParams.glow || eyeParams.fill;
            const eyeStyleGlow = eyeStylePreset.glow || eyeParams.glow || eyeParams.fill;
            const eyeStyleAltGlow = eyeStylePreset.altGlow || eyeStyleGlow;
            const baseColor = this.instructions.color === 'rainbow' ? 'red' : this.instructions.color;
            const neonColor = CICADA_COLOR_PRESETS[baseColor] || DEFAULT_NEON_COLOR;
            const laserColor = LASER_COLORS[this.instructions.laserColor] || LASER_COLORS.red;
            const cipherColor = eyeParams.glow && eyeParams.glow !== 'transparent' ? eyeParams.glow : shellParams.accent;
            const ambientColor = this.instructions.ambientField === 'prime-ash' ? laserColor : '#ffffff';
            const normalWingVeinColor = ['common', 'uncommon'].includes(rarityTier) ? 'rgba(218,232,224,.62)' : shellParams.accent;
            const normalWingTintMap = {
                clear: ['rgba(255,255,255,.04)', '.04'],
                'smoke-grey': ['rgba(175,186,182,.80)', '.10'],
                'warm-amber': ['rgba(208,176,112,.84)', '.11'],
                'olive-smoke': ['rgba(142,158,120,.80)', '.095'],
                'cool-blue-grey': ['rgba(152,178,198,.78)', '.10'],
                none: ['rgba(255,255,255,.04)', '.04']
            };
            const [normalWingTintColor, normalWingTintOpacity] = normalWingTintMap[this.instructions.normalWingTint || 'clear'] || normalWingTintMap.clear;
            setProperties(this.host.style, {
                '--neon-color': neonColor,
                '--shell-light': shellParams.light,
                '--shell-dark': shellParams.dark,
                '--shell-accent': shellParams.accent,
                '--eye-color': eyeParams.fill,
                '--eye-glow': eyeParams.glow,
                '--eye-style-color': eyeStyleColor,
                '--eye-style-alt-color': eyeStyleAltColor,
                '--eye-style-glow': eyeStyleGlow,
                '--eye-style-alt-glow': eyeStyleAltGlow,
                '--laser-color': laserColor,
                '--cipher-color': cipherColor,
                '--ambient-color': ambientColor,
                '--normal-wing-vein-color': normalWingVeinColor,
                '--normal-wing-tint-color': normalWingTintColor,
                '--normal-wing-tint-opacity': normalWingTintOpacity,
                '--wing-wear-cutout': '#0b110e'
            });

            const effects = new Set(this.instructions.effects || []);
            if (this.instructions.color === 'rainbow') effects.add('rainbow');

            for (const effect of SUPPORTED_EFFECTS) {
                this.shell.classList.toggle(`is-${effect}`, effects.has(effect));
            }
        }

        _setFlightVisualProgress(progress) {
            const p = clamp01(progress);
            this.flightProgress = p;
            const eased = easeInOut(p);
            const glitchSpeed = lerp(0.42, 0.2, eased).toFixed(3);
            const laser = clamp01((eased - 0.08) / 0.92);
            setProperties(this.shell.style, {
                '--fore-flap-speed': `${lerp(0.16, 0.022, eased).toFixed(3)}s`,
                '--hind-flap-speed': `${lerp(0.14, 0.019, eased).toFixed(3)}s`,
                '--body-vibe-speed': `${lerp(0.18, 0.028, eased).toFixed(3)}s`,
                '--glitch-opacity': clamp01((eased - 0.18) / 0.82).toFixed(3),
                '--glitch-slice-speed': `${glitchSpeed}s`,
                '--glitch-jitter-speed': `${glitchSpeed}s`,
                '--laser-length': Math.max(0.001, laser).toFixed(3),
                '--laser-opacity': (laser * 0.9).toFixed(3),
                '--laser-brightness': (0.7 + laser * 1.05).toFixed(3),
                '--laser-saturation': (0.8 + laser * 0.7).toFixed(3),
                '--laser-glow': `${(laser * 16).toFixed(1)}px`
            });
        }

        _animateFlightVisuals(from, to, duration, onComplete) {
            if (this.flightRampFrame) cancelAnimationFrame(this.flightRampFrame);
            const start = performance.now();
            const step = (now) => {
                const raw = Math.min(1, (now - start) / duration);
                this._setFlightVisualProgress(lerp(from, to, easeInOut(raw)));
                if (raw < 1) {
                    this.flightRampFrame = requestAnimationFrame(step);
                } else {
                    this.flightRampFrame = null;
                    this._setFlightVisualProgress(to);
                    onComplete?.();
                }
            };
            this.flightRampFrame = requestAnimationFrame(step);
        }

        setFlying(active) {
            this._endWalk();
            const shouldFly = Boolean(active);
            this.instructions.flying = shouldFly;
            this.shell.classList.remove('is-taking-off', 'is-landing');

            if (shouldFly) {
                // Sync the visual 23s lightning loop with the new JS thunder loop
                if(this.instructions.effects && this.instructions.effects.includes('lightning')) {
                    this.shell.classList.remove('is-lightning');
                    void this.shell.offsetWidth; // Force CSS reflow to reset animation timers to t=0
                    this.shell.classList.add('is-lightning');
                }

                this.shell.classList.add('is-flying', 'is-taking-off');
                this._animateFlightVisuals(this.flightProgress, 1, 1250, () => {
                    this.shell.classList.remove('is-taking-off');
                });
            } else {
                this.shell.classList.add('is-flying', 'is-landing');
                this._animateFlightVisuals(this.flightProgress || 1, 0, 1100, () => {
                    this.shell.classList.remove('is-flying', 'is-landing');
                    // Conscious post-landing resettle (seeded, slight delay).
                    if (this._landGestureTimeout) clearTimeout(this._landGestureTimeout);
                    this._landGestureTimeout = setTimeout(() => this._eventGesture('landed'), 260 + (this._wanderRng ? this._wanderRng() * 600 : 300));
                });
            }
        }

        // v11.2: photographic bark backdrop. The source image is rendered without
        // wash, tint, or brightness changes so the tree bark keeps its natural tone.
        // v11.3: seeded crop/translate/scale/rotate so every seed gets a unique framing
        // of its tree even when the same bark photo is reused.
        _applyBarkBackdrop() {
            const style = this.instructions.barkBackdrop || 'none';
            const seed = numberOr(this.instructions.seed, 0);
            const key = `${style}|${seed}`;
            if (this._barkKey === key) return;
            this._barkKey = key;
            const layer = this.root.querySelector('#bark-backdrop-layer');
            if (!layer) return;
            if (style === 'none' || !seed) { layer.innerHTML = ''; return; }
            const X0 = -320, X1 = 720, Y0 = -260, Y1 = 760;
            const W = X1 - X0, H = Y1 - Y0;
            const base = this.instructions.barkAssetBase || 'assets/bark/';
            const href = this.instructions.barkAssetMap?.[style] || `${base}${style}.jpg`;
            const vig = `bark-vignette-${seed}`;
            const placement = this.instructions.barkPlacement || { scale: 1, tx: 0, ty: 0, rotate: 0 };
            const cx = (X0 + X1) / 2;
            const cy = (Y0 + Y1) / 2;
            const transform = `translate(${cx + placement.tx} ${cy + placement.ty}) rotate(${placement.rotate}) scale(${placement.scale}) translate(${-cx} ${-cy})`;
            layer.innerHTML =
                `<defs><radialGradient id="${vig}" cx="50%" cy="46%" r="62%">` +
                `<stop offset="0%" stop-color="#0b110e" stop-opacity="0"/>` +
                `<stop offset="60%" stop-color="#0b110e" stop-opacity="0"/>` +
                `<stop offset="100%" stop-color="#0b110e" stop-opacity="0.18"/>` +
                `</radialGradient></defs>` +
                `<image href="${href}" xlink:href="${href}" x="${X0}" y="${Y0}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice" transform="${transform}"/>` +
                `<rect x="${X0}" y="${Y0}" width="${W}" height="${H}" fill="url(#${vig})"/>`;
        }

        // Seeded micro-finish for the wings: a subtle inner rim with varied edge
        // dashes, translucent sheen bands, occasional faint crease lines, and a
        // very small idle sway. Purely cosmetic layers derived from the seed —
        // wing shape, span, and the base collection identity are unchanged.
        _applyWingMicroFinish() {
            const seed = numberOr(this.instructions.seed, 0);
            if (!seed || this._wingFinishSeed === seed) return;
            this._wingFinishSeed = seed;
            const rng = mulberry32((seed ^ 0x77F1A6) >>> 0);
            const tierKey = String(this.instructions.rarityTier || 'common').toLowerCase();
            const tier = FINISH_TIER_SCALE[tierKey] || FINISH_TIER_SCALE.common;
            const svgNS = 'http://www.w3.org/2000/svg';
            const make = (tag, attrs) => {
                const el = document.createElementNS(svgNS, tag);
                for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
                return el;
            };
            // Crease likelihood follows the seed's existing edge-wear trait so the
            // finish stays consistent with the established collection identity.
            const edge = this.instructions.normalWingEdge || 'clean-edge';
            const foldChance = { 'clean-edge': 0.18, 'soft-nicks': 0.38, 'minor-fray': 0.58, 'tiny-tears': 0.78 }[edge] ?? 0.18;

            const bezier = (P, t) => {
                const u = 1 - t;
                return [
                    u * u * u * P[0][0] + 3 * u * u * t * P[1][0] + 3 * u * t * t * P[2][0] + t * t * t * P[3][0],
                    u * u * u * P[0][1] + 3 * u * u * t * P[1][1] + 3 * u * t * t * P[2][1] + t * t * t * P[3][1]
                ];
            };
            // Leading curve of the main left panel; the right panel is its mirror.
            const leftCurve = [[180, 185], [60, 185], [-10, 340], [35, 465]];
            const sides = [
                { sel: '#left-wing .wing-shape-classic', mirror: false, origin: '180px 185px' },
                { sel: '#right-wing .wing-shape-classic', mirror: true, origin: '220px 185px' }
            ];
            for (const side of sides) {
                const host = this.root.querySelector(side.sel);
                if (!host) continue;
                host.querySelectorAll('.wing-rim,.wing-sheen,.wing-fold').forEach(el => el.remove());
                const mx = side.mirror ? x => 400 - x : x => x;

                // Inner rim: traces just inside the outline with a seeded dash
                // rhythm, giving each seed its own quiet edge variation.
                const rimPts = [];
                for (let k = 0; k <= 8; k++) {
                    const t = 0.06 + (k / 8) * 0.86;
                    const [x, y] = bezier(leftCurve, t);
                    const towardCentre = 200 - x;
                    const inset = 5.5 + rng() * 2.5;
                    rimPts.push([mx(x + Math.sign(towardCentre) * inset * 0.6), y - inset * 0.5]);
                }
                const rim = make('path', {
                    class: 'wing-rim',
                    d: 'M' + rimPts.map(p => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('L'),
                    'stroke-width': (0.8 + rng() * 0.5).toFixed(2),
                    'stroke-dasharray': `${(5 + rng() * 11).toFixed(1)} ${(3 + rng() * 6).toFixed(1)}`,
                    opacity: (0.18 + rng() * 0.14).toFixed(2)
                });
                host.appendChild(rim);

                // Translucent sheen: one or two soft light bands across the panel.
                const sheenCount = 1 + (rng() < 0.45 ? 1 : 0) + tier.extraLayers;
                for (let n = 0; n < sheenCount; n++) {
                    const t0 = 0.12 + rng() * 0.25;
                    const t1 = t0 + 0.3 + rng() * 0.25;
                    const [x0, y0] = bezier(leftCurve, t0);
                    const [x1, y1] = bezier(leftCurve, t1);
                    const cx = (x0 + x1) / 2 + 30 + rng() * 30;
                    const cy = (y0 + y1) / 2 + 10 + rng() * 20;
                    const sheen = make('path', {
                        class: 'wing-sheen',
                        d: `M${mx(x0 + 14).toFixed(1)} ${(y0 + 8).toFixed(1)}Q${mx(cx).toFixed(1)} ${cy.toFixed(1)} ${mx(x1 + 10).toFixed(1)} ${(y1 - 6).toFixed(1)}`,
                        'stroke-width': (9 + rng() * 8).toFixed(1),
                        opacity: Math.min(0.16, (0.045 + rng() * 0.04) * tier.sheen).toFixed(3)
                    });
                    host.appendChild(sheen);
                }

                // Occasional crinkling: short faint crease lines running inward
                // from the edge at seeded positions and angles.
                if (rng() < Math.min(0.92, foldChance * (0.6 + tier.fold * 0.4))) {
                    const folds = 1 + Math.floor(rng() * 3) + (tier.extraLayers ? 1 : 0);
                    for (let n = 0; n < folds; n++) {
                        const t = 0.3 + rng() * 0.55;
                        const [x, y] = bezier(leftCurve, t);
                        const len = 14 + rng() * 18;
                        const jitter = (rng() - 0.5) * 0.8;
                        const dirX = (200 - x) / Math.abs(200 - x || 1);
                        const ex = x + dirX * len * Math.cos(jitter);
                        const ey = y - len * 0.45 + len * Math.sin(jitter) * 0.4;
                        const fold = make('path', {
                            class: 'wing-fold',
                            d: `M${mx(x + dirX * 3).toFixed(1)} ${y.toFixed(1)}L${mx(ex).toFixed(1)} ${ey.toFixed(1)}`,
                            'stroke-width': (0.7 + rng() * 0.5).toFixed(2),
                            opacity: Math.min(0.34, (0.09 + rng() * 0.11) * tier.fold).toFixed(2)
                        });
                        host.appendChild(fold);
                    }
                }

                // Subtle idle adjustment: a very small seeded sway while landed.
                host.classList.add('wing-micro-idle');
                host.style.transformOrigin = side.origin;
                host.style.transformBox = 'view-box';
                host.style.setProperty('--wing-idle-amp', `${Math.min(2.2, (0.35 + rng() * 0.5) * tier.sway).toFixed(2)}deg`);
                host.style.animation = `wingIdleSway ${Math.max(2.6, (6 + rng() * 5) / (0.6 + tier.sway * 0.4)).toFixed(1)}s ease-in-out ${(rng() * 4).toFixed(1)}s infinite alternate`;
            }

            // Ground fidget: while landed, each leg makes a tiny seeded settle
            // and re-grip motion. Amplitude and tempo scale with rarity tier;
            // takeoff/landing/flight poses always override it.
            const legUnits = this.root.querySelectorAll('#legs-layer .leg-unit');
            legUnits.forEach((leg, index) => {
                const amp = Math.min(2.6, (0.4 + rng() * 0.5) * tier.fidget);
                const dur = Math.max(2.2, (4.5 + rng() * 4) / (0.6 + tier.fidget * 0.4));
                leg.classList.add('leg-ground-fidget');
                leg.style.setProperty('--leg-fidget-amp', `${amp.toFixed(2)}deg`);
                leg.style.setProperty('--leg-fidget-lift', `${(amp * 0.45).toFixed(2)}px`);
                leg.style.animation = `legGroundFidget ${dur.toFixed(1)}s ease-in-out ${(rng() * 3 + index * 0.35).toFixed(2)}s infinite alternate`;
            });

            // Rear panels get a single small sheen each so the layering reads
            // through the whole span without changing the silhouette.
            for (const sel of ['#left-hindwing', '#right-hindwing']) {
                const host = this.root.querySelector(sel);
                if (!host) continue;
                host.querySelectorAll('.wing-sheen').forEach(el => el.remove());
                const mirror = sel.includes('right');
                const bx = mirror ? x => 400 - x : x => x;
                const sheen = make('path', {
                    class: 'wing-shape-classic wing-sheen',
                    d: `M${bx(160).toFixed(1)} ${(212 + rng() * 14).toFixed(1)}Q${bx(118).toFixed(1)} ${(258 + rng() * 18).toFixed(1)} ${bx(100).toFixed(1)} ${(316 + rng() * 16).toFixed(1)}`,
                    'stroke-width': (6 + rng() * 5).toFixed(1),
                    opacity: Math.min(0.14, (0.04 + rng() * 0.035) * tier.sheen).toFixed(3)
                });
                host.appendChild(sheen);
            }
        }

        // -------------------------------------------------------------------
        // v11.3.5 GROUND WANDER + WING SHUFFLE
        // A seeded, deterministic idle-behaviour loop. While landed, the cicada
        // occasionally strolls a short path around its perch (legs scuttle,
        // body bobs, shell tilts into the heading) or resettles its wings with
        // a quick shuffle-flick. Flight, takeoff, landing, and signature calls
        // always take priority; reduced-motion preferences suppress it fully.
        // -------------------------------------------------------------------
        // The wander transform is applied to the cicada art group INSIDE the
        // SVG (never the shell), so the bark backdrop and ambient layers stay
        // pinned to the gallery grid — only the insect moves. Units are
        // viewBox units (400-wide art space).
        _wanderTarget() {
            if (!this._wanderEl || !this._wanderEl.isConnected) {
                this._wanderEl = this.root.querySelector('#effect-wrapper');
            }
            return this._wanderEl;
        }

        _applyWanderTransform(sway = 0, bob = 0) {
            const el = this._wanderTarget();
            if (!el) return;
            const w = this._wander || { x: 0, y: 0 };
            if (!w.x && !w.y && !sway && !bob) {
                el.style.removeProperty('transform');
                return;
            }
            el.style.transform = `translate(${w.x.toFixed(1)}px, ${(w.y + bob).toFixed(1)}px) rotate(${sway.toFixed(2)}deg)`;
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
            const cls = this.shell.classList;
            if (cls.contains('is-flying') || cls.contains('is-taking-off') || cls.contains('is-landing') || cls.contains('is-calling')) return;
            const r = this._wanderRng;
            // Weighted idle repertoire: walking stays the main behaviour; the
            // rest is a mix of distinct wing gestures — subconscious tics
            // (flick, one-wing flick), settling moves (shuffle), and rare
            // deliberate comfort moves (stretch, tremble).
            const roll = r();
            if (roll < 0.50) this._walkStep(r, tier);
            else if (roll < 0.68) this._wingShuffle(r);
            else if (roll < 0.80) this._wingFlick(r);
            else if (roll < 0.88) this._wingFlickOne(r);
            else if (roll < 0.95) this._wingTremble(r);
            else this._wingStretch(r);
        }

        // Shared one-shot gesture runner: restarts the CSS animation and
        // removes the class after it completes. All gesture classes are
        // gated with :not(.is-flying), so flight always overrides.
        _wingGesture(cls, durMs) {
            const GESTURES = ['is-wing-shuffling', 'is-wing-flicking', 'is-wing-flicking-left', 'is-wing-flicking-right', 'is-wing-trembling', 'is-wing-stretching'];
            this.shell.classList.remove(...GESTURES);
            void this.shell.offsetWidth; // restart the one-shot animation
            this.shell.classList.add(cls);
            if (this._gestureTimeout) clearTimeout(this._gestureTimeout);
            this._gestureTimeout = setTimeout(() => this.shell.classList.remove(cls), durMs + 120);
        }

        // Slow resettle: wings ease out, rustle, and fold back (obvious).
        _wingShuffle(r) {
            const dur = 0.7 + r() * 0.55;
            this.shell.style.setProperty('--wing-shuffle-dur', `${dur.toFixed(2)}s`);
            this.shell.style.setProperty('--wing-shuffle-amp', `${(9 + r() * 9).toFixed(1)}deg`);
            this._wingGesture('is-wing-shuffling', dur * 1000);
        }

        // Sharp snap-out/snap-back of all wings (quick, obvious): startle,
        // dust-shake, or post-landing resettle.
        _wingFlick(r) {
            const dur = 0.16 + r() * 0.14;
            this.shell.style.setProperty('--wing-flick-dur', `${dur.toFixed(2)}s`);
            this.shell.style.setProperty('--wing-flick-amp', `${(15 + r() * 13).toFixed(1)}deg`);
            this._wingGesture('is-wing-flicking', dur * 1000);
        }

        // A single forewing flicks alone (quick, subtle): grooming tic.
        _wingFlickOne(r) {
            const dur = 0.18 + r() * 0.12;
            this.shell.style.setProperty('--wing-flick-dur', `${dur.toFixed(2)}s`);
            this.shell.style.setProperty('--wing-flick-amp', `${(9 + r() * 8).toFixed(1)}deg`);
            this._wingGesture(r() < 0.5 ? 'is-wing-flicking-left' : 'is-wing-flicking-right', dur * 1000);
        }

        // Rapid tiny quiver (fast, subtle): post-call wind-down or pre-flight
        // nerves. Amplitude ~1–2.5deg at ~12–16Hz for a short burst.
        _wingTremble(r) {
            const beat = 0.055 + r() * 0.03;
            const reps = 6 + Math.floor(r() * 10);
            this.shell.style.setProperty('--wing-tremble-beat', `${beat.toFixed(3)}s`);
            this.shell.style.setProperty('--wing-tremble-reps', String(reps));
            this.shell.style.setProperty('--wing-tremble-amp', `${(1 + r() * 1.5).toFixed(2)}deg`);
            this._wingGesture('is-wing-trembling', beat * reps * 1000);
        }

        // Slow deliberate part-hold-fold (slow, obvious, rare): comfort move.
        _wingStretch(r) {
            const dur = 2.4 + r() * 1.6;
            this.shell.style.setProperty('--wing-stretch-dur', `${dur.toFixed(2)}s`);
            this.shell.style.setProperty('--wing-stretch-amp', `${(13 + r() * 9).toFixed(1)}deg`);
            this._wingGesture('is-wing-stretching', dur * 1000);
        }

        // Conscious gesture hook: fired by specific events (landing, end of a
        // signature call) rather than the idle timer.
        _eventGesture(kind) {
            if (!this._wanderRng || !this.shell?.isConnected || this._reducedMotion()) return;
            const cls = this.shell.classList;
            if (cls.contains('is-flying') || cls.contains('is-taking-off') || cls.contains('is-landing') || cls.contains('is-calling')) return;
            const r = this._wanderRng;
            if (kind === 'landed') {
                // Resettle after touching down: usually a quick flick, sometimes
                // a full shuffle to refold the wings.
                if (r() < 0.6) this._wingFlick(r); else this._wingShuffle(r);
            } else if (kind === 'call-ended') {
                // Wind-down quiver after singing; occasionally skipped.
                if (r() < 0.55) this._wingTremble(r);
            }
        }

        _walkStep(r, tier) {
            const target = this._wanderTarget();
            if (!target) return;
            // viewBox units: the art space is 400 wide, so 80 units = 20%.
            const maxRange = 80 * tier.wander;
            const step = 400 * (0.06 + r() * 0.08);
            let ang = r() * Math.PI * 2;
            let tx = this._wander.x + Math.cos(ang) * step;
            let ty = this._wander.y + Math.sin(ang) * step * 0.6;
            if (Math.hypot(tx, ty) > maxRange) {
                // Steer back toward the home perch with a little seeded wobble.
                ang = Math.atan2(-this._wander.y, -this._wander.x) + (r() - 0.5) * 0.9;
                tx = this._wander.x + Math.cos(ang) * step;
                ty = this._wander.y + Math.sin(ang) * step * 0.6;
            }
            const fromX = this._wander.x, fromY = this._wander.y;
            const dist = Math.hypot(tx - fromX, ty - fromY);
            if (dist < 3) return;
            const duration = Math.max(900, dist / (0.026 + r() * 0.018)); // slow scuttle
            const tiltDir = Math.cos(ang) >= 0 ? 1 : -1;
            const maxTilt = 2.2 + r() * 2.6;
            this._wander.active = true;
            // Per-frame inline transforms must not fight the wrapper's CSS
            // transition; suspend it for the duration of the walk.
            this._savedWrapperTransition = target.style.transition;
            target.style.transition = 'none';
            target.style.transformOrigin = '200px 250px';
            target.style.transformBox = 'view-box';
            this.shell.style.setProperty('--walk-step-dur', `${(0.32 + r() * 0.18).toFixed(2)}s`);
            this.shell.classList.add('is-walking');
            const start = performance.now();
            const direction = { x: (tx - fromX) / dist, y: (ty - fromY) / dist };
            // Heading lean: the art faces "up", so rotate part-way toward the
            // travel direction (clamped) so the insect walks head-first
            // instead of sliding sideways.
            const headingLean = Math.max(-38, Math.min(38, Math.atan2(direction.x, -direction.y) * 180 / Math.PI)) * 0.45;
            this.gait.begin({ x: fromX, y: fromY, sway: 0 });
            const frame = now => {
                if (!this.shell.isConnected || this.shell.classList.contains('is-flying')) return this._endWalk();
                const p = Math.min(1, (now - start) / duration);
                const e = easeInOut(p);
                this._wander.x = lerp(fromX, tx, e);
                this._wander.y = lerp(fromY, ty, e);
                // Ramp heading/bob in and out so start and finish never snap.
                const ramp = Math.min(1, p / 0.18, (1 - p) / 0.18);
                const sway = Math.sin(p * Math.PI) * maxTilt * tiltDir + headingLean * ramp;
                const bob = Math.sin((now - start) / 420 * Math.PI * 2) * 1.1 * ramp;
                this._applyWanderTransform(sway, bob);
                this.gait.update({ x: this._wander.x, y: this._wander.y + bob, sway }, now - start, direction);
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

        triggerCallVisual(durationMs) {
            this.shell.classList.add('is-calling');
            if (this.callTimeout) clearTimeout(this.callTimeout);
            this.callTimeout = setTimeout(() => {
                this.shell.classList.remove('is-calling');
                // Conscious wind-down quiver after the song ends.
                this._eventGesture('call-ended');
            }, durationMs);
        }

        destroy() {
            if (this.flightRampFrame) cancelAnimationFrame(this.flightRampFrame);
            if (this.callTimeout) clearTimeout(this.callTimeout);
            if (this._wander?.timer) clearTimeout(this._wander.timer);
            if (this._wander?.frame) cancelAnimationFrame(this._wander.frame);
            if (this._gestureTimeout) clearTimeout(this._gestureTimeout);
            if (this._landGestureTimeout) clearTimeout(this._landGestureTimeout);
            this.host.remove();
        }
    }
