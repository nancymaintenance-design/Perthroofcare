import {localTeamIdentity,businessHoursText} from './business-links.mjs';
import {inspectionChargeNotice} from './audit-local-content.mjs';

// Preserve the existing form node and its API/client-validation hooks. Only its
// surrounding flow and grid spans belong to this final, Contact-only pass.
export function applyContactLayout($){
 const title='Perth Roof Repair Enquiries | Ellis Services Group';
 $('title').text(title);
 $('meta[property="og:title"],meta[name="twitter:title"]').attr('content',title);
 const form=$('main .enquiry-form').first();
 if(!form.length)throw new Error('Contact layout requires the existing enquiry form');
 form.remove();
 form.find('[name="email"],[name="enquiry"]').closest('.form-field').addClass('contact-form-wide');
 $('main').addClass('contact-page').html(`<section class="contact-hero"><div class="container">
  <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">Perth roof repair enquiries</span></nav>
  <p class="eyebrow">PERTH ROOF CARE / CONTACT</p><h1>Perth roof repair enquiries</h1>
  <p class="contact-intro">Our Perth team arranges an on-site assessment of your roof or drainage problem, explains the repair plan and provides a written quote.</p>
  <p class="local-team-identity">${localTeamIdentity}</p>
  <p class="inspection-charge-notice">${inspectionChargeNotice}</p>
 </div></section>
 <section class="contact-information" aria-label="Direct contact details"><div class="container"><div class="contact-details-band">
  <div><h2>Phone</h2><a href="tel:+61405878406">0405 878 406</a></div>
  <div><h2>Email</h2><a href="mailto:ellisservicesgroup3@outlook.com">ellisservicesgroup3@outlook.com</a></div>
  <div><h2>Perth office</h2><p>140 St Georges Terrace, Perth WA 6000</p></div>
  <p class="business-hours">${businessHoursText}</p>
 </div></div></section>
 <section class="contact-form-section content-intent"><div class="container"><div class="contact-enquiry-box">
  <p class="eyebrow">ENQUIRY</p><h2>Arrange a roof assessment</h2>
  <p>Our team reviews your suburb, roof material if known, the affected area, timing and previous repairs to plan the assessment. Include the authorised access contact and any restrictions.</p>
  <p class="contact-photo-note">Existing ground-level photographs are optional and can be emailed to our team. There is no need to access the roof.</p>
  <div class="contact-form-slot"></div><p class="contact-scope-link"><a href="/roof-inspection/">Roof inspection scope and charges</a></p>
 </div></div></section>`);
 $('.contact-form-slot').replaceWith(form);
 if(!$('link[href="/assets/css/contact-layout.css"]').length)$('head').append('<link rel="stylesheet" href="/assets/css/contact-layout.css">');
}
