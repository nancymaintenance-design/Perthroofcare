import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {load} from 'cheerio';

// Read-only release checks. Never submit an enquiry or emit a browser event.
const base=process.argv[2];
assert.ok(base,'Usage: node tools/verify-release.mjs https://www.perthroofcare.com.au');
const origin=new URL(base).origin;
const sitemap=await fetch(`${origin}/sitemap.xml`);
assert.equal(sitemap.status,200);
const routes=[...readFileSync(new URL('../public/sitemap.xml',import.meta.url),'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
const remoteMap=await sitemap.text();
const remoteRoutes=[...remoteMap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
assert.deepEqual(remoteRoutes.sort(),[...routes].sort(),'published sitemap must cover the tested routes');
const results=[];
for(let i=0;i<routes.length;i+=4){
  results.push(...await Promise.all(routes.slice(i,i+4).map(async path=>{
    const response=await fetch(origin+path),html=await response.text(),$=load(html);
    assert.equal(response.status,200,path);
    assert.doesNotMatch(response.headers.get('x-robots-tag')||'',/noindex/i,path);
    assert.doesNotMatch($('meta[name="robots"]').attr('content')||'',/noindex/i,path);
    assert.equal($('link[rel="canonical"]').attr('href'),`https://www.perthroofcare.com.au${path}`,path);
    const graph=JSON.parse($('script[type="application/ld+json"]').text())['@graph'];
    const business=graph.find(n=>n['@type']==='LocalBusiness');
    assert.ok(graph.find(n=>n['@id']===business.parentOrganization?.['@id']),path);
    assert.equal(business.openingHoursSpecification[0].closes,'21:00',path);
    assert.equal($('footer .business-hours').length,1,path);
    assert.equal($('link[rel="stylesheet"]').length,1,path);
    assert.equal($('script[src*="googletagmanager.com/gtag/js"]').length,1,path);
    return {path,status:response.status};
  })));
}
const home=load(await (await fetch(origin+'/')).text());
const css=await fetch(new URL(home('link[rel="stylesheet"]').attr('href'),origin));
assert.equal(css.status,200);
const index=await fetch(origin+'/index.html?release_check=1',{redirect:'manual'});
assert.equal(index.status,308);
assert.equal(new URL(index.headers.get('location'),origin).searchParams.get('release_check'),'1','index redirect preserves query');
const invalid=await fetch(origin+'/seo-release-nonexistent-20261010',{redirect:'manual'});
assert.equal(invalid.status,404);
const api=await fetch(origin+'/api/enquiry');
assert.equal(api.status,405,'GET must not send an enquiry');
const robots=await (await fetch(origin+'/robots.txt')).text();
assert.match(robots,/Allow: \//);
assert.doesNotMatch(robots,/Disallow: \/\s*$/m);
console.log(JSON.stringify({origin,pages:results.length,allPages200:true,noindex:false,groupAndHours:true,ga4TagPresent:true,indexRedirect:index.status,queryPreserved:true,notFound:invalid.status,enquiryGET:api.status,cssCache:css.headers.get('cache-control'),verifiedAt:new Date().toISOString()},null,2));
