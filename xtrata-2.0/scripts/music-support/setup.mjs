import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {dirname} from 'node:path';
const root=dirname(fileURLToPath(import.meta.url));
if(Number(process.versions.node.split('.')[0])!==24){console.error('Please install Node.js 24 LTS from https://nodejs.org/en/download and double-click START HERE again.');process.exit(1);}
console.log('Installing Xtrata Music. No wallet is created and no funds are sent.');
const npm=process.platform==='win32'?'npm.cmd':'npm';
const install=spawnSync(npm,['ci','--omit=dev','--ignore-scripts'],{cwd:root,stdio:'inherit',shell:process.platform==='win32'});
if(install.status!==0){console.error('Setup did not finish. Check your internet connection and try again.');process.exit(1);}
console.log('Setup complete. Xtrata Music will now open. Nothing is paid until you explicitly enable support in the listening room.');
