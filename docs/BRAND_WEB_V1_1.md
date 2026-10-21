# Putkikasvu Brand Master v1.1 – web integration

Source of truth: [Canva – Putkikasvu Brand Master v1.1](https://www.canva.com/folder/FAHYrTHF9cU), [Brand Guidelines v1.1](https://www.canva.com/d/e-PrqDsFZPEtI_5).

## Local assets
- `public/brand/putkikasvu-wordmark-white-v1.1.png`: **official** Canva white transparent horizontal wordmark, 500 × 142 web crop.
- `public/brand/putkikasvu-symbol-v1.1.png`: **official** Canva transparent P-symbol, 192 × 187 web crop.

Images were cropped/resized and color-quantized for efficient delivery. They derive directly from the corresponding original brand assets; they are not redrawn approximations. For high-resolution print, use the original Canva assets rather than these web derivatives.

## Design tokens
- Deep Navy `#061827`
- Industrial Blue `#123C5A`
- Growth Teal `#08B8AD`
- Ice White `#EAF2F4`
- White `#FFFFFF`

Headlines: Manrope 600–800; body: Inter 400–600. Fonts are loaded through `next/font/google` and self-hosted by Next.js at build-time. Interactive primary buttons have **dark navy** text on teal background (not white on teal).

## Scope & release controls
The release candidate starts from `main` and selectively imports brand assets and frontend fixes from `feat/brand-master-v1-1-web`. It does not inherit the experimental branch chain. Main legal content is retained with shared logo, skip-target and on-light label integration. It does **not** merge experimental payment/CRM functions into `main`, configure Supabase, activate Revolut checkout, change Vercel auth, or touch the Zoner DNS/domain.

Run `npm test` and `npm run build`; check desktop/mobile, logo visibility in protected browser, 200% zoom and focus navigation before approving the release.
