# Installed stack

Versions were installed with `--save-exact` on 21 November 2026. npm is the package manager because pnpm is unavailable. The lockfile is `package-lock.json`.

## Runtime

| Package | Version |
|---|---|
| next | 16.4.6 |
| react | 19.3.1 |
| react-dom | 19.3.1 |
| tailwindcss | 4.3.5 |
| @tailwindcss/postcss | 4.3.5 |
| tw-animate-css | 1.4.0 |
| class-variance-authority | 0.7.1 |
| clsx | 2.1.1 |
| tailwind-merge | 3.7.1 |
| radix-ui | 1.8.1 |
| sonner | 2.0.8 |
| gsap | 3.15.1 |
| @gsap/react | 2.1.2 |
| motion | 14.14.0 |
| @fiddle-digital/string-tune | 1.2.7 |
| three | 0.187.0 |
| @react-three/fiber | 9.8.2 |
| @react-three/drei | 10.7.9 |
| @react-three/postprocessing | 3.2.2 |
| postprocessing | 6.39.6 |
| zustand | 5.1.0 |
| zod | 4.6.7 |
| server-only | 0.0.1 |
| @supabase/supabase-js | 2.119.2 |
| @supabase/ssr | 0.12.7 |
| @google/genai | 3.6.1 |
| @aws-sdk/client-bedrock-runtime | 3.1175.0 |
| @upstash/redis | 1.41.0 |
| @upstash/ratelimit | 2.2.1 |
| @sentry/nextjs | 11.16.0 |
| posthog-js | 1.453.2 |
| posthog-node | 6.0.5 |
| recharts | 3.11.0 |
| d3 | 7.9.2 |

## Development

| Package | Version |
|---|---|
| typescript | 6.0.3 |
| @types/node | 26.6.6 |
| @types/react | 19.3.0 |
| @types/react-dom | 19.3.0 |
| @types/three | 0.187.0 |
| @types/d3 | 7.4.3 |
| @gltf-transform/cli | 4.5.1 |
| vitest | 5.1.1 |
| @vitest/coverage-v8 | 5.1.1 |
| @playwright/test | 1.65.1 |
| @axe-core/playwright | 4.14.0 |
| eslint | 9.39.5 |
| eslint-config-next | 16.4.6 |
| prettier | 3.10.1 |
| shadcn | 4.23.0 |

The React and Three.js peer tree resolves without conflicts or a React downgrade. GSAP 3.15.1 includes `SplitText`, `DrawSVGPlugin`, `MorphSVGPlugin`, `Flip`, `ScrollTrigger` and `CustomEase` in the public installation. Their files were checked directly.

StringTune's package exports `StringTune`, `StringParallax`, `StringMagnetic` and `StringProgress`. The installed TypeScript declarations and npm readme are the API reference because no matching agent skill or Context7 entry exists.

The Gemini template model comes from current official documentation retrieved through Context7. No key is available to list accessible models or make a live request. The model is read from environment configuration in implementation.
