import {app,shell,dialog,Menu} from 'electron';
import {join} from 'node:path';
import {RadioWizard} from './app/scripts/wizard/radio-plays-backend.mjs';
import {launchDesktop} from './window.mjs';
import {externalURL,openLink} from './navigation.mjs';
let win,server,wizard,quitting=false;
const focus=()=>{if(win){if(win.isMinimized())win.restore();win.show();win.focus();}};
if(!app.requestSingleInstanceLock())app.quit();
else {
 app.on('second-instance',()=>focus());
 app.on('open-url',(event,url)=>{event.preventDefault();if(openLink(url))focus();});
 app.on('window-all-closed',()=>app.quit());
 app.on('before-quit',()=>{quitting=true;wizard?.stop();server?.close();});
 void (async()=>{
 await app.whenReady();
 try {
  // Electron chooses the OS application-data folder. Never use the repository's funded wizard.
  wizard=new RadioWizard(join(app.getPath('userData'),'support-wallet'));
  await wizard.setup(); // Creates/reuses an empty local wallet; does not fund, approve or sign.
  ({window:win,server}=await launchDesktop(wizard));
  if(app.isPackaged)app.setAsDefaultProtocolClient('xtrata-music');
  const visit=url=>{if(externalURL(url))void shell.openExternal(url);};
  Menu.setApplicationMenu(Menu.buildFromTemplate([
   ...(process.platform==='darwin'?[{label:'Xtrata Music',submenu:[{role:'about'},{type:'separator'},{role:'quit'}]}]:[]),
   {label:'Edit',submenu:[{role:'copy'},{role:'paste'},{role:'selectAll'}]},
   {label:'Help',submenu:[{label:'Downloads, help & news',click:()=>visit('https://xtrata.xyz/music/lounge')},{label:'Show wallet folder',click:()=>shell.openPath(app.getPath('userData'))}]}
  ]));

 }catch(error){if(!quitting)dialog.showErrorBox('Xtrata Music could not start','Your wallet files have not been removed. Close any other copy and try again.\n\n'+error.message);app.quit();}
 })();
}
