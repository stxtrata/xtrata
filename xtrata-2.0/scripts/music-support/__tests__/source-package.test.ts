import {describe,expect,it} from 'vitest';
import {readFileSync} from 'node:fs';

const text = (path:string) => readFileSync(path, 'utf8');

describe('source package for nontechnical listeners', () => {
  it('ships a small, exactly locked runtime', () => {
    const manifest = JSON.parse(text('scripts/music-support/runtime/package.json'));
    const lock = JSON.parse(text('scripts/music-support/runtime/package-lock.json'));
    expect(manifest.dependencies).toEqual({
      '@noble/hashes': '1.8.0',
      '@stacks/network': '6.17.0',
      '@stacks/transactions': '6.17.0'
    });
    expect(lock.packages[''].dependencies).toEqual(manifest.dependencies);
    expect(Object.keys(lock.packages).length).toBeLessThan(20);
  });

  it('provides one-step launchers and excludes wallet data and the browser extension', () => {
    const packager = text('scripts/music-support/package.mjs');
    for (const name of ['START HERE - Mac.command', 'START HERE - Windows.cmd', 'START HERE - Linux.sh', '1 - READ ME FIRST.html']) {
      expect(packager).toContain(name);
    }
    expect(packager).not.toContain('extensions/music-support/');
    expect(packager).not.toContain('DESKTOP-MUSIC.md');
    expect(packager).not.toContain("'package.json','package-lock.json'");
    expect(packager).not.toContain('vault.json');
    expect(packager).not.toContain('unlock.json');
  });

  it('keeps the wallet outside the replaceable program folder', () => {
    const launcher = text('scripts/music-support/open.mjs');
    expect(launcher).toContain("'Library', 'Application Support', 'Xtrata Music'");
    expect(launcher).toContain("'AppData', 'Roaming'");
    expect(launcher).toContain('XTRATA_MUSIC_DATA_DIR');
    expect(launcher).not.toContain("'.artifacts', 'radio-wizard'");
  });

  it('documents the whole setup and payment choice in ordinary language', () => {
    const readme = text('docs/radio/MUSIC-SUPPORT-INSTALL.md');
    for (const phrase of ['The short version', 'Mac: step by step', 'Windows: step by step', 'Create my support wallet', 'Funding never turns payments on', 'Updating safely', 'Troubleshooting', 'What this package cannot do']) {
      expect(readme).toContain(phrase);
    }
  });
});
