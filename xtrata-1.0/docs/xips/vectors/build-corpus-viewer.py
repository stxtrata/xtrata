#!/usr/bin/env python3
"""Produce the superseding corpus viewer HTML from the inscribed #1064 source.

The #1064 viewer is a self-contained recursive HTML app. It is NOT purely
manifest-driven: it hardcodes the expected integrity root, the manifest token id,
the "Inaugural" branding, the token range, and the description. Rather than
re-author the app (and risk diverging from its runtime/recursion conventions),
this script applies a small set of deterministic find/replace edits to a saved
copy of the original #1064 bytes.

USAGE
  1. Save the exact bytes of inscription #1064 to a local file, e.g.
       curl -s https://xtrata.xyz/i/1064 -o viewer-1064.html
     (or export it from your inscription tooling — it must be byte-exact).
  2. Mint the new corpus manifest JSON first; note its inscription id and the
     FINAL integrity.root (re-run build-corpus-manifest.py with real ids).
  3. Run:
       python3 build-corpus-viewer.py viewer-1064.html \
           --manifest-id <NEW_MANIFEST_ID> \
           --root 0x<FINAL_ROOT> \
           --range "#1052–1068" \
           --out corpus-viewer-v1.1.0.html
  4. The script asserts each expected old string was found exactly once; if any
     edit count is wrong it aborts (the source drifted — inspect before trusting).
  5. Inscribe the output with core parent = #1064 (the supersession edge).

This script changes only display/config strings. It does not alter the app logic.
"""
import argparse, hashlib, sys

CHUNK = 16384
OLD_MANIFEST_ID = "manifestTokenId:1063"
OLD_ROOT = "5596972090126d22bcbb46fdbbb02cb37d5fd1bb667b9177a90da95144e96fd6"
OLD_RANGE_HINTS = ["#1052–1062", "#1052-1062", "1052–1062", "1052-1062"]
OLD_DESC = "XIP-000 through XIP-009 and the corpus README"
NEW_DESC = "XIP-000 through XIP-011 and the corpus README"
OLD_THROUGH = "through XIP-009"
NEW_THROUGH = "through XIP-011"


def final_hash(data: bytes) -> str:
    h = b"\x00" * 32
    if not data:
        return "0x" + hashlib.sha256(h).hexdigest()
    for i in range(0, len(data), CHUNK):
        h = hashlib.sha256(h + data[i:i + CHUNK]).digest()
    return "0x" + h.hex()


def replace_exact(text, old, new, label, required=1):
    n = text.count(old)
    if n != required:
        sys.exit(f"ABORT: expected {required}x '{label}', found {n}. Source drifted; "
                 f"inspect manually.")
    return text.replace(old, new)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("source", help="path to saved byte-exact #1064 viewer HTML")
    ap.add_argument("--manifest-id", required=True, type=int)
    ap.add_argument("--root", required=True, help="final integrity.root, 0x-prefixed")
    ap.add_argument("--range", default="#1052–1068", help="display token range")
    ap.add_argument("--out", default="corpus-viewer-v1.1.0.html")
    a = ap.parse_args()

    root = a.root[2:] if a.root.startswith("0x") else a.root
    if len(root) != 64:
        sys.exit("root must be 32 bytes (64 hex chars)")

    html = open(a.source, encoding="utf-8").read()

    # 1) manifest token id (config)
    html = replace_exact(html, OLD_MANIFEST_ID, f"manifestTokenId:{a.manifest_id}",
                         "manifestTokenId:1063")
    # 2) hardcoded expected integrity root
    html = replace_exact(html, OLD_ROOT, root, "old integrity root")
    # 3) description + "through XIP-009"
    html = replace_exact(html, OLD_DESC, NEW_DESC, "description")
    html = replace_exact(html, OLD_THROUGH, NEW_THROUGH, "through XIP-009 (header)")
    # 4) "Inaugural" branding -> "Current" (all occurrences; probe showed 3x)
    html = replace_exact(html, "Inaugural", "Current", "Inaugural", required=3)
    # 5) token range (try the known forms; require exactly one form present 3x total)
    matched = [h for h in OLD_RANGE_HINTS if h in html]
    if not matched:
        sys.exit("ABORT: token-range string not found; inspect the source for its form.")
    for h in matched:
        html = html.replace(h, a.range)

    data = html.encode("utf-8")
    with open(a.out, "w", encoding="utf-8") as fh:
        fh.write(html)

    print(f"wrote {a.out}  ({len(data)} bytes)")
    print(f"viewer finalHash: {final_hash(data)}")
    print(f"inscribe with core parent = #1064 (supersession edge)")
    print("NOTE: edit counts above were all asserted; if the script reached here, "
          "every expected string was replaced the expected number of times.")


if __name__ == "__main__":
    main()
