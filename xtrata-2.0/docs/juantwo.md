# JUAN-ITA-FON static page

## Summary

- Added the supplied self-contained JUAN-ITA-FON HTML application at `public/juantwo/index.html`.
- Added a static rewrite so `https://xtrata.xyz/juantwo` serves that page without requiring a trailing slash.

## Notes

- The page embeds its audio assets, so it has no deploy-time media dependency.
- It is deliberately isolated from the main application bundle and its wallet flows.
