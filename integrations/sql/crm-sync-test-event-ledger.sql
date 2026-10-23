-- Putkikasvu CRM worker: isolated durable inbox and event checkpoint schema.
-- Apply ONLY to a dedicated TEST database after review. Not deployed by this PR.
-- The production CRM and public website must not use these tables.
BEGIN;
CREATE TABLE IF NOT EXISTS crm_sync_test_events (
  event_key text PRIMARY KEY,
  provider text NOT NULL CHECK (provider IN ('resend','gmail')),
  provider_event_id text NOT NULL,
  occurred_at timestamptz,
  received_at timestamptz NOT NULL DEFAULT now(),
  state text NOT NULL DEFAULT 'pending' CHECK (state IN ('pending','processing','completed','failed')),
  attempts integer NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  next_attempt_at timestamptz NOT NULL DEFAULT now(),
  claim_token uuid,
  claimed_until timestamptz,
  completed_at timestamptz,
  last_error_code text,
  payload_sha256 char(64) NOT NULL,
  CHECK (event_key = provider || ':' || provider_event_id),
  CHECK (state <> 'completed' OR completed_at IS NOT NULL)
);
CREATE INDEX IF NOT EXISTS crm_sync_test_due
 ON crm_sync_test_events (next_attempt_at,received_at)
 WHERE state IN ('pending','failed');
COMMIT;
-- Ingestion: INSERT ... ON CONFLICT (event_key) DO NOTHING.
-- Atomic claim: UPDATE selected rows FOR UPDATE SKIP LOCKED in a transaction,
-- assigning a unique claim_token and a bounded claimed_until lease.
-- Apply any durable CRM update and mark event completed in ONE database
-- transaction, or use a transactional outbox when calling Google Sheets.
-- IMPORTANT: Google Sheets writes cannot join PostgreSQL transactions.
-- Exactly-once Sheets external effects require idempotent target fingerprints,
-- recovery reconciliation and a single active writer; do not claim true
-- distributed exactly-once semantics or enable production writes yet.
