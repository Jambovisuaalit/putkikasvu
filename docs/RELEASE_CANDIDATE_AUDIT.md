# Putkikasvu — branch and release candidate audit

Audit date: 22.10.2026. Scope: source, branch graph, PRs #1–3, dependencies,
unit/regression tests and static build boundaries. This is not a completed browser,
WCAG or legal audit and is not authorization to merge or promote.

## One release candidate

`release/brand-a11y-static` → `main`, based directly on
`7faa97c800fb8af0b49ae0136c1e672d61937d31`.

The candidate selectively imports the official logo component, PNG assets, layout,
homepage, CSS, brand provenance and tests from `e14629f`. It integrates only the logo,
main-content focus target and accessible label class into main's newer legal pages.
It does not merge any experimental branch or their ancestry.

The deliverable is `out/` generated with `output: 'export'`. There is no Next.js
application server, API handler, Server Action, database schema or mock checkout
in this candidate. Contact CTAs open the user's mail client. No server credentials
or backend feature flags are needed. DNS, authentication protection and live payment
configuration are untouched. The legacy SVG remains unreferenced for compatibility;
all visible headers use the official v1.1 wordmark.

## Branch inventory and tests

All branch snapshots were tested independently using Node 24 and the branch's test
files. Type-stripping was enabled for the experimental TypeScript tests. This does
not constitute an integration or database isolation test.

| Branch | Snapshot | Test result | Candidate decision |
|---|---|---|---|
| main | 7faa97c | 3/4; outdated draft-copy assertion fails | Base; retain newer seller/legal copy |
| feat/stage4-demo-payment-flow | 6b499f2 | 9/9 | Exclude mock order/payment flow |
| feat/secure-orders-revolut-onboarding | 15d52e0 | 17/17 | Exclude all backend and SQL |
| fix/browser-qa-accessibility | b245611 | 17/17 | Select only frontend fixes |
| feat/brand-master-v1-1-web | e14629f | 23/23 | Select only brand/frontend assets and tests |
| release/brand-a11y-static | this PR | 12/12 plus exported HTML validation | Only proposed release candidate |

The candidate has fewer tests because experimental payment/backend tests and their
implementations are deliberately absent. Its test set contains all applicable main
and brand tests plus release-boundary checks. Build runs tests automatically.

## PR topology and conflicts

| PR | Head → base | Observed state | Decision |
|---|---|---|---|
| #1 | secure-orders → stage4-demo | Open draft; mergeable into its base | Keep separate; no backend approval |
| #2 | browser-qa → secure-orders | Open draft; mergeable into its base | Import frontend changes selectively |
| #3 | brand-master → browser-qa | Open draft; mergeable into its base | Import branding selectively; visual gate remains open |

These PRs are a dependency chain, not independent safe changes to main. Merging #3
whole would also introduce `app/api`, `app/demo/testi`, `database/` and `lib/server`.
A dry-run `git merge-tree` against main reports content conflicts in:
`app/page.jsx`, `app/style.css`, `app/ehdot/page.jsx`, `app/tietosuoja/page.jsx`.

Resolution: official brand/homepage and accessible CSS win for frontend presentation;
main's expanded terms/privacy content wins for legal content. A single shared skip
link in layout targets `main-content` on every public page. No conflict markers or
merge commits from the backend chain are carried into the candidate. Do not merge
PRs #1–3 upstream to recreate this candidate.

## Security and dependency findings

| Finding | Severity / scope | Resolution |
|---|---|---|
| Whole brand branch inherits unfinished write/payment handlers | P1 release-scope risk | Eliminated by main-based selective integration and boundary tests |
| Next 15.5.18 and transitive PostCSS/sharp advisories | Critical/high package advisories; exploitability depends on feature exposure | Next 15.5.28; scoped overrides PostCSS 8.5.31 and sharp 0.35.5; locked install and rebuild |
| No committed lockfile or CI release checks | P2 | package-lock.json; Node 22 CI; npm ci/build/audit |
| Main test expects obsolete legal wording | P2 | Assert current pre-launch notice instead; retain complete main legal text |
| Secure-order backend depends on service-role access and sequential checks | Experimental only; not cleared for deployment | Excluded; require isolated DB/Auth A/B tests and atomic onboarding/payment concurrency tests before any future enablement |

Final `npm audit --omit=dev --json` returned an empty vulnerabilities object and
0 critical/high/moderate/low findings. Installed production tree: Next 15.5.28,
React/ReactDOM 19.1.7, PostCSS 8.5.31, sharp 0.35.5. Scoped overrides avoid a broad
Next major-version migration; revisit them when upstream dependency versions catch up.
A registry audit is a snapshot of known advisories, not a guarantee of security.

Advisory references:
- https://github.com/advisories/GHSA-m99w-x7hq-7vfj
- https://github.com/advisories/GHSA-6g55-p6wh-862q
- Other PostCSS/sharp entries were returned by npm audit before remediation.

Limited literal credential-pattern scan of all five branch tips found no private-key,
GitHub-token, Stripe-key or JWT patterns. This is not full history secret scanning.
No credentials were read from deployed environments or configured.

The excluded backend defaults OFF and has owner/staff guards and RLS/revoked grants,
but passing unit tests do not prove actual database policies or concurrent workflow
correctness. SQL was reviewed as text only; no DB was created, modified or queried.

## Verification and acceptance

- Clean `npm ci`: PASS.
- Candidate tests: 12/12 PASS.
- Production static build and exported HTML validation: PASS.
- `/`, `/ehdot`, `/tietosuoja`, `404.html`: generated.
- Local font/image/script/stylesheet URLs in generated HTML resolve.
- One h1, shared skip target, expected anchors, four native FAQ summaries: checked.
- No checkout URL, form submission or Supabase URL in rendered HTML: checked.
- `git diff --check`: PASS.
- Production dependency audit: zero known findings.

Open P0/P1 findings in this static source candidate: **0 identified within this audit's
scope**, subject to the final build passing. This statement does not approve the
excluded backend, attest legal completeness, or certify browser accessibility.

Remaining release gates: authenticated visual/browser QA at 375/390/768/1440 px,
200% zoom, keyboard/FAQ/link/404 behavior; pre-commercial legal/operational details;
owner approval before merge or production promotion. Previous browser authentication
was blocked, so no screenshots or live visual acceptance are claimed here.

## Review procedure

1. Review this one candidate PR against main.
2. Verify its locked install, CI build, static output and vulnerability audit.
3. Complete protected preview browser QA without disabling authentication.
4. Obtain explicit merge/production approval. Keep preview noindex until separately approved.
5. Any later backend launch must use a separate audited PR and isolated staging evidence.
