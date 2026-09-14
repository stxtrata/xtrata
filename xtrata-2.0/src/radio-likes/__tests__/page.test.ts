// @vitest-environment happy-dom
import {readFileSync} from 'node:fs';
import {afterEach,beforeEach,it,expect,vi} from 'vitest';
const mocks=vi.hoisted(()=>({session:{isConnected:false,address:undefined as string|undefined,network:undefined as string|undefined},send:vi.fn()}));
vi.mock('../../lib/wallet/adapter',()=>({createStacksWalletAdapter:()=>({getSession:()=>mocks.session,connect:async()=>{mocks.session={isConnected:true,address:'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',network:'mainnet'};return mocks.session;},disconnect:async()=>{mocks.session={isConnected:false,address:undefined,network:undefined};}})}));
vi.mock('../../lib/wallet/connect',()=>({showContractCall:mocks.send}));
const config={enabled:true,contract:'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.radio-likes',network:'mainnet',batchLimit:25,platformFee:0};
beforeEach(()=>{vi.resetModules();mocks.send.mockReset();mocks.session={isConnected:false,address:undefined,network:undefined};localStorage.clear();document.documentElement.innerHTML=readFileSync('public/radio/endorse.html','utf8').replace(/<script[\s\S]*?<\/script>/g,'').replace(/<link[^>]*>/g,'');
 vi.stubGlobal('fetch',vi.fn(async(input:string)=>{const url=new URL(input,'https://test');let body:any=config;if(url.pathname==='/radio/counts')body={tracks:[{id:1,title:'First'},{id:2,title:'Second'}]};else if(url.searchParams.has('ids'))body={...config,rows:[{id:1,liked:false,total:'2'},{id:2,liked:true,total:'5'}]};return new Response(JSON.stringify(body));}));
});
afterEach(()=>{vi.unstubAllGlobals();document.body.replaceChildren();});
const button=(id:string)=>document.getElementById(id) as HTMLButtonElement;
it('never sends transactions on connect or import review; cancellation is safe',async()=>{
 localStorage.setItem('xtrata.radio.likes',JSON.stringify([{tokenId:'1'},{tokenId:'2'}]));
 await import('../page');await vi.waitFor(()=>expect(document.querySelectorAll('#songs tr')).toHaveLength(2));button('connect').click();await vi.waitFor(()=>expect(button('import').disabled).toBe(false));
 expect(mocks.send).not.toHaveBeenCalled();button('import').click();expect(document.querySelectorAll('#choices input')).toHaveLength(1);expect(document.getElementById('choices')?.textContent).toContain('First');expect(mocks.send).not.toHaveBeenCalled();button('cancel').click();expect(mocks.send).not.toHaveBeenCalled();
});
it('sends only after approval, then blocks duplicate requests while confirmation is pending',async()=>{
 mocks.send.mockImplementation(options=>options.onFinish({txId:'0x'+'a'.repeat(64)}));
 await import('../page');button('connect').click();await vi.waitFor(()=>expect(button('import').disabled).toBe(false));
 document.querySelector<HTMLButtonElement>('#songs button')!.click();await vi.waitFor(()=>expect(button('approve').disabled).toBe(false));button('approve').click();await vi.waitFor(()=>expect(mocks.send).toHaveBeenCalledTimes(1));
 expect(mocks.send.mock.calls[0][0].sponsored).toBe(false);expect(mocks.send.mock.calls[0][0].fee).toBe(200n);expect(document.getElementById('fee-reminder')?.textContent).toContain('0.0002 STX');await vi.waitFor(()=>expect(document.getElementById('pending')?.textContent).toContain('pending'));expect(button('import').disabled).toBe(true);
 expect(document.querySelector('#songs')?.textContent).toContain('2');
});
it('reports account preflight and recovery separately without logging wallet addresses or favourite titles',async()=>{
 mocks.send.mockImplementation(options=>{
  options.onProgress('account-read');
  expect(document.getElementById('status')?.textContent).toContain('transaction prompt has not been requested');
  options.onProgress('account-read-failed');options.onProgress('account-reconnect');
  expect(document.getElementById('status')?.textContent).toContain('account access');
  options.onError(new Error('Simulated account timeout'));
 });
 await import('../page');button('connect').click();await vi.waitFor(()=>expect(button('import').disabled).toBe(false));
 document.querySelector<HTMLButtonElement>('#songs button')!.click();await vi.waitFor(()=>expect(button('approve').disabled).toBe(false));button('approve').click();
 await vi.waitFor(()=>expect(document.getElementById('status')?.textContent).toBe('Simulated account timeout'));
 const log=document.getElementById('diagnostics')?.textContent||'';
 expect(log).toContain('account-read');expect(log).toContain('account-reconnect');expect(log).toContain('WALLET_ERROR');expect(log).toContain('WALLET_FLOW_SETTLED');
 expect(log).not.toContain(mocks.session.address);expect(log).not.toContain('First');
 expect(button('connect').disabled).toBe(false);
});
it('shows a fee suggestion before approval and updates it when the selection changes',async()=>{
 await import('../page');button('connect').click();await vi.waitFor(()=>expect(button('import').disabled).toBe(false));
 document.querySelector<HTMLButtonElement>('#songs button')!.click();
 await vi.waitFor(()=>expect(document.getElementById('fee-suggestion')?.textContent).toContain('0.0002 STX'));
 expect(document.getElementById('fee-suggestion')?.textContent).toContain('Pay no more');
 const checkbox=document.querySelector<HTMLInputElement>('#choices input')!;
 checkbox.checked=false;checkbox.dispatchEvent(new Event('change',{bubbles:true}));
 expect(button('approve').disabled).toBe(true);
 expect(document.getElementById('fee-suggestion')?.textContent).toBe('Select at least one song.');
 expect(mocks.send).not.toHaveBeenCalled();
});
it('keeps local favourites while an import is pending, then removes only confirmed likes',async()=>{
 mocks.session={isConnected:true,address:'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',network:'mainnet'};
 localStorage.setItem('xtrata.radio.likes',JSON.stringify([{tokenId:'1'},{tokenId:'2'},{tokenId:'3'}]));
 const key=`xtrata.radio.chain.pending:${config.contract}:${mocks.session.address}`;
 localStorage.setItem(key,'0x'+'b'.repeat(64));
 const original=globalThis.fetch;let confirmed=false;
 vi.stubGlobal('fetch',vi.fn(async(input:string)=>new URL(input,'https://test').searchParams.has('txid')?new Response(JSON.stringify({status:confirmed?'confirmed':'pending'})):original(input)));
 await import('../page');await vi.waitFor(()=>expect(document.getElementById('pending')?.textContent).toContain('pending'));
 expect(JSON.parse(localStorage.getItem('xtrata.radio.likes')!)).toHaveLength(3);
 confirmed=true;button('refresh').click();await vi.waitFor(()=>expect(localStorage.getItem(key)).toBeNull());
 expect(JSON.parse(localStorage.getItem('xtrata.radio.likes')!)).toEqual([{tokenId:'1'},{tokenId:'3'}]);
});
it('reconciles older confirmed imports on load without publishing anything',async()=>{
 mocks.session={isConnected:true,address:'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',network:'mainnet'};
 localStorage.setItem('xtrata.radio.likes',JSON.stringify([{tokenId:'2'}]));
 await import('../page');await vi.waitFor(()=>expect(localStorage.getItem('xtrata.radio.likes')).toBeNull());
 expect(document.getElementById('import-offer')?.textContent).toBe('');expect(mocks.send).not.toHaveBeenCalled();
});
it('retains a favourite when its import transaction fails',async()=>{
 mocks.session={isConnected:true,address:'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',network:'mainnet'};
 const saved=JSON.stringify([{tokenId:'1'}]);localStorage.setItem('xtrata.radio.likes',saved);
 const key=`xtrata.radio.chain.pending:${config.contract}:${mocks.session.address}`;localStorage.setItem(key,'0x'+'c'.repeat(64));
 const original=globalThis.fetch;
 vi.stubGlobal('fetch',vi.fn(async(input:string)=>new URL(input,'https://test').searchParams.has('txid')?new Response(JSON.stringify({status:'failed'})):original(input)));
 await import('../page');await vi.waitFor(()=>expect(localStorage.getItem(key)).toBeNull());
 expect(localStorage.getItem('xtrata.radio.likes')).toBe(saved);
});
it('opens the selected song review directly with its confirmed unlike state, without sending',async()=>{
 history.replaceState(null,'','/?id=2&action=review');
 mocks.session={isConnected:true,address:'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',network:'mainnet'};
 try{
  await import('../page');await vi.waitFor(()=>expect((document.getElementById('review') as HTMLDialogElement).open).toBe(true));
  expect(document.querySelectorAll('#songs tr')).toHaveLength(1);
  expect(document.getElementById('choices')?.textContent).toContain('Unlike #2');
  expect(document.querySelector('#songs')?.textContent).toContain('5');expect(mocks.send).not.toHaveBeenCalled();
 }finally{history.replaceState(null,'','/');}
});
it('keeps the direct song selection through wallet connection',async()=>{
 history.replaceState(null,'','/?id=1&action=review');
 try{
  await import('../page');await vi.waitFor(()=>expect(document.querySelectorAll('#songs tr')).toHaveLength(1));
  expect((document.getElementById('review') as HTMLDialogElement).open).toBe(false);
  button('connect').click();await vi.waitFor(()=>expect((document.getElementById('review') as HTMLDialogElement).open).toBe(true));
  expect(document.getElementById('choices')?.textContent).toContain('Like #1');expect(mocks.send).not.toHaveBeenCalled();
 }finally{history.replaceState(null,'','/');}
});
it('retries a failed state read and displays the recovered global count',async()=>{
 const original=globalThis.fetch;let failed=false;
 vi.stubGlobal('fetch',vi.fn(async(input:string)=>{if(new URL(input,'https://test').searchParams.has('ids')&&!failed){failed=true;throw Error('temporary');}return original(input);}));
 await import('../page');await vi.waitFor(()=>expect(document.getElementById('status')?.textContent).toContain('Confirmed on-chain likes'));
 expect(document.querySelector('#songs')?.textContent).toContain('5');
});
