import {spawn, spawnSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import {homedir} from 'node:os';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const requestedPort = Number(process.env.XTRATA_MUSIC_PORT || 8798);
const port = Number.isInteger(requestedPort) && requestedPort >= 1024 && requestedPort <= 65535 ? requestedPort : 8798;
const url = `http://127.0.0.1:${port}/lounge`;
const major = Number(process.versions.node.split('.')[0]);

if (major !== 24) {
  console.error('\nXtrata Music needs Node.js 24.');
  console.error('Install the LTS version from https://nodejs.org/en/download and double-click START HERE again.\n');
  process.exit(1);
}

const dataDir = process.platform === 'darwin'
  ? join(homedir(), 'Library', 'Application Support', 'Xtrata Music')
  : process.platform === 'win32'
    ? join(process.env.APPDATA || join(homedir(), 'AppData', 'Roaming'), 'Xtrata Music')
    : join(process.env.XDG_DATA_HOME || join(homedir(), '.local', 'share'), 'xtrata-music');

const openBrowser = () => {
  const command = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'cmd' : 'xdg-open';
  const args = process.platform === 'win32' ? ['/c', 'start', '', url] : [url];
  const result = spawnSync(command, args, {stdio: 'ignore', windowsHide: true});
  if (result.status !== 0) console.log(`Open this address in your browser: ${url}`);
};

const alreadyRunning = async () => {
  try {
    const response = await fetch(url, {signal: AbortSignal.timeout(1500)});
    return response.ok && (await response.text()).includes('Xtrata Music');
  } catch {
    return false;
  }
};

if (await alreadyRunning()) {
  console.log('Xtrata Music is already running. Opening the listening room…');
  openBrowser();
  process.exit(0);
}

if (!existsSync(join(root, 'node_modules', '@stacks', 'transactions'))) {
  console.log('\nFirst-time setup: installing the small set of required files.');
  console.log('This may take a few minutes. No wallet is created and no money is moved.\n');
  const setup = spawnSync(process.execPath, [join(root, 'setup.mjs')], {cwd: root, stdio: 'inherit'});
  if (setup.status !== 0) process.exit(setup.status || 1);
}

console.log('\nStarting Xtrata Music…');
console.log(`Your wallet data stays in: ${dataDir}`);
console.log('Keep this window open while listening. Closing it stops new support payments.\n');

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const child = spawn(npm, ['run', 'music:lounge'], {
  cwd: root,
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env: {...process.env, XTRATA_MUSIC_DATA_DIR: dataDir, XTRATA_MUSIC_PORT: String(port)}
});

let opened = false;
for (let attempt = 0; attempt < 40 && !opened; attempt += 1) {
  await new Promise(resolve => setTimeout(resolve, 250));
  if (await alreadyRunning()) {
    opened = true;
    openBrowser();
  }
  if (child.exitCode !== null) break;
}

if (!opened) {
  console.error('\nXtrata Music did not start. Read TROUBLESHOOTING in README.html, then try again.');
  child.kill('SIGTERM');
  process.exit(1);
}

const stop = () => child.kill('SIGTERM');
process.once('SIGINT', stop);
process.once('SIGTERM', stop);
child.once('exit', code => process.exit(code || 0));
