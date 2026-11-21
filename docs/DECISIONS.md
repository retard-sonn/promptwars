# Decisions

## Package manager

npm is used because pnpm is not installed. Scripts are package-manager neutral, so the requested pnpm commands also work if pnpm is added later. Exact dependency versions are recorded in `package.json` and `docs/STACK.md`.

## Glass blur

Section 5.3 suggests 40px blur for strong glass, while the final acceptance gate caps all desktop blur at 28px. The gate takes precedence. Strong glass uses 28px blur and 80 percent white. Mobile uses 16px.

## Scroll ownership

StringTune runs on native browser scroll for backdrop parallax and pointer effects. It does not install smooth scrolling. ScrollTrigger therefore retains native scroll positions, pinning and scrubbing without a scroller proxy. Motion handles component state only. Transform ownership is separated with wrappers where required.

## Geometry

Blender connectivity was unavailable. The first implementation used procedural React Three Fiber geometry. The latest product direction replaces visible 3D scenes with animated pixel art to reduce frontend weight and avoid WebGL failure modes. The unused 3D source, poster files and 182 installed packages were removed. District buildings still use real pattern counts and verdict scenes still follow real analysis state.

## AI model template

Google's `gemini-3.5-flash` was verified live before the provider change. The latest product direction uses AWS Bedrock with `us.moonshotai.kimi-k3.1`. The bearer key was verified against model and inference-profile listings, text Converse and screenshot Converse. This model requires an inference profile and rejects the temperature field, so the provider omits temperature only for Kimi and validates its JSON text response. Model names remain environment configuration.

## Threat source constraints

URLhaus documentation confirms that its Auth-Key header is required. Google Web Risk `uris.search` uses GET with `uri` and repeated `threatTypes` parameters. Flagged responses are cached only until their supplied expiry, up to one hour.

VirusTotal's public API documentation states a limit of 500 requests per day and 4 requests per minute, with restrictions on commercial and business use. The adapter is opt-in and deployment owners must review their licence before enabling it. Existing URL reports are queried without submitting a new scan.

PhishTank's registration page required an authenticated session, so current key issuance could not be verified. The adapter remains disabled without a configured key. OpenPhish uses its feed only when `OPENPHISH_FEED_URL` is set. All source failures remain visible as unavailable rather than clean.

## Dependencies beyond the brief

None at the start of the build. Any later addition requires a reason here before installation.

## CSS vendor order

The first styleguide check computed to no blur because the prefixed declaration came last and the build retained only that declaration. Standard `backdrop-filter` now comes after the WebKit fallback. The same browser check computes to 28px on desktop and 16px on mobile.

## Local reports

Anonymous reports are kept in browser memory only. No server or browser persistence is used unless the user explicitly saves. A generated case ID identifies the in-memory result and does not imply a server fetch.
