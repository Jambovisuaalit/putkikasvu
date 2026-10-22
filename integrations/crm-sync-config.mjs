/** Test runner only. No production target or implicit defaults. */
export function readConfig(env) {
  if(env.CRM_SYNC_WRITE && env.CRM_SYNC_WRITE!=='false')throw new Error('CRM writes are blocked');
  if(env.CRM_SYNC_ENV!=='test')throw new Error('CRM_SYNC_ENV must be test');
  const sheetId=env.CRM_SYNC_TEST_SHEET_ID;
  const tab=env.CRM_SYNC_TEST_TAB;
  if(!sheetId || !/^[A-Za-z0-9_-]+$/.test(sheetId))throw new Error('Missing or invalid test sheet ID');
  if(!tab || !/^TEST(?:$|[ _-])/.test(tab) || tab.length>100 || /[\[\]:*?\/\\]/.test(tab))throw new Error('Test tab must start with TEST');
  return {sheetId,tab};
}
