import {describe,it,expect} from 'vitest';
import {ARTIST_CREDITS,radioArtist,radioTitle} from '../artist-credits.mjs';
describe('provided artist credits',()=>{
 it('corrects uploader aliases by exact inscription ID',()=>{
  expect(radioArtist(2885,'jimdotbtc')).toBe('Audionals');
  expect(radioArtist('577','jimdotbtc')).toBe('Cicada');
  expect(radioArtist(312,'')).toBe('Hundred Little Reasons');
  expect(radioArtist(315,'')).toBe('melophonic');
 });
 it('does not infer credits from similar song titles or blank assignments',()=>{
  for(const id of [1731,2969,2983,2989,1091,99999])expect(radioArtist(id,'Existing artist')).toBe('Existing artist');
  expect(Object.keys(ARTIST_CREDITS).length).toBe(43);
  expect(Object.values(ARTIST_CREDITS).every(Boolean)).toBe(true);
 });
});

it('uses the confirmed titles for 312 and 315',()=>{expect(radioTitle(312,'Inscription #312')).toBe('Smalltalk');expect(radioTitle('315','')).toBe('Entertainment');expect(radioTitle(999,'Unchanged')).toBe('Unchanged');});
