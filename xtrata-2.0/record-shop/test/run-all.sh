#!/bin/sh
# Runs every browser suite against dist/Xtrata-Record-Shop-3D.html (needs Python Playwright and Google Chrome).
cd "$(dirname "$0")/.." || exit 1
fail=0
node test/fork.test.mjs 2>/dev/null | tail -1 | sed 's/^/fork model: /'; node test/fork.test.mjs 2>/dev/null | grep -q 'failed 0' || fail=1
for t in a_cd b_vinyl c_shop d_stress e_extra f_tip g_chips i_booth h_stream; do
  if [ "$t" = h_stream ] && [ ! -s test/fixtures/2830.html ]; then echo "$t: skipped (run 'npm run fixtures' first)"; continue; fi
  python3 -u test/$t.py > test/$t.log 2>&1; tail -1 test/$t.log | sed "s/^/$t: /"
  grep -q '"failed": \[\]\|TIP LAYOUT OK' test/$t.log || fail=1
done
exit $fail
