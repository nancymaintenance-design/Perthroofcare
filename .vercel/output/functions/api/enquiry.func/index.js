const maxBodyBytes = 12_000;
const recipient = 'ellisservicesgroup3@outlook.com';

const json = (response, status, body) => {
  response.setHeader?.('cache-control', 'no-store');
  return response.status(status).json(body);
};

const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
})[character]);

const cleanText = (value, maximum) => String(value ?? '')
  .replace(/[\u0000-\u001f\u007f]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
  .slice(0, maximum);

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default async function enquiry(request, response) {
  if (request.method !== 'POST') return json(response, 405, { error: 'Method not allowed.' });
  if (!String(request.headers?.['content-type'] || '').toLowerCase().startsWith('application/json')) return json(response, 415, { error: 'Use application/json.' });
  if (Number(request.headers?.['content-length'] || 0) > maxBodyBytes) return json(response, 413, { error: 'Enquiry is too large.' });

  let data;
  try {
    data = request.body;
  } catch {
    return json(response, 400, { error: 'Invalid enquiry data.' });
  }
  if (!data || Array.isArray(data) || typeof data !== 'object') return json(response, 400, { error: 'Invalid enquiry data.' });
  if (cleanText(data.website, 200)) return json(response, 200, { ok: true });

  const name = cleanText(data.name, 100);
  const phone = cleanText(data.phone, 40);
  const email = cleanText(data.email, 254);
  const enquiryText = cleanText(data.enquiry, 4_000);
  if (!name || !phone || !enquiryText || !data.privacy || !isValidEmail(email)) {
    return json(response, 400, { error: 'Please complete the required fields with a valid email address and accept the privacy information.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!apiKey || !from) return json(response, 503, { error: 'Enquiry email is not configured.' });

  const text = `New Ellis Services Group website enquiry\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nEnquiry:\n${enquiryText}`;
  const html = `<h1>New Ellis Services Group website enquiry</h1><p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Phone:</strong> ${escapeHtml(phone)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Enquiry:</strong><br>${escapeHtml(enquiryText).replace(/\n/g, '<br>')}</p>`;

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [recipient],
        subject: 'New website enquiry — Ellis Services Group',
        text,
        html
      })
    });
    if (!resendResponse.ok) return json(response, 502, { error: 'We could not send your enquiry. Please try again or use the direct contact details.' });
    return json(response, 200, { ok: true });
  } catch {
    return json(response, 502, { error: 'We could not send your enquiry. Please try again or use the direct contact details.' });
  }
}
