import {app,BrowserWindow,session,shell} from 'electron';
import {randomBytes} from 'node:crypto';
import {createWizardServer} from './app/scripts/wizard/radio-plays-server.mjs';
import {externalURL,localNavigation} from './navigation.mjs';
export async function launchDesktop(wizard,media,options={}){
  const token=randomBytes(32).toString('hex');
  const server=createWizardServer(wizard,null,media,{desktopToken:token,releasePlatforms:options.releasePlatforms||[],runtimePlatform:process.platform});
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
  const origin=`http://127.0.0.1:${server.address().port}`;
  const isolated=session.fromPartition('music-'+randomBytes(16).toString('hex'));
  isolated.setPermissionRequestHandler((wc,permission,callback)=>callback(permission==='clipboard-sanitized-write'&&localNavigation(wc?.getURL()||'',origin)));
  isolated.setPermissionCheckHandler((_wc,permission,requestingOrigin)=>permission==='clipboard-sanitized-write'&&requestingOrigin===origin);
  await isolated.cookies.set({url:origin,name:'xtrataDesktop',value:token,httpOnly:true,sameSite:'strict',path:'/'});
  const win=new BrowserWindow({width:1280,height:920,minWidth:390,minHeight:600,title:'Xtrata Music',backgroundColor:'#0c1113',show:false,webPreferences:{session:isolated,nodeIntegration:false,contextIsolation:true,sandbox:true,webSecurity:true,webviewTag:false,backgroundThrottling:false,devTools:!app.isPackaged}});
  const visit=url=>{if(externalURL(url))void shell.openExternal(url);};
  win.webContents.setWindowOpenHandler(({url})=>{visit(url);return {action:'deny'};});
  win.webContents.on('will-navigate',(event,url)=>{if(!localNavigation(url,origin)){event.preventDefault();visit(url);}});
  win.webContents.on('will-redirect',(event,url)=>{if(!localNavigation(url,origin))event.preventDefault();});
  win.webContents.on('will-attach-webview',event=>event.preventDefault());
  isolated.on('will-download',event=>event.preventDefault());
  win.on('close',()=>{wizard.stop();server.close();});
  win.once('ready-to-show',()=>win.show());
  await win.loadURL(origin+'/lounge');
  return {window:win,server,origin};
}
