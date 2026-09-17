export function validateRead(message, sender, extensionId) {
  if(sender.id!==extensionId || sender.frameId!==0 || !sender.documentId || !Number.isInteger(sender.tab?.id) || sender.origin!=='https://xtrata.xyz' || new URL(sender.url).origin!=='https://xtrata.xyz') throw Error('Untrusted sender');
  if(!message || typeof message!=='object' || Array.isArray(message)) throw Error('Invalid request');
  const keys=message.method==='status'?['id','method']:['id','method','cursor','limit'];
  if(Object.keys(message).length!==keys.length || keys.some(k=>!Object.hasOwn(message,k)) || typeof message.id!=='string' || !/^[0-9a-f]{32}$/.test(message.id)) throw Error('Invalid fields');
  if(message.method==='history') {
    if(message.cursor!==null && (typeof message.cursor!=='string'||message.cursor.length>128)) throw Error('Invalid cursor');
    if(!Number.isInteger(message.limit)||message.limit<1||message.limit>50) throw Error('Invalid limit');
  } else if(message.method!=='status') throw Error('Unsupported method');
  return {...message,context:{origin:sender.origin,documentId:sender.documentId,topLevel:true}};
}
