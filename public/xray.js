// X-ray mode: "See the tricks". Labels every element on the page that
// carries data-xray="..." with what it's doing to the reader. Labels live
// in a fixed overlay positioned from each element's rectangle, so nothing
// in the page itself changes style or layout. Toggle: the footer button, or
// the X key. Remembered for the visit (session), not forever.
(function () {
  'use strict';
  if (window.__xrayWired) return;
  window.__xrayWired = true;

  var html = document.documentElement;
  var layer = null, chip = null, raf = 0;

  function on() { return html.hasAttribute('data-xray-on'); }

  function ensure() {
    if (layer) return;
    layer = document.createElement('div'); layer.className = 'xr-layer'; layer.setAttribute('aria-hidden', 'true');
    chip = document.createElement('div'); chip.className = 'xr-chip'; chip.setAttribute('role', 'status');
    chip.innerHTML = '<span><b>Tricks on</b><span class="xr-chip-more"> &middot; every red label is something working on you</span></span><button type="button">Done</button>';
    chip.querySelector('button').addEventListener('click', function () { set(false); });
    document.body.appendChild(layer); document.body.appendChild(chip);
  }

  function paint() {
    raf = 0;
    if (!on() || !layer) return;
    var els = document.querySelectorAll('[data-xray]');
    var frag = document.createDocumentFragment();
    var vw = window.innerWidth, vh = window.innerHeight;
    for (var i = 0; i < els.length; i++) {
      var el = els[i], r = el.getBoundingClientRect();
      if (!r.width || !r.height || r.bottom < -40 || r.top > vh + 40) continue;
      var box = document.createElement('div'); box.className = 'xr-box';
      box.style.cssText = 'left:' + (r.left - 4) + 'px;top:' + (r.top - 4) + 'px;width:' + (r.width + 8) + 'px;height:' + (r.height + 8) + 'px';
      var tag = document.createElement('div'); tag.className = 'xr-tag'; tag.textContent = el.getAttribute('data-xray');
      var left = Math.min(Math.max(8, r.left - 4), vw - 270);
      tag.style.cssText = 'left:' + left + 'px;top:' + Math.max(12, r.top - 10) + 'px';
      frag.appendChild(box); frag.appendChild(tag);
    }
    layer.replaceChildren(frag);
  }
  function schedule() { if (on() && !raf) raf = requestAnimationFrame(paint); }

  function set(v) {
    ensure();
    if (v) { html.setAttribute('data-xray-on', '1'); paint(); }
    else { html.removeAttribute('data-xray-on'); if (layer) layer.replaceChildren(); }
    try { sessionStorage.setItem('xray', v ? '1' : '0'); } catch (e) { /* private mode */ }
    document.querySelectorAll('.xr-toggle').forEach(function (b) { b.setAttribute('aria-pressed', String(v)); });
    var t = window.track; if (typeof t === 'function') t('xray', { on: String(v) });
  }

  document.addEventListener('click', function (e) {
    var b = e.target && e.target.closest && e.target.closest('.xr-toggle');
    if (b) { e.preventDefault(); set(!on()); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'x' && e.key !== 'X') return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var t = e.target; if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    set(!on());
  });
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });

  function boot() {
    var want = false;
    try { want = sessionStorage.getItem('xray') === '1'; } catch (e) { /* ignore */ }
    if (want) { ensure(); set(true); setTimeout(paint, 400); }
    else document.querySelectorAll('.xr-toggle').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
  }
  document.addEventListener('site:ready', boot);
  document.addEventListener('astro:before-swap', function () { if (layer) layer.replaceChildren(); });
  // Fonts and reveals move things after first paint; re-measure once settled.
  window.addEventListener('load', function () { setTimeout(schedule, 300); });
})();
