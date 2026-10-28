# First Payment Agent v1 — read-only release
Branch: feature/first-payment-agent-v1 (base release/sales-standard-3-5).

## Delivered
- Standalone Node.js runner in the *same repository*, without changing Next.js static export.
- CRM checks for exactly two companies (LVI MIKKI Ky / Lvi-Upp Oy) across SEURANTA, ESTOLISTA and LÄHETYSLOKI.
- Resend-managed inbox exact-sender response classification. Gmail is **not** automatically checked by the runner.
- In-memory personalized follow-up and written EUR 590 offer *draft* generation.
- No automatic outgoing mail, contract acceptance, CRM write, payment link, payment capture or scheduled production action.
- Output in CI contains only company names/status/reason codes, never email addresses or message body.

## Run
npm test
npm run agent:dry-run
npm run agent:check  # only after read-only secrets are provisioned

GitHub Actions workflow "First Payment Agent (read-only)": push validates fixture; manual workflow_dispatch can select live-read.
Required GitHub Actions secrets for live-read only:
- PK_GOOGLE_SERVICE_ACCOUNT_JSON: Google service-account JSON, with pilot Sheet shared as *viewer*.
- PK_RESEND_READ_API_KEY: Resend account API key with access to received emails (do not put in source).
Do not put secrets in Vercel: the Next.js project uses output: export and has no server process.
No cron/scheduler is configured for live reads until source coverage, access rights and retention have been validated.
No generated message or personal data is persisted in git/artifacts/logs.

## Approval boundaries
- 28.10 CRM clearance was one manual follow-up, not permission to automate outreach.
- A no-match in Resend does not prove no Gmail message was received. No automatic sends.
- Expired/unavailable prospect demos must not be linked. Public website may still show EUR 990.
- Reply interest produces a quote draft only, not a signed order. Actual quote needs buyer identity, approved terms, agreed timeline, annexes/DPA and confirmation of authority.
- EUR 590 = EUR 295 + EUR 295, no automatic checkout link. Owner states no ALV or advance-tax register. B2B buyer withholding must be handled before payment. No Revolut Pro transaction integration exists.
- Next phase requires durable event log/idempotency, full Gmail coverage, explicit sending approval and reliable payment reconciliation.
