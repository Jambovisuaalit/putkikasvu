# Putkikasvu Phase 4b — Payment reconciliation & secure onboarding

**Status: CODE READY FOR REVIEW, NOT ACTIVATED.** Do not use with real customer data yet.

## Architecture
- Source: Jambovisuaalit/putkikasvu, branch feat/secure-orders-revolut-onboarding
- Database: a dedicated Putkikasvu Supabase project is recommended; dormant Liidiputki may be considered after cost/ownership audit. Do not use ghoulhouse/gomore/JKP production DB.
- SQL review file: database/putkikasvu_phase4b_schema.sql
- Server handlers:
  - POST /api/admin/orders — requires Supabase Auth JWT of a user listed in pk_staff.
  - POST /api/admin/payments — same, plus exact order reference/company/transaction evidence; uses atomic RPC.
  - POST /api/onboarding — requires real Supabase Auth JWT belonging to that exact order; requires verified deposit; blocked after balance.
- There is no customer login UI yet. The existing /demo/testi continues to be a mock, deliberately NOT wired to persistence.
- All handlers return 503 until explicitly enabled and configured.

## Safe enablement checklist (not completed)
1. Confirm host/price of resuming Liidiputki or approve a separate Supabase project; do not reactivate silently.
2. Review database/putkikasvu_phase4b_schema.sql (including grants/RLS), apply against a staging DB.
3. Run SQL security advisors and verify anon/authenticated cannot read/write pk_* tables or call confirmation RPC.
4. Create two Auth test users A and B and one staff user. Seed staff manually after checking the correct UUID.
5. Test that A cannot read/modify B's onboarding, direct REST and API routes. Verify no write until deposit and no update after balance.
6. Verify unique Revolut transaction reference cannot be reused for another order; duplicate same order+installment is idempotent. Wrong amount/currency/order company/reference must fail.
7. Confirm that the actual Revolut Pro transaction UI exposes enough evidence to distinguish payments made through the reusable 295 EUR link. If it doesn't, use dedicated per-order links or manual matching with stricter proof.
8. Configure Vercel **server-only** env vars for the intended staging environment:
   PK_BACKEND_ENABLED=true
   PK_SUPABASE_URL=https://PROJECT.supabase.co
   PK_SUPABASE_PUBLISHABLE_KEY=... (server only in this implementation)
   PK_SUPABASE_SERVICE_ROLE_KEY=... (secret, NEVER NEXT_PUBLIC_, NEVER commit)
9. Configure Supabase Auth email/OTP delivery and create a proper signed-in customer onboarding UI before sending invitations.
10. Execute end-to-end staging tests with synthetic transactions, verify backups and rollback, then separately authorize production.

## Manual Revolut Pro process
**Existing shared 295 EUR link must not be interpreted as a unique order reference.**
- Staff issues a PK-... reference at quote acceptance and associates the customer/Auth user.
- Ask customer to enter the order reference in the Revolut custom field if the actual link supports it. If the field only accepts company, require an exact company match and independent transaction-level inspection.
- Staff compares *gross* 295.00 EUR (before Revolut fees), transaction id, date, payer/company, accepted offer and order ref in Revolut Pro.
- Staff records the verified external transaction ID using POST /api/admin/payments. No payment can be verified by a public browser redirect, screenshot, customer upload or frontend localStorage state.
- First payment is deposit, customer onboarding unlocks only after verification. Balance allowed only after onboarding submitted. Publication still requires separate content QA and approval.
- Refunds, disputes, partial payments, chargebacks and ongoing reconciliation exports are NOT implemented; these must be handled before production.

## Example API shapes (requires real JWT)
Create order: { "customerUserId": "<uuid>", "companyName": "Esimerkki Oy", "termsVersion": "v1.0", "acceptanceEvidence": "Signed quote #123 confirmed by staff" }
Verify: { "orderId":"<uuid>", "orderRef":"PK-<16 HEX>", "companyName":"Esimerkki Oy", "installment":"deposit", "transactionId":"REAL_REVOLUT_TXN_ID", "grossAmountCents":29500, "currency":"EUR", "evidenceNote":"Checked in Revolut Pro against payer and order", "paidAt":"2026-10-21T14:00:00.000Z" }
Onboarding: { "orderId":"<uuid>", "phone":"040...", "serviceArea":"Uusimaa", "openingHours":"Arkisin 8-16", "services":["Putkiasennus","LVI-huolto"], "notes":"", "rightsConfirmed":false }
Authorization header: Bearer <Supabase Auth access JWT>

## Data security boundaries
- public.pk_* tables have RLS enabled and forced. PUBLIC, anon and authenticated DB rights are explicitly revoked. Service-role only via server.
- Staff actions require Auth JWT + membership in pk_staff, not user-editable metadata.
- Auth user must match order.customer_user_id. No URL-only customer access.
- No uploaded files, third-party email, payment webhook or actual payment are performed by this code.
- Data is stored only if explicitly activated against a tested project; real PII must not be used in preview.
- State from demo sessionStorage cannot authenticate a real order.
- Plan for EU data residency, deletion schedules, data export, monitoring and verified restore before go-live.

## Regression tests
npm run test
npm run build

## Note about shared website
The production branch, the existing Revolut Pro link, Zoner DNS and the putkikasvu.fi site are untouched.
