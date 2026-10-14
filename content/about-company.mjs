import {localTeamIdentity} from './business-links.mjs';
import {inspectionChargeNotice} from './audit-local-content.mjs';

export const aboutTitle='About Ellis Services Group | Perth Roof Care';
const aboutDescription='Meet Ellis Services Group, the company behind Perth Roof Care. Explore our roofing capabilities, working approach, business record and contact details.';

export function renderAboutCompany(){
 return `<div class="about-company content-intent">
 <section class="about-company-hero" data-about-section="company"><div class="container about-company-hero-grid">
  <div class="about-company-intro"><p class="eyebrow">PERTH ROOF CARE / OUR COMPANY</p><h1>Ellis Services Group</h1><p class="about-company-statement">Roof repairs and connected drainage, with a scope shaped around your property.</p></div>
  <div class="about-company-position"><p class="local-team-identity">${localTeamIdentity}</p><p>We inspect, repair and maintain roofs and their connected drainage across Perth. Our work covers roof leaks, damaged tiles, metal sheets and fixings, ridge capping, flashing, gutters and downpipes.</p>
  <p class="inspection-charge-notice">${inspectionChargeNotice}</p><a class="button" href="/contact/">Arrange an assessment</a></div>
 </div></section>
 <section class="section about-company-services" data-about-section="services"><div class="container"><p class="eyebrow">OUR REPAIR SERVICES</p><h2>Roof repairs and drainage, from the surface to the outlet.</h2>
 <div class="about-company-service-columns">
  <article><h3>Leaks, tiles and metal roofs</h3><p>We investigate water entry and inspect the surrounding roof before specifying repairs. Localised work can address damaged tiles, metal sheets or fixings where the assessed condition allows.</p><ul><li><a href="/roof-leak-repairs/">Roof leak investigation and repairs</a></li><li><a href="/tile-roof-repairs/">Tile roof repairs</a></li><li><a href="/metal-roof-repairs/">Metal roof repairs</a></li></ul></article>
  <article><h3>Ridges, valleys and flashing</h3><p>We assess ridge mortar, valley condition and flashing at roof junctions. The findings determine whether the work needs local repair, repointing, rebedding or replacement of affected components.</p><ul><li><a href="/ridge-capping-repointing/">Ridge capping and repointing</a></li><li><a href="/flashing-repairs/">Roof valleys and flashing repairs</a></li><li><a href="/roof-repairs/">Roof repair services</a></li></ul></article>
  <article><h3>Drainage, inspections and maintenance</h3><p>We check gutters, outlets and downpipes as a connected route, then quote for clearing or repairs. Roof inspections and maintenance help identify deterioration and plan the work needed.</p><ul><li><a href="/gutters-downpipes/">Gutters and downpipes</a></li><li><a href="/roof-inspection/">Roof inspections</a></li><li><a href="/roof-maintenance/">Roof maintenance</a></li></ul></article>
 </div><p class="about-company-area-link"><a href="/service-areas/">Explore our Perth service areas</a></p></div></section>
 <section class="section about-company-approach" data-about-section="approach"><div class="container about-company-approach-grid">
  <div><p class="eyebrow">OUR WORKING APPROACH</p><h2>Assess the roof. Explain the work.</h2></div>
  <div><p>Our team assesses the property, explains the findings and provides a repair plan and written quote before work begins. The repair scope follows the condition of your roof.</p><p>The quote identifies the affected components, materials and access needed for the agreed work. Local repairs, wider roof work and optional surface treatments are considered according to the assessed condition.</p><p>Share your suburb, roof type if known and the issue you have noticed. Existing ground-level photographs are optional; there is no need to access the roof to make an enquiry.</p></div>
 </div></section>
 <section class="section about-company-business" data-about-section="business"><div class="container"><p class="eyebrow">BUSINESS REGISTRATION</p><h2>Ellis Services Group Pty Ltd</h2>
 <dl class="about-company-facts"><div><dt>Company type</dt><dd>Australian Private Company</dd></div><div><dt>ABN</dt><dd>96 645 821 745</dd></div><div><dt>ACN</dt><dd>645 821 745</dd></div></dl>
 <p>ABN active and GST registered from 11 November 2020. <a href="https://abr.business.gov.au/ABN/View?id=645821745" target="_blank" rel="noopener noreferrer">Official ABN Lookup record</a></p>
 <p class="about-company-registration-note">The ABR company-registration record does not establish a trade licence or insurance.</p>
 </div></section></div>`;
}

// Run after the historical editorial passes so the company narrative has one owner.
export function applyAboutCompany($,graph,canonical){
 $('.contact-band').remove();
 if(!$('link[href="/assets/css/about-company.css"]').length)$('head').append('<link rel="stylesheet" href="/assets/css/about-company.css">');
 $('main').html(renderAboutCompany());
 $('title').text(aboutTitle);
 $('meta[property="og:title"],meta[name="twitter:title"]').attr('content',aboutTitle);
 $('meta[name="description"],meta[property="og:description"],meta[name="twitter:description"]').attr('content',aboutDescription);
 for(let i=graph.length-1;i>=0;i--)if(['FAQPage','AboutPage'].includes(graph[i]['@type']))graph.splice(i,1);
 graph.push({'@type':'AboutPage','@id':canonical+'#about',url:canonical,name:aboutTitle,description:aboutDescription,inLanguage:'en-AU',about:{'@id':'https://www.perthroofcare.com.au/#ellis-services-group'}});
 const breadcrumb=graph.find(n=>n['@type']==='BreadcrumbList');
 if(breadcrumb?.itemListElement?.length)breadcrumb.itemListElement.at(-1).name='About Ellis Services Group';
 const knowledge=$('#page-knowledge');
 if(knowledge.length){const data=JSON.parse(knowledge.text());data.pageType='AboutPage';knowledge.text(JSON.stringify(data));}
}
