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

    return {
        sanitizeChunkSize,
        splitTextIntoChunks,
        slugify,
        hashString,
        generateProjectId,
        normalizeSwitchToken
    };
});
