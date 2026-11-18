/* monitor.js: Pip's Nursery Resource & Slumber Cadence Monitor (pip-monitor.exe)
   Monitors system heap memory, render FPS/frame cadence, starlight power/battery,
   and provides active toy process lifecycle management with zero external dependencies. */
(function () {
  'use strict';

  var PIP = (typeof window !== 'undefined' && window.PIP) ? window.PIP : {};
  var $ = PIP.$ || function () { return null; };
  var $$ = PIP.$$ || function () { return []; };
  var store = PIP.store || { get: function () { return ''; }, set: function () {} };
  var clamp = PIP.clamp || function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var toast = PIP.toast || function () {};
  var reduce = PIP.reduceMotion || { matches: false };
  var audio = PIP.audio || { isOn: function () { return false; }, note: function () {}, pop: function () {}, SCALE: [523, 659, 784] };

  var state = {
    fps: 60,
    fpsHistory: [60, 59, 60, 60, 58, 60, 61, 60, 59, 60, 60, 60, 59, 60, 60],
    memoryMB: 28.4,
    memoryLimitMB: 64.0,
    memoryPercent: 44,
    batteryPercent: 100,
    batteryCharging: true,
    running: false,
    processes: [
      { id: 'lullaby', name: 'lullaby-lab.exe', mem: 14.2, status: 'Awake', cpu: '2.1%' },
      { id: 'lights', name: 'nightlight.exe', mem: 8.7, status: 'Awake', cpu: '1.4%' },
      { id: 'blocks', name: 'rattle-blocks.exe', mem: 19.5, status: 'Sleeping', cpu: '0.0%' },
      { id: 'route', name: 'dream-delivery.exe', mem: 11.3, status: 'Awake', cpu: '1.8%' },
      { id: 'storybook', name: 'storybook.exe', mem: 6.4, status: 'Sleeping', cpu: '0.0%' },
      { id: 'stickers', name: 'sticker-book.exe', mem: 4.1, status: 'Awake', cpu: '0.5%' }
    ]
  };

  var rafId = null;
  var lastFrameTime = 0;
  var frameCount = 0;
  var fpsTimer = 0;

  function calculateMemory() {
    if (typeof performance !== 'undefined' && performance.memory) {
      var used = performance.memory.usedJSHeapSize / (1024 * 1024);
      var total = performance.memory.totalJSHeapSize / (1024 * 1024);
      var limit = performance.memory.jsHeapSizeLimit / (1024 * 1024);
      state.memoryMB = parseFloat(used.toFixed(1));
      state.memoryLimitMB = parseFloat((total || limit || 64.0).toFixed(1));
      state.memoryPercent = clamp(Math.round((used / (total || 64.0)) * 100), 5, 98);
    } else {
      // Calculate dynamic simulated nursery memory based on active processes
      var totalMem = 12.0;
      state.processes.forEach(function (p) {
        if (p.status === 'Awake') totalMem += p.mem;
        else totalMem += (p.mem * 0.2);
      });
      state.memoryMB = parseFloat(totalMem.toFixed(1));
      state.memoryPercent = clamp(Math.round((state.memoryMB / state.memoryLimitMB) * 100), 10, 95);
    }
    return {
      used: state.memoryMB,
      limit: state.memoryLimitMB,
      percent: state.memoryPercent
    };
  }

  function updateBattery() {
    if (typeof navigator !== 'undefined' && typeof navigator.getBattery === 'function') {
      try {
        navigator.getBattery().then(function (battery) {
          state.batteryPercent = Math.round(battery.level * 100);
          state.batteryCharging = battery.charging;
          renderBattery();
        }).catch(function () {});
      } catch (e) {}
    }
  }

  function renderSparkline() {
    var svg = $('#monSparkline');
    if (!svg) return;
    var pts = state.fpsHistory;
    var w = 180, h = 36;
    var min = 30, max = 65;
    var poly = pts.map(function (v, idx) {
      var x = (idx / (pts.length - 1)) * w;
      var y = h - ((clamp(v, min, max) - min) / (max - min)) * (h - 6) - 3;
      return x.toFixed(1) + ',' + y.toFixed(1);
    }).join(' ');

    var path = svg.querySelector('.spark-line');
    if (path) path.setAttribute('points', poly);
  }

  function renderBattery() {
    var bLabel = $('#monBatteryVal');
    var bBar = $('#monBatteryBar');
    if (bLabel) {
      bLabel.textContent = state.batteryPercent + '% ' + (state.batteryCharging ? '⚡ (Starlight AC)' : '🔋 (Battery)');
    }
    if (bBar) {
      bBar.style.width = state.batteryPercent + '%';
      bBar.setAttribute('aria-valuenow', state.batteryPercent);
    }
  }

  function renderVitals() {
    var fpsVal = $('#monFpsVal');
    var fpsBar = $('#monFpsBar');
    var memVal = $('#monMemVal');
    var memBar = $('#monMemBar');

    calculateMemory();

    if (fpsVal) {
      var lat = (1000 / Math.max(1, state.fps)).toFixed(1);
      fpsVal.textContent = state.fps + ' FPS (' + lat + 'ms)';
    }
    if (fpsBar) {
      var fpsPct = clamp(Math.round((state.fps / 60) * 100), 10, 100);
      fpsBar.style.width = fpsPct + '%';
      fpsBar.setAttribute('aria-valuenow', state.fps);
      fpsBar.classList.toggle('is-warn', state.fps < 45);
    }
    if (memVal) {
      memVal.textContent = state.memoryMB + ' MB / ' + state.memoryLimitMB + ' MB (' + state.memoryPercent + '%)';
    }
    if (memBar) {
      memBar.style.width = state.memoryPercent + '%';
      memBar.setAttribute('aria-valuenow', state.memoryPercent);
      memBar.classList.toggle('is-warn', state.memoryPercent > 75);
    }

    renderSparkline();
  }

  function renderProcessTable() {
    var tbody = $('#monProcBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    state.processes.forEach(function (proc, idx) {
      var tr = document.createElement('tr');
      tr.className = 'proc-row ' + (proc.status === 'Awake' ? 'proc-awake' : 'proc-sleep');

      var tdName = document.createElement('td');
      tdName.className = 'proc-name';
      tdName.innerHTML = '<span class="proc-dot" aria-hidden="true"></span>' + proc.name;

      var tdStatus = document.createElement('td');
      tdStatus.className = 'proc-status';
      tdStatus.textContent = proc.status;

      var tdMem = document.createElement('td');
      tdMem.className = 'proc-mem';
      tdMem.textContent = proc.mem + ' MB';

      var tdAction = document.createElement('td');
      tdAction.className = 'proc-action';

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-tiny';
      btn.setAttribute('data-silent', '');
      btn.textContent = proc.status === 'Awake' ? 'Sleep' : 'Wake';
      btn.setAttribute('aria-label', (proc.status === 'Awake' ? 'Put ' : 'Wake ') + proc.name);
      btn.addEventListener('click', function () {
        toggleProcess(idx);
      });

      tdAction.appendChild(btn);
      tr.appendChild(tdName);
      tr.appendChild(tdStatus);
      tr.appendChild(tdMem);
      tr.appendChild(tdAction);
      tbody.appendChild(tr);
    });
  }

  function toggleProcess(index) {
    if (index < 0 || index >= state.processes.length) return;
    var p = state.processes[index];
    p.status = (p.status === 'Awake') ? 'Sleeping' : 'Awake';
    p.cpu = (p.status === 'Awake') ? (Math.random() * 2.5 + 0.5).toFixed(1) + '%' : '0.0%';

    if (audio.isOn()) {
      audio.pop();
    }
    renderProcessTable();
    renderVitals();
  }

  function flushMemory() {
    var btn = $('#monFlushBtn');
    if (btn) btn.disabled = true;

    // Simulate garbage collector pulse
    state.memoryMB = Math.max(12.0, parseFloat((state.memoryMB * 0.72).toFixed(1)));
    state.memoryPercent = clamp(Math.round((state.memoryMB / state.memoryLimitMB) * 100), 10, 95);
    renderVitals();

    if (audio.isOn()) {
      audio.note(audio.SCALE[4], { dur: 0.6, gain: 0.18 });
      audio.note(audio.SCALE[6], { dur: 0.8, gain: 0.16, when: 0.1 });
    }

    toast('✨ Nursery memory buffer swept clean! Released heap space.');

    setTimeout(function () {
      if (btn) btn.disabled = false;
    }, 1200);
  }

  function calmAll() {
    var anyAwake = state.processes.some(function (p) { return p.status === 'Awake'; });
    state.processes.forEach(function (p) {
      p.status = anyAwake ? 'Sleeping' : 'Awake';
      p.cpu = p.status === 'Awake' ? '1.2%' : '0.0%';
    });

    if (audio.isOn()) {
      audio.note(audio.SCALE[anyAwake ? 1 : 5], { dur: 1.0, gain: 0.2 });
    }
    toast(anyAwake ? '🌙 All nursery processes put to sleep.' : '☀️ All nursery processes awakened!');
    renderProcessTable();
    renderVitals();
  }

  function loop(now) {
    if (!state.running) return;
    frameCount++;

    if (now - fpsTimer >= 1000) {
      state.fps = frameCount;
      state.fpsHistory.push(state.fps);
      if (state.fpsHistory.length > 20) state.fpsHistory.shift();
      frameCount = 0;
      fpsTimer = now;
      renderVitals();
    }

    rafId = requestAnimationFrame(loop);
  }

  function start() {
    if (state.running) return;
    state.running = true;
    lastFrameTime = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
    fpsTimer = lastFrameTime;
    frameCount = 0;
    if (typeof requestAnimationFrame === 'function') {
      rafId = requestAnimationFrame(loop);
    }
  }

  function stop() {
    state.running = false;
    if (rafId && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function initMonitor() {
    var win = $('#monitor');
    if (!win) return;

    var flushBtn = $('#monFlushBtn');
    var calmBtn = $('#monCalmBtn');

    if (flushBtn) {
      flushBtn.addEventListener('click', flushMemory);
    }
    if (calmBtn) {
      calmBtn.addEventListener('click', calmAll);
    }

    renderBattery();
    renderProcessTable();
    renderVitals();
    updateBattery();

    // Start monitoring loop when window is opened or on-screen
    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) start();
          else stop();
        });
      }, { threshold: 0.1 });
      obs.observe(win);
    } else {
      start();
    }
  }

  // Auto-init on DOMContentLoaded or immediate
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initMonitor);
    } else {
      initMonitor();
    }
  }

  var monitorAPI = {
    init: initMonitor,
    start: start,
    stop: stop,
    getState: function () { return state; },
    calculateMemory: calculateMemory,
    flushMemory: flushMemory,
    toggleProcess: toggleProcess,
    calmAll: calmAll
  };

  PIP.monitor = monitorAPI;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = monitorAPI;
  }
})();
