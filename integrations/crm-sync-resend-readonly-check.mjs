/**
 * Putkikasvu: explicit private-runner, read-only integration check.
 * Stage 1: authenticate to an existing INTERNAL received email.
 * Stage 2: run the isolated CRM planner twice and compare deterministic plans.
 *
 * No Sheet batchUpdate, webhooks, scheduler, mail sends or production fallback.
 * Only safe aggregates are printed; message bodies, addresses and tokens are not.
 */
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {readConfig} from './crm-sync-config.mjs';
import {assertLiveReadReady} from './crm-sync-readiness.mjs';
import {verifyResendInboundReadOnly} from './crm-sync-resend-inbound-auth-smoke.mjs';
import {runSync} from './crm-sync.mjs';

export async function verifyResendCrmReadOnly({
  environment=process.env,
  smoke=verifyResendInboundReadOnly,
  planner=runSync,
  now=()=>new Date()
}={}) {
  const config=readConfig(environment);
  if(environment.CRM_SYNC_FIXTURE_MODE)
    throw new Error('Fixture bypass prohibited in authenticated integration check');
  if(environment.CRM_SYNC_WRITE!=='false' || config.replySource!=='resend')
    throw new Error('Authenticated test must be Resend-only and read-only');
  if(config.sheetId!=='1qGVHhvoUXqAQ5np9PmOc5cgAyUL1i70OBg7wBf-PdZc'
     || config.tab!=='TEST CRM')
    throw new Error('Authenticated test target must be dedicated TEST CRM');
  assertLiveReadReady(environment);
  const stamp=now();
  if(!(stamp instanceof Date)||!Number.isFinite(stamp.valueOf()))
    throw new Error('Invalid read-only test time');
  const probe=await smoke({environment});
  if(probe?.verified!==true || probe?.crmWrites!==0 || probe?.outboundSends!==0)
    throw new Error('Resend inbound smoke not verified');
  const opts={environment,now:()=>stamp};
  const first=await planner(opts);
  const second=await planner(opts);
  for(const run of [first,second]) {
    if(run?.mode!=='dry-run'||run?.updated!==0||
       !Number.isSafeInteger(run?.candidates) ||run.candidates<0 ||
       !Array.isArray(run?.updates) ||run.updates.length!==run.candidates)
      throw new Error('CRM planner produced unsafe result');
    if(run.updates.some(u=>{
      const match=/^'TEST CRM'!D([1-9][0-9]*):I([1-9][0-9]*)$/.exec(u?.range||'');
      return !match || Number(match[1])<2 || match[1]!==match[2];
    }))
      throw new Error('CRM planner returned wrong update target');
  }
  assert.deepStrictEqual(second,first,'Two read-only plans differ');
  return {
    mode:'read-only',
    inboundAuthenticated:true,
    workerCandidates:first.candidates,
    proposedWrites:0,
    realWrites:0,
    emailsSent:0,
    repeatPlanIdentical:true,
    // No actual row values, recipient addresses, IDs or event contents.
  };
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href) {
  verifyResendCrmReadOnly().then(result=>console.log(JSON.stringify(result)))
    .catch(()=>{
      console.error('FAIL protected read-only integration check; inspect private runner logs and config without printing secrets');
      process.exitCode=1;
    });
}
