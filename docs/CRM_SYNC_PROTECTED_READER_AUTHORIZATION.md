# PR #11 — isolated credentialed reader authorization checklist

Status: staged code only. NO secret has been provisioned; NO authenticated standalone worker run has occurred.

## Target architecture
- GitHub Actions is the separate manual execution runner; it is not the public Vercel marketing project.
- `.github/workflows/crm-sync-auth-readonly.yml` has `workflow_dispatch` only, `contents: read`, no pull-request trigger, serialized concurrency, and demands protected environment `crm-sync-readonly`.
- The secret-bearing step runs ONLY from reviewed `main`, after separate code review and explicit approval. GitHub workflow_dispatch availability generally requires the workflow definition on the default branch: do not merge PR #11 merely to run this test. Instead extract/review the small standalone smoke workflow and script into an independently authorized main-branch change when ready.
- Configure the GitHub environment with required reviewers and deployment branch restrictions to `main`. On plans without effective reviewer restrictions, do not store live credentials in this workflow.
- The script performs read-only GETs: isolated TEST workbook header, connected Gmail profile, pre-existing internal Resend test email. Token exchanges are POST calls to Google OAuth and are not data writes.
- No email sends, no CRM writes, no OAuth tokens or mail bodies printed.

## Operator-only credentials (enter directly in GitHub protected environment Secrets; do NOT send in chat)
- GOOGLE_SERVICE_ACCOUNT_EMAIL
- GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
- GMAIL_CLIENT_ID
- GMAIL_CLIENT_SECRET
- GMAIL_REFRESH_TOKEN
- RESEND_API_KEY

Minimum provider access:
1. A new test-only Google service account: grant Viewer access to workbook `1qGVHhvoUXqAQ5np9PmOc5cgAyUL1i70OBg7wBf-PdZc` ONLY. JWT scope `spreadsheets.readonly`; never share production workbook.
2. Dedicated Gmail OAuth grant on the intended accessible mailbox `visualjambo@gmail.com` using scope `gmail.readonly`. This is not proof that replies to `jami@putkikasvu.fi` reach that mailbox. Confirm routing separately.
3. Resend key with actual email read permission for the existing internal technical message `01a156ba-417e-727c-a5f1-22204062c44d`. Never create keys that expose values via chat. Key must not have unnecessary send privilege if provider supports finer scope.

## Acceptance gates
- The three PASS lines appear on a manually approved secret-bearing run.
- Failure output contains no bearer credentials and no customer message bodies.
- The standalone **worker dry-run** is a DIFFERENT follow-up gate: the TEST CRM has fake Resend IDs, so the existing worker cannot yet execute a fully authentic read against these fixture rows. Do not silently replace fixture IDs with real customer IDs.
- Durable database ledger SQL is not provisioned, and two-pass write idempotency remains blocked until a TEST-only datastore, service permission and controlled synthetic plan are reviewed.
- Keep PR #11 Draft. No sales sends; no production CRM writes; no GitHub branch merge during this authorization stage.
