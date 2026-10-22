# Enterprise IT Service & Asset Portal

Continue from the existing Enterprise IT Service & Asset Portal implementation.

## Screen review

All 62 PRD screen layouts are reachable, together with the design-system and
interface-state references. Open `/workspace` to use the left sidebar, `/admin`
for all administration pages, `/portal` for employee screens, or `/screens` for
the complete directory.

The current priority is screen coverage and navigation. New pages contain sample
content, working page tabs and links, and local layout previews. New workflow
buttons explain that implementation is pending; they do not save, publish or
submit data. Existing ticket, approval and feedback demo workflows are preserved.
See `docs/screen-coverage.md` for the route inventory and implementation boundary.

## Current implementation

Next.js App Router, React and TypeScript, with SCSS Modules, Redux Toolkit
and RTK Query. The Stitch workspace includes the operations dashboard, ticket
queue and agent details with interactive frontend mock state. The original
ticket workspace retains ticket creation, assignment and validated resolution
through the existing API.

The original API uses fictional data held in server-process memory and may
reset after a restart or rebuild. The new workspace uses a separate frontend
cache that resets on a full page reload. Authentication, ownership permissions and
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
  pagination and drill-down links into the filtered queue.
- `/workspace/tickets`: W02 queue with URL-backed search and filters, removable
  filter chips, sorting, pagination, column selection, personal saved views and
  CSV export. Bulk assignment, team handoff, priority and status updates show
  per-row failures and retain only failed rows for retry. Scope changes clear selection.
- `/workspace/tickets/[id]`: W03 detail refinement with conversation visibility
  filters, separate public/internal drafts, failed-send feedback, properties,
  activity history, resolution notes and reopening.
- Dashboard, queue and detail records share frontend state through RTK Query.
  Saved views and drafts use Redux. All survive client navigation and reset on
  full page reload; nothing in these new flows writes to the backend.
- The dashboard fixture IDs remain separate from the original ticket API IDs.
  Trend and attainment figures are explicitly illustrative. Attachments retain
  filenames only; no file content is uploaded.
- `/tickets`: preserved working ticket workspace, creation and filtering.
- `/tickets/[id]`: existing assignment and resolution workflow.
- All remaining modules are reachable as screen previews; their new business
  workflows are deferred until feature implementation.

The frontend remains the current priority. Backend implementation follows
frontend approval. W02 and the requested W03 core interactions are ready for
visual review. Advanced detail workflows, persistence and permissions remain
future milestones.

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

## Frontend Batch 3 previews

- `/login`, `/password/reset`, `/verify`: simulated sign-in, recovery and MFA.
  Use fictional credentials. After sign-in, use `123456` or the recovery code
  `DEMO-RECOVERY`. Reset uses `DEMO-RESET` after requesting a mock reset.
- `/notifications`, `/profile`, `/search`: shared account pages with context from
  the employee or support shell. Search, notification read state and saved
  preferences survive client navigation and reset on reload.
- `/system-states`: access denied, not found, maintenance, offline and expired
  session previews. Unknown URLs use the shared not-found design.
- Shared navigation is available in both shells; Ctrl/Cmd+K opens global search.

These are frontend mocks. No authentication, authorization, email delivery,
credential changes or real session revocation occurs. Existing backend routes
are unchanged. Preferences include a regional preview; application translation
and app-wide timezone rendering remain future work.

## Batch 4 — Approvals, resolution, handoff and feedback

- `/portal/approvals`: pending/completed approvals with search, category and age
  filters and individual review links.
- `/portal/approvals/REQ-2081`: scope, justification, cost, workflow and approval,
  rejection, clarification and permitted delegation with confirmation dialogs.
- `REQ-2074` demonstrates blocked self-approval. The decision page includes an
  explicit demo control to exercise changed-request revision handling.

Approval decisions and note drafts use Redux and reset on reload. No real
approvals, provisioning, notification delivery or durable audit records occur.

- `/workspace/tickets/INC-1042#resolve`: W07 resolution code, public solution,
  optional public article reference, linked-task/approval gates and notification
  preview. `INC-1102` demonstrates an incomplete task; `INC-1103` a pending approval.
- `/workspace/tickets/INC-1042#escalate`: W08 team transfer, specialist reassignment
  and level escalation, reason/internal handoff notes, optional public update,
  destination availability/access checks and unchanged illustrative SLA state.
  `INC-1044` demonstrates a sensitive record without an eligible transfer team.
- `/portal/tickets/REQ-1039/feedback`: E16 five-point feedback, optional criteria
  and comment, submission confirmation and editing. `INC-1028` demonstrates
  expired feedback; active, reopened and missing records have recovery states.
- The shared `INC-1042` frontend fixture supports agent resolution → employee
  feedback → requester reopen → agent resolution again, with one rating per
  resolution cycle. Handoff ownership/public updates also reach the matching
  employee fixture; internal notes stay in the support workspace.

Feedback uses a five-day preview policy and a stable 22 October 2026 demo clock;
new resolutions use their actual timestamp if later. Dialogs include explicit
failed-save/conflict demos, and feedback includes failure/expiry previews.
Task completion, later approval stages, live SLA clocks, real delivery and backend
security/persistence remain future work. Existing backend APIs are unchanged.
