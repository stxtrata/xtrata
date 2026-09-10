# Embedding Xtrata Radio

For listeners, see [How to listen to Xtrata Radio](radio-listener-guide.md). The web guide is available at `/radio/guide.html` after deployment.

Open `/radio/share.html` for live previews and copyable snippets using the current host.

```html
<iframe src="https://xtrata.xyz/radio/embed.html" title="Xtrata Radio"
  width="100%" height="140" style="border:0" allow="autoplay" loading="lazy"></iframe>
```

For the minimal music bar, append `?mode=minimal` and set height to `72`.
Both layouts support widths from 240px upwards. The compact layout includes
play/pause, volume and next; the minimal layout includes play/pause and track title.
Playback starts from a listener gesture, never from stored playback state.
If someone clicks before the bundle finishes loading, a second click starts audio.

The player runs on the Xtrata host so inscription, playlist and artwork paths
resolve correctly. It requires no partner API key or wallet. Host CSP must allow
`https://xtrata.xyz` in `frame-src`. Avoid adding sandbox restrictions without
testing scripts, storage and outbound links. Browser privacy settings can limit
saved state. Each iframe has an independent listening session; avoid placing two
active players on one page.

This is not a continuous MP3/HLS stream. Each browser selects and retrieves songs
through the existing hosted inscription services. There is no stream URL suitable
for a plain audio element, and no cross-origin parent control API in this release.

Implementation: `public/radio/embed.html`, `embed.js`, `share.html`, `share.js`.
The existing standalone engine is rebuilt with `npm run build:radio`. Its
`resumePlayback` option defaults to true for existing pages and is false for embeds.
This implements a simple hosted embed, not the proposed partner accounts,
analytics or direct-chain reconstruction product in `RADIO-EMBED-PLAN.md`.

## Hosting and routing

Cloudflare Pages serves `radio/share.html`, `radio/embed.html` and
`radio/guide.html` at their extensionless URLs automatically. Do not add
`/radio/share /radio/share.html 200` or the equivalent embed rewrite: Pages
canonicalises the rewritten HTML path back to the same URL, producing a
self-redirect loop. Existing `.html` links remain supported by Pages.

Validate a Pages preview or deployment with:

```sh
node scripts/radio-route-smoke.mjs https://your-preview.pages.dev
```

The check follows a bounded number of redirects and verifies the actual share,
embed and guide page content, including minimal-mode query preservation.
