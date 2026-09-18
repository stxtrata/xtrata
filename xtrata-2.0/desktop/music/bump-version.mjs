// One patch bump per release, before building. Published download metadata stays
// unchanged until the new installer is uploaded and its checksum is verified.
import {readFile,writeFile} from 'node:fs/promises';
const pkgURL=new URL('./package.json',import.meta.url);
const lockURL=new URL('./package-lock.json',import.meta.url);
const versionURL=new URL('../../scripts/wizard/music-version.json',import.meta.url);
const pkg=JSON.parse(await readFile(pkgURL,'utf8'));
const lock=JSON.parse(await readFile(lockURL,'utf8'));
if(!/^\d+\.\d+\.\d+$/.test(pkg.version))throw Error('Expected major.minor.patch version');
const parts=pkg.version.split('.').map(Number);parts[2]++;
pkg.version=parts.join('.');lock.version=pkg.version;lock.packages[''].version=pkg.version;
await writeFile(pkgURL,JSON.stringify(pkg,null,2)+'\n');
await writeFile(lockURL,JSON.stringify(lock,null,2)+'\n');
await writeFile(versionURL,JSON.stringify({version:pkg.version})+'\n');
console.log(`Next release: ${pkg.version}. Build, test and publish before updating the public manifest.`);
