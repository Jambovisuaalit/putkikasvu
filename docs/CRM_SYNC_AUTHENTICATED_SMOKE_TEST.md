# Authenticated read-only smoke test — operator checklist

This PR currently implements a **dry-run-only** CRM worker. Credentials are *not* present in GitHub or Vercel; connected ChatGPT application grants are not transferable to a Node.js process.

## Credential setup (must occur within private provider dashboards)
1. Google Cloud Console: enable Google Sheets API in a dedicated project and create a service account. Share only the existing synthetic `TEST CRM` workbook with the service-account email as **Viewer** for the current read-only stage. Do not share production CRM.
2. Google OAuth: use an OAuth consent screen / client with `https://www.googleapis.com/auth/gmail.readonly`. Authorize the mailbox that actually receives replies to the outbound sender. Save refresh token and client secret directly in the restricted runner's encrypted secret store.
3. Resend: a sending-only key may be insufficient for email retrieval; use a separately scoped credential supported by the provider, restricting exposure to the isolated worker. Existing account-wide full-access keys must not be copied to the public repository. The connector's API-key creation action reveals tokens in chat and is intentionally not used.
4. Inject encrypted variables: `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`, `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN`, `RESEND_API_KEY`. Set non-secrets `CRM_SYNC_ENV=test`, `CRM_SYNC_TEST_SHEET_ID=1qGVHhvoUXqAQ5np9PmOc5cgAyUL1i70OBg7wBf-PdZc`, `CRM_SYNC_TEST_TAB=TEST CRM`, `CRM_SYNC_WRITE=false`. Never enable `CRM_SYNC_FIXTURE_MODE` outside tests.
5. Run `node integrations/crm-sync.mjs` in the private runner. The current synthetic fixture Resend IDs are deliberately invalid; populate a dedicated authorized live-read fixture only after the owner approves which existing message to inspect, keeping contact details off GitHub.
6. Check only result counts, statuses, and masked errors in logs. The worker never writes or sends.
7. For a true isolated write/read/write idempotency test, implement a distinct test-only Sheets writer with scoped authorization and a strict allowlist for the test workbook, plus durable event IDs. **Not implemented in this PR**.

## Release gates
- Provider credentials installed without copying into conversation or GitHub source.
- Actual token refresh and Google Sheets read success.
- Actual Resend get-email response verified and Gmail original Message-ID correlation checked.
- Failure handling, durable deduplication, and explicit test-only writes implemented.
- Protected review and release approval before enabling production CRM.

**Do not merge this PR as production-ready on fixture CI results alone.**
