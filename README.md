# Putkikasvu — static release candidate

Next.js marketing site with the official Canva v1.1 assets and keyboard/navigation fixes.
This candidate starts from main and deliberately excludes experimental checkout, onboarding,
server routes and database migrations. It does not collect form submissions or initiate payments.

## Development and verification

Node.js 22+ and npm:

```sh
npm ci
npm run dev
npm run build
npm audit --omit=dev --audit-level=high
```

`npm run build` runs all release tests, builds a static export into `out/`, and validates
rendered routes, local assets, headings, anchors and payment/write boundaries.
Deploy `out/` only after explicit approval. `next start` is intentionally not a supported
production mode for this static export. No server environment variables are required.

## Release controls

- Do not merge or promote before owner approval.
- Keep Vercel Authentication and preview noindex in place.
- Browser QA at 375/390/768/1440 px, keyboard and 200% zoom remains a separate open gate.
- Contract/privacy text is retained from main and still carries its pre-launch notices.
- DNS, production domain, Revolut and Supabase are outside this PR.
- [Branch audit and candidate decision](docs/RELEASE_CANDIDATE_AUDIT.md)
- [Brand integration provenance](docs/BRAND_WEB_V1_1.md)
- Canva master: https://www.canva.com/folder/FAHYrTHF9cU
