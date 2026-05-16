document.addEventListener('DOMContentLoaded', function () {
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');
  var overlay = document.getElementById('navOverlay');

  // Unified close function
  function closeMenu() {
    if (navLinks) navLinks.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    if (hamburger) {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
    // Reset scrolling consistently 
    document.body.classList.remove('no-scroll');
    document.body.style.overflow = '';
  }

  // Hamburger toggle logic
  if (hamburger) {
    hamburger.addEventListener('click', function (e) {
      e.stopPropagation(); // Prevents click from bubbling to body
      var isOpen = navLinks.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        navLinks.classList.add('open');
        if (overlay) overlay.classList.add('open');
        hamburger.classList.add('open');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.classList.add('no-scroll');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  // Close on overlay click
  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  // Close menu if clicking outside of it
  document.body.addEventListener('click', function (e) {
    if (navLinks && navLinks.classList.contains('open') && !navLinks.contains(e.target) && e.target !== hamburger) {
      closeMenu();
    }
  });

  // Handle link clicks with a slight delay so redirection doesn't fail
  if (navLinks) {
    var links = navLinks.querySelectorAll('a');
    links.forEach(function (link) {
      link.addEventListener('click', function () {
        setTimeout(closeMenu, 150);
      });
    });
  }
});
