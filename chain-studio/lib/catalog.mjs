import { readFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';

const desktopCodex = '/Applications/ChatGPT.app/Contents/Resources/codex';
export const codexBin = process.env.CHAIN_CODEX_BIN || (existsSync(desktopCodex) ? desktopCodex : 'codex');
export async function cachedCatalog() {
  try {
    const c = JSON.parse(await readFile(join(process.env.CODEX_HOME || join(homedir(), '.codex'), 'models_cache.json'), 'utf8'));
    return { source: 'Codex local catalog', fetchedAt: c.fetched_at, models: c.models.map(m => ({
      id: m.slug, name: m.display_name || m.slug, hidden: m.visibility === 'hide',
      efforts: (m.supported_reasoning_levels || []).map(e => e.effort),
      defaultEffort: m.default_reasoning_level || 'low', description: m.description || '',
    })).filter(m => m.efforts.length) };
  } catch { return { source: 'Unavailable', models: [], error: 'No model catalog found. Sign in with codex login, then refresh models.' }; }
}

export function discoverCatalog() {
  return new Promise((resolve, reject) => {
    const child = spawn(codexBin, ['app-server', '--stdio'], { stdio: ['pipe', 'pipe', 'pipe'] });
    let buffer = '', done = false, models = [];
    const finish = (error, data) => { if (done) return; done = true; clearTimeout(timer); child.kill(); error ? reject(error) : resolve(data); };
    const timer = setTimeout(() => finish(new Error('Live discovery timed out; using the saved Codex catalog.')), 12000);
    const send = value => child.stdin.write(JSON.stringify(value) + '\n');
    child.on('error', error => finish(error));
    child.on('exit', () => finish(new Error('Codex model discovery exited before responding.')));
    child.stdin.on('error', () => {});
    child.stderr.on('data', () => {});
    child.stdout.on('data', chunk => {
      buffer += chunk;
      let index;
      while ((index = buffer.indexOf('\n')) >= 0) {
        const line = buffer.slice(0, index); buffer = buffer.slice(index + 1);
        let msg; try { msg = JSON.parse(line); } catch { continue; }
        if (msg.error) { finish(new Error(msg.error.message)); continue; }
        if (msg.id === 1) { send({ method: 'initialized' }); send({ id: 2, method: 'model/list', params: { includeHidden: true, limit: 100 } }); }
        if (msg.id === 2) {
          models.push(...(msg.result?.data || []).map(m => ({ id: m.model || m.id, name: m.displayName, hidden: m.hidden, efforts: m.supportedReasoningEfforts.map(e => e.reasoningEffort), defaultEffort: m.defaultReasoningEffort, description: m.description || '' })));
          if (msg.result?.nextCursor) send({ id: 2, method: 'model/list', params: { includeHidden: true, limit: 100, cursor: msg.result.nextCursor } });
          else finish(null, { source: 'Live Codex catalog', fetchedAt: new Date().toISOString(), models });
        }
      }
    });
    send({ id: 1, method: 'initialize', params: { clientInfo: { name: 'chain_studio', title: 'Chain Studio', version: '0.1.0' } } });
  });
}

export function validateStages(stages, catalog) {
  if (!Array.isArray(stages) || !stages.length || stages.length > 64) throw new Error('Choose between 1 and 64 stages.');
  return stages.map((s, index) => {
    const model = catalog.models.find(m => m.id === s.model);
    if (!model || !model.efforts.includes(s.effort)) throw new Error(`Stage ${index + 1}: unsupported model / reasoning combination. Refresh the model catalog.`);
    if (!['clarify', 'build', 'improve', 'review'].includes(s.role)) throw new Error('Unknown stage role.');
    return { model: model.id, effort: s.effort, role: s.role, instructions: String(s.instructions || '').slice(0, 12000) };
  });
}
