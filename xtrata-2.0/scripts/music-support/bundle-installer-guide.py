"""Wrap an unchanged installer with the beta guide for pre-install reading."""
import argparse
import hashlib
import json
from pathlib import Path
import zipfile

def digest_file(stream):
    digest = hashlib.sha256()
    for chunk in iter(lambda: stream.read(1024 * 1024), b''):
        digest.update(chunk)
    return digest


parser = argparse.ArgumentParser()
parser.add_argument('--installer', type=Path)
parser.add_argument('--artifact-dir', type=Path)
args = parser.parse_args()
root = Path(__file__).resolve().parents[2]
version = json.loads((root / 'desktop/music/package.json').read_text())['version']
installer = args.installer or (args.artifact_dir / f'Xtrata-Music-{version}-windows11-preview-x64.exe')
if installer.suffix not in ('.exe', '.dmg') or not installer.is_file():
    raise SystemExit('An existing EXE or DMG installer is required')
guide = root / 'desktop/music/README-BETA-TESTERS.md'
bundle = installer.with_name(installer.stem + '-with-guide.zip')
with zipfile.ZipFile(bundle, 'w', compression=zipfile.ZIP_STORED) as archive:
    archive.write(installer, installer.name)
    archive.writestr('READ-ME-FIRST.txt', guide.read_text())
    archive.writestr('INSTALLER-SHA256.txt', digest_file(installer.open('rb')).hexdigest() + '  ' + installer.name + '\n')
with zipfile.ZipFile(bundle) as archive:
    assert archive.testzip() is None
    with archive.open(installer.name) as item, installer.open('rb') as original:
        assert digest_file(item).digest() == digest_file(original).digest()
digest = digest_file(bundle.open('rb')).hexdigest()
bundle.with_suffix('.zip.sha256').write_text(digest + '  ' + bundle.name + '\n')
print(bundle.name, digest)
