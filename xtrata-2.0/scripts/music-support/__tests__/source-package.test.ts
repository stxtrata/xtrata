import {describe,expect,it} from 'vitest';
import {existsSync,readFileSync} from 'node:fs';

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
    for (const name of ['START HERE - Mac.command', 'START HERE - Windows.cmd', 'START HERE - Linux.sh', '1 - READ ME FIRST.html', 'AI AGENT - INSTALL.md', 'xtrata-music-support-installer/SKILL.md', 'public/radio/chain-activity.js', 'public/radio/paid-receipt.mjs']) {
      expect(packager).toContain(name);
    }
    expect(packager).not.toContain('extensions/music-support/');
    expect(packager).not.toContain('DESKTOP-MUSIC.md');
    expect(packager).not.toContain("'package.json','package-lock.json'");
    expect(packager).not.toContain('vault.json');
    expect(packager).not.toContain('unlock.json');
    expect(packager).toContain("'radio-listening-policy.mjs'");
    expect(packager).toContain("'music-release-policy.mjs'");
    expect(text('scripts/music-support/source-package-smoke.mjs')).toContain('complete relative runtime import closure');
    expect(packager).toContain("'music-version.json'");
  });

  it('keeps the wallet outside the replaceable program folder', () => {
    const launcher = text('scripts/music-support/open.mjs');
    expect(launcher).toContain("'Library', 'Application Support', 'Xtrata Music'");
    expect(launcher).toContain("'AppData', 'Roaming'");
    expect(launcher).toContain('XTRATA_MUSIC_DATA_DIR');
    expect(launcher).not.toContain("'.artifacts', 'radio-wizard'");
  });

  it('does not offer an unprotected Windows source-wallet route', () => {
    const launcher = text('scripts/music-support/open.mjs');
    const packager = text('scripts/music-support/package.mjs');
    expect(launcher).toContain("process.platform === 'win32'");
    expect(launcher).toContain('does not create or access a wallet');
    expect(packager).toContain('does not create or access a wallet on Windows');
  });

  it('documents the whole setup and payment choice in ordinary language', () => {
    const readme = text('docs/radio/MUSIC-SUPPORT-INSTALL.md');
    for (const phrase of ['The short version', 'Mac: step by step', 'Windows: step by step', 'Create my support wallet', 'Funding never turns payments on', 'Updating safely', 'Troubleshooting', 'What this package cannot do']) {
      expect(readme).toContain(phrase);
    }
  });

  it('trains agents without expanding installation into wallet authority', () => {
    const guide = text('docs/radio/AI-MUSIC-SUPPORT-INSTALL.md');
    const skill = text('skills/xtrata-music-support-installer/SKILL.md');
    for (const phrase of ['Never request, reveal, copy, log or transmit', 'Installation or launch does not authorise wallet funding or payments', '127.0.0.1', 'free playback']) {
      expect(guide + skill).toContain(phrase);
    }
    expect(skill).toContain('name: xtrata-music-support-installer');
    expect(text('scripts/music-support/README.html')).toContain('AI AGENT - INSTALL.md');
  });
});
