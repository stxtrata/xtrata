import asyncio, json
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b = await p.chromium.launch(args=['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required'])
    pg = await (await b.new_context(viewport={'width':1366,'height':900})).new_page()
    await pg.goto('http://127.0.0.1:8765/index.html?lite=1'); await pg.wait_for_timeout(6000)
    frame=[f for f in pg.frames if f!=pg.main_frame][0]; G=frame.evaluate
    await pg.mouse.click(683, 400)
    await pg.evaluate("MooneebTest.api.action('turbo')"); print('turbo', await G("Mooneeb.snapshot().state.turbo"), flush=True)
    res = {'cowWins':0,'cowMoo':0,'otherWins':0,'otherMoo':0,'noWin':0,'noWinMoo':0,'bonusSpins':0}
    for n in range(45):
      snap = json.loads(await G("JSON.stringify(Mooneeb.snapshot())"))
      if snap['scene'] or snap['freeMode'] or snap['state'].get('free',0)>0:
        await G("Mooneeb.act.skip()"); await pg.wait_for_timeout(600); await G("Mooneeb.act.primary()"); await pg.wait_for_timeout(600); res['bonusSpins']+=1; continue
      if snap['state'].get('gamble',0)>0: pass
      before = await G("Mooneeb.soundLog().filter(e=>e.kind==='moo').length")
      s0 = snap['state']['spins']; await pg.evaluate("MooneebTest.api.action('spin')")
      for _ in range(40):
        await pg.wait_for_timeout(250)
        if not await G("Mooneeb.snapshot().spinning"): break
      await pg.wait_for_timeout(500)
      snap2 = json.loads(await G("JSON.stringify(Mooneeb.snapshot())"))
      if snap2['state']['spins'] == s0: res.setdefault('noSpin',0); res['noSpin']+=1; continue
      if snap2['scene']: res['bonusSpins']+=1; continue
      wins = await G("Mooneeb.lastWins()"); moos = await G("Mooneeb.soundLog().filter(e=>e.kind==='moo').length") - before
      cow = any(w in ('lemon','block') for w in wins); print(n, wins, 'moo' if moos else '-', flush=True)
      if not wins: res['noWin']+=1; res['noWinMoo']+=moos>0
      elif cow: res['cowWins']+=1; res['cowMoo']+=moos>0
      else: res['otherWins']+=1; res['otherMoo']+=moos>0
    print(res)
    await b.close()
asyncio.run(main())
