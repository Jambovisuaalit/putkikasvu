import {decide} from './core.mjs';
import {liveSnapshot} from './io.mjs';
const fixture={
  followup:[['Yritys','Vastaanottaja','Myyntivaihe'],['LVI MIKKI Ky','mikki@example.org','VAPAUTETTU – MANUAALINEN SEURANTA / EI LÄHETETTY'],['Lvi-Upp Oy','upp@example.org','VAPAUTETTU – MANUAALINEN SEURANTA / EI LÄHETETTY']],
  blocks:[['Yritys','Status'],['LVI MIKKI Ky','ESTO – AIEMPI KONTAKTI (EI KIELTO)'],['Lvi-Upp Oy','ESTO – AIEMPI KONTAKTI (EI KIELTO)']],
  sent:[['Yritys','To'],['LVI MIKKI Ky','mikki@example.org'],['Lvi-Upp Oy','upp@example.org']],
  received:[],inboundComplete:true,gmailComplete:false
};
async function main(){
  const mode=process.argv[2]??'--fixture';
  if(!['--fixture','--live-read'].includes(mode)) throw Error('Invalid mode');
  const result=decide(mode==='--fixture'?fixture:await liveSnapshot());
  console.log(JSON.stringify({mode,readOnly:true,emailsSent:0,paymentRequests:0,
    companies:result.map(({company,state,reply,reasons,followupDraft,offerDraft})=>({
      company,state,reply,reasons,followupDraftReady:Boolean(followupDraft),offerDraftReady:Boolean(offerDraft)}))},null,2));
}
main().catch(e=>{console.error('First Payment Agent: '+e.message);process.exitCode=1});
