#!/usr/bin/env node
// Verify the immutable engine source and the actual packed game, never a hand-transcribed equivalent.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { gunzipSync } from 'node:zlib';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const EXPECTED='203f8735007d8df9c2058be24c8e65fe269abac341438c0217128baef69f9bed';
const hash=s=>createHash('sha256').update(s).digest('hex');
const block=s=>{const a=s.indexOf('const BF = (() => {');const b=s.indexOf('\n})();',a);if(a<0||b<0)throw Error('Exact BF engine block not found');return s.slice(a,b+6);};
const findings=[];
function check(name,source){const engine=block(source);const result={name,characters:engine.length,bytes:Buffer.byteLength(engine),sha256:hash(engine),pass:engine.length===11429&&hash(engine)===EXPECTED};findings.push(result);return result;}
try{
  const source=fs.readFileSync(path.join(root,'src/engine.js'),'utf8');
  check('src/engine.js',source);
  findings.push({name:'recorded reference hash',pass:fs.readFileSync(path.join(root,'src/engine.sha256'),'utf8').trim()===EXPECTED});
  findings.push({name:'complete Appendix A.1 file',sha256:hash(source),pass:hash(source)==='7f619182ada01119a713c64874eb1a7e024d7c210e0dca0ec2e8afc05c143168'});
  const sourceOnly=process.argv.includes('--source-only');
  if(!sourceOnly){
    const pack=JSON.parse(fs.readFileSync(path.join(root,'pack.json'),'utf8'));
    const game=gunzipSync(Buffer.from(pack.game,'base64')).toString('utf8');
    check('pack.json → game',game);
    const occurrences=game.split('const BF = (() => {').length-1;
    findings.push({name:'one immutable BF block in packed game',occurrences,pass:occurrences===1});
  }
  const result={status:findings.every(x=>x.pass)?(sourceOnly?'PASS_SOURCE_ONLY':'PASS'):'FAIL',checkedAt:new Date().toISOString(),reference:'Series Bible 2.1 Appendix A.1',expectedSha256:EXPECTED,findings};
  fs.mkdirSync(path.join(root,'checks/results'),{recursive:true});fs.writeFileSync(path.join(root,'checks/results/engine.json'),JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify(result,null,2));if(result.status==='FAIL')process.exitCode=1;
}catch(error){console.error(error.stack||String(error));process.exitCode=1;}
