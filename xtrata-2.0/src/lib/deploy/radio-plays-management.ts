import { bufferCV, standardPrincipalCV, uintCV, validateStacksAddress, type ClarityValue } from '@stacks/transactions';
import { inspectRadioPlaysConfig, measureRadioPlay } from './radio-plays';

type Read = (name: string, args?: ClarityValue[]) => Promise<unknown>;
export function songArgs(core: string, id: string): ClarityValue[] {
  if (!/^[123]$/.test(core) || !/^(0|[1-9][0-9]*)$/.test(id) || BigInt(id) >= 2n ** 128n) throw new Error('Choose core 1–3 and a valid unsigned inscription ID.');
  return [uintCV(BigInt(core)), uintCV(BigInt(id))];
}
export function receiptArgs(payer: string, receipt: string): ClarityValue[] {
  if (!payer.startsWith('SP') || !validateStacksAddress(payer)) throw new Error('Enter the mainnet test wallet address (SP…).');
  const hex = receipt.replace(/^0x/, '');
  if (!/^[0-9a-fA-F]{32}$/.test(hex)) throw new Error('Receipt must be exactly 16 bytes: 32 hexadecimal characters.');
  return [standardPrincipalCV(payer), bufferCV(Uint8Array.from(hex.match(/../g)!, n => parseInt(n, 16)))];
}
export function renderRadioPlaysManagement(read: Read): HTMLElement {
  const root = document.createElement('section');
  const add = (tag: string, text: string) => { const e = document.createElement(tag); e.textContent = text; root.append(e); return e; };
  add('h3', '5. Contract checks and testing');
  add('p', 'Read-only tools: no wallet connection or fee required. This immutable contract has no administrator, pause, fee-setting, reset or withdrawal function. Stop controls in the test wallet stop only that wallet’s future payments.');
  add('h4', 'Backend wizard funding and automated tests');
  add('p', 'Start the local backend from the xtrata-2.0 folder. Its encrypted key stays in ignored local files; the browser only sends commands. No extension or deployer wallet is used.');
  add('pre', 'node scripts/wizard/radio-plays-server.mjs');
  const wizard = document.createElement('a'); wizard.href = 'http://127.0.0.1:8798'; wizard.target = '_blank'; wizard.rel = 'noopener noreferrer'; wizard.textContent = 'Open backend wizard: get address → confirm funds → run tests'; root.append(wizard);
  add('p', 'The local panel creates or retrieves the dedicated funding address, checks confirmed funds and runs explicitly approved bounded tests. Keep its backend process running. Funding alone never enables spending.');
  const output = add('pre', 'Choose a check below. Results are public chain data.');
  output.setAttribute('aria-live', 'polite');
  const buttons: HTMLButtonElement[] = [];
  const button = (label: string, action: () => Promise<unknown>) => {
    const b = document.createElement('button'); b.className = 'ghost'; b.textContent = label;
    b.onclick = async () => {
      buttons.forEach(x => x.disabled = true); output.textContent = `${label}…`;
      try { const result = await action(); output.textContent = `${label} · ${new Date().toISOString()}\n${JSON.stringify(result, null, 2)}`; }
      catch (error) { output.textContent = `${label} failed: ${error instanceof Error ? error.message : String(error)}`; }
      finally { buttons.forEach(x => x.disabled = false); }
    };
    buttons.push(b); root.append(b);
  };
  const field = (label: string, value: string) => {
    const l = document.createElement('label'); l.textContent = label;
    const i = document.createElement('input'); i.className = 'admin-input'; i.value = value;
    l.append(i); root.append(l); return i;
  };
  button('Check deployed configuration', async () => {
    const config = await read('get-config'); const problems = inspectRadioPlaysConfig(config);
    return { verified: problems.length === 0, problems, config };
  });
  button('Measure protected transaction offline', async () => {
    const size = await measureRadioPlay();
    return { ...size, baselineMicroSTX: size.bytes, note: 'Bytes × 1 microSTX is an offline baseline, not guaranteed fee acceptance. Holder payment is additional. Nothing signed or broadcast.' };
  });
  const core = field('Core selector (1, 2 or 3)', '3');
  const song = field('Master inscription ID', '2910');
  button('Read song owner and paid-play total', async () => {
    const args = songArgs(core.value.trim(), song.value.trim());
    const [owner, total] = await Promise.all([read('get-owner', args), read('get-total', args)]);
    return { core: core.value, song: song.value, owner, total, note: 'Lifetime paid starts, not browser listening statistics. Owner is current; historical recipients can differ. A zero total does not prove this ID exists or is audio.' };
  });
  const payer = field('Test wallet address', '');
  const receipt = field('Receipt hex from the test report', '');
  button('Look up payment receipt', async () => read('get-receipt', receiptArgs(payer.value.trim(), receipt.value.trim())));
  add('p', 'A receipt is wallet-scoped and is not the transaction ID. An empty optional value means no receipt is recorded for that wallet and receipt pair.');
  return root;
}
