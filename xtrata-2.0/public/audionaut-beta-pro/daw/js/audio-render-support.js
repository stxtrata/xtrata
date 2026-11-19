// Delivery policy, separate from live playback and asset decoding. WebKit's
// AudioBufferSourceNode GC visitor takes the same lock that its renderer only
// try-locks: contention can insert a silent quantum and shift the sample cursor.
// A short successful audio probe cannot establish that this race is absent.
// https://github.com/WebKit/WebKit/blob/main/Source/WebCore/bindings/js/JSAudioBufferSourceNodeCustom.cpp
// https://github.com/WebKit/WebKit/blob/main/Source/WebCore/Modules/webaudio/AudioBufferSourceNode.cpp
export const OFFLINE_WEBKIT_ERROR='AUDIONAUT_OFFLINE_WEBKIT_UNSUPPORTED';
export const OFFLINE_WEBKIT_REASON='Audio export, bounce and freeze are unavailable in this browser because its audio engine can skip samples during offline rendering. Open this project in desktop Chrome, Edge or Firefox to render audio. Live playback, project editing, imports and project-file exports remain available.';

export function offlineRenderSupport(browser=globalThis.navigator){
  const ua=String(browser?.userAgent||''),platform=String(browser?.platform||'');
  // iOS browser brand tokens (CriOS/FxiOS/EdgiOS) must not be mistaken for their
  // desktop engines. iPad's desktop-mode identity may report MacIntel instead.
  const ios=/iPad|iPhone|iPod|\b(?:CriOS|FxiOS|EdgiOS|OPiOS)\//i.test(ua)||(/Mac/i.test(platform)&&Number(browser?.maxTouchPoints)>1);
  const blink=!ios&&(/\b(?:Chrome|Chromium|Edg|EdgA|OPR)\//i.test(ua)||browser?.userAgentData?.brands?.some(item=>/Chromium|Google Chrome|Microsoft Edge/i.test(item.brand)));
  const webkit=ios||(/AppleWebKit\//i.test(ua)&&!blink);
  return webkit?{supported:false,engine:'webkit',code:OFFLINE_WEBKIT_ERROR,reason:OFFLINE_WEBKIT_REASON}:{supported:true,engine:blink?'blink':/Gecko\//i.test(ua)?'gecko':'unknown',code:null,reason:null};
}

// No bypass option: public rendering APIs always inspect the active browser.
// A separate reason can describe a narrower operation such as IR conversion.
export function assertOfflineRenderSupported(reason){
  const support=offlineRenderSupport();
  if(!support.supported){const error=new Error(reason||support.reason);error.name='UnsupportedAudioRenderError';error.code=support.code;throw error;}
  return support;
}
