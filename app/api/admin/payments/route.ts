import {authenticatedUser,backendReady,db,findOne,readLimitedJson,reply,reportError,requireStaff,validatePayment} from "../../../../lib/server/secure-orders";
export const runtime="nodejs";
export const dynamic="force-dynamic";
/** STRICT MANUAL RECONCILIATION — never verify a payment from browser return URL or receipt screenshot. */
export async function POST(request:Request){
 try{
  if(!backendReady())return reply({ok:false,error:"Maksujen täsmäytys ei ole aktivoitu."},503);
  const staff=await authenticatedUser(request);await requireStaff(staff.id);
  const input=validatePayment(await readLimitedJson(request));
  const order=await findOne("pk_orders","select=id,order_ref&id=eq."+encodeURIComponent(input.orderId)) as {id:string;order_ref:string}|null;
  if(!order)return reply({ok:false,error:"Tilausta ei löydy."},404);
  // Reviewer must verify the order reference and gross sum against Revolut Pro transaction details.
  const rawPayment=await readPaymentReference(request);
  // The external transaction ID is unique across the entire database.
  const result=await db("rpc/pk_confirm_verified_payment","POST",{
   p_order_id:input.orderId,p_installment:input.installment,
   p_transaction_id:input.transactionId,p_gross_cents:input.grossCents,
   p_currency:input.currency,p_staff_id:staff.id,p_evidence_note:input.evidenceNote,
   p_paid_at:input.paidAt
  });
  return reply({ok:true,orderRef:order.order_ref,installment:input.installment,verificationId:result,
   warning:"Merkitty käsin tarkistetuksi. Todellisen tapahtuman todentaminen on käsittelijän vastuulla."});
 }catch(error){return reportError(error)}
}
// Reserved: no use of payment-link URL or redirect parameters as payment evidence.
async function readPaymentReference(_request:Request):Promise<null>{return null}
