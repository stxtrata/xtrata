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
 document.querySelector<HTMLButtonElement>('#songs button')!.click();button('approve').click();await vi.waitFor(()=>expect(mocks.send).toHaveBeenCalledTimes(1));
 expect(mocks.send.mock.calls[0][0].sponsored).toBe(false);await vi.waitFor(()=>expect(document.getElementById('pending')?.textContent).toContain('pending'));expect(button('import').disabled).toBe(true);
 expect(document.querySelector('#songs')?.textContent).toContain('2');
});
