# Browser checks (Playwright for Python, Chromium, software WebGL)

* `lib.py` opens the test page (blocks every non-local network host).
* `t5.py W H TAG kinds [rm] [menus]` plays whole sessions through the full-screen bar only; screenshots every stage.
* `t6.py`, `t8.py` check the real Fullscreen API over http (F, browser Esc, bar Exit, and the fixed-layer fallback).
* `t9.py W H TAG kinds rm|no` plays with Skip at every stage (and reduced motion when `rm`).
* `run-*.log` are the logs of the runs behind the report. `../screenshots/` has the four stages of each bonus at phone width, and desktop sheets.
