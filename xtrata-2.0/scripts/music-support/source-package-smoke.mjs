// Build the source companion into a temporary directory and prove that every
// relative runtime import resolves inside the archive. No wallet is created,
// launched or contacted.
import {execFileSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import {mkdir,mkdtemp,readFile,readdir,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {dirname,extname,join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const temporary=await mkdtemp(join(tmpdir(),'xtrata-music-source-package-'));
const output=join(temporary,'output'),expanded=join(temporary,'expanded');
async function files(directory){
 const output=[];
 async function visit(current){for(const entry of await readdir(current,{withFileTypes:true})){const path=join(current,entry.name);if(entry.isDirectory())await visit(path);else output.push(path);}}
 await visit(directory);return output;
}
function relativeImports(source){
 const matches=[];
 const expression=/(?:^|[;\n])\s*(?:import|export)\s+(?:[^'";]*?\s+from\s+)?['"](\.{1,2}\/[^'"]+)['"]/gm;
 for(const match of source.matchAll(expression))matches.push(match[1]);
 return matches;
}
try{
 execFileSync(process.execPath,['scripts/music-support/package.mjs'],{cwd:root,env:{...process.env,XTRATA_MUSIC_PACKAGE_OUTPUT:output},stdio:'inherit'});
 const archive=join(output,'xtrata-music-support.tar.gz');
 await mkdir(expanded,{recursive:true});
 execFileSync('tar',['-xzf',archive,'-C',expanded],{cwd:root});
 const packageRoot=join(expanded,'xtrata-music-support');
 const requiredAssets=[
  'scripts/wizard/music-version.json',
  'scripts/wizard/music-logo.webp',
  'scripts/wizard/music-lounge.html',
  'scripts/wizard/radio-plays-panel.html',
  'scripts/wizard/music-web-approval.html',
  'public/radio/chain-activity.js',
 ];
 const missingAssets=requiredAssets.filter(asset=>!existsSync(join(packageRoot,asset)));
 if(missingAssets.length)throw Error('Source package is missing runtime assets: '+missingAssets.join(', '));
 const unresolved=[];
 // Browser modules resolve against HTTP routes, not their source filenames.
 // Verify the actual server mapping before resolving this one routed import.
 const server=await readFile(join(packageRoot,'scripts/wizard/radio-plays-server.mjs'),'utf8');
 const policyRoute="if(req.method==='GET'&&req.url==='/radio-policy.js'){res.setHeader('Content-Type','text/javascript');res.end(await readFile(join(root,'scripts/wizard/radio-listening-policy.mjs')));return;}";
 if(!server.includes(policyRoute))throw Error('Browser policy route changed: update and verify the package closure mapping.');
 for(const path of await files(packageRoot)){
  if(!['.mjs','.js'].includes(extname(path)))continue;
  for(const specifier of relativeImports(await readFile(path,'utf8'))){
   const routedPolicy=path===join(packageRoot,'scripts/wizard/radio-listening-ui.js')&&specifier==='./radio-policy.js';
   const target=routedPolicy?join(packageRoot,'scripts/wizard/radio-listening-policy.mjs'):resolve(dirname(path),specifier);
   if(!existsSync(target))unresolved.push(path.slice(packageRoot.length+1)+' -> '+specifier);
  }
 }
 if(unresolved.length)throw Error('Source package has unresolved relative imports: '+unresolved.join(', '));
 console.log('PASS: source companion archive has a complete relative runtime import closure.');
}finally{await rm(temporary,{recursive:true,force:true});}
