/**
 * js/perf.js
 * Real-Time FPS Telemetry HUD & Battery Saver Power Mode (pip-perf-hud / pip-perf.exe)
 * Pure vanilla ES6 implementation with zero external dependencies.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PIP = root.PIP || {};
    root.PIP.perf = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var ECO_KEY = 'pipos_eco_mode';
  var MAX_SAMPLES = 60;

  var state = {
    fps: 60,
    avgFps: 60,
    frameTimeMs: 16.6,
    samples: [],
    lastTime: 0,
    ecoMode: false,
    hudVisible: false,
    batteryLevel: null,
    isCharging: null,
    animId: null
  };

  function getStorage() {
    try {
      if (typeof localStorage !== 'undefined') {
        return localStorage;
      }
    } catch (_) {}
    return null;
  }

  function load() {
    var store = getStorage();
    if (!store) return;
    try {
      state.ecoMode = store.getItem(ECO_KEY) === 'true';
    } catch (_) {
      state.ecoMode = false;
    }
  }

  function save() {
    var store = getStorage();
    if (!store) return;
    try {
      store.setItem(ECO_KEY, state.ecoMode ? 'true' : 'false');
    } catch (_) {}
  }

  function recordFrame(now) {
    var timestamp = typeof now === 'number' ? now : (typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now());
    if (!state.lastTime) {
      state.lastTime = timestamp;
      return { fps: state.fps, frameTimeMs: state.frameTimeMs };
    }

    var delta = timestamp - state.lastTime;
    state.lastTime = timestamp;

    if (delta > 0) {
      var currentFps = Math.round(1000 / delta);
      // Clamp reasonable FPS bounds [1, 240]
      currentFps = Math.max(1, Math.min(240, currentFps));

      state.frameTimeMs = parseFloat(delta.toFixed(1));
      state.fps = currentFps;
      state.samples.push(currentFps);
      if (state.samples.length > MAX_SAMPLES) {
        state.samples.shift();
      }

      var sum = 0;
      for (var i = 0; i < state.samples.length; i++) {
        sum += state.samples[i];
      }
      state.avgFps = Math.round(sum / state.samples.length);
    }

    return {
      fps: state.fps,
      avgFps: state.avgFps,
      frameTimeMs: state.frameTimeMs
    };
  }

  function toggleEcoMode() {
    state.ecoMode = !state.ecoMode;
    save();

    if (typeof document !== 'undefined' && document.documentElement) {
      if (state.ecoMode) {
        document.documentElement.classList.add('eco-mode');
      } else {
        document.documentElement.classList.remove('eco-mode');
      }
    }

    updateUI();

    if (typeof PIP !== 'undefined' && PIP.toast) {
      PIP.toast(state.ecoMode ? '🍃 Eco Battery Saver Mode Activated' : '⚡ High Performance Mode Restored');
    }

    return state.ecoMode;
  }

  function isEcoMode() {
    return state.ecoMode;
  }

  function toggleHud() {
    state.hudVisible = !state.hudVisible;
    if (typeof document !== 'undefined') {
      var hud = document.getElementById('perfHud');
      if (hud) {
        if (state.hudVisible) {
          hud.classList.remove('is-hidden');
          hud.removeAttribute('inert');
        } else {
          hud.classList.add('is-hidden');
          hud.setAttribute('inert', '');
        }
      }
    }
    return state.hudVisible;
  }

  function detectBattery() {
    if (typeof navigator !== 'undefined' && navigator.getBattery) {
      navigator.getBattery().then(function (battery) {
        function updateBattery() {
          state.batteryLevel = Math.round(battery.level * 100);
          state.isCharging = battery.charging;
          updateUI();
        }
        updateBattery();
        battery.addEventListener('levelchange', updateBattery);
        battery.addEventListener('chargingchange', updateBattery);
      }).catch(function () {});
    }
  }

  function updateUI() {
    if (typeof document === 'undefined') return;

    var fpsVal = document.getElementById('perfFpsVal');
    if (fpsVal) fpsVal.textContent = state.fps + ' FPS';

    var avgVal = document.getElementById('perfAvgVal');
    if (avgVal) avgVal.textContent = state.avgFps + ' FPS';

    var msVal = document.getElementById('perfMsVal');
    if (msVal) msVal.textContent = state.frameTimeMs + ' ms';

    var hudFps = document.getElementById('perfHudFps');
    if (hudFps) hudFps.textContent = state.fps + ' FPS';

    var ecoBtn = document.getElementById('perfEcoBtn');
    if (ecoBtn) {
      ecoBtn.textContent = state.ecoMode ? '🍃 Eco Mode: ON' : '⚡ Eco Mode: OFF';
      ecoBtn.setAttribute('aria-pressed', state.ecoMode ? 'true' : 'false');
      if (state.ecoMode) ecoBtn.classList.add('btn-active');
      else ecoBtn.classList.remove('btn-active');
    }

    var batteryEl = document.getElementById('perfBatteryVal');
    if (batteryEl) {
      if (state.batteryLevel !== null) {
        batteryEl.textContent = state.batteryLevel + '%' + (state.isCharging ? ' ⚡ (Charging)' : '');
      } else {
        batteryEl.textContent = 'AC Powered / Standalone';
      }
    }
  }

  function init() {
    load();
    detectBattery();

    if (state.ecoMode && typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.classList.add('eco-mode');
    }

    var ecoBtn = document.getElementById('perfEcoBtn');
    var hudBtn = document.getElementById('perfToggleHudBtn');
    var closeHudBtn = document.getElementById('perfCloseHudBtn');

    if (ecoBtn) {
      ecoBtn.addEventListener('click', function () {
        toggleEcoMode();
      });
    }

    if (hudBtn) {
      hudBtn.addEventListener('click', function () {
        toggleHud();
      });
    }

    if (closeHudBtn) {
      closeHudBtn.addEventListener('click', function () {
        toggleHud();
      });
    }

    // Performance telemetry ticker loop
    function loop(time) {
      recordFrame(time);
      updateUI();
      if (typeof requestAnimationFrame !== 'undefined') {
        state.animId = requestAnimationFrame(loop);
      }
    }

    if (typeof requestAnimationFrame !== 'undefined') {
      state.animId = requestAnimationFrame(loop);
    }

    updateUI();
  }

  // Pre-load
  load();

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }

  return {
    recordFrame: recordFrame,
    toggleEcoMode: toggleEcoMode,
    isEcoMode: isEcoMode,
    toggleHud: toggleHud,
    getState: function () {
      return {
        fps: state.fps,
        avgFps: state.avgFps,
        frameTimeMs: state.frameTimeMs,
        ecoMode: state.ecoMode,
        hudVisible: state.hudVisible,
        batteryLevel: state.batteryLevel,
        isCharging: state.isCharging
      };
    },
    load: load,
    save: save,
    init: init
  };
});
