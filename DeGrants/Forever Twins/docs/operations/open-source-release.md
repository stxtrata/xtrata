# Open-source release checklist (Milestone 1.6)

- [ ] Choose a licence (TBD) and add `LICENSE`.
- [ ] Scope: templates, renderer, ft-harness (suites, screener, live-check), registry code,
      manifest builder and seeding script, docs.
- [ ] Remove secrets, keys, private RPC URLs and personal data. Search the history too.
- [ ] `contracts/legacy/` holds archived third-party contract sources (public on-chain). Decide
      whether to keep them; add a provenance and licensing note either way.
- [ ] README states status honestly: unaudited prototype, what has been tested and where.
- [ ] README lists deployed helper addresses and the registry link.
- [ ] `npm ci && npm test` works from a clean clone.
- [ ] Tag a release; link it from the grant tracker and the evidence log.
