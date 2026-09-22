import {describe,it,expect} from 'vitest';
import {releaseDownloadVersion,releasePlatformsForRuntime,verifiedReleaseForPlatforms} from '../music-release-policy.mjs';

const preview={version:'1.0.1',channel:'preview',downloads:[
 {platform:'mac-universal',verified:true,preview:true,signed:false},
 {platform:'win-x64',verified:true,preview:true,signed:false},
]};
describe('desktop release platform policy',()=>{
 it('derives an empty or exact compatible set when callers do not supply one',()=>{
  expect(releasePlatformsForRuntime('win32','x64')).toEqual(['win-x64']);
  expect(releasePlatformsForRuntime('win32','arm64')).toEqual([]);
  expect(releasePlatformsForRuntime('darwin','x64')).toEqual(['mac-universal','mac-x64']);
  expect(releasePlatformsForRuntime('darwin','arm64')).toEqual(['mac-universal','mac-arm64']);
  expect(releasePlatformsForRuntime('linux','x64')).toEqual([]);
 });
 it('offers only a verified compatible release',()=>{
  expect(verifiedReleaseForPlatforms(preview,['win-x64'])).toBe('1.0.1');
  expect(verifiedReleaseForPlatforms(preview,['linux-x64'])).toBeNull();
  expect(verifiedReleaseForPlatforms({...preview,downloads:[preview.downloads[0]]},['win-x64'])).toBeNull();
 });
 it('uses the version attached to the compatible download when platforms publish independently',()=>{
  const independent={...preview,version:'1.0.2',downloads:[
   {...preview.downloads[0],version:'1.0.2'},
   {...preview.downloads[1],version:'1.0.1'},
  ]};
  expect(releaseDownloadVersion(independent,independent.downloads[1])).toBe('1.0.1');
  expect(verifiedReleaseForPlatforms(independent,['win-x64'])).toBe('1.0.1');
  expect(verifiedReleaseForPlatforms(independent,['mac-universal'])).toBe('1.0.2');
 });
 it('does not treat unsigned non-preview or unverified assets as updates',()=>{
  expect(verifiedReleaseForPlatforms({...preview,channel:'stable'},['win-x64'])).toBeNull();
  expect(verifiedReleaseForPlatforms({...preview,downloads:[{platform:'win-x64',verified:false,preview:true,signed:false}]},['win-x64'])).toBeNull();
  expect(verifiedReleaseForPlatforms({version:'1.0.1-preview',downloads:preview.downloads},['win-x64'])).toBeNull();
 });
});
