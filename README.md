# ScamShield: message and link fraud checks

ScamShield helps a person inspect a suspicious SMS, WhatsApp message, email, screenshot or link. It returns exact evidence spans, plain explanations, a deterministic score and regional next steps.

- Runs locally with no API keys and identifies which checks actually ran.
- Redacts sensitive numbers before optional Gemini or Bedrock analysis and rejects invented evidence spans.
- Keeps every threat source independent and visible, including failures and unconfigured sources.
- Stores nothing by default. Saving requires an account and an explicit action.

## Challenge vertical and approach

**Vertical:** Cybersecurity.

**Persona:** A non-technical person on a phone who is worried about a bank, delivery or government message.

**Approach and logic:** Normalise text, extract URLs and entities, apply deterministic regional rules, redact sensitive numbers, optionally call a structured AI provider, then combine evidence without allowing AI to lower the score. Every source remains visible so the user can understand the result and choose an appropriate action.

**Assumptions:** Examples are in English and use reserved domains. Region packs need periodic verification. Fixture metrics describe only the authored evaluation set. No integration is required for basic analysis, and no result proves that a message is genuine.

## Quickstart

Requires Node.js 22 or newer and npm. pnpm also works if installed.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. To use another port:

```bash
npm run dev -- -p 3001
```

For a production check:

```bash
npm run build
npm run start -- -p 3001
```

## Configuration

Copy `.env.example` values into your local environment or hosting settings. Do not commit local environment files. Every integration is optional.

### Bedrock and Gemini

The current provider is AWS Bedrock with `BEDROCK_API_KEY`, `AWS_REGION` and `BEDROCK_MODEL_ID=us.moonshotai.kimi-k3.1`. Bearer authentication, the inference profile, text Converse and image Converse were verified live. This model rejects the temperature field, so the provider omits it only for Kimi. Standard AWS access credentials also work when configured.

Gemini is used when Bedrock is not configured. Set `GEMINI_API_KEY` and `GEMINI_MODEL`. The working example is `gemini-3.5-flash`. Model availability varies by account and time. No model name is hardcoded as a source fallback.

Without a vision provider, text and link analysis still works. Screenshot upload returns a clear unavailable response. With a provider, OCR runs before the same rules and explanation pipeline.

### Other integrations

- AWS access keys are optional when `BEDROCK_API_KEY` is present. Bedrock is disabled without a model and authentication.
- Threat sources use their own settings in `.env.example`. URLhaus and VirusTotal require keys. VirusTotal public API has rate and licence limits. PhishTank key availability needs an account check.
- Upstash provides distributed rate limiting and one-hour threat-result caching. Without it, rate limits are per process.
- Turnstile is verified server-side when configured. For local widget testing, use Cloudflare's published dummy site and secret keys from its official documentation. Leave both unset to skip cleanly.
- Supabase enables magic-link auth, saving and history only when public values and the service-role key are present. Apply `supabase/migrations/20261121120000_scamshield.sql` to your own project first.

## Cloudflare and deployment notes

Terminate TLS at Cloudflare and preserve `X-Forwarded-For` only from your trusted proxy. Do not accept spoofed forwarding headers directly from clients. Add WAF rules for large uploads, unsupported content types and repeated analysis calls. The app also applies per-IP limits, but distributed limits need Upstash.

Use Cloudflare Turnstile on anonymous analysis. Signed-in users receive the higher limit. Keep the service-role key only on the server. Do not expose it in `NEXT_PUBLIC_` variables.

The app sends a strict content security policy, `frame-ancestors none`, referrer and permissions policies. Next.js runtime scripts and the Turnstile origin are explicitly allowed. No third-party frame can embed the app.

## Code quality controls

- `npm run lint` enforces ESLint, banned copy, the 300-line file limit and Prettier formatting.
- `npm test` covers the deterministic engine, provider parsing, security boundaries and regional packs.
- Playwright validates all public routes at three widths, including axe accessibility, overflow, palette and real user flows.
- GitHub Actions runs install, typecheck, lint, unit tests and the production build on every push and pull request.
- Unused 3D packages were removed to reduce install size and dependency surface.

## Checks

```bash
npm run typecheck
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Equivalent pnpm commands are `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build` and `pnpm test:e2e`.

The unit suite includes 80 labelled messages: 40 scams and 40 legitimate hard negatives. Current measured result is 100 percent recall and 0 percent false positives on that authored set. This is not a real-world accuracy claim.

Playwright covers the opening hook, analysis, OCR when configured, link checks, keyboard practice, emergency triage, reduced motion, accessibility, console errors and layouts at 1440, 768 and 390 widths.

## Structure

```text
src/lib/analysis       Pure rules, extraction, regions and scoring
src/lib/intel          Optional threat adapters and URL expansion
src/lib/llm            Gemini, Bedrock, validation and retries
src/lib/server         Routes, protection and report orchestration
src/lib/supabase       SSR auth and saved-report mapping
src/features           Composer, report, scenes, practice and pages
supabase/migrations    Tables, RLS, storage and trend view
fixtures               Labelled evaluation messages
tests/unit             Deterministic engine and service tests
tests/e2e              Browser and accessibility checks
docs                   Build records, design and screenshots
```

## Measured local build

Final production measurements on this machine: LCP 380ms, shared root JavaScript 168KB gzipped, 60fps when idle and 50fps during the opening. CLS is 0.001, so exact-zero CLS and opening frame-rate targets are not fully met. No physical mid-range phone was available for a device-lab frame-rate check.

## Known limits

Rules can miss new scams and can flag genuine urgent messages. Threat feeds can be incomplete. AI explanations and OCR can be wrong. A clean result never proves that a message is genuine. Verify important claims through an official app, website or phone number.

Live Supabase migration and RLS execution were not verified in this environment. Visible scenes use animated pixel art rather than WebGL. The first procedural 3D implementation was removed to reduce frontend weight.
