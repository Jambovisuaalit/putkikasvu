// Server-only integration. Never import from a Client Component.
// No endpoint is usable before schema review + PK_BACKEND_ENABLED=true.
import { randomBytes } from "node:crypto";

export class ApiProblem extends Error {
 constructor(public status:number, message:string){super(message)}
}
export type Identity = {id:string;email?:string};
export const PRICE_CENTS=59000;
export const INSTALLMENT_CENTS=29500;

export function backendReady() {
 return process.env.PK_BACKEND_ENABLED==="true"
   && !!process.env.PK_SUPABASE_URL
   && !!process.env.PK_SUPABASE_PUBLISHABLE_KEY
   && !!process.env.PK_SUPABASE_SERVICE_ROLE_KEY;
}
function base() {
 if (!backendReady()) throw new ApiProblem(503,"Tallennus ei ole käytössä.");
 const url=process.env.PK_SUPABASE_URL!;
 if(!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/.test(url)) throw new ApiProblem(503,"Tietokannan asetusvirhe.");
 return url.replace(/\/$/,"");
}
export function isUuid(s:unknown):s is string {
 return typeof s==="string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s);
}
export function sameCustomer(orderUserId:string,userId:string) {
 return isUuid(orderUserId) && isUuid(userId) && orderUserId.toLowerCase()===userId.toLowerCase();
}
export function orderReference(){
 return "PK-"+randomBytes(8).toString("hex").toUpperCase();
}
export function textField(value:unknown,name:string,min:number,max:number):string {
 if(typeof value!=="string")throw new ApiProblem(422,name+": virheellinen tyyppi.");
 const v=value.trim().replace(/\s+/g," ");
 if(v.length<min||v.length>max)throw new ApiProblem(422,name+": pituusvirhe.");
 return v;
}
export function validateOnboarding(raw:unknown){
 if(!raw||typeof raw!=="object"||Array.isArray(raw))throw new ApiProblem(422,"Virheellinen lomake.");
 const x=raw as Record<string,unknown>;
 if(!isUuid(x.orderId))throw new ApiProblem(422,"Virheellinen tilaus.");
 const services=x.services;
 if(!Array.isArray(services)||services.length<1||services.length>8)throw new ApiProblem(422,"Ilmoita 1–8 palvelua.");
 return {
  order_id:x.orderId,
  contact_phone:textField(x.phone,"Puhelin",5,40),
  service_area:textField(x.serviceArea,"Toimialue",2,250),
  opening_hours:textField(x.openingHours,"Aukioloajat",2,250),
  services:services.map(v=>textField(v,"Palvelu",2,100)),
  notes: x.notes==null||x.notes===""?"":textField(x.notes,"Lisätiedot",0,1200),
  rights_confirmed:x.rightsConfirmed===true
 };
}
export function validatePayment(raw:unknown){
 if(!raw||typeof raw!=="object"||Array.isArray(raw))throw new ApiProblem(422,"Virheelliset maksutiedot.");
 const x=raw as Record<string,unknown>;
 if(!isUuid(x.orderId))throw new ApiProblem(422,"Virheellinen tilaus.");
 if(x.installment!=="deposit" && x.installment!=="balance")throw new ApiProblem(422,"Virheellinen maksuerä.");
 if(x.grossAmountCents!==INSTALLMENT_CENTS||x.currency!=="EUR")throw new ApiProblem(422,"Maksun bruttohinta tai valuutta ei täsmää.");
 const paidAt=textField(x.paidAt,"Maksupäivä",10,45);
 const date=new Date(paidAt);
 if(!Number.isFinite(date.getTime())||date.getTime()>Date.now()+300000||date.getTime()<Date.now()-366*86400000)throw new ApiProblem(422,"Maksupäivä ei kelpaa.");
 return {
  orderId:x.orderId,
  installment:x.installment as "deposit"|"balance",
  transactionId:textField(x.transactionId,"Revolut-tapahtumatunnus",6,180),
  grossCents:INSTALLMENT_CENTS,
  currency:"EUR",
  evidenceNote:textField(x.evidenceNote,"Tarkastusmerkintä",12,500),
  paidAt:date.toISOString()
 };
}
export async function readLimitedJson(request:Request,limit=8192):Promise<unknown>{
 if(!(request.headers.get("content-type")||"").toLowerCase().includes("application/json"))
  throw new ApiProblem(415,"JSON-pyyntö vaaditaan.");
 const announced=Number(request.headers.get("content-length")||"0");
 if(announced>limit)throw new ApiProblem(413,"Pyyntö on liian suuri.");
 if(!request.body)throw new ApiProblem(400,"Tyhjä pyyntö.");
 const reader=request.body.getReader();const decoder=new TextDecoder();
 let bytes=0, raw="";
 while(true){
  const {done,value}=await reader.read();
  if(done)break;
  bytes+=value.byteLength;
  if(bytes>limit){await reader.cancel();throw new ApiProblem(413,"Pyyntö on liian suuri.");}
  raw+=decoder.decode(value,{stream:true});
 }
 raw+=decoder.decode();
 try{return JSON.parse(raw)}catch{throw new ApiProblem(400,"Virheellinen JSON.");}
}
export async function authenticatedUser(request:Request):Promise<Identity>{
 const match=/^Bearer ([A-Za-z0-9_.-]{20,5000})$/.exec(request.headers.get("authorization")||"");
 if(!match)throw new ApiProblem(401,"Kirjautuminen vaaditaan.");
 const response=await fetch(base()+"/auth/v1/user",{
  headers:{apikey:process.env.PK_SUPABASE_PUBLISHABLE_KEY!,authorization:"Bearer "+match[1]},
  cache:"no-store"
 });
 if(!response.ok)throw new ApiProblem(401,"Istunto ei ole voimassa.");
 const user=await response.json() as {id?:string;email?:string};
 if(!isUuid(user.id))throw new ApiProblem(401,"Istunto ei ole voimassa.");
 return {id:user.id,email:user.email};
}
export async function db(path:string, method="GET", body?:unknown):Promise<unknown>{
 if(!/^pk_[a-z_]+(\?|$)/.test(path)&&!/^rpc\/pk_[a-z_]+$/.test(path))
  throw new ApiProblem(500,"Kielletty tietokantareitti.");
 const response=await fetch(base()+"/rest/v1/"+path,{
  method,cache:"no-store",
  headers:{
   apikey:process.env.PK_SUPABASE_SERVICE_ROLE_KEY!,
   authorization:"Bearer "+process.env.PK_SUPABASE_SERVICE_ROLE_KEY!,
   "content-type":"application/json",
   prefer:method==="POST"?"return=representation,resolution=merge-duplicates":"return=representation"
  },
  body:body===undefined?undefined:JSON.stringify(body)
 });
 if(!response.ok)throw new ApiProblem(503,"Tietokantatoiminto epäonnistui.");
 const raw=await response.text();return raw?JSON.parse(raw):null;
}
export async function findOne(table:"pk_staff"|"pk_orders"|"pk_verified_payments"|"pk_onboarding",params:string){
 const result=await db(table+"?"+params+"&limit=1");
 return Array.isArray(result)?result[0]??null:null;
}
export async function requireStaff(id:string){
 const staff=await findOne("pk_staff","select=user_id&user_id=eq."+encodeURIComponent(id));
 if(!staff)throw new ApiProblem(403,"Ei käsittelijän oikeutta.");
}
export function reply(payload:unknown,status=200){
 return Response.json(payload,{status,headers:{"Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow"}});
}
export function reportError(error:unknown){
 if(error instanceof ApiProblem)return reply({ok:false,error:error.message},error.status);
 return reply({ok:false,error:"Toiminto epäonnistui."},500);
}
