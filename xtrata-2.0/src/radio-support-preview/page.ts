import { mountSupportPanel } from '../lib/radio/support/panel';
import { exampleStatus, fakeCompanion } from '../lib/radio/support/fake';
import type { Page, Status } from '../lib/radio/support/protocol';
const pages: Page[] = [{ entries: [{ id: '01'.repeat(16), core: 3, masterId: 2910, title: 'Example song', artist: 'Example artist', state: 'unknown', startedAt: '2026-09-17T12:00:00.000Z', fee: null, holder: null, txid: null }], next: null }];
let panel: ReturnType<typeof mountSupportPanel>;
const select = document.querySelector('select')!;
function render() {
  panel?.dispose();
  const status = structuredClone(exampleStatus), choice = select.value;
  if (choice === 'locked') status.locked = true;
  if (choice === 'paused') status.enabled = false;
  if (choice === 'empty') { status.confirmed = '1000'; status.reserved = '0'; status.usable = '0'; status.pending = 0; }
  if (['offline','recovery','active-elsewhere'].includes(choice)) status.attention = choice as Status['attention'];
  const bridge = choice === 'absent' ? undefined : choice === 'timeout' ? { status: () => new Promise(() => {}), history: () => new Promise(() => {}) } : fakeCompanion(status, pages);
  panel = mountSupportPanel(document.querySelector('main')!, bridge);
}
select.onchange = render; render();
