# Nine Lives cabinet model (LEO Cats · ParallaX Casino)

`nine-lives-model.json` is the packed cabinet the casino room loads: `{root, geometries, materials, textures}` (77 geometries, 44 materials, 16 textures, 2.03 MB raw / 0.86 MB gzip).
Rebuild: `python3 build_model.py` (needs numpy + Playwright Chromium). Inputs in `assets/` are drawn unmodified:
`xtrata.svg` (sha256 `2de985cf…4667ec`, lower door) and `parallax.svg` (marquee foot, small).

Height of the whole model is about 5.70 units (the room rescales to 2.6 m). Origin: floor centre, front faces +z.

## Roles the room / test page look for (`px-<role>` mesh names)
| role | what | animated by |
|---|---|---|
| `screenMesh` | curved screen at (0, 2.88, 0.535), 1.98 × 1.36. Game canvas goes here | room swaps its map |
| `crest` | topper group at (0, 5.2, 0): crescent moon, sitting cat with teal rim, tail, halo planes, stars | rotation.y |
| `spinPhysical` | the big POUNCE button (cylinder, teal) at deck x = 0.92 | z press |
| `lever` | cat's-paw claw lever group (chrome shaft, fur cuff, cream paw with pink beans and four teal claws), pivot at (2.0, 2.4, 0.2), on the right. Built by `claw_lever.py` from `nine-lives-model.tail.json` | rotation.x (0 up, about 0.7 pulled) |
| `win0` … `win13` | marquee window overlays (see contract) | host toggles `.visible` |

There is **no `rain` role** and no `recordGroup` / `core` / `armPivot` (not needed for this cabinet).

## Deck actions (`userData.pxMachineAction`, on the button meshes; several meshes share an action)
| action | button | label texture |
|---|---|---|
| `pays` | PAWS | `lblPays` |
| `betDown` | − TREATS | `lblDown` |
| `betUp` | + TREATS | `lblUp` |
| `auto` | AUTO-PROWL (amber) | `lblAuto` |
| `spin` | POUNCE (also the lever's pull maps to spin through the engine) | `spin` |
Counts of tagged meshes: spin 14, pays 3, betDown 3, betUp 3, auto 3. The `spinPhysical` mesh carries `spin` too.

## Marquee-window contract
The header sign (1700 × 250 texture on a 3.4 × 0.5 plane at y 4.275, z 0.6225) shows eight rooftop silhouettes.
Windows painted into the texture are static (lit or dark). 14 further windows are **flicker windows**: painted dark in the
texture, with a small lit overlay mesh named `win0`…`win13` at z 0.6255. Two materials (warm amber / cream) alternate.
The room only animates the roles listed above, so the host must toggle `parts['win'+k].visible` (for example one or two
windows swapping every 400–900 ms, more during wins). With no host support the overlays simply show a fixed pattern
(`visible = (k % 3 != 2)`), which still looks right.

## Textures (all drawn in `textures.js`, names are the keys of `renderAll()`)
`towerSign` 296×2240 (side tower), `sideSign` 512×1792 (cabinet side), `screen` 700×480 (fallback until the game canvas arrives),
`glass` (screen glare), `header` 1700×250 (marquee), `door` 1032×624 (lower door: "LEO CATS · FOREVER ON STACKS" + Xtrata mark),
`spin`, `lblPays`, `lblDown`, `lblUp`, `lblAuto`, `ticket`, `coin`, `wood`, `woodV`, `halo`.

## Look
Midnight-blue body, teal (#12b5a6) trim, amber window light. Topper: glowing crescent with a cat silhouette. Attic-window screen
frame in warm wood with a sill and a small gable. Cat ears on the roofline, three chimneys with pots, side towers with night
rooftops and "OPEN ALL NIGHT". Lever: a cat's paw with extended claws (replaced the earlier raised-tail lever; the tail version is kept in nine-lives-model.tail.json).

## Preview
`_preview/preview.html` + `_preview/shoot.py` (Playwright, SwiftShader) render named views. Query: `?cam=&look=&fov=&lever=0..1&crest=deg&flicker=1`.
Checked views: front, threeq, topper, topper_front, marquee, marquee_flick, screen, deck, lever, lever_pull, door, side.
