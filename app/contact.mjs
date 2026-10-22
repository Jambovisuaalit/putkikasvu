// Centralize the customer-facing contact address, subject and email draft.
// Clicking a mailto: link NEVER sends a message automatically.
export const CONTACT_EMAIL = 'visualjambo@gmail.com';
export const CONTACT_SUBJECT = 'Putkikasvu | Esimerkkisivupyyntö';
export const CONTACT_BODY = [
  'Hei Putkikasvu,',
  '',
  'Haluaisin yritykselleni verkkosivuesimerkin.',
  '',
  'Yritys:',
  'Paikkakunta / palvelualue:',
  'Nykyinen verkkosivu (jos on):',
  'Yhteyshenkilö:',
  'Puhelinnumero (vapaaehtoinen):',
  '',
  'Lisätiedot:',
].join('\n');
export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(CONTACT_SUBJECT)}&body=${encodeURIComponent(CONTACT_BODY)}`;
export const CONTACT_PLAIN_MAILTO = `mailto:${CONTACT_EMAIL}`;
