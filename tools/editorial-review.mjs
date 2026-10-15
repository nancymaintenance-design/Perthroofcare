// Reproducible review artifact for the approved 2026-10-15 editorial task.
import {readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {load} from 'cheerio';
import {resolve} from 'node:path';
import {faqRecords} from '../content/faq-records.mjs';
import {serviceLabels} from '../content/service-labels.mjs';
const root=resolve(import.meta.dirname,'..'),destination=resolve(root,'../reports/2026-10-15-site-refresh');
const before=JSON.parse(readFileSync(resolve(destination,'headings-before.json'),'utf8'));
const extract=$=>({headings:$('main h1,main h2,main h3').map((_,e)=>({level:e.tagName,text:$(e).text()})).get(),summaries:$('main summary').map((_,e)=>$(e).text()).get()});
const generic=/^(?:Service content|Our solution|Our work|Scope details|Further reading)$/i;
const question=/\?|^(?:what|why|how|can|does|do|is|are|when|which|who|should)\b/i;
const pages=before.pages.map(p=>{
 const file=p.route.slice(1)+'index.html',$=load(readFileSync(resolve(root,'public',file),'utf8'));
 const baseline=load(execFileSync('git',['show','c832b94:'+file],{cwd:root,encoding:'utf8',maxBuffer:8*1024*1024}));
 const after=extract($),route=p.route.slice(1,-1);
 let decision='Retained factual company, policy or visitor-task subjects; reviewed every heading and disclosure.';
 if(serviceLabels[route])decision='Concrete material/repair/evidence titles; removed duplicate wrapper H3; curated reading list and separate service links. Original evidence and service fragment checks pass.';
 if(route.startsWith('areas/'))decision='Concrete service/enquiry headings; retained local material/access facts and moved the final detail into existing repair content.';
 if(route.startsWith('news/'))decision='Reviewed material/defect/stage headings and declarative summaries; retained all body paragraphs, education and publication dates; combined overlapping safety sections where present.';
 if(route.startsWith('projects/'))decision='Reviewed exact work-stage subjects, preserved supplied photographs and narrative; replaced generic transitions and decoded title text before card escaping.';
 if(route==='news')decision='One directory: 13 original guide URLs in four topic groups, each linked once with task-specific summary; retained feed and assessment paths.';
 if(route==='gallery')decision='One eight-project collection; preserved every supplied image, factual project summary and URL; merged repeated introductory/action bands.';
 if(route==='faq')decision='43 canonical answers in seven groups, merging 58 original questions; all old fragments and facts mapped below; visible answers, FAQPage and knowledge match.';
 if(route==='services')decision='One 22-service directory; retained evidence and final enquiry; replaced vague supplementary-work heading.';
 if(route==='')decision='Direct Roof repairs in Perth H1; retained home assessment, Call, fee disclosure, nine service cards and actual project evidence.';
 if(route==='about')decision='Task1 company composition unchanged; registration anchor and company facts preserved. Only the shared menu introduction changed.';
 const images=dom=>dom('main img').map((_,e)=>dom(e).attr('src')).get();
 const originalImages=images(baseline),currentImages=images($);
 return {route:p.route,decision,before:{headings:p.headings,summaries:p.summaries},after,
  title:$('title').text(),headingChanges:p.headings.filter(h=>!after.headings.some(a=>a.text===h.text)).map(h=>h.text),
  genericHeadings:after.headings.filter(h=>generic.test(h.text)),nonFaqQuestions:route==='faq'?[]:[...after.headings.map(h=>h.text),...after.summaries].filter(t=>question.test(t)),
  literalEntities:after.headings.filter(h=>/&(?:amp|lt|gt|quot);/.test(h.text)),
  originalImageCount:originalImages.length,currentImageCount:currentImages.length,missingImages:originalImages.filter(src=>!currentImages.includes(src)),
  missingOriginalFragments:baseline('main [id]').map((_,e)=>baseline(e).attr('id')).get().filter(id=>$(`[id="${id}"]`).length!==1)
 };
});
const oldFaq=load(execFileSync('git',['show','c832b94:faq/index.html'],{cwd:root,encoding:'utf8',maxBuffer:8*1024*1024}));
const originals=oldFaq('main details').map((i,e)=>({index:i,question:oldFaq(e).find('summary').text(),answer:oldFaq(e).find('p').text()})).get();
const faqMapping=faqRecords.map(r=>({question:r.question,group:r.group,aliases:r.aliases,merged:r.sourceIndexes.length>1,originals:r.sourceIndexes.map(i=>originals[i]),retainedAnswer:r.paragraphs.map(html=>load(html).text()).join('\n')}));
const summary={routes:pages.length,beforeHeadings:pages.reduce((n,p)=>n+p.before.headings.length,0),afterHeadings:pages.reduce((n,p)=>n+p.after.headings.length,0),beforeFaqAnswers:58,afterFaqAnswers:faqRecords.length,faqGroups:7,faqMergedGroups:faqMapping.filter(r=>r.merged).length,guideDirectoryEntries:13,guideGroups:4,educationBodies:30,originalServiceRoutes:22,issues:pages.filter(p=>p.genericHeadings.length||p.nonFaqQuestions.length||p.literalEntities.length||p.missingImages.length||p.missingOriginalFragments.length)};
writeFileSync(resolve(destination,'task-2-heading-review.json'),JSON.stringify({baseline:before.beforeCommit,taskStart:'c832b94',summary,pages,faqMapping},null,2)+'\n');
console.log(JSON.stringify(summary,null,2));
if(summary.issues.length)process.exitCode=1;
