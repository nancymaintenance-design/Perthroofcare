import { createHash } from 'node:crypto';
import { load } from 'cheerio';

export const HUMAN_ATTRIBUTES = Object.freeze(['alt', 'aria-label', 'aria-description', 'aria-valuetext', 'placeholder', 'title', 'label']);
export const NEUTRAL_RULES = Object.freeze({
  properNames: ['Ellis Services Group', 'Ellis Services Group Pty Ltd', 'Perth Roof Care', 'ELLIS', 'SERVICES GROUP', 'Instagram', 'Facebook', 'LinkedIn', 'Google Maps', 'ABN', 'ACN'],
  excludedElements: ['script', 'style', 'code', 'pre', 'kbd', 'samp'],
  structuralJsonKeys: ['@context', '@type', 'schemaVersion', 'pageType', 'inLanguage', 'legalName', 'telephone', 'email', 'officeAddress', 'streetAddress', 'addressLocality', 'addressRegion', 'addressCountry', 'postalCode', 'propertyID', 'value', 'datePublished', 'dateModified', 'dateCreated', 'uploadDate', 'opens', 'closes', 'dayOfWeek', 'encodingFormat', 'fileFormat'],
  structuralMetadata: ['viewport', 'charset', 'robots', 'googlebot', 'bingbot', 'theme-color', 'color-scheme', 'referrer', 'format-detection', 'generator', 'twitter:card', 'og:type', 'og:locale', 'og:locale:alternate', 'og:image:width', 'og:image:height', 'og:image:type', 'article:published_time', 'article:modified_time', 'article:author'],
  policy: 'Exact business/social proper names, formal postal-address components, raw contacts, URLs, numbers, identifiers and dates/times pass through. Place names in City/Place/AdministrativeArea/Country name fields remain recognizable. Every other readable JSON string and HTML text/accessible attribute/metadata content requires a dictionary entry. Code blocks are excluded; noscript content is included.',
});
const properNames = new Set(NEUTRAL_RULES.properNames.map(value=>value.toLowerCase()));
const structuralKeys = new Set(NEUTRAL_RULES.structuralJsonKeys);
const structuralMetadata = new Set(NEUTRAL_RULES.structuralMetadata);
const excludedElements = new Set(NEUTRAL_RULES.excludedElements);

export function normalizeSource(source) {
  return String(source).normalize('NFC').replace(/\s+/gu, ' ').trim();
}

export function sourceId(source) {
  return createHash('sha256').update(normalizeSource(source), 'utf8').digest('hex').slice(0,20);
}

export function addCatalogString(strings, source) {
  const normalized = normalizeSource(source);
  const id = sourceId(normalized);
  if (strings.has(id) && strings.get(id) !== normalized) throw new Error(`Translation source hash collision: ${id}`);
  strings.set(id, normalized);
  return id;
}

export function neutralReason(source) {
  const value = normalizeSource(source);
  if (!value) return 'empty';
  if (properNames.has(value.toLowerCase())) return 'proper-name';
  if (/^(?:https?:\/\/|\/|#|mailto:|tel:|data:)\S*$/i.test(value) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'url-or-contact';
  if (/^(?:[·|,;\s]*140 St Georges Terrace(?:,? Perth(?: WA)?(?: 6000)?)?)[·|,;\s]*$/i.test(value)) return 'postal-address';
  if (/^(?:ABN|ACN)\s*[:：]?\s*[\d\s]+$/i.test(value)) return 'business-identifier';
  if (/^\d{4}-\d{2}-\d{2}(?:[T ][\d:.+Z-]+)?$/.test(value) || /^\d{1,2}:\d{2}(?::\d{2})?(?:\s*[ap]m)?$/i.test(value) || /^\d{1,2}\s+(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{4}$/i.test(value)) return 'date-or-time';
  if (!/[\p{L}]/u.test(value)) return 'number-or-symbol';
  return null;
}

function locationFor(node) {
  const parts=[];
  for(let current=node;current?.type!=='root'&&current;current=current.parent) {
    if (!current.name) continue;
    const index=current.parent?.children?.filter(sibling=>sibling.name===current.name).indexOf(current)??0;
    parts.unshift(`${current.name}${current.attribs?.id?`#${current.attribs.id}`:`[${index+1}]`}`);
  }
  return parts.join('>');
}

// Shared traversal is the coverage contract: extraction and replacement see exactly
// the same slots. JSON is parsed, never translated as raw source or executable code.
export function visitPageStrings($, visitor) {
  const jsonDocuments=[];
  function emit(raw,location,set,reason=neutralReason(raw)) { visitor({source:normalizeSource(raw),raw,location,reason,set}); }
  function jsonWalk(value, path, parent, key, owner, fieldKey=key) {
    if(typeof value==='string') {
      let reason=neutralReason(value);
      if(structuralKeys.has(fieldKey)||fieldKey==='@id'||fieldKey==='identifier') reason='json-structural';
      if(fieldKey==='name'&&['City','Place','AdministrativeArea','Country','State'].includes(owner?.['@type'])) reason='place-name';
      emit(value,`json:${path}`,next=>{parent[key]=next;},reason);
    } else if(Array.isArray(value)) {
      value.forEach((item,index)=>jsonWalk(item,`${path}[${index}]`,value,index,owner,fieldKey));
    } else if(value&&typeof value==='object') {
      for(const [childKey,child] of Object.entries(value)) jsonWalk(child,`${path}.${childKey}`,value,childKey,value);
    }
  }
  function walk(node) {
    if(node.type==='text') {
      emit(node.data,`${locationFor(node.parent)}::text`,next=>{node.data=next;});
      return;
    }
    if(!node.name) { for(const child of node.children??[]) walk(child); return; }
    if(node.attribs?.['data-language-switch']!==undefined) return;
    const tag=node.name.toLowerCase();
    if(tag==='script'&&(node.attribs?.type==='application/ld+json'||(node.attribs?.id==='page-knowledge'&&node.attribs?.type==='application/json'))) {
      let data;
      try { data=JSON.parse($(node).text()); } catch(error) { throw new Error(`Invalid translation JSON in ${locationFor(node)}: ${error.message}`); }
      jsonDocuments.push({node,data});
      jsonWalk(data,locationFor(node),null,null,null);
      return;
    }
    if(excludedElements.has(tag)) return;
    for(const attr of HUMAN_ATTRIBUTES) if(node.attribs?.[attr]!==undefined) emit(node.attribs[attr],`${locationFor(node)}@${attr}`,next=>{node.attribs[attr]=next;});
    if(tag==='input'&&['submit','button','reset'].includes(node.attribs?.type)&&node.attribs?.value) emit(node.attribs.value,`${locationFor(node)}@value`,next=>{node.attribs.value=next;});
    if(tag==='meta'&&node.attribs?.content!==undefined) {
      const name=(node.attribs.name||node.attribs.property||node.attribs['http-equiv']||'').toLowerCase();
      const reason=structuralMetadata.has(name)||name.startsWith('fb:')||name.includes('verification')?'metadata-structural':neutralReason(node.attribs.content);
      emit(node.attribs.content,`${locationFor(node)}@content(${name})`,next=>{node.attribs.content=next;},reason);
    }
    for(const child of node.children??[]) walk(child);
  }
  walk($.root()[0]);
  return jsonDocuments;
}

export function collectPageEntries(html) {
  const $=load(html,{scriptingEnabled:false});
  const entries=[],exclusions=[];
  visitPageStrings($,({source,location,reason})=>{
    if(!source) return;
    if(reason) exclusions.push({source,location,reason});
    else entries.push({id:sourceId(source),source,location});
  });
  return {entries,exclusions};
}

export function collectPageStrings(html) {
  const strings=new Map();
  for(const {source} of collectPageEntries(html).entries) addCatalogString(strings,source);
  return strings;
}
