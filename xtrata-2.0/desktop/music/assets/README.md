# Xtrata Music app icon

`xtrata-music-source.webp` is the user-supplied X logo, used unchanged.
PNG, multi-size ICO (16/24/32/48/64/128/256) and ICNS are format/size
conversions of that source. Generated with Pillow 11.3.0 using RGBA conversion
and Image.save; no artwork edits.

Both standard and legacy Mac builds use the ICNS through shared build.mac.icon.
Windows uses the ICO for executable/installer branding and the window icon.
The window PNG and ICO are explicitly packaged. Linux's existing build target
uses the PNG; this does not imply a tested/published Linux release.

Existing release installers are immutable: rebuilding and publishing new
versions is required before downloaded apps display this icon.
