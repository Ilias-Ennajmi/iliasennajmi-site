// Shared bootstrap for pages that use SiteFX (site-fx.js). Waits for SiteFX
// to be available (defensive against future async/defer loading) and honors
// prefers-reduced-motion, so every page doesn't have to repeat this itself.
(function () {
  'use strict';
  function motionOK() {
    try { return !window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
    catch (e) { return true; }
  }
  window.pageBoot = function (opts) {
    var go = function () {
      if (window.SiteFX) window.SiteFX.init(Object.assign({ motion: motionOK() }, opts));
      else setTimeout(go, 60);
    };
    go();
  };
})();
