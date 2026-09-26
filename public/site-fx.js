// Shared behavior layer for the subpages (ulysses / ilias / essay / about / shelf ...).
// Owns: scroll-reveal, scroll-progress rail, parallax, divider/numeral/underline
// draw, cursor header light, and the essay reading meter. Started and torn down
// by page-boot.js; the homepage keeps its own bespoke logic.
//
// Scroll performance rules this file follows (each one fixed a measured
// per-frame cost):
// - one passive scroll listener, one requestAnimationFrame per frame;
// - within a frame, every layout read happens before any style write;
// - geometry (article box, page height) is cached and refreshed by a
//   ResizeObserver instead of being re-read on every frame;
// - the progress rail moves with transform: scaleY, never height;
// - the reading meter writes to the DOM only when its value changes.
(function () {
  'use strict';

  function RM() {
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
    catch (e) { return false; }
  }
  function pad2(v) { v = String(v); return v.length < 2 ? '0' + v : v; }

  var SiteFX = {
    // opts: { strand, motion, progress: 'page'|'article'|false }
    init: function (opts) {
      this.destroy();
      opts = opts || {};
      this.strand = opts.strand || null;
      this.accent = this.strand === 'ulysses' ? 'var(--tide)' : 'var(--ember)';
      this.rgb    = this.strand === 'ulysses' ? '117,89,56' : '165,39,22';
      this.motion = (opts.motion !== undefined ? opts.motion : !RM());
      this.progressMode = (opts.progress === undefined) ? 'page' : opts.progress;
      this._cleanups = [];
      this._geom = false;

      this._observeGeometry();
      this._tintRail();
      this._activate();
      this._cursorLight();
      this._readingMeter();
      this._reveals();
      this._scroll();
    },

    destroy: function () {
      (this._cleanups || []).forEach(function (fn) { try { fn(); } catch (e) {} });
      this._cleanups = [];
      if (this._actIO) { this._actIO.disconnect(); this._actIO = null; }
      if (this._revIO) { this._revIO.disconnect(); this._revIO = null; }
      if (this._ro) this._ro.disconnect();
      this._meter = null;
      this._frame = null;
    },

    // re-run after a component re-render (e.g. filtered list) so new nodes animate in
    refresh: function () {
      this._reveals();
      this._activate();
      this._schedule();
    },

    _on: function (target, type, fn, opts) {
      target.addEventListener(type, fn, opts);
      this._cleanups.push(function () { target.removeEventListener(type, fn, opts); });
    },

    // ---- cached geometry ----
    // Read inside ResizeObserver callbacks, which run right after the
    // browser's own layout, so reading geometry there is free. Reading it
    // during start-up instead forced an extra full layout while web fonts
    // were still loading, then another once they arrived.
    _observeGeometry: function () {
      var self = this;
      this._art = document.querySelector('article');
      if (!('ResizeObserver' in window)) { this._readGeometry(); return; }
      if (!this._ro) this._ro = new ResizeObserver(function () { self._readGeometry(); self._schedule(); });
      this._ro.disconnect();
      this._ro.observe(document.body);
      if (this._art) this._ro.observe(this._art);
    },

    _readGeometry: function () {
      var art = this._art;
      this._artTop = art ? art.getBoundingClientRect().top + (window.scrollY || 0) : 0;
      this._artHeight = art ? art.offsetHeight : 0;
      this._maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      this._vh = window.innerHeight || 800;
      this._geom = true;
    },

    _tintRail: function () {
      var prog = document.getElementById('cc-prog');
      if (prog && this.strand) prog.style.background = this.accent;
    },

    // ---- divider / numeral / underline draw ----
    _activate: function () {
      var targets = document.querySelectorAll('.cc-rule,.cc-num,.cc-uline');
      if (!targets.length) return;
      var draw = function (el) {
        if (el.dataset.fx) return; el.dataset.fx = '1';
        if (el.classList.contains('cc-num')) {
          var to = parseInt(el.getAttribute('data-to'), 10) || 0;
          if (RM()) { el.textContent = pad2(to); return; }
          var dur = 720, start = performance.now();
          var step = function (now) {
            var t = Math.min(1, (now - start) / dur);
            el.textContent = pad2(Math.round((1 - Math.pow(1 - t, 3)) * to));
            if (t < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        } else {
          el.style.transform = 'scaleX(1)';
        }
      };
      this._draw = draw;
      if (RM() || !('IntersectionObserver' in window)) { [].forEach.call(targets, draw); return; }
      if (!this._actIO) {
        this._actIO = new IntersectionObserver(function (ents, io) {
          ents.forEach(function (e) { if (e.isIntersecting) { draw(e.target); io.unobserve(e.target); } });
        }, { rootMargin: '0px 0px -6% 0px' });
      }
      var io = this._actIO;
      [].forEach.call(targets, function (t) { if (!t.dataset.fx) io.observe(t); });
    },

    // ---- cursor-following warm light on big headers (mouse only) ----
    _cursorLight: function () {
      if (!this.motion) return;
      if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
      var self = this;
      [].forEach.call(document.querySelectorAll('[data-cursor-light]'), function (h) {
        if (getComputedStyle(h).position === 'static') h.style.position = 'relative';
        var glow = h.querySelector(':scope > .fx-glow');
        if (!glow) {
          glow = document.createElement('div');
          glow.className = 'fx-glow';
          glow.style.cssText = 'position:absolute;inset:0;z-index:0;pointer-events:none;opacity:0;transition:opacity .6s ease;mix-blend-mode:multiply;';
          h.insertBefore(glow, h.firstChild);
        }
        var wm = h.querySelector('[data-watermark]');
        var x = 0, y = 0, queued = false;
        var paint = function () {
          queued = false;
          glow.style.background = 'radial-gradient(320px 320px at ' + x + 'px ' + y + 'px, rgba(' + self.rgb + ',0.16), transparent 70%)';
        };
        self._on(h, 'pointermove', function (e) {
          if (e.pointerType === 'touch') return;
          var r = h.getBoundingClientRect();
          x = e.clientX - r.left; y = e.clientY - r.top;
          if (!queued) { queued = true; requestAnimationFrame(paint); }
          glow.style.opacity = '1';
          if (wm) { wm.style.transition = 'color .6s ease'; wm.style.color = 'rgba(' + self.rgb + ',0.12)'; }
        });
        self._on(h, 'pointerleave', function () {
          glow.style.opacity = '0';
          if (wm) wm.style.color = '';
        });
      });
    },

    // ---- essay "X min left" chip ----
    _readingMeter: function () {
      var meter = document.querySelector('[data-reading-meter]');
      if (!meter) return;
      var essay = (location.pathname.match(/\/essays\/([^/]+)/) || [])[1] || location.pathname;
      this._meter = {
        el: meter,
        total: parseFloat(meter.getAttribute('data-minutes')) || 0,
        label: meter.querySelector('[data-meter-label]'),
        diamond: meter.querySelector('span'),
        essay: essay,
        // Read-depth analytics ride on the meter's progress figure instead of
        // a second scroll listener; reset per essay since init runs per page.
        marks: [[0.25, 'read-25'], [0.5, 'read-50'], [0.75, 'read-75'], [0.98, 'read-complete']],
        fired: {},
        lastLabel: null,
        lastOpacity: null,
      };
    },

    _meterFrame: function (y) {
      var m = this._meter;
      if (!m || !this._art) return;
      var vh = this._vh;
      var startY = this._artTop - vh * 0.5;
      var endY = this._artTop + this._artHeight - vh * 0.6;
      var p = (endY > startY) ? (y - startY) / (endY - startY) : 0;
      p = Math.min(1, Math.max(0, p));
      if (m.label) {
        var left = Math.max(0, Math.round(m.total * (1 - p)));
        var text = p >= 0.992 ? 'Finished' : (left <= 0 ? '‹ 1 min left' : left + ' min left');
        if (text !== m.lastLabel) { m.label.textContent = text; m.lastLabel = text; }
      }
      var op = (p > 0.015 && p < 0.999) ? '1' : (p >= 0.999 ? '0.55' : '0');
      if (op !== m.lastOpacity) { m.el.style.opacity = op; m.lastOpacity = op; }

      for (var i = 0; i < m.marks.length; i++) {
        var id = m.marks[i][1];
        if (p >= m.marks[i][0] && !m.fired[id]) {
          m.fired[id] = 1;
          if (typeof window.track === 'function') window.track(id, { essay: m.essay });
          // One quiet flash on the meter's own diamond when an essay is
          // actually finished, and a generic event the essay page listens
          // for to update the local reading log.
          if (id === 'read-complete') {
            if (m.diamond) {
              m.diamond.classList.remove('meter-flash');
              void m.diamond.offsetWidth;
              m.diamond.classList.add('meter-flash');
            }
            window.dispatchEvent(new CustomEvent('cc:essay-complete', { detail: { essay: m.essay } }));
          }
        }
      }
    },

    // ---- scroll-reveal ----
    // Anything already on screen (or above it) when the page starts stays
    // exactly as painted: hiding it only to fade it back in made the first
    // screen flash, and delayed Largest Contentful Paint by ~1.2s.
    _reveals: function () {
      var els = document.querySelectorAll('[data-reveal]');
      if (!els.length) return;
      var show = function (el) { el.style.opacity = '1'; el.style.transform = 'none'; el.dataset.shown = '1'; };
      var hide = function (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(' + (el.hasAttribute('data-bigrise') ? '64px' : '24px') + ')';
        el.style.transition = 'transform .8s cubic-bezier(.2,.7,.2,1), opacity .8s ease';
      };
      if (!this.motion || !('IntersectionObserver' in window)) { [].forEach.call(els, show); return; }
      if (!this._revIO) {
        // The observer's first report for each element says where it is,
        // computed during the browser's own rendering step (no forced
        // layout): anything below the viewport is hidden to animate in
        // later; anything on screen or above it stays exactly as painted.
        this._revIO = new IntersectionObserver(function (ents, io) {
          // read once: innerHeight after a style write forces a layout
          var vh = window.innerHeight;
          ents.forEach(function (e) {
            var el = e.target;
            if (!el.dataset.rev) {
              el.dataset.rev = '1';
              if (e.boundingClientRect.top >= vh) { hide(el); return; }
              el.dataset.shown = '1'; io.unobserve(el); return;
            }
            if (e.isIntersecting) { show(el); io.unobserve(el); }
          });
        }, { rootMargin: '0px 0px -8% 0px' });
      }
      var io = this._revIO;
      [].forEach.call(els, function (el) { if (!el.dataset.shown) io.observe(el); });
    },

    // ---- the one scroll handler: parallax + progress rail + reading meter ----
    _scroll: function () {
      var self = this;
      this._prog = this.progressMode ? document.getElementById('cc-prog') : null;
      this._layers = this.motion ? [].slice.call(document.querySelectorAll('[data-pll]')) : [];
      this._lastProg = -1;
      this._ticking = false;
      this._frame = function () {
        self._ticking = false;
        var y = window.scrollY || 0;
        for (var i = 0; i < self._layers.length; i++) {
          var s = parseFloat(self._layers[i].getAttribute('data-pll')) || 0;
          self._layers[i].style.transform = 'translate3d(0,' + (y * s).toFixed(1) + 'px,0)';
        }
        if (!self._geom) return;
        if (self._prog) {
          var p;
          if (self.progressMode === 'article' && self._art) {
            var total = self._artHeight - self._vh * 0.6;
            p = total > 0 ? (y - self._artTop + self._vh * 0.6) / total : (y > self._artTop ? 1 : 0);
          } else {
            p = self._maxScroll > 0 ? y / self._maxScroll : 0;
          }
          p = Math.round(Math.min(1, Math.max(0, p)) * 1000) / 1000;
          if (p !== self._lastProg) { self._prog.style.transform = 'scaleY(' + p + ')'; self._lastProg = p; }
        }
        self._meterFrame(y);
      };
      this._on(window, 'scroll', function () { self._schedule(); }, { passive: true });
      this._on(window, 'resize', function () { self._geom && self._readGeometry(); self._schedule(); }, { passive: true });
      this._schedule();
    },

    _schedule: function () {
      if (this._ticking || !this._frame) return;
      this._ticking = true;
      requestAnimationFrame(this._frame);
    }
  };

  window.SiteFX = SiteFX;
})();
