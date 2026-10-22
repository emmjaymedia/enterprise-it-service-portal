import type { ScreenSpec } from "./screen-types";
import {
  table,
  fields,
  cards,
  text,
  timeline,
  checklist,
  select,
  input,
  textarea,
  row,
  link,
} from "./screen-builders";
const scope = {
  area: "admin",
  eyebrow: "ADMINISTRATION & GOVERNANCE",
} as const;
import { adminMenu } from "./navigation";
export const adminScreens: ScreenSpec[] = [
  {
    ...scope,
    id: "D01",
    path: "/admin",
    title: "Administration Console & Governance Overview",
    description:
      "Organization configuration, policy health and administrative domains.",
    actions: [
      link("Audit log", "/admin/audit"),
      link("Organization settings", "/admin/settings", true),
    ],
    metrics: [
      {
        label: "System availability",
        value: "99.98%",
        note: "Illustrative health sample",
      },
      {
        label: "Background jobs",
        value: "2 failed",
        note: "Review delivery retries",
        tone: "warning",
      },
      {
        label: "Security posture",
        value: "Compliant",
        note: "Preview policy baseline",
      },
      { label: "Directory users", value: "1,420", note: "Sample organization" },
    ],
    sections: [
      cards(
        "Administrative Domains",
        adminMenu
          .slice(1)
          .map((m) => ({
            title: m.label,
            text: (
              {
                "/admin/people":
                  "Directory users, memberships and team ownership.",
                "/admin/roles": "Capabilities, scopes and effective access.",
                "/admin/forms":
                  "Intake fields, validation and service taxonomy.",
                "/admin/sla": "Service targets, calendars and pause rules.",
                "/admin/automation":
                  "Event triggers, routing conditions and actions.",
                "/admin/approvals":
                  "Approval stages, resolvers and delegation.",
                "/admin/catalog":
                  "Service definitions and fulfillment templates.",
                "/admin/integrations":
                  "Identity, messaging and monitoring connections.",
                "/admin/notifications":
                  "Event templates, audiences and delivery previews.",
                "/admin/settings":
                  "Branding, sessions, attachment and retention policy.",
                "/admin/audit":
                  "Administrative events and background-job history.",
              } as Record<string, string>
            )[m.href],
            href: m.href,
            icon: "settings",
          })),
      ),
      table(
        "Recent Administrative Actions",
        ["Time (UTC)", "Actor", "Action", "Domain", "State"],
        [
          row(
            [
              "22 Oct · 11:40",
              "Daniel Cole",
              "Published incident intake form",
              "Forms v3.2",
              "Completed",
            ],
            "/admin/forms",
          ),
          row(
            [
              "22 Oct · 10:15",
              "Priya Shah",
              "Reviewed SLA calendar",
              "Global calendar",
              "Completed",
            ],
            "/admin/sla",
          ),
          row(
            [
              "22 Oct · 09:50",
              "Directory sync",
              "Membership import",
              "Entra ID",
              "Needs review",
            ],
            "/admin/integrations",
            "warning",
          ),
        ],
      ),
    ],
    aside: [
      checklist("Configuration Readiness", [
        { title: "Organization identity configured", done: true },
        { title: "Directory sync connected", done: true },
        { title: "Service targets reviewed", done: true },
        { title: "Recovery contacts validated", done: false },
      ]),
      text(
        "Background Job Attention",
        [
          "Email intake retry queue: 2 failed jobs.",
          "Inspect job history before retrying delivery.",
        ],
        [link("View Jobs", "/admin/audit?tab=Background%20Jobs")],
      ),
    ],
  },
  {
    ...scope,
    id: "D02",
    path: "/admin/people",
    title: "People & Teams Management",
    description:
      "Review directory identities, roles, department ownership and support-team membership.",
    actions: [
      link("Review directory", "/admin/integrations"),
      link("Invite User"),
    ],
    metrics: [
      {
        label: "Total active users",
        value: "1,420",
        note: "Directory-linked identities",
      },
      { label: "Active teams", value: "34", note: "4 support teams" },
      {
        label: "Unsynced identities",
        value: "2",
        note: "Manual review required",
        tone: "warning",
      },
    ],
    tabs: ["Users", "Teams", "Directory Sync"],
    sections: [
      table(
        "Organization Directory",
        ["Name", "Department", "Role", "Source", "Team", "Status"],
        [
          row([
            "Daniel Cole",
            "IT Operations",
            "Support agent",
            "Entra ID",
            "Network Operations",
            "Active",
          ]),
          row([
            "Priya Shah",
            "IT Operations",
            "Team lead",
            "Entra ID",
            "Network Operations",
            "Active",
          ]),
          row([
            "Amina Yusuf",
            "Global Sales",
            "Employee",
            "Entra ID",
            "Sales",
            "Active",
          ]),
          row([
            "Samuel Reed",
            "Product Design",
            "Employee",
            "Entra ID",
            "Design",
            "Active",
          ]),
          row([
            "Marcus Vance",
            "Applications",
            "Support agent",
            "Local",
            "Applications Support",
            "Away",
          ]),
        ],
        "Users",
      ),
      table(
        "Support Teams",
        ["Team", "Lead", "Members", "Coverage"],
        [
          row(["Network Operations", "Priya Shah", "8", "24×7 on-call"]),
          row(["Applications Support", "Maya Lee", "6", "8×5 UTC"]),
          row(["Workplace IT", "Rashid Khan", "10", "8×5 UTC"]),
          row(["Identity & Access", "Maya Lee", "4", "8×5 UTC"]),
        ],
        "Teams",
      ),
      timeline(
        "Directory Synchronization",
        [
          {
            title: "Membership changes imported",
            text: "34 teams checked; 2 identities need review.",
            meta: "22 Oct · 09:50 UTC",
          },
          {
            title: "User profile synchronization complete",
            text: "1,420 active profiles available.",
            meta: "22 Oct · 09:30 UTC",
          },
        ],
        "Directory Sync",
      ),
    ],
    aside: [
      fields("Selected User", [
        input("Name", "Daniel Cole"),
        input("Department", "IT Operations"),
        select("Primary role", ["Support agent", "Team lead", "Employee"]),
        input("Manager", "Priya Shah"),
      ]),
      text("Directory-Managed Fields", [
        "Identity attributes are managed by the connected directory. Deactivation requires reassignment of active work.",
        "The last active administrator cannot be removed.",
      ]),
    ],
  },
  {
    ...scope,
    id: "D03",
    path: "/admin/roles",
    title: "Roles & Access Control Governance",
    description:
      "Review capability boundaries and queue scope before changing access.",
    actions: [
      link("People & Teams", "/admin/people"),
      link("Create Custom Role"),
    ],
    tabs: ["Capability Matrix", "Effective Access", "Scope Policies"],
    sections: [
      {
        kind: "matrix",
        title: "Effective Capability Matrix",
        columns: [
          "Capability",
          "Employee",
          "Agent",
          "Team lead",
          "Approver",
          "Admin",
        ],
        rows: [
          row(["View own tickets", "✓", "✓", "✓", "✓", "✓"]),
          row(["View team queues", "—", "✓", "✓", "—", "✓"]),
          row(["Internal notes", "—", "✓", "✓", "—", "✓"]),
          row([
            "Approve requests",
            "—",
            "—",
            "Scoped",
            "Assigned only",
            "Scoped",
          ]),
          row(["Configure policy", "—", "—", "—", "—", "✓"]),
          row(["Grant own elevated access", "—", "—", "—", "—", "—"]),
        ],
        tab: "Capability Matrix",
      },
      fields(
        "Effective Access Simulator",
        [
          select("User", ["Daniel Cole", "Amina Yusuf", "Priya Shah"]),
          select("Resource", [
            "Ticket INC-1042",
            "Approval REQ-2081",
            "Admin settings",
          ]),
          select("Capability", ["Read", "Update", "Approve", "Configure"]),
        ],
        "Effective Access",
      ),
      text(
        "Access Preview",
        [
          "Daniel Cole can read and update tickets within assigned support-team scope. Approvals and administration require separate capabilities.",
        ],
        undefined,
        "Effective Access",
      ),
      table(
        "Role Scope Policies",
        ["Role", "Queue scope", "Department scope", "Internal content"],
        [
          row([
            "Employee",
            "Own / explicitly shared",
            "Own department metadata",
            "Hidden",
          ]),
          row([
            "Support agent",
            "Assigned teams",
            "Support scope",
            "Permitted",
          ]),
          row([
            "Approver",
            "Assigned decisions",
            "Minimum necessary",
            "Hidden",
          ]),
          row([
            "Administrator",
            "Configured administration",
            "Organization",
            "Explicit grants",
          ]),
        ],
        "Scope Policies",
      ),
    ],
    aside: [
      text("Permission Boundaries", [
        "Changes to broad access require a recorded reason and explicit review.",
        "This capability matrix is a design preview, not an authorization control.",
      ]),
      text("Selected Role", [
        "Support Agent",
        "Team-scoped ticket access",
        "No self-service privilege escalation",
      ]),
    ],
  },
  {
    ...scope,
    id: "D04",
    path: "/admin/forms",
    title: "Ticket Fields, Dynamic Forms & Category Taxonomy",
    description:
      "Design intake forms, organize categories and inspect conditional questions.",
    actions: [
      link("Preview employee form", "/portal/tickets/new"),
      link("Publish Form Version", undefined, true),
    ],
    tabs: ["Form Editor", "Conditional Logic", "Taxonomy", "Employee Preview"],
    sections: [
      fields(
        "Standard Incident Intake & Triage Form",
        [
          input("Form name", "Standard Incident Intake"),
          input("Version", "3.2 draft"),
          input("Subject", "Required · 5–120 characters"),
          textarea("Description", "Required · 20–2,000 characters"),
          select("Affected service", [
            "Corporate VPN",
            "Email & Collaboration",
            "Workplace IT",
          ]),
          select("Impact", ["Individual", "Department", "Organization"]),
        ],
        "Form Editor",
      ),
      table(
        "Conditional Logic Rules",
        ["When field", "Condition", "Value", "Show question"],
        [
          row(["Category", "equals", "Hardware", "Associated device"]),
          row(["Service", "equals", "Corporate VPN", "VPN error code"]),
          row(["Impact", "equals", "Organization", "Affected locations"]),
        ],
        "Conditional Logic",
      ),
      table(
        "Category & Service Ownership",
        ["Category", "Subcategory", "Service", "Owner"],
        [
          row([
            "Network",
            "Remote access",
            "Corporate VPN",
            "Network Operations",
          ]),
          row([
            "Software",
            "Email",
            "Email & Collaboration",
            "Applications Support",
          ]),
          row(["Hardware", "Endpoint", "Employee devices", "Workplace IT"]),
        ],
        "Taxonomy",
      ),
      fields(
        "Employee Intake Simulation",
        [
          input("Subject", "Unable to connect to VPN"),
          select("Category", ["Network", "Software", "Hardware"]),
          input("VPN error code", "SEC_CONN_TIMEOUT_403"),
          textarea(
            "Description",
            "The VPN client reports a timeout after authentication.",
          ),
        ],
        "Employee Preview",
      ),
    ],
    aside: [
      cards("Field Components", [
        {
          title: "Short text",
          text: "Subjects, identifiers and concise answers.",
        },
        {
          title: "Choice field",
          text: "Controlled taxonomy and service selection.",
        },
        {
          title: "Conditional question",
          text: "Contextual fields based on earlier answers.",
        },
      ]),
      text("Version Policy", [
        "Historical records retain their submitted values. Retiring a field does not remove prior answers.",
      ]),
    ],
  },
  {
    ...scope,
    id: "D05",
    path: "/admin/sla",
    title: "SLA Policies, Business Calendars & Escalation Thresholds",
    description:
      "Define service targets, working intervals and explicit pause behavior.",
    actions: [link("Reports", "/workspace/reports"), link("New SLA Policy")],
    tabs: [
      "Policies & Targets",
      "Calendars & Holidays",
      "Pause Rules",
      "Timeline Simulation",
    ],
    sections: [
      table(
        "Tier-1 Infrastructure & Critical Services",
        ["Priority", "First response", "Resolution", "Calendar", "Pause rules"],
        [
          row([
            "P1 Critical",
            "15 minutes",
            "4 hours",
            "24×7 UTC",
            "Never pause response",
          ]),
          row([
            "P2 High",
            "1 hour",
            "8 business hours",
            "8×5 UTC",
            "Pending requester only",
          ]),
          row([
            "P3 Medium",
            "4 business hours",
            "24 business hours",
            "8×5 UTC",
            "Pending requester only",
          ]),
          row([
            "P4 Low",
            "8 business hours",
            "40 business hours",
            "8×5 UTC",
            "Pending requester only",
          ]),
        ],
        "Policies & Targets",
      ),
      fields(
        "Global Standard Business Hours",
        [
          input("Calendar name", "Global Standard Business Hours"),
          input("Timezone", "Etc/UTC"),
          input("Working days", "Monday–Friday"),
          input("Working interval", "09:00–18:00"),
        ],
        "Calendars & Holidays",
      ),
      table(
        "Holiday Schedule",
        ["Date", "Holiday", "Scope"],
        [
          row(["25 Dec 2026", "Organization holiday", "Global"]),
          row(["01 Jan 2027", "New Year’s Day", "Global"]),
        ],
        "Calendars & Holidays",
      ),
      text(
        "Clock Behavior Directives",
        [
          "First-response time never pauses. Automated acknowledgments do not count as a human response.",
          "Resolution pauses in Pending requester by default. Pending external continues unless a policy explicitly allows a pause.",
          "Reassignment retains elapsed time. Policy changes never silently rewrite historical metrics.",
        ],
        undefined,
        "Pause Rules",
      ),
      fields(
        "SLA Engine Timeline Preview",
        [
          select("Priority", ["P1 Critical", "P2 High", "P3 Medium", "P4 Low"]),
          input("Submitted (UTC)", "2026-10-22 09:00"),
          input("Pending requester duration", "1 business hour"),
          input("Illustrative resolution deadline", "2026-10-23 09:00 UTC"),
        ],
        "Timeline Simulation",
      ),
    ],
    aside: [
      text("Escalation Thresholds", [
        "75% · Warning",
        "90% · Escalate to configured lead",
        "100% · Mark breached",
      ]),
      text("Policy Publication", [
        "New policy versions apply prospectively unless a separately reviewed migration is authorized.",
      ]),
    ],
  },
  {
    ...scope,
    id: "D06",
    path: "/admin/automation",
    title: "Intelligent Routing & Automation Engine",
    description:
      "Inspect event triggers, conditional predicates and ordered actions.",
    actions: [
      link("Execution history", "/admin/audit?tab=Background%20Jobs"),
      link("New Routing Rule"),
    ],
    tabs: ["Routing Rules", "Rule Builder", "Dry-Run Preview"],
    sections: [
      table(
        "Priority-Ordered Rules",
        ["Order", "Rule", "Trigger", "State", "Last run"],
        [
          row([
            "1",
            "Corporate VPN P1/P2 to NetOps",
            "Ticket created",
            "Active",
            "22 Oct · 11:30 UTC",
          ]),
          row([
            "2",
            "VIP requester fast-track",
            "Ticket created",
            "Active",
            "22 Oct · 10:15 UTC",
          ]),
          row([
            "3",
            "Payroll & HRIS service routing",
            "Service changed",
            "Active",
            "22 Oct · 09:45 UTC",
          ]),
          row([
            "4",
            "Stale pending-requester review",
            "Daily schedule",
            "Draft",
            "Not executed",
          ]),
        ],
        "Routing Rules",
      ),
      fields(
        "Event Trigger Execution Boundary",
        [
          input("Rule name", "Corporate VPN P1/P2 to NetOps"),
          select("Trigger", [
            "Ticket created",
            "Ticket updated",
            "Service changed",
          ]),
          select("Evaluation", ["All conditions", "Any condition"]),
        ],
        "Rule Builder",
      ),
      table(
        "Conditional Predicates",
        ["Field", "Operator", "Value"],
        [
          row(["Service", "equals", "Corporate VPN"]),
          row(["Priority", "is one of", "P1, P2"]),
          row(["Status", "is not", "Resolved"]),
        ],
        "Rule Builder",
      ),
      {
        kind: "workflow",
        title: "Executable Actions",
        items: [
          { title: "1 · Assign team", text: "Network Operations" },
          { title: "2 · Notify queue lead", text: "Priya Shah" },
          {
            title: "3 · Add internal context",
            text: "Routing rule and matched conditions",
          },
        ],
        tab: "Rule Builder",
      },
      timeline(
        "Dry-Run Results",
        [
          {
            title: "INC-1042 matches rule",
            text: "Service = Corporate VPN; priority = P2.",
            meta: "Sample evaluation",
          },
          {
            title: "Would route to Network Operations",
            text: "No actual ticket changes were made.",
            meta: "Preview only",
          },
        ],
        "Dry-Run Preview",
      ),
    ],
    aside: [
      text("Execution Safeguards", [
        "Rules are evaluated in priority order. Recursive updates are bounded.",
        "Public-message actions require a content preview. Partial failures retain execution context.",
      ]),
    ],
  },
  {
    ...scope,
    id: "D07",
    path: "/admin/approvals",
    title: "Enterprise Approval Workflow Architecture",
    description:
      "Review service-linked stages, approver resolution and delegation policy.",
    actions: [
      link("Approvals inbox", "/workspace/approvals"),
      link("New Workflow"),
    ],
    tabs: ["Workflow Designer", "Conditions & Delegation", "Scenario Preview"],
    sections: [
      fields(
        "Corporate Software & Cloud Access Request",
        [
          input("Workflow name", "Corporate Software & Cloud Access"),
          select("Service", [
            "Financial warehouse access",
            "Enterprise software",
            "Cloud environment",
          ]),
          select("Stage evaluation", ["Sequential", "Parallel"]),
          input("Version", "2.1 draft"),
        ],
        "Workflow Designer",
      ),
      {
        kind: "workflow",
        title: "Execution Sequence & Decision Gates",
        items: [
          {
            title: "1 · Financial authorization",
            text: "Department manager · Required",
          },
          {
            title: "2 · Resource owner review",
            text: "Service owner · Required",
          },
          {
            title: "3 · Security review",
            text: "Required for privileged entitlements",
          },
          {
            title: "4 · Fulfillment",
            text: "Starts only after required approvals pass",
          },
        ],
        tab: "Workflow Designer",
      },
      fields(
        "Conditional Approvers & Delegation",
        [
          input("Manager review threshold", "All requests"),
          input("Security review condition", "Privileged or production access"),
          select("Delegation", ["Named approved alternates", "Not permitted"]),
          input("Absent manager fallback", "Service owner review queue"),
        ],
        "Conditions & Delegation",
      ),
      timeline(
        "Scenario: Financial Warehouse Access",
        [
          {
            title: "Requester: Layla Ahmed",
            text: "Cost: $450 / year · Read-only financial data",
          },
          {
            title: "Department manager resolves",
            text: "Requester is not the approver.",
          },
          {
            title: "Data owner review required",
            text: "PII masking and least-privilege scope confirmed.",
          },
        ],
        "Scenario Preview",
      ),
    ],
    aside: [
      text("Approval Safeguards", [
        "Self-approval is blocked. Missing managers and circular stages need review.",
        "No response escalates; it never auto-approves.",
        "Changed cost, scope or access invalidates affected approvals.",
      ]),
    ],
  },
  {
    ...scope,
    id: "D08",
    path: "/admin/catalog",
    title: "Catalog Administration & Service Definitions",
    description:
      "Manage requestable services, eligibility, costs and fulfillment templates.",
    actions: [
      link("Employee catalog", "/portal/catalog"),
      link("New Catalog Item"),
    ],
    metrics: [
      { label: "Catalog items", value: "42", note: "38 active · 4 draft" },
      {
        label: "Published services",
        value: "38",
        note: "Employee-visible definitions",
      },
      {
        label: "Fulfillment templates",
        value: "29",
        note: "Versioned checklists",
      },
      {
        label: "Configuration issues",
        value: "2",
        note: "Service owner review needed",
        tone: "warning",
      },
    ],
    tabs: ["Catalog Items", "Item Editor", "Fulfillment Template"],
    sections: [
      table(
        "Service Definitions",
        ["Item", "Category", "Approval", "Cost", "State"],
        [
          row(
            [
              "Financial warehouse access",
              "Access",
              "Manager + data owner",
              "$450 / year",
              "Published",
            ],
            "/portal/catalog/financial-warehouse",
          ),
          row(
            [
              "MacBook Pro refresh",
              "Hardware",
              "Manager + asset team",
              "$3,499",
              "Published",
            ],
            "/portal/catalog/macbook-refresh",
          ),
          row(
            [
              "Figma Enterprise seat",
              "Software",
              "Manager",
              "$240 / year",
              "Published",
            ],
            "/portal/catalog/figma-seat",
          ),
          row(
            [
              "Cloud sandbox",
              "Cloud",
              "Manager + platform owner",
              "$300 / month",
              "Draft",
            ],
            "/portal/catalog/cloud-sandbox",
          ),
        ],
        "Catalog Items",
      ),
      fields(
        "Financial Analytics Data Warehouse Access",
        [
          input("Display name", "Financial Analytics Data Warehouse Access"),
          textarea(
            "Description",
            "Read-only financial analytics access with standard PII masking.",
          ),
          select("Eligibility", [
            "Finance & Internal Audit",
            "All employees",
            "Named groups",
          ]),
          input("Cost estimate", "$450 / year"),
          input("Estimated fulfillment", "4 business hours after approval"),
          select("Approval workflow", ["Manager + Data Owner", "Manager only"]),
          select("Publication state", ["Published", "Draft", "Retired"]),
        ],
        "Item Editor",
      ),
      checklist(
        "Fulfillment Template · v2.1",
        [
          { title: "Validate all required approvals", done: true },
          { title: "Provision read-only data role", done: false },
          { title: "Verify masking policy", done: false },
          { title: "Notify requester and record evidence", done: false },
        ],
        "Fulfillment Template",
      ),
    ],
    aside: [
      text("Versioned Service Definition", [
        "Requests retain the item’s submitted price, questions and approval flow.",
        "Changing a published item creates a new version.",
      ]),
      text("Required Ownership", [
        "Service owner: Data Platform",
        "Fulfillment team: Applications Support",
        "Approval workflow: Manager + Data Owner",
      ]),
    ],
  },
  {
    ...scope,
    id: "D09",
    path: "/admin/integrations",
    title: "Communication Channels & Enterprise Integrations",
    description:
      "Identity, messaging, monitoring and asset discovery connection layouts.",
    actions: [
      link("Job history", "/admin/audit?tab=Background%20Jobs"),
      link("Add Integration"),
    ],
    tabs: ["Connections", "Configuration", "Delivery Logs"],
    sections: [
      cards(
        "Directory & Identity",
        [
          {
            title: "Okta Enterprise Workforce",
            text: "Identity federation and lifecycle directory.",
            badge: "Connected",
            icon: "team",
          },
          {
            title: "Microsoft Entra ID",
            text: "User and team membership synchronization.",
            badge: "Connected",
            icon: "team",
          },
        ],
        "Connections",
      ),
      cards(
        "Communication & Intake Channels",
        [
          {
            title: "Corporate Exchange IMAP / SMTP",
            text: "Ticket intake and requester notifications.",
            badge: "Needs attention",
            icon: "ticket",
          },
          {
            title: "Slack Enterprise Grid",
            text: "Responder notifications and incident updates.",
            badge: "Connected",
            icon: "team",
          },
          {
            title: "Microsoft Teams Operations",
            text: "Workstream collaboration and alerts.",
            badge: "Configured",
            icon: "team",
          },
        ],
        "Connections",
      ),
      cards(
        "Monitoring & Asset Discovery",
        [
          {
            title: "Splunk SIEM",
            text: "Security events and audit stream.",
            badge: "Connected",
            icon: "alert",
          },
          {
            title: "PagerDuty",
            text: "On-call incident escalation.",
            badge: "Configured",
            icon: "alert",
          },
          {
            title: "Endpoint Inventory",
            text: "Device telemetry and CMDB import.",
            badge: "Connected",
            icon: "box",
          },
        ],
        "Connections",
      ),
      fields(
        "Exchange IMAP Intake Configuration",
        [
          input("Connection name", "Corporate Exchange IMAP"),
          input("Mailbox", "helpdesk@example.com"),
          input("Server", "mail.example.com"),
          select("Security", ["OAuth 2.0", "TLS connection"]),
          input("Polling interval", "5 minutes"),
        ],
        "Configuration",
      ),
      table(
        "Delivery Log",
        ["Timestamp (UTC)", "Channel", "Event", "Result"],
        [
          row(
            ["22 Oct · 11:40", "Exchange", "Ticket intake", "Retry queued"],
            undefined,
            "warning",
          ),
          row(["22 Oct · 11:35", "Entra ID", "Directory sync", "Completed"]),
          row([
            "22 Oct · 11:30",
            "Slack",
            "Responder notification",
            "Completed",
          ]),
        ],
        "Delivery Logs",
      ),
    ],
    aside: [
      text("Connection Preview", [
        "Statuses are illustrative. No provider connection or credential exchange occurs on these screens.",
        "Stored credentials are never displayed after save. Use placeholders during design review.",
      ]),
    ],
  },
  {
    ...scope,
    id: "D10",
    path: "/admin/notifications",
    title: "Enterprise Notification Templates & Delivery Policies",
    description:
      "Review event/channel templates and preview messages with synthetic records.",
    actions: [
      link("Notification center", "/notifications"),
      link("New Template"),
    ],
    tabs: ["Templates", "Template Editor", "Synthetic Preview"],
    sections: [
      table(
        "Event Templates",
        ["Template", "Audience", "Channels", "Version", "State"],
        [
          row([
            "Ticket created confirmation",
            "Requester",
            "In-app, email",
            "v3.2",
            "Active",
          ]),
          row([
            "Agent ticket assignment",
            "Assigned agent",
            "In-app",
            "v2.0",
            "Active",
          ]),
          row([
            "Public reply received",
            "Requester",
            "In-app, email",
            "v2.4",
            "Active",
          ]),
          row([
            "SLA warning threshold",
            "Queue lead",
            "In-app, collaboration",
            "v1.8",
            "Active",
          ]),
          row([
            "Approval decision needed",
            "Approver",
            "In-app, email",
            "v2.1",
            "Active",
          ]),
        ],
        "Templates",
      ),
      fields(
        "Ticket Created Confirmation (Requester)",
        [
          input("Template name", "Ticket created confirmation"),
          input("Subject", "We received your ticket {{ticket.number}}"),
          textarea(
            "Message body",
            "Hi {{requester.name}},\n\nWe received your request: {{ticket.subject}}.\nYou can follow updates in the employee portal.\n\nIT Support",
          ),
          select("Audience", ["Requester", "Assigned agent", "Approver"]),
          select("Channel", ["Email", "In-app"]),
        ],
        "Template Editor",
      ),
      text(
        "Live Synthetic Preview",
        [
          "To: Amina Yusuf <amina.yusuf@example.com>",
          "Subject: We received your ticket INC-1042",
          "Hi Amina Yusuf,",
          "We received your request: Unable to connect to company VPN. You can follow updates in the employee portal.",
          "IT Support",
        ],
        undefined,
        "Synthetic Preview",
      ),
    ],
    aside: [
      text("Available Variables", [
        "{{ticket.number}}",
        "{{ticket.subject}}",
        "{{requester.name}}",
        "{{portal.ticket_url}}",
      ]),
      text("Visibility Rules", [
        "Requester messages must exclude internal notes, credentials and restricted fields.",
        "Mandatory security notices cannot be disabled by user preferences.",
      ]),
    ],
  },
  {
    ...scope,
    id: "D11",
    path: "/admin/settings",
    title: "Enterprise Security Posture & Tenant Settings",
    description:
      "Organization identity, session rules, attachment restrictions and retention settings.",
    actions: [
      link("Audit log", "/admin/audit"),
      link("Review Settings", undefined, true),
    ],
    tabs: [
      "Identity & Sessions",
      "Attachments & Privacy",
      "Organization & Branding",
      "Data Retention",
    ],
    sections: [
      fields(
        "Authentication & Identity Policy",
        [
          select("Identity provider", ["Microsoft Entra ID", "Okta Workforce"]),
          select("Multi-factor authentication", [
            "Required for all users",
            "Required for privileged users",
          ]),
          input("Idle session timeout", "15 minutes"),
          input("Maximum session duration", "8 hours"),
          select("Local account policy", [
            "Emergency accounts only",
            "Disabled",
          ]),
        ],
        "Identity & Sessions",
      ),
      fields(
        "Attachment Restrictions",
        [
          input("Maximum file size", "20 MB"),
          input("Allowed file types", "PNG, JPG, PDF"),
          select("Malware scanning", [
            "Required before download",
            "Quarantine unknown files",
          ]),
          select("Sensitive download policy", [
            "Authorized viewers only",
            "No external sharing",
          ]),
        ],
        "Attachments & Privacy",
      ),
      fields(
        "Organization Branding",
        [
          input("Organization name", "ServiceDesk Enterprise"),
          input("Support email", "helpdesk@example.com"),
          input("Support hotline", "ext. 4357"),
          input("Default timezone", "Etc/UTC"),
          select("Default language", ["English", "Arabic"]),
          input("Primary brand color", "#003FB3"),
        ],
        "Organization & Branding",
      ),
      table(
        "Retention & Compliance",
        ["Data category", "Retention", "Access", "Disposition"],
        [
          row([
            "Ticket records",
            "7 years",
            "Authorized support",
            "Reviewed archive",
          ]),
          row([
            "Authentication logs",
            "1 year",
            "Security team",
            "Scheduled removal",
          ]),
          row([
            "Attachments",
            "Per ticket policy",
            "Record viewers",
            "Secure deletion",
          ]),
          row(["Audit records", "7 years", "Auditors", "Protected archive"]),
        ],
        "Data Retention",
      ),
      text(
        "Retention Impact Review",
        [
          "Changes affecting deletion require impact assessment, explicit confirmation and audit. No data retention actions run in this design preview.",
        ],
        undefined,
        "Data Retention",
      ),
    ],
    aside: [
      text("Policy Readiness", [
        "MFA: required",
        "Session policy: reviewed",
        "Attachment policy: configured",
        "Recovery contacts: review pending",
      ]),
      text("Lockout Prevention", [
        "Identity changes require a verified recovery path. Broad security changes use a separately reviewed administrative approval.",
      ]),
    ],
  },
  {
    ...scope,
    id: "D12",
    path: "/admin/audit",
    title: "Immutable Audit Trail & System Job History",
    description:
      "Review administrative events, record changes and background execution results.",
    actions: [
      link("Integration health", "/admin/integrations"),
      link("Export Audit Range"),
    ],
    metrics: [
      {
        label: "Events in sample",
        value: "342",
        note: "Illustrative current day",
      },
      {
        label: "Sensitive changes",
        value: "6",
        note: "Authorization review events",
      },
      {
        label: "Failed jobs",
        value: "2",
        note: "Retry review needed",
        tone: "warning",
      },
    ],
    tabs: ["Audit Events", "Background Jobs", "Event Inspector"],
    sections: [
      table(
        "Audit Events",
        ["Time (UTC)", "Actor", "Action", "Target", "Source", "Result"],
        [
          row([
            "22 Oct · 11:40",
            "Daniel Cole",
            "Published form version",
            "Incident intake v3.2",
            "Web console",
            "Completed",
          ]),
          row([
            "22 Oct · 10:15",
            "Priya Shah",
            "Updated SLA calendar",
            "Global calendar",
            "Web console",
            "Completed",
          ]),
          row([
            "22 Oct · 09:50",
            "Directory sync",
            "Imported memberships",
            "Network Operations",
            "Entra ID",
            "Reviewed",
          ]),
          row(
            [
              "22 Oct · 09:10",
              "Priya Shah",
              "Declared major incident",
              "MIM-001",
              "Web console",
              "Completed",
            ],
            "/workspace/major-incidents/MIM-001",
          ),
        ],
        "Audit Events",
      ),
      table(
        "Background Job History",
        ["Job", "Type", "Started (UTC)", "Result", "Next action"],
        [
          row(
            [
              "JOB-4102",
              "Email intake",
              "22 Oct · 11:40",
              "Failed",
              "Review mailbox access",
            ],
            undefined,
            "danger",
          ),
          row([
            "JOB-4101",
            "Directory sync",
            "22 Oct · 09:50",
            "Completed",
            "None",
          ]),
          row(
            [
              "JOB-4099",
              "Asset import",
              "21 Oct · 18:00",
              "Partial",
              "13 rows need review",
            ],
            undefined,
            "warning",
          ),
        ],
        "Background Jobs",
      ),
      table(
        "Event Proof Inspector",
        ["Property", "Previous value", "New value"],
        [
          row(["Target", "Incident intake form", "Incident intake form"]),
          row(["Version", "3.1", "3.2"]),
          row(["Category field", "Optional", "Required"]),
          row(["Reason", "—", "Improve routing completeness"]),
          row(["Sensitive values", "[redacted]", "[redacted]"]),
        ],
        "Event Inspector",
      ),
    ],
    aside: [
      text("Event Context", [
        "Actor: Daniel Cole",
        "Source: Web console",
        "Timestamp: 22 Oct 2026, 11:40 UTC",
        "Record: Incident intake form",
      ]),
      text("Data Visibility", [
        "Sample events are for screen review. No durable audit service is connected.",
        "Sensitive values remain redacted in event and export views.",
      ]),
    ],
  },
];
