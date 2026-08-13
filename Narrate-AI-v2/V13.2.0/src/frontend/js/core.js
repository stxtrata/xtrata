/**
 * Narrate.AI - core.js
 * Pure, side-effect-free helpers shared by the browser app and the Node test suite.
 *
 * This module has NO DOM or network dependencies so it can be unit-tested in Node
 * (`require`) and also loaded directly in the browser via <script>. In the browser
 * the helpers are also attached to `window` so existing global call-sites keep working.
 */
(function (root, factory) {
    const mod = factory();
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = mod;                 // Node / test runner
    }
    if (root) {
        root.NarrateCore = mod;               // namespaced access
        Object.assign(root, mod);             // back-compat globals for the existing app
    }
})(typeof window !== 'undefined' ? window : null, function () {
    'use strict';

    // ---------------------------------------------------------------------
    // VERSION - single source of truth.
    //
    // Bump these three on every commit that changes behaviour, and add the
    // matching entry to CHANGELOG.md. Nothing else in the app hard-codes a
    // version: index.html ships an empty badge that script.js fills from here,
    // so this block is the only place to edit.
    //
    // MAJOR AND MINOR TRACK THE FOLDER NAME. This folder is V13.2.0, so every
    // version in it is 13.2.x and only the patch number moves, however big the
    // change. A new lineage means a new folder: clone to V13.3.0 and start it at
    // 13.3.0. Never let a version number name a folder that holds something else.
    //
    // APP_VERSION  13.<folder minor>.<patch, +1 per behaviour change>
    // APP_BUILD    ISO date of that commit.
    // APP_NOTE     one line describing the change, shown in the badge tooltip.
    // ---------------------------------------------------------------------
    const APP_VERSION = '13.2.6';
    const APP_BUILD = '2026-08-13';
    const APP_NOTE = 'Analysis names the character/voice pairing and flags scene-break switches.';

    // Clamp the user-supplied chunk size into a safe range.
    function sanitizeChunkSize(v) {
        const p = parseInt(v, 10);
        return isNaN(p) ? 1000 : Math.min(Math.max(p, 200), 4000);
    }

    // Sentence-aware splitter: break `txt` into pieces no longer than `max` chars,
    // preferring to cut on sentence punctuation, then whitespace, then a hard cut.
    function splitTextIntoChunks(txt, max) {
        const res = [];
        let rem = String(txt == null ? '' : txt).trim();
        const limit = sanitizeChunkSize(max);
        while (rem.length > 0) {
            if (rem.length <= limit) { res.push(rem); break; }
            const safe = Math.floor(limit * 0.75), area = rem.substring(safe, limit);
            let split = safe, match, last = -1;
            const re = /[.!?”"]+(?=\s|$)/g;
            while ((match = re.exec(area)) !== null) last = match.index + match[0].length;
            if (last !== -1) {
                split += last;
            } else {
                const sp = rem.lastIndexOf(' ', limit);
                split = (sp > limit * 0.3)
                    ? sp
                    : (rem.lastIndexOf('\n', limit) > limit * 0.3 ? rem.lastIndexOf('\n', limit) : limit);
            }
            res.push(rem.slice(0, split).trim());
            rem = rem.slice(split).trimStart();
        }
        return res;
    }

    // Lowercase alphanumeric slug (no separators) used for human-readable id prefixes.
    function slugify(s) {
        return String(s == null ? '' : s).toLowerCase().replace(/[^a-z0-9]/g, '');
    }

    // Deterministic short hash (djb2-style) -> hex string. Stable across browser & Node.
    function hashString(s) {
        let h = 0;
        s = String(s == null ? '' : s);
        for (let i = 0; i < s.length; i++) {
            h = ((h << 5) - h) + s.charCodeAt(i);
            h |= 0;
        }
        return (h >>> 0).toString(16);
    }

    // Generate a GUARANTEED-UNIQUE project id with a readable prefix.
    // Unlike the old title+author hash (which collided for untitled / same-named books),
    // this combines a timestamp and randomness so two books — even two untitled ones —
    // never share an id. That is what keeps multi-book / multi-tab generation isolated.
    function generateProjectId(meta) {
        meta = meta || {};
        const base = (slugify(meta.displayTitle || meta.title || 'book').slice(0, 10)) || 'book';
        const ts = Date.now().toString(36);
        const rand = Math.random().toString(36).slice(2, 8);
        return `${base}_${ts}${rand}`;
    }

    // Normalize a dual-voice switch token so "***" and "* * *" are treated the same.
    // Returns { canonical, compact } where compact is whitespace-stripped for matching.
    function normalizeSwitchToken(token) {
        const raw = String(token == null ? '' : token).trim();
        const compact = raw.replace(/\s+/g, '');
        return { canonical: raw, compact };
    }

    // N2: round a dollar cost UP to the next whole dollar (min $1) for the session budget.
    function roundUpToDollar(n) {
        const v = Number(n);
        if (!isFinite(v) || v <= 0) return 1;
        return Math.max(1, Math.ceil(v));
    }

    // N3: turn a book title into a human-readable, filesystem-safe download filename.
    // Strips characters illegal on Windows/macOS, collapses whitespace, caps length.
    function toReadableFilename(title, ext) {
        let base = String(title == null ? '' : title)
            .replace(/[\\/:*?"<>|]+/g, ' ')   // illegal path chars
            .replace(/[\x00-\x1f]+/g, ' ') // control chars
            .replace(/\s+/g, ' ')
            .replace(/[.\s]+$/g, '')           // no trailing dots/space
            .trim()
            .slice(0, 120);
        if (!base) base = 'audiobook';
        const e = String(ext || '').replace(/^\.+/, '');
        return e ? `${base}.${e}` : base;
    }

    // N1: classify a chapter heading so front/back matter (Prologue, Preface, Introduction,
    // Foreword, Prelude, Epilogue, Afterword) is NOT given a chapter number, while real
    // chapters are. Returns { kind, numbered, label }.
    function classifyHeading(rawTitle) {
        const clean = String(rawTitle == null ? '' : rawTitle)
            .replace(/^[#\s]+/, '')                 // markdown hashes
            .trim()
            .replace(/^[\-–—:\s]+|[.\s:]+$/g, '');  // trim stray edge punctuation
        const lower = clean.toLowerCase();
        const front = [
            ['prologue', 'Prologue'], ['prelude', 'Prelude'], ['preface', 'Preface'],
            ['foreword', 'Foreword'], ['forward', 'Foreword'],
            ['introduction', 'Introduction'], ['intro', 'Introduction'],
            ['epilogue', 'Epilogue'], ['afterword', 'Afterword'], ['postscript', 'Postscript']
        ];
        for (const [kw, label] of front) {
            // Match the word at the start, optionally followed by ": Subtitle".
            if (new RegExp('^' + kw + '\\b').test(lower)) {
                return { kind: label.toLowerCase(), numbered: false, label };
            }
        }
        return { kind: 'chapter', numbered: true, label: null };
    }

    // Clamp a user-supplied parallel-request count to [1, max]; garbage -> default 2.
    function clampConcurrency(v, max) {
        const cap = Math.max(1, parseInt(max, 10) || 15);
        const n = parseInt(v, 10);
        if (isNaN(n)) return Math.min(2, cap);
        return Math.min(Math.max(n, 1), cap);
    }

    // Next available "Title (vN)" given the titles already taken. Strips an existing
    // "(vN)" suffix so versions don't stack (e.g. "Book (v2)" -> "Book (v3)").
    function nextVersionName(title, existingTitles) {
        const norm = s => String(s == null ? '' : s).trim().toLowerCase();
        const base = String(title == null ? '' : title).replace(/\s*\(v\d+\)\s*$/i, '').trim() || 'Untitled';
        const taken = new Set((existingTitles || []).map(norm));
        let n = 2;
        while (taken.has(norm(`${base} (v${n})`))) n++;
        return `${base} (v${n})`;
    }

    return {
        APP_VERSION,
        APP_BUILD,
        APP_NOTE,
        sanitizeChunkSize,
        splitTextIntoChunks,
        slugify,
        hashString,
        generateProjectId,
        normalizeSwitchToken,
        roundUpToDollar,
        toReadableFilename,
        classifyHeading,
        clampConcurrency,
        nextVersionName
    };
});
