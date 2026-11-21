# Build progress

Each phase starts with a fresh reading of `docs/BRIEF.md` and ends with its gate checks and a git commit.

- [x] Phase 0: Foundation. Scaffold, exact dependencies, skills, tokens, fonts, design records, styleguide, copy checks and environment template.
- [x] Phase 1: Engine. Pure analysis library, region packs, labelled fixtures, unit tests, recall and false-positive gate.
- [x] Phase 2: Services. AI providers, threat adapters, redaction, combiner, streaming routes, rate limiting and Turnstile.
- [x] Phase 3: Core UI. Navigation, hero composer, streaming report, annotations, URL anatomy, gauge, verdict stamp and inline icons.
- [x] Phase 4: Story, motion and 3D. Opening hook, chapters, parallax, transitions, four scenes and fallbacks.
- [x] Phase 5: Remaining pages. Patterns, practice, link check, emergency help, insights, methodology and privacy.
- [x] Phase 6: Supabase. Migrations, authentication, history, row security and community submissions.
- [x] Phase 7: Hardening. Monitoring, privacy-safe analytics, security headers, boundaries, metadata, documentation and browser tests.
- [x] Phase 8: Final review. Full brief audit and all definition-of-done checks.

## Phase notes

Phase 0 passed its gate. Build, typecheck, ESLint and copy checks pass. The styleguide contains 39 icons and was reviewed at 1440, 768 and 390 widths. Computed glass blur is 28px on desktop and 16px on mobile. No horizontal overflow was found. Phase 1 passed its gate with 44 tests across 6 files. The rules engine detected 40 of 40 scam fixtures for 100 percent recall and produced 0 detections among 40 legitimate fixtures for a 0 percent false-positive rate. These numbers describe only this authored evaluation set, not real-world performance.

The scoring combiner takes the highest weight per tactic and up to two smaller supporting contributions. Scores from 25 to 54 produce Suspicious. Scores from 55 to 100 produce Likely a scam. Lower scores produce No clear signs of fraud when enough content exists. Short fragments produce Not enough to tell.

Official reporting destinations returned HTTP 200 for cybercrime.gov.in, sancharsaathi.gov.in, uidai.gov.in, incometax.gov.in, reportfraud.ftc.gov, ic3.gov, irs.gov, gov.uk and nhs.uk on 21 November 2026. Action Fraud returned HTTP 403 to an automated request. Its well-known official domain remains listed, but browser access was not verified.

Phase 2 passed its gate with 59 tests across 10 files. Build, typecheck, ESLint and copy checks pass.

Live local route verification with zero keys produced all four NDJSON stages: rules, links, AI and complete. The sample parcel message returned Likely a scam with score 80. The standalone paypa1.example check returned Suspicious with score 52 and identified paypal.com. Every threat source reported unavailable with a not-configured reason. Screenshot upload returned HTTP 503 with code vision_unavailable and a paste-text alternative.

The OpenPhish public feed returned HTTP 200. No Gemini, Bedrock, Web Risk, URLhaus, PhishTank or VirusTotal credentials are present, so those provider calls were not verified live. URLhaus and Web Risk response handling is covered by mocked tests. Web Risk was corrected to its documented GET contract. VirusTotal licence and public-rate constraints are recorded in `docs/DECISIONS.md`.

Phase 3 passed its gate. The production build renders the composer and complete report at desktop, tablet and phone widths with no horizontal overflow. Screenshots are saved as `home-report-1440.png`, `home-report-768.png` and `home-report-390.png`.

Live Gemini verification succeeded with `gemini-3.5-flash`. The parcel sample returned Likely a scam with score 84 and a completed structured provider trace. Screenshot OCR also completed live, extracted India Post, the parcel message, its link and visual cues, then returned Likely a scam with score 89. Text explanations retain a 12-second timeout. Screenshot OCR uses 30 seconds because the successful live request took about 17 seconds.

Phase 4 passed its gate. Skip by button, Escape and scroll all work. The composer accepted input during the intro. Reduced motion hid the intro and kept all five chapters available. ScrollTrigger pinning worked alongside StringTune on native scroll. The StringTune `--progress` variable is connected to the ambient progress layer.

Geometry is procedural React Three Fiber. No Blender MCP connection or Blender executable was available. Hero state follows focus, real analysis duration and actual verdicts. District heights use real pattern counts. The explicit `?nowebgl` path mounted zero canvases and retained the poster and composer. `?nopost` disables postprocessing. No shader errors appeared. Three.js emitted its upstream Clock deprecation warning.

Measured on the local production build in Brave: LCP 248ms, CLS 0 and a 90-frame sample at 60fps. Root JavaScript measured 167KB gzipped including polyfills. The two lazy 3D entries measured 362KB each with their shared chunk. These are local figures, not a device-lab certification.

Phase 5 passed its gate. All navigation destinations and 16 pattern detail pages build and render without horizontal overflow. The standalone lookalike link returned Suspicious with score 52 and five anatomy parts. A keyboard-only practice round scored 12 of 12. Emergency triage produced first-hour, first-day and first-week steps with regional reporting channels. Only the upstream Three.js Clock warning appeared in the route console check.

Phase 6 implementation is complete with 65 tests and a passing build. Migrations include owner-only report and storage policies, no client reads of community submissions, and a security-invoker trend view with a minimum group size of 5. Magic-link auth, history, explicit save, delete and community routes are implemented. Cross-owner access tests pass, and unconfigured APIs return HTTP 503 with clear explanations.

Live database migration and RLS execution were not verified because no Supabase credentials are configured for the app. No remote schema was changed.

Phase 7 passed its gate with all 46 Playwright tests passing. Coverage includes all intro controls, message analysis, screenshot OCR, link checks, keyboard practice, emergency triage, reduced motion, palette, glass blur, axe and console errors at 1440, 768 and 390 widths. The isolated production server runs on port 3002.

The current provider is AWS Bedrock with `us.moonshotai.kimi-k3.1`. Bearer authentication, inference profiles, text Converse and image Converse were verified live. Visible scenes now use animated pixel art instead of WebGL. Unused 3D sources were removed.

Security headers, privacy-safe analytics, Sentry hooks, error boundaries, metadata, OG image, README and Cloudflare WAF notes are included. The README audit reports zero failures and warnings.

Phase 8 is complete. Final build, typecheck, ESLint, copy scan, 65 unit tests and all 46 Playwright tests pass. Dash scans return no matches outside the exempt brief. Secret scans return no matches and `.env.local` is untracked. Source files remain below 300 lines.

Final local measurements: LCP 380ms, shared root JavaScript 168KB gzipped, 50fps during the opening, 60fps when idle, CLS 0.001, and zero canvases. LCP and bundle targets pass. The opening frame-rate target of 60fps and the exact-zero-CLS target are not fully met. No physical mid-range phone was available for a 30fps check.

Live Bedrock text and image Converse calls pass with `us.moonshotai.kimi-k3.1`. Live Supabase RLS execution and live threat-source calls beyond the OpenPhish feed availability check remain unverified. The visible frontend uses animated pixel art with no WebGL dependency.

## Final refinement

- Removed 182 unused 3D packages and fixed all npm audit findings. Current audit is zero vulnerabilities.
- Added `scripts/check-quality.mjs` for the 300-line file limit and made Prettier part of `npm run lint`.
- Added GitHub Actions for install, typecheck, lint, unit tests and production builds.
- Added provider-output parsing tests, provider reuse and bounded in-memory caches.
- Split large stylesheets and preserved every existing visual state.
- Final verification: 69 unit tests and 47 Playwright tests pass. Typecheck, lint, formatting, build and audit pass.
