/* =========================================================================
   A47 CORE — load once, before any widget script.
   • Every widget root has: class="a47-w a47-<name>" data-a47-widget="a47-<name>"
   • Init is per-instance and idempotent (safe for Elementor editor re-renders)
   • No IDs are used anywhere — multiple instances per page are fine.
   ========================================================================= */
(function (w, d) {
  'use strict';
  var A47 = w.A47 = w.A47 || {};
  A47.widgets = A47.widgets || {};
  A47.isEditor = function () { return d.body && d.body.classList.contains('elementor-editor-active'); };

  /* ---- Count-up numbers: <strong data-a47-count="13" data-a47-suffix="M">13M</strong> ---- */
  A47.countUp = function (el) {
    if (el.__a47Counted) return; el.__a47Counted = true;
    var to = parseFloat(el.getAttribute('data-a47-count')) || 0;
    var suf = el.getAttribute('data-a47-suffix') || '';
    if (A47.isEditor() || !w.requestAnimationFrame) { el.textContent = to + suf; return; }
    var t0 = null, dur = 1800;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))) + suf;
      if (p < 1) w.requestAnimationFrame(step);
    }
    el.textContent = '0' + suf;
    w.requestAnimationFrame(step);
  };

  /* ---- Scroll reveal: any element with data-a47-reveal ---- */
  var io = ('IntersectionObserver' in w) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      if (e.target.hasAttribute('data-a47-count')) A47.countUp(e.target);
      e.target.querySelectorAll('[data-a47-count]').forEach(A47.countUp);
      io.unobserve(e.target);
    });
  }, { threshold: 0.15 }) : null;

  function initInstance(root) {
    if (root.__a47Ready) return;
    root.__a47Ready = true;
    var name = root.getAttribute('data-a47-widget');
    if (!A47.isEditor() && io) {
      root.classList.add('a47-js');
      root.querySelectorAll('[data-a47-reveal]').forEach(function (el) { io.observe(el); });
      // counters that are not inside a reveal element
      root.querySelectorAll('[data-a47-count]').forEach(function (el) {
        if (!el.closest('[data-a47-reveal]')) io.observe(el);
      });
    } else {
      root.querySelectorAll('[data-a47-count]').forEach(A47.countUp);
    }
    if (A47.widgets[name] && !root.__a47Ran) {
      root.__a47Ran = true;
      try { A47.widgets[name](root); } catch (err) { if (w.console) console.error('[A47] ' + name, err); }
    }
  }

  A47.initScope = function (scope) {
    scope = scope || d;
    if (scope.nodeType === 1 && scope.hasAttribute('data-a47-widget')) initInstance(scope);
    (scope.querySelectorAll ? scope.querySelectorAll('[data-a47-widget]') : []).forEach(initInstance);
  };

  /* Widgets register their init function: A47.register('a47-hero', function(root){...}) */
  A47.register = function (name, fn) {
    A47.widgets[name] = fn;
    if (A47._ready) d.querySelectorAll('[data-a47-widget="' + name + '"]').forEach(function (root) {
      if (!root.__a47Ready) initInstance(root);
      else if (!root.__a47Ran) { root.__a47Ran = true; fn(root); }
    });
  };

  function boot() { A47._ready = true; A47.initScope(d); }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', boot); else boot();

  /* Elementor: re-init every time a widget is rendered (frontend + editor live preview) */
  function hookElementor() {
    if (!w.elementorFrontend || !w.elementorFrontend.hooks) return;
    w.elementorFrontend.hooks.addAction('frontend/element_ready/widget', function ($scope) {
      A47.initScope($scope && $scope[0] ? $scope[0] : $scope);
    });
  }
  if (w.jQuery) w.jQuery(w).on('elementor/frontend/init', hookElementor);
  else w.addEventListener('elementor/frontend/init', hookElementor);
})(window, document);
