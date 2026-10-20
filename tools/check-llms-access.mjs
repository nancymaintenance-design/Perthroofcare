import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {load} from 'cheerio';
import {createLlmsGuide} from './build-llms-guide.mjs';
import {assessLlmsResponses} from './llms-response-check.mjs';

const candidate=createLlmsGuide('public');
const normalize=value=>value.replace(/\s+/gu,' ').trim();
const digest=value=>createHash('sha256').update(value).digest('hex');
const report={checkedAt:new Date().toISOString(),origin:candidate.origin,branchPublication:'local candidate; this script does not deploy',candidatePublished:null,selected:[],excluded:candidate.excluded,simulations:[],resources:[],issues:[],limitations:['Simulated User-Agent requests are not authenticated bot visits','No proof of indexing, ranking or AI citation','WAF policy and server access logs not changed or authenticated','New llms candidate is not assumed published']};
async function get(url,headers={}){
 for(let attempt=1;attempt<=2;attempt++){
  try{
   const response=await fetch(url,{headers,signal:AbortSignal.timeout(15000),redirect:'follow'});
   const body=new TextDecoder('utf-8',{fatal:true}).decode(await response.arrayBuffer());
   return {requestedUrl:url,finalUrl:response.url,status:response.status,type:response.headers.get('content-type'),xRobots:response.headers.get('x-robots-tag'),mitigation:response.headers.get('x-vercel-mitigated')||response.headers.get('cf-mitigated'),body,attempt};
  }catch(error){if(attempt===2)return {requestedUrl:url,networkError:error.message,classification:'unverified network/decoding failure, not a website 404',attempt};}
 }
}
function pageResult(response,expected){
 if(response.networkError)return {valid:false,issues:[response.classification]};
 const $=load(response.body),body=normalize($('main').text());
 const noindex=/noindex|\bnone\b/i.test([response.xRobots,$('meta[name="robots"],meta[name="googlebot"]').map((_,e)=>$(e).attr('content')).get().join(',')].join(','));
 const issues=[];
 if(response.status!==200)issues.push('HTTP '+response.status);
 if(response.finalUrl!==expected.url)issues.push('final URL differs from selected canonical');
 if(!response.type?.startsWith('text/html'))issues.push('not HTML');
 if(response.mitigation)issues.push('CDN mitigation signal: '+response.mitigation);
 if(body.length<250)issues.push('initial HTML main body not substantively readable');
 if($('html').attr('lang')!==expected.language)issues.push('wrong language');
 if($('link[rel="canonical"]').attr('href')!==expected.url)issues.push('canonical mismatch');
 for(const [language,url] of [[expected.language,expected.url],[expected.language==='en-AU'?'zh-Hans':'en-AU',expected.counterpart]])if($(`link[hreflang="${language}"]`).attr('href')!==url)issues.push('hreflang mismatch: '+language);
 if(noindex)issues.push('noindex');
 if(!body.includes(expected.summary))issues.push('selected summary not present in published body');
 return {valid:issues.length===0,issues,language:$('html').attr('lang'),canonical:$('link[rel="canonical"]').attr('href'),noindex,mainCharacters:body.length,summaryMatches:body.includes(expected.summary),hreflang:$('link[hreflang]').map((_,e)=>({language:$(e).attr('hreflang'),url:$(e).attr('href')})).get()};
}
async function queue(items,run){let next=0;await Promise.all(Array.from({length:2},async()=>{while(next<items.length)await run(items[next++]);}));}
await queue(candidate.selected,async item=>{
 const response=await get(item.url),result=pageResult(response,item);
 const {body,...transport}=response;
 report.selected.push({...item,incomingCount:item.incoming.length,incoming:item.incoming.slice(0,3),...transport,...result});
 if(!result.valid)report.issues.push({url:item.url,issues:result.issues});
});
const llmsResponses=[];
for(const language of ['en-AU','zh-CN']){
 const response=await get(candidate.origin+'/llms.txt',{'accept-language':language});
 const {body,...transport}=response;
 const valid=!response.networkError&&response.status===200&&response.finalUrl===candidate.origin+'/llms.txt'&&/^text\/plain;.*charset=utf-8/i.test(response.type||'')&&/^# .+/m.test(body||'')&&!/<html|<!doctype|captcha/i.test(body||'');
 report.resources.push({...transport,acceptLanguage:language,valid,bodyHash:body?digest(body):null,candidateMatches:body===candidate.markdown});llmsResponses.push(body);
 if(!valid)report.issues.push({url:response.requestedUrl,issues:['live llms GET is not valid UTF-8 Markdown or network test unverified']});
}
const llmsAssessment=assessLlmsResponses(llmsResponses,candidate.markdown);
report.liveLlmsIndependentOfAcceptLanguage=llmsAssessment.independentOfAcceptLanguage;
report.candidatePublished=llmsAssessment.candidatePublished;
if(llmsAssessment.issues.length)report.issues.push({url:candidate.origin+'/llms.txt',issues:llmsAssessment.issues});
for(const path of ['/robots.txt','/sitemap.xml']){
 const response=await get(candidate.origin+path),{body,...transport}=response;
 const expected=readFileSync(join('public',path),'utf8'),matches=body===expected;
 report.resources.push({...transport,matchesLocalPolicy:matches});
 if(response.status!==200||!matches)report.issues.push({url:response.requestedUrl,issues:['policy/sitemap differs or network test unverified; manual review, no automatic fix']});
 if(path==='/robots.txt')report.robots={body,unchanged:matches,interpretation:body===`User-agent: *\nAllow: /\nSitemap: ${candidate.origin}/sitemap.xml\n`?'Wildcard Allow applies to listed search, user-fetch and training agents; no specific groups. Existing policy retained.':'Inspect actual groups manually; no bot permissions inferred by this checker.'};
}
const searchAgents=['Googlebot','OAI-SearchBot','Claude-SearchBot','PerplexityBot'];
const userAgents=['ChatGPT-User','Claude-User','Perplexity-User'];
const jobs=[...searchAgents.flatMap(agent=>['/roof-leak-repairs/','/zh/roof-leak-repairs/'].map(path=>({agent,path,purpose:'search simulation'}))),...userAgents.map(agent=>({agent,path:'/zh/contact/',purpose:'user-triggered fetch simulation'}))];
await queue(jobs,async ({agent,path,purpose})=>{
 const expected=candidate.selected.find(item=>item.url===candidate.origin+path);
 const response=await get(expected.url,{'user-agent':agent}),{body,...transport}=response,result=pageResult(response,expected);
 report.simulations.push({agent,purpose,authenticatedBot:false,...transport,...result});
 if(!result.valid)report.issues.push({url:expected.url,agent,issues:result.issues});
});
report.selected.sort((a,b)=>a.url.localeCompare(b.url));
report.result=report.issues.length?'REVIEW REQUIRED':'PASS: selected public pages and current live resources; '+llmsAssessment.publicationStatus;
console.log(JSON.stringify(report,null,2));
if(report.issues.length)process.exitCode=1;
