// @vitest-environment happy-dom
import {readFileSync} from 'node:fs';
import {beforeEach,afterEach,it,expect,vi} from 'vitest';
const mocks=vi.hoisted(()=>({connect:vi.fn(),disconnect:vi.fn(),sign:vi.fn(),provider:vi.fn(),id:vi.fn()}));
vi.mock('../../lib/wallet/connect',()=>({connectWallet:mocks.connect,disconnectWallet:mocks.disconnect,getStacksProvider:mocks.provider,getSelectedWalletProviderId:mocks.id}));
const owner='SP13MTGDX16JT7PVP60PSV6DQV422KZ8WXGXD34PY';
let complete:any[];
beforeEach(()=>{
 vi.resetModules();vi.clearAllMocks();mocks.id.mockReturnValue(null);localStorage.clear();complete=[];
 document.body.innerHTML=readFileSync('music/profile.html','utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'').replace(/<link\b[^>]*>/g,'');
 location.hash=btoa(JSON.stringify({id:'a'.repeat(64),supportProof:'b'.repeat(130)}));
 mocks.connect.mockResolvedValue({isConnected:true,address:owner,network:'mainnet'});
 mocks.provider.mockReturnValue({structuredDataSignatureRequest:mocks.sign});
 mocks.sign.mockResolvedValue({signature:'c'.repeat(130)});
 vi.stubGlobal('fetch',vi.fn(async(_u,o)=>{const d=JSON.parse(o.body);if(d.op==='complete')complete.push(d);return {ok:true,json:async()=>d.op==='review'?{challenge:{id:'a'.repeat(64),name:'jim.btc',action:'link',method:'signature',support:owner,owner,amount:1234,issued:Date.now(),expires:Date.now()+900000}}:{ok:true}};}));
});
afterEach(()=>vi.unstubAllGlobals());
async function init(){await import('../page');await vi.waitFor(()=>expect(document.querySelector('#profile-heading')!.textContent).toBe('Link jim.btc'));}
it('connects then signs without legacy user data, and disconnects visibly',async()=>{
 await init();(document.querySelector('#profile-sign') as HTMLElement).click();
 await vi.waitFor(()=>expect(complete).toHaveLength(1));expect(mocks.connect).toHaveBeenCalledOnce();expect(mocks.sign).toHaveBeenCalledOnce();
 const token=mocks.sign.mock.calls[0][0];const payload=JSON.parse(atob(token.split('.')[1].replace(/-/g,'+').replace(/_/g,'/')));expect(payload.stxAddress).toBe(owner);expect(payload.network.chainId).toBe(1);expect(payload.domain).toBeTruthy();expect(payload.message).toBeTruthy();
 expect(document.querySelector('#profile-wallet-address')!.textContent).toContain(owner);
 (document.querySelector('#profile-disconnect') as HTMLElement).click();await vi.waitFor(()=>expect(document.querySelector('#profile-wallet-address')!.textContent).toContain('Connect the wallet'));
});
it('blocks a connected account that does not own the name',async()=>{
 mocks.connect.mockResolvedValue({isConnected:true,address:'SP000000000000000000002Q6VF78',network:'mainnet'});await init();(document.querySelector('#profile-sign') as HTMLElement).click();await vi.waitFor(()=>expect(document.querySelector('#profile-status')!.textContent).toContain('does not own'));expect(mocks.sign).not.toHaveBeenCalled();expect(complete).toHaveLength(0);
});
it('keeps cancellation retryable without completing the link',async()=>{
 mocks.sign.mockRejectedValueOnce(Error('User cancelled'));await init();(document.querySelector('#profile-sign') as HTMLElement).click();await vi.waitFor(()=>expect(document.querySelector('#profile-status')!.textContent).toContain('User cancelled'));expect(complete).toHaveLength(0);(document.querySelector('#profile-sign') as HTMLElement).click();await vi.waitFor(()=>expect(complete).toHaveLength(1));
});

it('routes Xverse Bitcoin selection to its structured Stacks signing bridge',async()=>{
 mocks.id.mockReturnValue('XverseProviders.BitcoinProvider');mocks.provider.mockReturnValue({request:vi.fn()});vi.stubGlobal('XverseProviders',{StacksProvider:{structuredDataSignatureRequest:mocks.sign}});await init();(document.querySelector('#profile-sign') as HTMLElement).click();await vi.waitFor(()=>expect(complete).toHaveLength(1));expect(mocks.sign).toHaveBeenCalledOnce();
});
