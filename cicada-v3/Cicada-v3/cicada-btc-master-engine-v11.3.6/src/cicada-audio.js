// Web Audio drone, calls, and flight sounds. Lightning remains visual-only; thunder audio is disabled.
import {
    ROOT_FREQUENCIES,
    ENVIRONMENT_AUDIO,
    RHYTHM_LFO,
    THUNDER_PROFILES,
    VOICE_OSCILLATORS,
    VOICE_FILTERS,
    RICHNESS_INDEX
} from './config.js?v=11.3.5';
import { connectChain, mulberry32 } from './utils.js?v=11.3.5';

const AUDIO_FLOOR = 0.0001;
const SOFT_PARAM_TIME = 0.08;
const SOFT_GAIN_TIME = 0.12;
const LONG_TAIL_TIME = 0.35;
const TAKEOFF_GLIDE_TIME = 1.25;
const LANDING_GLIDE_TIME = 2.2;
const QUICK_ABORT_LANDING_TIME = 1.2;

export class CicadaSynth {
        constructor(ctx) {
            this.ctx = ctx;

            this.masterGain = ctx.createGain();
            this.flightGain = ctx.createGain();
            this.masterGain.gain.value = 0;
            this.flightGain.gain.value = 0;
            this.currentVolume = 0.15;
            this.isMuted = true;

            this.delayNode = ctx.createDelay(5.0);
            this.delaySendGain = ctx.createGain();
            this.delayInputFilter = ctx.createBiquadFilter();
            this.delayWetGain = ctx.createGain();
            this.feedbackGain = ctx.createGain();
            this.delayFilter = ctx.createBiquadFilter();
            this.outputCompressor = ctx.createDynamicsCompressor();
            this.outputGain = ctx.createGain();
            this.delaySendGain.gain.value = 0.015;
            this.delayInputFilter.type = 'lowpass';
            this.delayInputFilter.frequency.value = 2200;
            this.delayInputFilter.Q.value = 0.7;
            this.delayWetGain.gain.value = 0.42;
            this.feedbackGain.gain.value = 0;
            this.delayFilter.type = 'lowpass';
            this.delayFilter.frequency.value = 1400;
            this.outputCompressor.threshold.value = -20;
            this.outputCompressor.knee.value = 30;
            this.outputCompressor.ratio.value = 10;
            this.outputCompressor.attack.value = 0.012;
            this.outputCompressor.release.value = 0.28;
            this.outputGain.gain.value = 0.78;
            connectChain(this.masterGain, this.delaySendGain, this.delayInputFilter, this.delayNode);
            connectChain(this.delayNode, this.delayFilter, this.feedbackGain, this.delayNode);
            this.masterGain.connect(this.outputCompressor);
            connectChain(this.delayNode, this.delayWetGain, this.outputCompressor);
            connectChain(this.outputCompressor, this.outputGain, ctx.destination);

            this.auraOsc = ctx.createOscillator();
            this.auraGain = ctx.createGain();
            this.auraLfo = ctx.createOscillator();
            this.auraLfoGain = ctx.createGain();
            connectChain(this.auraOsc, this.auraGain, this.flightGain);
            connectChain(this.auraLfo, this.auraLfoGain, this.auraGain.gain);

            this.osc1 = ctx.createOscillator();
            this.osc2 = ctx.createOscillator();
            this.osc3 = ctx.createOscillator();
            this.filter = ctx.createBiquadFilter();
            this.filter.type = 'lowpass';
            this.ampGain = ctx.createGain();
            this.ampLfo = ctx.createOscillator();
            this.ampLfoGain = ctx.createGain();
            this.osc3Gain = ctx.createGain();
            for (const osc of [this.osc1, this.osc2]) osc.connect(this.filter);
            connectChain(this.osc3, this.osc3Gain, this.filter, this.ampGain, this.flightGain);
            this.flightGain.connect(this.masterGain);
            connectChain(this.ampLfo, this.ampLfoGain, this.ampGain.gain);
            for (const osc of [this.auraOsc, this.auraLfo, this.osc1, this.osc2, this.osc3, this.ampLfo]) osc.start();

            this.glitchInterval = null;
            this.dataInterval = null;
            this.cricketInterval = null;
            this.cicadaCallInterval = null;
            this.flightRampTimeout = null;
            this.thunderLoopTimeout = null;
            this.isThunderActive = false;
            this.lastInstructions = null;
            this.isLanding = false;
            this.isTakingOff = false;
            this.activeCallBuses = new Set();
            this.hasReachedCruise = false;
        }

        update(instructions) {
            this.lastInstructions = { ...(instructions || {}) };
            this.isLanding = false;
            const t = this.ctx.currentTime;
            this._softGain(this.masterGain.gain, instructions.flying ? this.currentVolume : AUDIO_FLOOR, t, 0.2);
            this._softGain(this.flightGain.gain, instructions.flying ? 1 : AUDIO_FLOOR, t, 0.2);

            for (const key of ['glitchInterval', 'dataInterval', 'cricketInterval', 'cicadaCallInterval']) {
                if (this[key]) clearInterval(this[key]);
                this[key] = null;
            }

            const rootFreq = this._rootFrequencyFor(instructions);

            this.osc1.type = instructions.wireframe ? 'sawtooth' : 'triangle';
            this.osc2.type = instructions.wireframe ? 'square' : 'sine';
            this.osc3.type = 'sine';
            this.isMuted = !instructions.flying;

            const rhythm = instructions.songRhythm || 'drone';
            this.ampGain.gain.cancelScheduledValues(t);

            // --- AURA RESONANCE (Epic+) ---
            if (instructions.aura && instructions.aura !== 'none') {
                this.auraOsc.type = 'sine';
                this.auraLfo.type = 'sine';
                this.auraOsc.frequency.setTargetAtTime(rootFreq * (instructions.aura === 'halo' ? 4 : 8), t, 0.1);
                this.auraLfo.frequency.setTargetAtTime(instructions.aura === 'halo' ? 0.05 : 0.125, t, 0.1);
                this.auraLfoGain.gain.setTargetAtTime(0.08, t, 0.1);
            }

            const env = instructions.environment || 'studio';
            const envAudio = ENVIRONMENT_AUDIO[env];
            if (envAudio) {
                const [filterType, delay, feedback, frequency] = envAudio;
                const safeFeedback = Math.min(0.42, feedback * 0.72);
                const safeSend = Math.min(0.24, 0.055 + feedback * 0.16);
                this.delayNode.delayTime.setTargetAtTime(delay, t, 0.45);
                this.delaySendGain.gain.setTargetAtTime(safeSend, t, 0.55);
                this.feedbackGain.gain.setTargetAtTime(safeFeedback, t, 0.65);
                this.delayFilter.type = filterType;
                this.delayFilter.frequency.setTargetAtTime(frequency, t, 0.5);
                this.delayInputFilter.frequency.setTargetAtTime(Math.min(2600, Math.max(550, frequency * 1.15)), t, 0.5);
                this.delayWetGain.gain.setTargetAtTime(0.36, t, 0.55);
            } else {
                this.delaySendGain.gain.setTargetAtTime(0.018, t, 0.55);
                this.feedbackGain.gain.setTargetAtTime(0, t, 0.65);
                this.delayWetGain.gain.setTargetAtTime(0.28, t, 0.55);
            }

            // --- INSECT RHYTHMS ---
            if (rhythm === 'cricket') {
                this.ampLfoGain.gain.setTargetAtTime(0, t, 0.1);
                this._softGain(this.ampGain.gain, AUDIO_FLOOR, t, 0.12);

                this._softParam(this.osc1.frequency, rootFreq * 8, t, 0.12);
                this._softParam(this.filter.frequency, 3200, t, 0.14);

                this.cricketInterval = setInterval(() => {
                    if (this._isPaused()) return;
                    const now = this.ctx.currentTime;

                    this._scheduleGainPulse(this.ampGain.gain, now, 0.65, 0.035, 0.13);
                    this._scheduleGainPulse(this.ampGain.gain, now + 0.11, 0.6, 0.035, 0.14);
                }, 600);
            }
            else if (rhythm === 'cicada-call') {
                this.ampLfo.type = 'sawtooth';
                this.ampLfo.frequency.setTargetAtTime(60, t, 0.1);
                this.ampGain.gain.setTargetAtTime(0.5, t, 0.1);
                this.ampLfoGain.gain.setTargetAtTime(0.5, t, 0.1);

                let phase = 0;
                this.cicadaCallInterval = setInterval(() => {
                    if (this._isPaused()) return;
                    const now = this.ctx.currentTime;
                    phase += 0.1;

                    const swell = (Math.sin(phase) + 1) / 2;
                    const adjustedSwell = 0.2 + (swell * 0.8);

                    this.osc1.frequency.setTargetAtTime(rootFreq * 2 + (swell * rootFreq), now, 0.1);
                    this.filter.frequency.setTargetAtTime(1000 + (swell * 3000), now, 0.1);

                    if(!this.isMuted || this.isCalling) {
                       this.flightGain.gain.setTargetAtTime(adjustedSwell, now, 0.1);
                    }
                }, 100);
            }
            // --- DIGITAL RHYTHMS ---
            else {
                if (rhythm === 'drone' || rhythm === 'stutter') {
                    this.ampLfoGain.gain.setTargetAtTime(0, t, 0.1);
                    this.ampGain.gain.setTargetAtTime(1, t, 0.1);
                } else if (rhythm === 'trill') {
                    this.ampLfo.type = 'square';
                    this.ampLfo.frequency.setTargetAtTime(35, t, 0.1);
                    this.ampGain.gain.setTargetAtTime(0.4, t, 0.1);
                    this.ampLfoGain.gain.setTargetAtTime(0.4, t, 0.1);
                } else if (rhythm === 'choir') {
                    this.ampLfoGain.gain.setTargetAtTime(0, t, 0.1);
                    this.ampGain.gain.setTargetAtTime(1, t, 0.1);
                }

                if (rhythm === 'choir') {
                    this.osc3.frequency.setTargetAtTime(rootFreq * 1.5, t, 0.1);
                    this.osc3Gain.gain.setTargetAtTime(0.5, t, 0.1);
                } else {
                    this.osc3Gain.gain.setTargetAtTime(0, t, 0.1);
                }

                this.filter.frequency.setTargetAtTime(instructions.flying ? 800 : 400, t, 0.2);

                if (rhythm === 'data' && !(instructions.effects || []).includes('glitch')) {
                    this.ampLfoGain.gain.setTargetAtTime(0, t, 0.1);
                    this.ampGain.gain.setTargetAtTime(1, t, 0.1);
                    this.dataInterval = setInterval(() => {
                        if (this._isPaused()) return;
                        const notes = [1, 1.2, 1.5, 2, 2.5];
                        this._softParam(this.osc1.frequency, rootFreq * notes[Math.floor(Math.random()*notes.length)], this.ctx.currentTime, 0.075);
                    }, 100);
                } else if (rhythm === 'stutter') {
                    this.dataInterval = setInterval(() => {
                        if (this._isPaused()) return;
                        this._softGain(this.ampGain.gain, Math.random() > 0.3 ? 0.92 : 0.24, this.ctx.currentTime, 0.06);
                    }, 60);
                } else if ((instructions.effects || []).includes('glitch')) {
                    this.osc1.frequency.setTargetAtTime(rootFreq, t, 0.2);
                    this.glitchInterval = setInterval(() => {
                        if (this.isMuted || this.isLanding || this.isTakingOff) return;
                        const now = this.ctx.currentTime;
                        if (Math.random() > 0.4) {
                            this._softParam(this.osc1.frequency, rootFreq * (Math.random() * 3.2 + 0.65), now, 0.07);
                            this._softParam(this.filter.frequency, Math.random() * 2200 + 320, now, 0.09);
                        } else {
                            this._softParam(this.osc1.frequency, rootFreq, now, 0.08);
                        }
                    }, 80);
                } else {
                    this.osc1.frequency.setTargetAtTime(rootFreq, t, 0.2);
                }

                this.flightGain.gain.setTargetAtTime(this.isMuted ? AUDIO_FLOOR : 1, t + 0.1, 1.0);
            }

            const effects = instructions.effects || [];
            if (effects.includes('ghost')) {
                this.filter.Q.setTargetAtTime(15, t, 0.5);
                this.osc2.frequency.setTargetAtTime(rootFreq * 2.01, t, 0.5);
            } else {
                this.filter.Q.setTargetAtTime(2, t, 0.5);
                this.osc2.frequency.setTargetAtTime(rootFreq * 1.02, t, 0.2);
            }

            if (!instructions.flying) {
                this._primeLandedAudioState(instructions, t);
            }
        }

        _primeLandedAudioState(instructions = this.lastInstructions || {}, t = this.ctx.currentTime, hard = true) {
            const rootFreq = this._rootFrequencyFor(instructions);
            const lowRoot = Math.max(20, rootFreq * 0.45);
            const lowPair = Math.max(20, rootFreq * 0.46);
            const effects = instructions.effects || [];

            const settle = (param, value, glide = 0.22) => {
                if (hard) {
                    param.cancelScheduledValues(t);
                    param.setValueAtTime(value, t);
                } else {
                    this._softParam(param, value, t, glide);
                }
            };
            const settleGain = (param, value, glide = 0.32) => {
                if (hard) {
                    param.cancelScheduledValues(t);
                    param.setValueAtTime(value, t);
                } else {
                    this._softGain(param, value, t, glide);
                }
            };

            settleGain(this.flightGain.gain, AUDIO_FLOOR, 0.45);
            settleGain(this.masterGain.gain, AUDIO_FLOOR, 0.75);
            settle(this.filter.frequency, 220, 0.45);
            settle(this.ampLfo.frequency, 4, 0.45);
            settleGain(this.ampGain.gain, 0.85, 0.45);
            settleGain(this.ampLfoGain.gain, AUDIO_FLOOR, 0.35);
            settle(this.osc1.frequency, lowRoot, 0.55);
            settle(this.osc2.frequency, lowPair, 0.55);
            settleGain(this.osc3Gain.gain, AUDIO_FLOOR, 0.35);

            settleGain(this.auraGain.gain, AUDIO_FLOOR, 0.5);
            settleGain(this.auraLfoGain.gain, AUDIO_FLOOR, 0.35);
            settle(this.filter.Q, effects.includes('ghost') ? 8 : 1.5, 0.45);
        }

        _rootFrequencyFor(instructions = this.lastInstructions || {}) {
            return ROOT_FREQUENCIES[instructions.color || 'red'] || ROOT_FREQUENCIES.red;
        }

        _rootFrequency() {
            return this._rootFrequencyFor(this.lastInstructions || {});
        }

        _targetLfoFrequency() {
            const rhythm = (this.lastInstructions && this.lastInstructions.songRhythm) || 'drone';
            return RHYTHM_LFO[rhythm] || RHYTHM_LFO.drone;
        }

        _isPaused() {
            return (this.isMuted || this.isLanding || this.isTakingOff) && !this.isCalling;
        }

        _holdParam(param, t) {
            if (typeof param.cancelAndHoldAtTime === 'function') {
                param.cancelAndHoldAtTime(t);
            } else {
                const current = Number.isFinite(Number(param.value)) ? Number(param.value) : AUDIO_FLOOR;
                param.cancelScheduledValues(t);
                param.setValueAtTime(current, t);
            }
        }

        _softParam(param, target, t = this.ctx.currentTime, timeConstant = SOFT_PARAM_TIME) {
            const safeTarget = Math.max(AUDIO_FLOOR, Number(target) || AUDIO_FLOOR);
            this._holdParam(param, t);
            param.setTargetAtTime(safeTarget, t, Math.max(0.018, timeConstant));
        }

        _softGain(param, target, t = this.ctx.currentTime, timeConstant = SOFT_GAIN_TIME) {
            const safeTarget = Math.max(AUDIO_FLOOR, Number(target) || AUDIO_FLOOR);
            this._holdParam(param, t);
            param.setTargetAtTime(safeTarget, t, Math.max(0.025, timeConstant));
        }

        _rampParam(param, target, t, duration, exponential = false) {
            this._holdParam(param, t);
            const safeTarget = Math.max(AUDIO_FLOOR, Number(target) || AUDIO_FLOOR);
            const endTime = t + Math.max(0.04, duration);
            if (exponential && safeTarget > 0) {
                param.exponentialRampToValueAtTime(safeTarget, endTime);
            } else {
                param.linearRampToValueAtTime(safeTarget, endTime);
            }
        }

        _smoothParam(param, target, t = this.ctx.currentTime, duration = SOFT_PARAM_TIME) {
            this._softParam(param, target, t, Math.max(0.04, duration));
        }

        _scheduleGainPulse(param, start, peak = 0.65, attack = 0.035, release = 0.13) {
            const floor = AUDIO_FLOOR;
            this._holdParam(param, start);
            param.setTargetAtTime(floor, start, 0.018);
            param.linearRampToValueAtTime(Math.max(floor, peak), start + Math.max(0.018, attack));
            param.setTargetAtTime(floor, start + Math.max(0.018, attack), Math.max(0.04, release));
        }

        _retireActiveCallBuses(t = this.ctx.currentTime, fade = 0.32) {
            for (const bus of Array.from(this.activeCallBuses || [])) {
                try {
                    this._softGain(bus.gain, AUDIO_FLOOR, t, fade);
                    if (bus._delaySend) this._softGain(bus._delaySend.gain, AUDIO_FLOOR, t, Math.max(fade, LONG_TAIL_TIME));
                    setTimeout(() => {
                        try { bus.disconnect(); } catch (_) {}
                        try { bus._delaySend?.disconnect(); } catch (_) {}
                    }, Math.ceil((fade + 0.35) * 1000));
                } catch (_) {}
                this.activeCallBuses.delete(bus);
            }
        }

        _triggerThunder() {
            // Visual lightning is allowed, but thunder audio is intentionally disabled.
            // The old thunder buffers interfered with the drone/flight synth balance.
            return;
        }

        _scheduleStormLoop() {
            return;
        }

        _playFlightSfx(isFlying, duration, t) {
            const isMecha = this.lastInstructions.legs === 'mecha';
            const oscillator = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();
            connectChain(oscillator, filter, gain, this.masterGain);

            oscillator.type = isMecha ? 'sawtooth' : 'triangle';
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(isMecha ? 1600 : 900, t);
            oscillator.frequency.setValueAtTime(isMecha ? (isFlying ? 50 : 760) : 30, t);
            if (isMecha) oscillator.frequency.exponentialRampToValueAtTime(isFlying ? 720 : 55, t + duration * 0.92);
            else if (!isFlying) oscillator.frequency.exponentialRampToValueAtTime(24, t + duration * 0.88);

            const peak = isFlying ? (isMecha ? 0.17 : 0.18) : (isMecha ? 0.12 : 0.11);
            const attack = isFlying ? duration * (isMecha ? 0.52 : 0.32) : 0.18;
            gain.gain.setValueAtTime(AUDIO_FLOOR, t);
            gain.gain.linearRampToValueAtTime(peak, t + attack);
            gain.gain.setTargetAtTime(AUDIO_FLOOR, t + duration * 0.72, 0.18);
            oscillator.start(t);
            oscillator.stop(t + duration + 0.2);
        }

        setFlyingAndMute(isFlying) {
            const t = this.ctx.currentTime;
            const rootFreq = this._rootFrequency();
            const wasTakingOff = this.isTakingOff;
            const wasCruising = this.hasReachedCruise && !this.isTakingOff;
            const duration = isFlying ? TAKEOFF_GLIDE_TIME : (wasTakingOff ? QUICK_ABORT_LANDING_TIME : LANDING_GLIDE_TIME);
            if (this.flightRampTimeout) clearTimeout(this.flightRampTimeout);
            this.isCalling = false;
            this.lastInstructions = { ...(this.lastInstructions || {}), flying: isFlying };

            if (isFlying) {
                const wasMuted = this.isMuted;
                this.isMuted = false;
                this.isLanding = false;
                this.isTakingOff = true;
                this.hasReachedCruise = false;

                if (wasMuted) {
                    this._primeLandedAudioState(this.lastInstructions || {}, t, true);
                }

                this._rampParam(this.masterGain.gain, this.currentVolume, t, Math.min(0.55, duration * 0.55));
                this._rampParam(this.flightGain.gain, 1, t, duration);
                this._rampParam(this.filter.frequency, 900, t, duration, true);
                this._rampParam(this.ampLfo.frequency, this._targetLfoFrequency(), t, duration);
                this._rampParam(this.osc1.frequency, rootFreq, t, duration);
                this._rampParam(this.osc2.frequency, rootFreq * 1.02, t, duration);

                if (this.lastInstructions.aura && this.lastInstructions.aura !== 'none') {
                    this._rampParam(this.auraGain.gain, 0.12, t, duration);
                }

                this._playFlightSfx(true, duration, t);

                this.flightRampTimeout = setTimeout(() => {
                    this.isTakingOff = false;
                    this.hasReachedCruise = true;
                }, duration * 1000 + 80);
            } else {
                this.isLanding = true;
                this.isMuted = false;
                this.hasReachedCruise = false;
                this.isThunderActive = false;
                if (this.thunderLoopTimeout) clearTimeout(this.thunderLoopTimeout);

                // Keep the global output bus open for the landing sound and delay tails.
                // Only the continuous flight-drone envelope fades here, so cruise drones do not hard-mute.
                this._rampParam(this.masterGain.gain, this.currentVolume, t, 0.28);
                this._rampParam(this.flightGain.gain, AUDIO_FLOOR, t, duration);
                this._rampParam(this.filter.frequency, 240, t, duration, true);
                this._rampParam(this.ampLfo.frequency, 4, t, duration);
                this._rampParam(this.osc1.frequency, Math.max(20, rootFreq * 0.45), t, duration);
                this._rampParam(this.osc2.frequency, Math.max(20, rootFreq * 0.46), t, duration);
                this._softGain(this.delaySendGain.gain, this.delaySendGain.gain.value, t, Math.max(0.55, duration * 0.35));

                if (this.lastInstructions.aura && this.lastInstructions.aura !== 'none') {
                    this._rampParam(this.auraGain.gain, AUDIO_FLOOR, t, duration);
                }

                this._playFlightSfx(false, Math.min(1.45, duration * (wasCruising ? 0.62 : 0.85)), t);

                this.flightRampTimeout = setTimeout(() => {
                    this.isMuted = true;
                    this.isLanding = false;
                    this.isTakingOff = false;
                    this.hasReachedCruise = false;
                    const now = this.ctx.currentTime;
                    this._primeLandedAudioState(this.lastInstructions || {}, now, false);
                    if (!this.isCalling && !(this.activeCallBuses && this.activeCallBuses.size)) {
                        this._softGain(this.masterGain.gain, AUDIO_FLOOR, now, 0.9);
                    }
                }, duration * 1000 + 160);
            }
        }

        playCallOut(seed = 1) {
            const ctx = this.ctx;
            const inst = this.lastInstructions || {};
            const t = ctx.currentTime;
            const wasMuted = this.isMuted;
            this._retireActiveCallBuses(t, 0.36);
            this.isCalling = true;
            // Landed calls still wake the silent synth, but flight calls now layer over the active drone.
            // Only clear transition flags for landed calls so a head-click cannot interrupt takeoff/landing ramps.
            if (wasMuted) {
                this.isLanding = false;
                this.isTakingOff = false;
            }
            this.masterGain.gain.setTargetAtTime(this.currentVolume, t, 0.22);

            const rng = mulberry32(((Number(seed) || 1) * 2654435761) >>> 0);

            const legacyMap = {
                basic: 'double-chirp',
                pulse: 'morse-clicks',
                trill: 'trill-burst',
                melody: 'melodic-phrase',
                chordal: 'ritual-chant',
                chaotic: 'glitch-code'
            };
            const shape = inst.callShape || legacyMap[inst.callType] || 'double-chirp';
            const voice = inst.callVoice || (inst.wireframe ? 'bitcrush-click' : 'natural-sine');
            const rhythm = inst.callRhythm || 'even';
            const richness = inst.callRichness || 'plain';
            const richnessIndex = RICHNESS_INDEX[richness] ?? 0;
            const rootFreq = this._rootFrequency();
            const effects = inst.effects || [];
            const outBus = ctx.createGain();
            const callDelaySend = ctx.createGain();
            const outBusPeak = Math.min(0.62, 0.45 + richnessIndex * 0.026);
            const delayedShape = richnessIndex >= 1 || ['melodic-phrase', 'call-and-response', 'ritual-chant', 'swarm-stack', 'storm-call', 'cathedral-swarm', 'lightning-oracle'].includes(shape);
            outBus.gain.setValueAtTime(AUDIO_FLOOR, t);
            outBus.gain.linearRampToValueAtTime(outBusPeak, t + 0.085);
            callDelaySend.gain.setValueAtTime(AUDIO_FLOOR, t);
            if (delayedShape) callDelaySend.gain.linearRampToValueAtTime(Math.min(0.22, 0.075 + richnessIndex * 0.018), t + 0.28);
            outBus._delaySend = callDelaySend;
            this.activeCallBuses.add(outBus);
            outBus.connect(this.masterGain);
            if (delayedShape) {
                outBus.connect(callDelaySend);
                callDelaySend.connect(this.delayInputFilter);
            }

            const voiceOsc = () => VOICE_OSCILLATORS[voice] || 'sine';
            const voiceFilterFreq = () => VOICE_FILTERS[voice] || 2600;
            const envMultiplier = inst.environment === 'void' ? 1.35 : inst.environment === 'cave' ? 1.2 : inst.environment === 'canyon' ? 1.12 : 1;
            const baseAmp = Math.min(0.52, 0.29 + richnessIndex * 0.036);
            let totalDuration = 1.4;

            const tone = (start, dur, freq, amp = baseAmp, opts = {}) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const filter = ctx.createBiquadFilter();
                osc.type = opts.type || voiceOsc();
                filter.type = opts.filterType || (voice === 'ghost-whisper' ? 'bandpass' : 'lowpass');
                filter.frequency.setValueAtTime(Math.min(4200, opts.filterFreq || voiceFilterFreq()), start);
                filter.Q.setValueAtTime(Math.min(5.5, opts.q ?? (voice === 'metallic-ring' ? 4.5 : voice === 'ghost-whisper' ? 4 : 1.1)), start);
                osc.frequency.setValueAtTime(Math.max(20, freq), start);
                if (opts.endFreq) {
                    const endFreq = Math.max(20, opts.endFreq);
                    if (endFreq > 0 && Math.max(20, freq) > 0) osc.frequency.exponentialRampToValueAtTime(endFreq, start + dur * 0.92);
                }
                const peakAmp = Math.min(0.58, Math.max(AUDIO_FLOOR, amp));
                const attack = Math.min(0.14, Math.max(0.022, dur * 0.26));
                const releaseStart = start + Math.max(attack + 0.012, dur - Math.min(0.22, Math.max(0.06, dur * 0.36)));
                gain.gain.setValueAtTime(AUDIO_FLOOR, start);
                gain.gain.linearRampToValueAtTime(peakAmp, start + attack);
                if (opts.hold) gain.gain.setTargetAtTime(peakAmp, start + Math.min(dur * 0.65, opts.hold), 0.05);
                gain.gain.setTargetAtTime(AUDIO_FLOOR, releaseStart, Math.max(0.045, dur * 0.14));

                if (voice === 'fm-insect' || opts.fm) {
                    const fm = ctx.createOscillator();
                    const fmGain = ctx.createGain();
                    fm.type = 'sine';
                    fm.frequency.setValueAtTime(opts.fmRate || 24 + rng() * 32, start);
                    fmGain.gain.setValueAtTime(AUDIO_FLOOR, start);
                    fmGain.gain.linearRampToValueAtTime(opts.fmDepth || freq * 0.045 + richnessIndex * 10, start + 0.05);
                    fmGain.gain.setTargetAtTime(AUDIO_FLOOR, start + Math.max(0.06, dur * 0.72), 0.08);
                    fm.connect(fmGain); fmGain.connect(osc.frequency);
                    fm.start(start); fm.stop(start + dur + 0.12);
                }
                if (voice === 'bitcrush-click') {
                    osc.detune.setValueAtTime((rng() - 0.5) * 36, start);
                }
                osc.connect(filter); filter.connect(gain); gain.connect(outBus);
                osc.start(start); osc.stop(start + dur + 0.16);
                totalDuration = Math.max(totalDuration, (start - t + dur) * 1000);
            };

            const noise = (start, dur, amp = 0.28, freq = 1800, q = 0.9) => {
                const length = Math.max(1, Math.floor(ctx.sampleRate * dur));
                const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
                const data = buffer.getChannelData(0);
                const fadeIn = Math.max(1, Math.floor(ctx.sampleRate * 0.02));
                const fadeOut = Math.max(1, Math.floor(ctx.sampleRate * 0.055));
                for (let i = 0; i < length; i++) {
                    const decay = Math.pow(1 - i / length, 2.2);
                    const edgeFade = Math.min(1, i / fadeIn, (length - i) / fadeOut);
                    data[i] = (rng() * 2 - 1) * decay * edgeFade;
                }
                const src = ctx.createBufferSource();
                const filter = ctx.createBiquadFilter();
                const gain = ctx.createGain();
                src.buffer = buffer;
                filter.type = 'bandpass';
                filter.frequency.setValueAtTime(Math.min(3200, freq), start);
                filter.Q.setValueAtTime(Math.min(2.5, q), start);
                gain.gain.setValueAtTime(AUDIO_FLOOR, start);
                gain.gain.linearRampToValueAtTime(Math.max(AUDIO_FLOOR, Math.min(0.28, amp * 0.72)), start + 0.028);
                gain.gain.setTargetAtTime(AUDIO_FLOOR, start + Math.max(0.035, dur * 0.66), 0.08);
                src.connect(filter); filter.connect(gain); gain.connect(outBus);
                src.start(start); src.stop(start + dur + 0.14);
                totalDuration = Math.max(totalDuration, (start - t + dur) * 1000);
            };

            const click = (start, dur = 0.075, amp = 0.42, pitch = rootFreq * 12) => {
                const softDur = Math.max(0.085, dur * 1.45);
                const clickAmp = Math.min(0.36, amp * 0.72);
                tone(start, softDur, pitch, clickAmp, { type: voice === 'natural-sine' ? 'sine' : voiceOsc(), filterFreq: voice === 'bitcrush-click' ? 2400 : 2100, q: 1.15 });
                if (voice === 'metallic-ring' || voice === 'bitcrush-click' || richnessIndex >= 2) noise(start + 0.004, softDur * 1.1, clickAmp * 0.11, 1600 + rng() * 900, 0.8);
            };

            const noteSet = [1, 1.122, 1.26, 1.334, 1.498, 1.681, 1.888, 2.0];
            const rhythmGap = (i, count) => {
                if (rhythm === 'accelerando') return 0.22 - (i / Math.max(1, count - 1)) * 0.13;
                if (rhythm === 'ritardando') return 0.08 + (i / Math.max(1, count - 1)) * 0.16;
                if (rhythm === 'heartbeat') return i % 2 ? 0.34 : 0.09;
                if (rhythm === 'gallop') return [0.08, 0.08, 0.25][i % 3];
                if (rhythm === 'triplet') return 0.105;
                if (rhythm === 'syncopated') return [0.09, 0.16, 0.07, 0.22][i % 4];
                if (rhythm === 'random-walk') return 0.06 + rng() * 0.18;
                if (rhythm === 'stutter') return 0.045 + rng() * 0.055;
                return 0.14;
            };
            const playClickRun = (count, start = t + 0.08, amp = baseAmp * 0.95) => {
                let cursor = start;
                for (let i = 0; i < count; i++) {
                    const long = rhythm === 'morse' ? rng() > 0.58 : rng() > 0.78;
                    const dur = long ? 0.16 : 0.085;
                    click(cursor, dur, amp * (long ? 1.1 : 0.82), rootFreq * (8 + Math.floor(rng() * 9)));
                    cursor += dur + Math.max(0.08, rhythmGap(i, count));
                }
                totalDuration = Math.max(totalDuration, (cursor - t) * 1000 + 200);
                return cursor;
            };
            const playMelody = (start, count, octave = 4, amp = baseAmp * 0.72, gap = 0.22) => {
                let cursor = start;
                const motifOffset = Math.floor(rng() * noteSet.length);
                for (let i = 0; i < count; i++) {
                    const idx = (motifOffset + i * (rng() > 0.65 ? 2 : 1)) % noteSet.length;
                    const dur = 0.16 + rng() * 0.16;
                    tone(cursor, dur, rootFreq * octave * noteSet[idx], amp, { filterFreq: voice === 'glass-harmonic' ? 5200 : 3100, q: voice === 'glass-harmonic' ? 7 : 1.6 });
                    cursor += gap + (rhythm === 'syncopated' ? (rng() - 0.5) * 0.08 : 0);
                }
                totalDuration = Math.max(totalDuration, (cursor - t) * 1000 + 300);
                return cursor;
            };
            const playDrone = (start, dur, multiplier = 1, amp = baseAmp * 0.38, direction = 'flat') => {
                const startFreq = rootFreq * multiplier;
                const endFreq = direction === 'rising' ? startFreq * (1.7 + rng() * 0.45) : direction === 'falling' ? startFreq * (0.42 + rng() * 0.12) : startFreq * (1 + (rng() - 0.5) * 0.025);
                tone(start, dur * envMultiplier, startFreq, amp, { endFreq, hold: dur * 0.62, filterFreq: voice === 'sub-organ' || voice === 'thunder-organ' ? 520 : 1800, fm: shape === 'warble' || voice === 'fm-insect', fmRate: 5 + rng() * 9, fmDepth: startFreq * 0.04 });
                totalDuration = Math.max(totalDuration, (start - t + dur * envMultiplier) * 1000);
            };

            if (shape === 'single-chirp') {
                tone(t + 0.06, 0.48, rootFreq * (5 + rng() * 2), baseAmp, { endFreq: rootFreq * 3.2 });
            } else if (shape === 'double-chirp') {
                tone(t + 0.06, 0.34, rootFreq * 4.2, baseAmp);
                tone(t + 0.56, 0.58, rootFreq * 5.2, baseAmp * 1.02, { endFreq: rootFreq * 3.7 });
            } else if (shape === 'morse-clicks') {
                playClickRun(5 + Math.floor(rng() * 7));
            } else if (shape === 'accelerating-clicks') {
                playClickRun(12 + Math.floor(rng() * 10));
            } else if (shape === 'decelerating-clicks') {
                playClickRun(10 + Math.floor(rng() * 8));
            } else if (shape === 'heartbeat-clicks') {
                for (let i = 0; i < 5 + Math.floor(rng() * 3); i++) {
                    const beat = t + 0.08 + i * 0.48;
                    click(beat, 0.045, baseAmp * 0.85, rootFreq * 7);
                    click(beat + 0.11, 0.06, baseAmp, rootFreq * 5.5);
                }
                totalDuration = Math.max(totalDuration, 3000);
            } else if (shape === 'steady-drone') {
                playDrone(t + 0.04, 2.5 + rng() * 1.2, 2.2, baseAmp * 0.55, 'flat');
            } else if (shape === 'rising-drone') {
                playDrone(t + 0.04, 2.7 + rng() * 1.1, 1.7, baseAmp * 0.58, 'rising');
            } else if (shape === 'falling-drone') {
                playDrone(t + 0.04, 3.0 + rng() * 1.1, 4.2, baseAmp * 0.62, 'falling');
            } else if (shape === 'warble') {
                playDrone(t + 0.04, 2.8 + rng() * 1.2, 2.8, baseAmp * 0.58, rng() > 0.5 ? 'rising' : 'falling');
                playClickRun(5 + Math.floor(rng() * 5), t + 0.25, baseAmp * 0.35);
            } else if (shape === 'trill-burst') {
                let cursor = t + 0.08;
                for (let i = 0; i < 18 + richnessIndex * 3; i++) {
                    tone(cursor, 0.11, rootFreq * (5.4 + (i % 4) * 0.72), baseAmp * 0.38, { fm: true, fmRate: 30, fmDepth: 58 });
                    cursor += 0.085;
                }
                totalDuration = Math.max(totalDuration, (cursor - t) * 1000 + 200);
            } else if (shape === 'melodic-phrase') {
                playMelody(t + 0.05, 6 + richnessIndex, 4 + Math.min(2, richnessIndex * 0.35));
            } else if (shape === 'call-and-response') {
                const split = playMelody(t + 0.05, 5 + Math.floor(rng() * 2), 4.6, baseAmp * 0.72, 0.2);
                playMelody(split + 0.35, 4 + Math.floor(rng() * 3), 2.7, baseAmp * 0.64, 0.24);
            } else if (shape === 'swarm-stack') {
                playDrone(t + 0.03, 3.2, 1.5, baseAmp * 0.32, 'flat');
                playDrone(t + 0.12, 2.9, 2.01, baseAmp * 0.26, 'rising');
                playDrone(t + 0.22, 2.6, 2.98, baseAmp * 0.20, 'falling');
                playClickRun(10 + richnessIndex * 2, t + 0.18, baseAmp * 0.36);
            } else if (shape === 'ritual-chant') {
                [1, 1.25, 1.5, 2].forEach((ratio, i) => tone(t + i * 0.18, 3.8 + i * 0.25, rootFreq * 2.2 * ratio, baseAmp * 0.22, { type: 'sine', filterFreq: 1800, hold: 3.0 }));
                playMelody(t + 0.7, 5 + richnessIndex, 5.2, baseAmp * 0.32, 0.34);
                totalDuration = Math.max(totalDuration, 4800);
            } else if (shape === 'glitch-code') {
                for (let i = 0; i < 26 + richnessIndex * 4; i++) {
                    const st = t + 0.05 + i * (0.045 + rng() * 0.055);
                    if (rng() > 0.35) click(st, 0.07 + rng() * 0.06, baseAmp * (0.28 + rng() * 0.36), rootFreq * (4 + rng() * 10));
                    else tone(st, 0.12 + rng() * 0.16, rootFreq * (2 + rng() * 8), baseAmp * 0.3, { type: 'triangle', endFreq: rootFreq * (2 + rng() * 8), filterFreq: 2600 });
                }
                totalDuration = Math.max(totalDuration, 3300 + richnessIndex * 350);
            } else if (shape === 'storm-call') {
                playDrone(t + 0.02, 4.3, 0.85, baseAmp * 0.56, 'rising');
                playClickRun(8 + richnessIndex * 3, t + 0.3, baseAmp * 0.42);
                totalDuration = Math.max(totalDuration, 4800);
            } else if (shape === 'eclipse-chorus' || shape === 'cathedral-swarm' || shape === 'lightning-oracle') {
                [0.5, 1, 1.5, 2, 2.5].forEach((ratio, i) => playDrone(t + i * 0.08, 4.8 + i * 0.2, ratio, baseAmp * (0.28 - i * 0.025), i % 2 ? 'falling' : 'rising'));
                playMelody(t + 0.45, 9 + richnessIndex, 5.5, baseAmp * 0.38, 0.24);
                playClickRun(14 + richnessIndex * 4, t + 0.2, baseAmp * 0.28);
                totalDuration = Math.max(totalDuration, 6200);
            } else {
                tone(t + 0.08, 0.8, rootFreq * 4, baseAmp);
            }

            // Rarity layers: richer cicadas quietly add extra audible detail over the core call.
            if (richnessIndex >= 1 && !['morse-clicks', 'accelerating-clicks', 'decelerating-clicks', 'glitch-code'].includes(shape)) {
                playClickRun(3 + richnessIndex, t + 0.18, baseAmp * 0.24);
            }
            if (richnessIndex >= 2 && !['steady-drone', 'rising-drone', 'falling-drone'].includes(shape)) {
                playDrone(t + 0.08, 1.8 + richnessIndex * 0.35, 0.65, baseAmp * 0.18, 'flat');
            }
            if (richnessIndex >= 3 && !['ritual-chant', 'cathedral-swarm'].includes(shape)) {
                [1.5, 2.0].forEach((ratio, i) => tone(t + 0.18 + i * 0.07, 2.2 + richnessIndex * 0.25, rootFreq * ratio * 2.2, baseAmp * 0.13, { type: 'sine', filterFreq: 1700, hold: 1.6 }));
            }
            totalDuration = Math.max(800, Math.ceil(totalDuration + 350));
            if (this.callOutTimeout) clearTimeout(this.callOutTimeout);
            this.callOutTimeout = setTimeout(() => {
                this.isCalling = false;
                const now = ctx.currentTime;
                try {
                    this._softGain(outBus.gain, AUDIO_FLOOR, now, 0.32);
                    if (outBus._delaySend) this._softGain(outBus._delaySend.gain, AUDIO_FLOOR, now, 0.45);
                } catch (_) {}
                if (this.isMuted) {
                    this.masterGain.gain.setTargetAtTime(0, now, 0.55);
                }
                setTimeout(() => {
                    try { outBus.disconnect(); } catch (_) {}
                    try { outBus._delaySend?.disconnect(); } catch (_) {}
                    this.activeCallBuses.delete(outBus);
                }, 950);
            }, totalDuration);
            return totalDuration;
        }

        destroy() {
            this.isThunderActive = false;
            this._retireActiveCallBuses(this.ctx.currentTime, 0.04);
            for (const key of ['glitchInterval', 'dataInterval', 'cricketInterval', 'cicadaCallInterval']) {
                if (this[key]) clearInterval(this[key]);
            }
            for (const key of ['flightRampTimeout', 'thunderLoopTimeout', 'callOutTimeout']) {
                if (this[key]) clearTimeout(this[key]);
            }
            for (const key of ['auraOsc', 'auraLfo', 'osc1', 'osc2', 'osc3', 'ampLfo']) {
                try { this[key].stop(); } catch (_) {}
            }
            for (const key of ['masterGain', 'flightGain', 'delayNode', 'delaySendGain', 'delayInputFilter', 'delayWetGain', 'feedbackGain', 'delayFilter', 'outputCompressor', 'outputGain', 'auraGain', 'auraLfoGain', 'filter', 'ampGain', 'ampLfoGain', 'osc3Gain']) {
                try { this[key].disconnect(); } catch (_) {}
            }
        }
    }
