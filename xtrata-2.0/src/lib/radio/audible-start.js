// Notifications only: the lounge and local companion own payment authority.
// Select before play(): the playing event precedes the play() promise resolving.
export function attachAudibleStart(player, notify) {
  let song = null;
  let observed = false;
  const emit = () => {
    if (observed || song === null || player.readyState < 3 || player.paused ||
        player.ended || player.muted || player.volume === 0 ||
        !Number.isFinite(player.duration) || player.duration < 60) return;
    observed = true;
    notify({ song, duration: player.duration, id: crypto.randomUUID().replaceAll('-', '') });
  };
  player.addEventListener('playing', emit);
  player.addEventListener('volumechange', emit);
  return {
    select(id) { song = Number.isSafeInteger(id) && id >= 0 ? id : null; observed = false; },
    dispose() { player.removeEventListener('playing', emit); player.removeEventListener('volumechange', emit); }
  };
}
