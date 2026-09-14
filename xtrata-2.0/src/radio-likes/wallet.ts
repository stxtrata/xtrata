import {createStacksWalletAdapter} from '../lib/wallet/adapter';
const adapter=createStacksWalletAdapter({appName:'Xtrata Radio',appIcon:'/favicon.svg'});
const address=document.getElementById('radio-wallet-address')!;
const connect=document.getElementById('radio-wallet-connect') as HTMLButtonElement;
const disconnect=document.getElementById('radio-wallet-disconnect') as HTMLButtonElement;
const message=document.getElementById('radio-wallet-message')!;
let busy=false;
function render(){
 const session=adapter.getSession(),connected=session.isConnected&&!!session.address;
 address.textContent=connected?session.address!:'Wallet not connected';
 address.title=connected?'Connected wallet · '+session.network:'';
 connect.textContent=busy?'Please wait…':connected?'Switch wallet':'Connect wallet';
 connect.disabled=busy;disconnect.hidden=!connected;disconnect.disabled=busy;
}
async function act(action:()=>Promise<unknown>){
 if(busy)return;busy=true;message.textContent='';render();
 try{await action();}catch(error){message.textContent=error instanceof Error?error.message:'Wallet action failed. Please try again.';}
 finally{busy=false;render();window.dispatchEvent(new Event('xtrata:wallet-changed'));}
}
connect.onclick=()=>void act(()=>adapter.connect());
disconnect.onclick=()=>void act(()=>adapter.disconnect());
window.addEventListener('focus',render);
window.addEventListener('storage',event=>{if(event.key===null||event.key==='xtrata.v15.1.wallet.session')render();});
render();
