#!/bin/sh
# Dependency-free test runner. Runs the Node backend + core-logic suites.
# (The browser smoke page is opened manually: http://localhost:3000/tests/browser/smoke.html)
set -e
DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$DIR"
echo "Running Narrate.AI V13 smoke tests (node --test) ..."
node --test
echo ""
echo "For the UI smoke tests: start the server and open"
echo "  http://localhost:3000/tests/browser/smoke.html"
