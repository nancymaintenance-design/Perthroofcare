// Run inspectImageAlignment.toString() through the browser's read-only evaluator.
// Geometry, not intrinsic proportions, is the regression contract for photo grids.
export function inspectImageAlignment(){
 const issues=[];let groups=0,images=0,rows=0;
 const selector='.aligned-photo-grid,.home-proof-sequence,.home-service-map .cards,.case-library-grid,.project-case-grid,[class*="-evidence-grid"]';
 for(const grid of document.querySelectorAll(selector)){
  const photos=Array.from(grid.querySelectorAll('img'));if(photos.length<2)continue;
  groups++;images+=photos.length;const bands=[];
  for(const photo of photos){
   const r=photo.getBoundingClientRect();
   if(r.width<1||r.height<1)issues.push({type:'unreserved-image-frame',src:photo.getAttribute('src')});
   const top=(photo.closest('figure,article')||photo).getBoundingClientRect().top;
   let band=bands.find(b=>Math.abs(b.top-top)<=1);if(!band){band={top,items:[]};bands.push(band);}
   band.items.push({src:photo.getAttribute('src'),top:r.top,width:r.width,height:r.height,bottom:r.bottom});
   if(!['cover','contain'].includes(getComputedStyle(photo).objectFit))issues.push({type:'image-stretch-risk',src:photo.getAttribute('src')});
  }
  rows+=bands.length;
  for(const band of bands){if(band.items.length<2)continue;const first=band.items[0];
   for(const item of band.items.slice(1)){if(['top','width','height','bottom'].some(k=>Math.abs(item[k]-first[k])>1))issues.push({type:'row-misalignment',grid:grid.className,first,item});}
  }
 }
 if(document.documentElement.scrollWidth>innerWidth)issues.push({type:'horizontal-overflow'});
 return {path:location.pathname,groups,images,rows,issues};
}
