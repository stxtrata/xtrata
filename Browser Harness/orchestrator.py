# orchestrator.py
"""
Minimal step-runner.

Available steps
---------------
open_x        – open https://x.com
first_search  – run the first real search term found in *search_terms.txt*
"""

from __future__ import annotations

import argparse
import datetime as _dt
from pathlib import Path
from typing import Callable, Dict, Iterator

from browser_harness import open_url, search_x, copy_page_text

# ───────────────────────────── utilities ────────────────────────────────────
_SKIP_PREFIXES: tuple[str, ...] = ("#", "---")

_IGNORE_PHRASES = {
    # left nav / right sidebar noise to strip from captures
    "Home", "Explore", "Notifications", "Messages", "Grok", "Premium", "History",
    "Creator Studio", "Articles", "Profile", "More", "Post",
    "Search filters", "Advanced search", "Live on X", "Today’s News",
    "What’s happening",
}

def iter_search_terms(path: Path) -> Iterator[str]:
    """Yield real search-query lines, skipping blanks & comment markers."""
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or any(line.startswith(p) for p in _SKIP_PREFIXES):
            continue
        yield line


def _filter_center_column(text: str) -> str:
    """Drop lines that clearly belong to side-bars / nav columns."""
    filtered = [
        ln for ln in text.splitlines()
        if ln.strip() and not any(ph in ln for ph in _IGNORE_PHRASES)
    ]
    return "\n".join(filtered).strip()


def _append_capture(term: str, body: str) -> None:
    """Append *body* to the daily “X Search YYYY-MM-DD.txt” log."""
    today = _dt.date.today()
    log_path = Path(__file__).with_name(f"X Search {today}.txt")

    timestamp = _dt.datetime.now().strftime("%H:%M:%S")
    header = f"\n\n=== {term}  @  {timestamp} ===\n\n"

    with log_path.open("a", encoding="utf-8") as fh:
        fh.write(header)
        fh.write(body)


# ───────────────────────────── step functions ───────────────────────────────
def open_x() -> None:
    """Open X in a new window/tab."""
    open_url("https://x.com")


def first_search() -> None:
    """
    • Read the first genuine line from *search_terms.txt*  
    • Search X (Latest), scroll, copy page text, filter side-bars, save to log
    """
    terms_file = Path(__file__).with_name("search_terms.txt")
    try:
        term = next(iter_search_terms(terms_file))
    except (StopIteration, FileNotFoundError) as err:
        print(f"[first_search] Cannot obtain search term: {err}")
        return

    print(f"[first_search] Searching for: “{term}” …")
    search_x(term)                     # opens browser, waits & scrolls

    captured = copy_page_text()
    if not captured.strip():
        print("[first_search] Couldn’t read clipboard – capture skipped.")
        return

    _append_capture(term, _filter_center_column(captured))
    print("[first_search] Capture appended ✔︎")


# ───────────────────────────── entry point ──────────────────────────────────
_STEPS: Dict[str, Callable[[], None]] = {
    "open_x": open_x,
    "first_search": first_search,
    # add more steps here …
}

def main() -> None:
    parser = argparse.ArgumentParser(description="Run one or more steps in sequence.")
    parser.add_argument(
        "--step",
        action="append",
        choices=_STEPS.keys(),
        help="Name(s) of steps to run (can repeat). "
             "If omitted, ‘open_x’ runs by default.",
    )
    args = parser.parse_args()
    for step in args.step or ["open_x"]:
        _STEPS[step]()


if __name__ == "__main__":
    main()