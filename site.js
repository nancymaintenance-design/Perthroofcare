const toggle = document.querySelector('.menu');
const nav = document.querySelector('header nav');
const servicesToggle = document.querySelector('.services-toggle');
const servicesSubmenu = document.querySelector('#services-submenu');
const closeServices = ({ returnFocus = false } = {}) => { if (!servicesToggle || !servicesSubmenu) return; servicesSubmenu.hidden = true; servicesToggle.setAttribute('aria-expanded', 'false'); if (returnFocus) servicesToggle.focus(); };
const positionServicesMenu = () => { if (!servicesToggle || !servicesSubmenu) return; const bounds = servicesToggle.getBoundingClientRect(); servicesSubmenu.style.left = `${Math.max(16, bounds.left)}px`; servicesSubmenu.style.top = `${bounds.bottom + 8}px`; };
const openServices = () => { if (!servicesToggle || !servicesSubmenu) return; positionServicesMenu(); servicesSubmenu.hidden = false; servicesToggle.setAttribute('aria-expanded', 'true'); };
servicesToggle?.addEventListener('click', () => { if (servicesSubmenu.hidden) openServices(); else closeServices(); });
servicesToggle?.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); if (servicesSubmenu.hidden) openServices(); else closeServices(); } });
toggle?.addEventListener('click', () => { const isOpen = nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', String(isOpen)); if (!isOpen) closeServices(); });
document.addEventListener('click', (event) => { if (servicesSubmenu && !servicesSubmenu.hidden && !event.target.closest('.services-menu')) closeServices(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') { if (servicesSubmenu && !servicesSubmenu.hidden) closeServices({ returnFocus: true }); else if (nav?.classList.contains('open')) { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.focus(); } } });
window.addEventListener('resize', () => { if (servicesSubmenu && !servicesSubmenu.hidden) positionServicesMenu(); });

const carousel = document.querySelector('.hero-carousel');
const fixedReadingHero = carousel?.classList.contains('home');
if (carousel && fixedReadingHero) {
  carousel.querySelectorAll('[data-carousel-slide]').forEach((slide) => { slide.hidden = false; slide.setAttribute('aria-hidden', 'false'); });
  carousel.querySelector('.carousel-controls')?.setAttribute('hidden', '');
} else if (carousel) {
  const slides = [...carousel.querySelectorAll('[data-carousel-slide]')]; const status = carousel.querySelector('.carousel-status'); const previous = carousel.querySelector('[data-carousel-action="previous"]'); const next = carousel.querySelector('[data-carousel-action="next"]'); const pause = carousel.querySelector('[data-carousel-action="pause"]'); const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)'); let index = 0; let paused = true;
  const render = () => { slides.forEach((slide, slideIndex) => { const active = slideIndex === index; slide.hidden = !active; slide.setAttribute('aria-hidden', String(!active)); }); status.textContent = `Slide ${index + 1} of ${slides.length}`; pause.textContent = paused ? 'Resume carousel' : 'Pause carousel'; pause.setAttribute('aria-pressed', String(paused)); };
  const move = (direction) => { index = (index + direction + slides.length) % slides.length; render(); };
  previous.addEventListener('click', () => move(-1)); next.addEventListener('click', () => move(1)); pause.addEventListener('click', () => { paused = !paused; render(); });
  carousel.addEventListener('keydown', (event) => { if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); } if (event.key === 'ArrowRight') { event.preventDefault(); move(1); } if (event.key === ' ') { event.preventDefault(); paused = !paused; render(); } });
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) paused = true; render(); }); render();
}

const enquiryForm = document.querySelector('.enquiry-form');
if (enquiryForm) {
  const submit = enquiryForm.querySelector('.form-submit');
  const status = enquiryForm.querySelector('.form-status');
  const requiredFields = [...enquiryForm.querySelectorAll('[required]')];
  const setStatus = (message, state = '') => { status.textContent = message; status.dataset.state = state; };
  const showInvalid = (field, message) => {
    field.setAttribute('aria-invalid', 'true');
    const id = `${field.id}-error`;
    let error = document.getElementById(id);
    if (!error) { error = document.createElement('p'); error.id = id; error.className = 'field-error'; field.closest('.form-field, .privacy-check')?.append(error); }
    error.textContent = message;
    field.setAttribute('aria-describedby', id);
  };
  const clearInvalid = (field) => { field.removeAttribute('aria-invalid'); document.getElementById(`${field.id}-error`)?.remove(); field.removeAttribute('aria-describedby'); };
  enquiryForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    let firstInvalid;
    for (const field of requiredFields) {
      clearInvalid(field);
      const valid = field.type === 'checkbox' ? field.checked : field.value.trim().length > 0;
      if (!valid) { showInvalid(field, field.type === 'checkbox' ? 'Please confirm the privacy information.' : 'This field is required.'); firstInvalid ??= field; }
    }
    const email = enquiryForm.elements.email;
    if (!firstInvalid && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { showInvalid(email, 'Enter a valid email address.'); firstInvalid = email; }
    if (firstInvalid) { setStatus('Please correct the highlighted fields.', 'error'); firstInvalid.focus(); return; }
    submit.disabled = true; submit.setAttribute('aria-busy', 'true'); const original = submit.textContent; submit.textContent = 'Sending…'; setStatus('Sending your enquiry…');
    const data = Object.fromEntries(new FormData(enquiryForm)); data.privacy = enquiryForm.elements.privacy.checked;
    try {
      const response = await fetch('/api/enquiry', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'We could not send your enquiry. Please try again or use the direct contact details.');
      enquiryForm.reset(); setStatus('Thanks — your enquiry has been sent.', 'success');
    } catch (error) { setStatus(error.message, 'error'); }
    finally { submit.disabled = false; submit.removeAttribute('aria-busy'); submit.textContent = original; }
  });
}

(() => {
  const measurementId = 'G-35M6VYNBDV';
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.append(script);
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', measurementId);
})();
