# Image Compressor — Integration Proposal & Build Notes

## The one decision that shapes everything

The dropped-in `smart-image-compressor-browser-v3` is a **Python/Pillow server app**: it
spins up a local HTTP server with `/preview` and `/compress` endpoints and does all the
encoding in Python. The Opus file generator, by contrast, is **100% client-side** — "all
file processing and conversions happen directly in the browser. No files are uploaded to a
server," exactly like the FFmpeg-WASM audio path.

Bolting the Python app on as-is would break that promise (it needs Python + Pillow installed
and a running server), so the right move is to **port the compression logic into the browser**
using the Canvas API and `canvas.toBlob()`, which natively encodes the same three formats the
Python tool targets (JPEG, PNG, WebP). The Pillow logic maps almost 1:1:

| Python (Pillow) | Browser port |
|---|---|
| `resize_if_needed` | draw onto a canvas at scaled dimensions |
| `encode_profile` (q 90 / 82 / 72) | quality arg to `canvas.toBlob('image/jpeg'\|'image/webp', q)` |
| `candidate_formats` (auto-best) | encode each candidate, keep the smallest blob |
| `has_alpha` | sample the canvas `ImageData` alpha channel |
| `looks_graphic` (≤512 colours) | count distinct colours in a 128px thumbnail |
| `flatten_alpha` (JPEG bg) | fill canvas white, then draw, before JPEG encode |
| `skip_larger` | compare output blob size to the original |
| zip export | not needed — single cover image, returned as blob + base64 |

### Two honest differences from Pillow (browser limitations, not bugs)
- **PNG colour quantization** (the "smallest" profile's 256-colour reduction) isn't available
  in the browser without a third-party library. PNG is always lossless here. In Auto mode
  WebP/JPEG almost always win for the kinds of images this affects, so the practical impact is
  near zero. If exact parity matters later, add a small WASM quantizer (e.g. UPNG/pngquant-wasm).
- **EXIF/ICC metadata** is always stripped by canvas encoding. For inscription cover art that's
  actually desirable (smaller files), so the Pillow "preserve metadata" toggle was dropped.

## UX placement — recommendation

**Inline expander inside Step 2**, not a modal. Reasoning: the wizard already uses progressive
disclosure with `.compact-box` panels (e.g. the recursive-cover box), the before/after compare
is small (one image, a few stat pills), and keeping it in the page flow means "tune → compare →
use → Next" with no context switch or focus trapping. A modal would be heavier than the payload
justifies and would fight the existing step layout.

### Flow
1. User uploads cover art under **Embedded visual** (existing input, unchanged).
2. If it's a still image, an **"Optimise image"** panel expands underneath. (Video / animated
   GIF are skipped — canvas only captures one frame — and the existing embed-as-is path is used.)
3. Panel offers Balance / Output format / Max long edge / "if output is larger" controls, and a
   live original-vs-compressed comparison that re-runs on any setting change.
4. User picks the result they're happy with, then:
   - **Use compressed version** → feeds the result into the existing
     `window.updateaudionalVisualBase64(dataUrl, mime, name)` state, so the wizard preview, the
     base64 textarea, and the HTML export all just work; or
   - **Download** the optimised file; or
   - **Copy base64**; or
   - **Revert to original**.

## Files

| File | Change |
|---|---|
| `image-compressor.js` | **New.** Dependency-free engine (ES module). `compressImage(file, settings)`, `isCompressibleImage(file)`, `humanSize(bytes)`. This is the browser port of the Pillow logic. |
| `image-compressor-ui.js` | **New.** Injects the inline "Optimise image" panel into Step 2's embedded-visual box (reusing existing CSS classes) and wires it to `updateaudionalVisualBase64`. Self-contained — no Step 2 HTML edits required. |
| `index.html` | **One edit.** Imports `initImageCompressorUI` in the existing `type="module"` block and calls it on `DOMContentLoaded`, next to `initializeImageConverter`. |
| `image-compressor-test.html` | **New (dev only).** Browser self-test harness; generates synthetic photo/graphic/alpha images and asserts the engine behaves. |

## Verification

Ran the engine in the live browser against synthetic images — **11/11 checks passed**:
- 1.6 MB photo PNG → 204.8 KB (Auto picked JPEG, smaller). 
- Transparent image kept as WebP, never flattened to JPEG. 
- Resize to a 200px long edge honoured (200×156). 
- Forced WebP / PNG honoured. 
- Skip-if-larger logic correct. 
- Type gating: PNG accepted; MP4 and GIF rejected.

## Suggested follow-ups (optional)
- Add a WASM PNG quantizer if exact Pillow "smallest" parity on flat PNGs is wanted.
- Surface a one-line size delta on the Step 2 → Export summary ("cover optimised: −86%").
- Reuse the same engine on Step 1's standalone image-to-base64 tool for consistency.
