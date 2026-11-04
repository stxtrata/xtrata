"""Writes checks/fixture/dog: CLEARLY FAKE test data and placeholder images, only to exercise the data-rich code paths while the real
art/dog is unavailable. Never shipped: FIXTURE=1 node tools/build-pack.mjs builds dist-fixture/game.html from it."""
import json, random, os
from PIL import Image, ImageDraw
random.seed(5)
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'fixture/dog/'); os.makedirs(root + 'img/runestone', exist_ok=True)
rs = []
nums = [1234567,2345678,3456789,4567890,5678901,6789012,7890123,8901234,9012345,1122334,2233445,3344556,4455667,5566778,6677889,7788990,8899001,9900112]
for i, n in enumerate(nums):
    im = Image.new('RGB', (128, 128), (random.randint(20, 120),) * 3); d = ImageDraw.Draw(im)
    for k in range(12):
        x0, y0 = random.randint(0, 100), random.randint(0, 100); d.rectangle([x0, y0, x0 + random.randint(10, 28), y0 + random.randint(10, 28)], fill=tuple(random.randint(0, 255) for _ in range(3)))
    im.save(root + f'img/runestone/{n}.png'); rs.append({'inscriptionId': f'{i:064x}i0', 'number': n, 'img': f'img/runestone/{n}.png', 'source': 'FIXTURE'})
for nm, col in [('alex-runes-dog.png', (200, 160, 40)), ('dog-logo-black.png', (20, 20, 20))]:
    im = Image.new('RGBA', (256, 256), (0, 0, 0, 0)); d = ImageDraw.Draw(im); d.ellipse([10, 10, 246, 246], fill=col + (255,)); d.text((90, 120), 'FIXTURE', fill=(255, 255, 255, 255)); im.save(root + 'img/' + nm)
data = {'fetchedAt': '2026-11-02T00:00:00Z', 'fixture': True,
 'halving': {'height': 840000, 'hash': '0000000000000000000320283a032748cef8227873ff4872689bf23f1cda83a5', 'time': '2024-04-20T00:09:27Z', 'status': 'verified'},
 'rune': {'id': '840000:3', 'number': 3, 'name': 'DOGGOTOTHEMOON', 'spacedName': 'DOG•GO•TO•THE•MOON', 'symbol': 'D', 'supply': 100000000000, 'status': 'verified'},
 'snapshot': {'height': None, 'status': 'unconfirmed', 'candidates': [840249, 840269]},
 'runestone': {'perHolderDOG': 889806, 'recipients': 112383, 'status': 'verified'},
 'stacks': {'alex': {'contract': 'FIXTURE', 'image': 'img/alex-runes-dog.png', 'status': 'verified'}, 'pontis': {'status': 'brief-only'}},
 'transfers': [{'txid': 'f%d' % i, 'block': 840100 + i * 977, 'time': '2024-05-01T00:00:00Z', 'amount': str(random.choice([1, 250, 12000, 889806, 5.5, 1000000])), 'from': 'bc1q..%d' % i, 'to': 'bc1p..%d' % i, 'status': 'verified'} for i in range(24)],
 'milestones': [{'id': str(i), 'label': l, 'value': v, 'status': 'verified' if i < 7 else 'brief-only'} for i, (l, v) in enumerate([('HOLDERS', '112,383'), ('SUPPLY', '100B'), ('AIRDROP BLOCKS', '840,000'), ('PER WALLET', '889,806'), ('FIRST DAY', '74,000'), ('RUNE NUMBER', '#3'), ('NO PRESALE', '0'), ('TEAM', '0'), ('LISTINGS', '12')])],
 'runestones': rs, 'logos': {'dogBlack': 'img/dog-logo-black.png', 'dogWhite': None, 'status': 'unconfirmed'}}
json.dump(data, open(root + 'data.json', 'w'), indent=1)
print('fixture written')
