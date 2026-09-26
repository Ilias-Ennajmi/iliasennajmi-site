// Starts the shared effects layer (site-fx.js) for pages that opt in via
// BaseLayout's `siteFx` prop, which renders <body data-fx="page|article"
// data-fx-strand="...">. Driven by the page's own markup rather than a call
// from each page, so a page can never boot the effects with another page's
// settings, and the effects are torn down whenever a page is swapped out.
(function () {
  'use strict';
  if (window.__pageBootWired) return;
  window.__pageBootWired = true;

  function motionOK() {
    try { return !window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
    catch (e) { return true; }
  }

  document.addEventListener('site:ready', function () {
    var mode = document.body.getAttribute('data-fx');
    if (!mode || !window.SiteFX) return;
    window.SiteFX.init({
      strand: document.body.getAttribute('data-fx-strand') || null,
      progress: mode,
      motion: motionOK(),
    });
  });

  document.addEventListener('astro:before-swap', function () {
    if (window.SiteFX) window.SiteFX.destroy();
  });
})();
