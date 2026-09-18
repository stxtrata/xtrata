export function validate(message,sender,extension){
 if(sender.id!==extension||sender.frameId!==0||typeof sender.documentId!=='string'||!Number.isInteger(sender.tab?.id)||sender.origin!=='https://xtrata.xyz')throw Error('Untrusted page');
 const url=new URL(sender.url);if(url.origin!==sender.origin||!['/radio/browser-lounge','/radio/browser-lounge.html'].includes(url.pathname))throw Error('Untrusted page');
 const fields={connect:['id','method'],poll:['id','method'],status:['id','method'],setup:['id','method'],support:['id','method','fee'],start:['id','method','song','startId'],stop:['id','method'],disconnect:['id','method']};
 if(!message||!fields[message.method]||Object.keys(message).sort().join()!==fields[message.method].sort().join()||!/^[a-f0-9]{32}$/.test(message.id||''))throw Error('Invalid request');
 if(message.method==='support'&&(!Number.isInteger(message.fee)||message.fee<1||message.fee>1000))throw Error('Invalid fee');
 if(message.method==='start'&&(!Number.isSafeInteger(message.song)||message.song<0||!/^[a-f0-9]{32}$/.test(message.startId||'')))throw Error('Invalid start');
 return message;
}
