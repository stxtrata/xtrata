/* global SB, PLAYER */
/** Isolated Suno browser. Dry by default; --broadcast requires approved --player files. */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import { validateStacksAddress } from '@stacks/transactions';
import { createFundingHandler, defaultPolicy, installSunoFunding, livePorts, sha256, wizardIdentity } from './suno-funding.mjs';

export async function main(args = process.argv.slice(2)) {
  const values = name => args.flatMap((v,i) => v===`--${name}` ? [args[i+1]] : []);
  const value = (name, fallback) => values(name)[0] ?? fallback;
  const url = new URL(value('url', 'http://127.0.0.1:5173/xtrata-agent-one/wizard/suno.html'));
  if (url.protocol!=='https:' && !(url.protocol==='http:' && ['127.0.0.1','localhost'].includes(url.hostname)))
    throw new Error('Use HTTPS or a loopback development URL');
  const live = args.includes('--broadcast');
  const players = values('player').map(path => sha256(readFileSync(resolve(path))));
  if (live && !players.length) throw new Error('Live funding requires approved --player files');
  const identity = live ? wizardIdentity(value('wizard')) : {address:value('address')};
  if (!identity.address || !validateStacksAddress(identity.address) || !identity.address.startsWith('SP'))
    throw new Error('Provide a mainnet wizard public address with --address');
  const run = resolve(value('run-dir', `../media/suno-wizard/${Date.now()}`));
  const marker = resolve(run, 'suno-harness.json');
  if (existsSync(run) && !existsSync(marker)) throw new Error('Refusing a directory without a harness marker');
  mkdirSync(run, {recursive:true, mode:0o700});
  if (existsSync(marker)) {
    const previous=JSON.parse(readFileSync(marker,'utf8'));
    if(previous.address!==identity.address || previous.url!==url.href || previous.live!==live) throw new Error('Run identity or URL changed');
  }
  const policy = {...defaultPolicy, address:identity.address,
    spendCapUstx:value('spend-cap-ustx',defaultPolicy.spendCapUstx),
    feeUstx:value('fee-ustx',defaultPolicy.feeUstx), playerHashes:players.length?players:undefined};
  writeFileSync(marker,JSON.stringify({address:identity.address,url:url.href,live},null,2),{mode:0o600});
  const fund = createFundingHandler({policy,journal:resolve(run,'payment.json'),live,ports:live?livePorts(identity):{}});
  const context = await chromium.launchPersistentContext(resolve(run,'browser'), {
    channel:value('channel','chrome'), headless:args.includes('--headless'), viewport:{width:1920,height:1080},
    ...(args.includes('--record')?{recordVideo:{dir:resolve(run,'video'),size:{width:1920,height:1080}}}:{})
  });
  try {
    const page = context.pages()[0] || await context.newPage();
    await installSunoFunding(page,{url:url.href,address:identity.address,fund:async request=>{
      if (!live) {
        const files=await page.evaluate(async()=>{
          const files=SB.active?SB.items.filter(it=>it.status==='ready'&&it.player).map(it=>it.player):[PLAYER];
          return Promise.all(files.map(async file=>Array.from(new Uint8Array(await file.arrayBuffer()))));
        });
        files.forEach((bytes,index)=>{
          const data=Buffer.from(bytes);
          if(sha256(data)!==request.playerHashes[index]) throw new Error('Prepared player changed');
          writeFileSync(resolve(run,`player-${index+1}.html`),data,{mode:0o600});
        });
      }
      return fund(request);
    }});
    await page.goto(url.href);
    if (await page.evaluate(() => window.XtrataWizardFunding?.getAddress()) !== identity.address)
      throw new Error('The configured Suno page did not install the wizard adapter (check redirects)');
    if(value('audio')) await page.locator('#picker').setInputFiles(resolve(value('audio')));
    console.log(`Suno wizard ${live?'LIVE':'DRY RUN'} ready. Local run: ${run}`);
    console.log('Prepare the player, then use Inscribe. Close the browser when finished. Keep this directory for recovery.');
    await new Promise(resolve=>context.on('close',resolve));
  } finally { await context.close(); }
}
if(process.argv[1] && pathToFileURL(resolve(process.argv[1])).href===import.meta.url)
  main().catch(()=>{console.error('Suno harness stopped. Check arguments and the local payment journal; no automatic retry.');process.exitCode=1;});
