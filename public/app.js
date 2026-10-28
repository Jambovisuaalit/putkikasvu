const tabs = [...document.querySelectorAll('[role="tab"]')];
const panel = document.getElementById('demo-panel');
const demos = {
 home: '<span class="demo-kicker">LVI ESIMERKKI / UUSIMAA</span><h3>Luotettava tekijä<br>putkitöillesi.</h3><p>Putkiasennukset, LVI-huollot ja kylpyhuoneen putkityöt. Kerro tarpeestasi, niin suunnitellaan seuraava askel.</p><div class="sample-service"><span>Asennukset & huollot</span><span aria-hidden="true">↗</span></div><div class="sample-service"><span>Remonttien putkityöt</span><span aria-hidden="true">↗</span></div>',
 services: '<span class="demo-kicker">LVI ESIMERKKI / PALVELUT</span><h3>Oikea apu<br>omaan tarpeeseesi.</h3><p>Selkeä palvelukuvaus kertoo asiakkaalle, millaisissa töissä yrityksesi auttaa.</p><div class="sample-service"><span>Vesi- ja viemäriasennukset</span><span aria-hidden="true">01</span></div><div class="sample-service"><span>LVI-laitteiden huollot</span><span aria-hidden="true">02</span></div><div class="sample-service"><span>Remonttien putkityöt</span><span aria-hidden="true">03</span></div>',
 contact: '<span class="demo-kicker">LVI ESIMERKKI / YHTEYSTIEDOT</span><h3>Kerro, mitä<br>pitäisi tehdä.</h3><p>Yhteydenotto suoraan yrittäjälle. Tähän tulevat yrityksesi oikeat yhteystiedot ja toiminta-alue.</p><div class="sample-service"><span>Puhelinnumerosi / Soita-painike</span><span aria-hidden="true">↗</span></div><div class="sample-service"><span>Yrityksesi sähköpostiosoite</span><span aria-hidden="true">↗</span></div><div class="sample-service"><span>Toiminta-alue: Uusimaa</span></div>'
};
function selectTab(tab, focus = false) {
 tabs.forEach(t => { const selected = t === tab; t.setAttribute('aria-selected', String(selected)); t.tabIndex = selected ? 0 : -1; });
 panel.innerHTML = demos[tab.dataset.demo];
 panel.setAttribute('aria-labelledby', tab.id);
 if (focus) tab.focus();
}
tabs.forEach((tab, i) => {
 tab.addEventListener('click', () => selectTab(tab));
 tab.addEventListener('keydown', event => {
  const index = event.key === 'ArrowRight' ? (i + 1) % tabs.length : event.key === 'ArrowLeft' ? (i + tabs.length - 1) % tabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : null;
  if (index !== null) { event.preventDefault(); selectTab(tabs[index], true); }
 });
});

const inquiryForm = document.getElementById('inquiry-form');
if (inquiryForm) {
 const submitButton = document.getElementById('inquiry-submit');
 const status = document.getElementById('inquiry-status');
 let requestId = crypto.randomUUID();
 let lastPayload = '';
 let pending = false;
 function showStatus(message, state) { status.textContent = message; status.dataset.state = state; }
 inquiryForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (pending || !inquiryForm.reportValidity()) return;
  const values = Object.fromEntries(new FormData(inquiryForm));
  const signature = JSON.stringify(values);
  if (lastPayload && lastPayload !== signature) requestId = crypto.randomUUID();
  lastPayload = signature;
  pending = true; submitButton.disabled = true; inquiryForm.setAttribute('aria-busy','true');
  showStatus('Lähetetään tarjouspyyntöä…','pending');
  try {
   const response = await fetch('/api/tarjous',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...values,requestId}),signal:AbortSignal.timeout(20000)});
   const result = await response.json().catch(()=>null);
   if (!response.ok || result?.ok !== true) throw new Error(result?.error || 'Lähetys ei onnistunut. Yritä uudelleen tai ota yhteyttä osoitteeseen jami@putkikasvu.fi.');
   inquiryForm.reset(); requestId = crypto.randomUUID(); lastPayload = '';
   showStatus('Kiitos! Tarjouspyyntösi on lähetetty. Jami ottaa sinuun yhteyttä antamillasi yhteystiedoilla.','success');
  } catch(error) {
   showStatus(error.name === 'TimeoutError' ? 'Lähetyksen vahvistaminen kesti liian kauan. Voit yrittää uudelleen samoilla tiedoilla tai lähettää sähköpostin osoitteeseen jami@putkikasvu.fi.' : error.message || 'Verkkoyhteydessä tapahtui virhe. Yritä uudelleen tai lähetä sähköpostia osoitteeseen jami@putkikasvu.fi.','error');
  } finally { pending = false; submitButton.disabled = false; inquiryForm.removeAttribute('aria-busy'); status.focus(); }
 });
}
