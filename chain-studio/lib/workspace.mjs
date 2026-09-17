import { mkdir, readdir, readFile, writeFile, copyFile, lstat, realpath } from 'node:fs/promises';
import { resolve, join, relative, dirname, extname, isAbsolute, sep } from 'node:path';
import { createHash } from 'node:crypto';
import { runProcess } from './process.mjs';

const omitted = new Set(['.git', 'node_modules', '.data', '.next', '.cache', '.codex', '.agents', 'media', 'coverage', '.DS_Store']);
export function allowedFile(name) {
  return !name.split(/[\\/]/).some(p => omitted.has(p) || /^\.env(?:\.|$)/i.test(p) || /(?:secret|credential|wallet|auth\.json|\.pem$|\.key$)/i.test(p));
}
export async function safePath(root, path = '') {
  const base = await realpath(root); const target = resolve(base, path);
  if (target !== base && !target.startsWith(base + sep)) throw new Error('Path is outside this snapshot.');
  const actual = await realpath(target);
  if (actual !== base && !actual.startsWith(base + sep)) throw new Error('Linked files outside the snapshot are unavailable.');
  if (!allowedFile(relative(base, actual))) throw new Error('This file is excluded from the workbench.');
  return actual;
}
export async function listFiles(root, prefix = '') {
  let out = [];
  for (const entry of await readdir(join(root, prefix), { withFileTypes: true })) {
    const name = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (!allowedFile(name) || entry.isSymbolicLink()) continue;
    if (entry.isDirectory()) out.push(...await listFiles(root, name));
    else if (entry.isFile()) out.push(name);
    if (out.length > 10000) throw new Error('Workspace exceeds the 10,000-file limit. Choose a smaller project.');
  }
  return out.sort();
}
export async function copyWorkspace(source, destination, { gitOnly = false } = {}) {
  await mkdir(destination, { recursive: true });
  let files;
  if (gitOnly) {
    const result = await runProcess('git', ['-C', source, 'ls-files', '-z', '--cached', '--others', '--exclude-standard'], { timeout: 20000 });
    if (result.code !== 0) throw new Error('Choose a Git project folder, or leave the source blank for a new project.');
    files = [...new Set(result.stdout.split('\0').filter(Boolean))].filter(allowedFile);
  } else files = await listFiles(source);
  let total = 0;
  for (const file of files) {
    const src = resolve(source, file);
    if (!src.startsWith(resolve(source) + sep)) continue;
    let stat; try { stat = await lstat(src); } catch { continue; }
    if (!stat.isFile() || stat.isSymbolicLink()) continue;
    // Resolve parent symlinks too; never import files from outside the selected source.
    await safePath(source, file);
    total += stat.size;
    if (total > 100 * 1024 * 1024 || files.length > 10000) throw new Error('Workspace exceeds 100 MB or 10,000 files. Choose a smaller project.');
    const dest = join(destination, file); await mkdir(dirname(dest), { recursive: true }); await copyFile(src, dest);
  }
}
export async function manifest(root) {
  const items = [];
  for (const path of await listFiles(root)) {
    const bytes = await readFile(await safePath(root, path));
    items.push({ path, bytes: bytes.length, hash: createHash('sha256').update(bytes).digest('hex') });
  }
  return items;
}
export async function basicChecks(root, signal) {
  const files = await listFiles(root); const results = [];
  for (const file of files.filter(f => ['.js', '.mjs', '.cjs'].includes(extname(f))).slice(0, 80)) {
    const result = await runProcess(process.execPath, ['--check', await safePath(root, file)], { cwd: root, signal, timeout: 10000 });
    results.push({ name: `Syntax: ${file}`, passed: result.code === 0 && !result.termination, output: (result.stderr || result.termination || 'Valid JavaScript').slice(0, 5000) });
  }
  results.push({ name: 'Snapshot captured', passed: true, output: `${files.length} files saved. Syntax checks are not functional tests.` });
  return results;
}
export function sandboxPolicy(workdir, tempdir) {
  const quote = v => JSON.stringify(v);
  return `(version 1) (deny default) (allow process*) (allow sysctl-read) (allow mach-lookup) (allow file-read*) (deny file-read* (subpath ${quote(process.env.HOME + '/.codex')}) (subpath ${quote(process.env.HOME + '/.ssh')}) (subpath ${quote(process.env.HOME + '/Library/Keychains')})) (allow file-write* (subpath ${quote(workdir)}) (subpath ${quote(tempdir)}) (literal "/dev/null"))`;
}
export async function runWorkspaceTest(workdir, command, { signal, timeout = 120000 } = {}) {
  if (process.platform !== 'darwin') throw new Error('Command tests currently require the macOS sandbox. Snapshot previews and syntax checks work on other platforms.');
  const tempdir = join(workdir, '.test-tmp'); await mkdir(tempdir, { recursive: true });
  const env = { PATH: process.env.PATH, HOME: tempdir, TMPDIR: tempdir, CI: '1', LANG: 'en_US.UTF-8' };
  return runProcess('/usr/bin/sandbox-exec', ['-p', sandboxPolicy(await realpath(workdir), await realpath(tempdir)), '/bin/sh', '-c', command], { cwd: workdir, signal, timeout, env });
}
