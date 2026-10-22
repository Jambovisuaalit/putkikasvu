/**
 * TEST-ONLY write adapter. No production spreadsheet IDs accepted.
 * A durable row fingerprint in K avoids writes on repeated sequential runs.
 * Caller must schedule at most one worker at a time; Google Sheets does not
 * offer compare-and-swap on values:batchUpdate.
 */
import {createHash} from 'node:crypto';
import {readConfig} from './crm-sync-config.mjs';

export const TEST_WORKBOOK='1qGVHhvoUXqAQ5np9PmOc5cgAyUL1i70OBg7wBf-PdZc';
export const LEDGER_HEADER='CRM Sync - fingerprint (TEST)';
const digest=(parts)=>createHash('sha256').update(JSON.stringify(parts)).digest('hex');
const quote=(tab)=>"'"+tab.replaceAll("'","''")+"'";
const validRow=(r)=>Array.isArray(r)&&r.length===6&&r.slice(0,5).every(x=>['string','number'].includes(typeof x));
export function prepareTestWrites({environment,grid,updates}){
 const {sheetId,tab}=readConfig(environment);
 if(sheetId!==TEST_WORKBOOK||tab!=='TEST CRM')throw new Error('Unapproved test spreadsheet or tab');
 if(environment.CRM_SYNC_WRITE!=='test-only')throw new Error('Test writer not explicitly enabled');
 if(!Array.isArray(grid)||grid[0]?.[0]!=='Yritys'||grid[0]?.[2]!=='Resend ID')throw new Error('Invalid CRM headers');
 if(grid[0]?.[10] && grid[0][10]!==LEDGER_HEADER)throw new Error('Fingerprint column K is occupied');
 if(!Array.isArray(updates))throw new Error('Missing updates');
 const seen=new Set(), data=[],noop=[];
 for(const item of updates){
  const match=/^'TEST CRM'!D([2-9][0-9]*):I\1$/.exec(item?.range||'');
  const i=match?Number(match[1]):NaN;
  if(!Number.isSafeInteger(i)||i>grid.length)throw new Error('Update outside existing TEST CRM rows');
  if(seen.has(i))throw new Error('Duplicate target row');
  seen.add(i);
  const row=grid[i-1];
  if(!row?.[2]||!row?.[1]||!/\.invalid$/.test(row[1]))throw new Error('Non-synthetic row');
  const values=item.values?.[0];
  if(!validRow(values))throw new Error('Invalid update values');
  const fingerprint=digest([row[2],...values.slice(0,5)]);
  if(row[10]===fingerprint){noop.push(i);continue;}
  data.push({range:quote(tab)+'!D'+i+':I'+i,values:[values]});
  data.push({range:quote(tab)+'!K'+i,values:[[fingerprint]]});
 }
 return {data,noop,updated:data.length/2,fingerprintHeader:LEDGER_HEADER};
}
export async function writeTestUpdates({environment,requestJson,token,grid,updates}){
 const p=prepareTestWrites({environment,grid,updates});
 if(!p.updated)return {updated:0,unchanged:p.noop.length};
 const headers={'authorization':'Bearer '+token,'content-type':'application/json'};
 const api='https://sheets.googleapis.com/v4/spreadsheets/'+TEST_WORKBOOK+'/values:batchUpdate';
 const data=[{range:"'TEST CRM'!K1",values:[[LEDGER_HEADER]]},...p.data];
 const response=await requestJson(api,{method:'POST',headers,body:JSON.stringify({valueInputOption:'RAW',data})});
 if(response?.totalUpdatedCells!==undefined && response.totalUpdatedCells<1)throw new Error('Sheets wrote no cells');
 return {updated:p.updated,unchanged:p.noop.length};
}
