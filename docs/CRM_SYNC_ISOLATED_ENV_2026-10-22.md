# CRM Sync — isolated integration preparation (2026-10-22)

## Executed and verified

- Dedicated native Google Sheets workbook: https://docs.google.com/spreadsheets/d/1OYbeVdYhp87i8nnI3wAvT94_hLej5jOlfYNpVUliWK0/edit
- Only synthetic fixture: `prospect@example.invalid`, `resend-fixture-1`. No live prospect data were copied.
- Google Drive connector read confirmed fixture row; write updated columns D:J with delivered, opened=1, clicked=0, simulated reply; second read verified all updated values.
- This confirms connector access to the test workbook, **not** the standalone worker's service account or OAuth capability.
- Connected Gmail account is `visualjambo@gmail.com`. Must verify that this account actually receives replies to `jami@putkikasvu.fi` before using reply lookup in production.
- The Resend account exposes 15 named API keys. No new API key was created; the API-key creation connector returns the secret into chat, which violates the intended secret-handling boundary.
- GitHub Actions fixture tests have succeeded separately; these do not test live OAuth or email processing.

## Security prerequisites

1. Create a distinct read/reporting token through a direct secure provider-to-runner flow; API key providers' `full_access` level is broad, `sending_access` is insufficient for reading metrics. Use webhook signatures and least privileges where possible.
2. Create a dedicated Google Cloud service account with Google Sheets API enabled; grant editor on the **test workbook only**, not the CRM production workbook.
3. Provision Gmail OAuth with `gmail.readonly` only, store refresh token and client secret encrypted in the isolated runner; confirm mailbox receives intended replies.
4. Add sensitive environment variables in the private runner UI, **not** repository files, workflow output, or chat transcripts.
5. Verify the worker's raw Resend metrics endpoint against official REST contract, then complete exact Message-ID/In-Reply-To/References correlation.
6. Run worker dry-run with real credentials; only after matching expected reads, enable write against test workbook. Require an idempotent second execution and error recovery.
7. Do not merge/deploy PR or touch live CRM until independent runner passes.

## Outcomes

- Provider-side synthetic Sheets read/write/read: **PASS**
- Code fixture CI tests: **PASS**
- New service-account/OAuth credentials: **NOT PROVISIONED**
- Standalone worker live read: **NOT RUN**
- Standalone worker live write: **NOT RUN**
- Production automation: **NOT ENABLED**
