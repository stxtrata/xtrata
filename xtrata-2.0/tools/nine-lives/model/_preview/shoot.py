import sys, json, subprocess, time, os
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.abspath(__file__))
srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8765', '--directory', ROOT], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(1)
VIEWS = {
 'front':   dict(cam='0,3.4,10.6', look='0,2.75,0', w=1100, h=1500),
 'threeq':  dict(cam='7.5,4.0,8.2', look='0,2.7,0', w=1100, h=1500),
 'topper':  dict(cam='1.6,5.5,3.2', look='0,5.2,0', w=1100, h=800, fov='30'),
 'topper_front': dict(cam='0,5.3,3.4', look='0,5.2,0', w=1100, h=800, fov='30'),
 'marquee': dict(cam='0,4.5,4.6', look='0,4.35,0', w=1500, h=700, fov='30'),
 'screen':  dict(cam='0,2.9,4.9', look='0,2.85,0', w=1300, h=1000, fov='32'),
 'deck':    dict(cam='0.4,2.2,3.4', look='0,1.8,0.4', w=1300, h=800, fov='38'),
 'lever':   dict(cam='4.2,2.8,3.0', look='1.9,2.6,.2', w=1000, h=1000, fov='32'),
 'lever_pull': dict(cam='4.2,2.8,3.0', look='1.9,2.6,.2', w=1000, h=1000, fov='32', extra='&lever=.7'),
 'door':    dict(cam='0,1.1,4.2', look='0,1.0,0', w=1300, h=900, fov='36'),
 'marquee_flick': dict(cam='0,4.5,4.6', look='0,4.35,0', w=1500, h=700, fov='30', extra='&flicker=1'),
 'side':    dict(cam='-8,3.0,3.0', look='0,2.7,0', w=1100, h=1400),
}
want = sys.argv[1:] or list(VIEWS)
with sync_playwright() as p:
    br = p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
    for name in want:
        v = VIEWS[name]; pg = br.new_page(viewport={'width': v['w'], 'height': v['h']})
        logs = []; pg.on('console', lambda m: logs.append(m.text)); pg.on('pageerror', lambda e: logs.append('ERR ' + str(e)))
        pg.goto(f"http://localhost:8765/model/_preview/preview.html?cam={v['cam']}&look={v['look']}&fov={v.get('fov','32')}{v.get('extra','')}")
        try: pg.wait_for_function('window.__ready===true', timeout=60000)
        except Exception as e: print(name, 'NOT READY', logs[:5])
        pg.wait_for_timeout(300); pg.screenshot(path=f'{ROOT}/shots/{name}.png'); print(name, 'ok', logs[:3])
        if name == 'front': print(pg.evaluate('window.__info'))
        pg.close()
    br.close()
srv.terminate()
