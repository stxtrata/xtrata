(async()=>{
 const results=[],output=document.getElementById('results');let refuse=false,bridgeCalls=[];
 const check=(name,value)=>{results.push({name,passed:!!value});output.textContent=JSON.stringify(results,null,2);if(!value)throw Error(name);};
 const wait=async fn=>{const end=Date.now()+12000;while(!fn()){if(Date.now()>end)throw Error('UI wait timed out');await new Promise(r=>setTimeout(r,25));}};
 addEventListener('message',event=>{
  const d=event.data;if(event.origin!==location.origin||d?.type!=='xtrata:wallet:request'||d.bridgeToken!=='browser-test')return;
  bridgeCalls.push(d.method);event.source.postMessage({type:'xtrata:wallet:response',requestId:d.requestId,ok:!refuse,...refuse?{error:{code:4001,message:'User rejected connection'}}:{result:{addresses:[{symbol:'STX',address:'STC5KHM41H6WHAST7MWWDD807YSPRQKJ68T330BQ'}]}}},location.origin);
 });
 try {
  for(const mode of ['direct','framed'])for(const denied of [false,true]){
   refuse=denied;bridgeCalls=[];const frame=document.createElement('iframe');frame.width=390;frame.height=844;
   frame.src=`/scenario?arena=1&mode=${mode}&wallet=${denied?'refuse':'stub'}${mode==='framed'?'&walletBridgeToken=browser-test':''}`;
   document.getElementById('scenarios').append(frame);
   await wait(()=>frame.contentDocument?.querySelector('[data-square]'));
   const fixture=await (await fetch(frame.src)).text();
   frame.contentDocument.open();frame.contentDocument.write(fixture);frame.contentDocument.close();
   await wait(()=>frame.contentDocument?.querySelector('[data-square]'));
   const d=frame.contentDocument,w=frame.contentWindow,prefix=`${mode}/${denied}`;
   const button=name=>[...d.querySelectorAll('button')].find(b=>(b.getAttribute('aria-label')||b.textContent).trim()===name);
   const click=async name=>{const b=button(name);if(!b)throw Error('Missing '+name);b.click();await new Promise(r=>setTimeout(r,35));};
   check(prefix+': document replacement reboot',!!d.querySelector('[data-square]'));
   check(prefix+': 64 squares',d.querySelectorAll('[data-square]').length===64);
   check(prefix+': correct a1 colour',d.querySelector('[data-square="a1"]').classList.contains('dark'));
   check(prefix+': mobile fits',d.documentElement.scrollWidth<=390);
   check(prefix+': one board tab stop',[...d.querySelectorAll('[data-square]')].filter(e=>e.tabIndex===0).length===1);
   const square=d.querySelector('[data-square="d4"]');square.focus();square.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Home',bubbles:true}));
   check(prefix+': Home navigation',d.activeElement.dataset.square==='a4');
   await click('New game');await click('Create local practice game');await wait(()=>!d.querySelector('[role="dialog"]'));
   check(prefix+': fresh practice works',d.querySelector('[data-square="e2"]').getAttribute('aria-label').includes('white pawn'));
   d.querySelector('[data-square="e2"]').click();await new Promise(r=>setTimeout(r,35));d.querySelector('[data-square="e4"]').click();await wait(()=>button('Play move'));
   await click('Play move');check(prefix+': move applied',d.querySelector('[data-square="e4"]').getAttribute('aria-label').includes('white pawn'));
   await click('Starting position');d.querySelector('[data-square="e2"]').click();await new Promise(r=>setTimeout(r,35));d.querySelector('[data-square="e4"]').click();await new Promise(r=>setTimeout(r,35));
   check(prefix+': replay read only',!d.querySelector('.move-preview'));await click('Live position');
   await click('Connect wallet');await wait(()=>d.querySelector('[role="dialog"]'));
   const provider=[...d.querySelector('[role="dialog"]').querySelectorAll('button')].find(b=>b.textContent.includes('window.StacksProvider'));if(!provider)throw Error('No fixture provider');provider.click();
   await wait(()=>denied ? d.querySelector('.notice')?.textContent.includes('rejected') : !d.querySelector('[role="dialog"]'));
   check(prefix+': exactly one wallet request',(mode==='framed'?bridgeCalls:w.__testCalls).length===1);
   check(prefix+': no exceptions',w.__testErrors.length===0);
   frame.remove();
  }
 }catch(error){results.push({name:'suite completed',passed:false,error:error.message});}
 const report={passed:results.every(r=>r.passed),results,userAgent:navigator.userAgent};output.textContent=JSON.stringify(report,null,2);
 await fetch('/report?arena=1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(report)});
})();
