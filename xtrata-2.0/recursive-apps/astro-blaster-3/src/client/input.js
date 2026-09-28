// ---------------------------------------------------------------------------
// Input: keyboard, gamepad and touch -> the sim's { ax, ay, cmd } (ax/ay in -4..4)
// ---------------------------------------------------------------------------

var Input = (function () {
  var keys = {};
  var pendingCmd = 0;
  var touch = { active: false, id: null, fx0: 0, fy0: 0, sx0: 0, sy0: 0, fx: 0, fy: 0 };
  var usedTouch = false;
  var handlers = {};
  var SENS = 1.35;
  var gpState = {};

  function on(name, fn) { handlers[name] = fn; }
  function emit(name, a) { if (handlers[name]) handlers[name](a); }

  var MAP = {
    ArrowLeft: 'l', KeyA: 'l', ArrowRight: 'r', KeyD: 'r', ArrowUp: 'u', KeyW: 'u', ArrowDown: 'd', KeyS: 'd'
  };

  window.addEventListener('keydown', function (e) {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
    var k = MAP[e.code];
    if (k) { keys[k] = true; e.preventDefault(); }
    if (e.repeat) return;
    if (e.code === 'KeyX' || e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'Space' || e.code === 'KeyB') { pendingCmd = AB3.CMD.BOMB; emit('bomb'); e.preventDefault(); }
    if (e.code === 'KeyP' || e.code === 'Escape') emit('pause');
    if (/^Digit[1-4]$/.test(e.code) || /^Numpad[1-4]$/.test(e.code)) emit('number', +e.code.slice(-1));
    if (e.code === 'Enter' || e.code === 'NumpadEnter') emit('enter');
  });
  window.addEventListener('keyup', function (e) { var k = MAP[e.code]; if (k) keys[k] = false; });
  window.addEventListener('blur', function () { keys = {}; touch.active = false; emit('blur'); });

  function bindTouch(el) {
    el.addEventListener('touchstart', function (e) {
      usedTouch = true;
      if (touch.active) return;
      var t = e.changedTouches[0];
      var w = R.toWorld(t.clientX, t.clientY);
      touch.active = true; touch.id = t.identifier;
      touch.fx0 = touch.fx = w[0]; touch.fy0 = touch.fy = w[1];
      var p = handlers.shipPos ? handlers.shipPos() : [180, 550];
      touch.sx0 = p[0]; touch.sy0 = p[1];
      e.preventDefault();
    }, { passive: false });
    el.addEventListener('touchmove', function (e) {
      for (var i = 0; i < e.changedTouches.length; i++) {
        var t = e.changedTouches[i];
        if (t.identifier !== touch.id) continue;
        var w = R.toWorld(t.clientX, t.clientY);
        touch.fx = w[0]; touch.fy = w[1];
      }
      e.preventDefault();
    }, { passive: false });
    function end(e) {
      for (var i = 0; i < e.changedTouches.length; i++) if (e.changedTouches[i].identifier === touch.id) touch.active = false;
    }
    el.addEventListener('touchend', end); el.addEventListener('touchcancel', end);
    // mouse drag works like touch (handy on desktop too)
    var mouseDown = false;
    el.addEventListener('mousedown', function (e) {
      mouseDown = true;
      var w = R.toWorld(e.clientX, e.clientY);
      touch.active = true; touch.id = 'mouse'; touch.fx0 = touch.fx = w[0]; touch.fy0 = touch.fy = w[1];
      var p = handlers.shipPos ? handlers.shipPos() : [180, 550];
      touch.sx0 = p[0]; touch.sy0 = p[1];
    });
    window.addEventListener('mousemove', function (e) { if (!mouseDown) return; var w = R.toWorld(e.clientX, e.clientY); touch.fx = w[0]; touch.fy = w[1]; });
    window.addEventListener('mouseup', function () { if (mouseDown) { mouseDown = false; touch.active = false; } });
  }

  function q(v) { return Math.max(-4, Math.min(4, Math.round(v))); }
  function touchLevel(d, sp) {
    var a = Math.abs(d);
    if (a < sp * 0.35) return 0;
    var lvl = a < sp * 1.2 ? 2 : 4;
    return d < 0 ? -lvl : lvl;
  }

  function sample(st) {
    var ax = 0, ay = 0;
    var p = st.player;
    var sp = 3.4; for (var i = 0; i < p.mods.after; i++) sp *= 1.12;
    if (touch.active) {
      var tx = Math.max(12, Math.min(AB3.W - 12, touch.sx0 + (touch.fx - touch.fx0) * SENS));
      var ty = Math.max(70, Math.min(AB3.H - 24, touch.sy0 + (touch.fy - touch.fy0) * SENS));
      var dx = tx - p.x, dy = ty - p.y;
      // Coarse, steady levels (0, 2 or 4) with a small dead zone: smooth to steer and
      // far fewer input changes, which keeps long replays under the size cap.
      ax = touchLevel(dx, sp); ay = touchLevel(dy, sp);
    } else {
      if (keys.l) ax -= 4; if (keys.r) ax += 4;
      if (keys.u) ay -= 4; if (keys.d) ay += 4;
      var pads = navigator.getGamepads ? navigator.getGamepads() : [];
      for (var g = 0; g < pads.length; g++) {
        var pad = pads[g];
        if (!pad) continue;
        var gx = pad.axes[0] || 0, gy = pad.axes[1] || 0;
        if (pad.buttons[14] && pad.buttons[14].pressed) gx = -1;
        if (pad.buttons[15] && pad.buttons[15].pressed) gx = 1;
        if (pad.buttons[12] && pad.buttons[12].pressed) gy = -1;
        if (pad.buttons[13] && pad.buttons[13].pressed) gy = 1;
        if (Math.abs(gx) > 0.2) ax = q(gx * 4);
        if (Math.abs(gy) > 0.2) ay = q(gy * 4);
        var bombBtn = (pad.buttons[0] && pad.buttons[0].pressed) || (pad.buttons[1] && pad.buttons[1].pressed);
        var gs = gpState[pad.index] || (gpState[pad.index] = {});
        if (bombBtn && !gs.bomb) pendingCmd = AB3.CMD.BOMB;
        gs.bomb = bombBtn;
        var st9 = pad.buttons[9] && pad.buttons[9].pressed;
        if (st9 && !gs.start) emit('pause');
        gs.start = st9;
      }
    }
    var cmd = pendingCmd; pendingCmd = 0;
    return { ax: ax, ay: ay, cmd: cmd };
  }

  function bomb() { pendingCmd = AB3.CMD.BOMB; }
  function reset() { keys = {}; touch.active = false; pendingCmd = 0; }

  return { bindTouch: bindTouch, sample: sample, on: on, bomb: bomb, reset: reset, usedTouch: function () { return usedTouch; } };
})();
