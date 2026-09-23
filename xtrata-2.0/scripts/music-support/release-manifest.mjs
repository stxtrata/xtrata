// Run after publishing a platform-tested release or explicitly labelled preview.
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {basename,resolve} from 'node:path';
const [platform,file,url,requirements,...flags]=process.argv.slice(2);
const preview=flags.join()==='--preview-tested';
if(!['mac-universal','mac-universal-legacy','mac-arm64','mac-x64','win-x64','linux-x64'].includes(platform)||!file||!url||!requirements||(!preview&&flags.join()!=='--signed-and-tested'))throw Error('Usage: node scripts/music-support/release-manifest.mjs <platform> <local installer> <published GitHub URL> <OS requirements> --signed-and-tested | --preview-tested');
const target=new URL(url);if(target.origin!=='https://github.com'||!target.pathname.startsWith('/stxtrata/xtrata/releases/download/')||decodeURIComponent(target.pathname.split('/').pop())!==basename(file))throw Error('Use the published installer URL in the Xtrata GitHub release.');
const local=await readFile(resolve(file));const sha256=createHash('sha256').update(local).digest('hex');
// Stream the published file and compare bytes before offering it to users.
const response=await fetch(url,{signal:AbortSignal.timeout(120000)});if(!response.ok)throw Error('Published download is not available.');const hash=createHash('sha256');for await(const chunk of response.body)hash.update(chunk);if(hash.digest('hex')!==sha256)throw Error('Published download checksum differs from the local installer.');
const path=new URL('../../public/radio/music-releases.json',import.meta.url),release=JSON.parse(await readFile(path,'utf8'));
const desktop=JSON.parse(await readFile(new URL('../../desktop/music/package.json',import.meta.url),'utf8'));

const versions=JSON.parse(await readFile(new URL('../../desktop/music/release-versions.json',import.meta.url),'utf8'));
const artifactVersion=platform.startsWith('mac-')?versions.darwin:desktop.version;
release.version=desktop.version;
if(!basename(file).includes(`-${artifactVersion}-`))throw Error('Installer filename must match the platform version.');
release.downloads=release.downloads.filter(d=>d.platform!==platform);release.downloads.push({platform,version:artifactVersion,url,sha256,requirements,signed:!preview,verified:true,...(preview?{preview:true}:{})});release.channel=release.downloads.some(d=>d.preview)?'preview':'stable';release.summary=release.channel==='preview'?`Xtrata Music desktop previews are available for testing. Each download shows its own version; preview builds are unsigned.`:`Xtrata Music is available for the platforms below. Each download shows its own version.`;await writeFile(path,JSON.stringify(release,null,2)+'\n');console.log('Verified published bytes and updated the hub manifest. Review, commit and deploy it.');
