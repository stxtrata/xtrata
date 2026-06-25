/**
 * Unit tests for the pure helpers in src/frontend/js/core.js.
 * Run: node --test
 */
const { test } = require('node:test');
const assert = require('node:assert');
const core = require('../src/frontend/js/core.js');

test('sanitizeChunkSize clamps into [200, 4000] and defaults on garbage', () => {
    assert.strictEqual(core.sanitizeChunkSize(1000), 1000);
    assert.strictEqual(core.sanitizeChunkSize(50), 200);     // floor
    assert.strictEqual(core.sanitizeChunkSize(99999), 4000); // ceil
    assert.strictEqual(core.sanitizeChunkSize('abc'), 1000); // NaN -> default
    assert.strictEqual(core.sanitizeChunkSize('1500px'), 1500);
});

test('splitTextIntoChunks: short text returns a single chunk', () => {
    const out = core.splitTextIntoChunks('Just one short sentence.', 1000);
    assert.strictEqual(out.length, 1);
    assert.strictEqual(out[0], 'Just one short sentence.');
});

test('splitTextIntoChunks: never exceeds max and covers all words', () => {
    const sentence = 'The quick brown fox jumps over the lazy dog. ';
    const text = sentence.repeat(80); // ~3600 chars
    const max = 500;
    const chunks = core.splitTextIntoChunks(text, max);
    assert.ok(chunks.length > 1, 'should split into multiple chunks');
    for (const c of chunks) {
        assert.ok(c.length <= max, `chunk length ${c.length} exceeds max ${max}`);
        assert.ok(c.trim().length > 0, 'no empty chunks');
    }
    // No words lost: comparing whitespace-stripped concatenation.
    const norm = s => s.replace(/\s+/g, '');
    assert.strictEqual(norm(chunks.join(' ')), norm(text));
});

test('splitTextIntoChunks: prefers sentence boundaries', () => {
    const a = 'First sentence ends here. ';
    const b = 'Second sentence is also here and is a bit longer to push past the split point.';
    const chunks = core.splitTextIntoChunks(a + b, 40);
    // First chunk should end on the sentence punctuation, not mid-word.
    assert.ok(/[.!?]$/.test(chunks[0]), `expected sentence end, got: "${chunks[0]}"`);
});

test('slugify: lowercases and strips non-alphanumerics', () => {
    assert.strictEqual(core.slugify('My Book: A Tale!'), 'mybookatale');
    assert.strictEqual(core.slugify('  Æther 99 '), 'ther99'); // non-ascii 'Æ' dropped, ascii kept
    assert.strictEqual(core.slugify(null), '');
});

test('hashString: deterministic hex, differs for different input', () => {
    assert.strictEqual(core.hashString('hello'), core.hashString('hello'));
    assert.notStrictEqual(core.hashString('hello'), core.hashString('hello!'));
    assert.match(core.hashString('anything'), /^[0-9a-f]+$/);
});

test('generateProjectId: unique even for identical metadata (the core multi-book fix)', () => {
    const meta = { title: 'My Book', author: 'A. Writer' };
    const ids = new Set();
    for (let i = 0; i < 200; i++) ids.add(core.generateProjectId(meta));
    assert.strictEqual(ids.size, 200, 'all generated ids must be unique');
});

test('generateProjectId: untitled books still get distinct ids', () => {
    assert.notStrictEqual(core.generateProjectId({}), core.generateProjectId({}));
    assert.match(core.generateProjectId({}), /^book_/);
});

test('generateProjectId: readable, filesystem-safe prefix from the title', () => {
    const id = core.generateProjectId({ displayTitle: 'The Great Adventure' });
    assert.match(id, /^thegreatad_/);
    assert.match(id, /^[a-z0-9_]+$/, 'id must be filesystem-safe');
});

test('normalizeSwitchToken: "***" and "* * *" share a compact form', () => {
    assert.strictEqual(core.normalizeSwitchToken('* * *').compact, '***');
    assert.strictEqual(core.normalizeSwitchToken('***').compact, '***');
    assert.strictEqual(
        core.normalizeSwitchToken('* * *').compact,
        core.normalizeSwitchToken('***').compact
    );
    assert.strictEqual(core.normalizeSwitchToken('  ~~~  ').canonical, '~~~');
});
