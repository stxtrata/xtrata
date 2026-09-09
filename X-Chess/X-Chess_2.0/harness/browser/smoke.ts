import { IndexedDbStore } from '../../packages/storage/verified-cache.js';
const output = document.getElementById('results')!;
const results: Array<{name: string; passed: boolean; detail?: string}> = [];
const metrics: Record<string, number> = {};
function check(name: string, value: unknown, detail?: string): void {
  results.push({name, passed: !!value, detail}); output.textContent = JSON.stringify({results, metrics}, null, 2);
  if (!value) throw Error(name + ': ' + (detail ?? 'assertion failed'));
}
async function until(read: () => unknown, ms = 12_000): Promise<void> {
  const end = Date.now() + ms;
  while (!read()) { if (Date.now() >= end) throw Error('Timed out waiting for browser state'); await new Promise(r => setTimeout(r, 20)); }
}
const bridgeCalls: string[] = [];
let refusal = false;
window.addEventListener('message', async event => {
  if (event.origin !== location.origin || event.data?.type !== 'xtrata:wallet:request' || event.data.bridgeToken !== 'browser-test') return;
  bridgeCalls.push(event.data.method);
  const result = {type:'xtrata:wallet:response',requestId:event.data.requestId,ok:!refusal,
    ...(refusal ? {error:{message:'User rejected connection',code:4001}} : {result: {addresses:[{symbol:'STX',address:'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X'}]}})};
  (event.source as Window).postMessage(result, location.origin);
});
async function scenario(mode: string, refused: boolean): Promise<void> {
  refusal = refused; bridgeCalls.length=0;
  const frame = document.createElement('iframe'); frame.width='390'; frame.height='844';
  frame.src=`/scenario?mode=${mode}&wallet=${refused ? 'refuse' : 'stub'}${mode === 'framed' ? '&walletBridgeToken=browser-test' : ''}`;
  document.getElementById('scenarios')!.append(frame);
  await until(() => frame.contentDocument?.getElementById('game-preset'));
  const doc = frame.contentDocument!;
  const win = frame.contentWindow! as Window & {__testCalls:string[];__testErrors:string[]};
  const click = (id: string) => (doc.getElementById(id) as HTMLButtonElement).click();
  await until(() => doc.getElementById('chain-notice')?.textContent?.includes('format 1'));
  check(`${mode}/${refused}: one board`,doc.querySelectorAll('#board').length===1);
  check(`${mode}/${refused}: no horizontal overflow at 390px`,doc.documentElement.scrollWidth<=390, String(doc.documentElement.scrollWidth));
  click('connect');
  await until(() => /Connected as|cancelled/.test(doc.getElementById('chain-notice')?.textContent ?? ''));
  const calls = mode==='framed' ? bridgeCalls : win.__testCalls;
  check(`${mode}/${refused}: one connection request`,calls.length===1,JSON.stringify(calls));
  check(`${mode}/${refused}: correct connection outcome`,doc.getElementById('chain-notice')?.textContent?.includes(refused ? 'cancelled' : 'Connected as'));
  if (!refused) {
    const preset=doc.getElementById('game-preset') as HTMLSelectElement;
    preset.value='friend'; preset.dispatchEvent(new Event('change',{bubbles:true}));
    check(`${mode}: friend draft requires opponent`,(doc.getElementById('open-game') as HTMLButtonElement).disabled);
    preset.value='first-two'; preset.dispatchEvent(new Event('change',{bubbles:true}));
    check(`${mode}: first two preset validates`,!(doc.getElementById('open-game') as HTMLButtonElement).disabled);
    (doc.getElementById('join-game') as HTMLInputElement).value='1'; click('load-game');
    await until(() => doc.getElementById('chain-notice')?.textContent?.includes('Game 1 loaded'));
    check(`${mode}: loaded 64 squares`,doc.querySelectorAll('[data-square]').length===64);
    const board = doc.getElementById('board')!; board.focus();
    board.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));
    const square=board.dataset.focusSquare; click('flip');
    check(`${mode}: flip preserves keyboard square`,board.dataset.focusSquare===square);
    check(`${mode}: historical fee qualified`,doc.getElementById('fee-advice')?.textContent?.includes('not a confirmation guarantee'));
    const bounds=board.getBoundingClientRect();
    check(`${mode}: mobile board fits`,bounds.width<=390 && bounds.width>200 && Math.abs(bounds.width-bounds.height)<2);
  }
  click('quick-play-open');
  await until(()=>doc.querySelector('#xchess-peer[open]'));
  check(`${mode}/${refused}: peer mode opens in captured runtime`,doc.querySelectorAll('#peer-board [data-square]').length===64);
  (doc.querySelector('#xchess-peer [data-p=wallet]') as HTMLButtonElement).click();
  await until(()=>!(doc.querySelector('#xchess-peer [data-p=demo]') as HTMLButtonElement).disabled);
  check(`${mode}/${refused}: peer wallet outcome`,refused ? /reject|cancel/i.test(doc.querySelector('#xchess-peer [data-p=status]')?.textContent??'') : doc.querySelector('#xchess-peer [data-p=wallet-address]')?.textContent?.startsWith('SP'));
  check(`${mode}/${refused}: no uncaught errors`,win.__testErrors.length===0,JSON.stringify(win.__testErrors));
  frame.remove();
}
async function storage(): Promise<void> {
  const store = new IndexedDbStore('xchess-browser-regression'); await store.clear();
  const proto = IDBDatabase.prototype; const original=proto.transaction; let transactions=0;
  proto.transaction = function(this: IDBDatabase, ...args: Parameters<IDBDatabase['transaction']>) {transactions++;return original.apply(this,args);} as IDBDatabase['transaction'];
  try {
    const rows=Array.from({length:100},(_,i):[string,string]=>['key'+i,'value'+i]);
    let at=performance.now();
    for (const [k,v] of rows) await store.set(k,v);
    metrics.individualWriteMs=performance.now()-at; metrics.individualWriteTransactions=transactions;
    transactions=0; at=performance.now(); await store.setMany(rows);
    metrics.batchWriteMs=performance.now()-at; metrics.batchWriteTransactions=transactions;
    check('IndexedDB: 100 writes commit in one transaction',transactions===1);
    transactions=0;at=performance.now();const found=await store.getMany(rows.map(r=>r[0]));
    metrics.batchReadMs=performance.now()-at;metrics.batchReadTransactions=transactions;
    check('IndexedDB: 100 reads in one transaction',transactions===1);
    check('IndexedDB: all values round-trip',found.every((v,i)=>v===rows[i][1]));
    await store.clear(); check('IndexedDB: deletion is recoverable',(await store.get('key0'))===null);
  } finally {proto.transaction=original;}
}
(async () => {
  try {await storage();for (const mode of ['direct','framed']) for (const refused of [false,true]) await scenario(mode,refused);}
  catch(error) {results.push({name:'runner',passed:false,detail:String((error as Error).stack ?? error)});}
  const report={passed:results.length>0 && results.every(r=>r.passed),results,metrics,userAgent:navigator.userAgent};
  await fetch('/report',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(report)});
  output.textContent=JSON.stringify(report,null,2);document.title=report.passed?'PASS — X Chess browser tests':'FAIL — X Chess browser tests';
})();
