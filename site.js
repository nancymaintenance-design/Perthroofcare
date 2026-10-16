const chinese = document.documentElement?.lang === 'zh-Hans';
const message = (english, translation) => chinese ? translation : english;
const languageSwitch = document.querySelector('[data-language-switch]');
if (languageSwitch && window.location) {
  const counterpart = languageSwitch.getAttribute('href').split(/[?#]/)[0];
  const updateLanguageSwitch = () => {
    let hash = '';
    try { if (window.location.hash && document.getElementById(decodeURIComponent(window.location.hash.slice(1)))) hash = window.location.hash; } catch { /* Ignore malformed fragments. */ }
    languageSwitch.setAttribute('href', counterpart + (window.location.search || '') + hash);
  };
  updateLanguageSwitch();
  window.addEventListener('hashchange', updateLanguageSwitch);
  languageSwitch.addEventListener('click', updateLanguageSwitch);
}
const toggle = document.querySelector('.menu');
const nav = document.querySelector('header nav');
const servicesToggle = document.querySelector('.services-toggle');
const servicesSubmenu = document.querySelector('#services-submenu');
const closeServices = ({ returnFocus = false } = {}) => { if (!servicesToggle || !servicesSubmenu) return; servicesSubmenu.hidden = true; servicesToggle.setAttribute('aria-expanded', 'false'); if (returnFocus) servicesToggle.focus(); };
const positionServicesMenu = () => {
  if (!servicesToggle || !servicesSubmenu) return;
  if (window.innerWidth <= 900) {
    for (const property of ['width', 'left', 'right', 'top', 'max-height']) servicesSubmenu.style.removeProperty(property);
    return;
  }
  const bounds = servicesToggle.getBoundingClientRect();
  const sideGap = 16;
  const menuWidth = Math.min(896, Math.max(280, window.innerWidth - sideGap * 2));
  const top = Math.min(bounds.bottom + 8, Math.max(sideGap, window.innerHeight - 88));
  const left = Math.max(sideGap, Math.min(bounds.left, window.innerWidth - menuWidth - sideGap));
  servicesSubmenu.style.width = `${menuWidth}px`;
  servicesSubmenu.style.left = `${left}px`;
  servicesSubmenu.style.right = 'auto';
  servicesSubmenu.style.top = `${top}px`;
  servicesSubmenu.style.maxHeight = `${Math.max(180, window.innerHeight - top - sideGap)}px`;
};
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
  const render = () => { slides.forEach((slide, slideIndex) => { const active = slideIndex === index; slide.hidden = !active; slide.setAttribute('aria-hidden', String(!active)); }); status.textContent = message(`Slide ${index + 1} of ${slides.length}`, `第 ${index + 1} 张，共 ${slides.length} 张`); pause.textContent = paused ? message('Resume carousel', '继续轮播') : message('Pause carousel', '暂停轮播'); pause.setAttribute('aria-pressed', String(paused)); };
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
  let composing = false;
  enquiryForm.addEventListener('compositionstart', () => { composing = true; });
  enquiryForm.addEventListener('compositionend', () => { composing = false; });
  const failed = message('We could not send your enquiry. Please try again or use the direct contact details.', '咨询未能发送。请重试，或使用电话和邮箱直接联系我们。');
  const serverErrors = {
    'This local preview does not send enquiries. Please review the form without submitting personal details.': '本地预览不会发送咨询。请使用测试内容查看表单，不要填写个人资料。',
    'Enquiry email is not configured.': '咨询邮件暂时无法发送。请通过电话或邮箱直接联系我们。',
    'Enquiry is too large.': '咨询内容过长。请缩短内容后重试。',
    'Invalid enquiry data.': '咨询资料格式无效。请检查填写内容后重试。',
    'Please complete the required fields with a valid email address and accept the privacy information.': '请填写所有必填项、输入有效邮箱，并确认隐私信息。',
    'Too many enquiries. Please try again later.': '咨询提交次数过多。请稍后再试，或通过电话和邮箱联系我们。',
    'Method not allowed.': '此提交方式不可用。请刷新页面后重试。',
    'Use application/json.': '提交格式无效。请刷新页面后重试。'
  };
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
    if (submit.disabled || composing) return;
    let firstInvalid;
    for (const field of requiredFields) {
      clearInvalid(field);
      const valid = field.type === 'checkbox' ? field.checked : field.value.trim().length > 0;
      if (!valid) { showInvalid(field, field.type === 'checkbox' ? message('Please confirm the privacy information.', '请确认隐私信息。') : message('This field is required.', '请填写此必填项。')); firstInvalid ??= field; }
    }
    const email = enquiryForm.elements.email;
    if (!firstInvalid && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { showInvalid(email, message('Enter a valid email address.', '请输入有效的邮箱地址。')); firstInvalid = email; }
    if (firstInvalid) { setStatus(message('Please correct the highlighted fields.', '请更正标出的填写项。'), 'error'); firstInvalid.focus(); return; }
    const originalWidth = submit.style?.inlineSize || '';
    if (submit.getBoundingClientRect) submit.style.inlineSize = `${submit.getBoundingClientRect().width}px`;
    submit.disabled = true; submit.setAttribute('aria-busy', 'true'); const original = submit.textContent; submit.textContent = message('Sending…', '发送中…'); setStatus(message('Sending your enquiry…', '正在发送您的咨询…'));
    const data = Object.fromEntries(new FormData(enquiryForm)); data.privacy = enquiryForm.elements.privacy.checked;
    try {
      const response = await fetch('/api/enquiry', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.ok !== true) { setStatus(chinese ? serverErrors[result.error] || failed : result.error || failed, 'error'); return; }
      window.ellisAnalytics?.leadConfirmed(response, result);
      enquiryForm.reset(); setStatus(message('Thanks — your enquiry has been sent.', '感谢您，咨询已发送。'), 'success');
    } catch (error) { setStatus(chinese ? '网络连接失败，咨询尚未确认发送。请检查网络后重试，或通过电话和邮箱联系我们。' : error.message, 'error'); }
    finally { submit.disabled = false; submit.removeAttribute('aria-busy'); submit.textContent = original; if (submit.style) submit.style.inlineSize = originalWidth; }
  });
}
