(() => {
  const local = /^(localhost|127\.0\.0\.1|\[?::1\]?)$/.test(window.location.hostname) || window.location.hostname.endsWith('.localhost');
  const path = window.location.pathname.replace(/^\/zh(?=\/|$)/, '') || '/';
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
    else {
      const breadcrumb = link?.closest?.('.breadcrumbs');
      if (!breadcrumb) return;
      try {
        const target = new URL(href, `https://${window.location.hostname}`);
        if (target.hostname !== window.location.hostname) return;
        const safePath = value => /^\/(?:[a-z0-9-]+\/)*$/.test(value) ? value : '';
        const owner = breadcrumb.getAttribute('data-owner-id') || '';
        const position = Number(link.getAttribute('data-breadcrumb-position'));
        if (!safePath(window.location.pathname) || !safePath(target.pathname) || !Number.isInteger(position) || position < 1 || position > 10) return;
        track('breadcrumb_click', {
          source_path: safePath(window.location.pathname), target_path: safePath(target.pathname),
          locale: window.location.pathname.startsWith('/zh/') ? 'zh-Hans' : 'en-AU',
          position, owner_id: /^[a-z-]*$/.test(owner) ? owner : ''
        });
      } catch { /* Navigation remains available when measurement cannot classify a link. */ }
    }
  });
})();
