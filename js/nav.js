/* ============================================================
   ENZO — shared header behaviour.
   Owns three things and nothing else: the solid-on-scroll state,
   the mobile panel, and marking the current page in the nav.
   Loaded on every page; replaces the per-page inline scripts.
   ============================================================ */
(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.menu-toggle');
  var panel  = document.getElementById('mobile-nav');

  /* ── Solid on scroll ──
     Pages with a dark full-bleed hero carry .over-hero and start
     transparent. Every other page is .is-static and stays solid. */
  if (header && header.classList.contains('over-hero')) {
    var onScroll = function () {
      header.classList.toggle('is-solid', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ── Mobile panel ── */
  if (toggle && panel) {
    var setOpen = function (open) {
      panel.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    };
    toggle.addEventListener('click', function () {
      setOpen(!panel.classList.contains('open'));
    });
    panel.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('open')) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* ── Catalog submenu ──
     Desktop opens on hover/focus via CSS. These handlers add the tap and
     keyboard paths, so touch and keyboard never depend on hover. The parent
     stays an ordinary link to catalog.html throughout. */
  document.querySelectorAll('.nav-sub-toggle, .mobile-sub-toggle').forEach(function (btn) {
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    if (!panel) return;
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      panel.classList.toggle('open', !open);
    });
  });

  var closeSubs = function (refocus) {
    document.querySelectorAll('.nav-sub.open').forEach(function (panel) {
      panel.classList.remove('open');
      var btn = document.querySelector('[aria-controls="' + panel.id + '"]');
      if (btn) { btn.setAttribute('aria-expanded', 'false'); if (refocus) btn.focus(); }
    });
  };
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSubs(true); });
  document.addEventListener('click', function (e) { if (!e.target.closest('.nav-item')) closeSubs(false); });

  /* ── Current page ──
     Matched on filename so it works identically on the live domain,
     the project-path staging URL, and file:// previews. */
  var here = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a, .mobile-nav a').forEach(function (link) {
    var href = (link.getAttribute('href') || '').split('/').pop();
    if (href && href === here) link.setAttribute('aria-current', 'page');
  });
})();
