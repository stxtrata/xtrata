import {generateKey,insist,type Key,type Archive} from './protocol';
export class Store {
  private async db():Promise<IDBDatabase>{return new Promise((resolve,reject)=>{
    const r=indexedDB.open('xchess-peer-v1',1);
    r.onupgradeneeded=()=>{r.result.createObjectStore('keys');r.result.createObjectStore('games');};
    r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);r.onblocked=()=>reject(Error('Close older peer-play tabs to open storage'));
  });}
  async get(store:string,id:string):Promise<any>{const db=await this.db();try{return await new Promise((resolve,reject)=>{
    const r=db.transaction(store).objectStore(store).get(id);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);
  });}finally{db.close();}}
  async put(store:string,id:string,value:any){const db=await this.db();try{await new Promise<void>((resolve,reject)=>{
    const t=db.transaction(store,'readwrite');t.objectStore(store).put(value,id);t.oncomplete=()=>resolve();t.onabort=t.onerror=()=>reject(t.error??Error('Storage failed'));
  });}finally{db.close();}}
  async key():Promise<Key>{const k=await generateKey();await this.put('keys',k.public,k.secret);insist(await this.get('keys',k.public),'Game key was not saved');return k;}
  async history(id:string):Promise<Archive|undefined>{return this.get('games',id);}
  async lock<T>(id:string,fn:()=>Promise<T>):Promise<T>{
    insist(navigator.locks,'This browser needs Web Locks to prevent conflicting moves from multiple tabs');
    return navigator.locks.request('xchess-peer:'+id,fn);
  }
}
