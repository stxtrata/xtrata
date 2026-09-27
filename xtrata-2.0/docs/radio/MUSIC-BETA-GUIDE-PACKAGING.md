# Beta installation guide distribution

Canonical source: `desktop/music/README-BETA-TESTERS.md`.
`desktop/music/prepare-guide.mjs` produces an identical readable `.txt` copy
for the public downloads directory and desktop resources. It runs during both
website and desktop preparation. No renderer, wallet or network access is used.

The Lounge offers read/download links before the installers. The latest three
beta releases also have `*-with-guide.zip` bundles containing the original
unchanged installer, `READ-ME-FIRST.txt`, and its installer SHA-256. Each bundle
has its own SHA-256 alongside it and in release metadata. Extract the ZIP and
read the text file before running the installer. Existing EXE/DMG files have
not been replaced or rebuilt; their hashes are unchanged.

Future app builds include the guide as an extra resource outside ASAR, opened
with Help → Beta tester installation guide. Mac DMG packaging also places a
visible guide beside the app. Windows CI runs `bundle-installer-guide.py` after
building the installer, and publishes the ZIP as an additional build artifact.

Current releases: Windows 1.0.9; Mac standard and Monterey 1.0.6. Existing
installed applications gain the Help menu entry only after a future installer
rebuild; their companion ZIPs provide pre-install instructions immediately.

Validation: 12 targeted tests passed, website build passed, each ZIP's CRC and
embedded installer hash were verified. A local unpacked Mac build contains an
exact guide copy outside ASAR. No new Windows installer or DMG layout was built
for this documentation change; those packaging paths require the next native
release checks. No wallet data or payments were used.
