import json,urllib.request,os
CORE='SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3'
pick=json.load(open('raw/layers-pick.json')); os.makedirs('raw/layers',exist_ok=True)
for x in pick:
  if x.get('mime','') and x['mime'].startswith('image/'):
    try: b=urllib.request.urlopen(urllib.request.Request(f"https://xtrata.xyz/i/{x['id']}?contractId={CORE}&network=mainnet",headers={'User-Agent':'curl/8.5.0'}),timeout=120).read()
    except Exception as e: print(x['id'],'FAIL',e); continue
    ext={'image/png':'png','image/jpeg':'jpg','image/webp':'webp','image/svg+xml':'svg'}[x['mime']]
    open(f"raw/layers/{x['id']}.{ext}",'wb').write(b); print(x['id'],len(b))
