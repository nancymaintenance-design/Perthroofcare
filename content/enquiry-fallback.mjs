
// Keep this outside the form: its controls cannot send the JSON-only enquiry
// without site.js. noscript also keeps normal form layout and validation intact.
export function renderEnquiryFallback(){
 return `<noscript><style>.enquiry-form{display:none!important}</style><div class="enquiry-no-js"><p>The online enquiry form needs JavaScript. Call or email our Perth team to discuss your roof assessment.</p><p><a href="tel:+61405878406">Call 0405 878 406</a> · <a href="mailto:ellisservicesgroup3@outlook.com">Email Ellis Services Group</a></p></div></noscript>`;
}
