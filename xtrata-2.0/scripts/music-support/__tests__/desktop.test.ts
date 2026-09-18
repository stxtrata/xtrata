import {describe,it,expect} from 'vitest';
import {externalURL,localNavigation,openLink} from '../../../desktop/music/navigation.mjs';
import {readFileSync} from 'node:fs';
describe('desktop boundaries',()=>{
 it('opens only known HTTPS destinations externally',()=>{expect(externalURL('https://xtrata.xyz/radio/lounge')).toBe(true);expect(externalURL('https://explorer.hiro.so/txid/123')).toBe(true);for(const url of ['file:///tmp','javascript:alert(1)','https://xtrata.xyz.evil.test/','https://user@xtrata.xyz/','http://xtrata.xyz'])expect(externalURL(url)).toBe(false);});
 it('allows only its own lounge inside the app',()=>{expect(localNavigation('http://127.0.0.1:1234/lounge','http://127.0.0.1:1234')).toBe(true);for(const url of ['http://127.0.0.1:1234/','http://127.0.0.1:8798/lounge','https://xtrata.xyz'])expect(localNavigation(url,'http://127.0.0.1:1234')).toBe(false);});
 it('deep links can open but never approve or transfer',()=>{expect(openLink('xtrata-music://open')).toBe(true);expect(openLink('xtrata-music://open?pay=1')).toBe(false);expect(openLink('xtrata-music://pay')).toBe(false);});
 it('packages only source and runtime files, with app data outside the install',()=>{const pkg=JSON.parse(readFileSync('desktop/music/package.json','utf8'));expect(pkg.build.files).not.toContain('**/*');expect(pkg.build.nsis.deleteAppDataOnUninstall).toBe(false);const prepare=readFileSync('desktop/music/prepare.mjs','utf8');expect(prepare).not.toContain("'.artifacts/radio-wizard'");});
});
