/** Secret-safe prerequisite validation before any outbound provider request. */
export function credentialReadiness(env) {
 const keys=['GOOGLE_SERVICE_ACCOUNT_EMAIL','GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY','RESEND_API_KEY'];
 const source=env.CRM_SYNC_REPLY_SOURCE||'gmail';
 if(source!=='resend')keys.push('GMAIL_REFRESH_TOKEN','GMAIL_CLIENT_ID','GMAIL_CLIENT_SECRET');
 return {ready:keys.every(k=>Boolean(String(env[k]||'').trim())),missing:keys.filter(k=>!String(env[k]||'').trim())};
}
export function assertLiveReadReady(env) {
 const {missing}=credentialReadiness(env);
 if(missing.length)throw new Error('Missing integration environment variables: '+missing.join(', '));
 if(env.CRM_SYNC_WRITE!=='false')throw new Error('CRM_SYNC_WRITE must be false for live read test');
 return true;
}
