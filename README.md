# Enterprise IT Service & Asset Portal

Continue from the existing Enterprise IT Service & Asset Portal implementation.

## Current implementation

Next.js App Router, React and TypeScript, with SCSS Modules, Redux Toolkit
and RTK Query. The dashboard supports ticket listing, status filtering,
creation, ticket details, support-agent assignment and validated status
transitions with resolution notes.

Tickets use fictional data held temporarily in server-process memory and may
reset after a restart or rebuild. Authentication, ownership permissions and
PostgreSQL persistence are not implemented yet.

## Development direction

- Follow the `enterprise-service-portal` and `frontend-design` skills when available.
- Google Stitch exports will be supplied in screen folders containing HTML,
  PNGs and supporting assets. Use PNGs as visual references and HTML as
  implementation references.
- Convert those references into reusable Next.js, React and TypeScript
  components while retaining SCSS Modules and Redux Toolkit/RTK Query conventions.
- Build and refine the frontend first with mock data and working interactions.
  Backend implementation follows frontend approval. Preserve the existing mock APIs.
- Use the IT ticketing PRD as the functional specification when supplied.
- Identify unavailable skills and referenced files as pending; do not invent
  their contents or claim they have been loaded.
- This GitHub upload task adds documentation and Git hygiene only; it does not
  implement new screens or change the backend.

## Pending inputs

The `enterprise-service-portal` and `frontend-design` skills were not found in
this repository or the local skills directory. Google Stitch screen exports
and the IT ticketing PRD have not been supplied locally. These inputs are
pending and have not been loaded.

## Local development

Use Node.js 20.9 or newer and npm. Install the locked dependencies and start:

```bash
npm ci
npm run dev
```

Open http://localhost:3000. No environment variables are required by the current
implementation. `.env.example` documents this; put future local values in
`.env.local` and keep only placeholders in `.env.example`.

## Validation

```bash
npm run lint
npx tsc --noEmit
npm run build
```

There is no dedicated type-check script; the command above uses the installed
TypeScript compiler. Production builds fetch Geist fonts from Google and
require network access. See `AGENTS.md` for project instructions and
`docs/progress.md` for historical implementation notes. The frontend-first
direction above takes precedence over older backend milestones in those notes.
