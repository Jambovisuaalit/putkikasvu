/** Pure correlation and safety rules; no external I/O. */
export function emailAddress(value) {
  return String(value||'').trim().toLowerCase();
}
export function matchesReply(message, recipient, sentMessageId, sentAtMs) {
  if(typeof sentMessageId!=='string'||!/^<[^<>\s]+>$/.test(sentMessageId)) return false;
  const from=emailAddress(message.from);
  if (!from || from!==emailAddress(recipient)) return false;
  if (!Number.isFinite(sentAtMs)||!Number.isFinite(message.receivedAtMs)||message.receivedAtMs<sentAtMs) return false;
  const refs=[...(message.references||[]),message.inReplyTo].filter(Boolean).map(x=>String(x).trim());
  return refs.includes(sentMessageId);
}
export function mergeEvent(current, incoming) {
  const rank={queued:0,sent:1,delivered:2,delivery_delayed:1,bounced:3,failed:3,complained:4};
  if(!(incoming in rank))return current;
  if(!(current in rank))return incoming;
  return rank[incoming]>=rank[current]?incoming:current;
}
export function safeMetrics(metrics) {
  const read=(k)=>Number.isSafeInteger(metrics?.[k])&&metrics[k]>=0?metrics[k]:'Ei saatavilla';
  return {opened:read('opened'),clicked:read('clicked')};
}
export function sheetRowIndex(rows,id){
  if(!id)throw new Error('Missing message id');
  const indexes=rows.flatMap((r,i)=>i>0&&r[2]===id?[i+1]:[]);
  if(indexes.length!==1)throw new Error('CRM message ID missing or duplicated');
  return indexes[0];
}
