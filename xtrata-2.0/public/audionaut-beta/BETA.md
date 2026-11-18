# AudioNaut beta

Community testing address: `https://xtrata.xyz/audionaut-beta/`.

The beta is a separate copy of the updated workstation from commit `b45f7a9`.
Its code, sound banks, starter songs and catalogues live under
`public/audionaut-beta/`. The production workstation under `public/audionaut/`
remains unchanged from main. There is no automatic synchronization between the
two folders: beta edits stay in beta until an explicit promotion is reviewed.

## Access

The beta entry page uses the existing Audionaut wallet and token membership
check. It mounts `/audionaut-beta/daw.html` only after the gate grants access and
unloads it on disconnect. The gate bundle itself is shared unchanged with the
original, along with the existing public chain/content APIs. The beta does not
add a different collection, token requirement or wallet allowlist.

The address is not advertised in site navigation. Both entry pages request
no indexing. Share the beta entry URL with the community testers; it is the
same membership gate as the original, not an extra invitation system.

## Separate projects and compatible files

All workstation storage keys are listed in `daw/js/storage-config.js`. The beta
uses `audionaut.beta.*` browser preferences and `audionaut-beta-projects-v1`
for project recovery. It never imports or removes the original's browser
autosave automatically. The two editions share the browser origin and its
storage quota, but use distinct project records and preferences.

To bring a song across, export its project JSON from the original AudioNaut and
use Load in beta. Original project formats, synth IDs and embedded sample data
remain supported. Project format identifiers stay compatible with the existing
importers; beta-only behavior such as the live arp does not change the meaning
of original notes or samples. Compatibility is required in this direction:
original AudioNaut files must continue to load in beta. Beta files are not
promised to work in the original.

The Create/Wizard file handoff is intentionally shared so the existing
inscription review can consume beta exports. Handoffs carry the source label
`audionaut-beta`; wallets and payments remain in the existing review flow.

## Changing and eventually promoting the beta

1. Make workstation changes only in `public/audionaut-beta/`.
2. Keep original project-import compatibility and the storage-isolation checks
   passing. Test the beta entry gate separately from workstation behavior.
3. Keep the original `public/audionaut/` folder and gate sources unchanged in
   beta-only releases. Route/cache changes must target `/audionaut-beta/` only.
4. When the beta is accepted, review the code changes for promotion explicitly.
   Do not copy beta storage identifiers into production or overwrite projects.

The host's normal Cloudflare Pages build copies the public beta directory.
No new server, database binding, contract, wallet action or deployment service
is needed. `_redirects` maps the short beta address to its gated entry page;
`_headers` forces revalidation of beta HTML and code after each release.

See `UPDATE_NOTES.md` for the workstation updates and `tools/README.md` for
repeatable browser checks. The gate regression uses the real built gate script
with simulated read-only chain responses and a synthetic wallet session; it
does not use a person's wallet or sign a transaction.
