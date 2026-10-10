// Read-only browser evaluator. Composite solid ancestor backgrounds; report
// photographs/gradients separately because pixels require visual inspection.
export function inspectTextContrast() {
  const rgb = value => {
    const values = value.match(/[\d.]+/g)?.map(Number);
    return values?.length >= 3 ? [...values.slice(0, 3), values[3] ?? 1] : null;
  };
  const over = (front, back) => {
    const a = front[3] + back[3] * (1 - front[3]);
    return [...front.slice(0, 3).map((v, i) => (v * front[3] + back[i] * back[3] * (1 - front[3])) / (a || 1)), a];
  };
  const luminance = color => {
    const channels = color.slice(0, 3).map(v => v / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
    return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
  };
  const issues = [], imageBacked = [];
  let checked = 0;
  for (const e of document.querySelectorAll('body *')) {
    if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(e.tagName)) continue;
    const text = [...e.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).filter(Boolean).join(' ');
    if (!text || !e.getClientRects().length) continue;
    const style = getComputedStyle(e);
    if (style.visibility !== 'visible') continue;
    const rect = e.getBoundingClientRect();
    if (rect.right <= 0 || rect.bottom <= 0 || rect.width === 0 || rect.height === 0) continue;
    let bg = [0, 0, 0, 0], photographic = false, opacity = 1;
    for (let node = e; node; node = node.parentElement) {
      const s = getComputedStyle(node);
      opacity *= Number(s.opacity);
      if (bg[3] < .999 && s.backgroundImage !== 'none') photographic = true;
      bg = over(bg, rgb(s.backgroundColor) ?? [0, 0, 0, 0]);
    }
    if (opacity === 0) { issues.push({text: text.slice(0, 100), reason: 'transparent text'}); continue; }
    if (photographic) { imageBacked.push(text.slice(0, 80)); continue; }
    bg = over(bg, [255, 255, 255, 1]);
    const foreground = rgb(style.color);
    if (!foreground) continue;
    foreground[3] *= opacity;
    const fg = over(foreground, bg);
    const lights = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
    const ratio = (lights[0] + .05) / (lights[1] + .05);
    const fontSize = Number(style.fontSize.replace('px', ''));
    const large = fontSize >= 24 || (fontSize >= 18.66 && Number(style.fontWeight) >= 700);
    const minimum = large ? 3 : 4.5;
    checked++;
    if (ratio + .01 < minimum) issues.push({tag: e.tagName, class: e.className, text: text.slice(0, 100), foreground: style.color, background: bg.slice(0, 3).map(Math.round), ratio: Number(ratio.toFixed(2)), minimum});
  }
  return {path: location.pathname, checked, issues, imageBacked};
}
