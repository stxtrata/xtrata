import {it,expect,vi} from 'vitest';
import {attachAudibleStart} from '../audible-start.js';
it('notifies the selected song before play resolves; pause/resume and seeking do not duplicate',()=>{
 const player=Object.assign(new EventTarget(),{readyState:4,paused:false,ended:false,muted:false,volume:1});const notify=vi.fn(),observer=attachAudibleStart(player,notify);
 observer.select(315);player.dispatchEvent(new Event('playing'));player.dispatchEvent(new Event('playing'));player.dispatchEvent(new Event('seeked'));expect(notify).toHaveBeenCalledTimes(1);expect(notify.mock.calls[0][0].song).toBe(315);
 observer.select(2883);player.dispatchEvent(new Event('playing'));expect(notify.mock.calls[1][0].song).toBe(2883);expect(notify.mock.calls[1][0].id).not.toBe(notify.mock.calls[0][0].id);observer.dispose();
});
it('does not notify inaudible/failed loads and notifies once after unmuting',()=>{
 const player=Object.assign(new EventTarget(),{readyState:0,paused:false,ended:false,muted:false,volume:1});const notify=vi.fn(),observer=attachAudibleStart(player,notify);observer.select(315);player.dispatchEvent(new Event('volumechange'));player.readyState=4;player.muted=true;player.dispatchEvent(new Event('playing'));expect(notify).not.toHaveBeenCalled();player.muted=false;player.dispatchEvent(new Event('volumechange'));expect(notify).toHaveBeenCalledTimes(1);observer.dispose();
});
