import { handleInquiry } from '../../../lib/inquiry.mjs';
export const runtime = 'nodejs';
export const maxDuration = 30;
export async function POST(request) {
 return handleInquiry(request, { RESEND_API_KEY: process.env.RESEND_API_KEY });
}
