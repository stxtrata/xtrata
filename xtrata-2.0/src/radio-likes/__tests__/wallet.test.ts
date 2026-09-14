// @vitest-environment happy-dom
import {beforeEach,it,expect,vi} from 'vitest';
const mock=vi.hoisted(()=>({session:{isConnected:false,address:undefined as string|undefined,network:'mainnet'},connect:vi.fn(),disconnect:vi.fn()}));
vi.mock('../../lib/wallet/adapter',()=>({createStacksWalletAdapter:()=>({getSession:()=>mock.session,connect:mock.connect,disconnect:mock.disconnect})}));
beforeEach(()=>{vi.resetModules();mock.session={isConnected:false,address:undefined,network:'mainnet'};mock.connect.mockReset();mock.disconnect.mockReset();document.body.innerHTML='<span id="radio-wallet-address"></span><button id="radio-wallet-connect"></button><button id="radio-wallet-disconnect"></button><span id="radio-wallet-message"></span>';});
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
