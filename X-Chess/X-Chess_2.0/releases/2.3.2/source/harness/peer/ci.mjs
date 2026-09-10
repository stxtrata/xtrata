import {createHash} from 'node:crypto';
import {spawn} from 'node:child_process';
import {mkdtemp,rm,readFile,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import assert from 'node:assert/strict';
const reportDir=process.env.XCHESS_TEST_REPORT_DIR || 'dist';
const delay=ms=>new Promise(r=>setTimeout(r,ms)),url='http://127.0.0.1:4343',profiles=[],browsers=[],checks=[];
const server=spawn(process.execPath,['harness/peer/serve.mjs'],{stdio:'inherit'});
async function cmd(side,op,fields={}){const r=await fetch(url+'/command',{method:'POST',body:JSON.stringify({side,op,...fields}),signal:AbortSignal.timeout(40000)});const value=await r.json();if(!value.ok)throw Error(side+' '+op+': '+value.error);return value.value;}
function pass(name){checks.push({name,passed:true});console.log('PASS '+name);}
async function state(side){return cmd(side,'state');}
async function wait(side,fn){for(let n=0;n<100;n++){const s=await state(side);if(fn(s))return s;await delay(100);}throw Error('Peer wait failed '+JSON.stringify(await state(side)));}
async function launch(side){const profile=await mkdtemp(join(tmpdir(),'xchess-peer-'+side));profiles.push(profile);const b=spawn(process.env.CHROME_BIN||'google-chrome',['--headless=new','--disable-gpu','--no-first-run','--window-size=390,844',`--user-data-dir=${profile}`,url+'/app?side='+side],{stdio:'ignore'});browsers.push(b);await cmd(side,'open');return b;}
async function demo(){const a=await cmd('white','click',{name:'demo'});const b=await cmd('black','import',{text:a.output});await cmd('white','import',{text:b.output});}
async function connect(){const a=await cmd('white','click',{name:'offer'});await cmd('black','fill',{name:'input',value:a.output});const b=await cmd('black','click',{name:'answer'});await cmd('white','fill',{name:'input',value:b.output});await cmd('white','click',{name:'accept-answer'});await wait('white',s=>s.connection==='Direct peer connection active');await wait('black',s=>s.connection==='Direct peer connection active');}
let failure;
try{
  for(let n=0;n<100;n++){try{if((await fetch(url)).ok)break;}catch{}await delay(100);}
  await launch('white');await launch('black');await demo();
  assert.match((await state('white')).identity,/You: white/);assert.match((await state('black')).identity,/You: black/);pass('Independent browser profiles create separate keys and join a demo');
  await connect();pass('Real ordered WebRTC data channel with signed manual signaling and no ICE service');
  for(const [side,uci,next] of [['white','f2f3','black'],['black','e7e5','white'],['white','g2g4','black']]){
    const a=await cmd(side,'move',{uci});await wait(next,s=>s.position.includes(next+' to move'));const b=await cmd(next,'export');assert.equal(b.final.root,a.final.root);
    if(uci==='e7e5'){await cmd('white','click',{name:'disconnect'});await cmd('black','click',{name:'disconnect'});await connect();assert.equal((await cmd('white','export')).final.root,a.final.root);pass('Fresh signed connection descriptions reconnect and synchronize saved history');}
  }
  pass('Signed moves synchronize through native WebRTC');
  // Close the losing browser before the winner signs the mating move: no terminal receipt is possible.
  browsers[0].kill();await delay(300);
  const mate=await cmd('black','move',{uci:'d8h4'});assert.equal(mate.final.termination,'checkmate');assert.equal(mate.final.result,'0-1');assert.equal(mate.line.moves.length,4);assert.equal((await state('black')).reviewDisabled,false);await cmd('black','click',{name:'review'});await cmd('black','click',{name:'close-review'});pass('Winner records checkmate after loser closes, with no acknowledgment or final consent');
  await writeFile(reportDir+'/peer-fools-mate.json',JSON.stringify(mate,null,2)+'\n');
  const backup=await cmd('black','backup');assert.ok(!backup.includes(mate.opening.black.key));
  await launch('reader');await cmd('reader','file',{name:'archive-file',text:JSON.stringify(mate)});assert.match((await state('reader')).position,/checkmate/);assert.equal((await cmd('reader','verify',{archive:mate})).root,mate.final.root);pass('Fresh keyless browser verifies and replays a complete public archive with external requests blocked');
  await cmd('reader','fill',{name:'password',value:'browser-recovery-test-password'});await cmd('reader','file',{name:'recovery-file',text:backup});assert.match((await state('reader')).identity,/You: black/);pass('Encrypted native IndexedDB recovery restores private game key in a fresh browser');
  await cmd('black','reload');await delay(800);await cmd('black','open');await cmd('black','click',{name:'resume'});assert.equal((await cmd('black','export')).final.root,mate.final.root);pass('Reload resumes the durable completed game');
  await cmd('black','seedPending');await cmd('black','reload');await delay(800);await cmd('black','open');await cmd('black','click',{name:'restore-setup'});assert.deepEqual(await cmd('black','pending'),['ST000000000000000000002AMW42H.xchess-peer-v1','testnet','ab'.repeat(32)]);pass('Pending setup transaction restores after reload without rebroadcast');
  await launch('white');await demo();await cmd('white','disableRTC');await cmd('black','disableRTC');await cmd('white','click',{name:'offer'});assert.match((await state('white')).status,/WebRTC is unavailable/);
  for(const [side,uci,peer] of [['white','f2f3','black'],['black','e7e5','white'],['white','g2g4','black'],['black','d8h4','white']]){const a=await cmd(side,'move',{uci});await cmd(peer,'import',{text:JSON.stringify(a)});assert.equal((await cmd(peer,'export')).final.root,a.final.root);}
  pass('Complete manual signed-message game when WebRTC is unavailable');
  const manual=await cmd('white','export');await cmd('black','import',{text:JSON.stringify(manual)});assert.equal((await cmd('black','export')).line.moves.length,4);pass('Duplicate manual transcript import is idempotent');
  const bad=structuredClone(manual);bad.line.moves[0].payload.value='f2f4';await cmd('black','import',{text:JSON.stringify(bad)});assert.equal((await cmd('black','export')).final.root,manual.final.root);pass('Tampered browser import preserves accepted signed history');
  for(const side of ['white','black','reader']){const s=await state(side);assert.equal(s.boardSquares,64);assert.ok(s.squareHeight*8<=s.boardHeight+2);assert.equal(s.overflow,false);assert.deepEqual(s.errors,[]);assert.deepEqual(s.external,[]);const k=await cmd(side,'keyboard');assert.ok(k.active?.startsWith('peer-board-square-'));assert.equal(k.focus,true);}
  pass('Mobile viewport, keyboard grid, zero unhandled errors and zero external fetches in all three profiles');
}catch(e){failure=String(e.stack);console.error(e);}
finally{
  const artifact=JSON.parse(await readFile('dist/manifest.json','utf8'));await writeFile(reportDir+'/peer-browser-report.json',JSON.stringify({passed:!failure,artifactSha256:process.env.XCHESS_TEST_ARTIFACT?createHash('sha256').update(await readFile(process.env.XCHESS_TEST_ARTIFACT)).digest('hex'):artifact.htmlSha256,testedAt:new Date().toISOString(),environment:'Native headless Chrome, separate user-data-dir profiles; 390x844 requested viewport; test-only HTTP command coordination; application moves use WebRTC or explicit manual import',results:checks,failure},null,2)+'\n');
  for(const b of browsers)b.kill();server.kill();await delay(300);for(const p of profiles)await rm(p,{recursive:true,force:true});
}
if(failure)process.exitCode=1;
