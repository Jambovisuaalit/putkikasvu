const MAX_BODY = 16000;
const rateWindows = new Map();
const WINDOW_MS = 5 * 60 * 1000;
const EMAIL = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
const answer = (status, body, extra = {}) => Response.json(body, { status, headers: { ...headers, ...extra } });
async function readBody(request) {
 if (Number(request.headers.get('content-length')) > MAX_BODY) throw new Error('size');
 const reader = request.body?.getReader();
 if (!reader) throw new Error('body');
 const chunks = []; let length = 0;
 while (true) { const {done,value} = await reader.read(); if(done) break; length += value.byteLength; if(length > MAX_BODY) { await reader.cancel(); throw new Error('size'); } chunks.push(value); }
 const bytes = new Uint8Array(length); let offset = 0;
 for (const chunk of chunks) { bytes.set(chunk,offset); offset += chunk.byteLength; }
 return JSON.parse(new TextDecoder().decode(bytes));
}
function allowRequest(key) {
 const now = Date.now();
 for (const [id,entry] of rateWindows) if(entry.until <= now) rateWindows.delete(id);
 let entry = rateWindows.get(key);
 if(!entry) { if(rateWindows.size >= 5000) return false; entry = {count:0,until:now+WINDOW_MS}; rateWindows.set(key,entry); }
 return ++entry.count <= 5;
}
export async function handleInquiry(request, env, send = fetch) {
 if(request.method !== 'POST') return answer(405,{error:'Käytä lomakkeen Lähetä-painiketta.'},{Allow:'POST'});
 const origin = request.headers.get('origin');
 if (!origin || origin !== new URL(request.url).origin) return answer(403,{error:'Lähetä viesti tämän sivuston lomakkeella.'});
 if(!(request.headers.get('content-type') || '').toLowerCase().startsWith('application/json')) return answer(415,{error:'Virheellinen lähetysmuoto.'});
 let data;
 try { data = await readBody(request); } catch { return answer(400,{error:'Viesti on virheellinen tai liian pitkä.'}); }
 if(!data || typeof data !== 'object' || Array.isArray(data)) return answer(400,{error:'Tarkista lomakkeen tiedot.'});
 const {name,contact,message,website,requestId} = data;
 if(typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 120 || /[\r\n\x00-\x1f]/.test(name)) return answer(400,{error:'Anna nimi (2–120 merkkiä).'});
 if(typeof contact !== 'string' || contact.trim().length > 200 || /[\r\n\x00-\x1f]/.test(contact)) return answer(400,{error:'Anna kelvollinen sähköpostiosoite tai puhelinnumero.'});
 const cleanContact = contact.trim();
 const isEmail = EMAIL.test(cleanContact);
 const digits = cleanContact.replace(/\D/g,'');
 if(!isEmail && !(/^[+\d\s().-]+$/.test(cleanContact) && digits.length >= 6 && digits.length <= 18)) return answer(400,{error:'Anna sähköpostiosoite tai puhelinnumero, josta sinut tavoittaa.'});
 if(typeof message !== 'string' || message.trim().length < 10 || message.trim().length > 4000 || /\x00/.test(message)) return answer(400,{error:'Kirjoita viesti (10–4000 merkkiä).'});
 if(typeof requestId !== 'string' || !UUID.test(requestId)) return answer(400,{error:'Päivitä sivu ja yritä uudelleen.'});
 if(website !== undefined && website !== '') return answer(400,{error:'Lähetystä ei voitu käsitellä. Ota yhteyttä sähköpostilla.'});
 if(!env.RESEND_API_KEY) return answer(503,{error:'Lomakkeen lähetys on hetkellisesti poissa käytöstä. Lähetä viesti osoitteeseen jami@putkikasvu.fi.'});
 const client = request.headers.get('x-vercel-forwarded-for')?.split(',')[0].trim() || request.headers.get('cf-connecting-ip') || 'local';
 if(!allowRequest(client)) return answer(429,{error:'Olet lähettänyt useita pyyntöjä. Odota viisi minuuttia tai ota yhteyttä sähköpostilla.'},{'Retry-After':'300'});
 const text = `Uusi tarjouspyyntö PutkiKasvun verkkosivustolta\n\nNimi: ${name.trim()}\nYhteystiedot: ${cleanContact}\n\nViesti:\n${message.trim()}\n\nPalvelu: PutkiKasvu Standard, 590 €\nTämä on yhteydenottopyyntö, ei tilaus.\n`;
 const payload = {from:'PutkiKasvu <lomake@putkikasvu.fi>',to:['jami@putkikasvu.fi'],subject:'Uusi tarjouspyyntö — PutkiKasvu',text,...(isEmail ? {reply_to:cleanContact} : {})};
 try {
  const result = await send('https://api.resend.com/emails',{method:'POST',headers:{'Authorization':`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':`putkikasvu-inquiry/${requestId}`},body:JSON.stringify(payload),signal:AbortSignal.timeout(15000)});
  const receipt = await result.json().catch(()=>null);
  if(!result.ok || typeof receipt?.id !== 'string') return answer(502,{error:'Sähköpostipalvelu ei vahvistanut lähetystä. Yritä uudelleen tai kirjoita osoitteeseen jami@putkikasvu.fi.'});
  return answer(200,{ok:true});
 } catch { return answer(502,{error:'Lähetyksen vahvistaminen ei onnistunut. Voit yrittää uudelleen samoilla tiedoilla tai ottaa yhteyttä sähköpostilla.'}); }
}
