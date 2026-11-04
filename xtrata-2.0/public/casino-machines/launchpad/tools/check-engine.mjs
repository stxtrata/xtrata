#!/usr/bin/env node
// Checks the immutable, common Block Fortune v2 span, never a rewritten equivalent.
import {readFileSync,writeFileSync,existsSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const expected='203f8735007d8df9c2058be24c8e65fe269abac341438c0217128baef69f9bed';
function block(source){const start=source.indexOf('const BF = (() => {');if(start<0)throw Error('BF block missing');const end=source.indexOf('\n})();',start);if(end<0)throw Error('BF terminator missing');return source.slice(start,end+6);}
function check(name,source){const text=block(source),sha256=createHash('sha256').update(text).digest('hex');return {name,characters:text.length,sha256,pass:text.length===11429&&sha256===expected};}
const source=readFileSync(resolve(root,'src/engine.js'),'utf8');
const sourceSha256=createHash('sha256').update(source).digest('hex');
const expectedSourceSha256='7f619182ada01119a713c64874eb1a7e024d7c210e0dca0ec2e8afc05c143168';
const checks=[
 {name:'src/engine.js (whole file)',sha256:sourceSha256,pass:sourceSha256===expectedSourceSha256},
 check('src/engine.js (BF span)',source)
];
for(const name of ['dist/launchpad.html','game.html'])if(existsSync(resolve(root,name)))checks.push(check(name,readFileSync(resolve(root,name),'utf8')));
if(existsSync(resolve(root,'pack.json'))){const p=JSON.parse(readFileSync(resolve(root,'pack.json'),'utf8'));checks.push(check('pack.json decoded game',gunzipSync(Buffer.from(p.game,'base64')).toString('utf8')));}
const result={time:new Date().toISOString(),expectedCharacters:11429,expectedSha256:expected,expectedSourceSha256,checks,pass:checks.every(c=>c.pass)};
mkdirSync(resolve(root,'checks/results'),{recursive:true});writeFileSync(resolve(root,'checks/results/engine.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));if(!result.pass)process.exitCode=1;
