import assert from 'node:assert/strict';
import {offlineRenderSupport} from '../daw/js/audio-render-support.js';
import {serve,browser,page} from './serve.mjs';
import {checkOfflinePolicy} from './offline-policy-checks.mjs';
const fixtures=[
  ['desktop Chrome',{userAgent:'Mozilla/5.0 AppleWebKit/537.36 Chrome/130.0.0.0 Safari/537.36'},true],
  ['desktop Edge',{userAgent:'Mozilla/5.0 AppleWebKit/537.36 Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0'},true],
  ['Firefox',{userAgent:'Mozilla/5.0 Gecko/20100101 Firefox/132.0'},true],
  ['Safari',{userAgent:'Mozilla/5.0 (Macintosh) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15'},false],
  ...['CriOS','FxiOS','EdgiOS'].map(brand=>[brand,{userAgent:`Mozilla/5.0 (iPhone) AppleWebKit/605.1.15 ${brand}/132.0 Mobile/15E148 Safari/604.1`},false]),
  ['desktop-mode iPad',{userAgent:'Mozilla/5.0 (Macintosh) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15',platform:'MacIntel',maxTouchPoints:5},false],
];
for(const[label,browser,supported]of fixtures)assert.equal(offlineRenderSupport(browser).supported,supported,label);
const {srv,url}=await serve(),b=await browser(),logs=[];
try{const p=await page(b,url,{logs}),result=await checkOfflinePolicy(p,url);assert.equal(result.support.supported,process.env.AUDIONAUT_TEST_BROWSER!=='webkit');assert.deepEqual(logs.filter(l=>l.startsWith('pageerror')),[]);console.log(JSON.stringify(result));console.log('PASS offline delivery policy: browser detection, public API/UI restrictions, project/MIDI export, musical edits, sample worker and live piano');}finally{await b.close();await new Promise(r=>srv.close(r));}
