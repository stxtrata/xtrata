#!/usr/bin/env python3
# Smart Image Compressor - Browser Edition v3
# No-Tk local browser app with drag-and-drop, canvas preview, comparison preview and zip export.

from __future__ import annotations

import base64
import io
import json
import re
import socket
import threading
import traceback
import webbrowser
import zipfile
from dataclasses import dataclass
from email import policy
from email.parser import BytesParser
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import PurePosixPath
from typing import Optional
from urllib.parse import quote

try:
    from PIL import Image, ImageOps
except ImportError:
    raise SystemExit("Pillow is required. Install it with:\n\npython3 -m pip install pillow\n")

try:
    import pillow_heif  # type: ignore
    pillow_heif.register_heif_opener()
except Exception:
    pass


APP_NAME = "Smart Image Compressor"
MAX_UPLOAD_BYTES = 2 * 1024 * 1024 * 1024


@dataclass
class Settings:
    mode: str = "balanced"
    output_format: str = "auto"
    max_long_edge: int = 0
    preserve_metadata: bool = False
    skip_larger: bool = True
    jpeg_background: tuple[int, int, int] = (255, 255, 255)


@dataclass
class EncodedImage:
    filename: str
    data: bytes
    fmt: str
    mime: str
    width: int
    height: int


def human_size(num: int) -> str:
    units = ["B", "KB", "MB", "GB"]
    n = float(num)
    for unit in units:
        if n < 1024 or unit == units[-1]:
            return f"{n:.1f} {unit}" if unit != "B" else f"{int(n)} B"
        n /= 1024
    return f"{num} B"


def safe_path(path: str, fallback: str = "image") -> str:
    path = path.replace("\\", "/")
    parts = []
    for part in PurePosixPath(path).parts:
        if part in ("", ".", "..", "/"):
            continue
        clean = re.sub(r"[^A-Za-z0-9._ -]+", "_", part).strip(" .")
        if clean:
            parts.append(clean)
    return "/".join(parts or [fallback])


def has_alpha(img: Image.Image) -> bool:
    if img.mode in ("RGBA", "LA"):
        alpha = img.getchannel("A")
        return alpha.getextrema()[0] < 255
    if img.mode == "P" and "transparency" in img.info:
        return True
    return False


def looks_graphic(img: Image.Image) -> bool:
    try:
        small = img.copy()
        small.thumbnail((128, 128), Image.Resampling.LANCZOS)
        colours = small.convert("RGB").getcolors(maxcolors=4096)
        return colours is not None and len(colours) <= 512
    except Exception:
        return False


def flatten_alpha(img: Image.Image, background: tuple[int, int, int]) -> Image.Image:
    if not has_alpha(img):
        return img.convert("RGB")
    rgba = img.convert("RGBA")
    bg = Image.new("RGBA", rgba.size, background + (255,))
    bg.alpha_composite(rgba)
    return bg.convert("RGB")


def resize_if_needed(img: Image.Image, max_long_edge: int) -> Image.Image:
    if max_long_edge <= 0:
        return img
    w, h = img.size
    current = max(w, h)
    if current <= max_long_edge:
        return img
    scale = max_long_edge / current
    return img.resize((max(1, round(w * scale)), max(1, round(h * scale))), Image.Resampling.LANCZOS)


def encode_profile(mode: str) -> dict[str, int | bool]:
    if mode == "high":
        return {"jpeg_quality": 90, "webp_quality": 90, "png_quantize": False}
    if mode == "small":
        return {"jpeg_quality": 72, "webp_quality": 72, "png_quantize": True}
    return {"jpeg_quality": 82, "webp_quality": 82, "png_quantize": False}


def extension_for_format(fmt: str) -> str:
    return {"JPEG": ".jpg", "PNG": ".png", "WEBP": ".webp"}[fmt]


def mime_for_format(fmt: str) -> str:
    return {"JPEG": "image/jpeg", "PNG": "image/png", "WEBP": "image/webp"}[fmt]


def candidate_formats(img: Image.Image, source_format: str, requested: str) -> list[str]:
    source_format = (source_format or "").upper()
    requested = requested.lower()

    if requested == "same":
        if source_format in {"JPEG", "JPG"}:
            return ["JPEG"]
        if source_format == "PNG":
            return ["PNG"]
        if source_format == "WEBP":
            return ["WEBP"]
        return ["WEBP"]

    if requested == "jpeg":
        return ["JPEG"]
    if requested == "png":
        return ["PNG"]
    if requested == "webp":
        return ["WEBP"]

    if has_alpha(img):
        return ["WEBP", "PNG"]
    if looks_graphic(img):
        return ["WEBP", "PNG", "JPEG"]
    return ["WEBP", "JPEG"]


def save_jpeg_to_bytes(img: Image.Image, settings: Settings, profile: dict) -> bytes:
    rgb = flatten_alpha(img, settings.jpeg_background)
    out = io.BytesIO()
    kwargs = {
        "format": "JPEG",
        "quality": int(profile["jpeg_quality"]),
        "optimize": True,
        "progressive": True,
        "subsampling": 0 if settings.mode == "high" else 2,
    }
    if settings.preserve_metadata:
        if "icc_profile" in img.info:
            kwargs["icc_profile"] = img.info.get("icc_profile")
        if "exif" in img.info:
            kwargs["exif"] = img.info.get("exif")
    rgb.save(out, **kwargs)
    return out.getvalue()


def save_webp_to_bytes(img: Image.Image, settings: Settings, profile: dict) -> bytes:
    webp_img = img.convert("RGBA") if has_alpha(img) else img.convert("RGB")
    out = io.BytesIO()
    kwargs = {"format": "WEBP", "quality": int(profile["webp_quality"]), "method": 6}
    if has_alpha(webp_img) or looks_graphic(webp_img):
        if settings.mode in ("high", "balanced"):
            kwargs["lossless"] = True
            kwargs.pop("quality", None)
        else:
            kwargs["exact"] = True
    if settings.preserve_metadata and "icc_profile" in img.info:
        kwargs["icc_profile"] = img.info.get("icc_profile")
    webp_img.save(out, **kwargs)
    return out.getvalue()


def save_png_to_bytes(img: Image.Image, settings: Settings, profile: dict) -> bytes:
    png = img.convert("RGBA") if has_alpha(img) else img.convert("RGB")
    if profile.get("png_quantize") and not has_alpha(img):
        try:
            png = png.quantize(colors=256, method=Image.Quantize.MEDIANCUT)
        except Exception:
            pass
    out = io.BytesIO()
    kwargs = {"format": "PNG", "optimize": True, "compress_level": 9}
    if settings.preserve_metadata and "icc_profile" in img.info:
        kwargs["icc_profile"] = img.info.get("icc_profile")
    png.save(out, **kwargs)
    return out.getvalue()


def encode_image(filename: str, raw: bytes, settings: Settings, respect_skip: bool = True) -> tuple[Optional[EncodedImage], dict]:
    original_bytes = len(raw)
    report = {
        "source": filename,
        "status": "error",
        "original_bytes": original_bytes,
        "original_human": human_size(original_bytes),
        "compressed_bytes": 0,
        "compressed_human": "0 B",
        "saved_bytes": 0,
        "saved_human": "0 B",
        "saved_percent": 0,
        "output": None,
        "detail": "",
        "would_skip": False,
        "original_width": None,
        "original_height": None,
        "compressed_width": None,
        "compressed_height": None,
        "format": None,
        "mime": None,
    }

    try:
        with Image.open(io.BytesIO(raw)) as opened:
            source_format = opened.format or PurePosixPath(filename).suffix.lstrip(".").upper()
            img = ImageOps.exif_transpose(opened)
            img.load()

            original_w, original_h = img.size
            report["original_width"] = original_w
            report["original_height"] = original_h

            img = resize_if_needed(img, settings.max_long_edge)
            compressed_w, compressed_h = img.size
            profile = encode_profile(settings.mode)
            candidates = candidate_formats(img, source_format, settings.output_format)

            best: Optional[EncodedImage] = None

            for fmt in candidates:
                try:
                    if fmt == "JPEG":
                        data = save_jpeg_to_bytes(img, settings, profile)
                    elif fmt == "PNG":
                        data = save_png_to_bytes(img, settings, profile)
                    elif fmt == "WEBP":
                        data = save_webp_to_bytes(img, settings, profile)
                    else:
                        continue
                except Exception:
                    continue

                base = str(PurePosixPath(safe_path(filename)).with_suffix(""))
                out_name = f"{base}_compressed{extension_for_format(fmt)}"
                encoded = EncodedImage(out_name, data, fmt, mime_for_format(fmt), compressed_w, compressed_h)

                if best is None or len(encoded.data) < len(best.data):
                    best = encoded

            if best is None:
                report["detail"] = "No supported encoder could save this image."
                return None, report

            best_size = len(best.data)
            saved = original_bytes - best_size
            pct = (saved / original_bytes * 100) if original_bytes else 0
            would_skip = settings.skip_larger and best_size >= original_bytes

            report.update({
                "compressed_bytes": best_size,
                "compressed_human": human_size(best_size),
                "saved_bytes": saved,
                "saved_human": human_size(abs(saved)),
                "saved_percent": pct,
                "output": best.filename,
                "compressed_width": best.width,
                "compressed_height": best.height,
                "format": best.fmt,
                "mime": best.mime,
                "would_skip": would_skip,
            })

            if would_skip and respect_skip:
                report["status"] = "skipped"
                report["detail"] = "Best compressed result was larger than, or equal to, the original."
                return None, report

            report["status"] = "ok" if not would_skip else "preview_only"
            if saved >= 0:
                report["detail"] = f"{source_format} to {best.fmt}. Saved {human_size(saved)} ({pct:.1f}%)."
            else:
                report["detail"] = f"{source_format} to {best.fmt}. Larger by {human_size(abs(saved))} ({abs(pct):.1f}%)."

            return best, report

    except Exception as exc:
        report["detail"] = f"{type(exc).__name__}: {exc}"
        return None, report


def parse_multipart(headers, body: bytes) -> tuple[dict[str, list[str]], list[dict]]:
    content_type = headers.get("Content-Type", "")
    fake = (
        f"Content-Type: {content_type}\r\n"
        "MIME-Version: 1.0\r\n\r\n"
    ).encode("utf-8") + body

    msg = BytesParser(policy=policy.default).parsebytes(fake)
    fields: dict[str, list[str]] = {}
    files: list[dict] = []

    if not msg.is_multipart():
        return fields, files

    for part in msg.iter_parts():
        disposition = part.get("Content-Disposition", "")
        if "form-data" not in disposition:
            continue

        name = part.get_param("name", header="content-disposition")
        filename = part.get_filename()
        payload = part.get_payload(decode=True) or b""

        if filename:
            files.append({
                "field": name or "files",
                "filename": filename,
                "data": payload,
                "content_type": part.get_content_type(),
            })
        elif name:
            fields.setdefault(name, []).append(payload.decode("utf-8", errors="replace"))

    return fields, files


def field(fields: dict[str, list[str]], name: str, default: str = "") -> str:
    values = fields.get(name)
    return values[0] if values else default


def fields_list(fields: dict[str, list[str]], name: str) -> list[str]:
    return fields.get(name, [])


def parse_int(value: str, default: int) -> int:
    try:
        return max(0, int(value))
    except Exception:
        return default


def settings_from_fields(fields: dict[str, list[str]]) -> Settings:
    return Settings(
        mode=field(fields, "mode", "balanced"),
        output_format=field(fields, "format", "auto"),
        max_long_edge=parse_int(field(fields, "max_long_edge", "0"), 0),
        preserve_metadata=field(fields, "preserve_metadata", "0") == "1",
        skip_larger=field(fields, "skip_larger", "1") == "1",
    )


def unique_zip_name(name: str, used: set[str]) -> str:
    if name not in used:
        return name
    p = PurePosixPath(name)
    stem = str(p.with_suffix(""))
    suffix = p.suffix
    counter = 2
    while True:
        candidate = f"{stem}_{counter}{suffix}"
        if candidate not in used:
            return candidate
        counter += 1


def make_report_text(reports: list[dict]) -> str:
    ok = [r for r in reports if r["status"] == "ok"]
    skipped = [r for r in reports if r["status"] == "skipped"]
    errors = [r for r in reports if r["status"] == "error"]

    total_original = sum(int(r["original_bytes"]) for r in ok)
    total_compressed = sum(int(r["compressed_bytes"]) for r in ok)
    saved = total_original - total_compressed
    pct = (saved / total_original * 100) if total_original else 0

    lines = [
        "Smart Image Compressor Report",
        "=============================",
        "",
        f"Compressed: {len(ok)}",
        f"Skipped:    {len(skipped)}",
        f"Errors:     {len(errors)}",
        f"Original compressed-set total: {human_size(total_original)}",
        f"Output compressed-set total:   {human_size(total_compressed)}",
        f"Saved: {human_size(saved)} ({pct:.1f}%)",
        "",
        "Details",
        "-------",
    ]

    for r in reports:
        if r["status"] == "ok":
            lines.append(
                f"OK: {r['source']} -> {r['output']} | "
                f"{r['original_human']} to {r['compressed_human']} | "
                f"{r['original_width']}x{r['original_height']} to "
                f"{r['compressed_width']}x{r['compressed_height']} | {r['detail']}"
            )
        elif r["status"] == "skipped":
            lines.append(
                f"SKIPPED: {r['source']} | original {r['original_human']}, "
                f"best {r['compressed_human']} | {r['detail']}"
            )
        else:
            lines.append(f"ERROR: {r['source']} | {r['detail']}")

    return "\n".join(lines) + "\n"


INDEX_HTML = r'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Smart Image Compressor</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
:root {
  --bg: #101114;
  --panel: #181a20;
  --panel2: #20242d;
  --text: #f5f7fb;
  --muted: #aab0c0;
  --line: #343946;
  --accent: #74f0b4;
  --accent2: #81a7ff;
  --danger: #ff7882;
  --warn: #ffd479;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: radial-gradient(circle at top, #1c2230, var(--bg));
  color: var(--text);
}
main { max-width: 1380px; margin: 0 auto; padding: 24px; }
h1 { margin: 0 0 8px; font-size: 34px; letter-spacing: -0.03em; }
p { color: var(--muted); line-height: 1.45; }
.top-grid { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 18px; align-items: stretch; }
.card {
  background: rgba(24,26,32,0.9);
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 16px;
  box-shadow: 0 16px 40px rgba(0,0,0,0.22);
}
.drop {
  min-height: 210px;
  border: 2px dashed #4b5365;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 22px;
  background: rgba(255,255,255,0.03);
  transition: 0.15s ease;
}
.drop.drag { border-color: var(--accent); background: rgba(116,240,180,0.09); transform: scale(1.005); }
.drop strong { display: block; font-size: 22px; margin-bottom: 8px; }
.drop span { color: var(--muted); }
.controls { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 14px; }
button, label.button {
  appearance: none;
  border: 1px solid #4b5365;
  border-radius: 12px;
  padding: 10px 14px;
  background: var(--panel2);
  color: var(--text);
  cursor: pointer;
  font-weight: 650;
}
button.primary { border-color: var(--accent); background: linear-gradient(135deg, #22aa72, #3881ff); }
button:disabled { opacity: 0.55; cursor: not-allowed; }
input[type=file] { display: none; }
.settings-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 12px; }
.setting { display: grid; gap: 7px; }
.setting label { color: var(--muted); font-size: 13px; }
select, input[type=number] {
  width: 100%;
  border: 1px solid #4b5365;
  background: #11131a;
  color: var(--text);
  border-radius: 10px;
  padding: 9px 10px;
}
.check { display: flex; align-items: center; gap: 8px; color: var(--muted); margin: 10px 0; }
.summary { color: var(--muted); margin-top: 10px; }
.progress-wrap {
  height: 11px; border-radius: 999px; background: #0b0d12;
  overflow:hidden; border:1px solid var(--line); margin-top: 14px;
}
.progress { height: 100%; width: 0%; background: linear-gradient(90deg, var(--accent), var(--accent2)); transition: width 0.2s; }
.preview-grid { display: grid; grid-template-columns: 220px 1fr; gap: 18px; margin-top: 18px; }
.file-list { max-height: 620px; overflow: auto; border: 1px solid var(--line); border-radius: 14px; background: #0e1016; }
.file-item {
  width: 100%; display: grid; grid-template-columns: 1fr auto; text-align: left; gap: 10px;
  padding: 9px 10px; border: 0; border-bottom: 1px solid rgba(255,255,255,0.06);
  background: transparent; color: var(--muted); border-radius: 0; font-weight: 500;
}
.file-item.active { background: rgba(116,240,180,0.10); color: var(--text); }
.compare-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.canvas-card h2 { font-size: 18px; margin: 0 0 10px; }
.canvas-wrap {
  background:
    linear-gradient(45deg, #222 25%, transparent 25%),
    linear-gradient(-45deg, #222 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #222 75%),
    linear-gradient(-45deg, transparent 75%, #222 75%);
  background-size: 22px 22px;
  background-position: 0 0, 0 11px, 11px -11px, -11px 0px;
  background-color: #15171f;
  border: 1px solid var(--line);
  border-radius: 14px;
  min-height: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
canvas { width: 100%; max-height: 620px; display: block; }
.meta { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 8px; margin-top: 10px; }
.pill {
  background: #10131a; border: 1px solid var(--line); border-radius: 999px;
  padding: 7px 9px; color: var(--muted); font-size: 13px;
}
.pill strong { color: var(--text); }
.good { color: var(--accent); }
.bad { color: var(--danger); }
.warn { color: var(--warn); }
.log {
  margin-top: 18px; background: #0b0d12; border: 1px solid var(--line);
  border-radius: 14px; padding: 14px; min-height: 120px; max-height: 220px; overflow: auto;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
  font-size: 13px; white-space: pre-wrap; color: #d7dcef;
}
@media (max-width: 1050px) {
  .top-grid, .preview-grid, .compare-grid { grid-template-columns: 1fr; }
  main { padding: 16px; }
}
</style>
</head>
<body>
<main>
  <h1>Smart Image Compressor</h1>
  <p>Drop images or folders, select any image in the list, and compare the original against the compressed version before downloading the final zip.</p>

  <div class="top-grid">
    <section class="card">
      <div id="drop" class="drop">
        <div>
          <strong>Drop images or folders here</strong>
          <span>PNG, JPEG, WebP, TIFF, GIF, BMP, AVIF/HEIC if your Pillow install supports them.</span>
        </div>
      </div>
      <div class="controls">
        <label class="button" for="fileInput">Add images</label>
        <input id="fileInput" type="file" multiple accept="image/*,.heic,.heif,.avif,.tif,.tiff,.webp,.png,.jpg,.jpeg,.gif,.bmp">
        <label class="button" for="folderInput">Add folder</label>
        <input id="folderInput" type="file" multiple webkitdirectory directory>
        <button id="clearBtn">Clear</button>
        <button id="refreshBtn">Refresh comparison preview</button>
        <button id="compressBtn" class="primary">Compress and download zip</button>
      </div>
      <div class="summary" id="summary">No images selected.</div>
      <div class="progress-wrap"><div class="progress" id="progress"></div></div>
    </section>

    <aside class="card">
      <div class="settings-grid">
        <div class="setting">
          <label for="mode">Balance</label>
          <select id="mode">
            <option value="high">High Quality</option>
            <option value="balanced" selected>Balanced</option>
            <option value="small">Smallest</option>
          </select>
        </div>

        <div class="setting">
          <label for="format">Output format</label>
          <select id="format">
            <option value="auto" selected>Auto best</option>
            <option value="same">Same as source</option>
            <option value="jpeg">JPEG</option>
            <option value="png">PNG</option>
            <option value="webp">WebP</option>
          </select>
        </div>

        <div class="setting">
          <label for="edge">Max long edge</label>
          <select id="edge">
            <option value="0" selected>Original size</option>
            <option value="4096">4096 px</option>
            <option value="2560">2560 px</option>
            <option value="2048">2048 px</option>
            <option value="1600">1600 px</option>
            <option value="1200">1200 px</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div class="setting" id="customEdgeWrap" style="display:none;">
          <label for="customEdge">Custom max long edge, px</label>
          <input id="customEdge" type="number" min="1" value="2048">
        </div>
      </div>

      <label class="check"><input id="preserve" type="checkbox"> Preserve metadata / ICC where possible</label>
      <label class="check"><input id="skip" type="checkbox" checked> Skip if output is larger than original</label>
      <p><strong>Tip:</strong> Balanced + Auto best is the normal sweet spot. For web art, try a max long edge of 2048px or 1600px.</p>
    </aside>
  </div>

  <section class="preview-grid">
    <aside class="card">
      <h2 style="margin-top:0;">Images</h2>
      <div class="file-list" id="fileList"></div>
    </aside>

    <section class="compare-grid">
      <div class="card canvas-card">
        <h2>Original</h2>
        <div class="canvas-wrap"><canvas id="originalCanvas"></canvas></div>
        <div class="meta" id="originalMeta"></div>
      </div>
      <div class="card canvas-card">
        <h2>Compressed preview</h2>
        <div class="canvas-wrap"><canvas id="compressedCanvas"></canvas></div>
        <div class="meta" id="compressedMeta"></div>
      </div>
    </section>
  </section>

  <div class="log" id="log">Ready.</div>
</main>

<script>
const files = [];
const seen = new Set();
let selectedIndex = -1;
let previewTimer = null;
let originalImageUrl = null;
let compressedImageUrl = null;

const drop = document.getElementById('drop');
const fileInput = document.getElementById('fileInput');
const folderInput = document.getElementById('folderInput');
const clearBtn = document.getElementById('clearBtn');
const refreshBtn = document.getElementById('refreshBtn');
const compressBtn = document.getElementById('compressBtn');
const summary = document.getElementById('summary');
const fileList = document.getElementById('fileList');
const logEl = document.getElementById('log');
const progress = document.getElementById('progress');
const edge = document.getElementById('edge');
const customEdgeWrap = document.getElementById('customEdgeWrap');
const originalCanvas = document.getElementById('originalCanvas');
const compressedCanvas = document.getElementById('compressedCanvas');
const originalMeta = document.getElementById('originalMeta');
const compressedMeta = document.getElementById('compressedMeta');

function log(msg) {
  logEl.textContent += "\n" + msg;
  logEl.scrollTop = logEl.scrollHeight;
}

function formatBytes(bytes) {
  const units = ['B','KB','MB','GB'];
  let n = bytes;
  for (let i=0; i<units.length; i++) {
    if (n < 1024 || i === units.length - 1) {
      return units[i] === 'B' ? `${n} B` : `${n.toFixed(1)} ${units[i]}`;
    }
    n /= 1024;
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}

function fileKey(file, path) {
  return `${path || file.webkitRelativePath || file.name}|${file.size}|${file.lastModified}`;
}

function addFile(file, path) {
  if (!file || file.size === 0) return;
  const rel = path || file.webkitRelativePath || file.name;
  const key = fileKey(file, rel);
  if (seen.has(key)) return;
  seen.add(key);
  files.push({file, path: rel});
  if (selectedIndex < 0) selectedIndex = 0;
}

function addFileList(list) {
  for (const file of list) addFile(file);
  render();
  loadSelectedPreviewDebounced(60);
}

async function traverseEntry(entry, pathPrefix='') {
  return new Promise((resolve) => {
    if (entry.isFile) {
      entry.file(file => {
        addFile(file, pathPrefix + file.name);
        resolve();
      }, () => resolve());
    } else if (entry.isDirectory) {
      const reader = entry.createReader();
      const readAll = async () => {
        reader.readEntries(async entries => {
          if (!entries.length) return resolve();
          for (const child of entries) await traverseEntry(child, pathPrefix + entry.name + '/');
          readAll();
        }, () => resolve());
      };
      readAll();
    } else {
      resolve();
    }
  });
}

function render() {
  const total = files.reduce((a, item) => a + item.file.size, 0);
  summary.textContent = files.length
    ? `${files.length} image(s) selected, ${formatBytes(total)} total.`
    : 'No images selected.';

  fileList.innerHTML = files.map((item, idx) => `
    <button class="file-item ${idx === selectedIndex ? 'active' : ''}" data-index="${idx}">
      <span>${escapeHtml(item.path)}</span>
      <span>${formatBytes(item.file.size)}</span>
    </button>
  `).join('') || '<div style="padding:12px;color:#aab0c0;">No images yet.</div>';

  for (const btn of fileList.querySelectorAll('.file-item')) {
    btn.addEventListener('click', () => {
      selectedIndex = Number(btn.dataset.index);
      render();
      loadSelectedPreviewDebounced(10);
    });
  }
}

function metaPill(label, value, extraClass='') {
  return `<div class="pill ${extraClass}"><strong>${label}:</strong> ${escapeHtml(value)}</div>`;
}

function clearCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  canvas.width = 900;
  canvas.height = 520;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawImageToCanvas(canvas, img) {
  const wrap = canvas.parentElement;
  const maxCssWidth = Math.max(320, wrap.clientWidth - 4);
  const maxCssHeight = 620;
  const ratio = Math.min(maxCssWidth / img.naturalWidth, maxCssHeight / img.naturalHeight, 1);
  const cssW = Math.max(1, Math.round(img.naturalWidth * ratio));
  const cssH = Math.max(1, Math.round(img.naturalHeight * ratio));
  const dpr = window.devicePixelRatio || 1;

  canvas.style.width = `${cssW}px`;
  canvas.style.height = `${cssH}px`;
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);

  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, cssW, cssH);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, cssW, cssH);
}

function loadImageFromUrl(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not decode image preview in the browser.'));
    img.src = url;
  });
}

async function drawOriginal(item) {
  if (originalImageUrl) URL.revokeObjectURL(originalImageUrl);
  originalImageUrl = URL.createObjectURL(item.file);
  const img = await loadImageFromUrl(originalImageUrl);
  drawImageToCanvas(originalCanvas, img);
  originalMeta.innerHTML =
    metaPill('File', item.path) +
    metaPill('Size', formatBytes(item.file.size)) +
    metaPill('Resolution', `${img.naturalWidth} × ${img.naturalHeight}`) +
    metaPill('Type', item.file.type || 'unknown');
}

function settingsFormData(includeFile=true) {
  const form = new FormData();
  if (includeFile && selectedIndex >= 0) {
    const item = files[selectedIndex];
    form.append('files', item.file, item.file.name);
    form.append('paths', item.path || item.file.name);
  }
  const edgeValue = document.getElementById('edge').value;
  const customEdge = document.getElementById('customEdge').value;
  form.append('mode', document.getElementById('mode').value);
  form.append('format', document.getElementById('format').value);
  form.append('max_long_edge', edgeValue === 'custom' ? customEdge : edgeValue);
  form.append('preserve_metadata', document.getElementById('preserve').checked ? '1' : '0');
  form.append('skip_larger', document.getElementById('skip').checked ? '1' : '0');
  return form;
}

function loadSelectedPreviewDebounced(delay=250) {
  clearTimeout(previewTimer);
  previewTimer = setTimeout(loadSelectedPreview, delay);
}

async function loadSelectedPreview() {
  if (selectedIndex < 0 || !files[selectedIndex]) {
    clearCanvas(originalCanvas);
    clearCanvas(compressedCanvas);
    originalMeta.innerHTML = '';
    compressedMeta.innerHTML = '';
    return;
  }

  const item = files[selectedIndex];
  compressedMeta.innerHTML = metaPill('Status', 'Compressing preview…', 'warn');

  try {
    await drawOriginal(item);
  } catch (err) {
    originalMeta.innerHTML = metaPill('Error', err.message, 'bad');
  }

  try {
    const response = await fetch('/preview', { method: 'POST', body: settingsFormData(true) });
    if (!response.ok) throw new Error(await response.text());
    const result = await response.json();

    if (result.image_data) {
      if (compressedImageUrl) URL.revokeObjectURL(compressedImageUrl);
      const blob = await (await fetch(result.image_data)).blob();
      compressedImageUrl = URL.createObjectURL(blob);
      const img = await loadImageFromUrl(compressedImageUrl);
      drawImageToCanvas(compressedCanvas, img);
    } else {
      clearCanvas(compressedCanvas);
    }

    const r = result.report;
    const pct = Number(r.saved_percent || 0);
    const changeClass = pct >= 0 ? 'good' : 'bad';
    const changeText = pct >= 0
      ? `Saved ${r.saved_human} (${pct.toFixed(1)}%)`
      : `Larger by ${r.saved_human} (${Math.abs(pct).toFixed(1)}%)`;

    const status = r.would_skip
      ? 'Would be skipped because it is not smaller'
      : 'Will be included in zip';

    compressedMeta.innerHTML =
      metaPill('Output', r.output || 'preview') +
      metaPill('Size', r.compressed_human || 'unknown') +
      metaPill('Resolution', `${r.compressed_width || '?'} × ${r.compressed_height || '?'}`) +
      metaPill('Format', r.format || 'unknown') +
      metaPill('Change', changeText, changeClass) +
      metaPill('Status', status, r.would_skip ? 'warn' : 'good');

  } catch (err) {
    clearCanvas(compressedCanvas);
    compressedMeta.innerHTML = metaPill('Error', err.message, 'bad');
    log(`Preview error: ${err.message}`);
  }
}

drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('drag'); });
drop.addEventListener('dragleave', () => drop.classList.remove('drag'));
drop.addEventListener('drop', async e => {
  e.preventDefault();
  drop.classList.remove('drag');

  const items = [...e.dataTransfer.items || []];
  if (items.length && items[0].webkitGetAsEntry) {
    for (const item of items) {
      const entry = item.webkitGetAsEntry();
      if (entry) await traverseEntry(entry);
    }
    render();
    loadSelectedPreviewDebounced(60);
  } else {
    addFileList(e.dataTransfer.files);
  }
});

fileInput.addEventListener('change', e => {
  addFileList(e.target.files);
  fileInput.value = '';
});
folderInput.addEventListener('change', e => {
  addFileList(e.target.files);
  folderInput.value = '';
});
clearBtn.addEventListener('click', () => {
  files.length = 0;
  seen.clear();
  selectedIndex = -1;
  logEl.textContent = 'Ready.';
  progress.style.width = '0%';
  originalMeta.innerHTML = '';
  compressedMeta.innerHTML = '';
  clearCanvas(originalCanvas);
  clearCanvas(compressedCanvas);
  render();
});
refreshBtn.addEventListener('click', () => loadSelectedPreviewDebounced(10));
edge.addEventListener('change', () => {
  customEdgeWrap.style.display = edge.value === 'custom' ? 'block' : 'none';
  loadSelectedPreviewDebounced();
});

for (const id of ['mode','format','customEdge','preserve','skip']) {
  document.getElementById(id).addEventListener('change', () => loadSelectedPreviewDebounced());
}

window.addEventListener('resize', () => loadSelectedPreviewDebounced(150));

compressBtn.addEventListener('click', async () => {
  if (!files.length) {
    log('No images selected.');
    return;
  }

  const form = settingsFormData(false);
  for (const item of files) {
    form.append('files', item.file, item.file.name);
    form.append('paths', item.path || item.file.name);
  }

  compressBtn.disabled = true;
  progress.style.width = '15%';
  log(`Compressing ${files.length} image(s)...`);

  try {
    const response = await fetch('/compress', { method: 'POST', body: form });
    progress.style.width = '80%';

    if (!response.ok) throw new Error(await response.text());

    const statsRaw = response.headers.get('X-Compression-Stats');
    if (statsRaw) {
      const stats = JSON.parse(decodeURIComponent(statsRaw));
      log(`Done. Compressed ${stats.ok}, skipped ${stats.skipped}, errors ${stats.errors}. Saved ${stats.saved_human}.`);
    } else {
      log('Done.');
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    a.href = url;
    a.download = `compressed-images-${stamp}.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    progress.style.width = '100%';
  } catch (err) {
    log(`ERROR: ${err.message}`);
    progress.style.width = '0%';
  } finally {
    compressBtn.disabled = false;
  }
});

clearCanvas(originalCanvas);
clearCanvas(compressedCanvas);
render();
</script>
</body>
</html>
'''


class Handler(BaseHTTPRequestHandler):
    server_version = "SmartImageCompressor/3.0"

    def log_message(self, fmt: str, *args) -> None:
        print("[%s] %s" % (self.log_date_time_string(), fmt % args))

    def send_text(self, status: int, text: str) -> None:
        data = text.encode("utf-8", errors="replace")
        self.send_response(status)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def send_json(self, status: int, data_obj: dict) -> None:
        data = json.dumps(data_obj).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def read_multipart(self) -> tuple[dict[str, list[str]], list[dict]]:
        content_length = int(self.headers.get("Content-Length", "0"))
        if content_length <= 0:
            raise ValueError("No upload received.")
        if content_length > MAX_UPLOAD_BYTES:
            raise ValueError("Upload too large for one batch.")
        body = self.rfile.read(content_length)
        return parse_multipart(self.headers, body)

    def do_GET(self) -> None:
        if self.path not in ("/", "/index.html"):
            return self.send_text(404, "Not found")
        data = INDEX_HTML.encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_POST(self) -> None:
        if self.path == "/preview":
            return self.handle_preview()
        if self.path == "/compress":
            return self.handle_compress()
        return self.send_text(404, "Not found")

    def handle_preview(self) -> None:
        try:
            fields, files = self.read_multipart()
            if not files:
                return self.send_text(400, "No image received.")

            settings = settings_from_fields(fields)
            paths = fields_list(fields, "paths")
            file0 = files[0]
            filename = safe_path(paths[0] if paths else file0["filename"], fallback="preview")

            encoded, report = encode_image(filename, file0["data"], settings, respect_skip=False)

            if encoded is None:
                return self.send_json(200, {"ok": False, "report": report, "image_data": None})

            data_uri = f"data:{encoded.mime};base64,{base64.b64encode(encoded.data).decode('ascii')}"
            return self.send_json(200, {"ok": True, "report": report, "image_data": data_uri})

        except Exception as exc:
            traceback.print_exc()
            return self.send_text(500, f"Preview failed: {type(exc).__name__}: {exc}")

    def handle_compress(self) -> None:
        try:
            fields, files = self.read_multipart()
            settings = settings_from_fields(fields)
            paths = fields_list(fields, "paths")

            reports: list[dict] = []
            zip_buffer = io.BytesIO()

            with zipfile.ZipFile(zip_buffer, "w", compression=zipfile.ZIP_DEFLATED) as z:
                used_names = set()

                for index, item in enumerate(files):
                    if item.get("field") != "files":
                        continue
                    original_name = paths[index] if index < len(paths) and paths[index] else item["filename"]
                    original_name = safe_path(original_name, fallback=f"image_{index + 1}")

                    encoded, report = encode_image(original_name, item["data"], settings, respect_skip=True)
                    reports.append(report)

                    if encoded is not None:
                        arcname = unique_zip_name(safe_path(encoded.filename), used_names)
                        used_names.add(arcname)
                        z.writestr(arcname, encoded.data)

                z.writestr("compression_report.txt", make_report_text(reports))

            zip_data = zip_buffer.getvalue()
            ok = sum(1 for r in reports if r["status"] == "ok")
            skipped = sum(1 for r in reports if r["status"] == "skipped")
            errors = sum(1 for r in reports if r["status"] == "error")
            total_original = sum(int(r["original_bytes"]) for r in reports if r["status"] == "ok")
            total_compressed = sum(int(r["compressed_bytes"]) for r in reports if r["status"] == "ok")
            saved = total_original - total_compressed

            stats = {
                "ok": ok,
                "skipped": skipped,
                "errors": errors,
                "saved_bytes": saved,
                "saved_human": human_size(saved),
            }

            self.send_response(200)
            self.send_header("Content-Type", "application/zip")
            self.send_header("Content-Disposition", 'attachment; filename="compressed-images.zip"')
            self.send_header("Content-Length", str(len(zip_data)))
            self.send_header("X-Compression-Stats", quote(json.dumps(stats)))
            self.end_headers()
            self.wfile.write(zip_data)

        except Exception as exc:
            traceback.print_exc()
            return self.send_text(500, f"Compression failed: {type(exc).__name__}: {exc}")


def find_free_port(start: int = 8765) -> int:
    for port in range(start, start + 100):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            try:
                sock.bind(("127.0.0.1", port))
                return port
            except OSError:
                continue
    raise RuntimeError("Could not find a free local port.")


def main() -> None:
    port = find_free_port()
    server = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    url = f"http://127.0.0.1:{port}/"

    print("")
    print(f"{APP_NAME} v3 running locally:")
    print(url)
    print("")
    print("Drag images/folders into the browser window.")
    print("Select any image to compare original vs compressed preview.")
    print("Press Ctrl+C in this terminal to stop the app.")
    print("")

    threading.Timer(0.8, lambda: webbrowser.open(url)).start()

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
