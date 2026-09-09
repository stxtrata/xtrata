// Reuse the exercised V2 provider, cancellation, timeout and postcondition code.
import {collectProviders} from '../../X-Chess_2.0/packages/wallet/providers';
import {connectWallet} from '../../X-Chess_2.0/packages/wallet/connect';
import {walletRequest, contractCallParams} from '../../X-Chess_2.0/packages/wallet/requests';
import {guardFor} from '../../X-Chess_2.0/packages/wallet/postconditions';
import {makeEndpoint} from '../../X-Chess_2.0/packages/chain/endpoint';
const entryFor = (provider: any) => collectProviders().find(e=>e.provider===provider) ?? {
  provider, label:'Selected wallet', hasRequest:true, hasTransactionRequest:false
};
(globalThis as any).XChessWallet = {
  makeRead: (network: any, override?: string) => makeEndpoint({network,override,document}),
  providers: () => collectProviders().filter(e=>e.hasRequest).map(e=>({name:e.label,get:()=>e.provider})),
  async connect(provider: any, network: string) {
    const {address}=await connectWallet({providerCount:()=>1,
      call:async(method,params,options)=>({result:await walletRequest(entryFor(provider),method,params,options)})});
    if (!(network==='mainnet' ? /^S[PM]/ : /^S[TN]/).test(address)) throw Error('no-wallet-address-for-network');
    return address;
  },
  async sign(provider: any, params: any) {
    const entry=entryFor(provider);
    const senderSends=params.postConditions.filter((p:any)=>p.address!==params.contract).reduce((a:bigint,p:any)=>a+BigInt(p.amount),0n);
    const contractSends=params.postConditions.filter((p:any)=>p.address===params.contract).reduce((a:bigint,p:any)=>a+BigInt(p.amount),0n);
    const guard=guardFor({sender:null,contractId:params.contract,sends:senderSends,contractSends});
    return walletRequest(entry,'stx_callContract',contractCallParams(entry,{...params,...guard}));
  }
};
