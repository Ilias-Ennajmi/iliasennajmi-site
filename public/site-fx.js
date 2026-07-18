// Shared behavior layer for the subpages (ulysses / ilias / essay / about / shelf).
// Owns: scroll-reveal, scroll-progress rail, parallax, divider/numeral/underline draw,
// cursor header light, and the essay reading meter. The Homepage keeps its own bespoke
// logic (marquee-velocity coupling, hero seam, card ripple) and does not load this file.
// Honors prefers-reduced-motion and a page-supplied `motion` flag. All effects idempotent.
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
      opts = opts || {};
      this.strand = opts.strand || null;                       // 'ulysses' | 'ilias' | null
      this.accent = this.strand === 'ulysses' ? 'var(--tide)' : 'var(--ember)';
      this.rgb    = this.strand === 'ulysses' ? '123,110,84' : '156,47,36';
      this.motion = (opts.motion !== undefined ? opts.motion : !RM());
      this.progressMode = (opts.progress === undefined) ? 'page' : opts.progress;

      this._tintRail();
      this._activate();
      this._cursorLight();
      this._readingMeter();
      this._reveals();
      this._scroll();
    },

    // re-run after a component re-render (e.g. filtered list) so new nodes animate in
    refresh: function () {
      this._reveals();
      this._activate();
      this._revealCheck();
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
      if (RM() || !('IntersectionObserver' in window)) { [].forEach.call(targets, draw); return; }
      if (!this._actIO) {
        var io = new IntersectionObserver(function (ents) {
          ents.forEach(function (e) { if (e.isIntersecting) { draw(e.target); io.unobserve(e.target); } });
        }, { rootMargin: '0px 0px -6% 0px' });
        this._actIO = io;
      }
      var self = this;
      [].forEach.call(targets, function (t) { if (!t.dataset.fxObs) { t.dataset.fxObs = '1'; self._actIO.observe(t); } });
      // scroll/raf fallback — IntersectionObserver can be unreliable in some embeds.
      // Self-cleans once every target has been drawn.
      if (!this._actCheck) {
        var check = function () {
          var vh = window.innerHeight || 800, pending = 0;
          [].forEach.call(document.querySelectorAll('.cc-rule,.cc-num,.cc-uline'), function (t) {
            if (t.dataset.fx) return;
            if (t.getBoundingClientRect().top < vh * 0.96) draw(t);
            else pending++;
          });
          if (!pending) { window.removeEventListener('scroll', check); self._actCheck = null; }
        };
        this._actCheck = check;
        window.addEventListener('scroll', check, { passive: true });
        requestAnimationFrame(check);
        setTimeout(check, 300);
      }
    },

    // ---- cursor-following warm light on big headers ----
    _cursorLight: function () {
      if (!this.motion) return;
      var self = this;
      [].forEach.call(document.querySelectorAll('[data-cursor-light]'), function (h) {
        if (h.dataset.fxLight) return; h.dataset.fxLight = '1';
        if (getComputedStyle(h).position === 'static') h.style.position = 'relative';
        var glow = document.createElement('div');
        glow.style.cssText = 'position:absolute;inset:0;z-index:0;pointer-events:none;opacity:0;transition:opacity .6s ease;mix-blend-mode:multiply;';
        h.insertBefore(glow, h.firstChild);
        var wm = h.querySelector('[data-watermark]');
        h.addEventListener('pointermove', function (e) {
          if (e.pointerType === 'touch') return;
          var r = h.getBoundingClientRect();
          glow.style.background = 'radial-gradient(320px 320px at ' + (e.clientX - r.left) + 'px ' + (e.clientY - r.top) + 'px, rgba(' + self.rgb + ',0.16), transparent 70%)';
          glow.style.opacity = '1';
          if (wm) { wm.style.transition = 'color .6s ease'; wm.style.color = 'rgba(' + self.rgb + ',0.2)'; }
        });
        h.addEventListener('pointerleave', function () {
          glow.style.opacity = '0';
          if (wm) wm.style.color = '';
        });
      });
    },

    // ---- essay "X min left" chip ----
    // Re-bound on every init() (each page navigation), so the previous
    // page's listener (closed over its own meter/article nodes) is torn
    // down first \u2014 otherwise soft navigation (view transitions) would
    // stack up one stale scroll/resize listener per essay visited.
    _readingMeter: function () {
      if (this._meterUpd) {
        window.removeEventListener('scroll', this._meterUpd);
        window.removeEventListener('resize', this._meterUpd);
        this._meterUpd = null;
      }
      var meter = document.querySelector('[data-reading-meter]');
      if (!meter) return;
      var total = parseFloat(meter.getAttribute('data-minutes')) || 0;
      var label = meter.querySelector('[data-meter-label]');
      var fill = meter.querySelector('[data-meter-fill]');
      var art = document.querySelector('article');
      var upd = function () {
        if (!art) return;
        var y = window.scrollY || 0;
        var startY = art.offsetTop - window.innerHeight * 0.5;
        var endY = art.offsetTop + art.offsetHeight - window.innerHeight * 0.6;
        var p = (endY > startY) ? (y - startY) / (endY - startY) : 0;
        p = Math.min(1, Math.max(0, p));
        if (fill) fill.style.width = (p * 100).toFixed(1) + '%';
        if (label) {
          var left = Math.max(0, Math.round(total * (1 - p)));
          label.textContent = p >= 0.992 ? 'Finished' : (left <= 0 ? '\u2039 1 min left' : left + ' min left');
        }
        meter.style.opacity = (p > 0.015 && p < 0.999) ? '1' : (p >= 0.999 ? '0.55' : '0');
      };
      this._meterUpd = upd;
      window.addEventListener('scroll', upd, { passive: true });
      window.addEventListener('resize', upd, { passive: true });
      upd();
    },

    // ---- scroll-reveal ----
    _reveals: function () {
      var els = document.querySelectorAll('[data-reveal]');
      if (!els.length) return;
      var self = this;
      if (!this.motion) {
        [].forEach.call(els, function (el) { el.style.opacity = ''; el.style.transform = ''; el.dataset.shown = '1'; });
        return;
      }
      if (!this._revIO && 'IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (ents) {
          ents.forEach(function (e) { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'none'; e.target.dataset.shown = '1'; io.unobserve(e.target); } });
        }, { rootMargin: '0px 0px -8% 0px' });
        this._revIO = io;
      }
      [].forEach.call(els, function (el) {
        if (el.dataset.shown) { el.style.opacity = '1'; el.style.transform = 'none'; return; }
        if (el.dataset.rev) return; el.dataset.rev = '1';
        el.style.opacity = '0';
        el.style.transform = 'translateY(' + (el.hasAttribute('data-bigrise') ? '64px' : '24px') + ')';
        el.style.transition = 'transform .8s cubic-bezier(.2,.7,.2,1), opacity .8s ease';
        if (self._revIO) self._revIO.observe(el); else { el.style.opacity = '1'; el.style.transform = 'none'; el.dataset.shown = '1'; }
      });
      this._revealCheck();
    },

    _revealCheck: function () {
      var vh = window.innerHeight || 800;
      [].forEach.call(document.querySelectorAll('[data-reveal]'), function (el) {
        if (el.dataset.shown) return;
        if (el.getBoundingClientRect().top < vh * 0.95) { el.dataset.shown = '1'; el.style.opacity = '1'; el.style.transform = 'none'; }
      });
    },

    // ---- unified scroll handler: reveal-check + parallax + progress rail ----
    // Rebuilt on every init() — each page navigation has its own progress
    // rail/parallax layers/progressMode, so the previous page's handler
    // (and its captured references) must be torn down first.
    _scroll: function () {
      if (this._onScroll) window.removeEventListener('scroll', this._onScroll);
      var self = this;
      var prog = this.progressMode ? document.getElementById('cc-prog') : null;
      var layers = this.motion ? [].slice.call(document.querySelectorAll('[data-pll]')) : [];
      var ticking = false;
      this._onScroll = function () {
        self._revealCheck();
        if (ticking) return; ticking = true;
        requestAnimationFrame(function () {
          var y = window.scrollY || window.pageYOffset || 0;
          if (layers.length) layers.forEach(function (el) {
            var s = parseFloat(el.getAttribute('data-pll')) || 0;
            el.style.transform = 'translate3d(0,' + (y * s).toFixed(1) + 'px,0)';
          });
          if (prog) {
            if (self.progressMode === 'article') {
              var art = document.querySelector('article');
              if (art) {
                var total = art.offsetHeight - window.innerHeight * 0.6;
                var p = total > 0 ? (y - art.offsetTop + window.innerHeight * 0.6) / total : (y > art.offsetTop ? 1 : 0);
                prog.style.height = (Math.min(1, Math.max(0, p)) * 100).toFixed(2) + '%';
              }
            } else {
              var max = document.documentElement.scrollHeight - window.innerHeight;
              prog.style.height = (max > 0 ? (y / max) * 100 : 0).toFixed(2) + '%';
            }
          }
          ticking = false;
        });
      };
      window.addEventListener('scroll', this._onScroll, { passive: true });
      this._onScroll();
    }
  };

  window.SiteFX = SiteFX;
})();
