let nextOffset=null;
async function sessions(offset=0){
 const status=document.getElementById('sessions-status'),button=document.getElementById('sessions-next');button.disabled=true;status.textContent='Loading sessions…';
 try{const response=await fetch('/debug/radio-sessions?offset='+offset,{cache:'no-store'}),data=await response.json();if(!response.ok)throw Error(data.error);const body=document.getElementById('sessions');body.replaceChildren();
 for(const r of data.sessions){const tr=document.createElement('tr');const outcome=r.completed_at?'Completed':r.qualified_at?'Qualified':r.seconds<2?'Below start threshold':r.closed||Date.now()-r.updated_at>1800000?'Partial':'In progress';for(const value of [r.contract+' / #'+r.token_id,r.source,new Date(r.created_at).toLocaleString(),r.seconds.toFixed(1)+' / '+r.duration.toFixed(1),outcome,new Date(r.updated_at).toLocaleString(),r.rule_version]){const td=document.createElement('td');td.textContent=String(value);tr.append(td);}body.append(tr);}nextOffset=data.nextOffset;button.disabled=nextOffset===null;status.textContent=data.sessions.length?'Showing sessions '+(offset+1)+'–'+(offset+data.sessions.length):'No sessions yet.';
 }catch(e){status.textContent=e.message;}}
document.getElementById('sessions-first').onclick=()=>sessions();document.getElementById('sessions-next').onclick=()=>sessions(nextOffset);void sessions();
