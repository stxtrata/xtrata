# JUAN-ITA-FON static page

## Summary

- Added the supplied self-contained JUAN-ITA-FON HTML applications at `public/juantwo/index.html` and `public/juantwo/v2/index.html` through `public/juantwo/v6/index.html`.
- Added static rewrites so `https://xtrata.xyz/juantwo` and `https://xtrata.xyz/juantwo/v2` through `https://xtrata.xyz/juantwo/v6` each serve their respective version without requiring a trailing slash.

## Notes

- The page embeds its audio assets, so it has no deploy-time media dependency.
- It is deliberately isolated from the main application bundle and its wallet flows.
