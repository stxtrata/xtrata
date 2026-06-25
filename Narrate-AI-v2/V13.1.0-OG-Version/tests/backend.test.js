/**
 * Backend API smoke tests for src/backend/server.js.
 * Boots a real server instance in an isolated temp output dir on a free port.
 * ffmpeg-dependent merge tests are skipped automatically if ffmpeg is unavailable.
 * Run: node --test
 */
const { test, before, after, describe } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const H = require('./helpers.js');

describe('Narrate.AI backend API', () => {
    let server;

    before(async () => { server = await H.startServer(); });
    after(async () => { if (server) await server.stop(); });

    // ---- Static serving ----
    test('GET / serves the app shell', async () => {
        const r = await H.request(server.origin, 'GET', '/');
        assert.strictEqual(r.status, 200);
        assert.match(r.headers['content-type'] || '', /text\/html/);
        assert.match(r.text, /Narrate\.AI/);
    });

    test('GET /js/core.js is served with a JS content-type', async () => {
        const r = await H.request(server.origin, 'GET', '/js/core.js');
        assert.strictEqual(r.status, 200);
        assert.match(r.headers['content-type'] || '', /javascript/);
        assert.match(r.text, /generateProjectId/);
    });

    test('GET /js/vendor/mammoth.browser.min.js is served (offline docx support)', async () => {
        const r = await H.request(server.origin, 'GET', '/js/vendor/mammoth.browser.min.js');
        assert.strictEqual(r.status, 200);
        assert.ok(r.buffer.length > 1000, 'vendored mammoth should be a real file');
    });

    test('GET /css/style.css is served as CSS', async () => {
        const r = await H.request(server.origin, 'GET', '/css/style.css');
        assert.strictEqual(r.status, 200);
        assert.match(r.headers['content-type'] || '', /text\/css/);
    });

    test('static handler blocks path traversal outside the frontend dir', async () => {
        const r = await H.request(server.origin, 'GET', '/js/../../src/backend/server.js');
        assert.notStrictEqual(r.status, 200);
        assert.ok(!/elevenLabsQueue/.test(r.text), 'must not leak server source');
    });

    // ---- Projects CRUD ----
    test('projects: create, list, load, rename, delete lifecycle', async () => {
        const id = 'testbook_' + Date.now().toString(36);
        const payload = {
            id, title: 'Test Book', author: 'Tester', manuscript: 'Chapter 1\n\nHello world.',
            chapters: [{ title: 'Chapter 1', chunks: [{ id: 'c1', text: 'Hello world.', status: 'pending' }], collapsed: true }],
            projectSettings: { mode: 'single', voiceIds: ['v1'], voiceNames: ['Narrator'] }
        };

        const created = await H.request(server.origin, 'POST', '/api/projects', payload);
        assert.strictEqual(created.status, 200);
        assert.strictEqual(created.json.status, 'saved');
        assert.strictEqual(created.json.id, id);

        const list = await H.request(server.origin, 'GET', '/api/projects');
        assert.strictEqual(list.status, 200);
        assert.ok(Array.isArray(list.json));
        assert.ok(list.json.some(p => p.id === id), 'new project should appear in list');

        const loaded = await H.request(server.origin, 'GET', `/api/projects/${id}`);
        assert.strictEqual(loaded.status, 200);
        assert.strictEqual(loaded.json.author, 'Tester');
        assert.strictEqual(loaded.json.chapters.length, 1);

        const renamed = await H.request(server.origin, 'PATCH', `/api/projects/${id}`, { title: 'Renamed Book' });
        assert.strictEqual(renamed.status, 200);
        assert.strictEqual(renamed.json.title, 'Renamed Book');

        const reloaded = await H.request(server.origin, 'GET', `/api/projects/${id}`);
        assert.strictEqual(reloaded.json.title, 'Renamed Book');

        const deleted = await H.request(server.origin, 'DELETE', `/api/projects/${id}`);
        assert.strictEqual(deleted.status, 200);
        assert.strictEqual(deleted.json.status, 'deleted');

        const gone = await H.request(server.origin, 'GET', `/api/projects/${id}`);
        assert.strictEqual(gone.status, 404);
    });

    test('two untitled-style projects with distinct ids do not collide', async () => {
        const a = { id: 'book_aaa111', title: 'Untitled', chapters: [], projectSettings: {} };
        const b = { id: 'book_bbb222', title: 'Untitled', chapters: [], projectSettings: {} };
        await H.request(server.origin, 'POST', '/api/projects', a);
        await H.request(server.origin, 'POST', '/api/projects', b);
        const la = await H.request(server.origin, 'GET', '/api/projects/book_aaa111');
        const lb = await H.request(server.origin, 'GET', '/api/projects/book_bbb222');
        assert.strictEqual(la.status, 200);
        assert.strictEqual(lb.status, 200);
        assert.strictEqual(la.json.id, 'book_aaa111');
        assert.strictEqual(lb.json.id, 'book_bbb222');
    });

    // ---- Cache check ----
    test('check-cache reports missing then present after a chunk file appears', async () => {
        const projectId = 'cachetest_x';
        const modelId = 'eleven_turbo_v2';
        const chunk = { id: 'k1', text: 'Cache me if you can.', voiceId: 'voiceA', chapterIndex: 0, chunkIndex: 0 };

        const before = await H.request(server.origin, 'POST', '/api/check-cache', { projectId, modelId, chunks: [chunk] });
        assert.strictEqual(before.status, 200);
        assert.strictEqual(before.json.chunks[0].exists, false);

        // Drop in the exact file the server expects.
        const fname = H.chunkFileName(projectId, 0, 0, chunk.text, chunk.voiceId, modelId);
        fs.writeFileSync(path.join(server.outputDir, 'chunks', fname), 'fake-bytes');

        const after = await H.request(server.origin, 'POST', '/api/check-cache', { projectId, modelId, chunks: [chunk] });
        assert.strictEqual(after.json.chunks[0].exists, true);
        assert.strictEqual(after.json.chunks[0].filename, fname);
    });

    // ---- Generate (no network: validation + cache-hit branches) ----
    test('generate rejects missing required fields', async () => {
        const r = await H.request(server.origin, 'POST', '/api/generate', { text: 'hi' });
        assert.strictEqual(r.status, 500);
        assert.match(r.json.error || '', /Missing required fields/);
    });

    test('generate returns cached result without calling the API when the file exists', async () => {
        const projectId = 'gentest_x';
        const modelId = 'eleven_turbo_v2';
        const text = 'Pre-cached segment.';
        const voiceId = 'voiceB';
        const fname = H.chunkFileName(projectId, 0, 0, text, voiceId, modelId);
        fs.writeFileSync(path.join(server.outputDir, 'chunks', fname), 'fake-bytes');

        const r = await H.request(server.origin, 'POST', '/api/generate', {
            text, voiceId, apiKey: 'not-used-because-cached', modelId, projectId,
            chapterIndex: 0, chunkIndex: 0, force: false
        });
        assert.strictEqual(r.status, 200);
        assert.strictEqual(r.json.cached, true);
        assert.strictEqual(r.json.filename, fname);
    });

    // ---- Ghost recovery ----
    test('ghost recovery surfaces projects discovered from orphan chunk files', async () => {
        const gid = 'ghostbook_z';
        const chunksDir = path.join(server.outputDir, 'chunks');
        fs.writeFileSync(path.join(chunksDir, `${gid}_ch0_chk0_abcdef123456.mp3`), 'x');
        fs.writeFileSync(path.join(chunksDir, `${gid}_ch1_chk0_abcdef123457.mp3`), 'x');

        const list = await H.request(server.origin, 'GET', '/api/projects');
        const ghost = list.json.find(p => p.id === gid);
        assert.ok(ghost, 'ghost project should be discovered');
        assert.strictEqual(ghost.type, 'ghost');

        const recovered = await H.request(server.origin, 'GET', `/api/projects/${gid}`);
        assert.strictEqual(recovered.status, 200);
        assert.ok(recovered.json.chapters.length >= 2, 'recovered chapters from chunk files');
    });

    // ---- FFmpeg merge pipeline (skipped if ffmpeg missing) ----
    test('merge-chapter and merge-book produce playable output', { skip: !H.hasFfmpeg() ? 'ffmpeg not installed' : false }, async () => {
        const projectId = 'mergetest_m';
        const chunksDir = path.join(server.outputDir, 'chunks');
        const f0 = `${projectId}_ch0_chk0_aaaaaaaaaaaa.mp3`;
        const f1 = `${projectId}_ch0_chk1_bbbbbbbbbbbb.mp3`;
        H.makeSilentMp3(path.join(chunksDir, f0), 0.2);
        H.makeSilentMp3(path.join(chunksDir, f1), 0.2);

        const chap = await H.request(server.origin, 'POST', '/api/merge-chapter', {
            projectId, chapterIndex: 0, filenames: [f0, f1], isTitle: false, silence: 0
        });
        assert.strictEqual(chap.status, 200);
        assert.match(chap.json.url, /\/output\/chapters\//);

        // The merged chapter should be downloadable.
        const dl = await H.request(server.origin, 'GET', chap.json.url);
        assert.strictEqual(dl.status, 200);
        assert.ok(dl.buffer.length > 0, 'merged chapter should be non-empty');

        const book = await H.request(server.origin, 'POST', '/api/merge-book', { projectId, silence: 0 });
        assert.strictEqual(book.status, 200);
        assert.match(book.json.url, /_full_book\.mp3$/);
        const bookDl = await H.request(server.origin, 'GET', book.json.url);
        assert.strictEqual(bookDl.status, 200);
        assert.ok(bookDl.buffer.length > 0);
    });

    test('merge-chapter errors clearly when a chunk file is missing', async () => {
        const r = await H.request(server.origin, 'POST', '/api/merge-chapter', {
            projectId: 'nope', chapterIndex: 0, filenames: ['does_not_exist.mp3'], isTitle: false, silence: 0
        });
        assert.strictEqual(r.status, 500);
        assert.match(r.json.error || '', /Missing chunk file|No files/);
    });
});
