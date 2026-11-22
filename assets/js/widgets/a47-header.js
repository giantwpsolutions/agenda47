/* Widget: a47-header — depends on a47-core.js */
A47.register('a47-header', function (root) {
  var menu = root.querySelector('.a47-menu');
  var burger = root.querySelector('.a47-burger');
  var backdrop = root.querySelector('.a47-backdrop');
  var drops = root.querySelectorAll('.a47-has-drop');

  function setOpen(open) {
    if (!menu || !burger) return;
    menu.classList.toggle('is-open', open);
    burger.classList.toggle('is-open', open);
    if (backdrop) backdrop.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  if (burger) burger.addEventListener('click', function () { setOpen(!menu.classList.contains('is-open')); });
  if (backdrop) backdrop.addEventListener('click', function () { setOpen(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });

  // Dropdown: tap-to-open on touch / mobile drawer
  drops.forEach(function (li) {
    var toggle = li.querySelector('.a47-menu__link');
    toggle.addEventListener('click', function (e) {
      if (window.matchMedia('(max-width:1100px)').matches || !li.classList.contains('is-open') && 'ontouchstart' in window) {
        e.preventDefault();
        li.classList.toggle('is-open');
      }
    });
  });

  // Active link — matches current URL (works with WP permalinks and .html files)
  function norm(p) { return (p || '/').replace(/index\.html$/, '').replace(/\.html$/, '').replace(/\/+$/, '') || '/'; }
  var here = norm(location.pathname);
  root.querySelectorAll('.a47-menu a[href]').forEach(function (a) {
    var href = a.getAttribute('href');
    if (!href || href.charAt(0) === '#') return;
    if (norm(a.pathname) === here) {
      a.classList.add('is-active');
      var parent = a.closest('.a47-has-drop');
      if (parent) parent.querySelector('.a47-menu__link').classList.add('is-active');
    }
  });

  // Shadow on scroll
  function onScroll() { root.classList.toggle('is-scrolled', window.scrollY > 20); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
});
