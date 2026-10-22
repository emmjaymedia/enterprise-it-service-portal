# Screen coverage and navigation

The current user direction prioritizes all screen layouts and clickable navigation.
New feature behavior is deferred; existing ticket and account demo interactions remain.

## Coverage

All 62 PRD screen IDs are reachable, along with DS01 and S03 supporting reference
screens. Shared responsive components cover desktop and mobile layouts. Arabic
translation/RTL variants remain a separate localization task.

| Screen | Page | Review route |
| --- | --- | --- |
| A01 | Sign In | `/login` |
| A02 | Password Recovery | `/password/reset` |
| A03 | MFA Challenge | `/verify` |
| C01 | Changes Register & Release Governance | `/workspace/changes` |
| C02 | Create Change Request (RFC) | `/workspace/changes/new` |
| C03 | CHG-087 — Emergency firmware patch & gateway route sync | `/workspace/changes/CHG-087` |
| C04 | Enterprise Change & Maintenance Calendar | `/workspace/changes/calendar` |
| D01 | Administration Console & Governance Overview | `/admin` |
| D02 | People & Teams Management | `/admin/people` |
| D03 | Roles & Access Control Governance | `/admin/roles` |
| D04 | Ticket Fields, Dynamic Forms & Category Taxonomy | `/admin/forms` |
| D05 | SLA Policies, Business Calendars & Escalation Thresholds | `/admin/sla` |
| D06 | Intelligent Routing & Automation Engine | `/admin/automation` |
| D07 | Enterprise Approval Workflow Architecture | `/admin/approvals` |
| D08 | Catalog Administration & Service Definitions | `/admin/catalog` |
| D09 | Communication Channels & Enterprise Integrations | `/admin/integrations` |
| D10 | Enterprise Notification Templates & Delivery Policies | `/admin/notifications` |
| D11 | Enterprise Security Posture & Tenant Settings | `/admin/settings` |
| D12 | Immutable Audit Trail & System Job History | `/admin/audit` |
| DS01 | ServiceDesk UI Kit & Design System | `/design-system` |
| E01 | Employee Home | `/portal` |
| E02 | Report an Issue | `/portal/tickets/new` |
| E03 | Submission Confirmation | `/portal/tickets/confirmation/INC-1042` |
| E04 | My Tickets | `/portal/tickets` |
| E05 | Employee Ticket Detail | `/portal/tickets/INC-1042` |
| E06 | Enterprise Service Catalog | `/portal/catalog` |
| E07 | MacBook Pro 16-inch Hardware Refresh | `/portal/catalog/macbook-refresh` |
| E08 | Knowledge Base & Self-Service Guides | `/portal/knowledge` |
| E09 | Troubleshoot your VPN connection | `/portal/knowledge/vpn-connection` |
| E10 | My Assigned Hardware & Workplace Assets | `/portal/assets` |
| E11 | Approvals Inbox | `/portal/approvals` |
| E12 | Approval Decision | `/portal/approvals/REQ-2081` |
| E13 | Core Infrastructure Health | `/portal/status` |
| E14 | Notifications | `/notifications` |
| E15 | Profile & Preferences | `/profile` |
| E16 | Resolution Feedback | `/portal/tickets/REQ-1039/feedback` |
| I01 | Hardware & Asset Inventory | `/workspace/assets` |
| I02 | AST-00321 — Dell Latitude 7440 | `/workspace/assets/AST-00321` |
| I03 | Register & Import Assets | `/workspace/assets/new` |
| I04 | Configuration Management Database & Service Topology | `/workspace/cmdb` |
| K01 | Knowledge Management & Content Governance | `/workspace/knowledge` |
| K02 | Editing: KB-4031 — VPN Edge Gateway Failover & Firmware Recovery | `/workspace/knowledge/KB-4031/edit` |
| P01 | Problem Records & Known Error Database | `/workspace/problems` |
| P02 | PRB-031 — Recurring VPN gateway authentication timeouts | `/workspace/problems/PRB-031` |
| R01 | Service Performance & SLA Governance | `/workspace/reports` |
| R02 | Custom Report Builder & Scheduled Deliveries | `/workspace/reports/builder` |
| S01 | Global Search | `/search` |
| S02 | System & Access States | `/system-states` |
| S03 | Interactive Edge & Access States | `/design-system/states` |
| W01 | Operations Dashboard | `/workspace` |
| W02 | Ticket Queue | `/workspace/tickets` |
| W03 | Agent Ticket Detail | `/workspace/tickets/INC-1042` |
| W04 | Create Ticket on Behalf of User | `/workspace/tickets/new` |
| W05 | Triage Preview Drawer | `/workspace/tickets?preview=INC-1042` |
| W06 | Saved Views & Filter Builder | `/workspace/views` |
| W07 | Resolve Ticket Dialog | `/workspace/tickets/INC-1042#resolve` |
| W08 | Escalate or Transfer Dialog | `/workspace/tickets/INC-1042#escalate` |
| W09 | Related Records & Duplicate Merge | `/workspace/tickets/INC-1042/related` |
| W10 | Tasks & Time Log | `/workspace/tickets/INC-1042/tasks` |
| W11 | Team Workload & Capacity Management | `/workspace/team` |
| W12 | Major Incident Command & Severity-1 Management | `/workspace/major-incidents` |
| W13 | EMEA Regional Corporate VPN Gateway Failover | `/workspace/major-incidents/MIM-001` |
| W14 | Service Requests & Fulfillment Queue | `/workspace/requests` |
| W15 | MacBook Pro 16-inch Apple Silicon Refresh | `/workspace/requests/REQ-2079` |

## Navigation

- Workspace left navigation opens Overview, Tickets, Major Incidents, Service
  Requests, Approvals, Problems, Changes, Assets & CMDB, Knowledge Base, Reports
  and Team Workload. Every item is a real link with current-page styling.
- Contextual links expose saved views, create-ticket, change calendar/editor,
  asset registration, CMDB, knowledge editor and report builder screens.
- Admin Console switches the sidebar to all 12 administration pages; Back to
  Workspace returns to operations. All Screens opens the complete directory.
- Employee navigation opens home, tickets, catalog, knowledge, assets, approvals
  and service status. Catalog cards, articles and sample record links open details.
- Ticket rows include the W05 triage preview; ticket detail includes Tasks & Time
  and Related Records links. Existing resolve/escalate dialogs remain available.

## Implementation boundary

- New screens use native React/TypeScript components and SCSS Modules, with a
  typed screen registry and reusable table, card, field, timeline, workflow, chart,
  calendar and topology patterns. No screenshot pages, iframes or remote HTML runtimes.
- New tabs, navigation and local content search work. Fields can be edited locally.
  New save/publish/import/submit actions explain that feature behavior is pending;
  they do not claim success or make API writes.
- New sample data is static and explicitly marked. Existing Redux/RTK Query
  workflows and original API behavior are preserved. New configuration screens
  do not grant permissions, connect providers or alter organization settings.
- Unknown module and sample-record routes use the existing not-found screen.
- English supplied PNG/HTML references guided the layouts; this is screen coverage,
  not a claim of pixel-identical reproduction of all 84 desktop/mobile/Arabic exports.
- Source ZIP and browser artifacts remain local and uncommitted. Backend, live data,
  authorization, persistence, localization and full assistive-technology review remain
  pending until the corresponding feature implementation and frontend approval.
