// Durable, reproducible content review against the approved pre-About baseline.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {load} from 'cheerio';

const baselineCommit='4b3e765';
const root=resolve(import.meta.dirname,'..');
const destination=resolve(root,process.argv[2]||'../reports/2026-10-14-content-ui-refresh');
const contentDate=process.argv[3]||'2026-10-14';
const currentRef=process.argv[4];
const routes=[...readFileSync(join(root,'sitemap.xml'),'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname).filter(r=>!r.startsWith('/zh/'));
const question=text=>/\?|^(?:what|why|how|can|does|do|is|are|when|which|who|should)\b/i.test(text);
const extract=html=>{
 const $=load(html);
 const headings=$('main h1,main h2,main h3').map((_,e)=>({level:e.tagName,text:$(e).text()})).get();
 const summaries=$('main summary').map((_,e)=>$(e).text()).get();
 const questionCounts={titles:question($('title').text())?1:0,headings:headings.filter(h=>question(h.text)).length,summaries:summaries.filter(question).length};
 questionCounts.total=questionCounts.titles+questionCounts.headings+questionCounts.summaries;
 return {title:$('title').text(),description:$('meta[name="description"]').attr('content'),headings,summaries,
  articleLead:$('.article-lead').text(),knowledgeSummary:JSON.parse($('#page-knowledge').text()||'{}').summary||'',questionCounts,
  shared:{contactHeading:$('.contact-band h2').text(),menuIntro:$('.services-panel-intro').text()}};
};
const inventory={baselineCommit,currentContentDate:contentDate,scope:'69 canonical routes; title, headings, disclosure summaries, article leads, knowledge summaries and shared framing are separate fields.',
 routes:routes.map(route=>{
  const file=route==='/'?'index.html':route.slice(1)+'index.html';
  const before=extract(execFileSync('git',['show',`${baselineCommit}:${file}`],{cwd:root,encoding:'utf8',maxBuffer:8*1024*1024}));
  const after=extract(currentRef?execFileSync('git',['show',`${currentRef}:${file}`],{cwd:root,encoding:'utf8',maxBuffer:8*1024*1024}):readFileSync(join(root,file),'utf8'));
  return {route,before,after};
 })};
mkdirSync(destination,{recursive:true});
writeFileSync(join(destination,'heading-changes.json'),JSON.stringify(inventory,null,2)+'\n');
const safe=s=>String(s).replaceAll('|','\\|').replaceAll('\n',' ');
const document=['# Perth Roof Care heading and title changes','',
 `Approved baseline: \`${baselineCommit}\` (before Task 1). Current local content: ${contentDate}.`,
 '','All 69 canonical routes are included. The JSON companion preserves complete before/after arrays, article leads, knowledge summaries and shared framing. Question counts include interrogative wording without a question mark. FAQ questions remain deliberate.','',
 '| Route | Title questions before → after | Heading questions before → after | Disclosure questions before → after |','| --- | ---: | ---: | ---: |',
 ...inventory.routes.map(e=>`| ${e.route} | ${e.before.questionCounts.titles} → ${e.after.questionCounts.titles} | ${e.before.questionCounts.headings} → ${e.after.questionCounts.headings} | ${e.before.questionCounts.summaries} → ${e.after.questionCounts.summaries} |`)];
for(const {route,before,after} of inventory.routes){
 document.push('',`## ${route}`,'','| Field | Before | After |','| --- | --- | --- |',`| Title | ${safe(before.title)} | ${safe(after.title)} |`);
 const length=Math.max(before.headings.length,after.headings.length);
 for(let i=0;i<length;i++)document.push(`| Heading ${i+1} | ${safe(before.headings[i]?before.headings[i].level+': '+before.headings[i].text:'—')} | ${safe(after.headings[i]?after.headings[i].level+': '+after.headings[i].text:'—')} |`);
 for(let i=0;i<Math.max(before.summaries.length,after.summaries.length);i++)document.push(`| Disclosure summary ${i+1} | ${safe(before.summaries[i]||'—')} | ${safe(after.summaries[i]||'—')} |`);
 document.push(`| Article lead | ${safe(before.articleLead||'—')} | ${safe(after.articleLead||'—')} |`,
  `| Knowledge summary | ${safe(before.knowledgeSummary)} | ${safe(after.knowledgeSummary)} |`,
  `| Shared contact heading | ${safe(before.shared.contactHeading)} | ${safe(after.shared.contactHeading)} |`,
  `| Shared menu introduction | ${safe(before.shared.menuIntro)} | ${safe(after.shared.menuIntro)} |`);
}
writeFileSync(join(destination,'heading-changes.md'),document.join('\n')+'\n');
console.log(`Heading inventory: ${inventory.routes.length} routes, baseline ${baselineCommit}; saved to ${destination}.`);
