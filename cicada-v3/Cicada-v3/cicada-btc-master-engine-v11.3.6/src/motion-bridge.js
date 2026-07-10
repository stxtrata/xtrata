// Motion bridge: binds the rendered signature call to the SVG model so the
// abdomen physically sings the sound. The motion track is derived from the
// audio itself (same data the fingerprint lives in), so movement, sound and
// identity stay one deterministic system per seed.
import {
    renderSignatureCall,
    analyseMotion,
    MOTION_FPS
} from './sound-identity.js?v=11.3.5';

const identityCache = new Map();

export function getSoundIdentity(seed, tierName = 'Common', overrides = null) {
    const key = overrides ? null : `${seed}|${tierName}`;
    if (key && identityCache.has(key)) return identityCache.get(key);
    const rendered = renderSignatureCall(seed, tierName, overrides || {});
    const motion = analyseMotion(rendered.data, rendered.sr, rendered.g);
    const identity = { ...rendered, motion };
    if (key) {
        if (identityCache.size > 24) identityCache.delete(identityCache.keys().next().value);
        identityCache.set(key, identity);
    }
    return identity;
}

function toAudioBuffer(audioCtx, data, sr) {
    const buffer = audioCtx.createBuffer(1, data.length, sr);
    buffer.getChannelData(0).set(data);
    return buffer;
}

// Drives #abdomen (and a gentle whole-shell tilt) from the motion track,
// clocked off the AudioContext so visuals never drift from the sound.
function driveAbdomenRig(cicada, identity, audioCtx, startTime, onDone, rate = 1) {
    const abdomen = cicada?.root?.querySelector?.('#abdomen') || null;
    const shellInner = cicada?.root?.querySelector?.('#all-art') || cicada?.shell || null;
    const motion = identity.motion;
    const total = motion.length / MOTION_FPS / (rate || 1);
    if (abdomen) {
        abdomen.style.transformOrigin = '200px 245px';
        abdomen.style.transformBox = 'view-box';
        abdomen.style.willChange = 'transform';
    }
    if (shellInner) {
        shellInner.style.transformBox = 'view-box';
    }
    let frameHandle = null;
    const belly = identity.g.rig.belly;
    const step = () => {
        const t = audioCtx.currentTime - startTime;
        if (t >= total) {
            if (abdomen) abdomen.style.transform = '';
            if (shellInner) shellInner.style.transform = '';
            onDone?.();
            return;
        }
        if (t >= 0) {
            const f = Math.min(motion.length - 1, Math.max(0, Math.floor(t * (rate || 1) * MOTION_FPS)));
            const m = motion[f];
            if (abdomen) {
                const squeezeY = 1 - m.compression * 0.085 * belly;
                const swellX = 1 + (m.inflation * 0.045 - m.compression * 0.02) * belly;
                const lift = -m.inflation * 2.2 + m.compression * 1.4;
                const rot = m.tilt * 6 + m.tail * 1.6;
                abdomen.style.transform =
                    `translateY(${lift.toFixed(2)}px) rotate(${rot.toFixed(2)}deg) scale(${swellX.toFixed(4)}, ${squeezeY.toFixed(4)})`;
            }
            if (shellInner) {
                shellInner.style.transform = `rotate(${(m.tilt * 1.4).toFixed(3)}deg)`;
                shellInner.style.transformOrigin = '200px 250px';
            }
        }
        frameHandle = requestAnimationFrame(step);
    };
    frameHandle = requestAnimationFrame(step);
    return () => {
        if (frameHandle) cancelAnimationFrame(frameHandle);
        if (abdomen) abdomen.style.transform = '';
        if (shellInner) shellInner.style.transform = '';
    };
}

// Plays the deterministic signature call and animates the model in sync.
// Returns a handle with the duration and a stop() control.
//
// v11.3.5 playback variation (all post-render — the offline-rendered call and
// its audio fingerprint are untouched):
//   options.playbackRate — small rate/pitch variation for gallery replies
//   options.pan          — stereo position (-1..1) so responders answer from
//                          their place in the field
//   options.distance     — 0..1 "far away" amount: lowpass blur + gain drop,
//                          used by cascade depth and echo waves
export function playSignatureCall(audioCtx, seed, tierName, cicada, options = {}) {
    const identity = options.identity || getSoundIdentity(seed, tierName);
    const buffer = toAudioBuffer(audioCtx, identity.data, identity.sr);
    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    const rate = Math.max(0.8, Math.min(1.25, options.playbackRate || 1));
    source.playbackRate.value = rate;

    const distance = Math.max(0, Math.min(1, options.distance || 0));
    const gain = audioCtx.createGain();
    gain.gain.value = (options.gain ?? 0.9) * (1 - distance * 0.45);
    let tail = gain;
    source.connect(gain);
    if (distance > 0.01) {
        const blur = audioCtx.createBiquadFilter();
        blur.type = 'lowpass';
        blur.frequency.value = 11000 - distance * 8600; // 11k (near) -> 2.4k (far)
        blur.Q.value = 0.6;
        tail.connect(blur);
        tail = blur;
    }
    if (options.pan != null && typeof audioCtx.createStereoPanner === 'function') {
        const panner = audioCtx.createStereoPanner();
        panner.pan.value = Math.max(-1, Math.min(1, options.pan));
        tail.connect(panner);
        tail = panner;
    }
    tail.connect(options.destination || audioCtx.destination);

    const startTime = audioCtx.currentTime + 0.04;
    source.start(startTime);
    const durationMs = identity.g.dur * 1000 / rate;
    let stopRig = null;
    if (cicada) {
        stopRig = driveAbdomenRig(cicada, identity, audioCtx, startTime, options.onDone, rate);
        cicada.triggerCallVisual?.(durationMs);
    } else if (options.onDone) {
        source.onended = options.onDone;
    }
    return {
        identity,
        durationMs,
        stop() {
            try { source.stop(); } catch { /* already stopped */ }
            stopRig?.();
        }
    };
}
