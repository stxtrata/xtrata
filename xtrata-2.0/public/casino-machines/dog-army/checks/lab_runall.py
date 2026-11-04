"""Bonus Lab "Run all": every item plays through its full presentation, auto-advanced. Captures each stage of each
bonus from the live screen canvas into checks/screens/lab/ and writes checks/lab-runall.json.
    python3 checks/lab_runall.py   (with a local server on 8765)"""
import asyncio, json, os, base64, time
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); PAGE = os.environ.get('PAGE', 'dist'); OUT = os.path.join(ROOT, 'checks/screens/lab-' + PAGE); os.makedirs(OUT, exist_ok=True)
BASE = os.environ.get('DOGARMY_BASE', 'http://127.0.0.1:8765')
REC = """window.__shots=[];window.__tr=[];let last='',item='';const D={trigger:900,intro:1100,play:1600,outro:2100};
setInterval(()=>{const L=DogArmy.snapshot().lab;item=L?L.item:item;const s=DogArmy.scene(),k=s?s.kind+':'+s.stage:(DogArmy.snapshot().freeMode?'free:play':'');const kk=item+'|'+k;
if(kk!==last){last=kk;__tr.push(kk);if(k){const st=k.split(':')[1],my=kk;setTimeout(()=>{const c=document.getElementById('pageCanvas');__shots.push([my,c.toDataURL('image/jpeg',.8)]);},D[st]||800);}}},25);"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
        pg = await b.new_page(viewport={'width': 1300, 'height': 900}); errors = []
        pg.on('pageerror', lambda e: errors.append(str(e)))
        await pg.add_init_script("localStorage.setItem('xtrata.parallax.layr.account.v1', JSON.stringify({bank:100000,layrGames:{}}))")
        await pg.goto(f'{BASE}/{os.environ.get('PAGE','dist')}/game.html?lab=1'); await pg.wait_for_timeout(2500)
        await pg.evaluate(REC); t0 = time.time()
        await pg.evaluate("DogArmy.lab.runAll(100,1337)")
        while time.time() - t0 < 1500:
            await pg.wait_for_timeout(1000)
            if not await pg.evaluate("DogArmy.lab.allActive()") and not await pg.evaluate("DogArmy.lab.active()"): break
        await pg.wait_for_timeout(2500)
        shots = json.loads(await pg.evaluate("JSON.stringify(__shots)")); tr = json.loads(await pg.evaluate("JSON.stringify(__tr)"))
        per = {}
        for i, (k, d) in enumerate(shots):
            it, st = k.split('|'); per.setdefault(it, []).append(st)
            open(f"{OUT}/{it}-{len(per[it]):02d}-{st.replace(':', '_')}.jpg", 'wb').write(base64.b64decode(d.split(',')[1]))
        items = await pg.evaluate("DogArmy.lab.items")
        res = {'seconds': round(time.time() - t0), 'items': {it: per.get(it, []) for it in items}, 'labHistoryRounds': await pg.evaluate("DogArmy.lab.history().length"), 'labTagged': await pg.evaluate("DogArmy.lab.history().every(h=>h.lab)"), 'errors': errors}
        json.dump(res, open(os.path.join(ROOT, 'checks/results/lab-runall-' + PAGE + '.json'), 'w'), indent=1); print(json.dumps(res, indent=1))
        await b.close()
asyncio.run(main())
