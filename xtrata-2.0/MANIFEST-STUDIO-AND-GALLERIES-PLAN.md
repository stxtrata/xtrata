# Plan: Manifest Studio (A) + Named Galleries with /g endpoint (B)

Converted from Jim's voice-note todo (artist pages, dyle.btc galleries, manifest creator, owner vs curated collections, future subscriptions). Grounded in what already ships in xtrata-2.0: the Xtrata Collection Manifest standard (`docs/standards/xtrata-collection-manifest-standard.md`), the machine schema (`schemas/xtrata-collection-manifest.schema.json`), the modular templates (`docs/standards/xtrata-manifest-templates/`), curated-gallery rendering in the homepage (`CURATED_GALLERIES` in `src/home/config.js`), Agent One for inscription, and the BNS resolver (`src/lib/bns/resolver.ts`).

---

## Manifest levels (the vocabulary both pages teach)

| Level | Name | Who can create | Contents | Trust signal |
|---|---|---|---|---|
| L1 | **Creator Collection Manifest** | An address that OWNS every listed inscription at creation time | Own works, grouped/ordered | "Owner-attested" badge; validator re-checks ownership on read |
| L2 | **Curated Gallery Manifest** | Anyone | Any inscriptions — own or others' (viewing/listening/mixed) | "Curated by <name>" badge; no ownership claim implied |
| L3 | **Collection Manifest (full standard)** | Collection teams | Full schema: identity, itemMap, provenance, reconstruction, marketplace, rights | Schema-validated per `xtrata-manifest-validation.md` |
| L0 | **Profile Manifest** | Only the address that owns the BNS name it decorates | Pointer to the owner's public galleries + display prefs | This is what makes "visit dyle.btc's gallery" work |

All levels are ordinary Xtrata inscriptions (`application/json`) with a shared envelope so the resolver can distinguish them:

```json
{
  "xtrataManifest": { "kind": "profile|creator-collection|gallery|collection",
                      "version": 1, "name": "dyle-selected-works",
                      "owner": "SP…", "bnsName": "dyle.btc",
                      "supersedes": "<older manifest inscription id|null>" },
  "items": [ { "tokenId": "512", "contractId": "SP….xtrata-v3-2-3",
               "label": "…", "media": "image|audio|html" } ],
  "display": { "mode": "viewing|listening|mixed", "cover": "512", "order": "manual" }
}
```

## The BNS freshness pattern (how "newest manifest" is resolved)

Inscriptions are immutable, so a gallery is updated by inscribing a NEW manifest and repointing discovery at it. Resolution order for `dyle.btc`:

1. **Reverse walk (default, zero-setup):** resolve `dyle.btc` → address via the existing resolver, scan that address's inscriptions for `xtrataManifest.kind === "profile"`, take the one with the highest inscription id (newest wins — ids are monotonic). The profile lists the current gallery manifest ids.
2. **Supersede chain (integrity):** each new manifest carries `supersedes: <old id>`; the resolver follows/validates the chain so a stale link still leads forward to the newest version.
3. **Authenticity rule:** a manifest only counts for `dyle.btc` if it was inscribed BY the address that currently owns `dyle.btc` (checked on read via BNS ownership + the inscription's minter). Anyone can inscribe a fake "dyle gallery"; it simply never resolves.

This gives "update your gallery by inscribing a new manifest — the name always reads the newest one" with no server-side mutable state.

---

## A) Manifest Studio — `/manifests` (one-stop create + inscribe)

**What:** a static page (same pattern as the Agent One wizard: `xtrata-agent-one/wizard/manifests.html`, deployed at `/manifests`) where anyone connects a wallet and builds, validates, previews, and inscribes any manifest level.

**Flow:**
1. **Connect** (reuses `agent-one-wallet.js`; BNS name shown per the wallet-pill pattern).
2. **Choose a level** — four cards (L0–L3) with plain-English explanations from the table above; L1 only offered when the wallet holds inscriptions; L3 links the full standard docs and loads a template from `docs/standards/xtrata-manifest-templates/`.
3. **Build** —
   - *Own works picker:* wallet holdings fetched via the existing Hiro holdings endpoint (`fetchWalletSourceTokenIds` pattern), rendered as a thumbnail grid with click-to-add and drag-to-order.
   - *Any-inscription picker (L2):* add by token id or paste an explorer URL; live preview via `/runtime/content`.
   - Gallery metadata: name (slug-validated, becomes the `/g/` handle), description, mode (viewing/listening/mixed), cover.
   - *Update mode:* paste or auto-detect your previous manifest → items pre-loaded, `supersedes` set automatically.
4. **Validate** — envelope check for L0–L2; full `schemas/xtrata-collection-manifest.schema.json` validation for L3 (client-side, ajv bundled); L1 additionally verifies on-chain ownership of every item before allowing inscribe.
5. **Preview** — renders the gallery exactly as `/g/<name>` will (shared renderer, see B).
6. **Inscribe** — hands the JSON file to Agent One (same deposit-wallet flow as SUNO: create job → pay once → token + receipt). Manifests are small, so this is the cheapest job type.
7. **After-care panel** — shows the new manifest id, the supersede chain, and "your gallery is live at /g/<name>" with copyable link.

**Instructions content (on-page, collapsible):** what each level is for, how authenticity binds galleries to BNS names, how to update (inscribe new + supersedes), and how third-party tools should resolve newest-manifest (the 3-step resolution above). Cross-link `docs/standards/*` for the full L3 spec.

**Code touchpoints:** new `manifests.html` + `manifests.js` in `xtrata-agent-one/wizard/`; reuse `agent-one.js` (estimate/job/pay), `HTML_Template.js` untouched; add `schemas/manifest-envelope.schema.json` (new, small); `_redirects`: `/manifests /agent-one/manifests.html 200`.

## B) Gallery display + `/g/:name` endpoint

**Resolution endpoint (Cloudflare Function):** `functions/g/[[path]].ts`
- `/g/dyle.btc` (or `/gallery/…` alias) → resolve name → address → newest profile manifest → default gallery; `/g/dyle.btc/selected-works` → that named gallery; `/g/<manifest-id>` → direct, immutable link to one version.
- Returns the gallery page (SSR shell + manifest JSON embedded) or `?format=json` for the raw resolved manifest — that's the API third parties use.
- Caching: edge-cache 60s keyed on name; the immutable id form caches forever.

**Gallery renderer:** one shared module `src/home/gallery/` (used by both the `/g` page and Studio preview): responsive grid built on the homepage's existing tile/thumbnail machinery (IndexedDB cache, runtime image streams), listening mode renders the Opus players inline, mixed mode interleaves. Header shows gallery name, curator BNS name (linked to their profile), "Owner-attested" or "Curated" badge, and manifest version/id with the supersede history.

**Homepage search integration (the dyle.btc moment):** the wallet lookup already resolves `.btc` names. Add: after resolution, quietly check for a profile manifest; if found, show a **"Visit gallery →"** button beside the results (links `/g/<name>`). No gallery → behaviour unchanged (shows raw holdings).

**Naming rules:** gallery handles are scoped to the BNS name (`dyle.btc/selected-works`), so no global name-squatting problem; bare handles (`/g/selected-works`) can later be a paid/registry feature.

## Phasing

1. **Phase 1 — SHIPPED (2026-07-02):** `schemas/manifest-envelope.schema.json`; `functions/g/[[path]].ts` (name → address → newest-manifest reverse walk, profile → gallery indirection, `supersedes` link, `?format=json` API, `/g/<id>` immutable form, `/gallery/*` redirect alias); self-contained gallery renderer (viewing/listening/mixed tiles via `/inscription/<id>`); homepage lookup now probes `/g/<name>` after a BNS lookup and shows "Visit gallery →" when one exists. Phase-1 simplifications to revisit: minter-authenticity check is holdings-based only, and the profile→gallery pointer assumes the default master contract.
2. **Phase 2:** Manifest Studio page with L0–L2 builders, validation, preview, Agent One inscribe, update/supersede mode.
3. **Phase 3:** L3 full-standard builder (template-driven form over the big schema), curator subscriptions (paid bare handles, multiple galleries, analytics), and gallery theming.

## Open questions (decide before Phase 2)

- Fee level for manifest inscription jobs — flat "manifest rate" vs standard per-byte quote?
- Should profile manifests (L0) be free/subsidised to seed adoption?
- Subscription model for non-BNS users' galleries (voice note mentioned sign-up + subscription) — gate by holding any Xtrata inscription instead?
