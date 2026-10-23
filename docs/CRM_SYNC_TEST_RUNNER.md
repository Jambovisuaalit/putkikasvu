# Isolated CRM worker rehearsal

Run `node --test tests/crm-sync*.test.mjs` with Node 22+. No npm install,
provider credentials, customer data, or live provider requests are required.
The dedicated GitHub Actions workflow runs on this branch's pushes and PR updates.
It uses contents:read, disables persisted checkout credentials, and references no secrets.

The actual exported runSync worker is exercised using injected token providers,
HTTP fixtures and a fixed clock. Importing the module performs no I/O. Unexpected
HTTP requests fail; native fetch is forbidden by the worker test suite. Assertions
cover the dedicated test target, quoted ranges, pagination, reply headers, unknown
metrics, delayed-event regression, duplicate IDs, provider errors and repeated runs.
Repeated dry runs prove deterministic planning, not durable event deduplication.

## Before credentials

- CRM_SYNC_ENV must be test; CRM_SYNC_TEST_SHEET_ID and CRM_SYNC_TEST_TAB are required.
- There is no production target fallback. Use a dedicated spreadsheet shared only
  with the test service account; the TEST tab prefix alone is not resource isolation.
- Any write enablement is rejected before OAuth. No write/send implementation exists.
- Missing original Message-ID or sent timestamp yields explicit unresolved correlation.
- Raw Resend metrics contract is still unverified. Opens/clicks remain unavailable.

## Later live verification (not executed by this workflow)

After a passing CI result, provision credentials only in a private runner. Start with
read-only provider verification and synthetic rows in the dedicated spreadsheet.
Validate the actual Resend response fields, Google scopes and service-account access.
Sheets tokens currently request read-only spreadsheet scope. Do not add secrets to
this PR workflow or the static website project. Write tests, durable deduplication,
retry/rate limiting, scheduler and explicit release approval remain deployment gates.
