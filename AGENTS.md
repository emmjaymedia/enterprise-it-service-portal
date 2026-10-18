<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->


# Enterprise portal development direction

- Continue from the existing Enterprise IT Service & Asset Portal implementation;
  preserve existing work and conventions.
- Proceed with the supplied PRD, Stitch PNGs, HTML and design notes. The user
  has explicitly waived the need for the previously referenced skills.
- Expect Google Stitch exports organized by screen folder, containing HTML,
  PNGs and supporting assets. PNGs are visual references; HTML is an
  implementation reference. The source ZIP is available locally.
- Convert supplied references into reusable Next.js, React and TypeScript
  components. Retain SCSS Modules and Redux Toolkit/RTK Query conventions.
- Build and refine the frontend first with mock data and working interactions.
  Backend implementation comes after frontend approval. Preserve existing mock
  API behavior during frontend work.
- Use `docs/it-ticketing-system-prd.md` as the functional specification and
  `docs/stitch-design.md` as supporting design guidance. Use the supplied PNGs
  as the visual reference when generated HTML and design notes differ.
- If any referenced skill or file is unavailable, identify it as pending.
  Do not invent its contents or claim to have loaded it.
- This direction supersedes older backend milestone ordering in historical docs.
- The initial GitHub upload is complete. Current work implements the supplied
  frontend references; backend changes still require frontend approval.
- Keep credentials, local environment files, dependencies and generated output
  out of Git. Keep `.env.example` limited to documentation and placeholders.
