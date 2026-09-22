export function externalURL(value) {
 try {const u=new URL(value);return u.protocol==='https:'&&['xtrata.xyz','explorer.hiro.so'].includes(u.hostname)&&!u.username&&!u.password;}catch{return false;}
}
export function localNavigation(value,origin) {
 try {const u=new URL(value);return u.origin===origin&&u.pathname==='/lounge';}catch{return false;}
}
export function openLink(value){return value==='xtrata-music://open'||value==='xtrata-music://open/';}

// Windows delivers protocol launches in argv. Accept only the exact inert open
// link; query strings and every payment-shaped route are deliberately ignored.
export function protocolOpenArgument(args){
 return Array.isArray(args)&&args.some(value=>typeof value==='string'&&openLink(value));
}
