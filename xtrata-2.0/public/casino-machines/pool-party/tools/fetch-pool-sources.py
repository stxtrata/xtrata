"""Refresh upstream evidence into a staging folder; never silently replace the reviewed build.
python3 tools/fetch-pool-sources.py [output-folder]
Uses only Python's standard library. Every success/failure is recorded. This tool
fetches primary evidence; promotion into pool-party-snapshots.json requires review.
"""
from pathlib import Path
import concurrent.futures,datetime,hashlib,json,sys,urllib.request
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(sys.argv[1]) if len(sys.argv)>1 else ROOT/'data/refresh-staging'
OUT.mkdir(parents=True,exist_ok=True)
manifest=json.loads((ROOT/'art/sources.json').read_text())
items=[]
for asset in manifest['assets']:
 if asset.get('source_url'):
  items.append((asset['file'],asset['source_url'],asset.get('sha256')))
 if asset.get('metadata_url'):
  items.append(('metadata/'+asset['symbol']+'.json',asset['metadata_url'],None))
for i,source in enumerate(manifest['dataSources']):items.append(('protocols/source-'+str(i)+'.json',source['url'],None))
for name,contract in {
 'charisma':'SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.multihop',
 'arkadiko':'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.arkadiko-swap-v2-1',
 'velar':'SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.univ2-core',
 'alex':'SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM.amm-vault-v2-01'
}.items():items.append(('transactions/'+name+'.json','https://api.hiro.so/extended/v1/address/'+contract+'/transactions?limit=50',None))
def fetch(item):
 name,url,expected=item
 result={'file':name,'url':url,'readAt':datetime.datetime.now(datetime.timezone.utc).isoformat()}
 try:
  req=urllib.request.Request(url,headers={'User-Agent':'PoolParty-source-review/1.0'})
  with urllib.request.urlopen(req,timeout=30) as response:
   raw=response.read();target=OUT/name;target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(raw)
   digest=hashlib.sha256(raw).hexdigest();result.update(status=response.status,bytes=len(raw),sha256=digest)
   if expected:result['matchesBundledOriginal']=digest==expected
 except Exception as error:result.update(status='unavailable',error=str(error))
 return result
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
 records=list(pool.map(fetch,items))
(OUT/'read-log.json').write_text(json.dumps(records,indent=2)+'\n')
for record in records:print(record['status'],record['file'])
print('Review staged evidence before updating the immutable dated build snapshot. No APR is inferred from APY.')
