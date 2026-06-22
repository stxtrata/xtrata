#!/usr/bin/env python3
"""Build (and verify) a superseding XIP corpus manifest.

Reuses the constructions proven against the inaugural corpus inscription #1063:
  - core final-hash : H_0 = 32 zero bytes; H_i = SHA-256(H_{i-1} || chunk_i);
                      fixed 16 KiB (16384) chunks  (xtrata-v3-2-3).
  - merkle leaf     : SHA-256(0x00 || JCS({contract, finalHash, inscriptionId, order}))
  - merkle node     : SHA-256(0x01 || left || right); odd -> duplicate last;
                      members sorted by (contract, inscriptionId).   [xtrata-merkle-v1]

SELF-TEST: running this script first reproduces the inaugural integrity.root
(0x5596...) from #1063's 11 members. If that fails, do not trust the output.

Inscription IDs of NEW documents are assigned at mint time. Fill them into
NEW_IDS below once known, then re-run to emit the byte-exact manifest + root.
"""
import hashlib, json, math, os, sys

CORE = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3"
CHUNK = 16384
XIPDIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def jcs(o):
    return json.dumps(o, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")


def final_hash(path):
    data = open(path, "rb").read()
    h = b"\x00" * 32
    if not data:
        return "0x" + hashlib.sha256(h).hexdigest()
    for i in range(0, len(data), CHUNK):
        h = hashlib.sha256(h + data[i:i + CHUNK]).digest()
    return "0x" + h.hex()


def leaf(m):
    obj = {"contract": CORE, "finalHash": m["finalHash"],
           "inscriptionId": m["inscriptionId"], "order": m["order"]}
    return hashlib.sha256(b"\x00" + jcs(obj)).digest()


def merkle_root(members):
    if not members:
        return "0x" + hashlib.sha256(b"\x00").hexdigest()
    ordered = sorted(members, key=lambda m: (CORE, m["inscriptionId"]))
    level = [leaf(m) for m in ordered]
    while len(level) > 1:
        nxt = []
        for i in range(0, len(level), 2):
            L = level[i]
            R = level[i + 1] if i + 1 < len(level) else level[i]
            nxt.append(hashlib.sha256(b"\x01" + L + R).digest())
        level = nxt
    return "0x" + level[0].hex()


# ---- self-test against inaugural #1063 -----------------------------------
INAUGURAL = [
    {"inscriptionId": i, "finalHash": h, "order": o} for (i, h, o) in [
        (1052, "0x41122e4a0f7316f5e5f7ffc653fc280e80b7dd6ee893e6ca000f5af191f78f54", 1),
        (1053, "0x0693716f4a82dcc58300d4812b542fbe2ecaf4fec013551204476f0c6290d4ea", 2),
        (1054, "0x8b2e4213885a0039e81ed77c9fc48d836586960aab4eaf9a77de4abdbb12a975", 3),
        (1055, "0x2141c3bf6c3feb7772a7949eb538d966c23bf158c801a90b7d8c381a71fb5cb1", 4),
        (1056, "0x8f3790be8ae5ebc3323efd72969b6a5e9d4bdf574519e5ab97590ad673f5c52c", 5),
        (1057, "0x0c5077fa9992424a2fa9d70c222536b16d7d0d011d82f3ccf45d70a634c83d77", 6),
        (1058, "0x3a715b4b9d8a94ac8b6b95feb6f0fb9e424b8f396a81783677c12770b523d965", 7),
        (1059, "0xdd01dd60778a674b0d270df03b6c54a47930ea89df070b988560e665f78d3ab0", 8),
        (1060, "0x37421d193d118529a97a73262d9ea366b385f8b4bd66e8a1d6e7822688ebc12d", 9),
        (1061, "0xad74a614ca3fd8463a41198ed7dc3987fca1cfb33528efb6d3ef6d24ed5769f9", 10),
        (1062, "0xa04b3fb8cba430abe34d4fc44f9dac40e5c04d2b4923a4104eb71d2969c82363", 11),
    ]
]
INAUGURAL_ROOT = "0x5596972090126d22bcbb46fdbbb02cb37d5fd1bb667b9177a90da95144e96fd6"

# ---- new corpus member set ------------------------------------------------
# inscriptionId for the 4 re-inscribed/new docs is unknown until mint.
# Replace the placeholder ints below with the real ids, then re-run.
NEW_IDS = {
    "XIP-001": 1065,   # placeholder (predicted) — v1.1.0, supersedes #1053
    "XIP-010": 1066,   # placeholder — new
    "XIP-011": 1067,   # placeholder — new
    "README":  1068,   # placeholder — refreshed (drifted from #1062)
}
# (label, filename, fixed-id-or-None, order)
SPEC = [
    ("XIP-000", "XIP-000-XIP-Process.md",                 1052, 1),
    ("XIP-001", "XIP-001-Manifest-Standard.md",           None, 2),
    ("XIP-002", "XIP-002-Identity-Standard.md",           1054, 3),
    ("XIP-003", "XIP-003-Organisational-Manifests.md",    1055, 4),
    ("XIP-004", "XIP-004-Provenance-Graph-Standard.md",   1056, 5),
    ("XIP-005", "XIP-005-Namespace-Standard.md",          1057, 6),
    ("XIP-006", "XIP-006-Indexer-Resolver-Conformance.md",1058, 7),
    ("XIP-007", "XIP-007-Marketplace-Standard.md",        1059, 8),
    ("XIP-008", "XIP-008-Software-Package-Standard.md",   1060, 9),
    ("XIP-009", "XIP-009-Manifest-Authority-Registry.md", 1061, 10),
    ("XIP-010", "XIP-010-Dynamic-State-Resolver-Profile.md", None, 11),
    ("XIP-011", "XIP-011-Agent-Inscription-Standard.md",  None, 12),
    ("README",  "README.md",                              None, 13),
]


def build_members():
    members = []
    for label, fn, fixed_id, order in SPEC:
        iid = fixed_id if fixed_id is not None else NEW_IDS[label]
        members.append({
            "label": label,
            "inscriptionId": iid,
            "finalHash": final_hash(os.path.join(XIPDIR, fn)),
            "order": order,
            "predicted_id": fixed_id is None,
        })
    return members


def main():
    st = merkle_root(INAUGURAL)
    print("self-test inaugural root:", "OK" if st == INAUGURAL_ROOT else "FAIL")
    if st != INAUGURAL_ROOT:
        sys.exit("self-test failed; constructions drifted")

    members = build_members()
    items = [{"finalHash": m["finalHash"], "inscriptionId": m["inscriptionId"], "order": m["order"]}
             for m in members]
    root = merkle_root(members)

    manifest = {
        "standard": "xip-001",
        "specVersion": "1.0.0",
        "type": "collection",
        "name": "Xtrata Improvement Proposals — Corpus",
        "defaultContract": CORE,
        "description": ("The Xtrata XIP corpus: XIP-000 through XIP-011 and the corpus "
                        "README, inscribed on Stacks (xtrata-v3-2-3). XIP-000 is the "
                        "corpus root; each document carries its Requires as on-chain "
                        "dependency edges. Supersedes the inaugural corpus manifest (#1063)."),
        "membershipSemantics": "current",
        "supersedes": f"{CORE}:1063",
        "integrity": {"algo": "xtrata-merkle-v1", "root": root},
        "mapping": {"type": "explicit", "items": items},
    }

    out = os.path.join(XIPDIR, "corpus-manifest-v1.1.0.draft.json")
    with open(out, "w") as fh:
        json.dump(manifest, fh, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
        fh.write("\n")

    print(f"\nwrote {out}")
    print("integrity.root:", root)
    anyp = any(m["predicted_id"] for m in members)
    print("\nmember set:")
    for m in members:
        flag = "  (PREDICTED id)" if m["predicted_id"] else ""
        print(f"  {m['label']:8} #{m['inscriptionId']}  {m['finalHash']}{flag}")
    if anyp:
        print("\nNOTE: ids marked PREDICTED are placeholders. The integrity.root and the "
              "manifest bytes are only final once the real mint ids are filled into NEW_IDS.")


if __name__ == "__main__":
    main()
