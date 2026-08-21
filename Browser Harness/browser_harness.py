# browser_harness.py
"""
Ultra-light browser helpers – **no external packages required**.

Functions exported:
    • open_url(url)
    • search_and_scroll(term, …)
    • search_x(term, …)             – legacy wrapper
    • copy_page_text()              – return page text via clipboard
"""

from __future__ import annotations

import platform
import subprocess
import time
import urllib.parse
import webbrowser

__all__ = [
    "open_url",
    "search_and_scroll",
    "search_x",
    "copy_page_text",
]

# ─────────────────────────────── core helpers ────────────────────────────────
def open_url(url: str = "https://x.com") -> None:
    """Open *url* in a new browser window or tab (platform-dependent)."""
    webbrowser.open(url, new=2)          # new=2 → new window if possible


def _scroll_one_page() -> None:
    """
    Scroll the active browser tab to the bottom once.

    • **macOS** – sends the *End* key via AppleScript  
    • **Other** – tiny `javascript:` URL as a fallback
    """
    if platform.system() == "Darwin":
        subprocess.run(
            ["osascript", "-e",
             'tell application "System Events" to key code 119'],  # End key
            check=False,
        )
    else:
        webbrowser.open(
            "javascript:window.scrollTo(0,document.body.scrollHeight);void 0;",
            new=0,
        )


def search_and_scroll(
    term: str,
    wait_before_scroll: float = 10.0,
    scrolls: int = 3,
    pause_between_scrolls: float = 3.0,
) -> None:
    """
    • Open X’s **Latest** tab for *term*  
    • Wait *wait_before_scroll* s for results  
    • Scroll *scrolls* times, pausing *pause_between_scrolls* s between scrolls
    """
    query = urllib.parse.quote_plus(term)
    open_url(f"https://x.com/search?q={query}&f=live")
    time.sleep(wait_before_scroll)

    for _ in range(scrolls):
        _scroll_one_page()
        time.sleep(pause_between_scrolls)

# ───────────────────────── back-compat wrapper ───────────────────────────────
def search_x(
    term: str,
    wait_before_scroll: float = 10.0,
    scrolls: int = 3,
    pause_between_scrolls: float = 3.0,
) -> None:
    """Thin wrapper kept for older callers."""
    search_and_scroll(term, wait_before_scroll, scrolls, pause_between_scrolls)

# ───────────────────────── clipboard capture ────────────────────────────────
def _mac_copy_all() -> str:
    """macOS: ⌘A, ⌘C, then return clipboard contents."""
    keystrokes = [
        'tell application "System Events" to keystroke "a" using {command down}',
        'tell application "System Events" to keystroke "c" using {command down}',
    ]
    for script in keystrokes:
        subprocess.run(["osascript", "-e", script], check=False)
        time.sleep(0.2)
    return subprocess.check_output(["pbpaste"]).decode("utf-8", "replace")


def _linux_copy_all() -> str:
    """
    Linux/BSD fallback – prompts user, then tries `xclip -o`.

    Users without `xclip` will simply get an empty string.
    """
    print("↘  Please press Ctrl-A, Ctrl-C in the browser …")
    time.sleep(1.5)
    try:
        return subprocess.check_output(["xclip", "-selection", "clipboard", "-o"]) \
                         .decode("utf-8", "replace")
    except Exception:
        return ""


def copy_page_text() -> str:
    """
    Select-all + copy active tab’s text, then return clipboard contents.

    Currently implemented for macOS & X11 systems.
    """
    system = platform.system()
    if system == "Darwin":
        return _mac_copy_all()
    else:
        return _linux_copy_all()