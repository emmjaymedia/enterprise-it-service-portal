# ServiceDesk — Enterprise IT Ticketing System
## Product requirements document and Google Stitch screen specification

Version: 1.0 • Date: 18 October 2026 • Status: Proposed product specification

> This document defines a complete product vision, not an existing implementation. ServiceDesk is a working name. Metrics, sample records, SLA values, and design tokens below are proposed defaults. Use the screen specifications and prompts to generate interface concepts in Google Stitch; authentication, storage, permissions, integrations, and business rules require implementation separately.

## 1. Product overview

ServiceDesk is a responsive IT service management platform through which employees report issues and request services, support teams manage operational work, managers approve requests and monitor service quality, and administrators configure the system.

The product combines an employee self-service portal, an agent workspace, and an administration console. Incidents, requests, assets, knowledge, problems, changes, and reporting share linked records and a consistent audit trail.

### Problem

IT requests arrive through disconnected channels. Ownership is unclear, users repeatedly ask for updates, priority decisions are inconsistent, and managers cannot reliably measure service performance. Support teams lack sufficient context about users, assets, recurring problems, and previous resolutions.

### Outcomes

- Give every request an accountable owner, visible status, and traceable history.
- Reduce time spent classifying, routing, and following up on work.
- Make employee self-service and approval decisions straightforward.
- Measure SLA performance, workload, backlog, and customer satisfaction accurately.
- Connect incidents to affected services, assets, problems, and planned changes.

### Proposed success targets

Measure against a four-week baseline after production adoption; do not present these as achieved results.

| Metric | Definition | Proposed target |
| --- | --- | --- |
| First response SLA attainment | Eligible tickets responded to within policy / eligible tickets | ≥95% |
| Resolution SLA attainment | Eligible tickets resolved within policy / eligible tickets | ≥90% |
| First response time | Median business minutes to first human public reply | 25% reduction |
| Requester satisfaction | Mean submitted CSAT score, with response rate shown | ≥4.5/5 |
| Reopen rate | Resolved tickets reopened within seven days / resolved tickets | <8% |
| Portal adoption | Employee-originated tickets created through portal / all employee-originated tickets | ≥70% |
| Backlog age | Median calendar age of unresolved tickets | 20% reduction |

## 2. Scope and delivery strategy

A full product should be designed now and implemented in milestones. Screen IDs below remain stable across phases.

| Phase | Scope | Release gate |
| --- | --- | --- |
| P1 — Core service desk | Authentication, employee portal, incident/request creation, queues, ticket detail, comments, attachments, assignment, priority, SLA, notifications, basic approvals, basic reporting, RBAC, audit | Employee submits; agent responds and resolves; employee confirms; metrics and audit agree |
| P2 — Service operations | Catalog, configurable approval chains, knowledge publishing, asset inventory, saved views, automation, email intake, advanced reporting | Catalog request traverses approval and fulfillment; asset and article links remain permission-safe |
| P3 — Enterprise ITSM | Major incidents, problem management, change management, CMDB relationships, procurement links, integrations, advanced governance | Incident-to-problem-to-change flow works with approvals and rollback evidence |
| P4 — Intelligence and expansion | Optional AI assistance, Arabic/RTL, advanced workforce planning, optional multi-tenant SaaS | Quality, accessibility, localization and tenant-isolation gates passed |

### Explicit boundaries

The initial deployment is one organization with multiple departments and locations. Multi-tenant SaaS billing, remote desktop control, endpoint discovery agents, full accounting, payroll, and a SOC/SIEM are outside the initial product. Asset purchasing is a lightweight request-and-receipt workflow, not an ERP. AI cannot autonomously approve access, change permissions, execute scripts, or close tickets.

## 3. Users and permissions

Permissions must be enforced by the server on every request, including search, exports, attachments, counts, and linked records. A hidden button is not access control.

| Role | Visibility | Allowed actions | Restrictions |
| --- | --- | --- | --- |
| Employee/requester | Own tickets and explicitly shared tickets; own assets; published articles | Submit, reply publicly, upload, withdraw eligible requests, confirm resolution, reopen, rate service | No internal notes, agent-only fields, or other employees’ records |
| Support agent | Authorized team queues and assigned records | Triage, assign within policy, reply, add internal notes, log time, resolve, link records | No organization-wide configuration or unauthorized team data |
| Team lead | Authorized support teams | Agent actions plus workload allocation, escalation, queue rules, team reporting | Cannot grant own higher privileges |
| Approver | Assigned approval items with minimum necessary context | Approve, reject, request clarification, delegate within policy | No unrestricted agent access; cannot approve own request |
| IT manager | Authorized operational scope | Service reporting, major-incident coordination, policy oversight | Configuration only with separately granted permission |
| Asset manager | Authorized inventory and linked service context | Assign, maintain, retire assets, manage stock | No unrelated ticket conversation access |
| Knowledge editor/publisher | Authorized article spaces | Draft, review, publish/archive according to role | Publication and review separated when required |
| Administrator | Organization configuration and explicitly granted operational scope | Manage identities, roles, workflows, integrations and settings | Administrative role does not automatically reveal sensitive ticket content |
| Auditor | Authorized read-only records | View audit events and approved exports | No modifications; export actions logged |

Sensitive HR, legal, security, and privileged access cases use restricted queues with explicit membership. Cross-team collaboration requires a recorded access grant rather than silently widening visibility.

## 4. Information architecture

### Employee portal

Home · My tickets · Service catalog · Knowledge base · My assets · Approvals (when assigned) · Service status · Notifications · Profile

### Agent workspace

Overview · Tickets (All authorized, Assigned to me, Unassigned, At risk, Breached, Saved views) · Major incidents · Service requests · Approvals · Problems · Changes · Assets & CMDB · Knowledge · Reports · Team workload

### Administration

People & teams · Roles & permissions · Ticket fields & forms · Categories & services · SLA policies · Business hours & holidays · Routing & automation · Approval workflows · Channels & integrations · Notification templates · Security · Audit log · Organization settings

### Shared shell

Desktop: 240px collapsible sidebar, 64px top bar, breadcrumb, page heading, primary action. Top bar includes organization/workspace name, global search, create action, notifications and profile. Role switcher appears only for users holding multiple roles. Mobile: drawer navigation, compact header, full-screen editors and detail panels. Never show an unavailable module as though it works.

## 5. Core records and fields

| Record | Required information |
| --- | --- |
| Ticket | Internal UUID; human-readable number; type; subject; description; requester; source; category; service; impact; urgency; calculated priority; status; team; optional assignee; created/updated times; SLA policy snapshot; visibility; version |
| Ticket conversation | Ticket; author; public/internal visibility; rich-text body; timestamp; edited indicator; attachment references; channel delivery state |
| Ticket event | Actor; action; old/new values; timestamp; reason; source; correlation ID |
| Request | Ticket link; catalog item/version; submitted field values; approver chain; cost estimate; fulfillment tasks; approval state |
| Approval | Parent record/version; approver; sequence; decision; reason; due date; delegated-from; timestamps |
| Asset | Asset tag; type; model; serial; owner; department; location; lifecycle state; warranty; supplier; purchase details; relationships |
| Configuration item | Service/component identity; environment; owner; criticality; health; upstream/downstream relationships; linked assets |
| Problem | Summary; linked incidents; symptoms; investigation; root cause; workaround; known-error state; owner; resolution |
| Change | Type; reason; affected services; risk; implementation/test/rollback plans; approvals; schedule; outcome |
| Knowledge article | Title; slug; category; audience; body; owner; review date; version; publication state; related records |
| SLA policy | Scope; priority targets; business calendar; pause rules; escalation rules; effective version |
| User/team | Identity; active state; role grants; organizational scope; department; manager; team membership |
| Automation | Trigger; ordered conditions; actions; priority; enabled state; version; execution history |
| Notification | Recipient; event; related record; channel; read state; delivery state; deduplication key |

Custom fields support text, textarea, number, date, select, multiselect, user, asset and checkbox types. Field configuration defines requiredness, requester visibility, edit permissions and conditional display. Retired fields remain readable on historical records.

## 6. Ticket lifecycle and rules

### Incident and standard request states

| State | Meaning | Permitted next states |
| --- | --- | --- |
| New | Submitted; not triaged | Open, Cancelled |
| Open | Classified and accepted into a queue | In progress, Pending requester, Pending external, Cancelled |
| In progress | Active investigation or fulfillment | Pending requester, Pending external, Resolved, Cancelled |
| Pending requester | Waiting for required requester information | Open, In progress, Resolved under documented no-response policy |
| Pending external | Waiting for vendor or another external dependency | Open, In progress, Resolved |
| Resolved | Solution recorded; requester may challenge it | Closed, Open through reopen action |
| Closed | Finalized record | No direct edits; authorized reopen creates Open with reason and event |
| Cancelled | Withdrawn, invalid, or duplicate with reason | Open by authorized restore action |

Approval state is separate: Not required, Pending, Approved, Rejected, Cancelled. An approval-dependent request cannot begin fulfillment until all required approvals pass. Rejection cancels the request with a visible explanation. Changed cost, scope or access entitlement invalidates affected approvals and triggers a new approval version.

- Resolving requires a resolution summary and resolution code; requester receives a public explanation.
- Resolved tickets auto-close after five calendar days unless reopened. This is configurable and communicated to the requester.
- Reopening requires a reason, restores ownership/queue, and creates a new SLA cycle while retaining original cycle measurements.
- Agent reassignment does not reset timers. Priority and SLA changes retain prior history and require reasons where configured.
- Duplicate merge keeps a survivor, redirects the duplicate, preserves audit and attachments, and never exposes restricted conversations to a broader audience.
- Cancellation requires a reason; work already fulfilled cannot be casually withdrawn.
- Concurrent updates use a version check. Show a conflict panel and refresh options rather than overwriting another person’s changes.

### Priority matrix

Impact: High = organization/critical service; Medium = department or multiple users; Low = individual with limited business impact. Urgency: High = no acceptable workaround and immediate deadline; Medium = degraded work with limited workaround; Low = tolerable delay.

| Impact / Urgency | High | Medium | Low |
| --- | --- | --- | --- |
| High | P1 Critical | P2 High | P3 Medium |
| Medium | P2 High | P3 Medium | P4 Low |
| Low | P3 Medium | P4 Low | P4 Low |

Agents can override calculated priority only with permission and a reason. Requesters choose impact and urgency using plain-language questions; priority is calculated rather than self-selected.

### Proposed SLA defaults

| Priority | First human response | Resolution | Calendar |
| --- | --- | --- | --- |
| P1 Critical | 15 minutes | 4 hours | 24×7 |
| P2 High | 1 business hour | 8 business hours | Organization business calendar |
| P3 Medium | 4 business hours | 24 business hours | Organization business calendar |
| P4 Low | 8 business hours | 40 business hours | Organization business calendar |

Automated acknowledgments do not count as human responses. First-response time never pauses. Resolution time pauses only in Pending requester by default; Pending external continues unless a policy explicitly allows otherwise. Approved service requests start fulfillment SLA after approval; approval turnaround is measured separately. Incidents start both clocks at submission. Every policy stores an IANA timezone, business intervals and holidays; calculations use UTC timestamps and the policy calendar.

Warn at 75% of the target, escalate at 90%, mark breached at 100%. Escalations notify the configured lead and create events; they must not repeatedly notify on every refresh. Show deadline, remaining business time and policy timezone rather than an ambiguous countdown alone.

## 7. Functional requirements

| ID | Requirement | Priority | Acceptance condition |
| --- | --- | --- | --- |
| FR-01 | Organization sign-in, recovery and optional SSO | P1 | Valid account reaches authorized workspace; disabled account is denied |
| FR-02 | Create incident/request with attachments | P1 | Submission returns one durable ticket number; retries do not create duplicates |
| FR-03 | Employee ticket tracking | P1 | Requester sees only permitted records and public conversation |
| FR-04 | Searchable, filterable, sortable ticket queues | P1 | Filtered count, pagination and exported scope match authorized query |
| FR-05 | Assignment and triage | P1 | Team/assignee changes persist with actor, old/new value and timestamp |
| FR-06 | Public replies and internal notes | P1 | Internal content never appears in employee UI, email or requester export |
| FR-07 | SLA clocks and escalation | P1 | Business hours, pauses, priority changes and reopen cycles calculate correctly |
| FR-08 | Basic request approvals | P1 | Only designated approver decides; self-approval is prevented |
| FR-09 | Notifications and preferences | P1 | One event creates deduplicated authorized notifications; failed delivery is visible |
| FR-10 | Resolution, closure, reopen and CSAT | P1 | State rules and required resolution fields apply in UI and API |
| FR-11 | Role and queue permissions with audit | P1 | Unauthorized record access is denied even with a guessed URL |
| FR-12 | Operational dashboard and basic report | P1 | Drill-down records reproduce KPI values for the same scope and dates |
| FR-13 | Service catalog and conditional forms | P2 | Versioned form answers and approval policy survive later catalog edits |
| FR-14 | Knowledge authoring and publishing | P2 | Drafts remain private; published articles respect audience rules |
| FR-15 | Asset inventory and assignment | P2 | Asset transfers update custody history and linked employee inventory |
| FR-16 | Routing and automation | P2 | Test mode previews effects; executions are auditable, idempotent and loop-limited |
| FR-17 | Email intake | P2 | Verified replies thread correctly; duplicates and auto-replies are suppressed |
| FR-18 | Report builder and scheduled exports | P2 | Exports honor permissions at execution time and expire securely |
| FR-19 | Major incident coordination | P3 | Linked tickets and authorized status updates share a consistent incident timeline |
| FR-20 | Problem and known-error management | P3 | Multiple incidents link to a problem and approved workaround |
| FR-21 | Change management and calendar | P3 | Approval and scheduling gates prevent premature implementation |
| FR-22 | CMDB dependency visibility | P3 | Authorized users inspect service dependencies with linked change impact |
| FR-23 | AI-assisted suggestions | P4 | Suggestions are labeled, source-linked and require explicit acceptance |
| FR-24 | English/Arabic localization | P4 | RTL mirrors layout appropriately while IDs and code stay readable |

## 8. Essential end-to-end journeys

1. **Employee issue:** Portal → report issue → suggested articles → submit → confirmation → ticket detail → agent public reply → employee reply → resolution → confirm/auto-close → CSAT.
2. **Agent triage:** Overview → unassigned queue → preview → open ticket → classify impact/urgency → assign team and agent → investigate → internal note/public reply → resolve.
3. **Access request:** Catalog → access item → system and access-level fields → manager approval → system-owner approval → fulfillment task → verified entitlement → completion. No self-approval; entitlement changes restart approval.
4. **Hardware request:** Catalog → laptop request → business justification → approval → stock allocation or procurement request → asset assignment → delivery acknowledgment → request resolution.
5. **Major outage:** Incident → declare major incident → coordinator and bridge → linked affected tickets → status updates → recovery → post-incident review → linked problem/change.
6. **Recurring issue:** Repeated incidents → problem record → root-cause investigation → workaround article → change request → approved implementation → validation → problem resolution.
7. **Change:** Create → assess risk → review/approval → schedule/conflict check → implement tasks → validate or roll back → post-implementation review → close.

## 9. Visual direction for Google Stitch

Design a professional enterprise product with strong information hierarchy and comfortable density. Use product typography and purposeful whitespace. Operational data, readable tables and clear actions should dominate; avoid decorative illustrations in the agent workspace.

### Proposed foundations

- Desktop canvas: 1440×1024; tablet: 1024×768; mobile: 390×844.
- Typeface: Inter or a comparable readable sans-serif; body 14–16px; table 13–14px; page title 28px; section title 18px.
- Background #F5F7FA; surface #FFFFFF; text #172033; muted text #586579; border #DCE2EA; primary #2457D6.
- Status accents: success #167647, warning #9A5B00, danger #B42318, information #175CD3. Check actual text/background combinations for contrast before implementation.
- Use 8px spacing increments, 8–12px card radius, restrained shadows, consistent 20px icons and 40–44px interactive controls.
- P1 uses a danger label and icon; warning/breached SLA uses text plus icon. Never encode status only by color.
- Tables offer sticky headers, column controls, pagination and selected-row actions. Empty states explain the next useful action.
- Primary actions: “Create ticket,” “Send reply,” “Resolve ticket,” “Approve request.” Destructive actions require a reason and confirmation.
- Employee portal uses simpler language and lower density than the agent workspace.
- Dark mode is a later theme variant, not a separate product or release dependency.

### Shared component inventory

App shell; sidebar group; breadcrumb; page header; search/command dialog; KPI card; chart with accessible table alternative; ticket table; filter bar; filter builder; saved-view menu; status/priority chips; SLA indicator; avatar stack; user/team selector; rich-text editor; attachment uploader; conversation item; internal-note banner; timeline; side drawer; tabs; stepper; approval card; confirmation dialog; toast; inline validation; skeleton; error panel; empty state; pagination; date-range selector.

### Universal interaction states

Each screen must specify loading, empty, populated, validation error, permission denied and recoverable server-error states where applicable. Preserve form input after failures. Uploads show progress, cancellation and retry. Long operations show progress and outcome. Disabled controls explain the blocking rule. Announce errors and updates accessibly. Use explicit loading states instead of fake populated records in production.

## 10. Detailed screen inventory

Every screen below includes its purpose, contents, primary interactions and critical states. Routes are proposed and may change in implementation. All screens inherit the shared shell and universal states unless explicitly public.

### A01 — Sign in

- **Route:** `/login`
- **Audience / phase:** All users · P1
- **Layout and content:** Public two-column page with organization identity, email/password form, SSO button, recovery link and privacy link.
- **Actions and behavior:** Sign in; continue with organization SSO. Use generic authentication errors; retain email only.
- **Critical states:** Invalid credentials, disabled account, SSO unavailable, rate limit, session expired.

### A02 — Recovery and reset

- **Route:** `/password/reset`
- **Audience / phase:** Local-account users · P1
- **Layout and content:** Email entry, neutral confirmation and token-based new-password view with requirements and visibility toggle.
- **Actions and behavior:** Request reset; save new password; return to sign-in. SSO users receive identity-provider guidance.
- **Critical states:** Expired/used token, password mismatch, policy failure; never reveal whether an email exists.

### A03 — MFA and session challenge

- **Route:** `/verify`
- **Audience / phase:** Users subject to policy · P1
- **Layout and content:** Code entry, method label, recovery-code option and session/security explanation.
- **Actions and behavior:** Verify; resend where applicable; use recovery method.
- **Critical states:** Invalid/expired challenge, retry limit and inaccessible method; no insecure bypass.

### E01 — Employee home

- **Route:** `/portal`
- **Audience / phase:** Employee · P1
- **Layout and content:** Welcome header; prominent support search; Report an issue and Request a service actions; own open-ticket count; recent tickets; active service notice; suggested articles.
- **Actions and behavior:** Search help; create incident; open own ticket; browse catalog.
- **Critical states:** First-time user; no active tickets; outage banner; articles unavailable.

### E02 — Report an issue

- **Route:** `/portal/tickets/new`
- **Audience / phase:** Employee · P1
- **Layout and content:** Single-column form with subject, description, category, affected service/asset, impact questions, urgency questions and attachments; contextual article suggestions alongside on desktop.
- **Actions and behavior:** Save local/session draft; review; submit. Show calculated priority explanation and upload limits.
- **Critical states:** Required fields; failed upload; duplicate submission; unsaved changes; possible existing outage.

### E03 — Submission confirmation

- **Route:** `/portal/tickets/confirmation/:id`
- **Audience / phase:** Employee · P1
- **Layout and content:** Ticket number, subject, received timestamp, calculated priority, response expectation and next steps.
- **Actions and behavior:** View ticket; report another issue; copy ticket number.
- **Critical states:** Pending submission reconciliation; notification delivery delay does not imply ticket failure.

### E04 — My tickets

- **Route:** `/portal/tickets`
- **Audience / phase:** Employee · P1
- **Layout and content:** Tabs for Active, Resolved and All; search; date/status filters; rows with number, subject, status, updated time and next action.
- **Actions and behavior:** Open ticket; change filters; paginate. Mobile renders equivalent cards.
- **Critical states:** No tickets; no matching filters; restricted/shared ticket no longer available.

### E05 — Employee ticket detail

- **Route:** `/portal/tickets/:id`
- **Audience / phase:** Employee · P1
- **Layout and content:** Header with number/status; public conversation; attachments; visible owner/team; response expectation; request answers; related published help; reply composer.
- **Actions and behavior:** Reply; download authorized attachment; cancel eligible request; reopen with reason; confirm solution.
- **Critical states:** Waiting for employee; resolved confirmation; closed read-only; failed send with preserved draft. Never show internal notes.

### E06 — Service catalog

- **Route:** `/portal/catalog`
- **Audience / phase:** Employee · P2
- **Layout and content:** Search; category navigation; service cards with title, description, estimated fulfillment and approval requirement.
- **Actions and behavior:** Browse categories; view item; see own submitted requests.
- **Critical states:** No eligible services; no results; unavailable item with explanation.

### E07 — Catalog item and request form

- **Route:** `/portal/catalog/:slug`
- **Audience / phase:** Employee · P2
- **Layout and content:** Item overview, eligibility, estimated cost/time, conditional questions, asset/system selectors, justification and approval preview.
- **Actions and behavior:** Submit request; review answers; return to catalog. Preserve item version with submission.
- **Critical states:** Ineligible user; validation; item retired; unavailable stock; changed price requiring review.

### E08 — Knowledge search

- **Route:** `/portal/knowledge`
- **Audience / phase:** Employee · P2
- **Layout and content:** Search with category filters, article cards, breadcrumbs and popular help topics; visible audience only.
- **Actions and behavior:** Search; filter; open article; report unresolved issue with search context.
- **Critical states:** No results with support CTA; unavailable category; permissions filtered before counts.

### E09 — Knowledge article

- **Route:** `/portal/knowledge/:slug`
- **Audience / phase:** Employee · P2
- **Layout and content:** Title, updated date, category, readable steps, table of contents, attachments, related articles and helpfulness control.
- **Actions and behavior:** Mark helpful; report outdated content; create ticket with article reference.
- **Critical states:** Archived article replacement link; inaccessible attachment; long content mobile navigation.

### E10 — My assets

- **Route:** `/portal/assets`
- **Audience / phase:** Employee · P2
- **Layout and content:** Assigned device cards/table with tag, model, assignment date, warranty and support action.
- **Actions and behavior:** View permitted details; report issue against asset; acknowledge receipt/return where requested.
- **Critical states:** No assigned assets; transfer awaiting acknowledgment; lost/stolen report escalation.

### E11 — Employee approvals inbox

- **Route:** `/portal/approvals`
- **Audience / phase:** Approver · P1
- **Layout and content:** Pending/Completed tabs; request summary, requester, amount, service, due date and approval step.
- **Actions and behavior:** Open decision page; filter by age/type. Avoid bulk approvals for sensitive entitlements.
- **Critical states:** No pending items; delegated item; request withdrawn or changed.

### E12 — Approval decision

- **Route:** `/portal/approvals/:id`
- **Audience / phase:** Approver · P1
- **Layout and content:** Request justification, relevant answers, cost/access scope, approver chain, prior decisions and comment field.
- **Actions and behavior:** Approve; reject with reason; request clarification; delegate if permitted.
- **Critical states:** Self-approval blocked; stale version; already decided; unavailable delegate. Clarification preserves pending approval.

### E13 — Service status

- **Route:** `/portal/status`
- **Audience / phase:** Employee · P3
- **Layout and content:** Service health list, active incident cards, scheduled maintenance and dated update timeline.
- **Actions and behavior:** Inspect outage; subscribe to authorized updates; link existing issue to incident.
- **Critical states:** All operational; active degradation; maintenance; stale health source labeled.

### E14 — Notifications

- **Route:** `/notifications`
- **Audience / phase:** All signed-in users · P1
- **Layout and content:** Unread/all tabs; categorized events with timestamp, related record and delivery-independent read state.
- **Actions and behavior:** Open record; mark read/all read; adjust preferences.
- **Critical states:** No notifications; related record removed or permission revoked.

### E15 — Profile and preferences

- **Route:** `/profile`
- **Audience / phase:** All signed-in users · P1
- **Layout and content:** Identity summary; read-only directory fields where managed; language/timezone; notification preferences; sessions and security links.
- **Actions and behavior:** Save preferences; revoke own sessions; manage MFA where locally supported.
- **Critical states:** Directory-managed setting; save failure; mandatory notifications cannot be disabled.

### E16 — Resolution feedback

- **Route:** `/portal/tickets/:id/feedback`
- **Audience / phase:** Requester · P1
- **Layout and content:** Ticket summary, five-point rating, optional comment and confirmation.
- **Actions and behavior:** Submit one response per resolution cycle; edit within configured window.
- **Critical states:** Already rated; feedback window expired; ticket reopened; unavailable ticket.

### W01 — Agent overview dashboard

- **Route:** `/workspace`
- **Audience / phase:** Agent/lead · P1
- **Layout and content:** Date/team filter; KPI cards for open, unassigned, due soon and breached; ticket inflow vs resolution chart; priority distribution; actionable worklist.
- **Actions and behavior:** Drill into filtered queues; create ticket; open high-risk record. Include last refreshed time.
- **Critical states:** No assigned work; partial widget failure; no team access. All cards use the same permission scope.

### W02 — Ticket queue

- **Route:** `/workspace/tickets`
- **Audience / phase:** Agent · P1
- **Layout and content:** Saved-view navigation; search; filter chips; customizable table with number, subject, requester, team, assignee, priority, status, SLA and updated time.
- **Actions and behavior:** Sort; paginate; save view; select rows; assign, change allowed fields or export. Show per-row failures after bulk actions.
- **Critical states:** Empty queue; no matches; partial bulk success; selection cleared when scope changes.

### W03 — Agent ticket detail

- **Route:** `/workspace/tickets/:id`
- **Audience / phase:** Agent · P1
- **Layout and content:** Three-column desktop: compact record navigation; central header, conversation and composer; right property rail with requester, asset, service, priority, assignment and SLA. Tabs for Activity, Tasks, Related and Time.
- **Actions and behavior:** Send public reply; add internal note; assign; update state; attach; resolve; escalate. Composer defaults visibly to public or internal, with unmistakable mode labeling.
- **Critical states:** Concurrent change; failed reply; restricted note; breached SLA; offline draft; closed record. Keyboard navigation reaches every panel.

### W04 — Create ticket on behalf of user

- **Route:** `/workspace/tickets/new`
- **Audience / phase:** Agent · P1
- **Layout and content:** Requester lookup, source, ticket type, subject/body, category/service, asset, impact/urgency and team/assignee.
- **Actions and behavior:** Create; optionally send acknowledgment; link existing incident.
- **Critical states:** Unknown requester; unauthorized requester/team; duplicate detection; invalid category-service pairing.

### W05 — Triage preview drawer

- **Route:** `/workspace/tickets?preview=:id`
- **Audience / phase:** Agent · P1
- **Layout and content:** Queue-preserving drawer with subject, description excerpt, requester, impact/urgency, routing suggestion and assignment controls.
- **Actions and behavior:** Accept assignment; classify; open full detail; next/previous permitted record.
- **Critical states:** Stale queue item; record reassigned; insufficient rights; mobile uses full-screen sheet.

### W06 — Advanced filters and saved views

- **Route:** `/workspace/views`
- **Audience / phase:** Agent/lead · P2
- **Layout and content:** Condition builder with field/operator/value rows, AND/OR grouping, live authorized count, column and sort settings; personal/team visibility.
- **Actions and behavior:** Preview results; save/rename view; share with team if allowed; reset.
- **Critical states:** Invalid filter; unavailable retired field; empty result; name conflict; view access revoked.

### W07 — Resolve ticket dialog

- **Route:** `/workspace/tickets/:id#resolve`
- **Audience / phase:** Agent · P1
- **Layout and content:** Resolution code, public solution summary, optional article link, linked task checklist and notification preview.
- **Actions and behavior:** Resolve ticket; return to investigation.
- **Critical states:** Required task incomplete; pending approval; missing summary; conflicting update. Success updates record and queue once.

### W08 — Escalate or transfer dialog

- **Route:** `/workspace/tickets/:id#escalate`
- **Audience / phase:** Agent/lead · P1
- **Layout and content:** Destination team/person, escalation level, reason, SLA context and access-impact explanation.
- **Actions and behavior:** Confirm transfer/escalation; notify destination.
- **Critical states:** No eligible team; sensitive-record sharing needs authorized grant; destination unavailable.

### W09 — Related records and merge

- **Route:** `/workspace/tickets/:id/related`
- **Audience / phase:** Agent · P2
- **Layout and content:** Tabs for incidents/requests, problems, changes, assets and articles; relation type; search; duplicate comparison.
- **Actions and behavior:** Link/unlink with reason; merge confirmed duplicate into selected survivor; preview visibility impact.
- **Critical states:** Circular/self-link; unauthorized target; conflicting merge; attachment and conversation access mismatch.

### W10 — Tasks and time log

- **Route:** `/workspace/tickets/:id/tasks`
- **Audience / phase:** Agent · P2
- **Layout and content:** Task checklist with owner/due date/dependencies; time entries with duration, work date, author and optional billing flag.
- **Actions and behavior:** Add/assign/complete tasks; add/correct time with audit.
- **Critical states:** Blocked dependency; invalid duration; overlap warning; closed-period edit restriction.

### W11 — Team workload

- **Route:** `/workspace/team`
- **Audience / phase:** Lead · P2
- **Layout and content:** Team filter; agent rows/cards with availability, active load, high-priority load, due-soon work and assignment list.
- **Actions and behavior:** Reassign with confirmation; open agent workload; set capacity/availability if permitted.
- **Critical states:** Absent agent; no available assignee; reassignment conflicts; keyboard alternative to drag-and-drop.

### W12 — Major incidents list

- **Route:** `/workspace/major-incidents`
- **Audience / phase:** Lead/manager · P3
- **Layout and content:** Active/review/completed tabs; severity, affected services, coordinator, start time and linked ticket count.
- **Actions and behavior:** Declare major incident from existing incident; open command center.
- **Critical states:** No active incident; duplicate active event warning; permission failure.

### W13 — Major incident command center

- **Route:** `/workspace/major-incidents/:id`
- **Audience / phase:** Coordinator/responders · P3
- **Layout and content:** Incident banner, service impact, coordinator/roles, bridge link, timeline, mitigation tasks, linked incidents and public-update editor.
- **Actions and behavior:** Publish scoped update; assign responders; link tickets; record recovery; create review/problem.
- **Critical states:** Unverified public message; failed publication; stale status; recovery awaiting validation.

### W14 — Service requests workspace

- **Route:** `/workspace/requests`
- **Audience / phase:** Agent · P2
- **Layout and content:** Request table with catalog item, requester, approval stage, cost, fulfillment state and SLA; filters by service/team.
- **Actions and behavior:** Open request; assign fulfiller; inspect approval history.
- **Critical states:** Rejected/cancelled requests; missing catalog item snapshot; blocked fulfillment.

### W15 — Request fulfillment detail

- **Route:** `/workspace/requests/:id`
- **Audience / phase:** Agent · P2
- **Layout and content:** Submitted form snapshot, approval timeline, fulfillment tasks, inventory allocation, delivery details and requester conversation.
- **Actions and behavior:** Allocate stock; create purchase request; fulfill approved task; record delivery acknowledgment.
- **Critical states:** Approval pending; item unavailable; altered scope restarts approval; duplicate allocation blocked.

### P01 — Problems register

- **Route:** `/workspace/problems`
- **Audience / phase:** Agent/problem manager · P3
- **Layout and content:** Searchable table with number, title, status, owner, linked incident count and known-error flag.
- **Actions and behavior:** Create/open problem; filter recurring services.
- **Critical states:** No problems; no matching services; unauthorized links excluded.

### P02 — Problem investigation

- **Route:** `/workspace/problems/:id`
- **Audience / phase:** Problem owner · P3
- **Layout and content:** Summary, symptoms, linked incidents, investigation timeline, root-cause field, workaround, known-error state and related changes.
- **Actions and behavior:** Record findings; publish reviewed workaround; create change; resolve with evidence.
- **Critical states:** Missing root cause/resolution; unresolved dependent work; article review pending.

### C01 — Changes register

- **Route:** `/workspace/changes`
- **Audience / phase:** Change team · P3
- **Layout and content:** Change table with type, risk, service, owner, state, approval and scheduled window.
- **Actions and behavior:** Create/open change; filter emergency/normal/standard changes.
- **Critical states:** No records; rejected changes; unauthorized affected service.

### C02 — Change editor and assessment

- **Route:** `/workspace/changes/new`
- **Audience / phase:** Change requester · P3
- **Layout and content:** Stepper: scope, affected services/assets, risk questionnaire, implementation/test/rollback plans, schedule and reviewer selection.
- **Actions and behavior:** Save draft; run conflict check; submit for review.
- **Critical states:** Missing rollback plan; invalid window; overlapping service maintenance; standard template no longer approved.

### C03 — Change detail and execution

- **Route:** `/workspace/changes/:id`
- **Audience / phase:** Change team/approver · P3
- **Layout and content:** Risk summary, versioned plans, approval chain, schedule, execution checklist, communications and validation results.
- **Actions and behavior:** Approve/reject; start authorized window; log implementation; roll back; complete review.
- **Critical states:** Unapproved/expired approval; outside window; failed validation; rollback in progress. Emergency changes require documented expedited authority and retrospective review.

### C04 — Change calendar

- **Route:** `/workspace/changes/calendar`
- **Audience / phase:** Agent/manager · P3
- **Layout and content:** Month/week/list views; service/environment filters; maintenance windows and conflict markers.
- **Actions and behavior:** Open change; propose a new window; inspect overlap.
- **Critical states:** Timezone differences clearly labeled; empty calendar; reschedule requires reapproval when policy dictates.

### I01 — Asset inventory

- **Route:** `/workspace/assets`
- **Audience / phase:** Asset manager/agent · P2
- **Layout and content:** Search, type/state/location filters; table with tag, model, serial, custodian, lifecycle, warranty and linked incidents.
- **Actions and behavior:** Add/import; open asset; export scoped inventory; initiate transfer.
- **Critical states:** No stock; duplicate tag/serial; failed import rows downloadable as authorized error report.

### I02 — Asset detail

- **Route:** `/workspace/assets/:id`
- **Audience / phase:** Asset manager/authorized agent · P2
- **Layout and content:** Overview, owner/location, lifecycle timeline, technical specs, warranties, related tickets, custody and maintenance tabs.
- **Actions and behavior:** Assign/transfer; record repair; flag lost; retire with reason.
- **Critical states:** Already assigned; missing acknowledgment; restricted financial fields; retirement with open dependencies.

### I03 — Asset registration and import

- **Route:** `/workspace/assets/new`
- **Audience / phase:** Asset manager · P2
- **Layout and content:** Manual form and CSV wizard: upload, map columns, validate, preview, import results.
- **Actions and behavior:** Create asset; dry-run import; commit valid rows with explicit policy for invalid rows.
- **Critical states:** Duplicate records; invalid columns; interrupted import; retry uses job identifier to prevent duplication.

### I04 — CMDB services and dependencies

- **Route:** `/workspace/cmdb`
- **Audience / phase:** Service owner/agent · P3
- **Layout and content:** Service list plus selected dependency graph with owner, environment, health and upstream/downstream panels.
- **Actions and behavior:** Inspect node; link CI; open affected incidents/changes; switch to accessible table view.
- **Critical states:** Missing dependencies; cycles flagged; stale integration data; unauthorized node hidden safely.

### K01 — Knowledge management

- **Route:** `/workspace/knowledge`
- **Audience / phase:** Editor/publisher · P2
- **Layout and content:** Draft/review/published/archived tabs; owner, audience, last update, review due and usefulness metrics.
- **Actions and behavior:** Create article; submit review; filter overdue reviews.
- **Critical states:** No articles; expired review date; restricted spaces.

### K02 — Knowledge editor and review

- **Route:** `/workspace/knowledge/:id/edit`
- **Audience / phase:** Editor/publisher · P2
- **Layout and content:** Title, category, audience, structured rich-text body, attachments, preview, version history and reviewer comments.
- **Actions and behavior:** Save draft; submit review; approve/publish with permission; archive with replacement link.
- **Critical states:** Unsaved changes; concurrent editing; unpublished links; invalid audience; failed publication.

### R01 — Service performance reports

- **Route:** `/workspace/reports`
- **Audience / phase:** Lead/manager · P1
- **Layout and content:** Date/team/service filters; SLA attainment, response/resolution distributions, backlog aging, volume trends and CSAT with response rate; drill-down table.
- **Actions and behavior:** Compare periods; drill into authorized records; export filtered data.
- **Critical states:** No sample; incomplete period; permission-limited results labeled; timezone and metric definitions available.

### R02 — Report builder and schedules

- **Route:** `/workspace/reports/builder`
- **Audience / phase:** Manager · P2
- **Layout and content:** Dataset and metric picker, dimensions, filters, chart/table preview, saved report list and schedule panel.
- **Actions and behavior:** Save; export; schedule to authorized recipients with expiring access; pause schedule.
- **Critical states:** Invalid dimension; oversized result; revoked recipient permissions; failed delivery log. External recipients require explicit organizational policy.

### D01 — Administration overview

- **Route:** `/admin`
- **Audience / phase:** Administrator · P1
- **Layout and content:** Configuration sections, channel health, failed jobs, policy changes and setup checklist.
- **Actions and behavior:** Navigate settings; inspect failed job; review configuration warnings.
- **Critical states:** No elevated access; partially configured organization; integration outage.

### D02 — People and teams

- **Route:** `/admin/people`
- **Audience / phase:** Administrator · P1
- **Layout and content:** Users/Teams tabs; directory source, role, department, status and memberships; user/team side panel.
- **Actions and behavior:** Invite if supported; deactivate; assign team; sync directory; edit manager.
- **Critical states:** Last-admin removal blocked; directory-managed values locked; active tickets need reassignment before deactivation.

### D03 — Roles and permissions

- **Route:** `/admin/roles`
- **Audience / phase:** Security administrator · P1
- **Layout and content:** Role list, capability matrix, queue/department scope and effective-access preview.
- **Actions and behavior:** Create custom role; inspect user access; save permission changes with reason.
- **Critical states:** Privilege escalation blocked; conflicting grants explained; lockout prevention; confirmation for broad access.

### D04 — Ticket fields, forms and taxonomy

- **Route:** `/admin/forms`
- **Audience / phase:** Administrator · P1
- **Layout and content:** Forms list; field palette; conditional visibility; validation; categories/subcategories; service ownership; employee/agent preview.
- **Actions and behavior:** Add/reorder fields; preview conditions; publish version; retire field/category.
- **Critical states:** Circular conditions; missing required defaults; breaking change warning; historical records retain values.

### D05 — SLA policies and calendars

- **Route:** `/admin/sla`
- **Audience / phase:** Administrator/authorized lead · P1
- **Layout and content:** Policy list and editor with match conditions, priority targets, calendar, pause rules, warning thresholds; timezone, business-hours and holiday editor.
- **Actions and behavior:** Simulate a sample timeline; publish version; choose future-only or explicit audited migration for existing tickets.
- **Critical states:** Overlapping policies; no match fallback; invalid hours; DST preview; changes never silently rewrite historic metrics.

### D06 — Routing and automation builder

- **Route:** `/admin/automation`
- **Audience / phase:** Administrator · P2
- **Layout and content:** Rules list ordered by priority; trigger/condition/action builder; dry-run panel; execution history and failure reason.
- **Actions and behavior:** Test against sample ticket; publish; disable; reorder; retry safe failed action.
- **Critical states:** Conflicting rules; recursion limit; invalid assignee; partial execution. Preview public-message actions before enabling.

### D07 — Approval workflow builder

- **Route:** `/admin/approvals`
- **Audience / phase:** Administrator · P2
- **Layout and content:** Service-linked workflows; sequential/parallel steps; approver resolver; amount/access conditions; fallback and delegation policy; flow preview.
- **Actions and behavior:** Simulate requester scenario; validate; publish version.
- **Critical states:** Missing manager; self-approval; circular chain; absent approver; rejection stops remaining steps. No response escalates, never auto-approves.

### D08 — Catalog administration

- **Route:** `/admin/catalog`
- **Audience / phase:** Administrator/service owner · P2
- **Layout and content:** Catalog item list; editor for description, eligibility, cost estimate, conditional form, approval flow, fulfillment template and publication.
- **Actions and behavior:** Preview as employee; publish/retire item; version fulfillment template.
- **Critical states:** Missing approver/workflow; unavailable service owner; published item validation failure.

### D09 — Channels and integrations

- **Route:** `/admin/integrations`
- **Audience / phase:** Administrator · P2
- **Layout and content:** Cards for email, identity directory, collaboration, monitoring, webhooks and asset import; status, last success and configuration drawer.
- **Actions and behavior:** Connect/test; map fields; inspect delivery logs; rotate credential; disconnect with impact explanation.
- **Critical states:** Expired credentials; rate limits; invalid webhook signature; retry queue; secrets never displayed after save.

### D10 — Notification templates

- **Route:** `/admin/notifications`
- **Audience / phase:** Administrator · P2
- **Layout and content:** Event/channel templates, variable picker, audience rules and preview with synthetic data.
- **Actions and behavior:** Edit; send test to authorized test recipient; publish version; restore prior version.
- **Critical states:** Invalid placeholder; accidental internal field exposure blocked; mandatory notification rules explained.

### D11 — Security and organization settings

- **Route:** `/admin/settings`
- **Audience / phase:** Administrator · P1
- **Layout and content:** Organization branding/timezone; identity policy; MFA/session controls; attachment restrictions; data retention; privacy/export controls.
- **Actions and behavior:** Save scoped settings; preview branding; validate session policy; configure retention with impact summary.
- **Critical states:** Invalid configuration; identity lockout prevention; destructive retention change requires explicit confirmation and audit.

### D12 — Audit log and job history

- **Route:** `/admin/audit`
- **Audience / phase:** Auditor/administrator · P1
- **Layout and content:** Immutable event table with actor, action, record, timestamp, source and old/new value view; separate background-job status tab.
- **Actions and behavior:** Filter; inspect event; export authorized range; retry eligible job with reason.
- **Critical states:** No events; sensitive values redacted; unavailable historical partition; failed export. Log views and exports where policy requires.

### S01 — Global search

- **Route:** `/search`
- **Audience / phase:** All signed-in users · P1
- **Layout and content:** Search overlay/full page with grouped tickets, articles, people, assets and services according to permission; keyboard navigation and recent personal searches.
- **Actions and behavior:** Search; narrow record type; open result; clear history.
- **Critical states:** No results; unavailable search; forbidden records never contribute snippets or counts.

### S02 — System and access states

- **Route:** `/403, /404, /maintenance`
- **Audience / phase:** All users · P1
- **Layout and content:** Consistent access denied, not found, maintenance, offline and session-expired templates with helpful action and reference code.
- **Actions and behavior:** Return to workspace; retry; sign in; contact support.
- **Critical states:** Do not reveal whether an unauthorized sensitive record exists; preserve unsent drafts safely after reauthentication.

**Screen coverage:** 62 screen specifications. Dialogs, drawers and system states are included as design units; they do not all require separate navigation pages.

## 11. Dashboard definitions

All metrics display the selected date range, timezone, team scope and last refresh. An empty denominator displays “No eligible tickets,” never 100% compliance.

| Widget | Calculation / behavior |
| --- | --- |
| Open tickets | Current count in New, Open, In progress, Pending requester or Pending external; excludes Resolved, Closed and Cancelled |
| Unassigned | Active tickets without an individual assignee; team assignment alone still counts as unassigned |
| Due soon | Active, running SLA cycles at or above 75% elapsed and below breach; label which target is approaching |
| Breached | Active tickets with at least one currently breached applicable target; drill-down identifies response vs resolution |
| Created vs resolved | Created events and resolution-cycle events per period; label cycles explicitly so reopened records do not distort ticket counts |
| SLA attainment | Met target cycles / eligible completed target cycles in period; response and resolution reported separately |
| First response | Created-to-first-human-public-reply business duration; show median and p90; separately show unanswered work |
| Resolution duration | Cycle start to resolution minus allowed business-time pauses; show median and p90 |
| Backlog aging | Current active ticket age from creation in calendar days, grouped 0–2, 3–7, 8–14, 15–30, 31+ |
| CSAT | Mean submitted rating and response rate; show count and score distribution |
| Agent workload | Active assigned count with P1/P2 and due-soon/breached counts; avoid ranking agents solely by closure volume |

## 12. Notifications and integrations

| Event | Recipient | Default channel | Required behavior |
| --- | --- | --- | --- |
| Ticket created | Requester | In-app + email | Number, subject and secure link; no sensitive body by default |
| Assigned/reassigned | Current assignee or team | In-app | Previous owner no longer receives future restricted updates |
| Public reply | Requester or assigned agent depending on author | In-app + email | Thread token and authorized reply processing |
| Internal note mention | Authorized mentioned agent | In-app | No requester email or note content leakage |
| Approval requested | Assigned approver | In-app + email | Due date and authenticated decision link |
| SLA warning/breach | Owner and configured lead | In-app + optional email | Deduplicated per threshold and cycle |
| Resolved/closed/reopened | Requester and current owner | In-app + email | Clear next action and recorded reason |
| Major incident update | Authorized subscribers | In-app + optional email | Audience-specific update; separate internal timeline |

Integration adapters must verify source identity/signatures, limit requests, deduplicate source event IDs, queue retries with backoff, and expose failed jobs. Email attachments use the same scanning and access checks as portal uploads. Prevent mail loops and forged thread-token access. Integration credentials are encrypted and scoped; connection tests do not display secrets.

## 13. Security, accessibility and non-functional requirements

These are proposed engineering acceptance targets rather than claims of certification.

- **Access:** Deny by default; organization and record scope on every server query. Protect file URLs and exports; use short-lived authorized downloads. Restrict service accounts and audit privileged operations.
- **Authentication:** Use a managed identity provider where possible; MFA by organizational policy. Protect sessions, support revocation, rate-limit sign-in and recovery. Do not store plain-text passwords or tokens in logs.
- **Application protection:** Validate input server-side; sanitize rich text; prevent injection, CSRF where applicable, and unsafe URL/file rendering. Store secrets outside source control.
- **Attachments:** Proposed default 10 files per message, 20 MB per file; allowlisted formats, server-side type validation, malware scan and quarantine. Block executable attachments by default. Upload completion is distinct from scan availability.
- **Privacy:** Minimize personal data in notifications and logs. Configure retention by record type; use approved deletion/anonymization jobs with legal-hold support where needed. Retention length and hosting region require organizational decisions before production.
- **Accessibility:** Target WCAG 2.2 AA. Keyboard-accessible workflows, visible focus, semantic tables, labels, inline errors, sufficient contrast, reduced motion and screen-reader announcements. Dialogs trap and restore focus. Charts include equivalent data tables.
- **Responsiveness:** Fully functional employee experience on mobile. Agent queues support cards or horizontal table scrolling without clipped actions; detail views stack panels logically. Calendar has a list alternative.
- **Performance:** Proposed test dataset: 100,000 tickets, 5,000 assets and 200 concurrent active users. Under that agreed load, p95 core API reads <800 ms and visible queue usable <2.5 seconds on the defined test network. Paginate server-side; lazy-load long conversations.
- **Reliability:** Target 99.9% monthly availability excluding agreed maintenance; durable queued notifications; idempotent submission, webhook handling and background jobs. Define and test failure recovery before release.
- **Backup:** Proposed RPO ≤1 hour and RTO ≤4 hours; validate restore in a non-production environment before launch and periodically thereafter.
- **Observability:** Structured redacted logs, correlation IDs, error tracking, queue/job metrics and alerting for failed intake, SLA processing and integration delivery.
- **Localization:** Store dates in UTC; render in selected timezone. Externalize strings and support pluralization. Arabic uses proper RTL reading order; email addresses, ticket IDs and code fragments retain LTR behavior.

## 14. Logical implementation contract

The PRD is framework-independent. The following interfaces describe behavior without committing to a vendor or stack.

| Capability | Example interface | Key rule |
| --- | --- | --- |
| Ticket list/create | `GET /tickets`, `POST /tickets` | Permission-scoped pagination; create idempotency key |
| Ticket update | `PATCH /tickets/:id` | Version/ETag check; validated transition; atomic event write |
| Conversation | `GET/POST /tickets/:id/messages` | Public/internal visibility enforced at storage and serialization |
| Transition | `POST /tickets/:id/transitions` | Required reason/solution and approval gates validated |
| Approval decision | `POST /approvals/:id/decision` | Assigned approver and request version checked atomically |
| Upload | `POST /attachments`, authorized download | Quarantine until scan completes; linked-record permission required |
| Catalog | `GET /catalog`, `POST /requests` | Persist published item/form/workflow version |
| Assets/knowledge | Scoped list, detail and mutation interfaces | Separate publication and inventory permissions |
| Dashboard/report | `GET /metrics`, report/export jobs | Shared metric definitions and identical filter semantics |
| Automation/audit | Rule test/publish; read-only audit queries | Immutable execution evidence; redact secrets |

Use transactional writes for state changes, assignments and audit events. Publish asynchronous events through a reliable outbox or equivalent mechanism so committed tickets cannot lose notifications. Keep ticket current state separate from append-only events and SLA cycles. Search indexing can be eventually consistent; show the newly created record directly from the transactional response.

## 15. QA and release acceptance

### Required scenario checks

1. Employee creates a ticket with a valid attachment; one ticket exists despite retry, acknowledgment appears, and assigned queue receives it.
2. Agent posts an internal note and public reply; requester sees only the public reply in portal, email, search and export.
3. SLA spans a weekend, holiday and timezone change; displayed deadline matches the configured calendar. Reassignment does not reset it.
4. Pending requester pauses only the applicable resolution clock; a resumed ticket continues with the correct remaining time.
5. Two agents update one record; the second sees a conflict instead of overwriting the first.
6. Request needs two approvals; fulfillment is blocked until both approve. Self-approval, stale decisions and invalid delegation fail safely.
7. Request scope changes after approval; affected approval is invalidated and fulfillment pauses until reapproved.
8. Bulk assignment partly fails; successful rows persist and failed rows show reasons without replaying successes.
9. Unauthorized user tries a guessed ticket, attachment, article draft, export and report query; every route denies access without leaking content.
10. Resolve, reopen and resolve again; original SLA evidence remains, the new cycle is measured separately, and reporting labels are correct.
11. Catalog hardware request allocates one asset; concurrent requests cannot allocate the same stock item twice.
12. Duplicate email events create one message; spoofed sender or unauthorized thread reference cannot access the ticket.
13. Major incident update sends only audience-approved content; internal investigation stays restricted.
14. Change cannot start without valid approval; failed validation records rollback and triggers review.
15. Dashboard totals reconcile with scoped drill-down rows; exports match the same filters and permissions.
16. Keyboard-only and screen-reader users can submit, triage, approve and resolve. Mobile actions remain reachable at 390px width.
17. Notification or email failure does not roll back a committed ticket; retry succeeds without duplicates.
18. Backup restore recovers representative tickets, conversations, attachments, policies and audit records within agreed targets.

### Design handoff definition of done

- All P1 screens designed, linked and reviewed; P2/P3 modules have complete navigation and principal flows.
- Reusable components and tokens documented; desktop and mobile variants for primary journeys.
- Empty, loading, validation, permission, server-error and conflict states included.
- Every action has a destination or state change; no unlabeled icon-only controls or dead primary actions.
- Sample data is consistent across linked screens and labeled synthetic in presentations.
- Engineering handoff identifies required fields, permission gates and unresolved organizational decisions.

## 16. Synthetic demo dataset for consistent designs

Use the same records across every generated screen. These are fictional examples.

| Ticket | Subject | Requester | Priority | State | Team / owner | SLA presentation |
| --- | --- | --- | --- | --- | --- | --- |
| INC-1042 | Unable to connect to company VPN | Amina Yusuf | P2 High | In progress | Network Operations / Daniel Cole | Resolution due in 2 business hours |
| INC-1043 | Shared printer unavailable on floor 3 | Omar Hassan | P3 Medium | Open | Workplace IT / Unassigned | First response due in 45 business minutes |
| INC-1044 | Payroll service unavailable | Grace Okafor | P1 Critical | In progress | Applications / Priya Shah | Resolution breached by 18 minutes |
| REQ-2081 | Request access to finance workspace | Layla Ahmed | P3 Medium | Open | Identity & Access / Unassigned | Approval pending; fulfillment SLA not started |
| INC-1045 | Laptop battery drains rapidly | Samuel Reed | P4 Low | Pending requester | Workplace IT / Daniel Cole | Resolution paused; awaiting diagnostic details |
| INC-1046 | Outlook repeatedly requests sign-in | Mariam Bello | P3 Medium | Resolved | Identity & Access / Priya Shah | Resolution target met; confirmation requested |

Assets: AST-00321 Dell Latitude 7440 assigned to Amina Yusuf; AST-00418 HP LaserJet on floor 3; AST-00502 MacBook Pro assigned to Samuel Reed. Services: Corporate VPN, Email & Collaboration, Payroll, Printing, Identity & Access. Knowledge article: “Troubleshoot your VPN connection.” Problem PRB-031 links repeated VPN failures. Change CHG-087 upgrades the VPN gateway. Avoid showing false live integration or success indicators in designs.

## 17. Google Stitch master prompt

Copy the following block first. Then generate one screen or a small connected batch using Section 18. This document provides design instructions; it does not assume Stitch can implement the backend rules.

```text
Design ServiceDesk, a complete enterprise IT ticketing and service management web application, using the attached PRD as the source of truth.

There are three connected experiences: an employee self-service portal, an IT agent workspace, and an administrator console. Keep role-specific navigation and permissions clear.

Use a polished, practical enterprise visual style: light gray #F5F7FA background, white surfaces, dark #172033 text, muted #586579 text, #DCE2EA borders, and blue #2457D6 primary actions. Use Inter or a comparable sans-serif, 8px spacing increments, restrained shadows, 8–12px corner radii, and consistent accessible icons. Preserve readable data density. Use status text and icons alongside color.

Desktop: 1440×1024, 240px collapsible sidebar, 64px top bar, clear breadcrumb/page title/actions. Mobile: 390×844, drawer navigation, stacked panels and reachable controls. Reuse the same shell, tokens, buttons, inputs, chips, tables, dialogs, conversation composer and SLA indicators across all screens.

Use the PRD's synthetic dataset consistently. The employee portal must never show internal notes. The agent ticket detail must clearly distinguish public replies from internal notes. Approval status is distinct from ticket status. Show meaningful loading, empty, validation, permission and error variants.

Generate only the screens requested in the next instruction. Include the screen ID and title in design/frame names. Keep the previously established design system unchanged unless explicitly asked to revise it. Design coherent navigation and action outcomes. Do not invent business rules that conflict with the PRD. Treat backend behavior as handoff annotations rather than a claim of working functionality.
```

## 18. Screen generation batches and follow-up prompts

Generate the core interface first, then extend it. Review consistency after each batch. A batch is a suggested sequence; if output quality drops, generate its screens individually.

| Batch | Screens | Design objective |
| --- | --- | --- |
| 1 | W01, W02, W03 | Establish agent shell, dashboard, queue and ticket detail |
| 2 | E01, E02, E03, E04, E05 | Complete employee issue reporting and tracking |
| 3 | A01, A02, A03, E14, E15, S01, S02 | Access, shared navigation and system states |
| 4 | E11, E12, W07, W08, E16 | Approval, resolution, escalation and feedback |
| 5 | W04, W05, W06, W09, W10, W11 | Agent productivity and team operations |
| 6 | E06, E07, W14, W15, D08 | Service catalog and fulfillment |
| 7 | E08, E09, K01, K02 | Knowledge consumption and publication |
| 8 | E10, I01, I02, I03, I04 | Assets, custody and service dependencies |
| 9 | E13, W12, W13, P01, P02 | Outage coordination and problem investigation |
| 10 | C01, C02, C03, C04 | Change assessment, approvals, execution and calendar |
| 11 | R01, R02 | Performance measurement and report creation |
| 12 | D01, D02, D03, D04, D05 | Core organization and ticket policy settings |
| 13 | D06, D07, D09, D10, D11, D12 | Automation, integration, security and audit |

### Start with the agent dashboard

```text
Generate W01 — Agent overview dashboard according to Section 10. Include the shared agent shell, team/date filters, four actionable KPI cards, created-vs-resolved trend, priority breakdown and an at-risk worklist. Use synthetic ticket INC-1044 as breached and INC-1042 as in progress. Show realistic labels and definitions. Create desktop and mobile variants, plus loading and no-data variants. Dashboard KPIs must not imply that the six demo records represent an entire organization unless explicitly labeled as the demo scope.
```

### Reusable prompt for any screen

```text
Using the established ServiceDesk design system, generate [SCREEN ID — TITLE] from Section 10 of the attached PRD. Follow its audience, layout, fields, primary actions, behavior and critical states exactly. Reuse existing components. Connect navigation to the specified related screens. Include a populated desktop layout, its mobile adaptation, and the two most important edge-state variants. Annotate permission gates, required fields and state transitions for developer handoff. Do not expose agent-only information in employee screens.
```

### Ticket detail refinement prompt

```text
Refine W03 around INC-1042, Unable to connect to company VPN. Use a readable three-column desktop layout: compact navigation, central public conversation with reply/internal-note composer, and right properties rail. Include team/assignee, calculated priority with override reason, status, SLA deadline, requester profile, AST-00321, linked VPN article, tasks and audit activity. Make the internal-note mode unmistakable with a labeled banner. Add pending-requester, breached-SLA and concurrent-update variants. On mobile use stacked sections and a reachable reply action without covering conversation content.
```

### Employee journey prompt

```text
Create the connected E01 → E02 → E03 → E05 journey for Amina Yusuf reporting a VPN issue. Use friendly plain language, relevant knowledge suggestions and visible progress during attachment upload. On ticket detail show only public communication, service expectations and permissible requester actions. Include a failed submission with preserved form input, a resolved state with confirm/reopen controls, and mobile variants.
```

### Administration workflow prompt

```text
Create D06 — Routing and automation builder. Show a rules list and an editable rule: when a new incident has service Corporate VPN and priority P1 or P2, assign Network Operations and notify its lead. Include trigger, conditions, actions, rule ordering, enabled state, test preview, execution log and validation failures. Publishing must be separate from editing. Match the existing admin shell and include an accessible linear alternative to any visual flow canvas.
```

### Mobile and RTL follow-up

```text
Adapt the approved screen to 390×844 without losing actions, validation, data meaning or permission boundaries. Then create an Arabic RTL variant if requested: use natural Arabic UI copy, mirror navigation and reading order, keep ticket IDs/email/code LTR, and preserve icon meanings. Do not merely right-align English text.
```

### Final consistency review prompt

```text
Review all generated ServiceDesk screens against the PRD. Check role-specific navigation, repeated component consistency, ticket state/approval separation, SLA terminology, public/internal visibility, required fields, primary action outcomes, mobile overflow and accessibility. List discrepancies by screen ID and revise the affected screens while preserving approved design tokens. Verify every screen in the requested batch has been produced before adding new modules.
```

## 19. Decisions to confirm before implementation

These do not block initial Stitch design; the document's proposed defaults apply to design work.

| Decision | Design default | Production decision owner |
| --- | --- | --- |
| Product name/brand | ServiceDesk; neutral blue identity | Product owner |
| Hosting and technology | Framework-independent | Engineering owner |
| Identity provider | Organizational sign-in; local recovery only where applicable | IT/security |
| Business calendar | Organization-configured calendar; P1 24×7 | Service owner |
| SLA commitments | Proposed targets in Section 6 | IT operations |
| Data region and retention | No jurisdiction or retention period assumed | Security/privacy/legal |
| Restricted queues | Explicitly scoped membership | Service owners/security |
| Approval hierarchy | Manager then relevant service owner where needed | Process owner |
| Integrations | Email and identity first; others phased | Engineering/IT |
| Languages | English first; Arabic/RTL planned | Product owner |
| AI | Optional, suggestion-only, permission-scoped | Product/security |
| SaaS expansion | Single organization initially | Product/architecture |

## 20. Optional AI requirements

AI assistance may suggest category, priority rationale, relevant articles, reply drafts and conversation summaries. Every output is clearly labeled and editable. Retrieval must respect the current user's record permissions, including public/internal boundaries. Summaries cite source messages/articles and indicate uncertainty. Human acceptance is required before sending or changing records. Log accepted actions without retaining unnecessary sensitive prompts. AI failure must leave all standard ticket workflows usable. Evaluate incorrect suggestions, sensitive-data leakage and unsupported claims before enabling production use.

---
End of PRD. Recommended first design sequence: W01 → W02 → W03 → E01 → E02 → E05 → E12 → D05.
