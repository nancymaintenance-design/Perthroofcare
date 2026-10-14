import {localTeamIdentity,businessHoursText} from './business-links.mjs';
import {inspectionChargeNotice} from './audit-local-content.mjs';

export const aboutTitle='Roof Repair Company Perth | Ellis Services Group';
const aboutDescription='Meet Ellis Services Group, the Perth team behind Perth Roof Care. Explore our roof repair services, photographed work, company record and contact details.';

export function renderAboutCompany(){
 return `<div class="about-company content-intent">
 <section class="about-company-hero" data-about-section="company"><div class="container about-company-hero-grid">
  <div class="about-company-intro"><p class="eyebrow">PERTH ROOF CARE / OUR COMPANY</p><h1>Perth Roof Repair Company — Ellis Services Group</h1>
  <p class="local-team-identity">${localTeamIdentity}</p><p>We inspect, repair and maintain roofs and their connected drainage across Perth. Our work covers roof leaks, damaged tiles, metal sheets and fixings, ridge capping, flashing, gutters and downpipes.</p>
  <p>Our team assesses the property, explains the findings and provides a repair plan and written quote before work begins. The repair scope follows the condition of your roof.</p>
  <p class="inspection-charge-notice">${inspectionChargeNotice}</p><a class="button" href="/contact/">Arrange an assessment</a></div>
  <figure class="about-company-hero-photo"><img src="/assets/images/metal-fastener-sequence-05-completed.png" alt="Completed metal roof photographed in the Ellis Services Group fastener repair sequence" fetchpriority="high"><figcaption>Metal roof fastener repair · Ellis Services Group project</figcaption></figure>
 </div></section>
 <section class="section about-company-services" data-about-section="services"><div class="container"><p class="eyebrow">OUR REPAIR SERVICES</p><h2>Roof repairs and drainage, from the surface to the outlet.</h2>
 <div class="about-company-service-columns">
  <article><h3>Leaks, tiles and metal roofs</h3><p>We investigate water entry and inspect the surrounding roof before specifying repairs. Localised work can address damaged tiles, metal sheets or fixings where the assessed condition allows.</p><ul><li><a href="/roof-leak-repairs/">Roof leak investigation and repairs</a></li><li><a href="/tile-roof-repairs/">Tile roof repairs</a></li><li><a href="/metal-roof-repairs/">Metal roof repairs</a></li></ul></article>
  <article><h3>Ridges, valleys and flashing</h3><p>We assess ridge mortar, valley condition and flashing at roof junctions. The findings determine whether the work needs local repair, repointing, rebedding or replacement of affected components.</p><ul><li><a href="/ridge-capping-repointing/">Ridge capping and repointing</a></li><li><a href="/flashing-repairs/">Roof valleys and flashing repairs</a></li><li><a href="/roof-repairs/">Roof repair services</a></li></ul></article>
  <article><h3>Drainage, inspections and maintenance</h3><p>We check gutters, outlets and downpipes as a connected route, then quote for clearing or repairs. Roof inspections and maintenance help identify deterioration and plan the work needed.</p><ul><li><a href="/gutters-downpipes/">Gutters and downpipes</a></li><li><a href="/roof-inspection/">Roof inspections</a></li><li><a href="/roof-maintenance/">Roof maintenance</a></li></ul></article>
 </div><p class="about-company-area-link"><a href="/service-areas/">Explore our Perth service areas</a></p></div></section>
 <section class="section about-company-project" data-about-section="project"><div class="container about-company-project-grid">
  <figure><img src="/assets/images/metal-fastener-sequence-04-fastener-work.png" alt="Work around metal roof fastener points during the recorded Ellis repair project" loading="lazy" decoding="async"><figcaption>Fastener work in progress in the same recorded project.</figcaption></figure>
  <div><p class="eyebrow">A CLOSER LOOK AT OUR WORK</p><h2>A metal roof fastener repair, photographed through the work.</h2><p>This project record follows the roof surface and corroded fastener details through repair work to completed roof views. It shows the components and work at that property, with photographs of the different stages.</p><p>For your roof, we confirm the affected components and repair scope through an on-site assessment.</p><a class="text-link" href="/projects/metal-roof-fastener-repair-sequence/">View the metal roof fastener repair project</a></div>
 </div></section>
 <section class="section about-company-business" data-about-section="business"><div class="container"><p class="eyebrow">COMPANY &amp; CONTACT</p><h2>Ellis Services Group Pty Ltd</h2><div class="about-company-facts">
  <div><h3>Business registration</h3><p>Australian Private Company<br>ABN 96 645 821 745<br>ACN 645 821 745</p><p>ABN active and GST registered from 11 November 2020.</p><a href="https://abr.business.gov.au/ABN/View?id=645821745" target="_blank" rel="noopener noreferrer">Official ABN Lookup record</a><p class="about-company-registration-note">The ABR company-registration record does not establish a trade licence or insurance.</p></div>
  <div><h3>Perth office</h3><p>140 St Georges Terrace, Perth WA 6000</p><p class="business-hours">${businessHoursText}</p></div>
  <div><h3>Contact our team</h3><p><a href="tel:+61405878406">0405 878 406</a><br><a href="mailto:ellisservicesgroup3@outlook.com">ellisservicesgroup3@outlook.com</a></p><p class="inspection-charge-notice">${inspectionChargeNotice}</p><a class="button" href="/contact/">Arrange an assessment</a></div>
 </div></div></section></div>`;
}

// Run after the historical editorial passes so the company narrative has one owner.
export function applyAboutCompany($,graph,canonical){
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
