import {authorizePro,PRO_NO_STORE} from '../lib/audionaut-pro-auth';
// The gate and marketing remain public. Every actual workstation asset is protected,
// including direct HTML/module URLs; a client-side claimed address cannot bypass this.
export const onRequest:PagesFunction=async(context)=>{
  let path=new URL(context.request.url).pathname;
  try{for(let i=0;i<3;i++){const decoded=decodeURIComponent(path);if(decoded===path)break;path=decoded;}}catch{return new Response('Invalid path',{status:400,headers:PRO_NO_STORE});}
  // Match the final asset path, never a public prefix containing traversal that
  // a downstream static handler could normalize into the protected workstation.
  if(/[\\\u0000%]/.test(path)||path.split('/').some(segment=>segment==='.'||segment==='..'))return new Response('Invalid path',{status:400,headers:PRO_NO_STORE});
  const publicPath=['/audionaut-beta-pro','/audionaut-beta-pro/','/audionaut-beta-pro/index.html','/audionaut-beta-pro/audionaut-pro-gate.js'].includes(path)||path.startsWith('/audionaut-beta-pro/sell/');
  if(publicPath)return context.next();
  const result=await authorizePro(context.request,context.env);
  if(!result.allowed){
    if(path.endsWith('.html')&&result.status===401)return new Response(null,{status:303,headers:{...PRO_NO_STORE,Location:'/audionaut-beta-pro/'}});
    return new Response(JSON.stringify({error:result.error}),{status:result.status,headers:{...PRO_NO_STORE,'Content-Type':'application/json'}});
  }
  const response=await context.next(),headers=new Headers(response.headers);
  for(const [key,value]of Object.entries(PRO_NO_STORE))headers.set(key,value);
  headers.set('X-Content-Type-Options','nosniff');return new Response(response.body,{status:response.status,headers});
};
