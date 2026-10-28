import {handleFirstPayment} from '../../../../lib/first-payment-handler.mjs';
export const runtime='nodejs';
export const maxDuration=30;
export async function POST(request) {
 return handleFirstPayment(request,{FIRST_PAYMENT_AGENT_TOKEN:process.env.FIRST_PAYMENT_AGENT_TOKEN,FIRST_PAYMENT_SCOPE_JSON:process.env.FIRST_PAYMENT_SCOPE_JSON});
}
