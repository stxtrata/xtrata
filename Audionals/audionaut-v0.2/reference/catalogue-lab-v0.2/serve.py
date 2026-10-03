#!/usr/bin/env python3
"""Local Audionaut audition desk. Python 3.9+, standard library only.

Serve files on loopback and fetch only inscription content on ordinals.com plus
one fixed public JSON catalogue. No credentials, uploads, open proxy or writes
to Bitcoin. Retrieved bodies are cached locally; hashes are NOT chain proofs.
"""
from __future__ import annotations
import argparse
import hashlib
import json
import re
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
import webbrowser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CACHE = ROOT / '.audio-cache'
ID_RE = re.compile(r'^[0-9a-f]{64}i[0-9]+$')
PUBLIC = 'https://raw.githubusercontent.com/orange-background/ord.audio/master/scripts/songs.json'
MAX_BYTES = 8 * 1024 * 1024
SEMAPHORE = threading.BoundedSemaphore(2)

class RestrictedRedirect(urllib.request.HTTPRedirectHandler):
    """Reject off-host redirects, local targets and scheme downgrades."""
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        url = urllib.parse.urlsplit(newurl)
        old = urllib.parse.urlsplit(req.full_url)
        if url.scheme != 'https' or url.hostname != old.hostname or url.port not in (None, 443):
            raise ValueError('Upstream redirect to a different host or protocol rejected.')
        return super().redirect_request(req, fp, code, msg, headers, newurl)

OPENER = urllib.request.build_opener(RestrictedRedirect())

def fetch_upstream(url: str):
    """Bounded fetch. A browser retry can resume from the persistent cache."""
    req = urllib.request.Request(url, headers={'User-Agent': 'AudionautCatalogueLab/0.2', 'Accept-Encoding': 'identity'})
    with SEMAPHORE, OPENER.open(req, timeout=15) as response:
        advertised = response.headers.get('Content-Length')
        if advertised and int(advertised) > MAX_BYTES:
            raise ValueError('Upstream body exceeds the 8 MB limit.')
        chunks, total = [], 0
        deadline = time.monotonic() + 20
        while True:
            if time.monotonic() > deadline:
                raise TimeoutError('Upstream body read exceeded its time budget.')
            chunk = response.read(min(65536, MAX_BYTES + 1 - total))
            if not chunk:
                break
            total += len(chunk)
            if total > MAX_BYTES:
                raise ValueError('Upstream body exceeds the 8 MB limit.')
            chunks.append(chunk)
        return b''.join(chunks), response.headers.get('Content-Type', 'application/octet-stream')

def cached_content(inscription_id: str):
    if not ID_RE.fullmatch(inscription_id):
        raise ValueError('Invalid full inscription ID.')
    CACHE.mkdir(exist_ok=True)
    body_path = CACHE / (inscription_id + '.bin')
    meta_path = CACHE / (inscription_id + '.json')
    if body_path.is_file() and meta_path.is_file():
        try:
            body = body_path.read_bytes()
            meta = json.loads(meta_path.read_text())
            if hashlib.sha256(body).hexdigest() == meta['sha256']:
                return body, meta['mime'], 'disk', meta['sha256']
        except (OSError, ValueError, KeyError):
            pass
    url = 'https://ordinals.com/content/' + inscription_id
    body, mime = fetch_upstream(url)
    digest = hashlib.sha256(body).hexdigest()
    meta = {'inscription_id': inscription_id, 'url': url, 'mime': mime,
            'sha256': digest, 'fetched_at_unix': time.time(),
            'verification': 'Hash of gateway response, not a Bitcoin proof.'}
    # Unique temp files avoid cross-request collisions; atomic rename prevents partial cache reads.
    suffix = '.' + str(threading.get_ident()) + '.tmp'
    temporary = body_path.with_name(body_path.name + suffix)
    temporary.write_bytes(body)
    temporary.replace(body_path)
    temporary = meta_path.with_name(meta_path.name + suffix)
    temporary.write_text(json.dumps(meta, indent=2))
    temporary.replace(meta_path)
    return body, mime, 'upstream', digest

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def allowed_host(self):
        try:
            host = urllib.parse.urlsplit('http://' + self.headers.get('Host', '')).hostname
            return host in ('localhost', '127.0.0.1', '::1')
        except ValueError:
            return False

    def respond(self, status, body, mime='application/json', extra=None):
        if not isinstance(body, bytes):
            body = json.dumps(body).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', mime)
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Cache-Control', 'no-store')
        self.send_header('X-Content-Type-Options', 'nosniff')
        for key, value in (extra or {}).items():
            self.send_header(key, str(value))
        self.end_headers()
        if self.command != 'HEAD':
            self.wfile.write(body)

    def do_GET(self):
        if not self.allowed_host():
            self.respond(421, {'error': 'This server accepts localhost requests only.'})
            return
        path = urllib.parse.urlsplit(self.path).path
        if path.startswith('/api/'):
            origin = self.headers.get('Origin')
            if origin and origin != 'http://' + self.headers.get('Host'):
                self.respond(403, {'error': 'Cross-origin API requests are disabled.'})
                return
            try:
                if path == '/api/health':
                    count = len(list(CACHE.glob('*.bin'))) if CACHE.is_dir() else 0
                    self.respond(200, {'service': 'audionaut-catalogue-local', 'version': '0.2.0', 'cached_sources': count})
                elif path == '/api/public-catalogue':
                    body, _ = fetch_upstream(PUBLIC)
                    if not isinstance(json.loads(body), list):
                        raise ValueError('Public catalogue did not contain a JSON array.')
                    self.respond(200, body, 'application/json')
                elif path.startswith('/api/content/'):
                    identity = path[len('/api/content/'):]
                    if not ID_RE.fullmatch(identity):
                        self.respond(400, {'error': 'Expected a full inscription ID, not a URL or inscription number.'})
                        return
                    body, original_mime, cache_state, digest = cached_content(identity)
                    mime = original_mime if original_mime.startswith(('audio/', 'video/')) else 'application/octet-stream'
                    self.respond(200, body, mime, {'X-Audionaut-Original-Type': original_mime, 'X-Source-SHA256': digest, 'X-Audionaut-Cache': cache_state})
                else:
                    self.respond(404, {'error': 'Unknown local API route.'})
            except (BrokenPipeError, ConnectionResetError):
                pass
            except (urllib.error.URLError, OSError, ValueError, TimeoutError) as exc:
                self.respond(502, {'error': str(exc), 'note': 'Source not retrieved. No audio classification or measurement inferred.'})
            return
        resolved = Path(self.translate_path(path)).resolve()
        if ROOT not in resolved.parents and resolved != ROOT:
            self.respond(403, {'error': 'Path outside catalogue folder.'})
            return
        if any(part.startswith('.') for part in resolved.relative_to(ROOT).parts):
            self.respond(403, {'error': 'Private cache files are not browsable.'})
            return
        if path == '/':
            self.path = '/Audionaut_Catalogue_Lab.html'
        super().do_GET()

    def do_HEAD(self):
        # Never bypass the GET path/Host checks through the inherited handler.
        if not self.allowed_host():
            self.respond(421, {'error': 'This server accepts localhost requests only.'})
        else:
            self.respond(405, {'error': 'Use GET for this local service.'})

    def do_POST(self):
        self.respond(405, {'error': 'This server has no upload, transaction or remote write routes.'})

    def log_message(self, fmt, *args):
        print('[catalogue] ' + fmt % args)

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('port', type=int, nargs='?', default=8765)
    parser.add_argument('--no-browser', action='store_true')
    args = parser.parse_args()
    if not 1 <= args.port <= 65535:
        parser.error('Port must be between 1 and 65535.')
    try:
        server = ThreadingHTTPServer(('127.0.0.1', args.port), Handler)
    except OSError as exc:
        raise SystemExit(f'Cannot start server: {exc}. Try another port, e.g. python3 serve.py 8766')
    url = f'http://127.0.0.1:{args.port}/'
    print(f'Open {url}\nAudio is fetched only when requested and cached in .audio-cache.\nStop with Ctrl+C. Catalogue edits stay in the browser until exported.')
    if not args.no_browser:
        webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()

if __name__ == '__main__':
    main()
