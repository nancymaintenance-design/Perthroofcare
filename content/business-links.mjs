// Business destinations supplied by the owner, 2026-10-10.
export const facebookUrl='https://www.facebook.com/p/Ellis-Services-Group-100082926022259/';
export const linkedinUrl='https://www.linkedin.com/in/ellis-services-group-091541266/?isSelfProfile=false';
export const googleMapsUrl='https://maps.app.goo.gl/tQ7R9WdBLQYWrvSV6';
export const instagramUrl='https://www.instagram.com/elliservices_group/';
export const sameAs=[instagramUrl,facebookUrl,linkedinUrl];
// Owner confirmed the Perth team and actual office belong to the group.
export const localTeamIdentity='Perth Roof Care is operated by Ellis Services Group Pty Ltd. Our Perth-based team serves local properties from our office at 140 St Georges Terrace, Perth WA 6000.';
export const groupIdentifiers=[
  {'@type':'PropertyValue',propertyID:'ABN',value:'96645821745'},
  {'@type':'PropertyValue',propertyID:'ACN',value:'645821745'}
];
// Owner-confirmed regular hours, 2026-10-10; local time at the Perth business.
export const businessHoursText='Opening hours: Monday–Sunday, 9am–9pm (Perth local time).';
export const openingHoursSpecification=[{
  '@type':'OpeningHoursSpecification',
  dayOfWeek:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(day=>`https://schema.org/${day}`),
  opens:'09:00',closes:'21:00'
}];
