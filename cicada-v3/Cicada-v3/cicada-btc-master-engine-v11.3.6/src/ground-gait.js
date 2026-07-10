// Planted-foot walking for the SVG cicadas.  Foot anchors live in the bark's
// coordinate space; only a swinging foot is allowed to move across it.
//
// v11.3.7 gait upgrades (visual-only, fully deterministic):
//   - stride period follows body speed (faster body -> quicker steps)
//   - foot placement is velocity-predicted instead of a fixed lead
//   - swing uses an eased trajectory with a touchdown settle
//   - each leg carries a small fixed phase offset so tripods do not snap
//     in perfect unison
//   - overstretched stance feet trigger a corrective re-step

const PIVOT = { x: 200, y: 250 };
const TRIPODS = [new Set(['front-leg-left', 'middle-leg-right', 'hind-leg-left']), new Set(['front-leg-right', 'middle-leg-left', 'hind-leg-right'])];
const STEP_LEN = 30;      // nominal stride in viewBox units
const SWING_PORTION = 0.68; // fraction of a period a swing occupies
const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
const mix = (a, b, t) => a + (b - a) * t;
const easeOutQuad = t => 1 - (1 - t) * (1 - t);

function rotate(point, degrees) {
    const angle = degrees * Math.PI / 180;
    const x = point.x - PIVOT.x, y = point.y - PIVOT.y;
    return { x: PIVOT.x + x * Math.cos(angle) - y * Math.sin(angle), y: PIVOT.y + x * Math.sin(angle) + y * Math.cos(angle) };
}

function toWorld(point, body) {
    const r = rotate(point, body.sway || 0);
    return { x: r.x + body.x, y: r.y + body.y };
}

function toLocal(point, body) {
    return rotate({ x: point.x - body.x, y: point.y - body.y }, -(body.sway || 0));
}

function solveLeg(spec, foot) {
    const [hip, originalKnee, originalAnkle, originalFoot] = spec.points.map(([x, y]) => ({ x, y }));
    const l1 = Math.hypot(originalKnee.x - hip.x, originalKnee.y - hip.y);
    const l2 = Math.hypot(originalAnkle.x - originalKnee.x, originalAnkle.y - originalKnee.y);
    const l3 = Math.hypot(originalFoot.x - originalAnkle.x, originalFoot.y - originalAnkle.y);
    let dx = foot.x - hip.x, dy = foot.y - hip.y;
    let distance = Math.hypot(dx, dy) || 0.001;
    const ux = dx / distance, uy = dy / distance;
    // Keep the tarsus aimed toward the contact point, then solve the femur and tibia.
    const ankleTarget = { x: foot.x - ux * l3, y: foot.y - uy * l3 };
    dx = ankleTarget.x - hip.x; dy = ankleTarget.y - hip.y;
    distance = clamp(Math.hypot(dx, dy), Math.abs(l1 - l2) + 0.01, l1 + l2 - 0.01);
    const ax = dx / (Math.hypot(dx, dy) || 1), ay = dy / (Math.hypot(dx, dy) || 1);
    const along = (l1 * l1 - l2 * l2 + distance * distance) / (2 * distance);
    const height = Math.sqrt(Math.max(0, l1 * l1 - along * along));
    const originalCross = (originalKnee.x - hip.x) * (originalAnkle.y - originalKnee.y) - (originalKnee.y - hip.y) * (originalAnkle.x - originalKnee.x);
    const side = originalCross >= 0 ? 1 : -1;
    const knee = { x: hip.x + ax * along - ay * height * side, y: hip.y + ay * along + ax * height * side };
    const ankle = { x: hip.x + ax * distance, y: hip.y + ay * distance };
    return { hip, knee, ankle, foot };
}

function paintLeg(root, spec, pose) {
    const leg = root.querySelector(`#${spec.id}`);
    if (!leg) return;
    const { hip, knee, ankle, foot } = pose;
    const full = `M${hip.x} ${hip.y}L${knee.x} ${knee.y}L${ankle.x} ${ankle.y}L${foot.x} ${foot.y}`;
    const path = (a, b) => `M${a.x} ${a.y}L${b.x} ${b.y}`;
    leg.querySelector('.leg-shadow')?.setAttribute('d', full);
    leg.querySelector('.leg-upper')?.setAttribute('d', path(hip, knee));
    leg.querySelector('.leg-lower')?.setAttribute('d', path(knee, ankle));
    leg.querySelector('.leg-tip')?.setAttribute('d', path(ankle, foot));
    const dx = knee.x - hip.x, dy = knee.y - hip.y, length = Math.hypot(dx, dy) || 1;
    leg.querySelector('.leg-detail')?.setAttribute('d', `M${(hip.x - dy / length * 1.6).toFixed(1)} ${(hip.y + dx / length * 1.6).toFixed(1)}L${(knee.x - dy / length * 1.6).toFixed(1)} ${(knee.y + dx / length * 1.6).toFixed(1)}`);
    const anchors = leg.querySelectorAll('.leg-anchor');
    [[hip, anchors[0]], [knee, anchors[1]], [ankle, anchors[2]]].forEach(([point, el]) => { if (el) { el.setAttribute('cx', point.x); el.setAttribute('cy', point.y); } });
    const pad = leg.querySelector('.leg-pad');
    if (pad) {
        pad.setAttribute('cx', foot.x); pad.setAttribute('cy', foot.y);
        pad.setAttribute('transform', `rotate(${(Math.atan2(foot.y - ankle.y, foot.x - ankle.x) * 180 / Math.PI).toFixed(1)} ${foot.x} ${foot.y})`);
    }
}

export class PlantedFootGait {
    constructor(root, specs) {
        this.root = root;
        // Fixed, deterministic per-leg phase offsets (golden-ratio spread)
        // so the two tripods do not lift and land in robotic unison.
        this.legs = specs.map((spec, index) => ({
            spec,
            anchor: null,
            swing: null,
            lastIdx: null,
            phaseJitter: (((index * 0.618034) % 1) - 0.5) * 0.16
        }));
        this.active = false;
    }

    begin(body) {
        this.active = true;
        this.phase = 0;
        this.prevTime = 0;
        this.prevBody = null;
        this.speed = 0;
        for (const leg of this.legs) {
            leg.anchor = toWorld({ x: leg.spec.points[3][0], y: leg.spec.points[3][1] }, body);
            leg.swing = null;
            leg.lastIdx = null;
        }
    }

    update(body, elapsed, direction) {
        if (!this.active) return;
        const dt = Math.max(0, elapsed - this.prevTime);
        this.prevTime = elapsed;
        // Smoothed body speed (viewBox units per ms).
        if (this.prevBody && dt > 0) {
            const moved = Math.hypot(body.x - this.prevBody.x, body.y - this.prevBody.y);
            this.speed = this.speed * 0.8 + (moved / dt) * 0.2;
        }
        this.prevBody = { x: body.x, y: body.y };
        // Stride period tracks body speed: quick scuttles take quick steps.
        const period = clamp(STEP_LEN / Math.max(this.speed, 0.02), 240, 620);
        this.phase += dt / period;

        for (const leg of this.legs) {
            const cyc = this.phase + leg.phaseJitter;
            const idx = Math.floor(cyc);
            const tripod = ((idx % 2) + 2) % 2;
            const inTripod = TRIPODS[tripod].has(leg.spec.id);
            const rest = { x: leg.spec.points[3][0], y: leg.spec.points[3][1] };
            let foot = toLocal(leg.anchor, body);
            const stretch = Math.hypot(foot.x - rest.x, foot.y - rest.y);
            // Begin a swing on this leg's tripod beat, or correct a stance
            // foot that has been dragged too far from its comfortable pose.
            if (!leg.swing && ((inTripod && idx !== leg.lastIdx) || stretch > 46)) {
                leg.lastIdx = idx;
                // Velocity-predicted placement: aim ahead of the rest pose by
                // how far the body will travel during the coming stride.
                const lead = clamp(this.speed * period * 1.35, 12, 44);
                leg.swing = { start: foot, end: { x: rest.x + direction.x * lead, y: rest.y + direction.y * lead }, begun: cyc };
            }
            if (leg.swing) {
                const t = clamp((cyc - leg.swing.begun) / SWING_PORTION, 0, 1);
                const et = easeOutQuad(t); // fast lift-off, decelerating placement
                const lift = Math.sin(t * Math.PI) * (7 + Math.min(5, this.speed * 60));
                // Touchdown settle: a tiny grip overshoot just before contact.
                const settle = t > 0.85 ? Math.sin((t - 0.85) / 0.15 * Math.PI) * 1.2 : 0;
                foot = {
                    x: mix(leg.swing.start.x, leg.swing.end.x, et) + direction.x * settle,
                    y: mix(leg.swing.start.y, leg.swing.end.y, et) - lift + direction.y * settle
                };
                if (t >= 1) {
                    leg.anchor = toWorld(leg.swing.end, body);
                    leg.swing = null;
                    foot = toLocal(leg.anchor, body);
                }
            }
            paintLeg(this.root, leg.spec, solveLeg(leg.spec, foot));
        }
    }

    end() {
        if (!this.active) return;
        this.active = false;
        for (const leg of this.legs) paintLeg(this.root, leg.spec, solveLeg(leg.spec, { x: leg.spec.points[3][0], y: leg.spec.points[3][1] }));
    }
}
