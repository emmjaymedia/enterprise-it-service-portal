# Project Progress

## Completed
- Verified local development tools
- Created the Next.js application
- Opened the starter page locally
- Installed foundation packages

## Dashboard foundation completed
- Built the responsive sidebar, header, summary cards and ticket table.
- Verified desktop and mobile layouts.
- Passed lint, TypeScript and production build checks.

## Current milestone
- Add the typed Redux store, hooks and client provider.
- Add interactive ticket filtering.

## Later milestones
- Ticket workflows
- Database persistence in stage 6
- Authentication and permissions
- Asset requests and approvals
- English/Arabic localization
- Automated tests
- GitHub CI and Vercel/Neon deployment
- Azure DevOps and Entra integration

Verification results:
- Lint: passed
- TypeScript: passed
- Production build: passed
- Production dependency audit: 0 vulnerabilities
- Development dependency audit: unresolved ESLint dependency findings
- Desktop/mobile visual checks: pending

## Milestone 1 — Dashboard foundation
- Built the ServiceDesk dashboard with fictional ticket and asset data.
- Added responsive SCSS styling.
- Verified desktop and mobile layouts.
- Passed ESLint, TypeScript, and production build checks.
- Production dependency audit: 0 vulnerabilities.
- Development dependency audit: unresolved ESLint dependency findings.

## Redux ticket filtering completed
- Added a typed Redux store, hooks and client provider.
- Connected the ticket-status filter to Redux.
- Verified filter counts, keyboard use and mobile layout.
- Passed lint, TypeScript and production build checks.
- Filter state resets on page refresh.
- Ticket data remains fictional and static.

## Ticket API — first endpoint
- Added GET /api/tickets using a Next.js Route Handler.
- Verified the endpoint returns four fictional tickets.
- Response includes data and metadata.
- Passed lint, TypeScript and production build checks.
- Dashboard connection, database and authentication remain pending.

## Ticket dashboard API integration

### Goal
Connect the dashboard and ticket table to the tickets API using Redux Toolkit Query.

### Changes
- Added the GET /api/tickets Route Handler.
- Added the RTK Query tickets API service.
- Registered the API reducer and middleware in the Redux store.
- Updated the dashboard and ticket table to consume API data.

### Verification
- `npm run lint` — passed.
- `npx tsc --noEmit` — passed.
- `npm run build` — passed.
- Production build includes `/api/tickets`.
- Browser checks for ticket loading, dashboard counts, filtering, and refresh — pending.

### Git checkpoint
- Commit: `8711d32`
- Message: `Connect ticket dashboard to API with RTK Query`

### Remaining work
- Verify the current workflow in the browser.
- Implement the Create Ticket form with validation.
- Add POST /api/tickets and an RTK Query mutation.
- Refresh the ticket list after successful creation.
- Add ticket details, assignment, comments, and resolution.
- Add database persistence in the following milestone.


## Create Ticket workflow

### Changes
- Added a shared Zod schema and ticket types.
- Added POST /api/tickets with server validation.
- Added a React Hook Form submission form.
- Added an RTK Query create mutation and list invalidation.
- Reset the status filter to All after successful creation.
- Added pending, validation, success and failure feedback.


### Limitations
- Fictional data with temporary server-process storage.
- No authentication or employee ownership enforcement yet.
- PostgreSQL persistence is planned for Stage 6.
- Not ready for a public deployment.

### Verification
- Lint: passed.
- TypeScript: passed.
- Production build: passed.
- Ticket creation and retrieval: passed.
- Automatic dashboard refresh: passed.
- Browser workflow and keyboard/mobile checks: passed.
- Direct API validation: passed — invalid input returns HTTP 400
  with subject and description errors.
- Ticket creation and retrieval: passed — GET returns three created
  tickets alongside four sample records.
- Automatic dashboard refresh after submission: pending confirmation.


## Ticket Details workflow

### Changes
- Moved temporary ticket storage into a shared server module.
- Added GET /api/tickets/[id].
- Added runtime validation for ticket details responses.
- Added an RTK Query details endpoint.
- Linked ticket IDs to individual details pages.
- Added loading, missing-ticket, error and retry states.

### Verification
- Lint: passed.
- TypeScript: passed.
- Production build: passed.
- Existing and newly created ticket details: passed.
- Missing ticket API returns 404: passed.
- Keyboard/mobile checks: passed.

### Limitations
- Temporary server-process storage remains.
- Authentication and ownership enforcement remain pending.
- Assignment, comments and resolution follow.
