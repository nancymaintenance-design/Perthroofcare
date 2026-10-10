(() => {
  const local = /^(localhost|127\.0\.0\.1|\[?::1\]?)$/.test(window.location.hostname) || window.location.hostname.endsWith('.localhost');
  const path = window.location.pathname;
  const pageType = path === '/' ? 'home' : path.startsWith('/areas/') ? 'area' : path.startsWith('/news/') ? 'guide' : path.startsWith('/projects/') ? 'project' : path === '/contact/' ? 'contact' : 'service';
  const track = (name, fields = {}) => {
    if (local || typeof window.gtag !== 'function') return;
    try { window.gtag('event', name, { page_type: pageType, ...fields }); } catch { /* Measurement must never block an enquiry. */ }
  };
  window.ellisAnalytics = {
    leadConfirmed(response, result) {
      if (response?.ok === true && result?.ok === true) track('generate_lead', { method: 'website_form' });
    }
  };
  document.addEventListener('click', event => {
    const link = event.target.closest?.('a[href]');
    const href = link?.getAttribute('href') || '';
    if (href.startsWith('tel:')) track('click_to_call');
    else if (href.startsWith('mailto:')) track('email_click');
  });
})();
