import json,urllib.request,re,time,sys
H='https://xtrata.xyz/hiro/mainnet'
C='SP3JB6BCKV14CG25NF017CR7KRVSM8RAGHB52DWHX.xtrata-collection-audionauts-1-3c855746'
def get(u):
  for i in range(4):
    try: return json.load(urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'curl/8.5.0','Accept':'application/json'}),timeout=40))
    except Exception as e: time.sleep(1+i); err=e
  raise err
toks=[];off=0
while True:
  j=get(f'{H}/extended/v1/contract/{C}/events?limit=50&offset={off}')
  for e in j['results']:
    r=e.get('contract_log',{}).get('value',{}).get('repr','')
    if 'collection-minted' in r:
      t=int(re.search(r'token-id u(\d+)',r).group(1)); toks.append({'tokenId':t,'tx':e['tx_id'],'owner':re.search(r"owner '(\w+)",r).group(1)})
  if len(j['results'])<50: break
  off+=50
print(len(toks),'mints'); json.dump(toks,open('raw/aud-mints.json','w'),indent=1)
