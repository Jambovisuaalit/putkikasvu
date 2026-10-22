/** Test runner only. No production target or implicit defaults. */
export function readConfig(env) {
  if(env.CRM_SYNC_WRITE && !['false','test-only'].includes(env.CRM_SYNC_WRITE))throw new Error('CRM writes are blocked');
  if(env.CRM_SYNC_WRITE==='test-only' && (env.CRM_SYNC_TEST_SHEET_ID!=='1qGVHhvoUXqAQ5np9PmOc5cgAyUL1i70OBg7wBf-PdZc'||env.CRM_SYNC_TEST_TAB!=='TEST CRM'))throw new Error('Test writes outside dedicated fixture prohibited');
  if(env.CRM_SYNC_ENV!=='test')throw new Error('CRM_SYNC_ENV must be test');
  const sheetId=env.CRM_SYNC_TEST_SHEET_ID;
  const tab=env.CRM_SYNC_TEST_TAB;
  if(!sheetId || !/^[A-Za-z0-9_-]+$/.test(sheetId))throw new Error('Missing or invalid test sheet ID');
  if(!tab || !/^TEST(?:$|[ _-])/.test(tab) || tab.length>100 || /[\[\]:*?\/\\]/.test(tab))throw new Error('Test tab must start with TEST');
  return {sheetId,tab};
}
