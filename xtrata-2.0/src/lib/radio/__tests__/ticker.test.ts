import {describe,it,expect} from 'vitest';
import {radioTickerSections} from '../ticker';
describe('radio scrolling metadata',()=>{
 it('adds the album after title and artist',()=>{
  expect(radioTickerSections({title:'Song',artist:'Singer',album:'Night & Day'})).toEqual(['♪ Song','BY SINGER','ALBUM: Night & Day',null]);
 });
 it('preserves the original sequence when the next song has no album',()=>{
  radioTickerSections({title:'First',album:'Album'});
  expect(radioTickerSections({title:'Next',artist:'Singer'})).toEqual(['♪ Next','BY SINGER',null]);
  expect(radioTickerSections({title:'Unknown'})).toEqual(['♪ Unknown',null,null]);
 });
});
