/* Widget: a47-contact — depends on a47-core.js */
A47.register('a47-contact', function (root) {
  root.querySelectorAll('form.a47-cform').forEach(function (form) {
    // If your WP form plugin handles submit, remove data-a47-preview and this does nothing.
    if (!form.hasAttribute('data-a47-preview') && !form.hasAttribute('data-a47-mailto')) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = form.querySelector('.a47-cform__msg');
      var to = form.getAttribute('data-a47-mailto');
      if (to) {
        var v = function (n) { var f = form.querySelector('[name="' + n + '"]'); return f ? f.value : ''; };
        var services = [].map.call(form.querySelectorAll('[name="services"]:checked'), function (c) { return c.value; }).join(', ');
        var body = 'Name: ' + v('name') + '\nOrganization: ' + v('organization') + '\nEmail: ' + v('email') + '\nServices: ' + services + '\n\n' + v('message');
        window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent('Enquiry from ' + v('name')) + '&body=' + encodeURIComponent(body);
      }
      if (msg) msg.classList.add('is-on');
    });
  });
});
