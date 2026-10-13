import {createStacksWalletAdapter} from '../lib/wallet/adapter';
import {resolvePrimaryBnsName} from '../lib/bns/primary';
import {createNameCache} from '../lib/bns/name-cache';
const adapter=createStacksWalletAdapter({appName:'Xtrata Radio',appIcon:'/favicon.svg'});
const address=document.getElementById('radio-wallet-address')!;
const connect=document.getElementById('radio-wallet-connect') as HTMLButtonElement;
const disconnect=document.getElementById('radio-wallet-disconnect') as HTMLButtonElement;
const message=document.getElementById('radio-wallet-message')!;
let busy=false;
let lastAddress:string|undefined;
// The connected wallet is shown by its BNS name (jim.btc) once found; the address stays in the tooltip.
const names=createNameCache(a=>resolvePrimaryBnsName({address:a,network:'mainnet'}),()=>render());
// Pay-per-play (src/radio-ppp) marks a visitor who has no Stacks wallet connected but is using a passkey
// listening wallet: "Wallet not connected / Connect wallet" would contradict what they just made, so the
// bar says what they have and offers a Stacks wallet as an optional extra. Wallet holders see the usual bar.
const soloMark=()=>document.documentElement.dataset.pppSolo;
function render(){
 const session=adapter.getSession(),connected=session.isConnected&&!!session.address;
 const solo=connected?undefined:soloMark();
 address.textContent=connected?(names.get(session.network==='mainnet'?session.address:undefined)??session.address!):solo?(solo==='new'?'No wallet needed':'Listening wallet · '+solo):'Wallet not connected';
 address.title=connected?'Connected wallet · '+session.network+' · '+session.address:solo?'A passkey listening wallet on this device. A Stacks wallet is optional.':'';
 if(lastAddress!==session.address){lastAddress=session.address;window.dispatchEvent(new Event('xtrata:wallet-changed'));}
 connect.textContent=busy?'Please wait…':connected?'Switch wallet':solo?(document.documentElement.dataset.pppWalletInstalled==='1'?'Use a Stacks wallet instead':'I have a Stacks wallet'):'Connect wallet';
 connect.disabled=busy;disconnect.hidden=!connected;disconnect.disabled=busy;
}
async function act(action:()=>Promise<unknown>){
 if(busy)return;busy=true;message.textContent='';render();
 try{await action();}catch(error){message.textContent=error instanceof Error?error.message:'Wallet action failed. Please try again.';}
 finally{busy=false;render();}
}
connect.onclick=()=>void act(()=>adapter.connect());
disconnect.onclick=()=>void act(()=>adapter.disconnect());
window.addEventListener('focus',render);
window.addEventListener('xtrata:ppp-header',render);
window.addEventListener('storage',event=>{if(event.key===null||event.key==='xtrata.v15.1.wallet.session')render();});
render();
