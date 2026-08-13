# Changelog

Newest first. The version shown in the app header comes from `APP_VERSION` in
[`src/frontend/js/core.js`](src/frontend/js/core.js) — bump it there, add an entry here, and commit.

Patch = a fix. Minor = new or changed behaviour. No build step, so a hard refresh
(Cmd+Shift+R) is all that is needed to see a new version.

---

## 13.2.1 — 2026-08-13

**Added**

- Version badge in the header, next to the Narrate.AI Studio wordmark. Hovering it
  shows the build date and a one-line note about what changed.
- This changelog.

The version lives in exactly one place, `core.js`. `index.html` ships an empty badge
that `script.js` fills at startup, so there is no second copy to fall out of sync.

---

## 13.2.0 — baseline

The tree as imported into git. Only source is tracked; generated audio, logs and
working manuscripts are ignored.
