import { spawn } from 'node:child_process';

export function runProcess(command, args, { cwd, input, signal, timeout = 60000, onLine, env = process.env, maxOutput = 2_000_000 } = {}) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new Error('Cancelled'));
    const child = spawn(command, args, { cwd, env, detached: process.platform !== 'win32', stdio: ['pipe', 'pipe', 'pipe'] });
    let stdout = '', stderr = '', buffer = '', termination, forceTimer;
    const kill = () => {
      try { process.platform === 'win32' ? child.kill('SIGTERM') : process.kill(-child.pid, 'SIGTERM'); } catch {}
      forceTimer = setTimeout(() => { try { process.platform === 'win32' ? child.kill('SIGKILL') : process.kill(-child.pid, 'SIGKILL'); } catch {} }, 3000); forceTimer.unref();
    };
    const abort = () => { termination = 'Cancelled'; kill(); };
    const timer = setTimeout(() => { termination = 'Time limit reached'; kill(); }, timeout);
    const cleanup = () => { clearTimeout(timer); clearTimeout(forceTimer); signal?.removeEventListener('abort', abort); };
    signal?.addEventListener('abort', abort, { once: true });
    child.on('error', e => { cleanup(); reject(e); });
    child.stdin.on('error', () => {});
    child.stdout.on('data', chunk => {
      stdout = (stdout + chunk).slice(-maxOutput); buffer += chunk;
      let index; while ((index = buffer.indexOf('\n')) >= 0) { onLine?.(buffer.slice(0, index)); buffer = buffer.slice(index + 1); }
      if (buffer.length > maxOutput) buffer = buffer.slice(-maxOutput);
    });
    child.stderr.on('data', chunk => { stderr = (stderr + chunk).slice(-maxOutput); });
    child.on('close', code => { cleanup(); if (buffer) onLine?.(buffer); resolve({ code, stdout, stderr, termination }); });
    child.stdin.end(input || '');
  });
}
