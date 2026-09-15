const output=document.getElementById('output');
for(const action of ['setup','status','run','stop'])document.getElementById(action).onclick=async()=>{
 try{
  const body={};if(action==='run'){
   if(!document.getElementById('approve').checked)throw Error('Approve the bounded run first.');
   for(const k of ['core','song','fee','count'])body[k]=Number(document.getElementById(k).value);
   if(!confirm(`Run ${body.count} test(s) for song ${body.song}, core ${body.core}, with ${body.fee} microSTX network fee plus 50 microSTX holder payment per test?`))return;
   document.getElementById('approve').checked=false;
  }
  const response=await fetch('/'+action,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const data=await response.json();if(data.error)throw Error(data.error);output.textContent=JSON.stringify(data,null,2);
 }catch(e){output.textContent=e.message;}
};
