/**
 * Shared test helpers (dependency-free).
 * - getFreePort(): find an unused TCP port.
 * - startServer(): boot src/backend/server.js in an isolated temp output dir on a free
 *   port, wait until it answers, and return { origin, outputDir, stop() }.
 * - request(): tiny promise-based HTTP client returning { status, headers, text, json }.
 * - hasFfmpeg(): whether ffmpeg is on PATH (merge tests are skipped if not).
 * - makeSilentMp3(): create a tiny real .mp3 via ffmpeg for merge tests.
 */
const http = require('http');
const net = require('net');
const path = require('path');
const fs = require('fs');
const os = require('os');
const crypto = require('crypto');
const { spawn, spawnSync } = require('child_process');

const SERVER_PATH = path.join(__dirname, '..', 'src', 'backend', 'server.js');

function getFreePort() {
    return new Promise((resolve, reject) => {
        const srv = net.createServer();
        srv.unref();
        srv.on('error', reject);
        srv.listen(0, '127.0.0.1', () => {
            const port = srv.address().port;
            srv.close(() => resolve(port));
        });
    });
}

function request(origin, method, urlPath, body) {
    return new Promise((resolve, reject) => {
        const data = body == null ? null : (typeof body === 'string' ? body : JSON.stringify(body));
        const u = new URL(urlPath, origin);
        const req = http.request({
            hostname: u.hostname, port: u.port, path: u.pathname + u.search, method,
            headers: data != null ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } : {}
        }, (res) => {
            const chunks = [];
            res.on('data', c => chunks.push(c));
            res.on('end', () => {
                const buf = Buffer.concat(chunks);
                const text = buf.toString('utf8');
                let json; try { json = JSON.parse(text); } catch (_) { json = undefined; }
                resolve({ status: res.statusCode, headers: res.headers, text, json, buffer: buf });
            });
        });
        req.on('error', reject);
        if (data != null) req.write(data);
        req.end();
    });
}

async function waitForReady(origin, attempts = 60) {
    for (let i = 0; i < attempts; i++) {
        try {
            const r = await request(origin, 'GET', '/');
            if (r.status === 200) return true;
        } catch (_) { /* not up yet */ }
        await new Promise(r => setTimeout(r, 100));
    }
    throw new Error('Server did not become ready in time');
}

async function startServer() {
    const port = await getFreePort();
    const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), 'narrate-test-'));
    const child = spawn(process.execPath, [SERVER_PATH], {
        env: { ...process.env, PORT: String(port), NARRATE_OUTPUT_DIR: outputDir },
        stdio: ['ignore', 'pipe', 'pipe']
    });
    let log = '';
    child.stdout.on('data', d => { log += d; });
    child.stderr.on('data', d => { log += d; });
    const origin = `http://127.0.0.1:${port}`;
    try {
        await waitForReady(origin);
    } catch (e) {
        child.kill();
        throw new Error(e.message + '\nServer log:\n' + log);
    }
    return {
        origin,
        outputDir,
        getLog: () => log,
        stop: () => new Promise(resolve => {
            child.on('exit', () => resolve());
            child.kill();
            try { fs.rmSync(outputDir, { recursive: true, force: true }); } catch (_) {}
        })
    };
}

// Mirror of the server's chunk hashing so tests can predict cache filenames.
function chunkHash(text, voiceId, modelId) {
    return crypto.createHash('md5').update(text + voiceId + modelId).digest('hex').substring(0, 12);
}
function chunkFileName(projectId, chapterIndex, chunkIndex, text, voiceId, modelId) {
    return `${projectId}_ch${chapterIndex}_chk${chunkIndex}_${chunkHash(text, voiceId, modelId)}.mp3`;
}

let _ffmpeg = null;
function hasFfmpeg() {
    if (_ffmpeg === null) {
        const r = spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' });
        _ffmpeg = !r.error && r.status === 0;
    }
    return _ffmpeg;
}

function makeSilentMp3(filePath, seconds = 0.2) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    const r = spawnSync('ffmpeg', [
        '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=mono', '-t', String(seconds),
        '-b:a', '128k', '-y', filePath
    ], { stdio: 'ignore' });
    if (r.status !== 0) throw new Error('ffmpeg failed to create test mp3');
    return filePath;
}

module.exports = {
    startServer, request, getFreePort, chunkHash, chunkFileName,
    hasFfmpeg, makeSilentMp3, SERVER_PATH
};
