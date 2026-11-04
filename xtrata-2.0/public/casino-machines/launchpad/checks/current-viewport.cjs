// Run with Playwright installed, or set PLAYWRIGHT_MODULE to its path.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { writeFile } = require('node:fs/promises');
const { resolve } = require('node:path');
const { pathToFileURL } = require('node:url');
const assert = require('node:assert/strict');
const root = resolve(__dirname, '..');
const resultPath = name => resolve(__dirname, 'results', name);
const sizes = [[1440,900],[1366,768],[1024,768],[390,844],[844,390]].filter(size=>!process.argv[2]||size.join('x')===process.argv[2]);
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
    args: ['--no-sandbox','--disable-webgl']
  });
  const results = [];
  try {
    for (const [width,height] of sizes) {
      const id = width+'x'+height;
      const page = await browser.newPage({viewport:{width,height},hasTouch:width===390});
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const result = {width,height,errors};
      results.push(result);
      try {
        await page.goto(pathToFileURL(resolve(root,'index.html')).href+'?qa='+id+'-'+Date.now());
        await page.waitForFunction(() => window.PX_STUDIO?.diagnostics().ready);
        if(width===1440)await page.screenshot({path:resultPath('rebuild-cabinet.jpg')});
        await page.locator('#screenView').click();
        await page.waitForFunction(() => window.PX_STUDIO.viewBounds().view==='screen');
        const bounds = await page.evaluate(() => window.PX_STUDIO.viewBounds());
        result.bounds=bounds;
        assert.ok(bounds.screen.top>=bounds.topbarBottom+8);
        for(const b of bounds.buttons){
          assert.ok(b.left>=0&&b.right<=width&&b.top>=0&&b.bottom<=bounds.controlsTop,b.action);
          assert.ok(b.target.width>=43.99&&b.target.height>=43.99,b.action);
        }
        result.buttons=await page.locator('button:visible').evaluateAll(buttons=>buttons.map(b=>{const r=b.getBoundingClientRect();return {label:b.getAttribute('aria-label')||b.textContent.trim(),width:r.width,height:r.height};}));
        assert.ok(result.buttons.every(b=>b.width>=43.99&&b.height>=43.99));
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth<=innerWidth));
        await page.screenshot({path:resultPath('rebuild-screen-'+id+'.jpg')});
        const game = page.frameLocator('#gameFrame');
        const actualBet=()=>page.locator('#betValue').textContent();
        for(const action of ['betUp','betDown','pays','lab','auto','spin']){
          const read=()=>page.evaluate(action=>PX_STUDIO.diagnostics().actions[action]||0,action);
          const before=await read();
          await page.locator('[data-physical-action="'+action+'"]').click();
          assert.equal(await read(),before+1);
          if(action==='betUp'||action==='betDown')assert.equal(Number(await actualBet()),action==='betUp'?200:100);
          if(action==='pays'||action==='lab')await game.locator('#closePanel').click();
          if(action==='auto'){
            // Stop Auto, then reload into a fresh QA account so a random bonus
            // cannot interfere with verifying the physical spin cap.
            await page.locator('[data-physical-action="auto"]').click();
            await page.goto(pathToFileURL(resolve(root,'index.html')).href+'?qa=spin-'+id+'-'+Date.now());
            await page.waitForFunction(() => window.PX_STUDIO?.diagnostics().ready);
            await page.locator('#screenView').click();
          }
        }
        assert.equal(errors.length,0);
        result.pass=true;
      }catch(error){result.pass=false;result.error=String(error);console.error(id,error.message);}
      await page.close();
    }
  }finally{
    await browser.close();
    await writeFile(resultPath(process.argv[2]?'rebuild-pointer-'+process.argv[2]+'.json':'rebuild-pointer-views.json'),JSON.stringify({renderer:'Chromium software fallback',pass:results.every(r=>r.pass),results},null,2)+'\n');
  }
  if(results.some(r=>!r.pass))process.exitCode=1;
})().catch(error=>{console.error(error);process.exitCode=1;});
