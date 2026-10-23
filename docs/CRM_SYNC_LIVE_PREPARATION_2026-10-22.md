# Live connection preparation — 22 October 2026

## Completed
- Created a separate native test spreadsheet with only synthetic company names, .invalid recipients and synthetic IDs.
- Verified TEST CRM!A1:J4 via connector reads; timezone Europe/Helsinki.
- No production CRM writes, sends, scheduler or production deployment.
- Credential-free CI passed for commit 45260605692ebeaac33f5d078a5bf2a8893e1180:
  https://github.com/Jambovisuaalit/putkikasvu/actions/runs/39807357299 (15/15).

## Test target (non-secret)
CRM_SYNC_ENV=test
CRM_SYNC_TEST_SHEET_ID=1qGVHhvoUXqAQ5np9PmOc5cgAyUL1i70OBg7wBf-PdZc
CRM_SYNC_TEST_TAB=TEST CRM
CRM_SYNC_WRITE=false

Native sheet:
https://docs.google.com/spreadsheets/d/1qGVHhvoUXqAQ5np9PmOc5cgAyUL1i70OBg7wBf-PdZc/edit

The synthetic IDs are fixture IDs, not valid Resend IDs. Do not run the live
Resend lookup against these rows and mistake the resulting 404 for an auth failure.
Validate Sheets access separately, then use one existing authorized message for
Resend/Gmail read-only contract checks. Do not place real customer data in this sheet.

## Connector observations (not raw worker authentication)
An existing authorized sent message was read through the Resend connector:
delivered. Domain open/click tracking is disabled, so engagement is unavailable; prior zero counts are not evidence of no engagement. The corresponding Gmail sender
search returned no matching messages. No positive live reply is available to
prove exact reply attribution. Message contents are not retained in this report.

These observations do not establish worker-owned OAuth, service-account access,
direct REST response contracts or a positive live reply test. The formatted
connector response is not evidence of the raw JSON field names.

## Remaining secure setup
No values are available in the current runtime for:
RESEND_API_KEY
GOOGLE_SERVICE_ACCOUNT_EMAIL
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
GMAIL_CLIENT_ID
GMAIL_CLIENT_SECRET
GMAIL_REFRESH_TOKEN

Available Google connectors do not provision a Cloud OAuth client, service-account
key or offline refresh token, or transfer connector credentials to this worker.
Do not extract connector session tokens or put credentials into chat.

Use a private runner's secret store. Configure Gmail OAuth with gmail.readonly
(the worker searches messages, so gmail.metadata is insufficient for this query).
Share ONLY the dedicated spreadsheet with the test service account as Viewer.
The worker requests spreadsheets.readonly. Do not grant domain-wide delegation.

The available Resend key creation API exposes full_access or sending_access only;
sending_access is not sufficient to retrieve sent emails. There is no read-only
key option in that tool. Do not describe a full_access key as least-privilege.
Prefer an existing suitably scoped OAuth/proxy credential if supported; otherwise
resolve the required access before provisioning. No new key was created here.

## Acceptance gates
1. Service-account token reads exact test header and synthetic rows without writes.
2. Gmail read-only refresh works, query succeeds, and metadata can be retrieved.
3. Existing sent message can be retrieved through direct Resend REST; inspect only
   id, recipient, created_at, message_id and last_event, not bodies.
4. Compare those fields to connector observations and run the worker in dry-run.
5. Positive live reply correlation requires a known existing reply; an empty
   sender search does not prove this behavior.
6. Open/click metrics remain unavailable in the worker until an official raw
   metrics contract or verified event source is established.

No raw provider connection has been claimed as passed.

## Official references
https://developers.google.com/workspace/gmail/api/auth/scopes
https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/list
https://developers.google.com/workspace/sheets/api/scopes
https://resend.com/changelog/new-api-key-permissions
https://resend.com/changelog/message-id-for-sent-emails

## Canonical test target and recheck — 22 October 2026
The canonical integration target remains the TEST CRM workbook configured above.
The separate workbook 1OYbeVdYhp87i8nnI3wAvT94_hLej5jOlfYNpVUliWK0
(SYNC_TEST tab) is historical connector-only rehearsal evidence, not a worker target.
It was not renamed, deleted, or connected to the worker. The current configuration
validator rejects SYNC_TEST because test tabs must start with TEST.

Read-only recheck:
- Canonical TEST CRM!A1:J4 has the expected header and synthetic rows.
- Resend domain remains verified; ten recent campaign messages are delivered.
- Connected Gmail profile is visualjambo@gmail.com; a bounded sender search for
  three pilot recipients returned no messages. This does not prove reply routing.
- Existing Resend message detail confirms sender jami@putkikasvu.fi and its
  Message-ID; the connector result does not expose Reply-To. Mailbox routing is
  therefore still unverified.
- Runtime presence-only checks found all six worker credentials absent.
- Four PR-triggered workflows passed at head 36d8be80ad50594cd63221ce58070da50de985dd:
  worker tests, fixture tests, static release checks, Chromium browser QA.
  Worker CI: https://github.com/Jambovisuaalit/putkikasvu/actions/runs/39841430818
- Standalone authenticated worker test: BLOCKED, not run.
- No production CRM changes, sends, credential creation, or release were performed.

Next required input is secure provisioning of a private runner and provider-owned
credentials; connector access cannot be transferred into standalone worker tokens.

## Mailbox routing evidence and credential boundary
A metadata-only read of an existing test message addressed to jami@putkikasvu.fi
confirms Delivered-To: visualjambo@gmail.com and Received hops through the
domain mail provider into Gmail. Additional messages addressed to that domain
mailbox are present in Gmail on 22 October. This proves observed inbound forwarding;
it does not prove a pilot recipient's reply correlation or expose the Resend Reply-To.

Credential provisioning is blocked by the current tool capabilities:
- Google connectors cannot create Cloud service accounts/OAuth clients or supply
  worker-owned offline refresh tokens.
- The Resend key creation action returns the secret into conversation and requires
  displaying it; this does not meet the requested direct-to-secret-store flow.
- No worker credentials are available in the runtime, and no private worker runner
  has been provisioned. The existing static marketing Vercel project is not the runner.
No keys were created or exposed. No authenticated worker run has occurred.

Required secure operator setup:
1. Provision a private Node 22+ runner with no public endpoint or automatic schedule.
2. Create a Sheets service account, enable Sheets API, and share only the canonical
   test workbook as Viewer. Store its email and private key in the runner secret store.
3. Create Gmail OAuth client and offline gmail.readonly grant for the confirmed Gmail
   mailbox; store client ID, client secret and refresh token directly in that store.
4. Resolve Resend read access, create its credential in provider UI and store it
   directly in the runner. Do not use sending_access for a retrieval test.
5. Run provider-specific read checks before full runSync: fixture Resend IDs in the
   canonical test workbook are synthetic and cannot pass real Resend retrieval.
