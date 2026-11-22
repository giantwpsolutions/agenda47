/* Widget: a47-footer — depends on a47-core.js */
A47.register('a47-footer', function (root) {
  var yr = root.querySelector('.a47-year'); if (yr) yr.textContent = new Date().getFullYear();
  var btn = root.querySelector('.a47-totop'); if (!btn) return;
  function onScroll() { btn.classList.toggle('is-on', window.scrollY > 600); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  btn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
});
