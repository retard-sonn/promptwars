# Design system

## Intent

The composer is the primary hero. The interface serves a worried, non-technical person on a phone. Decoration never delays input, verdicts or emergency actions.

## Colour tokens

| Token | Value | Purpose |
|---|---|---|
| white | #FFFFFF | Glass edges and highlights |
| snow | #FFF9F4 | Page base |
| cream | #FFF1E6 | Section tint |
| persimmon 100 | #FFE3D1 | Soft fills |
| persimmon 200 | #FFC7A3 | Backdrop forms |
| persimmon 300 | #FFA571 | Backdrop forms |
| persimmon 400 | #FF8340 | Icons and accents |
| persimmon 500 | #FF6A1F | Primary controls |
| persimmon 600 | #EC5800 | Pressed controls |
| persimmon 700 | #BF4600 | Text accent on white |
| ink | #0A0A0A | Primary text |
| ink 2 | rgba(10,10,10,0.70) | Secondary text |
| ink 3 | rgba(10,10,10,0.58) | Tertiary text |
| alarm | #D92D1A | Likely a scam |
| caution | #F5A300 | Suspicious |
| ok | #1F9D55 | No clear signs of fraud |

Text uses ink or its defined tints. White text is restricted to black surfaces. Verdicts always combine a written label, icon and distinct silhouette. Colour is never the only signal. No decorative hues beyond this palette.

## Type

Display and body use the native Apple stack with Inter as the cross-platform fallback. Inter loads through `next/font/google` with its optical size axis. Geist Mono is the fallback for URLs, case IDs, phone numbers and scores. SF font files are not bundled.

Display type is 600 to 700 weight, tracking -0.03em to -0.04em, leading 0.98, with responsive sizes from 2.75rem to 8rem. Body type is 17px on desktop and 16px on mobile, leading 1.5. Data uses tabular numbers. Hierarchy comes from size and weight.

## Glass

Three shared surface classes are available.

- `.glass`: white at 58 percent, 28px blur, 170 percent saturation, bright edge highlights and a persimmon-tinted shadow.
- `.glass-strong`: white at 80 percent and 28px blur for reports and other text-heavy panels.
- `.glass-tint`: persimmon at 14 percent for active and highlighted states.

The final acceptance gate caps blur at 28px on desktop, so the stronger surface uses opacity rather than additional blur. Mobile blur is 16px. Blur is never animated. Unsupported browsers receive white at 92 percent. Glass sits over visible persimmon forms, never an empty white field. No more than three blurred layers appear together. Body copy uses the strong surface.

A pointer-driven radial highlight uses CSS custom properties on desktop. It is disabled for touch and reduced motion.

## Shape and layout

Small controls use a 12px radius, inputs 20px, cards 28px, and hero or section panels 40px. Buttons, chips and navigation are pills. Inner radii equal the outer radius minus padding.

The content grid has 12 columns, a 1320px maximum width, 24px gutters and an 8px spacing base. The home hero splits evenly between the composer and inspection scene. Mobile places the composer first. Soft persimmon shadows and bright glass edges create elevation. Paper grain sits at 3 percent opacity.

## Icons

All product icons are original React SVG components on a 24px grid. Strokes are 1.75px black with round caps and joins. Curves use a nominal 3px corner radius. Each duotone icon has one persimmon fill and a white highlight at 60 percent opacity. A mono variant removes the fill colour.

`Icon` accepts a name and size. `InlineIcon` renders a 1.05em glass chip with 0.35em radius and `vertical-align: -0.18em`. A rich-text helper expands `{icon:name}` tokens. Inline icons are decorative when adjacent text supplies the meaning.

GSAP DrawSVG handles entry drawing on a wrapper-owned timeline. Motion handles small hover responses on a separate wrapper. The complete set is visible on the development styleguide.

## Motion tokens

Entrances use `cubic-bezier(0.16, 1, 0.3, 1)` and GSAP `expo.out`. A CustomEase named `shield-enter` matches that curve. Long transitions use `expo.inOut`. Micro interactions last 160 to 240ms. Large moves last 600 to 1000ms. Touch interactions use springs around stiffness 300 and damping 30.

StringTune owns backdrop parallax and pointer effects on native scroll. GSAP owns timelines, pinning, line and SVG reveals, layout handoffs, route wipes and shared chapter progress. Motion owns component state, draggable cards, gauge motion, tab indicators and navigation morphing. A single library owns a given transform on a given node.

Reduced motion disables scrub, parallax, tilt, magnetic movement, shake and wipes. Content and controls remain available.

## Components

Buttons are pills with black text on persimmon. Inputs have visible labels, instructions and errors. Navigation uses a centred glass pill with a mobile sheet. Tabs use accessible Radix behaviour with a Motion indicator. Reports use strong glass and dense case-file sections. Loading states use glass skeletons. Empty and error states explain the next available action.

No icon-in-square feature cards, repeated three-card feature strips, eyebrow labels, floating product claims or universal hover lift are part of the system.
