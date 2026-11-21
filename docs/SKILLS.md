# Agent skills

Verified and installed on 21 November 2026 with the `skills` CLI. Project copies are in `.agents/skills/` for OpenCode-compatible loading.

| Need | Source | Installed skills |
|---|---|---|
| GSAP | https://github.com/greensock/gsap-skills | gsap-core, gsap-react, gsap-plugins, gsap-scrolltrigger, gsap-timeline, gsap-performance |
| Motion | https://github.com/motiondivision/ai-kit | motion |
| Frontend design quality | https://github.com/vercel-labs/agent-skills | web-design-guidelines, vercel-react-best-practices |
| Frontend design process | Existing user skill | ui-design |

The official GSAP repository was found through GitHub search and reports that all required plugins ship in the public package. The Motion repository was found through the skills catalog after confirming the publisher on GitHub. Vercel's repository was inspected before selecting its design and React skills.

No StringTune skill was found through GitHub repository search or `skills find StringTune`. StringTune work will follow the npm package documentation for `@fiddle-digital/string-tune`, confirmed at version 1.2.7. Context7 did not have a matching StringTune library entry.

The installed `SKILL.md` files were loaded before animation or design implementation. Motion's React best-practices reference is also used. If an installed skill references an unavailable MCP service, local reference material and official public documentation are used instead.

The first attempt to inspect the full Motion library repository failed because the Windows temporary drive was full. Subsequent narrow skill installs used temporary storage inside this project and succeeded. Those temporary folders are excluded from git.
