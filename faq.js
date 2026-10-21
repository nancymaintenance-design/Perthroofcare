// Progressive enhancement: without JavaScript every category and anchor stays readable.
(() => {
 const page=document.querySelector('.faq-page');
 if(!page)return;
 const groups=[...page.querySelectorAll('.faq-category')];
 const links=[...page.querySelectorAll('.faq-topic-nav a')];
 const form=page.querySelector('.faq-search');
 const input=form.querySelector('input');
 const clear=form.querySelector('.faq-clear');
 const status=page.querySelector('.faq-search-status');
 const topics=document.createElement('select');topics.className='faq-mobile-topics';
 topics.setAttribute('aria-label',page.querySelector('.faq-topic-nav').getAttribute('aria-label'));
 for(const link of links){const option=document.createElement('option');option.value=link.hash.slice(1);option.textContent=link.textContent.replace(/(\D)(\d+)$/,'$1 ($2)');topics.append(option);}
 page.querySelector('.faq-topic-heading').after(topics);
 const zh=document.documentElement.lang.startsWith('zh');
 const normalize=text=>text.normalize('NFKC').toLocaleLowerCase().replace(/\s+/g,' ').trim();
 const entries=groups.flatMap(group=>[...group.querySelectorAll('details')].map(detail=>({group,detail,text:normalize(detail.textContent)})));
 groups.forEach(group=>{const count=document.createElement('span');count.className='faq-group-count';count.textContent=zh?`（${group.querySelectorAll('details').length} 个问题）`:` (${group.querySelectorAll('details').length} questions)`;group.querySelector('h2').append(count);});
 entries[0].detail.open=true;
 let selected=groups[0].id;
 const show=()=>{
  const query=normalize(input.value),terms=query.split(' ').filter(Boolean);
  let count=0;
  for(const {group,detail,text} of entries){const match=terms.every(term=>text.includes(term));detail.hidden=query?!match:false;if(match&&(query||group.id===selected))count++;}
  for(const group of groups)group.hidden=query?!entries.some(e=>e.group===group&&!e.detail.hidden):group.id!==selected;
  for(const link of links){if(!query&&link.hash==='#'+selected)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');}
  clear.hidden=!query;status.hidden=!query;
  topics.value=selected;
  status.textContent=query?(count?(zh?`找到 ${count} 个相关问题`:`${count} matching questions`):(zh?'没有找到相关问题。请尝试其他关键词，或清除搜索后按分类浏览。':'No matching questions. Try another keyword or clear the search to browse by topic.')):'';
 };
 const revealHash=()=>{
  let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return false;}
  const target=document.getElementById(id),group=target?.closest('.faq-category');
  if(!group)return false;
  selected=group.id;input.value='';show();
  const detail=target.closest('details');if(detail)detail.open=true;
  target.scrollIntoView({block:'start'});return true;
 };
 links.forEach(link=>link.addEventListener('click',event=>{
  if(event.button||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  event.preventDefault();selected=link.hash.slice(1);input.value='';show();history.pushState(null,'',link.hash);
 }));
 form.hidden=false;
 topics.addEventListener('change',()=>{selected=topics.value;input.value='';show();history.pushState(null,'','#'+selected);});
 input.addEventListener('input',show);
 form.addEventListener('submit',event=>{event.preventDefault();show();});
 clear.addEventListener('click',()=>{input.value='';show();input.focus();});
 window.addEventListener('hashchange',()=>{if(!revealHash()){selected=groups[0].id;input.value='';show();}});
 window.addEventListener('popstate',()=>{if(!revealHash()){selected=groups[0].id;input.value='';show();}});
 show();revealHash();
})();
