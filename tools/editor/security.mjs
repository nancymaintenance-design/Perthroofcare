import { timingSafeEqual } from 'node:crypto';
export function sameOrigin(request, origin) {
    return request.headers.host === new URL(origin).host && (!request.headers.origin || request.headers.origin === origin) && ![
        'cross-site',
        'same-site'
    ].includes(String(request.headers['sec-fetch-site'] ?? ''));
}
export function authorized(request, origin, token, mutation = false) {
    const supplied = request.headers['x-editor-token'];
    if (!sameOrigin(request, origin) || mutation && request.headers.origin !== origin || typeof supplied !== 'string') return false;
    const a = Buffer.from(supplied), b = Buffer.from(token);
    return a.length === b.length && timingSafeEqual(a, b);
}
