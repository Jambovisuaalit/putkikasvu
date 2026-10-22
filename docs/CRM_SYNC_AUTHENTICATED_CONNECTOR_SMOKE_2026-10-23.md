# First authenticated provider-connector smoke test — 2026-10-23

Scope: READ ONLY across the already connected Resend, Gmail and Google Drive provider integrations. **This is NOT an authenticated execution of the standalone Node worker**. It does not prove worker OAuth service-account credentials or grant access to them.

## Evidence

1. Resend `get_email` read of an **existing** non-prospect internal technical test message succeeded. Resend message ID: `01a156ba-417e-727c-a5f1-22204062c44d`; outbound Message-ID `<010201a156ba4358-457ef3f5-20f9-40e8-9bd9-5702cbb849b4-000000@eu-west-1.amazonses.com>`; status `delivered`; recipient `visualjambo@gmail.com`; sent 2026-10-20 00:33:29 UTC.
2. Gmail connected profile is `visualjambo@gmail.com`. Gmail search by exact subject and date found one inbound copy from the corresponding sending address, with timestamp 2026-10-20 00:33:29 UTC. This verifies that connected Gmail reads an actually delivered Resend message. **It is not a customer reply.**
3. Google Sheets connected API read `TEST CRM!A1:J3` from isolated spreadsheet `1qGVHhvoUXqAQ5np9PmOc5cgAyUL1i70OBg7wBf-PdZc` succeeded. Two test fixture rows contain `.invalid` addresses and artificial Resend IDs; those IDs cannot be used for live Resend REST reads.
4. GitHub PR #11 latest head pre-check `c76c3d2e73d89af617e40f892e5bf0ce63d7b17c` remained draft/unmerged. Vercel project `putkikasvu` environment-variable listing returned no integration credentials, and its named-sandbox listing was empty.

## What passed

- Resend authenticated provider-connector read: PASS
- Gmail authenticated provider-connector read of the **same previously sent internal technical message**: PASS
- Google Sheets authenticated provider-connector read from isolated test spreadsheet: PASS
- No outbound messages or production CRM writes: PASS

## What remains unproven / blocked

- Service-account token issuance and Gmail refresh-token OAuth from the standalone worker: NOT RUN (credentials not provisioned).
- Worker end-to-end live read or write: NOT RUN.
- Resend metrics REST schema, genuine customer reply correlation, durable event deduplication, scheduler: NOT VERIFIED.
- Vercel project is the public static marketing app; **do not provision integration secrets in it** until a separate reviewed private runner is selected.
- A Google Sheets synthetic-row write via provider connector in a separate test workbook was shown previously, but is not a worker write.

No secrets were exported into GitHub, Vercel or this record. No messages were sent.
