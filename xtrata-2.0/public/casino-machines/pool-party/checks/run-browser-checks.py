"""Run Pool Party's browser checks sequentially with one explicit browser path."""
import os,shutil,subprocess,sys
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
with sync_playwright() as p:
 browser=os.environ.get('CHROME') or os.environ.get('CHROMIUM_PATH') or shutil.which('chromium') or shutil.which('google-chrome') or p.chromium.executable_path
if not Path(browser).is_file():raise SystemExit('Install Chromium with python3 -m playwright install chromium, or set CHROME to its executable.')
env=dict(os.environ,CHROME=browser,CHROMIUM_PATH=browser)
suites=[('reels-direct-pool.py',[],{}),('reels-motion-pool.py',[],{}),('reels-motion-pool.py',['--starve','--software'],{}),('views-pool.py',[],{}),('mechanics-pool.py',[],{}),('behaviour-pool.py',[],{}),('behaviour-pool.py',['--pending-free-only'],{}),('production-pool.py',[],{}),('fullscreen-pool.py',[],{}),('fullscreen-pool.py',[],{'POOL_QA_MODE':'layout'}),('fallback-pool.py',[],{}),('lab-all-pool.py',[],{}),('banner-pool.py',[],{})]
for script,args,extra in suites:
 print('Running',script,' '.join(args),extra,flush=True)
 subprocess.run([sys.executable,str(ROOT/'checks'/script),*args],cwd=ROOT,env={**env,**extra},check=True)
print('Browser suites completed. Read results/ and RESULTS.md for the exact scope.')
