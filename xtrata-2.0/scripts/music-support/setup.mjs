import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {dirname} from 'node:path';
const root=dirname(fileURLToPath(import.meta.url));
if(Number(process.versions.node.split('.')[0])!==24){console.error('Please install Node.js 24 LTS from https://nodejs.org/en/download and run setup again.');process.exit(1);}
console.log('Installing Music Support dependencies in this folder. No wallet is created and no funds are sent.');
const npm=process.platform==='win32'?'npm.cmd':'npm';
const install=spawnSync(npm,['ci','--omit=dev','--ignore-scripts'],{cwd:root,stdio:'inherit',shell:process.platform==='win32'});
if(install.status!==0){console.error('Setup did not finish. Check your internet connection and try again.');process.exit(1);}
console.log('Setup complete. Keep this folder: your wallet will be stored inside it.\nRun npm run music:lounge here, then open http://127.0.0.1:8798/lounge\nNothing is paid until you explicitly enable support in the lounge.');
