import test from 'node:test';
import assert from 'node:assert/strict';
import {credentialReadiness,assertLiveReadReady} from '../integrations/crm-sync-readiness.mjs';
const values={GOOGLE_SERVICE_ACCOUNT_EMAIL:'test@example.invalid',GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY:'fixture',GMAIL_REFRESH_TOKEN:'fixture',GMAIL_CLIENT_ID:'fixture',GMAIL_CLIENT_SECRET:'fixture',RESEND_API_KEY:'fixture',CRM_SYNC_WRITE:'false'};
test('missing credentials reported only by variable name',()=>{const r=credentialReadiness({});assert.equal(r.ready,false);assert.equal(r.missing.length,6);assert.ok(!JSON.stringify(r).includes('fixture'))});
test('read-only mode mandatory',()=>{assert.equal(assertLiveReadReady(values),true);assert.throws(()=>assertLiveReadReady({...values,CRM_SYNC_WRITE:'true'}),/must be false/)});
