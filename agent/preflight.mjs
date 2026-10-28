// This process never prints the secret values or calls external APIs.
export function inspectCredentials(env={}) {
  const missing=['PK_GOOGLE_SERVICE_ACCOUNT_JSON','PK_RESEND_READ_API_KEY'].filter(k=>!env[k]);
  if(missing.length) return {ready:false,missing,reason:'MISSING_ENVIRONMENT_SECRETS'};
  try{
    const sa=JSON.parse(env.PK_GOOGLE_SERVICE_ACCOUNT_JSON);
    if(!String(sa.client_email??'').endsWith('.gserviceaccount.com') ||
      !String(sa.private_key??'').includes('BEGIN PRIVATE KEY'))
      return {ready:false,missing:[],reason:'INVALID_GOOGLE_SERVICE_ACCOUNT'};
  }catch{return {ready:false,missing:[],reason:'INVALID_GOOGLE_SERVICE_ACCOUNT'}}
  if(!/^re_[a-z0-9_-]+$/i.test(env.PK_RESEND_READ_API_KEY))
    return {ready:false,missing:[],reason:'INVALID_RESEND_KEY_FORMAT'};
  return {ready:true,missing:[],reason:'CREDENTIAL_FORMAT_READY_ONLY'};
}
if(process.argv[1] && import.meta.url===new URL('file://'+process.argv[1]).href){
  const result=inspectCredentials(process.env);
  console.log(JSON.stringify(result));
  if(!result.ready) process.exitCode=1;
}
