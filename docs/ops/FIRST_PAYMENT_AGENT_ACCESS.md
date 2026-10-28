# First Payment Agent — activation audit, 28 Oct 2026

## Verified
- GitHub Draft PR #13; development workflow fixture/tests succeeded, not merged.
- The pilot Google Sheet is owner-only to visualjambo@gmail.com. The ChatGPT Google Drive connection can read it, but cannot grant the GitHub runner credentials.
- Gmail address-scoped search across both connected accounts since 22 Oct found no direct MIKKI/Upp sender or recipient messages. Broader subject/domain searches located test form notifications and a forwarding test only. This audit is not proof of every custom mail alias or another provider.
- Resend receiving API lists seven received messages, with no direct MIKKI/Upp replies. An earlier forwarding test arrived at the Resend receiving address. There is no email.received webhook.
- Resend API-key metadata can be listed, but the actual secret values cannot be retrieved and should never be placed in Git source or chat.
- This GitHub connection cannot manage GitHub Actions secrets or environments. Do not claim that the external integration was activated.

## Least-privilege provisioning requirements
1. Create a dedicated Google Cloud service account in a project with Sheets API enabled; share ONLY the pilot CRM Sheet as **Viewer** with its exact service-account email (not publicly).
2. Configure GitHub repository Settings -> Environments -> **first-payment-audit** with a required reviewer and deployment-branch restriction to **release/sales-standard-3-5**.
3. Add two **environment-scoped** secrets (not ordinary repository secrets): PK_GOOGLE_SERVICE_ACCOUNT_JSON and PK_RESEND_READ_API_KEY. Protect the Resend key carefully; reading received messages may require Resend full-access privileges, so never expose it to unreviewed push jobs. Rotate credentials if leaked.
4. Merge after review into the named release branch, then use workflow_dispatch from that branch in live-read mode. Never enable unattended live read without an independently approved security review.
5. The preflight validates presence and format without logging secrets. It does NOT test authorizations.
6. Gmail connections held in ChatGPT do NOT provide GitHub OAuth tokens. Reading a personal Gmail mailbox from GitHub would require separate read-only OAuth authorization and refresh-token handling; a Sheets service account cannot access consumer Gmail.
7. The worker checks the received-mail API, not the distinct Resend inbox threads or every Gmail mailbox. Full coverage, historical opt-outs, alias routing and idempotency remain required before **any** unattended sending.
8. MIKKI and Lvi-Upp still have only a manual one-time followup clearance. Never send automatically, generate payment requests or mark a paid invoice on this branch.

## Runtime boundary
- Feature-branch push: unit tests and fixture, **no secrets**.
- Explicit workflow_dispatch from the named release branch: reviewer-protected environment, format preflight, **read-only** CRM/Resend audit.
- No workflow runs on a schedule. No customer-facing changes.
