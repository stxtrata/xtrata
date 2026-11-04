import json,urllib.request,urllib.parse,re,time
H='https://xtrata.xyz/hiro/mainnet'; A='SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3::xtrata-inscription'
W={'xtrata.btc':'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X','jim.btc':'SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7'}
def get(u):
  for i in range(4):
    try: return json.load(urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'curl/8.5.0'}),timeout=40))
    except Exception as e: err=e; time.sleep(1+i)
  raise err
out={}
for name,addr in W.items():
  ids=[];off=0
  while True:
    j=get(f'{H}/extended/v1/tokens/nft/holdings?principal={addr}&asset_identifiers={urllib.parse.quote(A)}&limit=50&offset={off}')
    for r in j['results']:
      m=re.match(r'u(\d+)',r['value']['repr']); ids.append({'id':int(m.group(1)),'tx':r.get('tx_id'),'block':r.get('block_height')})
    off+=50
    if off>=j['total'] or not j['results']: break
  out[name]={'address':addr,'total':j['total'],'held':ids}; print(name,j['total'],sorted(x['id'] for x in ids)[:10],'...')
json.dump(out,open('raw/layers-holdings.json','w'),indent=1)
