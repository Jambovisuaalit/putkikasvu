/**
 * Isolated test-only orchestrator: plan with the existing worker, re-read K ledger,
 * then write only synthetic TEST CRM rows. Never used by the production site.
 * Scheduling MUST prevent concurrent runs (Sheets lacks conditional writes).
 */
import {runSync} from './crm-sync.mjs';
import {writeTestUpdates,TEST_WORKBOOK} from './crm-sync-test-writer.mjs';
import {readConfig} from './crm-sync-config.mjs';

export async function runTestSync({environment,requestJson,tokens,now,planner=runSync}){
 const e={...environment};
 if(e.CRM_SYNC_WRITE!=='test-only')throw new Error('Explicit test-only write opt-in required');
 const cfg=readConfig(e);
 if(cfg.sheetId!==TEST_WORKBOOK||cfg.tab!=='TEST CRM')throw new Error('Wrong test target');
 if(e.CRM_SYNC_FIXTURE_MODE && e.CRM_SYNC_FIXTURE_MODE!=='true')throw new Error('Invalid fixture flag');
 // The planner itself has no write path and can only generate candidate updates.
 const plan=await planner({environment:{...e,CRM_SYNC_WRITE:'false'},requestJson,tokens,now});
 if(plan.updated!==0||plan.mode!=='dry-run')throw new Error('Unexpected mutating planner');
 const sheetToken=await tokens.sheet();
 const endpoint='https://sheets.googleapis.com/v4/spreadsheets/'+TEST_WORKBOOK+'/values/'+encodeURIComponent("'TEST CRM'!A1:K");
 const grid=(await requestJson(endpoint,{headers:{authorization:'Bearer '+sheetToken}})).values||[];
 const status=await writeTestUpdates({environment:e,requestJson,token:sheetToken,grid,updates:plan.updates});
 return {mode:'test-only',...status};
}
