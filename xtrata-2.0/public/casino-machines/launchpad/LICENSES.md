# Source and licence notices

Recorded **3 November 2026**. This file identifies included material; it does not grant a blanket licence to the machine or clear third-party trademarks.

## Three.js r128 — MIT

`vendor/three-r128.min.js` retains its original `@license` header: Copyright 2010–2021 Three.js Authors; SPDX-License-Identifier: MIT. The same code is embedded in the built standalone page. Primary licence source: [Three.js r128 LICENSE](https://github.com/mrdoob/three.js/blob/r128/LICENSE).

```text
The MIT License

Copyright © 2010-2021 three.js authors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

This MIT notice covers Three.js. It does not establish a licence for the project's engine, Canvas fallback, cabinet, third-party artwork or brands. Preserve the existing project's applicable notices when incorporating this folder.

`vendor/software-renderer.js` is the unchanged Canvas fallback extracted from the user-provided Forever Twins Neon `oldpack/game1.html`, descended from the supplied ParallaX Casino GPT v0.81 casino build. It is retained as existing project code, with no additional upstream licence inferred from the Three.js notice.

## Artwork and brands

Token artwork remains third-party material. Exact metadata identities, original files, retrieval URLs, dates, SHA-256 hashes and derivative methods are recorded in [art/sources.json](art/sources.json). Runtime resize/compression does not create a new permission grant. **Permissions remain pending for Yeti, Building Blocks, Bucket Coin, Capy, JACKAROO, BAO, Teiko Token, Stacks and BLOCKS.** Jim's final art review is also pending. [ART_REVIEW.md](ART_REVIEW.md) records the shortlist and exclusions.

`art/stx-logo.svg` is the unchanged official Stacks website file. `art/xtrata-logo.svg` and `src/xlogo.js` preserve the exact vector supplied in the user's brief, including its colours and proportions; use of that supplied asset is not an assertion of wider trademark permission. The required project asset `machine-series/brand/parallax-casino-wordmark.svg` was unavailable. The host uses plain PARALLAX CASINO text, not an authenticated official wordmark. No replacement ParallaX logo has been invented; the exact-wordmark requirement remains incomplete.

Historical token and transaction data are attributed in the source manifest and bundled evidence. They establish provenance, not endorsement or permission to use a project's brand. The build does not advertise live prices or actual launch-seat availability.

## Audio and project code

No external audio recordings are bundled. The WebAudio cues and their sources are listed in [art/sound-sources.json](art/sound-sources.json); none is claimed as a downloaded CC0 sample. **Listening sign-off owed.**

The Block Fortune engine was recovered from the existing Forever Twins pack and verified against the public ParallaX source; this document does not relicense it. The standalone implementation and generated cabinet files are project work, with no new blanket licence imposed here. The cabinet build uses locally installed DejaVu fonts for raster lettering; no font binaries are distributed in this folder.
