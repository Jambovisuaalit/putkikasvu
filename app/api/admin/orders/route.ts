import {randomUUID} from "node:crypto";
import {authenticatedUser,backendReady,db,isUuid,orderReference,readLimitedJson,reply,reportError,requireStaff,textField} from "../../../../lib/server/secure-orders";
export const runtime="nodejs";
export const dynamic="force-dynamic";
/** Requires real staff JWT, not a public demo session. Never inserts mock payments. */
export async function POST(request:Request){
 try{
  if(!backendReady())return reply({ok:false,error:"Tilaustallennus ei ole aktivoitu."},503);
  const staff=await authenticatedUser(request);await requireStaff(staff.id);
  const raw=await readLimitedJson(request);
  if(!raw||typeof raw!=="object"||Array.isArray(raw))return reply({ok:false,error:"Virheellinen pyyntö."},422);
  const x=raw as Record<string,unknown>;
  if(!isUuid(x.customerUserId))return reply({ok:false,error:"Asiakkaalla on oltava Supabase Auth -käyttäjätunnus."},422);
  const company=textField(x.companyName,"Yritys",2,160);
  const acceptanceEvidence=textField(x.acceptanceEvidence,"Tarjouksen hyväksyntätodiste",12,500);
  if(x.termsVersion!=="v1.0")return reply({ok:false,error:"Palveluehtojen versio pitää vahvistaa."},422);
  const orderRef=orderReference();
  const created=await db("pk_orders","POST",{
   id:randomUUID(),order_ref:orderRef,company_name:company,
   customer_user_id:x.customerUserId,accepted_at:new Date().toISOString(),
   terms_version:"v1.0",acceptance_evidence:acceptanceEvidence,
   total_cents:59000,currency:"EUR"
  }) as Array<{id:string;order_ref:string}>;
  return reply({ok:true,orderId:created[0].id,orderRef:created[0].order_ref},201);
 }catch(error){return reportError(error)}
}
