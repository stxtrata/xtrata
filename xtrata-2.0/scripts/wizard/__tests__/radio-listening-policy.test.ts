import {describe,it,expect} from 'vitest';
import {eligibleSongDuration} from '../radio-listening-policy.mjs';

describe('temporary paid-start duration policy',()=>{
 it.each([59,60,61,Number.NaN,Infinity,undefined])('allows %s seconds while the duration gate is disabled',duration=>{
  expect(eligibleSongDuration(duration)).toBe(true);
 });
});
