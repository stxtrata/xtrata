// Sound Identity panel: signature call playback, group chorus, abdomen motion
// readout, and audio-fingerprint verification for the previewed seed.
import {
    decodeAudioFingerprint,
    bitsForSeed,
    TOTAL_BITS,
    ID_BITS
} from './sound-identity.js?v=11.3.5';

export function initSoundIdentityPanel({ container, getCurrentRender, getMetadataForSeed }) {
    container.innerHTML = `
        <div class="rarity-title">Sound Identity</div>
        <div id="sound-facts"></div>
        <div class="row sound-row">
            <button id="play-signature-button" type="button">Play Signature Call</button>
            <button id="stop-signature-button" type="button">Stop Call</button>
        </div>
        <div class="row sound-row">
            <button id="chorus-toggle-button" type="button" aria-pressed="false">Start Forest Chorus</button>
        </div>
        <div id="chorus-status" aria-live="polite"></div>
        <div id="chorus-genes"></div>
        <div class="row sound-row">
            <button id="verify-fingerprint-button" type="button">Verify Audio Fingerprint</button>
        </div>
        <canvas id="sound-wave" width="640" height="90" role="img" aria-label="Signature call waveform"></canvas>
        <div id="fingerprint-result" aria-live="polite"></div>
        <div id="fingerprint-bits"></div>
    `;

    const $ = id => container.querySelector('#' + id);
    const facts = $('sound-facts');
    const wave = $('sound-wave');
    const fpResult = $('fingerprint-result');
    const fpBits = $('fingerprint-bits');
    const chorusButton = $('chorus-toggle-button');
    const chorusStatus = $('chorus-status');
    const chorusGenes = $('chorus-genes');
    let activeHandle = null;
    let chorusOwnerSeed = null;

    function drawWave(identity, decoded = null) {
        const ctx = wave.getContext('2d');
        const w = wave.width, h = wave.height;
        ctx.clearRect(0, 0, w, h);
        if (!identity) return;
        const d = identity.data;
        ctx.strokeStyle = 'rgba(125, 240, 170, 0.85)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        const step = Math.max(1, Math.floor(d.length / w));
        for (let x = 0; x < w; x++) {
            let mn = 1, mx = -1;
            const st = x * step;
            for (let j = 0; j < step; j++) { const v = d[st + j] || 0; mn = Math.min(mn, v); mx = Math.max(mx, v); }
            ctx.moveTo(x, h * 0.5 - mx * h * 0.46);
            ctx.lineTo(x, h * 0.5 - mn * h * 0.46);
        }
        ctx.stroke();
        if (decoded) {
            const dur = d.length / identity.sr;
            const sx = decoded.sync.time / dur * w;
            const ex = (decoded.sync.time + 0.58 + TOTAL_BITS * 0.145) / dur * w;
            ctx.fillStyle = 'rgba(125, 240, 170, 0.14)';
            ctx.fillRect(sx, 0, ex - sx, h);
        }
    }

    function renderFacts(seedNumber) {
        const metadata = getMetadataForSeed(seedNumber);
        const s = metadata?.soundIdentity;
        if (!s) { facts.innerHTML = ''; return; }
        facts.innerHTML = `
            <div class="rarity-line"><span>Acoustic Family</span><strong>${s.family}</strong></div>
            <div class="rarity-line"><span>Carrier / Pulse</span><strong>${s.carrierHz} Hz / ${s.pulseHz} Hz</strong></div>
            <div class="rarity-line"><span>Motif</span><strong>${s.motif}</strong></div>
            <div class="rarity-line"><span>Rhythm Genome</span><strong>${s.rhythmShape} · ${s.pulseGroup}</strong></div>
            <div class="rarity-line"><span>Extreme Gene</span><strong>${s.extremeGene}</strong></div>
            <div class="rarity-line"><span>Motion Rig</span><strong>${s.rig}</strong></div>
        `;
    }

    function resetVerification() {
        fpResult.textContent = '';
        fpBits.innerHTML = '';
    }

    function play() {
        const render = getCurrentRender();
        if (!render) return;
        render.stopSignature?.();
        activeHandle = render.playSignature?.();
        if (activeHandle) drawWave(activeHandle.identity);
    }

    $('play-signature-button').addEventListener('click', play);
    $('stop-signature-button').addEventListener('click', () => {
        getCurrentRender()?.stopSignature?.();
        activeHandle = null;
    });

    function describeChorusGenes(render) {
        const genes = render.getGroupGenes?.();
        if (!genes) { chorusGenes.innerHTML = ''; return; }
        const onGenes = Object.entries(genes.toggles)
            .filter(([key, value]) => value && key !== 'independentTimers')
            .map(([key]) => key.replace(/([A-Z])/g, ' $1').toLowerCase())
            .join(', ') || 'none';
        chorusGenes.innerHTML = `
            <div class="rarity-line"><span>Chorus Preset</span><strong>${genes.presetName} · ${genes.values.voices} males</strong></div>
            <div class="rarity-line"><span>Rhythm Mode</span><strong>${genes.rhythmMode.replace(/([A-Z])/g, ' $1').toLowerCase()}</strong></div>
            <div class="rarity-line"><span>Local Band</span><strong>${Math.round(genes.values.carrier)} Hz · pulse ${Math.round(genes.values.pulseRate)} Hz</strong></div>
            <div class="rarity-line"><span>Organic Genes</span><strong>${onGenes}</strong></div>
            <div class="rarity-line"><span>Independent Males</span><strong>locked on</strong></div>
        `;
    }

    function chorusFor(render) {
        return render?.chorus && chorusOwnerSeed === render.seed ? render.chorus : null;
    }

    function updateChorusButton(render) {
        const engine = chorusFor(render);
        const active = engine && (engine.running || engine.stopping);
        chorusButton.textContent = engine?.stopping
            ? 'Chorus fading out…'
            : (active ? 'Stop Forest Chorus' : 'Start Forest Chorus');
        chorusButton.classList.toggle('chorus-active', !!active);
        chorusButton.setAttribute('aria-pressed', String(!!active));
    }

    chorusButton.addEventListener('click', () => {
        const render = getCurrentRender();
        if (!render) return;
        const engine = chorusFor(render);
        if (engine?.running && !engine.stopping) {
            render.stopChorus?.();
        } else if (!engine?.stopping) {
            chorusOwnerSeed = render.seed;
            render.startChorus?.({
                onStatus: status => {
                    chorusStatus.innerHTML = status.running || status.stopping
                        ? `<div class="rarity-line"><span>Chorus</span><strong>${status.label} · ${status.voices} males singing</strong></div>`
                        : '';
                    updateChorusButton(getCurrentRender());
                }
            });
        }
        updateChorusButton(render);
    });

    $('verify-fingerprint-button').addEventListener('click', () => {
        const render = getCurrentRender();
        if (!render) return;
        const identity = render.getIdentity?.();
        if (!identity) return;
        const decoded = decodeAudioFingerprint(identity.data, identity.sr);
        const expected = bitsForSeed(render.seed);
        const match = decoded.seed === render.seed && decoded.ok;
        drawWave(identity, decoded);
        fpResult.innerHTML = `
            <div class="rarity-line"><span>Decoded Seed</span><strong class="${match ? 'fp-ok' : 'fp-bad'}">#${decoded.seed} ${match ? '· verified' : '· mismatch'}</strong></div>
            <div class="rarity-line"><span>Checksum</span><strong>${decoded.ok ? 'valid' : 'invalid'} · confidence ${(decoded.confidence * 100).toFixed(0)}%</strong></div>
        `;
        fpBits.innerHTML = decoded.bits.map((bit, index) => {
            const good = bit === expected[index];
            const isCheck = index >= ID_BITS;
            return `<span class="fp-bit ${good ? '' : 'fp-bit-bad'} ${isCheck ? 'fp-bit-check' : ''}">${bit}</span>`;
        }).join('');
    });

    return {
        update(seedNumber) {
            renderFacts(seedNumber);
            resetVerification();
            drawWave(null);
            chorusStatus.innerHTML = '';
            chorusOwnerSeed = null;
            const render = getCurrentRender();
            if (render) describeChorusGenes(render);
            updateChorusButton(render);
        }
    };
}
