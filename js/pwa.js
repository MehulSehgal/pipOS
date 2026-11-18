/* pwa.js: PWA 2.0 install prompt manager and offline background action sync queue. */
(function () {
  'use strict';
  var PIP = (typeof window !== 'undefined' && window.PIP) ? window.PIP : {};
  var $ = PIP.$ || function (sel) { return document.querySelector(sel); };
  var store = PIP.store || { get: function () { return ''; }, set: function () {} };
  var toast = PIP.toast || function () {};

  var QUEUE_KEY = 'pip_pwa_offline_queue';
  var deferredInstallPrompt = null;

  function loadQueue() {
    try {
      var raw = store.get(QUEUE_KEY, '[]');
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveQueue(queue) {
    store.set(QUEUE_KEY, JSON.stringify(queue));
  }

  function enqueueOfflineAction(actionType, payload) {
    var queue = loadQueue();
    var item = {
      id: 'act_' + Date.now() + '_' + Math.floor(Math.random() * 10000),
      type: actionType,
      payload: payload,
      timestamp: Date.now()
    };
    queue.push(item);
    saveQueue(queue);
    return item;
  }

  function dequeueAction(id) {
    var queue = loadQueue();
    var updated = queue.filter(function (item) { return item.id !== id; });
    saveQueue(updated);
    return updated;
  }

  function clearQueue() {
    saveQueue([]);
  }

  function flushQueue(handler, onComplete) {
    var queue = loadQueue();
    if (queue.length === 0) {
      if (typeof onComplete === 'function') onComplete(0);
      return;
    }

    var remaining = queue.slice();
    var processedCount = 0;

    function processNext() {
      if (remaining.length === 0) {
        saveQueue([]);
        if (typeof onComplete === 'function') onComplete(processedCount);
        if (typeof window !== 'undefined' && window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('pip-sync-flushed', { detail: { count: processedCount } }));
        }
        return;
      }

      var current = remaining.shift();
      if (typeof handler === 'function') {
        handler(current, function (success) {
          if (success) {
            processedCount++;
            dequeueAction(current.id);
          }
          processNext();
        });
      } else {
        processedCount++;
        dequeueAction(current.id);
        processNext();
      }
    }

    processNext();
  }

  function initPwaInstall() {
    if (typeof window === 'undefined') return;

    var installBanner = $('#pwaInstallBanner');
    var installBtn = $('#pwaInstallBtn');
    var dismissBtn = $('#pwaDismissBtn');

    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault();
      deferredInstallPrompt = e;

      var dismissed = store.get('pip_pwa_dismissed', 'false');
      if (dismissed !== 'true' && installBanner) {
        installBanner.removeAttribute('hidden');
      }
    });

    if (installBtn) {
      installBtn.addEventListener('click', function () {
        if (!deferredInstallPrompt) return;
        installBanner.setAttribute('hidden', '');
        deferredInstallPrompt.prompt();
        deferredInstallPrompt.userChoice.then(function (choice) {
          if (choice && choice.outcome === 'accepted') {
            toast('Thank you for installing PipOS!');
          }
          deferredInstallPrompt = null;
        });
      });
    }

    if (dismissBtn) {
      dismissBtn.addEventListener('click', function () {
        if (installBanner) installBanner.setAttribute('hidden', '');
        store.set('pip_pwa_dismissed', 'true');
      });
    }

    window.addEventListener('appinstalled', function () {
      if (installBanner) installBanner.setAttribute('hidden', '');
      toast('PipOS is installed. Welcome to the nursery!');
    });

    // Auto-flush queue when connection is restored
    window.addEventListener('online', function () {
      var queue = loadQueue();
      if (queue.length > 0) {
        toast('Connection restored. Syncing ' + queue.length + ' offline wish(es)...');
        flushQueue(function (item, done) {
          // Pass item to PIP.wall if present
          if (item.type === 'wish' && PIP.wall && typeof PIP.wall.postWish === 'function') {
            PIP.wall.postWish(PIP.wall.getActiveBackend(), item.payload, function (ok) {
              done(ok);
            });
          } else {
            done(true);
          }
        }, function (count) {
          toast('Synced ' + count + ' offline wish(es) to the nursery wall!');
        });
      }
    });
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initPwaInstall);
    } else {
      initPwaInstall();
    }
  }

  PIP.pwa = {
    enqueueOfflineAction: enqueueOfflineAction,
    dequeueAction: dequeueAction,
    loadQueue: loadQueue,
    clearQueue: clearQueue,
    flushQueue: flushQueue,
    getDeferredPrompt: function () { return deferredInstallPrompt; }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = PIP.pwa;
  }
})();
