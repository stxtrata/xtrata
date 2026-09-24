# JUAN-ITA-FON static page

## Summary

- Added the supplied self-contained JUAN-ITA-FON HTML applications at `public/juantwo/index.html`, `public/juantwo/v2/index.html`, `public/juantwo/v3/index.html`, and `public/juantwo/v4/index.html`.
- Added static rewrites so `https://xtrata.xyz/juantwo`, `https://xtrata.xyz/juantwo/v2`, `https://xtrata.xyz/juantwo/v3`, and `https://xtrata.xyz/juantwo/v4` each serve their respective version without requiring a trailing slash.

## Notes

- The page embeds its audio assets, so it has no deploy-time media dependency.
- It is deliberately isolated from the main application bundle and its wallet flows.
