import {authenticatedUser,backendReady,db,findOne,readLimitedJson,reply,reportError,sameCustomer,validateOnboarding} from "../../../lib/server/secure-orders";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function POST(request:Request){
 try{
  if(!backendReady())return reply({ok:false,error:"Asiakastallennus ei ole aktivoitu."},503);
  const user=await authenticatedUser(request);
  const form=validateOnboarding(await readLimitedJson(request));
  const id=encodeURIComponent(form.order_id);
  const order=await findOne("pk_orders","select=id,customer_user_id&id=eq."+id) as {id:string;customer_user_id:string}|null;
  if(!order||!sameCustomer(order.customer_user_id,user.id))return reply({ok:false,error:"Tilausta ei löytynyt."},404);
  const deposit=await findOne("pk_verified_payments","select=id&order_id=eq."+id+"&installment=eq.deposit");
  if(!deposit)return reply({ok:false,error:"Ennakkomaksua ei ole vahvistettu."},409);
  const balance=await findOne("pk_verified_payments","select=id&order_id=eq."+id+"&installment=eq.balance");
  if(balance)return reply({ok:false,error:"Tilauksen tietoja ei voi muuttaa loppumaksun jälkeen."},409);
  await db("pk_onboarding?on_conflict=order_id","POST",{
    ...form,customer_user_id:user.id,updated_at:new Date().toISOString()
  });
  return reply({ok:true,orderId:form.order_id,status:"submitted"});
 }catch(error){return reportError(error)}
}
