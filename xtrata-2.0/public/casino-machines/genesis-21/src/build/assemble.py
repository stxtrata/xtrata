import json,gzip,base64,os,re,hashlib
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
rd=lambda p:open(os.path.join(R,p),encoding='utf-8').read()
shell=rd('gen/g21.shell.html'); css=rd('gen/g21.css')
parts=[rd('ft/script0.js'),rd('ft/script1.js'),rd('ft/script3.js'),rd('ft/script5.js'),rd('gen/art.js'),rd('gen/g21-game.js')]
scripts='\n'.join('<script>'+p.replace('</script','<\\/script')+'\n</script>' for p in parts)
assert shell.count('<!--SCRIPT-->')==1
html=shell.replace('<!--SCRIPT-->',scripts)
open(os.path.join(R,'build/g21.game.html'),'w',encoding='utf-8').write(html)
open(os.path.join(R,'build/g21.css'),'w',encoding='utf-8').write(css)
model=open(os.path.join(R,'build/g21.model.json'),'rb').read()
z=lambda b:base64.b64encode(gzip.compress(b,9,mtime=0)).decode()
pack={"name":"Genesis 21","description":"The 2021 Stacks NFT machine. Nine collections, every twin on the reels, Number One for the jackpot.","color":"#1a1250","accent":"#5546ff","model":z(model),"game":z(html.encode()),"css":css}
js=json.dumps(pack,separators=(',',':'),ensure_ascii=False)
open(os.path.join(R,'build/g21.pack.json'),'w',encoding='utf-8').write(js)
print('html',len(html),'model gz+b64',len(pack['model']),'game',len(pack['game']),'pack',len(js))
# engine identity
e=rd('ft/script3.js'); print('engine in html:', e in html, hashlib.sha256(e.encode()).hexdigest()[:16])
