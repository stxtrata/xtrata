import {describe,it,expect} from 'vitest';
import {externalURL,localNavigation,openLink,protocolOpenArgument} from '../../../desktop/music/navigation.mjs';
import {unavailableWallet} from '../../../desktop/music/unavailable-wallet.mjs';
import {releasePlatformsForRuntime} from '../../../desktop/music/release-platforms.mjs';
import {existsSync,readFileSync} from 'node:fs';
describe('desktop boundaries',()=>{
 it('opens only known HTTPS destinations externally',()=>{expect(externalURL('https://xtrata.xyz/music/lounge')).toBe(true);expect(externalURL('https://explorer.hiro.so/txid/123')).toBe(true);for(const url of ['file:///tmp','javascript:alert(1)','https://xtrata.xyz.evil.test/','https://user@xtrata.xyz/','http://xtrata.xyz'])expect(externalURL(url)).toBe(false);});
 it('allows only its own lounge inside the app',()=>{expect(localNavigation('http://127.0.0.1:1234/lounge','http://127.0.0.1:1234')).toBe(true);for(const url of ['http://127.0.0.1:1234/','http://127.0.0.1:8798/lounge','https://xtrata.xyz'])expect(localNavigation(url,'http://127.0.0.1:1234')).toBe(false);});
 it('deep links can open but never approve or transfer',()=>{expect(openLink('xtrata-music://open')).toBe(true);expect(openLink('xtrata-music://open?pay=1')).toBe(false);expect(openLink('xtrata-music://pay')).toBe(false);});
 it('accepts only the inert Windows protocol launch argument',()=>{expect(protocolOpenArgument(['Xtrata Music.exe','xtrata-music://open'])).toBe(true);for(const args of [['xtrata-music://open?pay=1'],['xtrata-music://pay'],['https://xtrata.xyz'],null])expect(protocolOpenArgument(args)).toBe(false);});
 it('advertises only an installer compatible with the running platform and CPU',()=>{
  expect(releasePlatformsForRuntime('win32','x64')).toEqual(['win-x64']);
  expect(releasePlatformsForRuntime('darwin','x64')).toEqual(['mac-universal','mac-x64']);
  expect(releasePlatformsForRuntime('darwin','arm64')).toEqual(['mac-universal','mac-arm64']);
  expect(releasePlatformsForRuntime('linux','x64')).toEqual([]);
 });
 it('keeps update instructions specific to the installed platform',()=>{const ui=readFileSync('scripts/wizard/music-lounge.js','utf8');expect(ui).toContain("data.platform==='win32'");expect(ui).toContain('run the downloaded Windows installer');expect(ui).toContain("data.platform==='darwin'");});
 it('packages only source and runtime files, with app data outside the install',()=>{const pkg=JSON.parse(readFileSync('desktop/music/package.json','utf8'));expect(pkg.build.files).not.toContain('**/*');expect(pkg.build.files).toContain('!**/*.map');expect(pkg.build.files).toContain('!**/*.ts');expect(pkg.build.win.icon).toBe('assets/xtrata-music.ico');expect(existsSync('desktop/music/assets/xtrata-music.ico')).toBe(true);expect(pkg.build.nsis.deleteAppDataOnUninstall).toBe(false);const prepare=readFileSync('desktop/music/prepare.mjs','utf8');expect(prepare).not.toContain("'.artifacts/radio-wizard'");});
 it('keeps free listening available when protected wallet access fails closed',async()=>{const wallet=unavailableWallet(Error('DPAPI unavailable'));expect((await wallet.status()).address).toBeNull();await expect(wallet.setup()).rejects.toThrow('Free listening remains available');await expect(wallet.run()).rejects.toThrow('DPAPI unavailable');expect(await wallet.journal()).toEqual([]);});
});
