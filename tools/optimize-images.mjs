import { existsSync, readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs';
import { join, basename, extname } from 'node:path';
import sharp from 'sharp';
import { load } from 'cheerio';

export async function optimizeImages(root) {
  const routes=[...readFileSync(join(root,'sitemap.xml'),'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname.replace(/^\/|\/$/g,''));
  const cache=join(root,'.image-cache');mkdirSync(cache,{recursive:true});
  const manifestFile=join(cache,'manifest.json');
  const manifest=existsSync(manifestFile)?JSON.parse(readFileSync(manifestFile,'utf8')):{};
  const css=['site.css','brand-hero.css','refinement.css'].map(f=>readFileSync(join(root,f),'utf8')).join('\n');
  const documents=routes.map(route=>({route,html:readFileSync(join(root,route,'index.html'),'utf8')}));
  const smallAssets=new Set(['ellis-logo.png','instagram-icon.png']);
  const assets=new Set([...`${css}\n${documents.map(x=>x.html).join('\n')}`.matchAll(/\/assets\/images\/([\w-]+\.(?:png|jpe?g))/g)].map(m=>m[1]).filter(f=>smallAssets.has(f)||!/(?:icon|logo|favicon)/.test(f)));
  let originalBytes=0,optimizedBytes=0;
  for(const name of assets){
    const file=join(root,name);if(!existsSync(file))throw new Error(`Missing image: ${name}`);
    const small=smallAssets.has(name),maxWidth=small?128:1920;
    const stamp=`${statSync(file).size}:${statSync(file).mtimeMs}:webp82-v2-${maxWidth}`;
    let record=manifest[name];
    if(record?.stamp!==stamp||record.variants.some(v=>!existsSync(join(cache,v.file)))){
      const metadata=await sharp(file).metadata();const widths=(small?[64,128]:[400,640,800,1280,1920]).filter(w=>w<metadata.width);widths.push(Math.min(metadata.width,maxWidth));
      const variants=[];
      for(const width of [...new Set(widths)]){
        const output=`${basename(name,extname(name))}-${width}.webp`;
        await sharp(file).rotate().resize({width,withoutEnlargement:true}).webp({quality:82,effort:4}).toFile(join(cache,output));
        variants.push({file:output,width,bytes:statSync(join(cache,output)).size});
      }
      record=manifest[name]={stamp,width:metadata.width,height:metadata.height,variants};
    }
    originalBytes+=statSync(file).size;optimizedBytes+=record.variants.find(v=>v.width>=1280)?.bytes||record.variants.at(-1).bytes;
  }
  writeFileSync(manifestFile,JSON.stringify(manifest,null,2));
  const bgRules=[];
  for(const {route,html} of documents){
    const $=load(html,{xml:{xmlMode:false,decodeEntities:false}});
    $('img').each((_,el)=>{
      const img=$(el),name=basename(img.attr('src')||''),record=manifest[name];if(!record)return;
      img.attr('width',record.width).attr('height',record.height).attr('srcset',record.variants.map(v=>`/assets/images/${v.file} ${v.width}w`).join(', ')).attr('sizes',img.hasClass('service-card-photo')?'(max-width: 600px) calc(100vw - 40px), (max-width: 960px) 45vw, 380px':'(max-width: 600px) calc(100vw - 40px), (max-width: 960px) 45vw, 620px');
      if(smallAssets.has(name)){
        img.attr('src',`/assets/images/${record.variants[0].file}`).attr('sizes',name==='ellis-logo.png'?'48px':'16px').attr('decoding','async');
      }else if(!img.attr('loading'))img.attr('loading','lazy');
      if(img.closest('.home-proof-sequence').length)img.attr('sizes','(max-width: 600px) calc((100vw - 52px) / 2), (max-width: 960px) calc((100vw - 64px) / 2), 300px');
      if(img.closest('.guide-photo--full-width').length)img.attr('sizes','(max-width: 960px) calc(100vw - 40px), 840px');
    });
    $('[style*="--service-hero-image"]').each((_,el)=>{
      const node=$(el),style=node.attr('style'),name=style.match(/\/assets\/images\/([\w.-]+)/)?.[1],record=manifest[name];if(!record)return;
      const selector=`.service-hero[style*="${name}"]`;
      const largest=record.variants.at(-1),small=record.variants.find(v=>v.width>=640)||largest;
      bgRules.push(`${selector}{--service-hero-image:url('/assets/images/${largest.file}')!important}@media(max-width:600px){${selector}{--service-hero-image:url('/assets/images/${small.file}')!important}}`);
      $('head').append(`<link rel="preload" as="image" fetchpriority="high" href="/assets/images/${largest.file}" media="(min-width:601px)"><link rel="preload" as="image" fetchpriority="high" href="/assets/images/${small.file}" media="(max-width:600px)">`);
    });
    if(route===''){
      $('link[rel="preload"][as="image"][href="/assets/images/hero-australian-roofer-v2.png"]').remove();
      const rec=manifest['hero-australian-roofer-v2.png'];
      const mobile=rec.variants.find(v=>v.width>=640)||rec.variants.at(-1);
      bgRules.push(`.home-topic-rail.home-hero-backdrop{background-image:url('/assets/images/${rec.variants.at(-1).file}')!important}@media(max-width:600px){.home-topic-rail.home-hero-backdrop{background-image:url('/assets/images/${mobile.file}')!important}}`);
      $('head').append(`<link rel="preload" as="image" fetchpriority="high" href="/assets/images/${rec.variants.at(-1).file}" media="(min-width:601px)"><link rel="preload" as="image" fetchpriority="high" href="/assets/images/${mobile.file}" media="(max-width:600px)">`);
    }
    writeFileSync(join(root,route,'index.html'),$.html());
  }
  writeFileSync(join(root,'responsive-images.css'),[...new Set(bgRules)].join('\n'));
  const report={images:assets.size,originalBytes,optimized1280Bytes:optimizedBytes,reductionPercent:Math.round((1-optimizedBytes/originalBytes)*100),variants:Object.values(manifest).flatMap(r=>r.variants).length};
  writeFileSync(join(cache,'report.json'),JSON.stringify(report,null,2));
  console.log(`Responsive images: ${report.images} originals, ${report.reductionPercent}% smaller at up to 1280px.`);
}
