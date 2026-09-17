import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { readFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('../../',import.meta.url));
const bundle=readFileSync(`${root}.artifacts/radio-support-enabled/xtrata-radio.js`,'utf8');
const browser=await chromium.launch({channel:'chrome',headless:true});
mkdirSync(`${root}.artifacts/radio-support-layout`,{recursive:true});
try {
  for(const width of [1200,390]) for(const route of ['/','/radio.html']) {
    const page=await browser.newPage({viewport:{width,height:900}});
    await page.route('**/*',r=>{
      const url=new URL(r.request().url());
      if(url.origin!=='http://127.0.0.1:8799') return r.abort();
      if(url.pathname==='/xtrata-radio.js') return r.fulfill({contentType:'text/javascript',body:bundle});
      return r.continue();
    });
    await page.goto(`http://127.0.0.1:8799${route}`);
    if(route==='/') {
      // Homepage's Vite module build uses the default-off flag. Exercise the same
      // shared attachment against its real DOM, without introducing a global bridge.
      await page.evaluate(async()=>{
        const m=await import('/src/lib/radio/support/radio-panel.ts');
        m.attachRadioSupport(document);
      });
    }
    const shell=page.locator('[data-radio-support]'); await shell.waitFor();
    await shell.locator(':scope > summary').click();
    await shell.getByText('Listening free. Music Wallet integration is in development.').waitFor();
    assert.equal(await shell.count(),1);
    const box=await shell.boundingBox(); assert.ok(box.width<=width);
    assert.ok(box.x>=0 && box.x+box.width<=width+1);
    await shell.screenshot({path:`${root}.artifacts/radio-support-layout/${route==='/'?'home':'radio'}-${width}.png`});
    await page.close();
  }
  console.log('Both real page layouts passed at desktop/mobile widths. Standalone flag-on bundle verified; homepage attachment verified. Audio/payment tests are not part of this check.');
} finally {await browser.close();}
