"""Behaviour checks on the game page (?lab=1): Skip keeps the total, reduced motion, the tag-light show, cameo records,
reload safety, the Holder Pot meter, and that Lab runs never touch the real account, meters or pot.
    python3 checks/behaviour.py   (with a local server on 8765)"""
import asyncio, json, os
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); OUT = os.path.join(ROOT, 'checks/screens'); os.makedirs(OUT, exist_ok=True)
BASE = os.environ.get('DOGARMY_BASE', 'http://127.0.0.1:8765'); PAGE = os.environ.get('PAGE', 'dist'); URL = f'{BASE}/{PAGE}/game.html?lab=1'
results = []
def rec(name, ok, info=None): results.append({'check': name, 'ok': bool(ok), 'info': info}); print(name, 'OK' if ok else 'FAIL', info)
async def wait_lab_done(pg, maxs=180, skip=False, primary=False):
    for _ in range(maxs * 5):
        if not await pg.evaluate("DogArmy.lab.active()"): return True
        if skip or primary:
            sc = await pg.evaluate("DogArmy.scene()")
            if sc and skip and sc['stage'] in ('trigger', 'intro', 'play'): await pg.evaluate("DogArmy.act.skip()")
            elif sc and sc['stage'] == 'outro': await pg.wait_for_timeout(300); await pg.evaluate("DogArmy.act.primary()")
            elif sc and primary and sc['stage'] in ('trigger', 'intro'): await pg.evaluate("DogArmy.act.primary()")
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
        # 1. Skip jumps to the outro with the same total (The Airdrop and Spell It are fully dealt by the seed).
        for it in ['chain', 'free', 'chain-full']:
            b0 = await pg.evaluate("DogArmy.lab.balance()"); await pg.evaluate(f"DogArmy.lab.run('{it}',100,4242,true)"); await wait_lab_done(pg); full = await pg.evaluate("DogArmy.lab.balance()") - b0
            b1 = await pg.evaluate("DogArmy.lab.balance()"); await pg.evaluate(f"DogArmy.lab.run('{it}',100,4242,false)"); await wait_lab_done(pg, skip=True); skipped = await pg.evaluate("DogArmy.lab.balance()") - b1
            rec(f'Skip keeps the same total: {it}', abs(full - skipped) < 1e-6, {'played': full, 'skipped': skipped})
        # vault: skip opens tags in order and the outro total equals what is collected
        b2 = await pg.evaluate("DogArmy.lab.balance()"); await pg.evaluate("DogArmy.lab.run('vault',100,99,false)")
        for _ in range(100):
            sc = await pg.evaluate("DogArmy.scene()")
            if sc: break
            await pg.wait_for_timeout(200)
        await pg.evaluate("DogArmy.act.skip()"); await pg.wait_for_timeout(300); sc = await pg.evaluate("DogArmy.scene()")
        await pg.wait_for_timeout(2200); await pg.locator('#pageCanvas').screenshot(path=f'{OUT}/skip-vault-outro.png')
        await wait_lab_done(pg, primary=True); got = await pg.evaluate("DogArmy.lab.balance()") - b2
        rec('Skip on Dog Tags goes straight to the summary and pays it', sc and sc['stage'] == 'outro' and got > 0, {'stage': sc, 'net': got})
        # 2. Reduced motion: calmer scenes, at most a few particles.
        await pg.evaluate("document.getElementById('settings').click()"); await pg.wait_for_timeout(300); await pg.check('#setReduced'); await pg.evaluate("document.getElementById('close').click()")
        await pg.evaluate("DogArmy.lab.run('jackpot',100,5,true)"); mx = 0; shot = False
        for _ in range(400):
            mx = max(mx, await pg.evaluate("DogArmy.fx()")); sc = await pg.evaluate("DogArmy.scene()")
            if sc and sc['stage'] == 'play' and not shot: await pg.wait_for_timeout(1200); await pg.locator('#pageCanvas').screenshot(path=f'{OUT}/reduced-motion-jackpot-play.png'); shot = True
            if not await pg.evaluate("DogArmy.lab.active()"): break
            await pg.wait_for_timeout(100)
        rec('Reduced motion keeps particles to a handful', mx <= 12, {'maxParticles': mx})
        await pg.evaluate("document.getElementById('settings').click()"); await pg.wait_for_timeout(300); await pg.uncheck('#setReduced'); await pg.evaluate("document.getElementById('close').click()")
        # 3. Parade of wins: the cabinet's eight dog-tag rows light up (px-tag0..7) as the machine steps them in time.
        await pg.evaluate("DogArmy.lab.run('parade',100,11,true)"); lit = set(); n = 0
        for _ in range(900):
            for i, v in enumerate(await pg.evaluate("DogArmy.tags()")):
                if v > .3: lit.add(i)
            if not await pg.evaluate("DogArmy.lab.active()"): break
            await pg.wait_for_timeout(80)
        rec('Parade of wins lights tag rows (mechanics().tags drives px-tag0..7)', len(lit) >= 4, sorted(lit))
        await pg.evaluate("DogArmy.lab.run('jackpot',100,12,true)"); litj = set()
        for _ in range(900):
            for i, v in enumerate(await pg.evaluate("DogArmy.tags()")):
                if v > .3: litj.add(i)
            if not await pg.evaluate("DogArmy.lab.active()"): break
            await pg.wait_for_timeout(80)
        rec('The jackpot lights all eight tag rows', litj == {0, 1, 2, 3, 4, 5, 6, 7}, sorted(litj))
        # 4. Cameo records: Runestones on a winning line.
        await pg.evaluate("DogArmy.act.holder('all')"); await pg.evaluate("DogArmy.lab.run('cameo',100,3,true)"); await wait_lab_done(pg)
        cam = await pg.evaluate("DogArmy.lab.history().filter(h=>h.cameo).map(h=>h.cameo).slice(0,4)")
        rec('Runestone wins earn cameo records {tokenId, collection, lineWin}', len(cam) > 0 and all({'tokenId', 'collection', 'lineWin'} <= set(c) for c in cam), cam)
        # 5. Lab runs never touch the real account, the jackpot meters or the Holder Pot.
        real0 = await pg.evaluate("({bal:ParallaxLAYRAccount.balance(),jp:DogArmy.jackpots(),pot:DogArmy.holder().pot,spins:DogArmy.snapshot().state.spins})")
        await pg.evaluate("DogArmy.lab.run('scatter5',100,8,true)"); await wait_lab_done(pg)
        real1 = await pg.evaluate("({bal:ParallaxLAYRAccount.balance(),jp:DogArmy.jackpots(),pot:DogArmy.holder().pot,spins:DogArmy.snapshot().state.spins})")
        rec('Lab leaves the real balance, meters, pot and stats unchanged', real0 == real1, {'before': real0, 'after': real1})
        # 6. Holder Pot: 1% of each paid bet.
        await pg.evaluate("DogArmy.act.holder('live')"); p0 = real1['pot']; s0 = real1['spins']
        await pg.evaluate("document.getElementById('spin').click()"); await pg.wait_for_timeout(4500)
        p1 = await pg.evaluate("DogArmy.holder().pot"); bet = await pg.evaluate("DogArmy.snapshot().state.history[0].bet")
        rec('Holder Pot grows by 1% of a paid bet', abs((p1 - p0) - bet * .01) < 1e-6, {'before': p0, 'after': p1, 'bet': bet})
        # 7. Reload mid-spin: the result was saved before the reels moved; it is settled once and never rerolled.
        for _ in range(20):
            if not (await pg.evaluate("DogArmy.snapshot().spinning")) and not (await pg.evaluate("DogArmy.scene()")): break
            await pg.evaluate("DogArmy.act.skip()"); await pg.evaluate("DogArmy.act.primary()"); await pg.wait_for_timeout(500)
        before = await pg.evaluate("({bal:ParallaxLAYRAccount.balance(),spins:DogArmy.snapshot().state.spins,bet:DogArmy.snapshot().state.bet})")
        await pg.evaluate("document.getElementById('spin').click()"); await pg.wait_for_timeout(250)
        pending = await pg.evaluate("JSON.parse(localStorage.getItem('xtrata.parallax.layr.account.v1')).layrGames['dog-army'].state.pending")
        await pg.reload(); await pg.wait_for_timeout(3500)
        after = await pg.evaluate("({bal:ParallaxLAYRAccount.balance(),spins:DogArmy.snapshot().state.spins,last:DogArmy.snapshot().state.history[0],pending:DogArmy.snapshot().state.pending})")
        ok = after['spins'] == before['spins'] + 1 and after['pending'] is None and pending and after['last']['id'] == pending['id'] and abs(after['bal'] - (before['bal'] - before['bet'] + after['last']['win'])) < 1e-6
        rec('Reload mid-spin settles the saved result once, no reroll, no double credit', ok, {'before': before, 'savedRound': pending and pending['id'], 'after': {k: after[k] for k in ('bal', 'spins', 'pending')}, 'settledRound': after['last']['id'], 'win': after['last']['win']})
        rec('No page errors', not errors, errors[:5])
        await b.close()
    json.dump(results, open(os.path.join(ROOT, 'checks/behaviour-' + PAGE + '.json'), 'w'), indent=1)
    print('FAILS:', [r['check'] for r in results if not r['ok']] or 'none')
asyncio.run(main())
