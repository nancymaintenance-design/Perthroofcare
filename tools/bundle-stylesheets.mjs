import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {load} from 'cheerio';
import {transform} from 'lightningcss';

// Explicitly reviewed, retired layout families. A rule is removed only if every
// selector depends on a retired class absent from ALL pages and runtime scripts.
// Mixed selectors, live classes, pseudo-classes and media rules remain intact.
const retiredVisualClasses=new Set(`service-core-list homepage-service-links service-path story-copy route-rail service-route-grid story-media service-real-project focus-links proof-intro home-proof-sequence service-route-detail homepage-process-grid home-enquiry service-brief-enquiry service-work-card homepage-service-overview fixed-roofline-story homepage-search-intent service-route-support project-case-hero core-service-case-card homepage-areas story-panel--next-steps service-route-link service-route-related services-project-shortcut service-project-evidence-links focus-notes focus-summary hero-slide homepage-process story-panel--drainage field-guide-card service-project-evidence service-core-content service-work-grid gallery-grid story-panel news-guide-grid service-field-guide field-guide-grid service-project-evidence-grid service-brief-layout service-brief-copy service-work-intro homepage-evidence-note service-route-links service-field-guide-intro area-note service-brief evidence-links service-route-intro instagram-mark instagram-dot area-popular-localities area-locality-card core-service-cases core-service-cases-intro`.split(' '));

// Keep the original cascade, including media and interactive-state rules.
// Only publication copies change; editable source styles remain intact.
export function bundleStylesheets(publicDirectory,routes,visualLayer=()=> ''){
  const bundles=new Map();
  const routeBundles=new Set();
  const publishedClasses=new Set();
  const runtimeSources=['site.js','faq.js','analytics.js'].map(name=>join(publicDirectory,'assets/js',name)).filter(existsSync).map(path=>readFileSync(path,'utf8')).join('\n');
  for(const route of routes){
    const $=load(readFileSync(join(publicDirectory,route,'index.html'),'utf8'));
    $('[class]').each((_,el)=>{for(const name of $(el).attr('class').split(/\s+/))publishedClasses.add(name);});
  }
  for(const route of routes){
    const file=join(publicDirectory,route,'index.html');
    const $=load(readFileSync(file,'utf8'));
    const links=$('link[rel="stylesheet"]');
    // About and Contact add a small route-owned layer without enlarging the shared bundle.
    // Both files are linked directly; no @import request chain is introduced.
    const baseRoute=route.replace(/^zh(?:\/|$)/,'');
    const routeStyle=baseRoute===''?'home-reviews.css':baseRoute==='about'?'about-company.css':baseRoute==='contact'?'contact-layout.css':$('main.service-layout').length?'service-layout.css':null;
    const routeLayout=routeStyle?$(`link[href="/assets/css/${routeStyle}"]`):null;
    const navigationStyles=$('style[data-service-navigation]');
    let routeHref;
    const polish=visualLayer(baseRoute);
    if(routeLayout?.length||navigationStyles.length||polish){
      const source=(routeLayout?.length?readFileSync(join(publicDirectory,'assets/css',routeStyle),'utf8'):'')+navigationStyles.map((_,el)=>$(el).html()).get().join('\n')+'\n'+polish;
      const {code}=transform({filename:routeStyle||'service-navigation.css',code:Buffer.from(source),minify:true});
      const digest=createHash('sha256').update(code).digest('hex').slice(0,16);
      routeHref=`/assets/css/site-${digest}.css`;
      routeBundles.add(routeHref);
      writeFileSync(join(publicDirectory,routeHref),code);
    }
    const cascade=$('link[rel="stylesheet"],style').filter((_,el)=>!$(el).is('style[data-service-navigation]')&&(!routeHref||el!==routeLayout?.[0]));
    if(!links.length)throw new Error(`No stylesheet for ${route||'/'}`);
    const inputs=cascade.toArray().map(el=>{
      if(el.tagName==='style')return $(el).html();
      const node=$(el),url=new URL(node.attr('href'),'https://preview.invalid');
      if(url.origin!=='https://preview.invalid'||!/^\/assets\/css\/[\w.-]+\.css$/.test(url.pathname))throw new Error(`Unsupported stylesheet: ${url.href}`);
      const css=readFileSync(join(publicDirectory,url.pathname),'utf8'),media=node.attr('media');
      return media&&media!=='all'?`@media ${media}{${css}}`:css;
    });
    const key=inputs.join('\n');
    let href=bundles.get(key);
    if(!href){
      const {code}=transform({filename:'site.css',code:Buffer.from(key),minify:true,visitor:{Rule:{style(rule){
        // Prune only explicitly retired classes, absent from every page and runtime script.
        // Never infer all interactive or pseudo-class rules from static coverage.
        const selectors=rule.value.selectors.filter(selector=>!selector.some(part=>part.type==='class'&&(part.name.startsWith('atlas-')||retiredVisualClasses.has(part.name))&&!publishedClasses.has(part.name)&&!runtimeSources.includes(part.name)));
        if(!selectors.length)return [];
        // Mixed live/retired lists stay intact rather than rewriting declarations.
      }}}});
      const digest=createHash('sha256').update(code).digest('hex').slice(0,16);
      href=`/assets/css/site-${digest}.css`;
      writeFileSync(join(publicDirectory,href),code);
      bundles.set(key,href);
    }
    links.first().attr('href',href).removeAttr('media');
    links.slice(1).remove();
    if(routeHref)links.first().after(`<link rel="stylesheet" href="${routeHref}">`);
    $('style').remove();
    writeFileSync(file,$.html());
  }
  console.log(`Stylesheets: ${routes.length} pages, ${new Set([...bundles.values(),...routeBundles]).size} fingerprinted bundles; cascade preserved.`);
}
