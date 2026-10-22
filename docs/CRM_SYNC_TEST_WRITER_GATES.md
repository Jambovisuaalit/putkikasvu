# CRM Sync TEST-only write adapter — verification notes

The PR #11 code now includes `integrations/crm-sync-test-writer.mjs` and `integrations/crm-sync-test-runner.mjs`.

## Safety properties
- Only `CRM_SYNC_ENV=test`, `CRM_SYNC_TEST_SHEET_ID=1qGVHhvoUXqAQ5np9PmOc5cgAyUL1i70OBg7wBf-PdZc`, `CRM_SYNC_TEST_TAB=TEST CRM` and explicit `CRM_SYNC_WRITE=test-only` can request writes.
- Only existing synthetic rows whose addresses end with `.invalid` are writable. The canonical production spreadsheet ID is never accepted.
- Existing dry-run planning code remains read-only. The opt-in test orchestrator is separate, never imported by the public marketing app.
- A SHA-256 fingerprint of the row's Resend ID and five business status fields is stored in column K. The timestamp is excluded so scheduled rechecks with unchanged statuses are skipped. Original column J notes are preserved.
- Test spreadsheet status fields D:I and fingerprint in K are submitted in a single Google Sheets `values:batchUpdate` request.
- Invalid targets, duplicate target rows, non-synthetic addresses and unexpected table headers fail closed.
- The token and customer message bodies must never be logged.

## Remaining hard limits
- This is sequential row-state deduplication, **NOT** a durable event log. It does not yet guarantee exactly-once application of concurrent webhook events.
- Google Sheets values API lacks a compare-and-swap primitive. The scheduler must enforce a **single active worker**, or an external transactional datastore/lock must be added.
- A real credentialed worker run and test-only write have **not** been executed. Tests use mock HTTP/token providers.
- The test CRM contains synthetic Resend IDs. A real Resend get-email request on those IDs will fail. Do not replace them with customer IDs or send emails just to satisfy the test without review.
- Google service-account token currently requests the `spreadsheets.readonly` scope. Write test requires a separate appropriately scoped test-only Sheets token and explicit verified access; do not simply raise privileges in the existing production-facing dry-run path.
- Existing connected ChatGPT app authorization is not a reusable OAuth refresh token in a separate Node process.
- No service account, Gmail OAuth client or restricted Resend API key has been provisioned or stored. The Resend connector's create-key operation reveals the token in conversation and is not an acceptable private secret distribution channel.

## Acceptance gate
Before enabling a live external write, verify the actual API responses and credentials in an isolated private runner, choose a genuinely synthetic row, enforce serialized execution, and verify write/read/replay with the same row and original data intact. Never merge this branch merely on fixture tests.
