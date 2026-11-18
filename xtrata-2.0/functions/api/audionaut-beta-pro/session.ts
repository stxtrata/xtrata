import {createCreatorChallenge,completeCreatorSignIn,sessionCookie,clearSessionCookie,revokeCreatorSession} from '../../lib/creator-auth';
import {authorizePro,checkProMembership,PRO_NO_STORE} from '../../lib/audionaut-pro-auth';
const reply=(body:unknown,status=200,headers:Record<string,string>={})=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json',...PRO_NO_STORE,...headers}});
export const onRequest:PagesFunction=async({request,env})=>{
  try{
    if(request.method==='GET'){
      const result=await authorizePro(request,env);
      return reply({signedIn:!!result.address,allowed:result.allowed,...result},result.status===503?503:200);
    }
    if(!['POST','DELETE'].includes(request.method))return reply({error:'Method not allowed.'},405,{'Allow':'GET, POST, DELETE'});
    if(request.headers.get('Origin')!==new URL(request.url).origin)return reply({error:'A same-origin sign-in request is required.'},403);
    if(request.method==='DELETE'){await revokeCreatorSession(request,env);return reply({signedIn:false,allowed:false},200,{'Set-Cookie':clearSessionCookie(request)});}
    if(!request.headers.get('content-type')?.includes('application/json'))return reply({error:'JSON required.'},415);
    const raw=await request.text();if(raw.length>8192)return reply({error:'Sign-in request too large.'},413);
    const payload=JSON.parse(raw);
    if(payload.action==='challenge'){
      const address=String(payload.address||'').trim().toUpperCase();
      if(!/^S[PM]/.test(address))return reply({error:'Connect a Stacks mainnet wallet.'},400);
      return reply({challenge:await createCreatorChallenge(env,address)});
    }
    if(payload.action==='verify'){
      const session=await completeCreatorSignIn(env,String(payload.id||''),payload.signature);
      const membership=await checkProMembership(env,session.address,{refresh:true});
      if(!membership.holds)return reply({signedIn:false,allowed:false,error:'This wallet does not hold an Audionaut.'},403);
      return reply({signedIn:true,allowed:true,address:session.address,tokenId:membership.tokenId,expiresAt:session.expiresAt},200,{'Set-Cookie':sessionCookie(session.token,request)});
    }
    return reply({error:'Unsupported sign-in action.'},400);
  }catch(error){return reply({error:error instanceof Error?error.message:'Sign-in failed.'},400);}
};
