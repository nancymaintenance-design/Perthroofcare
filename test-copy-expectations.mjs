// Reviewed exceptions to historical verbatim-copy fixtures. This is an explicit
// test expectation list, not the production cleanup implementation.
import {readFileSync} from 'node:fs';
const ownerEdits=JSON.parse(readFileSync(new URL('./content/owner-copy-data.json',import.meta.url),'utf8'));
export function reviewedOwnerCopy(value){
 // Collapse only the individually reviewed variants for historical preservation
 // checks. Production output/meaning are independently tested in owner-copy.test.
 for(const edit of ownerEdits)if(!value.includes(edit.before))value=value.replaceAll(edit.after,edit.before);
 for(const edit of ownerEdits)value=value.replaceAll(edit.before,edit.after);
 return value;
}
export function approvedCopy(value){
 value=reviewedOwnerCopy(value);
 if(value.startsWith('The linked photograph record illustrates relevant roof components; it is not evidence of a completed job in '))return '';
 for(const sentence of [
  'A material name does not imply manufacturer authorisation or a universal repair method.',
  'This website does not publish a universal inspection fee or assume that every inspection is free.',
  'Maintenance does not guarantee that a roof will remain leak-free in every future weather event.',
  'Maintenance cannot guarantee that a roof will never leak.',
  'A roof assessment is not automatically a whole-building, engineering or insurance report.',
  'A roof condition inspection is not automatically a pre-purchase building inspection, structural assessment or insurance report.',
  'This website does not publish a universal rate; ask for the property-specific work items in writing.',
  'General guide imagery illustrates materials and components; it is not evidence of a job at your property.',
  'It provides a useful example of related work items; it does not establish a fixed maintenance interval or a universal checklist for every building.'
 ])value=value.replaceAll(sentence,'');
 return reviewedOwnerCopy(value.replace('; it does not establish that the same approach, cost or outcome will apply elsewhere.','.').replace('; this guide does not establish a standard warranty.','.').replace('; a suburb name does not establish its material, exposure or maintenance interval.','.').replace(/\s+/g,' ').trim());
}
