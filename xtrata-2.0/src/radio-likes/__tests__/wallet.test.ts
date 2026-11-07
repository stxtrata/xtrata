// @vitest-environment happy-dom
import {beforeEach,it,expect,vi} from 'vitest';
const bns=vi.hoisted(()=>({resolve:vi.fn()}));
vi.mock('../../lib/bns/primary',()=>({resolvePrimaryBnsName:bns.resolve}));
const mock=vi.hoisted(()=>({session:{isConnected:false,address:undefined as string|undefined,network:'mainnet'},connect:vi.fn(),disconnect:vi.fn()}));
vi.mock('../../lib/wallet/adapter',()=>({createStacksWalletAdapter:()=>({getSession:()=>mock.session,connect:mock.connect,disconnect:mock.disconnect})}));
beforeEach(()=>{vi.resetModules();bns.resolve.mockReset();bns.resolve.mockResolvedValue(null);mock.session={isConnected:false,address:undefined,network:'mainnet'};mock.connect.mockReset();mock.disconnect.mockReset();document.body.innerHTML='<span id="radio-wallet-address"></span><button id="radio-wallet-connect"></button><button id="radio-wallet-disconnect"></button><span id="radio-wallet-message"></span>';});
it('connects and disconnects through the shared adapter and refreshes the radio',async()=>{
 mock.connect.mockImplementation(async()=>{mock.session={isConnected:true,address:'SP-test',network:'mainnet'};});mock.disconnect.mockImplementation(async()=>{mock.session.isConnected=false;});
 const changed=vi.fn();window.addEventListener('xtrata:wallet-changed',changed);
 await import('../wallet');(document.getElementById('radio-wallet-connect') as HTMLButtonElement).click();
 await vi.waitFor(()=>expect(document.getElementById('radio-wallet-address')?.textContent).toBe('SP-test'));
 expect(changed).toHaveBeenCalledTimes(1);expect(document.getElementById('radio-wallet-disconnect')?.hidden).toBe(false);
 (document.getElementById('radio-wallet-disconnect') as HTMLButtonElement).click();
 await vi.waitFor(()=>expect(document.getElementById('radio-wallet-address')?.textContent).toBe('Wallet not connected'));
 window.removeEventListener('xtrata:wallet-changed',changed);
});
it('restores the connected wallet and shows connection errors without losing it',async()=>{
 mock.session={isConnected:true,address:'SP-existing',network:'mainnet'};mock.connect.mockRejectedValue(Error('Cancelled'));
 await import('../wallet');expect(document.getElementById('radio-wallet-address')?.textContent).toBe('SP-existing');
 (document.getElementById('radio-wallet-connect') as HTMLButtonElement).click();
 await vi.waitFor(()=>expect(document.getElementById('radio-wallet-message')?.textContent).toBe('Cancelled'));
 expect(document.getElementById('radio-wallet-address')?.textContent).toBe('SP-existing');
});
it('shows the connected wallet by its BNS name once found, with the address in the tooltip, and the address until then',async()=>{
 let found:(n:string)=>void=()=>{};
 bns.resolve.mockImplementation(()=>new Promise<string|null>(r=>{found=r;}));
 mock.session={isConnected:true,address:'SP-jim',network:'mainnet'};
 await import('../wallet');const label=document.getElementById('radio-wallet-address')!;
 expect(label.textContent).toBe('SP-jim');
 found('jim.btc');
 await vi.waitFor(()=>expect(label.textContent).toBe('jim.btc'));
 expect(label.title).toContain('SP-jim');
 expect(bns.resolve).toHaveBeenCalledWith({address:'SP-jim',network:'mainnet'});
});
it('keeps the address when the wallet has no name, and does not look names up on a test network',async()=>{
 mock.session={isConnected:true,address:'SP-plain',network:'mainnet'};
 await import('../wallet');await new Promise(r=>setTimeout(r,0));
 expect(document.getElementById('radio-wallet-address')?.textContent).toBe('SP-plain');
 vi.resetModules();bns.resolve.mockClear();
 mock.session={isConnected:true,address:'ST-test',network:'testnet'};
 await import('../wallet');
 expect(document.getElementById('radio-wallet-address')?.textContent).toBe('ST-test');
 expect(bns.resolve).not.toHaveBeenCalled();
});
it('asks the radio connect pop-up first, and opens the Stacks chooser only when Xverse or Leather is picked',async()=>{
 const w=window as unknown as {XtrataRadioConnectChooser?:()=>Promise<string|null>;XtrataRadioConnectStacks?:()=>void};
 const answers:(string|null)[]=['music',null,'stacks'];const chooser=vi.fn(async()=>answers.shift()??null);w.XtrataRadioConnectChooser=chooser;
 document.documentElement.dataset.pppSolo='new';
 try{
  await import('../wallet');const btn=document.getElementById('radio-wallet-connect') as HTMLButtonElement;
  expect(btn.textContent).toBe('Connect wallet');
  btn.click();await vi.waitFor(()=>expect(chooser).toHaveBeenCalledTimes(1));await new Promise(r=>setTimeout(r,0));
  expect(mock.connect).not.toHaveBeenCalled(); // Xtrata Music Wallet picked: the page takes it from there
  btn.click();await vi.waitFor(()=>expect(chooser).toHaveBeenCalledTimes(2));await new Promise(r=>setTimeout(r,0));
  expect(mock.connect).not.toHaveBeenCalled(); // closed
  btn.click();await vi.waitFor(()=>expect(mock.connect).toHaveBeenCalledTimes(1));
  // The panel's own "I have a Stacks wallet" goes straight to the Stacks chooser.
  w.XtrataRadioConnectStacks!();await vi.waitFor(()=>expect(mock.connect).toHaveBeenCalledTimes(2));
  expect(chooser).toHaveBeenCalledTimes(3);
 }finally{delete w.XtrataRadioConnectChooser;delete document.documentElement.dataset.pppSolo;}
});
it('skips the pop-up once an Xtrata Music Wallet is in use: the button only adds a Stacks wallet',async()=>{
 const w=window as unknown as {XtrataRadioConnectChooser?:()=>Promise<string|null>};
 const chooser=vi.fn(async()=>'music');w.XtrataRadioConnectChooser=chooser;document.documentElement.dataset.pppSolo='SP12…ABCD';
 try{
  await import('../wallet');const btn=document.getElementById('radio-wallet-connect') as HTMLButtonElement;
  expect(btn.textContent).toBe('I have a Stacks wallet');
  btn.click();await vi.waitFor(()=>expect(mock.connect).toHaveBeenCalledTimes(1));expect(chooser).not.toHaveBeenCalled();
 }finally{delete w.XtrataRadioConnectChooser;delete document.documentElement.dataset.pppSolo;}
});
