import {describe,it,expect} from 'vitest';
import {eligibleSongDuration} from '../radio-listening-policy.mjs';

describe('paid-start duration eligibility',()=>{
 it.each([[59,false],[60,true],[61,true],[Number.NaN,false],[Infinity,false],[undefined,false]])('treats %s seconds as eligible=%s',(duration,expected)=>{
  expect(eligibleSongDuration(duration)).toBe(expected);
 });
});
