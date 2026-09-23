import {it,expect} from 'vitest';
import {verifyProfileTransfer,resolveProfileOwner} from '../../lib/music-profile';
const issued=1700000000000,c={id:'a'.repeat(64),issued,expires:issued+900000,owner:'SPOWNER',support:'SPSUPPORT',amount:1234};
const txid='0x'+'b'.repeat(64);
const tx={tx_id:txid,tx_type:'token_transfer',sender_address:c.owner,tx_status:'success',canonical:true,is_unanchored:false,block_time:issued/1000+1,token_transfer:{recipient_address:c.support,amount:'1234',memo:'0x'+Buffer.from('XM'+c.id.slice(0,30)).toString('hex')}};
it('verifies exact confirmed transfer fields and nonce memo',()=>{expect(verifyProfileTransfer(c,tx,txid,null,issued+3000)).toBe('confirmed');for(const edit of [{sender_address:'wrong'},{canonical:false},{tx_status:'abort_by_response'},{is_unanchored:true},{sponsored:true},{block_time:issued/1000-60},{token_transfer:{...tx.token_transfer,amount:'1235'}},{token_transfer:{...tx.token_transfer,memo:'0x00'}}])expect(()=>verifyProfileTransfer(c,{...tx,...edit},txid,null,issued+3000)).toThrow();});
it('requires observing pending submission before expiry and caps delayed confirmation',()=>{
 const pending={...tx,tx_status:'pending',receipt_time:issued/1000+1};expect(verifyProfileTransfer(c,pending,txid,null,issued+3000)).toBe('pending');
 expect(()=>verifyProfileTransfer(c,pending,txid,null,c.expires+1)).toThrow();
 const delayed={...tx,block_time:(c.expires+10000)/1000};expect(verifyProfileTransfer(c,delayed,txid,issued+3000,c.expires+11000)).toBe('confirmed');expect(()=>verifyProfileTransfer(c,delayed,txid,issued+3000,c.expires+3600001)).toThrow();
});
it('rejects resolution aliases, expired names and managed non-standard owners',async()=>{
 for(const data of [{address:'SPALIAS'},{owner:'SP1.contract',status:'active',current_burn_block:10,renewal_height:20},{owner:'SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7',status:'expired',current_burn_block:10,renewal_height:5}])await expect(resolveProfileOwner('jim.btc',async()=>Response.json(data))).rejects.toThrow();
});
