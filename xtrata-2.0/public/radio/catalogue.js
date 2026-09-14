const el=id=>document.getElementById(id);
const columns=[['id','ID'],['title','Song'],['artist','Artist'],['plays','Plays'],['current_likes','♥ Current likes'],['completions','Completed'],['duration','Duration (seconds)'],['starts','Starts'],['partials','Partial'],['in_progress','In progress'],['repeats','Repeats'],['unique_browsers','Unique browsers'],['seconds','Listening minutes'],['completion_rate','Completion %'],['last_play','Last play'],['creator','Creator'],['status','Catalogue status']];
let rows=[],sort='id',direction=1,requestId=0;
let selected=new URL(location.href).searchParams.get('id');
const display=(row,key)=>{const v=row[key];if(v===null||v===undefined||v==='')return '—';if(key==='current_likes')return '♥ '+String(v);if(key==='last_play')return new Date(v).toLocaleString();if(key==='seconds')return (v/60).toFixed(1);if(key==='completion_rate'||key==='duration')return Number(v).toFixed(1);return String(v);};
function thumbnail(row){
 const frame=document.createElement('span');frame.className='song-art';frame.textContent='♪';frame.setAttribute('aria-hidden','true');
 if(row.thumbnail){const img=document.createElement('img');img.alt='';img.width=44;img.height=44;img.loading='lazy';img.decoding='async';img.referrerPolicy='no-referrer';img.onerror=()=>img.remove();img.src=row.thumbnail;frame.append(img);}
 return frame;
}
function detail(row){
 selected=String(row.id);
 el('detail').hidden=false;el('detail').replaceChildren();const h=document.createElement('h2');h.textContent=row.title;el('detail').append(thumbnail(row),h);
 const list=document.createElement('dl');for(const [key,label] of columns){const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=display(row,key);list.append(dt,dd);}el('detail').append(list);
 const a=document.createElement('a');a.href='/radio/embed?tokenId='+row.id;a.textContent='Listen to this song';el('detail').append(a);
 history.replaceState(null,'','?id='+row.id);
}
function render(){
 const visible=el('more').checked?columns:columns.slice(0,6);el('columns').replaceChildren();el('songs').replaceChildren();
 for(const [key,label] of visible){const th=document.createElement('th'),b=document.createElement('button');b.textContent=label+(sort===key?(direction===1?' ↑':' ↓'):'');th.setAttribute('aria-sort',sort===key?(direction===1?'ascending':'descending'):'none');b.onclick=()=>{direction=sort===key?-direction:1;sort=key;render();};th.append(b);el('columns').append(th);}
 const query=el('search').value.toLowerCase();
 const filtered=rows.filter(r=>[r.id,r.title,r.artist,r.creator].some(v=>String(v||'').toLowerCase().includes(query)));
 filtered.sort((a,b)=>{const x=a[sort],y=b[sort];if(x==null)return y==null?0:1;if(y==null)return -1;return direction*(typeof x==='number'?x-y:String(x).localeCompare(String(y),undefined,{numeric:true}));});
 for(const row of filtered){const tr=document.createElement('tr');for(const [key] of visible){const td=document.createElement('td');if(key==='title'){const b=document.createElement('button');b.textContent=display(row,key);b.onclick=()=>detail(row);const song=document.createElement('div');song.className='song-cell';song.append(thumbnail(row),b);td.append(song);}else td.textContent=display(row,key);tr.append(td);}el('songs').append(tr);}
}
async function load(){const id=++requestId;el('status').textContent='Loading…';try{const response=await fetch('/radio/counts?range='+el('period').value);const data=await response.json();if(!response.ok)throw Error(data.error||'Statistics unavailable');if(id!==requestId)return;rows=data.tracks;el('status').textContent=`${rows.length} catalogue entries · Measured since ${new Date(data.measured_since).toLocaleDateString()} · Updated ${new Date(data.until).toLocaleTimeString()}`;el('notice').textContent=data.notice;render();const row=rows.find(r=>String(r.id)===selected);if(row)detail(row);}catch(e){if(id!==requestId)return;rows=[];render();el('detail').hidden=true;el('status').textContent=e.message;}}
el('search').addEventListener('input',render);el('more').addEventListener('change',render);el('period').addEventListener('change',load);el('reload').addEventListener('click',load);void load();
