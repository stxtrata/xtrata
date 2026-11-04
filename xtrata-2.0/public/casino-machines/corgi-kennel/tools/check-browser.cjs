const { chromium } = require(process.env.CK_PLAYWRIGHT || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
const url = process.env.CK_URL || 'http://localhost:8644';
const out = path.join(__dirname, '../checks/results');
const assert = require('node:assert/strict');
const sizes = [[1440,900],[1366,768],[1024,768],[390,844],[844,390]];

async function main() {
  const browser = await chromium.launch({
    executablePath: process.env.CK_CHROMIUM || undefined,
    args: ['--no-sandbox','--disable-webgl']
  });
  try {
    const rows = [];
    for (const [width,height] of sizes) {
      const page = await browser.newPage({viewport:{width,height},hasTouch:width===390});
      page.on('pageerror', error => console.error(error));
      await page.goto(url+'/index.html');
      await page.waitForFunction(()=>window.CKHostTest && document.getElementById('loading').classList.contains('done'));
      await page.waitForFunction(()=>{
        const c=document.getElementById('softwareGameScreen');
        return c && getComputedStyle(c).visibility==='visible' &&
          getComputedStyle(c).backfaceVisibility==='visible' &&
          c.getContext('2d').getImageData(400,400,1,1).data[3]===255;
      });
      if(width===1440) {
        await page.screenshot({path:path.join(out,'current-cabinet.png')});

      }
      await page.evaluate(()=>CKHostTest.setView('screen',true));
      await page.waitForTimeout(450);
      const metrics = await page.evaluate(()=>CKHostTest.metrics());
      await page.screenshot({path:path.join(out,`current-screen-${width}x${height}.png`)});
      const clicks = [];
      for (const action of ['betUp','betDown','pays','auto','spin']) {
        const target=metrics.buttons.find(button=>button.action===action);
        const before=await page.evaluate(()=>CKHostTest.api.ui());
        await page.mouse.click(target.physicalCenter.x,target.physicalCenter.y);
        const after=await page.evaluate(()=>CKHostTest.api.ui());
        clicks.push({action,pass:after.actionSerial>before.actionSerial && (action==='betUp'?after.bet===200:action==='betDown'?after.bet===100:action==='pays'?after.modalOpen:action==='auto'?after.auto:after.spinning||after.spins>before.spins)});
        if(action==='pays')await page.evaluate(()=>CKHostTest.api.closeModal());
        if(action==='auto')await page.evaluate(()=>CKHostTest.api.stopAuto());
      }
      rows.push({width,height,metrics,clicks});
      await page.close();
    }
    fs.writeFileSync(path.join(out,'current-viewport.json'),JSON.stringify(rows,null,2));
    console.log(rows.map(({width,height,metrics,clicks})=>({width,height,passes:metrics.passes,clicks})));
    assert.ok(rows.every(row=>Object.values(row.metrics.passes).every(Boolean)&&row.clicks.every(click=>click.pass)), 'Viewport or deck action failed');
    if(process.argv.includes('--views-only'))return;
    const page=await browser.newPage({viewport:{width:1440,height:1000}});
    await page.goto(url+'/checks/browser.html');
    await page.locator('#runFull').click();
    try {
      await page.waitForFunction(()=>!document.getElementById('runFull').disabled,{},{timeout:480000});
    } catch(error) {
      const report={status:await page.locator('#status').textContent(),rows:JSON.parse(await page.locator('#results').textContent()||'[]'),error:error.message};
      fs.writeFileSync(path.join(out,'current-browser-partial.json'),JSON.stringify(report,null,2));
      throw error;
    }
    const results=await page.locator('#results').textContent();
    fs.writeFileSync(path.join(out,'current-browser.json'),results);
    const failures=JSON.parse(results).filter(row=>!row.pass);
    console.log(failures);
    assert.equal(failures.length,0,'Browser acceptance failures');
    await page.close();
  } finally {
    await browser.close();
  }
}
main().catch(error=>{console.error(error);process.exitCode=1;});
