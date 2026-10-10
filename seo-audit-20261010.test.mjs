import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {load} from 'cheerio';
const root=fileURLToPath(new URL('./public/',import.meta.url));
const paths=[...readFileSync(join(root,'sitemap.xml'),'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
const page=p=>load(readFileSync(join(root,p,'index.html'),'utf8'));
const graph=$=>JSON.parse($('script[type="application/ld+json"]').text())['@graph'];

test('Perth local business belongs to the registered group without inventing a separate company or moving its office',()=>{
  for(const path of paths){const $=page(path),nodes=graph($),business=nodes.find(n=>n['@type']==='LocalBusiness');
    const parent=nodes.find(n=>n['@id']===business.parentOrganization?.['@id']);
    assert.ok(parent,`${path}: resolve the registered group`);
    assert.equal(parent['@type'],'Organization');
    assert.equal(parent.legalName,'Ellis Services Group Pty Ltd');
    assert.deepEqual(parent.identifier,[{'@type':'PropertyValue',propertyID:'ABN',value:'96645821745'},{'@type':'PropertyValue',propertyID:'ACN',value:'645821745'}]);
    assert.equal(business.address.streetAddress,'140 St Georges Terrace');
    assert.equal(business.address.addressRegion,'WA');
    assert.equal(nodes.filter(n=>n['@type']==='LocalBusiness').length,1);
    assert.equal(parent.address,undefined,'do not invent a group street address from a postcode');
  }
  for(const path of ['/','/about/','/contact/']){
    const $=page(path);
    assert.match($('main .local-team-identity').text(),/Perth-based team/);
    assert.match($('main .local-team-identity').text(),/operated by Ellis Services Group Pty Ltd/);
    assert.match($('main .local-team-identity').text(),/140 St Georges Terrace, Perth WA 6000/);
  }
});

test('owner-confirmed seven-day Perth opening hours agree in visible copy and every business entity',()=>{
  const days=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(d=>`https://schema.org/${d}`);
  for(const path of paths){const $=page(path),business=graph($).find(n=>n['@type']==='LocalBusiness');
    assert.deepEqual(business.openingHoursSpecification,[{'@type':'OpeningHoursSpecification',dayOfWeek:days,opens:'09:00',closes:'21:00'}],path);
    assert.equal($('footer .business-hours').length,1,path);
    assert.equal($('footer .business-hours').text(),'Opening hours: Monday–Sunday, 9am–9pm (Perth local time).',path);
  }
  for(const path of ['/about/','/contact/'])assert.equal(page(path)('main .business-hours').length,1,path);
});

test('company registration remains directly verifiable without being represented as a trade licence',()=>{
  const $=page('/about/');
  assert.equal($('main a[href="https://abr.business.gov.au/ABN/View?id=645821745"]').length,1);
  assert.match($('main').text(),/company-registration/);
  assert.match($('main').text(),/insurance/);
});

test('every footer and business entity use the supplied platform destinations',()=>{
  const facebook='https://www.facebook.com/p/Ellis-Services-Group-100082926022259/';
  const linkedin='https://www.linkedin.com/in/ellis-services-group-091541266/?isSelfProfile=false';
  const maps='https://maps.app.goo.gl/tQ7R9WdBLQYWrvSV6';
  for(const path of paths){const $=page(path),business=graph($).find(n=>n['@type']==='LocalBusiness');
    assert.equal($('footer .facebook-link').attr('href'),facebook,path);
    assert.equal($('footer .linkedin-link').attr('href'),linkedin,path);
    assert.equal($('footer .reviews-link').attr('href'),maps,path);
    assert.equal($('footer .reviews-link span').text(),'Google Maps');
    assert.ok(business.sameAs.includes(facebook)&&business.sameAs.includes(linkedin),path);
    assert.equal(business.hasMap,maps,path);
    assert.ok(!business.sameAs.some(url=>url.includes('share.google')),path);
  }
});

test('home requests only responsive hero preloads, with one choice per viewport',()=>{
  const $=page('/'),preloads=$('link[rel="preload"][as="image"]').toArray().map(e=>({href:$(e).attr('href'),media:$(e).attr('media')}));
  assert.equal(preloads.length,2);assert.ok(preloads.every(p=>p.href.endsWith('.webp')));
  assert.deepEqual(preloads.map(p=>p.media).sort(),['(max-width:600px)','(min-width:601px)']);
});

test('every form label resolves to exactly one form control, not a section anchor',()=>{
  for(const path of paths){const $=page(path);
    const ids=$('[id]').toArray().map(el=>$(el).attr('id'));
    assert.equal(new Set(ids).size,ids.length,`${path}: duplicate element IDs`);
    $('label[for]').each((_,el)=>{
      const id=$(el).attr('for'),target=$('[id]').filter((_,node)=>$(node).attr('id')===id);
      assert.equal(target.length,1,`${path}: label ${id} must have one target`);
      assert.ok(target.is('input,textarea,select,button,output'),`${path}: label ${id} must target a control`);
    });
  }
});

test('footer destination descriptions do not present a Maps link as a reviews page',()=>{
  for(const path of paths){const $=page(path),group=$('footer .footer-socials');
    assert.match(group.attr('aria-label'),/maps/i,path);
    assert.doesNotMatch(group.attr('aria-label'),/reviews/i,path);
  }
});

test('priority service pages explain repair decisions and quote scope with existing evidence paths',()=>{
  for(const path of ['/roof-repairs/','/roof-leak-repairs/','/metal-roof-repairs/','/tile-roof-repairs/']){
    const $=page(path);
    assert.ok($('.audit-repair-decision li').length>=3,path);
    assert.ok($('.audit-quote-scope li').length>=4,path);
    assert.ok($('.audit-repair-decision a[href^="/projects/"]').length,path);
    assert.ok($('.audit-quote-scope a[href="/contact/"]').length,path);
  }
});

test('priority area pages identify relevant examples without claiming they are local jobs',()=>{
  for(const slug of ['leederville','perth','fremantle','joondalup','bayswater']){
    const $=page(`/areas/${slug}-roof-repairs/`);
    assert.ok($('.audit-area-preparation li').length>=3,slug);
    assert.ok($('.audit-area-preparation a[href^="/projects/"]').length,slug);
    assert.match($('.audit-area-preparation').text(),/not evidence of a completed job in/);
  }
});

test('key guides offer practical checklists, decision comparisons and manufacturer context',()=>{
  for(const path of ['/news/roof-flashing-explained/','/news/roof-leak-detection-perth/']){
    const $=page(path);assert.ok($('.audit-observation-checklist li').length>=4,path);
    assert.ok($('.audit-technical-sources a[href^="https://lysaght.com/"]').length,path);
  }
  assert.ok(page('/news/ridge-capping-repairs-perth-guide/')('.audit-decision-comparison tbody tr').length>=3);
  assert.ok(page('/roof-restoration/')('.audit-decision-comparison tbody tr').length>=3);
});

test('sitemap dates identify actual editorial changes instead of dating every build',()=>{
  const xml=readFileSync(join(root,'sitemap.xml'),'utf8'),$=load(xml,{xmlMode:true});
  for(const path of ['/roof-repairs/','/news/roof-flashing-explained/','/areas/leederville-roof-repairs/']){
    const entry=$('url').filter((_,e)=>$(e).find('loc').text()===`https://www.perthroofcare.com.au${path}`);
    assert.equal(entry.find('lastmod').text(),'2026-10-10');
  }
  assert.equal($('url').filter((_,e)=>$(e).find('loc').text().endsWith('/privacy/')).find('lastmod').length,0);
});
test('all articles identify visible image, author, publisher and truthful modification date',()=>{
  const feed=JSON.parse(readFileSync(join(root,'news/feed.json'),'utf8'));
  for(const path of paths.filter(p=>p.startsWith('/news/')&&p!=='/news/')){
    const $=page(path),article=graph($).find(n=>n['@type']==='Article');
    assert.ok(article.image,path);const imagePath=new URL(article.image).pathname;
    assert.ok(existsSync(join(root,imagePath)),path);assert.ok($(`main img[src="${imagePath}"]`).length,path);
    assert.deepEqual(article.author,{'@id':'https://www.perthroofcare.com.au/#business'});
    assert.deepEqual(article.publisher,{'@id':'https://www.perthroofcare.com.au/#business'});
    assert.equal(article.dateModified,'2026-10-10');assert.match($('.article-byline').text(),/Updated 2026-10-10/);
    assert.equal(feed.items.find(i=>new URL(i.url).pathname===path).date_modified,'2026-10-10T00:00:00+08:00');
  }
});

test('RSS and JSON guide feeds reproduce the same current article content',()=>{
  const feed=JSON.parse(readFileSync(join(root,'news/feed.json'),'utf8'));
  const $=load(readFileSync(join(root,'news/feed.xml'),'utf8'),{xmlMode:true});
  assert.equal($('item').length,feed.items.length);
  for(const item of feed.items){const entry=$('item').filter((_,el)=>$(el).find('link').text()===item.url);
    assert.equal(entry.find('description').text(),item.content_text,item.url);
    assert.equal(entry.find('title').text(),item.title,item.url);
  }
});
test('services link to one business entity with visible Perth identity and real logo',()=>{
  let count=0;
  for(const path of paths){const $=page(path),nodes=graph($),business=nodes.find(n=>n['@type']==='LocalBusiness');
    assert.ok(business.logo);assert.ok(existsSync(join(root,new URL(business.logo).pathname)));
    for(const node of nodes.filter(n=>n['@type']==='Service')){count++;assert.deepEqual(node.provider,{'@id':business['@id']});}
  }assert.ok(count>=14);
});
