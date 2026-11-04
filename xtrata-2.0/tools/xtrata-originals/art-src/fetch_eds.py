import json,urllib.request,re,concurrent.futures as cf
CORE='SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3'
def raw(u):
  return urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'curl/8.5.0'}),timeout=60).read()
toks=json.load(open('raw/aud-mints.json'))
def one(t):
  h=raw(f'https://xtrata.xyz/i/{t["tokenId"]}?contractId={CORE}&network=mainnet').decode()
  e=re.search(r'data-edition="(\d+)"',h); s=re.search(r'data-seed="(\d+)"',h); m=re.search(r'src="/i/(\d+)',h)
  return dict(t,edition=int(e.group(1)) if e else None,seed=int(s.group(1)) if s else None,master=int(m.group(1)) if m else None,bytes=len(h))
with cf.ThreadPoolExecutor(6) as ex: out=list(ex.map(one,toks))
out.sort(key=lambda x:x['edition'] or 999)
json.dump(out,open('raw/aud-editions.json','w'),indent=1)
for o in out: print(o['tokenId'],o['edition'],o['seed'],o['master'],o['bytes'])
open('raw/master-3060.js','wb').write(raw(f'https://xtrata.xyz/i/3060?contractId={CORE}&network=mainnet'))
