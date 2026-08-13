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

// ---- V13.1 ----

test('roundUpToDollar: rounds up, floors at $1 (N2)', () => {
    assert.strictEqual(core.roundUpToDollar(3.2), 4);
    assert.strictEqual(core.roundUpToDollar(7), 7);
    assert.strictEqual(core.roundUpToDollar(0), 1);
    assert.strictEqual(core.roundUpToDollar(0.01), 1);
    assert.strictEqual(core.roundUpToDollar('abc'), 1);
});

test('toReadableFilename: strips illegal chars, stays readable (N3)', () => {
    assert.strictEqual(core.toReadableFilename('The Great Adventure', 'mp3'), 'The Great Adventure.mp3');
    assert.strictEqual(core.toReadableFilename('A/B:C?<>book', 'mp3'), 'A B C book.mp3');
    assert.strictEqual(core.toReadableFilename('', 'mp3'), 'audiobook.mp3');
    assert.ok(!/[\\/:*?"<>|]/.test(core.toReadableFilename('x/y:z', 'mp3')), 'no illegal chars remain');
});

test('classifyHeading: front/back matter is NOT numbered (N1)', () => {
    for (const t of ['Prologue', 'Prologue: The Storm', 'Preface', 'Introduction', 'Foreword', 'Prelude', 'Epilogue', 'Afterword', '# Preface']) {
        assert.strictEqual(core.classifyHeading(t).numbered, false, `"${t}" should not be numbered`);
    }
    assert.strictEqual(core.classifyHeading('Prologue').label, 'Prologue');
    assert.strictEqual(core.classifyHeading('Intro').label, 'Introduction');
});

test('classifyHeading: real chapters ARE numbered, incl. non-English keyword (N1)', () => {
    for (const t of ['Chapter 1', 'Chapter One: The Storm', 'Capítulo 1', 'Chapter 12', '# The Mysterious Affair']) {
        assert.strictEqual(core.classifyHeading(t).numbered, true, `"${t}" should be numbered`);
    }
});

test('clampConcurrency: clamps to [1, max], garbage -> 2', () => {
    assert.strictEqual(core.clampConcurrency(5, 15), 5);
    assert.strictEqual(core.clampConcurrency(99, 15), 15);   // capped at plan ceiling
    assert.strictEqual(core.clampConcurrency(0, 15), 1);     // floor
    assert.strictEqual(core.clampConcurrency('abc', 15), 2); // default
    assert.strictEqual(core.clampConcurrency(8, 5), 5);      // respects a lower cap
});

test('nextVersionName: produces the next free "(vN)" and never stacks suffixes', () => {
    assert.strictEqual(core.nextVersionName('My Book', ['My Book']), 'My Book (v2)');
    assert.strictEqual(core.nextVersionName('My Book', ['My Book', 'My Book (v2)']), 'My Book (v3)');
    assert.strictEqual(core.nextVersionName('My Book (v2)', ['My Book', 'My Book (v2)']), 'My Book (v3)');
    assert.strictEqual(core.nextVersionName('My Book', []), 'My Book (v2)');
    assert.strictEqual(core.nextVersionName('Book', ['book']), 'Book (v2)'); // case-insensitive
});

// --- detectCharacterGender -------------------------------------------------
// Backs the character/voice pairing check. It must be RIGHT when it speaks and
// silent when it cannot tell: a wrong answer here swaps a whole book's voices.

const rep = (name, pronoun, n) =>
    Array.from({ length: n }, (_, i) => `${name} paused. ${pronoun} said something ${i}.`).join(' ');

test('detectCharacterGender: reads sex from pronouns near the name', () => {
    assert.strictEqual(core.detectCharacterGender('Marcus', rep('Marcus', 'He', 10), 'English').sex, 'male');
    assert.strictEqual(core.detectCharacterGender('Sara', rep('Sara', 'She', 10), 'English').sex, 'female');
    assert.strictEqual(core.detectCharacterGender('Logan', rep('Logan', 'Il', 10), 'French').sex, 'male');
    assert.strictEqual(core.detectCharacterGender('Nina', rep('Nina', 'Elle', 10), 'French').sex, 'female');
});

test('detectCharacterGender: says "unknown" rather than guessing', () => {
    // Too little evidence to be worth acting on.
    assert.strictEqual(core.detectCharacterGender('Bob', 'Bob left. He waved.', 'English').sex, 'unknown');
    // A genuine even split.
    const mixed = rep('Alex', 'He', 8) + ' ' + rep('Alex', 'She', 8);
    assert.strictEqual(core.detectCharacterGender('Alex', mixed, 'English').sex, 'unknown');
    // Language we have no pronoun table for.
    assert.strictEqual(core.detectCharacterGender('Marcus', rep('Marcus', 'He', 10), 'Klingon').sex, 'unknown');
    // Name that never appears.
    assert.strictEqual(core.detectCharacterGender('Ghost', rep('Marcus', 'He', 10), 'English').sex, 'unknown');
    // Empty inputs.
    assert.strictEqual(core.detectCharacterGender('', 'anything', 'English').sex, 'unknown');
    assert.strictEqual(core.detectCharacterGender('Marcus', '', 'English').sex, 'unknown');
});

test('detectCharacterGender: French impersonal "il y a" is not a man', () => {
    // Without the impersonal filter these would read as male.
    const text = rep('Nina', 'Elle', 10).replace(/Elle/g, 'Il y a du bruit. Elle');
    assert.strictEqual(core.detectCharacterGender('Nina', text, 'French').sex, 'female');
});

test('detectCharacterGender: one sentence is one vote, not one per pronoun', () => {
    // A single mention followed by a pile-up of pronouns must not outvote everything else.
    const stuffed = 'Chris stopped. He he he he he he he he he he said so.';
    const balanced = rep('Chris', 'She', 9);
    const r = core.detectCharacterGender('Chris', stuffed + ' ' + balanced, 'English');
    assert.strictEqual(r.sex, 'female');
});

test('detectCharacterGender: ambiguous pronouns are excluded from the tables', () => {
    // French "lui" and German "sie" serve both sexes, so they must never cast a vote.
    assert.ok(!core.GENDER_PRONOUNS.French.male.includes('lui'));
    assert.ok(!core.GENDER_PRONOUNS.German.female.includes('sie'));
});
