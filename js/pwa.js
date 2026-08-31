/* ============================================================
   ENZO — PWA. Registers the service worker on every page so the
   calculator is cached before a buyer needs it offline, but shows
   the install affordance on calculator.html only. No prompt on
   arrival, no modal, no overlay.

   Storage is one key recording that the button was dismissed.
   Nothing else is stored, sent or measured.
   ============================================================ */
(function () {
  'use strict';
  if (!('serviceWorker' in navigator)) return;

  var DISMISSED = 'enzo-install-dismissed';

  // ── Register sitewide, and take a new deploy without a stale tab ──
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js').then(function (reg) {
      reg.addEventListener('updatefound', function () {
        var sw = reg.installing;
        if (!sw) return;
        sw.addEventListener('statechange', function () {
          // A new worker is waiting and an old one is running: hand over
          // immediately rather than leaving this tab on stale files.
          if (sw.state === 'installed' && navigator.serviceWorker.controller) {
            sw.postMessage('SKIP_WAITING');
          }
        });
      });
    }).catch(function () { /* registration blocked or unsupported — site still works */ });
  });

  var refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', function () {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });

  // ── Everything below is calculator-only ──
  var host = document.getElementById('install-host');
  if (!host) return;

  var standalone = window.matchMedia('(display-mode: standalone)').matches ||
                   window.navigator.standalone === true;
  if (standalone) return;                                   // already installed
  try { if (localStorage.getItem(DISMISSED)) return; } catch (e) { /* private mode */ }

  function show(html) { host.innerHTML = html; host.hidden = false; }

  function dismiss() {
    host.hidden = true;
    try { localStorage.setItem(DISMISSED, '1'); } catch (e) { /* non-fatal */ }
  }

  // Android / desktop Chromium: capture the event, suppress the default bar.
  var deferred = null;
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferred = e;
    show('<button type="button" class="btn btn-secondary" id="install-go">Install calculator</button>' +
         '<button type="button" class="install-dismiss" id="install-no" aria-label="Dismiss">Not now</button>');
    document.getElementById('install-go').addEventListener('click', function () {
      if (!deferred) return;
      deferred.prompt();
      deferred.userChoice.then(function () { deferred = null; dismiss(); });
    });
    document.getElementById('install-no').addEventListener('click', dismiss);
  });

  window.addEventListener('appinstalled', dismiss);

  // iOS Safari never fires beforeinstallprompt, so tell the user the manual
  // route instead of showing a button that cannot work.
  var ua  = navigator.userAgent;
  var iOS = /iPad|iPhone|iPod/.test(ua) ||
            (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (iOS && /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua)) {
    show('<p class="install-note">To keep this calculator on your home screen: ' +
         'tap <strong>Share</strong>, then <strong>Add to Home Screen</strong>.</p>' +
         '<button type="button" class="install-dismiss" id="install-no" aria-label="Dismiss">Not now</button>');
    document.getElementById('install-no').addEventListener('click', dismiss);
  }
})();
