# ScamShield: Master Build Brief (v2, glass and persimmon)

You are a senior product engineer, creative developer and designer working alone. Build the complete project described below from scratch in the current folder. The folder is empty. Everything in it has been deleted on purpose. Read this entire brief before writing any code.

Work autonomously. Do not ask questions. Make decisions and keep moving. The only exception is a missing secret: if a key is absent, continue in degraded mode and say so in your final report.

First actions, in this order:

1. Save this brief to `docs/BRIEF.md`. Create `docs/PROGRESS.md` as a checklist of the phases in section 12. Re-read `docs/BRIEF.md` at the start of every phase. Commit to git after every phase.
2. Install the agent skills described in section 4.2 and read them before writing any animation or design code.

## 1. The problem and the product

**Domain:** Cybersecurity.

**Problem statement:** With the increasing use of digital communication, people frequently receive fraudulent SMS messages, WhatsApp messages and suspicious links pretending to be from banks, delivery services and government organisations. Many individuals struggle to distinguish between genuine and fraudulent messages. Develop a web application that helps users identify potentially fraudulent messages and understand the risks associated with suspicious digital communication.

**Product:** ScamShield. A person pastes a message, uploads a screenshot, or pastes a link. They get a clear verdict, the exact warning signs highlighted inside the message, a plain explanation of each tactic, an inspection of every link, and region-specific steps for what to do next. The product also teaches: a pattern library, a practice game, and an "I already clicked or paid" emergency flow.

The product must be useful on a phone, in a hurry, by a non-technical person who is worried. Design every decision for that person first. The visual, motion and 3D layers exist to make the product memorable and the explanations easier to grasp, never to get in the way of the tool.

## 2. What went wrong in earlier attempts (do not repeat any of this)

Earlier builds were rejected as generic AI output. Specific failures:

1. The default "cybersecurity template" look: neon cyan or teal on near-black with purple and pink accents.
2. A small label above every heading ("MESSAGE ANALYSIS", "THE EVIDENCE CHAIN"). Banned.
3. Tagline headlines: "Suspicious? Don't guess.", "Not just a risk label. A reason to act.", "From maybe to what next.", "One check can stop a costly mistake." Banned. No slogans, no rhetorical questions, no "Not X. Y." constructions.
4. Three icon cards in a row with an icon in a rounded square, a number in the corner and a tiny tag. Banned. A three-item feature strip of icon, bold word and grey caption. Banned.
5. Floating callout chips around the 3D object with fake product claims. Banned.
6. A generic low-poly city on a disc with no link to what the product does.
7. A fake "Analysis online" status dot. Never show a status that is not real.
8. The tool buried below a hero that only talked about itself. The tool is the hero.
9. Glass done badly, which is the new risk: grey text on translucent panels with poor contrast, glass stacked on glass on glass, blur over a flat empty background where it shows nothing, and blur so heavy the page janks on a phone.

Run this list as a test on your own work before every commit.

## 3. Non-negotiable rules

### 3.1 Copy

- **No em dashes and no en dashes anywhere**: UI copy, code comments, docs, commit messages, tests, markdown. Use a period, comma, colon or parentheses). Write numeric ranges as "10 to 20".
- **No taglines.** Section headings name their content: "How a check works", "Common scam patterns", "Practice spotting scams", "If you already clicked, paid or shared a code", "Methodology and limits".
- **No eyebrow labels** or pill badges above headings.
- Plain, calm, direct sentences. Sentence case. No exclamation marks. No emoji.
- Banned words and phrases: seamless, elevate, unleash, empower, cutting-edge, revolutionize, next-gen, supercharge, leverage, robust, harness, "powered by AI", "peace of mind", "stay safe out there", "world-class", "state-of-the-art", "in today's digital world".
- No fake social proof: no "trusted by", testimonials, invented user counts, invented statistics or partner logos. Every number shown must come from real data in the app or be labelled as an example.
- Story captions in the opening sequence (section 6.1) are allowed because they describe one concrete scenario in plain sentences. They are not slogans. Use the captions given there.
- No lorem ipsum, no TODO in shipped code, no dead links. Every navigation item leads to a finished page.
- Never tell a user a message is "safe". The best verdict is "No clear signs of fraud", and it always carries a caveat.
- Sample messages use reserved domains (`.example`, `.test`) so no real site is ever pointed at.

Ship `scripts/check-copy.mjs` that scans `src/`, `docs/` and `README.md` for em dashes (U+2014), en dashes (U+2013) and the banned words above, and exits non-zero on any hit. Exclude `docs/BRIEF.md` because it quotes the banned examples on purpose. Write the dash characters in the script as escape sequences so the script file stays clean. Wire it into `pnpm lint`.

### 3.2 Visual

- Palette is **persimmon and white with black text**. Nothing else is used decoratively. No purple, blue, cyan, teal or pink anywhere. No gradient text. No dark theme (light only, `color-scheme: light`).
- Glass is the main surface language, used with discipline (section 5.3). Rounded, curved, soft. No sharp 90 degree panels.
- Do not ship shadcn defaults. Use shadcn/ui and Radix only for accessible behaviour (Dialog, Tabs, Tooltip, Select, Sheet, Accordion, Sonner), restyled completely to this design system.
- No identical three-column feature rows. No icon-in-square cards. No hover lift on every card.
- Icons are custom (section 5.5). Lucide is not used in product UI.

### 3.3 Engineering

- TypeScript strict. No `any`. Zod at every boundary (request bodies, AI output, third-party responses, env).
- Files under 300 lines. Feature-based structure. Server-only code marked with `server-only`.
- Every async surface has a designed loading, empty and error state.
- Never hardcode a secret. Never print a secret. Never commit `.env*` except `.env.example`.
- The app must run end to end with zero API keys (rules engine only) and say in the UI which checks actually ran.

## 4. Tech stack (exact)

Use the latest stable version of each at install time. Pin the exact installed versions in `package.json` and list them in `docs/STACK.md`. Use pnpm if available, otherwise npm. Check peer dependency compatibility. Do not silently downgrade React.

### 4.1 Packages

| Area                | Packages                                                                                                                                                                                                    | Notes                                                                                                                                    |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Framework           | `next` (App Router, Turbopack), `react`, `react-dom`, `typescript`                                                                                                                                          | React 19, strict TS                                                                                                                      |
| Styling             | `tailwindcss` v4, `@tailwindcss/postcss`, `tw-animate-css`, `class-variance-authority`, `clsx`, `tailwind-merge`                                                                                            | design tokens as CSS variables in `@theme`                                                                                               |
| UI behaviour        | `shadcn` CLI, `radix-ui`, `sonner`                                                                                                                                                                          | restyled to glass                                                                                                                        |
| Timeline animation  | `gsap`, `@gsap/react` (`useGSAP`)                                                                                                                                                                           | plugins: `ScrollTrigger`, `SplitText`, `DrawSVGPlugin`, `MorphSVGPlugin`, `Flip`, `CustomEase`. All ship free in current `gsap`; verify. |
| UI animation        | `motion` (motion.dev)                                                                                                                                                                                       | import from `motion/react` in components and from `motion` for vanilla `animate`, `scroll`, `inView`, `stagger`                          |
| Scroll and parallax | StringTune. Install from npm. The package is published by Fiddle Digital, most likely `@fiddle-digital/string-tune`. Verify the exact name and API with `npm view` and the official docs before installing. | owns parallax, scroll progress and cursor effects                                                                                        |
| 3D                  | `three`, `@types/three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `postprocessing`, `zustand`                                                                              | glass materials, section 7                                                                                                               |
| Backend             | `zod`, `server-only`, Next.js Route Handlers on Node.js runtime                                                                                                                                             |                                                                                                                                          |
| Data                | `@supabase/supabase-js`, `@supabase/ssr`                                                                                                                                                                    | Postgres, Auth, Storage, RLS                                                                                                             |
| AI                  | `@google/genai` (Google AI Studio, Gemini), `@aws-sdk/client-bedrock-runtime` (Bedrock Converse API)                                                                                                        | Gemini is the default working provider                                                                                                   |
| Threat intel        | plain `fetch` adapters for Google Web Risk, URLhaus, PhishTank, OpenPhish feed, VirusTotal                                                                                                                  | no SDKs                                                                                                                                  |
| Protection          | `@upstash/redis`, `@upstash/ratelimit`, Cloudflare Turnstile (script and server verify), `@sentry/nextjs`                                                                                                   |                                                                                                                                          |
| Analytics           | `posthog-js`, `posthog-node`                                                                                                                                                                                | no message content, ever                                                                                                                 |
| Charts              | `recharts`, `d3`, `@types/d3`                                                                                                                                                                               |                                                                                                                                          |
| 3D assets           | Blender with Blender MCP, `@gltf-transform/cli`                                                                                                                                                             | GLB, Draco                                                                                                                               |
| Testing             | `vitest`, `@vitest/coverage-v8`, `@playwright/test`, `@axe-core/playwright`                                                                                                                                 |                                                                                                                                          |
| Tooling             | `eslint`, `prettier`                                                                                                                                                                                        |                                                                                                                                          |

**Not used:** Lenis (StringTune owns smooth scroll), Framer Motion under its old name (use `motion`), Lucide in product UI. Any other dependency needs a written reason in `docs/DECISIONS.md`.

### 4.2 Agent skills (install first)

Before writing code, find and install agent skills for: GSAP, Motion, StringTune (if one exists), and frontend design quality. Verify each repository exists by searching GitHub, npm and the library's official docs. Do not guess repository names. Use the skills CLI (`npx skills add <owner/repo>`) or copy the skill folder into the directory your agent loads skills from (check the opencode docs: `.opencode/skills/` or `.claude/skills/`). Record what was installed, from where, and what was not found in `docs/SKILLS.md`. Read each `SKILL.md` before using that library. If a skill does not exist, say so in `docs/SKILLS.md` and work from the official documentation instead.

### 4.3 Which library owns what

One library owns a given property on a given element. Never let GSAP and Motion animate `transform` on the same node. Wrap in an extra element when needed.

- **StringTune:** parallax depth layers, scroll progress variables for ambient layers, smooth scroll if it coexists with ScrollTrigger, magnetic effects, cursor and pointer-follow highlights. Read its docs. If its smooth scroll conflicts with ScrollTrigger pinning, run StringTune on native scroll for parallax only, let ScrollTrigger own pinning, and write the decision in `docs/DECISIONS.md`.
- **GSAP with ScrollTrigger:** the cinematic timeline (opening sequence, pinned story chapters), SplitText line reveals, DrawSVG for icons, MorphSVG, Flip for layout handoffs, the page transition timeline, and the shared scroll progress value that drives the 3D camera.
- **Motion:** component state animation. Composer, tab indicator with `layoutId`, report reveal and stagger, swipeable practice cards (drag), toasts, `AnimatePresence`, hover and press springs, gauge needle spring, the floating nav's scroll morph through `scroll()` or `useScroll`.

### 4.4 AI keys

- `GEMINI_API_KEY` is supplied by the user in `.env.local`. Do not ask for it in chat. Do not print it. Do not write it into any tracked file.
- Do not hardcode model names. Read `GEMINI_MODEL` and `BEDROCK_MODEL_ID` from env. At setup, list the models the Gemini key can access and choose the latest fast vision-capable model as the default in `.env.example`. Verify against current Google and AWS documentation.
- With no AWS credentials, Bedrock is disabled and the UI never claims it ran.

## 5. Design system

**Concept:** a bright, curved, glass interface in the spirit of Apple's marketing pages. Warm white field, persimmon colour used as light and shape, black type, big rounded surfaces that catch the colour behind them.

### 5.1 Palette (CSS variables mapped into the Tailwind theme)

| Token             | Value                 | Use                                                   |
| ----------------- | --------------------- | ----------------------------------------------------- |
| `--white`         | `#FFFFFF`             | highlights, glass edges                               |
| `--snow`          | `#FFF9F4`             | page base                                             |
| `--cream`         | `#FFF1E6`             | section tint                                          |
| `--persimmon-100` | `#FFE3D1`             | soft fills                                            |
| `--persimmon-200` | `#FFC7A3`             | backdrop shapes                                       |
| `--persimmon-300` | `#FFA571`             | backdrop shapes                                       |
| `--persimmon-400` | `#FF8340`             | accents, icons                                        |
| `--persimmon-500` | `#FF6A1F`             | primary                                               |
| `--persimmon-600` | `#EC5800`             | pressed, strong accent                                |
| `--persimmon-700` | `#BF4600`             | text accent on white (check contrast)                 |
| `--ink`           | `#0A0A0A`             | all primary text                                      |
| `--ink-2`         | `rgba(10,10,10,0.70)` | secondary text                                        |
| `--ink-3`         | `rgba(10,10,10,0.58)` | tertiary text, minimum 4.5:1 on its actual background |
| `--alarm`         | `#D92D1A`             | "Likely a scam" only                                  |
| `--caution`       | `#F5A300`             | "Suspicious" only                                     |
| `--ok`            | `#1F9D55`             | "No clear signs of fraud" only                        |

Rules: text is black. White text appears only on black elements. White on persimmon fails contrast, so persimmon buttons carry black text. Every verdict is shown by label, icon and shape as well as colour. Verify all text contrast with axe on top of the real glass and backdrop, not on flat swatches.

### 5.2 Typography (Apple style)

- Font stack for display and body: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", var(--font-inter), system-ui, sans-serif`. Do not bundle SF files (licence). Load **Inter** through `next/font/google` with the `opsz` axis as the cross-platform fallback.
- Data (URLs, IDs, phone numbers, code): `ui-monospace, "SF Mono", var(--font-geist-mono), monospace`, with Geist Mono loaded as the fallback.
- Display: weight 600 to 700, tracking -0.03em to -0.04em, leading 0.98, sizes `clamp(2.75rem, 8vw, 8rem)`. Body 17px on desktop, 16px on mobile, leading 1.5, tracking -0.01em. Use `font-feature-settings` for tabular numbers on data and scores.
- Hierarchy by size and weight, not by colour.

### 5.3 Glass recipe

Define three utilities and use only these:

- `.glass`: `background: rgba(255,255,255,0.58)`, `backdrop-filter: blur(28px) saturate(170%)`, `border: 1px solid rgba(255,255,255,0.75)`, `box-shadow: inset 0 1px 0 rgba(255,255,255,0.95), inset 0 -1px 0 rgba(255,140,60,0.12), 0 1px 2px rgba(10,10,10,0.04), 0 18px 48px -12px rgba(236,88,0,0.22)`.
- `.glass-strong`: white at 0.80 opacity, blur 40px. Use for text-heavy panels such as the report so contrast holds.
- `.glass-tint`: `rgba(255,106,31,0.14)` fill for highlighted or active states.

Rules:

- Glass must sit over something that shows through: persimmon shapes, 3D objects or parallax layers. Never over flat white.
- Maximum three stacked blurred layers in view. Blur radius is never animated. Reduce blur to 16px on mobile. Provide a `@supports not (backdrop-filter)` fallback of white at 0.92 opacity.
- A subtle specular highlight on glass follows the pointer on desktop (CSS variables set through StringTune or `pointermove`).
- Text-heavy content uses `.glass-strong`. Never put body text on `.glass` over a busy area.

### 5.4 Shape and layout

- Radius scale: 12 small controls, 20 inputs, 28 cards, 40 hero and section panels, full pill for buttons, chips and the nav. Inner radius equals outer radius minus padding.
- 12-column grid, max width 1320, 24px gutters, 8px base spacing. Generous space around the hero, density inside the report.
- Elevation comes from glass edge highlights and soft persimmon-tinted shadows, never grey drop shadows.
- Fine paper grain at about 3 percent opacity over the snow base.
- **Parallax backdrop:** every page has three to five depth layers: persimmon organic shapes and curved ribbons in the back (slow), glass cards in the middle, small details in the front (fast). Layers move at different speeds through StringTune. Shapes are in tints `--persimmon-100` to `--persimmon-400` so glass has colour to pick up.

### 5.5 Custom icons (no icon library)

Draw a full set by hand as React SVG components in `src/components/icons/`.

- Style: 24px grid, 1.75px black stroke, round caps and joins, 3px corner radius, soft duotone: one filled persimmon shape per icon plus a white 60 percent highlight arc for a glass feel. Provide a mono black variant.
- Set (at least 36): shield, shield-check, shield-alert, message, message-alert, chat, email, link, link-broken, hook, scan, loupe, bank, parcel, government-building, phone, phone-call, qr, rupee-pay (generic, no trademarked logo), key, otp-field, lock, unlock, eye, flag, report, share, clock, globe, user-alert, id-card, money, screenshot, check, cross, warning, info, copy, arrow-up-right. Do not copy any brand logo.
- `<Icon name size />` and `<InlineIcon name />`. **Inline icons sit inside running text and headlines.** Each renders as a 1.05em glass chip with 0.35em radius, aligned with `vertical-align: -0.18em`, and scales with the font size. Example: "Check a suspicious [message icon] message before you [hook icon] reply." Provide a small rich-text helper that lets copy contain tokens like `{icon:message}`.
- Motion: DrawSVG stroke draw when icons enter view (GSAP), a small hover response through Motion. Document every icon on `/styleguide`.

Write `docs/DESIGN.md` first (tokens, type scale, glass recipe, icon spec, motion tokens, components). Build `/styleguide` before any page.

## 6. Motion, parallax and the cinematic story

Motion is a primary feature. It must feel authored.

**Motion tokens:** entrances `cubic-bezier(0.16, 1, 0.3, 1)` (GSAP `expo.out`, define a `CustomEase` for it); long transitions `expo.inOut`; micro interactions 160 to 240ms; large moves 600 to 1000ms; springs for anything the user touches (stiffness around 300, damping around 30 in Motion).

### 6.1 Opening hook: "The Text" (first visit per session, about 9 seconds)

A single GSAP master timeline. Shown once per session (guard with `sessionStorage` in try/catch). Skippable from the first frame with a visible glass "Skip" pill, the Esc key, or any scroll. Skipping calls `timeline.progress(1)` and lands on the final hero state. The composer is focusable at all times and the intro never blocks the tool. With reduced motion the intro is replaced by the static final state. The H1 exists in the DOM from the first paint so LCP is not delayed.

| Time | What happens                                                                                                                                                                                                                                 | Caption (exact)                                      |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| 0.0s | Snow background, grain, persimmon shapes drifting slowly. A small glass status pill reads 9:12.                                                                                                                                              | none                                                 |
| 0.6s | A large glass notification card drops in with a Motion spring and a small haptic-style wobble. Text types in: sender name, then "Your parcel is held at customs. Pay Rs 49 to release it." and a link to `indiapost-redelivery.example/pay`. | "A text arrives on a Tuesday morning."               |
| 2.5s | Parallax layers separate and the camera pushes in. The payment phrase is underlined in persimmon.                                                                                                                                            | "It says your parcel is held and asks for Rs 49."    |
| 4.5s | The link magnifies. Its characters split apart and one wrong letter glows.                                                                                                                                                                   | "The sender name looks right. The link almost does." |
| 6.5s | A round glass loupe sweeps across the card. Three glass chips pop out of the message: urgency, payment demand, lookalike link.                                                                                                               | "ScamShield reads it before you tap."                |
| 8.0s | The card shrinks into its hero position on the right, the composer rises from below, and the H1 reveals line by line with SplitText masks. Scroll unlocks.                                                                                   | none                                                 |

### 6.2 Story chapters (after the hero)

One pinned ScrollTrigger timeline of about 500vh with StringTune parallax layers running beneath it. Five chapters, each with real functional copy in the DOM:

1. **The message:** risky phrases lift off the card as glass chips.
2. **The link:** the URL splits into scheme, subdomain, domain, TLD and path. A lookalike character is compared against the real brand.
3. **The sources:** the domain sends lines to small glass nodes named after the real sources (URLhaus, Google Web Risk, OpenPhish, VirusTotal) that light up one by one.
4. **The verdict:** the shield assembles from glass shards and the verdict lands.
5. **What to do:** the checklist unfolds and the camera pulls back to reveal the district map (section 7, scene 3).

### 6.3 Everywhere else

- **Floating nav:** a centred glass pill that morphs smaller on scroll (Motion `scroll()`), with an active-tab indicator using `layoutId`.
- **Buttons:** magnetic on desktop, press scale 0.97, a persimmon fill that sweeps in on hover.
- **Cards:** tilt up to 6 degrees on desktop for non-text cards only, with a moving specular highlight.
- **Page transitions:** a persimmon glass sheet with a rounded leading edge wipes across (GSAP timeline), the route changes, the sheet exits.
- **Report reveal:** driven by real pipeline stages, never a fake loader. Rule signals appear first (under 300ms), then link checks, then the AI explanation. Highlights sweep in like a marker, tactic rows stagger, the gauge needle moves on a spring, the verdict stamp lands with a short overshoot. Only "Likely a scam" gets a 2px shake.
- **Practice game:** swipeable cards (Motion drag), rotation tied to drag distance, keyboard arrows as alternatives.
- **Loading:** glass skeletons with a slow shimmer.
- **Reduced motion:** disable scrub, shake, parallax, tilt, magnetic and wipe. Keep fades. All information stays available.

## 7. 3D direction (glass)

**Language:** frosted white glass and persimmon enamel. Smooth, curved, rounded forms to match the UI (not faceted low-poly). Soft white studio light, persimmon-tinted contact shadows, a faint grain. No dark scenes.

**Architecture:** one root R3F `Canvas` with Drei `View` components tracking DOM elements so scenes share one WebGL context. If `View` proves unstable, use one lazy `Canvas` per scene with at most two mounted at once. Load the 3D chunk after first paint through `next/dynamic` (`ssr: false`) and show a pre-rendered WebP poster until ready.

**Materials:** Drei `MeshTransmissionMaterial` for glass (low `samples`, `resolution` 512, small `chromaticAberration`), persimmon enamel for the hook and accents, frosted white for cards. On mobile and low-end devices, replace transmission with `MeshPhysicalMaterial` and an environment map. Use `Environment` with `Lightformer` panels. Postprocessing is light: SMAA and a very subtle Noise.

**Scenes:**

1. **The Intercept (hero):** the glass notification card from the opening hook, now in 3D beside the composer, with a few drifting glass message cards, a glass shield and a persimmon hook on a thin line. It reacts to real state: composer focus slows it and dollies in; submit sweeps a scan loupe across the card for the real analysis duration; "Likely a scam" pulls the line taut, tints the card persimmon and locks the shield in front; "Suspicious" wobbles it with an amber edge; "No clear signs of fraud" releases the hook and calms the card; "Not enough to tell" turns it slowly and holds neutral.
2. **Story chapters:** the same objects, camera scrubbed by the chapter progress value.
3. **District map (patterns page, and the end of chapter 5):** a small glass-and-persimmon city with three districts, Banks, Delivery and Government. Building height equals the number of patterns in that district (real data). Hover lights a building. Clicking a district flies the camera and filters the pattern list.
4. **Verdict model (report page):** a compact shield and card pair mirroring the verdict.

**Assets:** model in Blender through Blender MCP. First verify connectivity with a trivial command. If it is unavailable, say so and build the geometry procedurally in R3F (rounded extrusions, `RoundedBox`, lathe shapes). Never pretend. Assets: `message-card.glb`, `hook.glb`, `shield.glb`, `city-blocks.glb`. Name materials consistently. Optimise with gltf-transform (dedup, prune, weld, quantize, Draco), each under 250KB and all under 1.5MB, scripted in `scripts/optimize-models.sh`. Everything is made in this project. No downloaded assets.

**Performance and accessibility:** DPR clamped to `[1, 1.75]`, `frameloop="demand"` when no scene is in view, pause offscreen. The canvas is `aria-hidden`; everything shown in 3D also exists in the DOM. Targets: LCP under 2.0s, CLS 0, 60fps on a mid-range laptop, 30fps minimum on a mid-range phone, initial JS under 200KB gzipped excluding the lazy 3D chunk and the motion libraries loaded after hydration.

## 8. Product specification

### 8.1 Pages

| Route                              | Purpose                                                                                                       |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `/`                                | Hero with the composer, How a check works (Scene 2), pattern preview, practice teaser, emergency flow, footer |
| `/report/[id]` and in-page result  | The case-file report                                                                                          |
| `/link-check`                      | Standalone link inspection                                                                                    |
| `/patterns` and `/patterns/[slug]` | Pattern library with the district map (Scene 3)                                                               |
| `/practice`                        | Swipe game                                                                                                    |
| `/help`                            | "I already clicked, paid or shared a code" triage                                                             |
| `/insights`                        | Charts (D3 and Recharts) from real data only                                                                  |
| `/methodology`                     | How scoring works, data sources, known limits, false positives                                                |
| `/privacy`                         | Plain-language data handling                                                                                  |
| `/history`, `/auth`                | Optional account, saved reports                                                                               |
| `/styleguide`                      | Dev only                                                                                                      |

### 8.2 Home hero (exact content)

- H1: **Check a suspicious message before you reply.** Include two inline custom icons inside the sentence (a message icon after "suspicious" and a hook icon before "reply").
- Sub: **Paste an SMS, WhatsApp message, email or link. You get the warning signs, what they mean, and what to do next.**
- Left, six columns: H1, sub, then the composer directly under it inside a large `.glass-strong` panel (radius 40). Tabs: Message, Screenshot, Link. Autosizing textarea. Channel chips auto-detected (SMS, WhatsApp, Email, Unknown) and editable. Primary pill button: **Check message** (persimmon with black text). Beneath: three real sample chips. Beneath that, one line: **Nothing is saved unless you choose to save the report.** (This must be literally true.)
- Right, six columns: scene 1, the glass notification card and shield, overlapping the panel edge so the glass refracts it.
- Header: floating centred glass pill with the custom wordmark and mark, links Check, Patterns, Practice, Link check, Insights, a region selector, and a persimmon pill **I already clicked** that goes to `/help`. No status indicators.

### 8.3 The report (case-file layout)

1. **Case header:** short case ID (derived from the real report ID), timestamp, channel, region.
2. **Verdict:** one of **Likely a scam**, **Suspicious**, **No clear signs of fraud**, **Not enough to tell**. Large stamp, risk score 0 to 100 on the gauge with a link to the methodology, and a confidence indicator shown separately from the score.
3. **Annotated message:** the original text with every flagged span highlighted. Hovering or focusing a span reveals the tactic. Clicking scrolls to its tactic row.
4. **Tactics:** urgency, impersonation, payment demand, credential or OTP request, authority pressure, too-good-to-be-true, secrecy, threat of loss. Each row has the evidence quote, a plain explanation, and a confidence.
5. **Links:** URL anatomy view with each part explained, lookalike character comparison (for example `paypa1.com` against `paypal.com`), shortener and punycode detection, IP hosts, `@` tricks, suspicious TLDs, brand mismatch. Below it a status row per threat source: clean, flagged, not checked, or error with the reason. Never hide a failed source.
6. **Sender:** short code against long number, foreign country code on a message claiming to be local, display-name spoofing for email.
7. **What to do now:** ordered, verdict-specific, region-specific steps with copy buttons.
8. **Why this might be wrong:** limits and false-positive hints, always present.
9. **What was sent to AI:** collapsible view of the redacted text actually transmitted.
10. **Share with someone:** copyable plain-text summary that excludes the original message by default.

### 8.4 Other features

- **Pattern library:** at least 14 scam types with a real example message, annotated anatomy, tactics tags and region-specific advice. Include: bank KYC update, card blocked, UPI collect request, delivery fee, customs parcel, toll or traffic fine, electricity disconnection, tax refund, government benefit, prize or lottery, job task scam on WhatsApp, loan app harassment, impersonated relative, "digital arrest" call script, fake support number, QR code payment trap.
- **Practice:** 12 cards per round drawn from the pattern library and from legitimate-message fixtures (OTPs, bank debit alerts, delivery updates). Reveal reuses the report's annotation component. End screen shows score and the tactics you missed most.
- **Emergency flow (`/help`):** questions: what did you do (clicked a link, entered a password, shared an OTP, paid money, installed an app, shared an ID document). Output a time-ordered checklist for the first hour, the first day and the first week. Include region-specific reporting channels. On the home page it is the one full-bleed persimmon glass section. It is the base style of `/help`.
- **Region packs:** India, United States, United Kingdom, plus a generic fallback. Each pack holds scam types, brand lists, official domains, sender conventions and reporting channels. The India pack covers UPI, KYC, Aadhaar and PAN lures, FASTag and traffic challans, electricity bill threats, and TRAI or telecom disconnection scares. Starting points to verify against official sources at build time: India (cybercrime.gov.in, helpline 1930, Sanchar Saathi and its Chakshu fraud reporting, the bank's official number from the card or website), United States (reportfraud.ftc.gov, forward texts to 7726, ic3.gov), United Kingdom (forward texts to 7726, report@phishing.gov.uk, Action Fraud). Put a `lastVerified` date on every pack and only include domains and numbers you are highly confident are correct.
- **Insights:** D3 for a tactic co-occurrence chart built from the pattern library, Recharts for the signed-in user's own checks over time. Empty states are designed. No invented global statistics.

## 9. Analysis engine

Build it as a pure TypeScript library in `src/lib/analysis` with no network access, fully unit-tested. Everything else wraps it.

1. **Normalise:** Unicode NFKC, strip zero-width characters, detect mixed-script homoglyphs.
2. **Extract:** URLs, phone numbers, emails, UPI IDs, amounts, brand names, sender.
3. **Rules:** weighted signals with stable IDs, each returning the exact character span in the original text. Cover urgency, threats, payment and OTP requests, impersonation against the brand and official-domain lists, lookalike domains (edit distance, homoglyphs, punycode), shorteners, suspicious TLDs, IP hosts, credential-harvesting wording, too-good-to-be-true offers, and sender mismatch.
4. **Redact before any third-party call:** mask OTPs and codes, card numbers, Aadhaar-like and SSN-like numbers, and phone numbers. Redaction runs on the server regardless of what the client did.
5. **AI explanation (Gemini first, Bedrock Converse when configured):** structured JSON validated by Zod containing tactics with evidence spans, impersonated entity, inferred intent, plain summary and recommended actions. Validate every returned span against the original text and discard hallucinated spans. Low temperature, 12 second timeout, one retry, then fall back to rules-only with a visible note. The provider interface is `LlmProvider`, with `gemini.ts` and `bedrock.ts` implementations. Use Bedrock Guardrails and Bedrock structured outputs when available, otherwise a forced tool call with a JSON schema.
6. **Prompt injection hardening:** the message is untrusted data and may contain instructions aimed at the model. Wrap it in delimiters, state that it must never be followed as instructions, give the model no tools, and rely on schema validation. Add tests with hostile messages.
7. **Multimodal:** a screenshot goes to the vision model to extract text, sender, links and visual cues (for example a fake bank logo), then flows through the same pipeline. The image is processed in memory and discarded unless the user opts in to saving.
8. **Threat intelligence adapters** in `src/lib/intel`, one file each: Google Web Risk, URLhaus, PhishTank, OpenPhish, VirusTotal. Each is enabled by its own env var, has a 4 second timeout, returns a typed `clean | flagged | unavailable` result with a reason, and is run with `Promise.allSettled` on at most 5 URLs. Cache by normalised URL hash in Upstash for one hour. Only the extracted URL is ever sent to a threat source, never the message text. Check each service's current terms and key requirements (some, such as URLhaus and VirusTotal, require a key or have usage limits, and PhishTank may not be issuing new keys). Treat all as optional and show honestly which ones ran. OpenPhish uses its feed, loaded and cached server-side.
9. **Combiner:** deterministic and documented on `/methodology`. Produces score, confidence and verdict. A URL confirmed malicious by a feed forces "Likely a scam". The AI alone can never produce "No clear signs of fraud". Disagreement between sources is shown, not hidden.
10. **Optional last: shortener expansion.** Behind a feature flag. Resolve DNS first and reject private, loopback and link-local ranges, re-check at every redirect hop, http and https only, ports 80 and 443 only, maximum 5 hops, HEAD only, 3 second timeout, no cookies. Never fetch a page body.

Streaming: the route handler streams stages as they complete (rules, links, AI) so the UI can reveal real progress.

## 10. Backend, security and privacy

- **Route Handlers:** `POST /api/analyze`, `POST /api/link-check`, `POST /api/reports` (save), `GET/DELETE /api/reports/[id]`, `POST /api/community-reports`. Zod validate everything. Typed error responses.
- **Rate limiting:** Upstash Ratelimit, 10 requests per minute per hashed IP for anonymous users, 30 for signed-in users. If Upstash is not configured, use an in-memory limiter with a dev-only warning.
- **Turnstile:** verify server-side on anonymous analysis. Use Cloudflare's published dummy test keys in development. Skip cleanly if unset.
- **Limits:** message length cap, image 5MB, PNG, JPEG and WebP only, verify magic bytes not just the MIME type.
- **Headers:** strict CSP, `frame-ancestors none`, referrer policy, permissions policy.
- **Supabase:** migrations in `supabase/migrations`.
  - `profiles(id, region, created_at)`.
  - `reports(id, user_id nullable, channel, region, verdict, score, confidence, summary, signals jsonb, urls jsonb, message_redacted nullable, message_hash, provider_trace jsonb, created_at)`. `message_redacted` is stored only if the user opts in. `message_hash` uses a server-side pepper.
  - `community_submissions(id, reporter_id nullable, scam_type, redacted_text, sender_pattern, domain, status default 'pending', created_at)`.
  - RLS: users can select, insert and delete only their own `reports`. No client reads of `community_submissions`. Writes go through route handlers with the service role. A k-anonymised aggregate view (minimum group size 5) for trend data.
  - Storage: private `screenshots` bucket, owner-only policies, 24 hour expiry. Default is not to store.
- **Auth:** email magic link. Analysis always works without an account. History needs one.
- **Sentry and PostHog:** env-gated. Never send message text, URLs or screenshots. PostHog uses an allow-list of event names and properties.
- **No Supabase configured:** hide history and saving with a clear explanation. Do not break.
- Ship `.env.example` with every variable, grouped and commented. Add `.gitignore`.

## 11. Testing

- **Vitest:** unit tests for normalisation, extraction, every rule, the combiner and the prompt injection cases. Create `fixtures/messages.json` with at least 80 labelled messages: 40 scams across the region packs and 40 legitimate messages including real-looking OTPs, bank debit alerts, delivery updates and government notices (hard negatives). Assert on the rules engine alone: recall at least 85 percent on scams and false positive rate at most 5 percent on legitimate messages. Report the actual numbers.
- **Playwright:** analyse a sample and see the verdict; screenshot upload; link check; practice game by keyboard; emergency flow; reduced motion; no horizontal overflow at 1440, 768 and 390 widths; axe accessibility checks on every page; no console errors.
- **Visual QA:** screenshots at 1440, 768 and 390 for every page, saved to `docs/screenshots/`. If you can view images, review them critically against sections 2 and 3. If you cannot, assert computed styles and layout in Playwright (fonts loaded, contrast, no overflow, no banned colours in computed styles).

## 12. Build phases (each ends with a gate and a git commit)

0. **Foundation:** scaffold, exact dependencies, skills installed and recorded, Tailwind tokens, fonts, `docs/DESIGN.md`, `docs/STACK.md`, `/styleguide` with palette, type, glass levels and the full icon sheet, `check-copy` script, `.env.example`. _Gate:_ build passes and the styleguide matches sections 5.1 to 5.5.
1. **Engine:** analysis library, region packs, fixtures, tests. _Gate:_ tests pass and recall and false-positive thresholds are met.
2. **Services:** AI providers, threat adapters, redaction, combiner, route handlers, rate limit, Turnstile. _Gate:_ works with zero keys and live with the Gemini key if present.
3. **Core UI:** floating nav, hero composer, streaming report, annotated message, URL anatomy, gauge, stamp, inline icons. _Gate:_ the full flow works at phone width. Screenshots taken and the section 2 test passed.
4. **Story, motion and 3D:** opening hook, pinned chapters, StringTune parallax layers, page transitions, scenes 1 to 4, reduced-motion and mobile fallbacks. _Gate:_ the hook skips cleanly, the tool is usable during it, performance targets are met, 3D states match real verdicts, and library ownership rules in 4.3 hold.
5. **Remaining pages:** patterns with district map, practice, link check, help, insights, methodology, privacy. _Gate:_ every nav link leads to a finished page.
6. **Supabase:** migrations, auth, history, RLS, community submissions. _Gate:_ RLS verified with cross-user access tests.
7. **Hardening:** Sentry, PostHog, CSP, error boundaries, 404 and error pages, SEO metadata, OG image, README with setup and Cloudflare WAF notes. _Gate:_ Playwright suite green.
8. **Final review:** re-read sections 2, 3 and 13, fix everything that fails, rerun all checks.

## 13. Definition of done

Run each check and report the result:

- `pnpm build`, `pnpm typecheck`, `pnpm lint` (including `check-copy`) and `pnpm test` pass. Playwright passes, including: skipping the opening hook by button, Esc and scroll; the composer usable during the hook; reduced motion; no horizontal overflow at 1440, 768 and 390 widths; axe on every page; no console errors.
- `grep -rnP "\x{2014}|\x{2013}" src docs README.md scripts tests` returns nothing (`docs/BRIEF.md` is exempt).
- No secret in any tracked file. `.env.local` is untracked.
- A Playwright test samples computed colours across pages and finds no purple, blue, cyan, teal or pink hues. All body text computes to black or the defined ink tints.
- Glass has a solid fallback and passes contrast. Blur stays at or below 28px on desktop and 16px on mobile.
- Each of StringTune, GSAP and Motion is used for its assigned role (4.3). Lenis is not installed. Lucide is not imported in product UI. `docs/SKILLS.md` lists the skills installed or explains why none exist.
- The custom icon set has at least 36 icons and inline icons appear in headlines and body text.
- No eyebrow label, tagline, three-card icon row, floating callout chip or fake status anywhere.
- The app works with zero keys and shows which checks ran. 3D reacts to real verdicts. Reduced motion and no-WebGL paths work.
- Performance targets in section 7 are met, with measured numbers reported.

**Final report format** (plain text, no marketing language): what was built, how to run it, which skills were installed, which integrations were verified live and which were not (and why), whether Blender MCP was used or geometry was procedural, whether StringTune and ScrollTrigger coexist and how, measured recall and false-positive numbers, performance numbers, and known gaps. Be honest. A short list of real gaps is better than a claim of perfection.

Begin with Phase 0 now.
