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

- Proceed using the supplied references; the user has waived the need for
  the previously referenced skills.
- Google Stitch exports are supplied in screen folders containing HTML,
  PNGs and supporting assets. Use PNGs as visual references and HTML as
  implementation references.
- Convert those references into reusable Next.js, React and TypeScript
  components while retaining SCSS Modules and Redux Toolkit/RTK Query conventions.
- Build and refine the frontend first with mock data and working interactions.
  Backend implementation follows frontend approval. Preserve the existing mock APIs.
- Use `docs/it-ticketing-system-prd.md` as the functional specification.
- Identify unavailable skills and referenced files as pending; do not invent
  their contents or claim they have been loaded.
- Implement the supplied frontend references incrementally, keeping backend
  changes gated on frontend approval.

## Design references and frontend progress

The supplied Stitch archive contains 84 HTML/PNG screen pairs, mobile and Arabic
variants, the PRD and design notes. The PRD is retained at
`docs/it-ticketing-system-prd.md`; the design notes are at `docs/stitch-design.md`.
The original archive remains local and uncommitted.

- `/` and `/workspace`: W01 operations dashboard, reusable workspace shell,
  team/date filters, mock metrics, charts, priority breakdown, searchable worklist,
  pagination and native ticket preview dialog.
- Dashboard records are frontend-only fixtures served through the existing RTK
  Query service. Their IDs and metrics are separate from the existing ticket API.
  Trend and attainment figures are explicitly labeled as illustrative history.
- `/tickets`: preserved working ticket workspace, creation and filtering.
- `/tickets/[id]`: existing assignment and resolution workflow.
- Other modules are visibly marked as planned until implemented.

The frontend remains the current priority. Backend implementation follows
frontend approval. Next screens: W02 Ticket Queue and W03 Agent Ticket Detail.

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
