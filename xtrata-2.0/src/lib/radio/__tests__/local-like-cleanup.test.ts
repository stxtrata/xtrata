import {expect,it,vi} from 'vitest';
import {removeConfirmedLocalLikes} from '../local-like-cleanup';
function store(initial:string){let value:string|null=initial;return {getItem:()=>value,setItem:vi.fn((_k:string,v:string)=>{value=v;}),removeItem:vi.fn(()=>{value=null;})};}
it('removes confirmed IDs including duplicates while retaining unimported and newly saved songs',()=>{
 const s=store(JSON.stringify([{tokenId:'1'},{tokenId:1},{tokenId:'2'},{tokenId:'new',title:'Keep'}]));
 expect(removeConfirmedLocalLikes([1],s)).toBe(2);
 expect(JSON.parse(s.getItem()!)).toEqual([{tokenId:'2'},{tokenId:'new',title:'Keep'}]);
 expect(removeConfirmedLocalLikes([1],s)).toBe(0);
});
it('removes the storage key after the final import',()=>{
 const s=store('[{"tokenId":"1"}]');expect(removeConfirmedLocalLikes(['1'],s)).toBe(1);expect(s.getItem()).toBeNull();
});
it('keeps unconfirmed, malformed or inaccessible storage unchanged',()=>{
 const s=store('[{"tokenId":"1"}]');expect(removeConfirmedLocalLikes([],s)).toBe(0);expect(s.setItem).not.toHaveBeenCalled();
 const bad=store('{broken');expect(removeConfirmedLocalLikes([1],bad)).toBe(0);expect(bad.getItem()).toBe('{broken');
 expect(removeConfirmedLocalLikes([1],{...s,getItem:()=>{throw Error('blocked');}})).toBe(0);
});
