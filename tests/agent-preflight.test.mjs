import test from 'node:test';
import assert from 'node:assert/strict';
import {inspectCredentials} from '../agent/preflight.mjs';
test('missing secrets are reported without values',()=>{
  assert.deepEqual(inspectCredentials({}),{ready:false,
    missing:['PK_GOOGLE_SERVICE_ACCOUNT_JSON','PK_RESEND_READ_API_KEY'],
    reason:'MISSING_ENVIRONMENT_SECRETS'});
});
test('malformed service account is blocked',()=>{
  assert.equal(inspectCredentials({PK_GOOGLE_SERVICE_ACCOUNT_JSON:'not json',PK_RESEND_READ_API_KEY:'re_example'}).reason,
    'INVALID_GOOGLE_SERVICE_ACCOUNT');
});
test('secret syntax does not assert access',()=>{
  const sa=JSON.stringify({client_email:'test@project.iam.gserviceaccount.com',private_key:'BEGIN PRIVATE KEY'});
  const r=inspectCredentials({PK_GOOGLE_SERVICE_ACCOUNT_JSON:sa,PK_RESEND_READ_API_KEY:'re_example'});
  assert.equal(r.ready,true);assert.equal(r.reason,'CREDENTIAL_FORMAT_READY_ONLY');
});
