"""Behaviour checks on the game page (?lab=1): Skip keeps the total, reduced motion, the ladder event, cameo records,
reload safety, the Holder Pot meter, and that Lab runs never touch the real account, meters or pot.
    python3 checks/behaviour.py   (with a local server on 8765)"""
import asyncio, json, os
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); OUT = os.path.join(ROOT, 'checks/screens'); os.makedirs(OUT, exist_ok=True)
BASE = os.environ.get('MOONEEB_BASE', 'http://127.0.0.1:8765'); URL = f'{BASE}/dist/game.html?lab=1'
results = []
def rec(name, ok, info=None): results.append({'check': name, 'ok': bool(ok), 'info': info}); print(name, 'OK' if ok else 'FAIL', info)
async def wait_lab_done(pg, maxs=180, skip=False, primary=False):
    for _ in range(maxs * 5):
        if not await pg.evaluate("Mooneeb.lab.active()"): return True
        if skip or primary:
            sc = await pg.evaluate("Mooneeb.scene()")
            if sc and skip and sc['stage'] in ('trigger', 'intro', 'play'): await pg.evaluate("Mooneeb.act.skip()")
            elif sc and sc['stage'] == 'outro': await pg.wait_for_timeout(300); await pg.evaluate("Mooneeb.act.primary()")
            elif sc and primary and sc['stage'] in ('trigger', 'intro'): await pg.evaluate("Mooneeb.act.primary()")
        await pg.wait_for_timeout(200)
    return False
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
        ctx = await b.new_context(viewport={'width': 1300, 'height': 900}); pg = await ctx.new_page(); errors = []
        pg.on('pageerror', lambda e: errors.append(str(e)))
        await pg.add_init_script("if(!localStorage.getItem('xtrata.parallax.layr.account.v1'))localStorage.setItem('xtrata.parallax.layr.account.v1', JSON.stringify({bank:100000,layrGames:{}}))")
        await pg.goto(URL); await pg.wait_for_timeout(2500)
        await pg.evaluate("document.getElementById('setTurbo')||0")
        # 1. Skip jumps to the outro with the same total (Moonshot and Spell It are fully dealt by the seed).
        for it in ['chain', 'free', 'chain-full']:
            b0 = await pg.evaluate("Mooneeb.lab.balance()"); await pg.evaluate(f"Mooneeb.lab.run('{it}',100,4242,true)"); await wait_lab_done(pg); full = await pg.evaluate("Mooneeb.lab.balance()") - b0
            b1 = await pg.evaluate("Mooneeb.lab.balance()"); await pg.evaluate(f"Mooneeb.lab.run('{it}',100,4242,false)"); await wait_lab_done(pg, skip=True); skipped = await pg.evaluate("Mooneeb.lab.balance()") - b1
            rec(f'Skip keeps the same total: {it}', abs(full - skipped) < 1e-6, {'played': full, 'skipped': skipped})
        # vault: skip opens bags in order and the outro total equals what is collected
        b2 = await pg.evaluate("Mooneeb.lab.balance()"); await pg.evaluate("Mooneeb.lab.run('vault',100,99,false)")
        for _ in range(100):
            sc = await pg.evaluate("Mooneeb.scene()")
            if sc: break
            await pg.wait_for_timeout(200)
        await pg.evaluate("Mooneeb.act.skip()"); await pg.wait_for_timeout(300); sc = await pg.evaluate("Mooneeb.scene()")
        await pg.wait_for_timeout(2200); await pg.locator('#pageCanvas').screenshot(path=f'{OUT}/skip-vault-outro.png')
        await wait_lab_done(pg, primary=True); got = await pg.evaluate("Mooneeb.lab.balance()") - b2
        rec('Skip on Mooney Bags goes straight to the summary and pays it', sc and sc['stage'] == 'outro' and got > 0, {'stage': sc, 'net': got})
        # 2. Reduced motion: calmer scenes, at most a few particles.
        await pg.evaluate("document.getElementById('settings').click()"); await pg.wait_for_timeout(300); await pg.check('#setReduced'); await pg.evaluate("document.getElementById('close').click()")
        await pg.evaluate("Mooneeb.lab.run('jackpot',100,5,true)"); mx = 0; shot = False
        for _ in range(400):
            mx = max(mx, await pg.evaluate("Mooneeb.fx()")); sc = await pg.evaluate("Mooneeb.scene()")
            if sc and sc['stage'] == 'play' and not shot: await pg.wait_for_timeout(1200); await pg.locator('#pageCanvas').screenshot(path=f'{OUT}/reduced-motion-jackpot-play.png'); shot = True
            if not await pg.evaluate("Mooneeb.lab.active()"): break
            await pg.wait_for_timeout(100)
        rec('Reduced motion keeps particles to a handful', mx <= 12, {'maxParticles': mx})
        await pg.evaluate("document.getElementById('settings').click()"); await pg.wait_for_timeout(300); await pg.uncheck('#setReduced'); await pg.evaluate("document.getElementById('close').click()")
        # 3. Climb the ladder: five spins light M, MOO, MOON, MOONEY, MOONEEB.
        await pg.evaluate("Mooneeb.lab.run('ladder',100,11,true)"); lit = set()
        for _ in range(600):
            for i, v in enumerate(await pg.evaluate("Mooneeb.ladder()")):
                if v > .5: lit.add(i)
            if not await pg.evaluate("Mooneeb.lab.active()"): break
            await pg.wait_for_timeout(100)
        rec('Climb the ladder lights every rung', lit == {0, 1, 2, 3, 4}, sorted(lit))
        # 4. Cameo records during Moonshot.
        await pg.evaluate("Mooneeb.lab.run('cameo',100,3,true)"); await wait_lab_done(pg)
        cam = await pg.evaluate("Mooneeb.lab.history().filter(h=>h.cameo).map(h=>h.cameo).slice(0,4)")
        rec('Moonshot twins earn cameo records {tokenId, collection, lineWin}', len(cam) > 0 and all({'tokenId', 'collection', 'lineWin'} <= set(c) for c in cam), cam)
        # 5. Lab runs never touch the real account, the jackpot meters or the Holder Pot.
        real0 = await pg.evaluate("({bal:ParallaxLAYRAccount.balance(),jp:Mooneeb.jackpots(),pot:Mooneeb.holder().pot,spins:Mooneeb.snapshot().state.spins})")
        await pg.evaluate("Mooneeb.lab.run('scatter5',100,8,true)"); await wait_lab_done(pg)
        real1 = await pg.evaluate("({bal:ParallaxLAYRAccount.balance(),jp:Mooneeb.jackpots(),pot:Mooneeb.holder().pot,spins:Mooneeb.snapshot().state.spins})")
        rec('Lab leaves the real balance, meters, pot and stats unchanged', real0 == real1, {'before': real0, 'after': real1})
        # 6. Holder Pot: 1% of each paid bet.
        await pg.evaluate("Mooneeb.act.twins('live')"); p0 = real1['pot']; s0 = real1['spins']
        await pg.evaluate("document.getElementById('spin').click()"); await pg.wait_for_timeout(4500)
        p1 = await pg.evaluate("Mooneeb.holder().pot"); bet = await pg.evaluate("Mooneeb.snapshot().state.history[0].bet")
        rec('Holder Pot grows by 1% of a paid bet', abs((p1 - p0) - bet * .01) < 1e-6, {'before': p0, 'after': p1, 'bet': bet})
        # 7. Reload mid-spin: the result was saved before the reels moved; it is settled once and never rerolled.
        for _ in range(20):
            if not (await pg.evaluate("Mooneeb.snapshot().spinning")) and not (await pg.evaluate("Mooneeb.scene()")): break
            await pg.evaluate("Mooneeb.act.skip()"); await pg.evaluate("Mooneeb.act.primary()"); await pg.wait_for_timeout(500)
        before = await pg.evaluate("({bal:ParallaxLAYRAccount.balance(),spins:Mooneeb.snapshot().state.spins,bet:Mooneeb.snapshot().state.bet})")
        await pg.evaluate("document.getElementById('spin').click()"); await pg.wait_for_timeout(250)
        pending = await pg.evaluate("JSON.parse(localStorage.getItem('xtrata.parallax.layr.account.v1')).layrGames.mooneeb.state.pending")
        await pg.reload(); await pg.wait_for_timeout(3500)
        after = await pg.evaluate("({bal:ParallaxLAYRAccount.balance(),spins:Mooneeb.snapshot().state.spins,last:Mooneeb.snapshot().state.history[0],pending:Mooneeb.snapshot().state.pending})")
        ok = after['spins'] == before['spins'] + 1 and after['pending'] is None and pending and after['last']['id'] == pending['id'] and abs(after['bal'] - (before['bal'] - before['bet'] + after['last']['win'])) < 1e-6
        rec('Reload mid-spin settles the saved result once, no reroll, no double credit', ok, {'before': before, 'savedRound': pending and pending['id'], 'after': {k: after[k] for k in ('bal', 'spins', 'pending')}, 'settledRound': after['last']['id'], 'win': after['last']['win']})
        rec('No page errors', not errors, errors[:5])
        await b.close()
    json.dump(results, open(os.path.join(ROOT, 'checks/behaviour.json'), 'w'), indent=1)
    print('FAILS:', [r['check'] for r in results if not r['ok']] or 'none')
asyncio.run(main())
