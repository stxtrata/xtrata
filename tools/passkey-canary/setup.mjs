import {spawnSync} from 'node:child_process';
import {lstat,realpath,symlink} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const here=fileURLToPath(new URL('.',import.meta.url));
const upstream=fileURLToPath(new URL('upstream/',import.meta.url));
for(const args of [['ci','--ignore-scripts'],['run','build']]) {
  const result=spawnSync(process.platform==='win32'?'npm.cmd':'npm',args,{cwd:upstream,stdio:'inherit',shell:process.platform==='win32'});
  if(result.error)throw result.error;
  if(result.status!==0)process.exit(result.status??1);
}
const link=here+'node_modules',target=upstream+'node_modules';
let exists=false;
try{await lstat(link);exists=true;}catch(error){if(error.code!=='ENOENT')throw error;}
if(exists) {
  if(await realpath(link)!==await realpath(target))throw Error('Existing node_modules is not the expected upstream dependency link; resolve it manually.');
} else await symlink(target,link,process.platform==='win32'?'junction':'dir');
console.log('Pinned upstream dependencies and library build are ready. Run npm test or npm run build.');
