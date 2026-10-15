import {localTeamIdentity} from './business-links.mjs';
import {inspectionChargeNotice} from './audit-local-content.mjs';

export const aboutTitle='About Ellis Services Group | Perth Roof Care';
const aboutDescription='Meet Ellis Services Group, the company behind Perth Roof Care. Read our company registration, roof assessment process and written repair quote approach.';

export function renderAboutCompany(){
 return `<div class="about-company content-intent">
 <section class="about-company-hero" data-about-section="company"><div class="container about-company-hero-grid">
  <div class="about-company-intro"><p class="eyebrow">PERTH ROOF CARE / OUR COMPANY</p><h1>Ellis Services Group</h1><p class="about-company-statement">The company behind Perth Roof Care, providing roof repairs and drainage services across Perth.</p></div>
  <div class="about-company-position"><p class="local-team-identity">${localTeamIdentity}</p><p>We inspect, repair and maintain roofs and their connected drainage across Perth. Our work covers roof leaks, damaged tiles, metal sheets and fixings, ridge capping, flashing, gutters and downpipes.</p>
  <p class="inspection-charge-notice">${inspectionChargeNotice}</p><a class="button" href="/contact/">Arrange an assessment</a></div>
 </div></section>
 <section class="section about-company-business" data-about-section="business" id="business-registration" aria-labelledby="company-registration-heading"><div class="container about-company-registration-panel">
 <div><p class="eyebrow">Ellis Services Group Pty Ltd</p><h2 id="company-registration-heading">Company registration</h2><p>Australian Private Company</p></div>
 <div><dl class="about-company-facts"><div><dt>ABN</dt><dd>96 645 821 745</dd></div><div><dt>ACN</dt><dd>645 821 745</dd></div></dl>
 <p>ABN active and GST registered from 11 November 2020. <a href="https://abr.business.gov.au/ABN/View?id=645821745" target="_blank" rel="noopener noreferrer">Official ABN Lookup record</a></p>
 <p class="about-company-registration-note">The ABR company-registration record does not establish a trade licence or insurance.</p></div>
 </div></section>
 <section class="section about-company-approach" data-about-section="approach"><div class="container about-company-approach-grid">
  <div><p class="eyebrow">OUR WORKING PROCESS</p><h2>Roof assessment and written quotes</h2></div>
  <ol class="about-company-process"><li><h3>Property and access details</h3><p>Tell us your suburb, roof type, access restrictions and the issue you have noticed. Existing ground-level photographs are optional; there is no need to access the roof.</p></li><li><h3>Inspection scope and fee</h3><p>${inspectionChargeNotice} Our team assesses the property and explains the findings.</p></li><li><h3>Written repair quote</h3><p>We provide a repair plan and written quote before work begins. The quote identifies the affected components, materials and access needed for the agreed work.</p></li></ol>
 </div></section>
 <section class="section about-company-services" data-about-section="services"><div class="container"><h2>Roof repair and drainage services</h2><div><p>Our work includes leak investigation, tile and metal roof repairs, ridge capping, valleys and flashing. We also assess gutters, outlets and downpipes, and plan roof maintenance according to the condition found.</p><p><a href="/services/">View roof repair services</a></p></div></div></section></div>`;
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
