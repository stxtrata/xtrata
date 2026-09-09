// CI adapter for the same self-running page used interactively in a real browser.
import {spawn} from 'node:child_process';
import {mkdtemp, rm, readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const expectedHash = JSON.parse(await readFile('dist/manifest.json', 'utf8')).htmlSha256;
const startedAt = Date.now();
const profile = await mkdtemp(join(tmpdir(), 'xchess-browser-'));
const server = spawn(process.execPath,['harness/browser/serve.mjs'],{stdio:'inherit'});
let browser;
try {
  let ready=false;
  for(let n=0;n<100;n++) {
    try {ready=(await fetch('http://127.0.0.1:4342/report',{signal:AbortSignal.timeout(500)})).ok;} catch {}
    if(ready)break; await new Promise(r=>setTimeout(r,100));
  }
  if(!ready)throw Error('Browser fixture server did not start');
  browser=spawn(process.env.CHROME_BIN || 'google-chrome',['--headless=new','--disable-gpu',`--user-data-dir=${profile}`,'http://127.0.0.1:4342'],{stdio:'ignore'});
  let launchError=null;browser.on('error',error=>{launchError=error;});
  let report;
  for(let n=0;n<120;n++) {
    if(launchError)throw launchError;
    report=await (await fetch('http://127.0.0.1:4342/report')).json();
    if(report)break;await new Promise(r=>setTimeout(r,500));
  }
  if(!report?.passed || report.results.length<30 || report.artifactSha256!==expectedHash || Date.parse(report.testedAt)<startedAt)throw Error(JSON.stringify(report ?? 'Browser tests timed out'));
  console.log(`Browser: ${report.results.length} checks passed on ${report.userAgent}`);
} finally {
  browser?.kill();server.kill();
  await new Promise(r=>setTimeout(r,250));await rm(profile,{recursive:true,force:true});
}
