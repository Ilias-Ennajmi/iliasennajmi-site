// The portrait's behavior (see Face.astro for the markup it drives).
// One pointer listener for every face on the page. Each instance gets
// --ex/--ey (pupil offset) and --tilt; the hero's name gets --hw (its
// weight axis). Everything written is transform- or font-variation-only,
// and nothing here reads layout on its own schedule: positions come from a
// ResizeObserver and from scroll/resize events, never from inside the
// animation loop (a per-frame getBoundingClientRect forced a full layout
// every time something else had dirtied the page, which during load was
// constantly).
(function () {
  'use strict';
  if (window.__faceWired) return;
  window.__faceWired = true;

  var RM = function () { try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } };
  var FINE = function () { try { return window.matchMedia('(hover: hover) and (pointer: fine)').matches; } catch (e) { return false; } };

  var faces = [], heroName = null, ro = null;
  var ptr = { x: 0, y: 0, live: false };
  var cur = { x: 0, y: 0 };
  var raf = 0, idleTimer = 0, glance = null, lastHw = 0;

  function collect() {
    faces = [];
    var els = document.querySelectorAll('.face[data-face]:not([data-face="static"]):not(img)');
    for (var i = 0; i < els.length; i++) faces.push({ el: els[i], mode: els[i].getAttribute('data-face'), rect: null });
    heroName = document.querySelector('.hero-name');
    if (ro) ro.disconnect();
    if ('ResizeObserver' in window && faces.length) {
      // Fires inside the browser's own layout step, so reading rects here
      // is free. Observing <body> catches reflows from fonts and images.
      ro = new ResizeObserver(function () { measure(); schedule(); });
      faces.forEach(function (f) { ro.observe(f.el); });
      ro.observe(document.body);
    }
  }
  function measure() {
    for (var i = 0; i < faces.length; i++) faces[i].rect = faces[i].el.getBoundingClientRect();
  }
  function onScreen(f) { var r = f.rect; return r && r.bottom > -80 && r.top < window.innerHeight + 80; }

  // Where the eyes want to look, in [-1, 1] on both axes.
  function target(f) {
    if (glance) return glance;
    var r = f.rect; if (!r) return { x: 0, y: 0 };
    if (ptr.live && FINE()) {
      var cx = r.left + r.width / 2, cy = r.top + r.height * 0.46;
      var dx = (ptr.x - cx) / Math.max(240, window.innerWidth / 2);
      var dy = (ptr.y - cy) / Math.max(200, window.innerHeight / 2);
      return { x: Math.max(-1, Math.min(1, dx)), y: Math.max(-1, Math.min(1, dy)) };
    }
    // No pointer (phones): follow the page. A face that has scrolled up
    // looks down at the text it left behind.
    var off = (window.innerHeight * 0.4 - (r.top + r.height / 2)) / (window.innerHeight * 0.6);
    return { x: 0, y: Math.max(-0.6, Math.min(1, off)) };
  }

  function frame() {
    raf = 0;
    if (!faces.length) return;
    // Bearings come from the biggest face on screen (hero or observer).
    var ref = null;
    for (var k = 0; k < faces.length; k++) { var f0 = faces[k]; if (onScreen(f0) && (!ref || f0.rect.width > ref.rect.width)) ref = f0; }
    if (!ref) return;
    var t = target(ref);
    cur.x += (t.x - cur.x) * 0.14;
    cur.y += (t.y - cur.y) * 0.14;
    var settled = Math.abs(t.x - cur.x) < 0.003 && Math.abs(t.y - cur.y) < 0.003;
    var ex = (cur.x * 14).toFixed(2) + 'px', ey = (cur.y * 10).toFixed(2) + 'px';
    for (var i = 0; i < faces.length; i++) {
      var f = faces[i]; if (!onScreen(f)) continue;
      var s = f.el.style;
      s.setProperty('--ex', ex); s.setProperty('--ey', ey);
      if (!RM() && (f.mode === 'hero' || f.mode === 'observer')) s.setProperty('--tilt', (cur.x * (f.mode === 'hero' ? 3 : 2)).toFixed(2) + 'deg');
    }
    // The name's weight follows the pointer, in steps: every change re-shapes
    // the title, so it moves in a few deliberate increments, not per frame.
    if (heroName && !RM() && ptr.live) {
      var hw = 480 + Math.round((cur.x + 1) * 3.5) * 20; // 480..620 in steps of 20
      if (hw !== lastHw) { lastHw = hw; heroName.style.setProperty('--hw', hw); }
    }
    if (!settled) raf = requestAnimationFrame(frame);
  }
  function schedule() { if (!raf) raf = requestAnimationFrame(frame); }

  // Left alone, he gets bored: a glance somewhere every few seconds, then
  // back to whatever he was looking at.
  function armIdle() {
    clearTimeout(idleTimer);
    if (RM() || document.hidden) return;
    idleTimer = setTimeout(function () {
      glance = { x: (Math.random() * 2 - 1) * 0.9, y: (Math.random() * 2 - 1) * 0.5 };
      schedule();
      setTimeout(function () { glance = null; schedule(); armIdle(); }, 700 + Math.random() * 500);
    }, 3500 + Math.random() * 4000);
  }

  document.addEventListener('pointermove', function (e) {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    ptr.x = e.clientX; ptr.y = e.clientY; ptr.live = true;
    glance = null; schedule(); armIdle();
  }, { passive: true });
  document.addEventListener('pointerleave', function () { ptr.live = false; schedule(); });
  window.addEventListener('scroll', function () { measure(); schedule(); }, { passive: true });
  window.addEventListener('resize', function () { measure(); schedule(); }, { passive: true });
  document.addEventListener('visibilitychange', function () { if (document.hidden) clearTimeout(idleTimer); else armIdle(); });

  // Hover and click on the drawing itself.
  document.addEventListener('pointerover', function (e) {
    var f = e.target && e.target.closest && e.target.closest('.face[data-face="hero"],.face[data-face="observer"]');
    if (f) f.classList.add('is-hover');
  });
  document.addEventListener('pointerout', function (e) {
    var f = e.target && e.target.closest && e.target.closest('.face.is-hover');
    if (f && !(e.relatedTarget && f.contains(e.relatedTarget))) f.classList.remove('is-hover');
  });
  document.addEventListener('click', function (e) {
    var f = e.target && e.target.closest && e.target.closest('.face[data-face="hero"]');
    if (!f || RM()) return;
    f.classList.remove('is-drip'); void f.offsetWidth; f.classList.add('is-drip');
    setTimeout(function () { f.classList.remove('is-drip'); }, 1400);
    var cue = document.getElementById('cc-cue');
    if (cue) { cue.classList.remove('cue-pulse'); void cue.offsetWidth; cue.classList.add('cue-pulse'); }
  });

  // The hero face hands over to the nav stamp once it has scrolled away.
  var heroIO = null;
  function watchHero() {
    if (heroIO) { heroIO.disconnect(); heroIO = null; }
    var hero = document.querySelector('.face[data-face="hero"]');
    var html = document.documentElement;
    if (!hero) { html.setAttribute('data-stamp', '1'); return; }
    html.removeAttribute('data-stamp');
    heroIO = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting) html.removeAttribute('data-stamp'); else html.setAttribute('data-stamp', '1'); });
    }, { threshold: 0.05 });
    heroIO.observe(hero);
  }

  function boot() { lastHw = 0; collect(); watchHero(); armIdle(); }
  document.addEventListener('site:ready', boot);
  document.addEventListener('astro:before-swap', function () { if (raf) cancelAnimationFrame(raf); raf = 0; clearTimeout(idleTimer); glance = null; if (ro) ro.disconnect(); });
  if (document.readyState !== 'loading' && document.querySelector('.face')) boot();
})();
