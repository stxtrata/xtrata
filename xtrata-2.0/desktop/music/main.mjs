import {app,shell,dialog,Menu,safeStorage} from 'electron';
import {join} from 'node:path';
import {RadioWizard} from './app/scripts/wizard/radio-plays-backend.mjs';
import {launchDesktop} from './window.mjs';
import {createWindowsVaultProtector} from './windows-vault-protection.mjs';
import {unavailableWallet} from './unavailable-wallet.mjs';
import {externalURL,openLink,protocolOpenArgument} from './navigation.mjs';
import {releasePlatformsForRuntime} from './release-platforms.mjs';
let win,server,wizard,quitting=false;
const focus=()=>{if(win){if(win.isMinimized())win.restore();win.show();win.focus();}};
if(!app.requestSingleInstanceLock())app.quit();
else {
 if(process.platform==='win32')app.setAppUserModelId('xyz.xtrata.music');
 // Windows sends custom-protocol URLs through this event. They only focus the
 // app; neither a deep link nor a second instance can enable support or sign.
 app.on('second-instance',(_event,commandLine)=>{
  // Parse only the inert route before focusing. No command-line value reaches
  // the wallet, listening approval, or transaction code.
  if(protocolOpenArgument(commandLine)){focus();return;}
  focus();
 });
 app.on('open-url',(event,url)=>{event.preventDefault();if(openLink(url))focus();});
 app.on('window-all-closed',()=>app.quit());
 app.on('before-quit',()=>{quitting=true;wizard?.stop();server?.close();});
 void (async()=>{
 await app.whenReady();
 try {
 // Electron chooses the OS application-data folder. Never use the repository's funded wizard.
  const vaultProtector=process.platform==='win32'?createWindowsVaultProtector(safeStorage):null;
  wizard=new RadioWizard(join(app.getPath('userData'),'support-wallet'),fetch,{platform:process.platform,vaultProtector,canRecoverStaleLock:true});
  try {
   await wizard.setup(); // Creates/reuses an empty local wallet; does not fund, approve or sign.
  } catch (error) {
   // A corrupted or non-DPAPI wallet must never be replaced. It only disables
   // support payments; the player still launches in free-listening mode.
   if(process.platform==='win32')wizard=unavailableWallet(error);
   else throw error;
  }
  ({window:win,server}=await launchDesktop(wizard,undefined,{releasePlatforms:releasePlatformsForRuntime(process.platform,process.arch)}));
  if(app.isPackaged)app.setAsDefaultProtocolClient('xtrata-music');
  if(protocolOpenArgument(process.argv))focus();
  const visit=url=>{if(externalURL(url))void shell.openExternal(url);};
  Menu.setApplicationMenu(Menu.buildFromTemplate([
   ...(process.platform==='darwin'?[{label:'Xtrata Music',submenu:[{role:'about'},{type:'separator'},{role:'quit'}]}]:[]),
   {label:'Edit',submenu:[{role:'copy'},{role:'paste'},{role:'selectAll'}]},
   {label:'Help',submenu:[{label:'Downloads, help & news',click:()=>visit('https://xtrata.xyz/music/lounge')},{label:'Show wallet folder',click:()=>shell.openPath(app.getPath('userData'))}]}
  ]));

 }catch(error){if(!quitting)dialog.showErrorBox('Xtrata Music could not start','Your wallet files have not been removed. Close any other copy and try again.\n\n'+error.message);app.quit();}
 })();
}
