// @vitest-environment happy-dom
import {readFileSync} from 'node:fs';
import {expect,it} from 'vitest';
import {aggregateHeroes,tierFor,stx,mountHeroes} from '../../../public/radio/music-heroes.mjs';
const play=(txid:string,payer='SPONE',id=1)=>({txid,payer,id,core:3,amount:50,recipient:'SPHOLDER'});
it('deduplicates payments, ranks ties equally and separates core metadata',()=>{
 const rows=aggregateHeroes([play('a'),play('a'),play('b'),play('c','SPTWO'),play('d','SPTWO'),{...play('e','SPTHREE'),core:2}],new Map([[1,{title:'Track',artist:'Artist'}]]));
 expect(rows.map(w=>[w.address,w.count,w.rank])).toEqual([['SPONE',2,1],['SPTWO',2,1],['SPTHREE',1,3]]);
 expect(rows[0].amount).toBe(100n);expect(rows[0].songs[0].title).toBe('Track');expect(rows[2].songs[0].title).toBe('Song #1');
});
it('uses exact amounts and tier boundaries',()=>{
 expect(stx(1000001n)).toBe('1.000001');
 for(const [n,name] of [[99,'First Supporter'],[100,'Bronze'],[999,'Bronze'],[1000,'Silver'],[10000,'Gold'],[100000,'Platinum'],[1000000,'Diamond']] as const)expect(tierFor(n)[1]).toBe(name);
});
it('does not claim partially dated history is complete',()=>{
 const [w]=aggregateHeroes([play('a'),{...play('b'),timestamp:1700000000000}]);expect(w.timingComplete).toBe(false);expect(w.activeDays).toBe(1);
});
it('renders, filters, preserves expanded profiles and treats metadata as text',()=>{
 document.body.innerHTML=readFileSync('music/heroes.html','utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'').replace(/<link\b[^>]*>/g,'');mountHeroes();
 const reader=document.querySelector('[data-heroes-reader]')!;
 const detail={plays:[play('a')],tracks:new Map([[1,{title:'<img src=x onerror=alert(1)>',artist:'Artist'}]]),complete:true,status:'Checked'};
 reader.dispatchEvent(new CustomEvent('paid-history',{detail}));
 expect(document.querySelector('#hero-totals')!.textContent).toContain('1 paid plays');
 (document.querySelector('.hero-card') as HTMLDetailsElement).open=true;
 reader.dispatchEvent(new CustomEvent('paid-history',{detail}));expect((document.querySelector('.hero-card') as HTMLDetailsElement).open).toBe(true);
 expect(document.querySelector('#heroes-list img')).toBeNull();
 const search=document.querySelector('#hero-search') as HTMLInputElement;search.value='missing';search.dispatchEvent(new Event('input'));expect(document.querySelector('#heroes-list')!.textContent).toContain('No matching');
});
