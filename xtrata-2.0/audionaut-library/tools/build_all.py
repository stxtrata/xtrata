"""Convert every sound in the listening-page packs to FLAC and write audpack/1 containers.

Per sound: FLAC (ffmpeg level 12, exact Rice params, subset-compliant block size),
header rewritten (no padding, MD5 of PCM in STREAMINFO, licence/credit Vorbis comments),
verified lossless by decoding back and comparing with the original PCM.
Container (provisional layout, see report): "AUDP" u8 version u8 flags u16 0 u32 indexLen,
then gzip(JSON index) when flags&1, then concatenated FLAC bytes (offsets relative to payload).
"""
import sys, os, json, base64, hashlib, struct, gzip, time, subprocess, math, traceback
from concurrent.futures import ThreadPoolExecutor
W = "/tmp/claude-0/-home-claude/03395b0b-a17e-5a7a-b43a-f0071c103e00/scratchpad/work"
sys.path.insert(0, W)
from wavtools import parse_wav
import flactools as F

S = "/tmp/claude-0/-home-claude/03395b0b-a17e-5a7a-b43a-f0071c103e00/scratchpad"
OUT = f"{S}/flac_out"
SETS = [("1af94ba0-4008-4817-84ed-f1fbc1071c09", "core"), ("55573848-2a86-4b3b-937e-3b0980acd742", "attribution")]
OPT = ["-compression_level", "12", "-exact_rice_parameters", "1"]
TMP = f"{OUT}/tmp"
for d in (OUT, f"{OUT}/flac", f"{OUT}/packs", TMP):
    os.makedirs(d, exist_ok=True)
sha = lambda b: hashlib.sha256(b).hexdigest()
log = open(f"{OUT}/build.log", "a", buffering=1)
def say(*a):
    m = " ".join(str(x) for x in a); log.write(m + "\n"); print(m, flush=True)


def convert(item):
    key, e = item
    wavb = base64.b64decode(e["audioData"])
    w = parse_wav(wavb)
    problems = []
    if w["fmt"] != (1, 1, 44100, 88200, 2, 16):
        problems.append(f"unexpected fmt {w['fmt']}")
    pcm = w["data"]
    raw = F.ffmpeg_flac(pcm, OPT, TMP)
    fin = F.finalize(raw, pcm, w["info"])
    dec = subprocess.run(F.FF + ["-i", "-", "-f", "s16le", "-"], input=fin, capture_output=True, check=True).stdout
    if dec != pcm:
        problems.append("ffmpeg decode != original PCM")
    return key, e, fin, pcm, sha(wavb), len(wavb), problems


report = {"packs": [], "problems": []}
t_all = time.time()
for setdir, tier in SETS:
    D = f"{S}/artifact-files/{setdir}"
    idx = json.load(open(f"{D}/index.json"))
    wavsha = {s["id"]: s["sha"] for s in idx["sounds"]}
    for pk in idx["packs"]:
        t0 = time.time()
        parts = [json.load(open(f"{D}/{f}")) for f in pk["files"]]
        lic0 = parts[0]["license"]
        lic_same = all(p["license"] == lic0 for p in parts)
        items = [(k, e) for p in parts for k, e in p["entries"].items()]
        os.makedirs(f"{OUT}/flac/{pk['id']}", exist_ok=True)
        with ThreadPoolExecutor(2) as ex:
            results = list(ex.map(convert, items))
        payload = bytearray(); sounds = []; wav_total = 0; seen = set(); pcm_hashes = {}
        for key, e, fin, pcm, wsha, wlen, problems in results:
            if wsha != wavsha[key]:
                problems.append("WAV sha differs from index")
            safe = "".join(c if c.isalnum() or c in "._@-" else "_" for c in key)
            assert safe not in seen, safe
            seen.add(safe)
            open(f"{OUT}/flac/{pk['id']}/{safe}.flac", "wb").write(fin)
            rec = {"id": key, "filename": e["filename"], "codec": "flac", "offset": len(payload), "length": len(fin),
                   "sha256": sha(fin), "pcmSha256": sha(pcm), "samples": len(pcm) // 2,
                   "wavSha256": wsha, "wavBytes": wlen, "meta": e["metadata"]}
            pcm_hashes[key] = rec["pcmSha256"]
            payload += fin; wav_total += wlen; sounds.append(rec)
            for pr in problems:
                report["problems"].append({"pack": pk["id"], "id": key, "problem": pr})
        index = {"format": "audpack/1", "pack": pk["id"], "tier": pk.get("tier") or tier, "version": parts[0].get("version"),
                 "sampleRate": 44100, "channels": 1, "bitDepth": 16, "codec": "flac",
                 "license": lic0 if lic_same else [p["license"] for p in parts],
                 "credits": pk.get("credits"), "folders": pk.get("folders"), "sounds": sounds}
        ib = json.dumps(index, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
        igz = gzip.compress(ib, 9, mtime=0)
        header = b"AUDP" + bytes([1, 1]) + struct.pack("<HI", 0, len(igz))
        blob = header + igz + bytes(payload)
        open(f"{OUT}/packs/{pk['id']}.audpack", "wb").write(blob)
        manifest = {"pack": pk["id"], "tier": index["tier"], "count": len(sounds),
                    "container": {"file": f"{pk['id']}.audpack", "bytes": len(blob), "sha256": sha(blob),
                                  "chunks16384": math.ceil(len(blob) / 16384), "indexBytes": len(ib), "indexGzipBytes": len(igz),
                                  "payloadBytes": len(payload)}, "wavBytes": wav_total}
        json.dump(manifest, open(f"{OUT}/packs/{pk['id']}.manifest.json", "w"), indent=1)
        json.dump(pcm_hashes, open(f"{OUT}/packs/{pk['id']}.pcmhashes.json", "w"))
        row = dict(manifest["container"], pack=pk["id"], tier=index["tier"], count=len(sounds), wavBytes=wav_total,
                   ratio=len(blob) / wav_total, seconds=round(time.time() - t0, 1))
        report["packs"].append(row)
        say(f"{pk['id']:11s} {tier:11s} n={len(sounds):4d} WAV {wav_total/1e6:7.2f} MB -> pack {len(blob)/1e6:7.2f} MB "
            f"({100*len(blob)/wav_total:4.1f}%) chunks {row['chunks16384']:5d} idx {len(ib)/1e3:.0f}K->{len(igz)/1e3:.0f}K in {row['seconds']}s")
report["totalSeconds"] = round(time.time() - t_all, 1)
json.dump(report, open(f"{OUT}/report.json", "w"), indent=1)
say("DONE", report["totalSeconds"], "s;", len(report["problems"]), "problems")
