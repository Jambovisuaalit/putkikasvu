# Vercel isolated worker execution evidence — 2026-10-23

This is a test-only verification of PR #11. No marketing app deployment, new outbound email, or production CRM write occurred.

## Actual Vercel sandbox
- Project: existing `putkikasvu` Vercel project, isolated named sandbox `putkikasvu-crm-readonly-qa`
- Location: `arn1`; runtime: Node.js 22; non-persistent, auto-stop timeout 300000 ms.
- Source: `Jambovisuaalit/putkikasvu`, branch `feat/crm-sync-worker-20261022`; checked out commit `d0676770b9ab1a603a3b235a78db45d5fd0dda30`.
- Network domain allowlist: GitHub, Google OAuth/Sheets/Gmail, Resend API.
- Non-secret config only: CRM_SYNC_ENV=test, CRM_SYNC_TEST_SHEET_ID=1qGVHhvoUXqAQ5np9PmOc5cgAyUL1i70OBg7wBf-PdZc, CRM_SYNC_TEST_TAB=TEST CRM, CRM_SYNC_WRITE=false.
- No ports exposed.

## Observed commands and results
- `node --test tests/crm-sync*.test.mjs` from `/vercel/putkikasvu`: **23 tests, 23 passed, 0 failed**, exit 0.
- `node integrations/crm-sync.mjs` with no secrets: fails closed with `CRM sync failed; check configuration and provider access`, exit code 1. This is correct until credentials are configured.
- GitHub commit workflow statuses at current head: CRM fixture, worker, static release and Chromium QA completed successfully.

## Still blocked
- Standalone service-account Sheets OAuth and Gmail refresh token are NOT provisioned.
- Resend private API credential is NOT installed.
- The existing connected provider app sessions are not reusable as OAuth secrets by this sandbox.
- An authenticated invocation of the **standalone worker** was NOT run; previous connector-based provider reads are different evidence.
- Sandbox is ephemeral and is not a recurring scheduler.

## Next gates
Securely provision only in a private runner with least permissions; confirm reply mailbox and Resend account permission model; run dry-run with a valid pre-existing Resend message in an isolated test sheet; only then approve any write-enabled integration. Keep PR #9 separate.
