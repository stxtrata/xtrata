# Audiobook Studio Gen-3 (V13.1.0)

A local, browser-based studio for turning manuscripts into audiobook audio using ElevenLabs voices. It parses chapters, splits text into safe segments, caches generated audio, and merges chapters into a full-book MP3.

## What's new

**V13.0 (architecture + tooling)**
- Incremental timeline rendering (no full rebuild on every playback tick) — smooth playback on large books.
- Globally-unique project IDs + an inline project-name field in the header (fixes collisions, enables multiple books across tabs).
- Parallel chunk generation (bounded to the server's concurrency) with live progress and a "Retry Failed" control.
- Document import: `.txt`, `.md`, `.docx` (vendored mammoth, offline) plus drag-and-drop onto the editor.
- A dependency-free smoke-test suite (`node --test` + a browser page). See `tests/README.md`.

**V13.1.0 (UX/parsing batch — from the v12 notes)**
- Prologue/preface/introduction/foreword/epilogue no longer shift chapter numbers (N1).
- Session budget auto-sets to the rounded-up estimate after Analyze (N2).
- Readable download filenames derived from the book title (N3).
- Click anywhere on a chapter/title block to view its text; click again to return to the full book (N4).
- Toggle for whether the narrator reads the chapter heading (N5).
- Confirm-generation modal fits on screen (scrolls internally) (N6).
- Connect button is orange before connecting, green once connected (N7).
- Live processing/done ticks per segment and per chapter; session spend is saved and restored on reload (N8).

**V13.1.0 patch (fixes + speed)**
- French chapter numbers parse correctly (e.g. "Chapitre Vingt et Un" = 21) — no more false "Mismatch" warnings.
- Section counts are type-aware: chapters are counted separately from Titles / Prologue / Epilogue / Introduction, and the analysis log prints the breakdown.
- **Parallel Requests** setting (Project tab, default 10, up to 15) controls how many segments generate at once — set it to your ElevenLabs plan's concurrency limit (Free 2 · Starter 3 · Creator 5 · Pro 10 · Scale 15) for a big speed-up. Audio stays correctly ordered at any setting. The server's global cap is `NARRATE_TTS_CONCURRENCY` (default 15).

## Quick start

1) Install prerequisites
- Node.js (for the local server)
- FFmpeg (must be available on your PATH)
- An ElevenLabs API key (for premium voices)

2) Start the server
```bash
node src/backend/server.js
```

3) Open the app
- http://localhost:3000

## Core workflow

1) Connections tab: enter your ElevenLabs API key and connect.
2) Project tab: choose narration mode (single or dual), select voices, and set chunk size / silence / budget.
3) Paste manuscript text and click "Analyze & Parse".
4) Review the timeline, then click "Generate Audio".
5) Download the full book MP3 when generation is complete.

## Output locations

Generated content is stored under `output/` (created automatically):
- `output/chunks/` individual audio segments
- `output/chapters/` merged chapter MP3s
- `output/titles/` merged title section MP3s
- `output/book/` merged full book MP3s
- `output/projects/` saved project JSON files
- `output/temp/` temp files (silence clips, concat lists)

## Documentation

- `docs/USER_GUIDE.md` - end-user instructions and text formatting guidance
- `docs/TROUBLESHOOTING.md` - common issues and fixes
- `docs/API_REFERENCE.md` - backend endpoints and payloads
- `docs/DEVELOPER_GUIDE.md` - architecture and development notes

## Notes

- The UI stores the ElevenLabs key and manuscript draft in your browser localStorage.
- Cost estimates are approximate and based on the app's built-in pricing multiplier.
- This project is a local server. Do not expose it to the public internet without adding authentication and input hardening.
