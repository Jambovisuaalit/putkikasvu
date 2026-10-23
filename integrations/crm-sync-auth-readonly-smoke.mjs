/**
 * Explicit read-only authentication smoke test for an isolated private runner.
 * No CRM write endpoints and no email-send endpoints.
 * Only pre-existing internal Resend test email is queried.
 */
import {createSign} from 'node:crypto';
import {pathToFileURL} from 'node:url';
const TARGET='1qGVHhvoUXqAQ5np9PmOc5cgAyUL1i70OBg7wBf-PdZc';
const INTERNAL_TEST_EMAIL='01a156ba-417e-727c-a5f1-22204062c44d';
const required=(key)=>{const v=process.env[key];if(!v?.trim())throw new Error('Missing '+key);return v;};
const enc=(v)=>Buffer.from(JSON.stringify(v)).toString('base64url');
async function json(url,opts={}){
 const u=new URL(url);
 if(u.protocol!=='https:'||!['oauth2.googleapis.com','sheets.googleapis.com','gmail.googleapis.com','api.resend.com'].includes(u.hostname))throw new Error('Unapproved provider');
 const response=await fetch(u,opts);
 if(!response.ok)throw new Error(u.hostname+' request failed HTTP '+response.status);
 return response.json();
}
async function sheetToken(){
 const now=Math.floor(Date.now()/1000);
 const header=enc({alg:'RS256',typ:'JWT'});
 const claims=enc({iss:required('GOOGLE_SERVICE_ACCOUNT_EMAIL'),scope:'https://www.googleapis.com/auth/spreadsheets.readonly',aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+600});
 const signingInput=header+'.'+claims;
 const signer=createSign('RSA-SHA256'); signer.update(signingInput);signer.end();
 const signature=signer.sign(required('GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY').replace(/\\n/g,'\n'),'base64url');
 const body=new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion:signingInput+'.'+signature});
 const result=await json('https://oauth2.googleapis.com/token',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body});
 if(!result.access_token)throw new Error('Missing Sheets bearer token');
 return result.access_token;
}
async function gmailToken(){
 const body=new URLSearchParams({client_id:required('GMAIL_CLIENT_ID'),client_secret:required('GMAIL_CLIENT_SECRET'),refresh_token:required('GMAIL_REFRESH_TOKEN'),grant_type:'refresh_token'});
 const result=await json('https://oauth2.googleapis.com/token',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body});
 if(!result.access_token)throw new Error('Missing Gmail bearer token');
 return result.access_token;
}
export async function verifyReadOnly(){
 if(process.env.CRM_SYNC_ENV!=='test'||process.env.CRM_SYNC_WRITE!=='false'||process.env.CRM_SYNC_TEST_SHEET_ID!==TARGET||process.env.CRM_SYNC_TEST_TAB!=='TEST CRM')throw new Error('Read-only isolation guard failed');
 const sheet=await sheetToken();
 const grid=await json('https://sheets.googleapis.com/v4/spreadsheets/'+TARGET+'/values/'+encodeURIComponent("'TEST CRM'!A1:C3"),{headers:{authorization:'Bearer '+sheet}});
 if(grid.values?.[0]?.[0]!=='Yritys'||grid.values?.[0]?.[2]!=='Resend ID')throw new Error('Unexpected test spreadsheet header');
 console.log('PASS Google Sheets test workbook read-only access');
 const gmail=await gmailToken();
 const profile=await json('https://gmail.googleapis.com/gmail/v1/users/me/profile',{headers:{authorization:'Bearer '+gmail}});
 if(!profile.emailAddress)throw new Error('Gmail profile unavailable');
 if(process.env.CRM_SYNC_EXPECTED_GMAIL && profile.emailAddress.toLowerCase()!==process.env.CRM_SYNC_EXPECTED_GMAIL.toLowerCase())throw new Error('Unexpected Gmail identity');
 console.log('PASS Gmail readonly authenticated profile');
 const email=await json('https://api.resend.com/emails/'+INTERNAL_TEST_EMAIL,{headers:{authorization:'Bearer '+required('RESEND_API_KEY')}});
 if(email.id!==INTERNAL_TEST_EMAIL)throw new Error('Unexpected Resend test message');
 console.log('PASS Resend read of existing internal test email');
 return {sheets:true,gmail:true,resend:true,workerDryRun:false};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 verifyReadOnly().catch(()=>{console.error('FAIL authentication smoke test; inspect provider access and configuration without logging credentials');process.exitCode=1;});
}
