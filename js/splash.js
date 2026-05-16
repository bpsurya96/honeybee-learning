(function () {
  const splash = document.getElementById('welcomeSplash');
  if (!splash) return;

  // Only show once per browser session
  if (sessionStorage.getItem('hbl_welcomed')) {
    splash.classList.add('gone');
    return;
  }

  // Lock scroll while splash is shown
  document.body.classList.add('splash-open');

  function dismissSplash() {
    splash.classList.add('hiding');
    document.body.classList.remove('splash-open');
    sessionStorage.setItem('hbl_welcomed', '1');
    setTimeout(() => splash.classList.add('gone'), 580); // after CSS fade-out
  }

  // Auto-dismiss after 2.8s (matches the progress bar)
  const timer = setTimeout(dismissSplash, 2800);

  // Tap / click to skip early
  splash.addEventListener('click', function () {
    clearTimeout(timer);
    dismissSplash();
  });
})();
