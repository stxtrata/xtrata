#!/bin/bash
set -e
cd "$(dirname "$0")/../gen" && python3 make_game.py >/dev/null && python3 make_game2.py && node --check g21-game.js && cd ../build && python3 assemble.py | tail -2 && python3 package.py
