/**
 * Resend inbound read-only adapter for PR #11 TEST CRM planning.
 * Polling only: no webhook endpoint, email sending, storage or writes.
 * Ignore mail that is not delivered to the exact configured Resend ingress.
 */
import {matchesReply} from './crm-sync-core.mjs';

export const PUTKIKASVU_INGRESS='04687389@pixoosal.resend.app';
const ADDRESS=/^[^\s@<>]+@[^\s@<>]+$/;

export function mailbox(value) {
  const raw=String(value||'').trim();
  const match=raw.match(/<([^<>]+)>$/);
  const addr=(match?match[1]:raw).trim().toLowerCase();
  return ADDRESS.test(addr)?addr:'';
}
function headersValue(headers,name) {
  if(Array.isArray(headers))return headers
    .filter(h=>String(h?.name||'').toLowerCase()===name)
    .map(h=>String(h.value||'')).join(' ');
  if(headers && typeof headers==='object')return Object.entries(headers)
    .filter(([k])=>k.toLowerCase()===name)
    .map(([,v])=>String(v||'')).join(' ');
  return '';
}
export function inboundMetadata(message) {
  const refs=headersValue(message?.headers,'references').match(/<[^<>\s]+>/g)||[];
  return {
    from:mailbox(message?.from),
    receivedAtMs:Date.parse(message?.created_at||''),
    references:refs,
    inReplyTo:headersValue(message?.headers,'in-reply-to').trim(),
  };
}

/**
 * @param {object} options - injected requestJson is the existing worker's provider.
 * @returns {Promise<Array>} only email metadata needed for exact reply correlation.
 * A truncated or malformed provider listing throws rather than implying no replies.
 */
export async function listInboundReplyMetadata({
  requestJson, token, recipients, receivingAddress=PUTKIKASVU_INGRESS, maxPages=5
}) {
  if(mailbox(receivingAddress)!==PUTKIKASVU_INGRESS)
    throw new Error('Unexpected Resend inbound receiving address');
  if(typeof requestJson!=='function')throw new Error('Inbound reader not configured');
  const eligible=new Set([...recipients].map(mailbox).filter(Boolean));
  if(eligible.size===0)return [];
  const output=[],seen=new Set();
  let after;
  for(let page=0;page<maxPages;page++){
    const url=new URL('https://api.resend.com/emails/receiving');
    url.searchParams.set('limit','100');
    if(after)url.searchParams.set('after',after);
    const response=await requestJson(url.toString(),{
      headers:{authorization:'Bearer '+token}
    });
    if(!Array.isArray(response?.data)||typeof response.has_more!=='boolean')
      throw new Error('Unexpected Resend inbound list response');
    for(const entry of response.data){
      if(typeof entry?.id!=='string'||!entry.id)
        throw new Error('Resend inbound entry missing ID');
      if(seen.has(entry.id))continue;
      seen.add(entry.id);
      if(!Array.isArray(entry.to)||
        !entry.to.some(v=>mailbox(v)===receivingAddress)||
        !eligible.has(mailbox(entry.from)))continue;
      const detail=await requestJson(
        'https://api.resend.com/emails/receiving/'+encodeURIComponent(entry.id),
        {headers:{authorization:'Bearer '+token}}
      );
      if(detail?.id!==entry.id || !Array.isArray(detail.to) ||
        !detail.to.some(v=>mailbox(v)===receivingAddress)||
        mailbox(detail.from)!==mailbox(entry.from))
        throw new Error('Resend inbound message metadata mismatch');
      const candidate=inboundMetadata(detail);
      if(Number.isFinite(candidate.receivedAtMs))output.push(candidate);
    }
    if(!response.has_more)return output;
    if(!response.data.length)throw new Error('Resend inbound pagination stopped unexpectedly');
    const next=response.data.at(-1).id;
    if(next===after)throw new Error('Repeated Resend inbound page cursor');
    after=next;
  }
  throw new Error('Resend inbound history incomplete: pagination limit reached');
}
export function matchesInboundReply(message,recipient,originalMessageId,sentAtMs) {
  return matchesReply(message,recipient,originalMessageId,sentAtMs);
}
