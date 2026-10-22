# PR #11 — integration verification, 22 October 2026

## Verified using connected provider actions (not the worker)

- Resend get-email for `01a16435-7eac-7aa4-acda-54e8fba115fc`: `delivered`; Message-ID `<010201a1643580a6-f04f6c84-ce3f-4d99-bb33-b2595e376f1d-000000@eu-west-1.amazonses.com>`.
- Resend get-email-metrics filtered by the same ID: delivered=1, opened=0, clicked=0.
- Gmail search `from:putki@lvimeridijan.fi after:2026/10/21`: no results at the time checked.
- Google Sheets `SEURANTA 22-10-2026!A1:J3`: Meridijan row contains matching ID, delivered, 0, 0, and no reply found.

These checks establish provider-side read access via connected actions only. They do NOT prove the worker's service-account OAuth, Gmail OAuth refresh token, raw Resend REST metrics endpoint, scheduled execution, or Google Sheets write permission.

## Release blockers

1. **Resend metrics REST contract:** the provider's connected metrics action works, but the prototype's raw `GET /emails/metrics` URL/query/response are not yet verified. Never treat missing metrics as zero.
2. **Gmail exact reply attribution:** searching by sender only yields candidates, not replies. Retrieve message headers and require a matching `In-Reply-To` / `References` to the original sent Message-ID, with sender and timestamp validation.
3. **OAuth and access:** provision least-privilege Gmail and Google Sheets credentials in an isolated private runner; never commit secrets. Confirm Sheets is shared with the service account.
4. **Read-only integration test:** run the worker with test credentials, compare output against known provider-side results; do not send emails or write CRM.
5. **Write test:** after code and access are verified, use a dedicated test tab and synthetic row. Confirm idempotency and failure recovery before any production write.
6. **Scheduling:** choose an isolated worker/scheduler; the marketing app uses Next.js `output: 'export'` and cannot serve API routes or cron jobs.

Current implementation intentionally refuses `CRM_SYNC_WRITE=true` and must remain a draft PR. No email was sent in this verification.
