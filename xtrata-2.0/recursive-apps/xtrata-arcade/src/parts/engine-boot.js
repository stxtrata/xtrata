
/* Engine boot: the flat room builds (hidden behind the 3D hall) and owns sessions, boards and the wallet. */
window.XA_CONFIG = Object.assign(window.XA_CONFIG || {}, { subtitle: (window.XA && window.XA.games.length !== 21 ? window.XA.games.length : 'Twenty-one') + ' games, one on-chain leaderboard contract · post scores from xtrata.xyz' });
XARoom.boot(document.getElementById('xa-root'));
