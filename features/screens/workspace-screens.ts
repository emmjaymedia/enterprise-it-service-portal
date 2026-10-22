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
const ticket = "/workspace/tickets/INC-1042";
const scope = { area: "workspace", eyebrow: "SERVICE OPERATIONS" } as const;
export const workspaceScreens: ScreenSpec[] = [
  {
    ...scope,
    id: "W04",
    path: "/workspace/tickets/new",
    title: "Create Ticket on Behalf of User",
    description:
      "Capture the requester’s issue, classify its impact and route it to the right support team.",
    parent: { label: "Ticket Queue", href: "/workspace/tickets" },
    actions: [
      link("Return to queue", "/workspace/tickets"),
      link("Create Ticket", undefined, true),
    ],
    sections: [
      fields("Requester Identification", [
        input("Requester", "Amina Yusuf"),
        input("Department", "Global Sales"),
        input("Email", "amina.yusuf@example.com"),
        select("Source", ["Phone call", "Walk-up", "Email", "Monitoring"]),
      ]),
      fields("Ticket Nature & Categorization", [
        select("Ticket type", ["Incident", "Service request"]),
        input("Subject", "Unable to connect to company VPN"),
        select("Category", [
          "Network & Access",
          "Hardware",
          "Software",
          "Identity",
        ]),
        select("Affected service", [
          "Corporate VPN",
          "Email & Collaboration",
          "Workplace IT",
        ]),
        input("Associated asset", "AST-00321 — Dell Latitude 7440"),
        textarea(
          "Detailed description",
          "The requester cannot connect to the corporate VPN. The client reports a handshake timeout.",
        ),
      ]),
      fields("Impact & Urgency Triage", [
        select("Impact", ["Individual", "Department", "Organization"]),
        select("Urgency", [
          "Work degraded",
          "Work blocked",
          "Workaround available",
        ]),
      ]),
      fields("Assignment & Queue Dispatch", [
        select("Assigned team", [
          "Network Operations",
          "Applications Support",
          "Workplace IT",
        ]),
        select("Assignee", ["Daniel Cole", "Priya Shah", "Team triage"]),
      ]),
      checklist("Communication Preferences", [
        {
          title: "Send requester acknowledgment",
          done: true,
          text: "Public notification preview; delivery will be connected later.",
        },
        {
          title: "Link to an existing major incident",
          done: false,
          text: "Check the active incident register before creating a duplicate.",
        },
      ]),
    ],
    aside: [
      text("Suggested Priority", [
        "P2 · High",
        "Individual user blocked. Response target: 1 business hour; resolution target: 8 business hours.",
      ]),
      cards("Related Content", [
        {
          title: "Troubleshoot your VPN connection",
          text: "Review the approved diagnostic checklist.",
          href: "/portal/knowledge/vpn-connection",
          icon: "book",
        },
      ]),
    ],
  },
  {
    ...scope,
    id: "W06",
    path: "/workspace/views",
    title: "Saved Views & Filter Builder",
    description:
      "Compose reusable queue views with conditions, columns and sorting.",
    parent: { label: "Ticket Queue", href: "/workspace/tickets" },
    actions: [
      link("Open queue", "/workspace/tickets"),
      link("Save View", undefined, true),
    ],
    tabs: ["Conditions", "Columns & Sorting", "Shared Views"],
    sections: [
      fields("View Definition", [
        input("View name", "VPN & Gateway Outages"),
        select("Visibility", ["Personal", "Team"]),
        select("Match conditions", [
          "All conditions (AND)",
          "Any condition (OR)",
        ]),
      ]),
      table(
        "Filter Conditions",
        ["Field", "Operator", "Value"],
        [
          row(["Service", "is any of", "Corporate VPN, Network Access"]),
          row(["Priority", "is one of", "P1 Critical, P2 High"]),
          row(["Status", "is not", "Resolved"]),
          row(["Age", "greater than", "2 days"]),
        ],
        "Conditions",
      ),
      table(
        "Queue Preview",
        ["Ticket", "Subject", "Priority", "Team"],
        [
          row(
            [
              "INC-1042",
              "Unable to connect to company VPN",
              "P2 High",
              "Network Operations",
            ],
            ticket,
          ),
          row(
            [
              "INC-1044",
              "Global payroll portal outage",
              "P1 Critical",
              "Network Operations",
            ],
            "/workspace/tickets/INC-1044",
          ),
        ],
        "Conditions",
      ),
      checklist(
        "Visible Columns",
        [
          "Requester",
          "Team & assignee",
          "Status",
          "Resolution SLA",
          "Last updated",
        ].map((title) => ({ title, done: true })),
        "Columns & Sorting",
      ),
      fields(
        "Default Ordering",
        [
          select("Sort by", ["Last updated", "Priority", "Created date"]),
          select("Direction", ["Newest first", "Oldest first"]),
        ],
        "Columns & Sorting",
      ),
      cards(
        "Team Views",
        [
          {
            title: "Network Escalations",
            text: "Critical incidents assigned to Network Operations.",
            badge: "Team",
            href: "/workspace/tickets?team=Network%20Operations",
          },
          {
            title: "Unassigned Work",
            text: "Tickets waiting for an owner.",
            badge: "Personal",
            href: "/workspace/tickets?view=unassigned",
          },
        ],
        "Shared Views",
      ),
    ],
    aside: [
      cards("Saved Views", [
        {
          title: "All tickets",
          text: "Your team’s full queue.",
          href: "/workspace/tickets",
        },
        {
          title: "At-risk tickets",
          text: "Review due-soon and breached work.",
          href: "/workspace/tickets?view=due",
        },
        {
          title: "My unassigned queue",
          text: "Work that needs an owner.",
          href: "/workspace/tickets?view=unassigned",
        },
      ]),
      text("View Guidance", [
        "Personal views are visible to you. Team views use the team’s record visibility. Conditions do not grant access to additional records.",
      ]),
    ],
  },
  {
    ...scope,
    id: "W09",
    path: `${ticket}/related`,
    title: "Related Records & Duplicate Merge",
    description:
      "Understand service dependencies and inspect related incidents, problems and changes.",
    parent: { label: "INC-1042 · Ticket Detail", href: ticket },
    actions: [
      link("Back to ticket", ticket),
      link("Link Record", undefined, true),
    ],
    tabs: ["Linked Records", "Duplicate Comparison"],
    sections: [
      cards(
        "Linked Record Graph & Associations",
        [
          {
            title: "PRB-031 · Recurring VPN authentication timeouts",
            text: "Root cause investigation following the Dublin certificate rotation.",
            badge: "Problem · Investigating",
            href: "/workspace/problems/PRB-031",
            icon: "alert",
          },
          {
            title: "CHG-087 · Emergency gateway firmware patch",
            text: "Permanent remediation for Frankfurt and Dublin gateways.",
            badge: "Change · Implementing",
            href: "/workspace/changes/CHG-087",
            icon: "alert",
          },
        ],
        "Linked Records",
      ),
      table(
        "Sibling Tickets Under the Same Root Cause",
        ["Ticket", "Summary", "Relation", "Status"],
        [
          row(
            [
              "INC-1042",
              "Unable to connect to company VPN",
              "Affected by PRB-031",
              "In progress",
            ],
            ticket,
          ),
          row(
            [
              "INC-1044",
              "Payroll service interruption",
              "Related incident",
              "Open",
            ],
            "/workspace/tickets/INC-1044",
          ),
        ],
        "Linked Records",
      ),
      table(
        "Duplicate Ticket Comparison",
        ["Field", "Survivor: INC-1042", "Candidate: INC-1105"],
        [
          row(["Requester", "Amina Yusuf", "Sarah Wilson"]),
          row(["Service", "Corporate VPN", "Corporate VPN"]),
          row(["Status", "In progress", "In progress"]),
          row(["Visibility", "Requester + support", "Different requester"]),
          row(["Messages", "Public and internal", "Public and internal"]),
        ],
        "Duplicate Comparison",
      ),
      text(
        "Sharing & Merge Review",
        [
          "The selected records have different requesters. Review conversation and attachment access before a merge. The survivor retains its history and the duplicate becomes a redirect.",
        ],
        [link("Preview Merge Impact")],
        "Duplicate Comparison",
      ),
    ],
    aside: [
      text("Association Policy", [
        "Self-links and circular dependencies are not permitted. Linking a record does not broaden its audience.",
      ]),
      text(
        "Associated Asset",
        ["AST-00321 · Dell Latitude 7440", "Amina Yusuf · Global Sales"],
        [link("Open Asset", "/workspace/assets/AST-00321")],
      ),
    ],
  },
  {
    ...scope,
    id: "W10",
    path: `${ticket}/tasks`,
    title: "Tasks & Time Log",
    description:
      "Operational checklist, dependencies and labor recorded against INC-1042.",
    parent: { label: "INC-1042 · Ticket Detail", href: ticket },
    actions: [
      link("Back to ticket", ticket),
      link("Add Task", undefined, true),
    ],
    tabs: ["Tasks", "Time Entries"],
    metrics: [
      { label: "Linked tasks", value: "4", note: "2 complete · 1 in progress" },
      {
        label: "Labor recorded",
        value: "1h 45m",
        note: "Across 3 illustrative entries",
      },
      { label: "Next task due", value: "14:30", note: "22 Oct 2026 · UTC" },
    ],
    sections: [
      checklist(
        "Subtasks & Operational Checklist",
        [
          {
            title: "Verify RADIUS authentication logs and active tokens",
            done: true,
            text: "Daniel Cole · Network Operations",
            meta: "Completed 10:15 UTC",
          },
          {
            title: "Check client certificate on AST-00321",
            done: true,
            text: "Daniel Cole · Certificate valid",
            meta: "Completed 10:40 UTC",
          },
          {
            title: "Re-route traffic to secondary London gateway",
            done: false,
            text: "Priya Shah · In progress",
            meta: "Due 14:00 UTC",
          },
          {
            title: "Validate throughput with the requester",
            done: false,
            text: "Blocked by gateway reroute",
            meta: "Due 14:30 UTC",
          },
        ],
        "Tasks",
      ),
      table(
        "Labor Audit Trail",
        ["Work date", "Agent", "Activity", "Duration", "Billing"],
        [
          row([
            "22 Oct 2026",
            "Daniel Cole",
            "Initial diagnosis",
            "45 min",
            "Non-billable",
          ]),
          row([
            "22 Oct 2026",
            "Priya Shah",
            "Gateway investigation",
            "40 min",
            "Non-billable",
          ]),
          row([
            "22 Oct 2026",
            "Daniel Cole",
            "Requester follow-up",
            "20 min",
            "Non-billable",
          ]),
        ],
        "Time Entries",
      ),
      fields(
        "Log Labor Time",
        [
          input("Work date", "2026-10-22"),
          input("Duration (minutes)", "30"),
          select("Activity", [
            "Investigation",
            "Implementation",
            "Communication",
          ]),
          textarea("Work description"),
        ],
        "Time Entries",
      ),
    ],
    aside: [
      text("Dependencies", [
        "Requester validation follows completion of the gateway reroute. Required tasks must be complete before the ticket is resolved.",
      ]),
      text("Working Calendar", [
        "Network Operations · 8×5 UTC",
        "Time entry corrections retain the original entry in the audit trail.",
      ]),
    ],
  },
  {
    ...scope,
    id: "W11",
    path: "/workspace/team",
    title: "Team Workload & Capacity Management",
    description:
      "Review availability, queue pressure and high-priority work across support teams.",
    actions: [
      link("Open queue", "/workspace/tickets"),
      link("Review Assignment", undefined, true),
    ],
    metrics: [
      {
        label: "Active tickets",
        value: "18 / 25",
        note: "72% of illustrative team capacity",
      },
      { label: "P1 / P2 work", value: "5", note: "2 critical · 3 high" },
      { label: "Due soon", value: "3", note: "Across 2 support teams" },
      { label: "Available agents", value: "4", note: "1 away · 1 on call" },
    ],
    tabs: ["Agent Workload", "Capacity & Availability"],
    sections: [
      table(
        "Support Engineers & Assigned Work",
        [
          "Agent",
          "Team",
          "Active load",
          "High priority",
          "Availability",
          "Next task",
        ],
        [
          row(
            [
              "Daniel Cole",
              "Network Operations",
              "6 / 8",
              "2 P1",
              "Available",
              "Gateway investigation",
            ],
            ticket,
          ),
          row(
            [
              "Priya Shah",
              "Network Operations",
              "8 / 8",
              "2 P2",
              "On call",
              "Major incident coordination",
            ],
            "/workspace/major-incidents/MIM-001",
          ),
          row(
            [
              "Marcus Vance",
              "Applications Support",
              "2 / 6",
              "1 P2",
              "Available",
              "Payroll database lock",
            ],
            "/workspace/tickets/INC-1044",
          ),
          row(
            [
              "Rashid Khan",
              "Workplace IT",
              "2 / 6",
              "—",
              "Available",
              "Device collection",
            ],
            "/workspace/requests/REQ-2079",
          ),
        ],
        "Agent Workload",
      ),
      fields(
        "Capacity Preview",
        [
          select("Team", [
            "Network Operations",
            "Applications Support",
            "Workplace IT",
          ]),
          input("Agent capacity", "8 active tickets"),
          select("Availability", ["Available", "On call", "Away"]),
          input("Working hours", "09:00–18:00 UTC"),
        ],
        "Capacity & Availability",
      ),
    ],
    aside: [
      text("Workload Distribution", [
        "Daniel Cole · 75%",
        "Priya Shah · 100%",
        "Marcus Vance · 33%",
        "Rashid Khan · 33%",
      ]),
      text("Assignment Guidance", [
        "Consider skills, availability and existing priority work. Reassignments retain SLA targets and require confirmation.",
      ]),
    ],
  },
  {
    ...scope,
    id: "W12",
    path: "/workspace/major-incidents",
    title: "Major Incident Command & Severity-1 Management",
    description:
      "Coordinate critical service interruptions, responders and stakeholder updates.",
    actions: [
      link("Change calendar", "/workspace/changes/calendar"),
      link("Declare Major Incident", undefined, true),
    ],
    metrics: [
      {
        label: "Active incidents",
        value: "1",
        note: "P1 · Enterprise impact",
        tone: "danger",
      },
      {
        label: "Mean time to restore",
        value: "84m",
        note: "Illustrative previous period",
      },
      {
        label: "Affected users",
        value: "1,420",
        note: "EMEA gateway population",
      },
      { label: "On-call responders", value: "4", note: "3 workstreams active" },
    ],
    tabs: ["Active", "Under Review", "Completed"],
    sections: [
      cards(
        "Active Command Centers",
        [
          {
            title: "MIM-001 · EMEA Regional Corporate VPN Gateway Failover",
            text: "Authentication timeouts and degraded remote access across Frankfurt and Dublin. Coordinator: Priya Shah.",
            badge: "P1 · Mitigation in progress",
            meta: "Started 22 Oct 2026 · 09:10 UTC",
            href: "/workspace/major-incidents/MIM-001",
            icon: "alert",
          },
        ],
        "Active",
      ),
      table(
        "Post-Incident Reviews",
        ["Incident", "Service", "Coordinator", "Review status"],
        [
          row(
            [
              "MIM-002",
              "Payroll & Time Tracking",
              "Daniel Cole",
              "Review scheduled",
            ],
            "/workspace/major-incidents/MIM-002",
          ),
        ],
        "Under Review",
      ),
      table(
        "Completed Incidents",
        ["Incident", "Service", "Restored", "Outcome"],
        [
          row(
            ["MIM-003", "Cloud API Gateway", "18 Oct 2026", "Review completed"],
            "/workspace/major-incidents/MIM-003",
          ),
        ],
        "Completed",
      ),
    ],
    aside: [
      cards("Current On-Call Roster", [
        {
          title: "Priya Shah",
          text: "Incident coordinator · Network Operations",
          badge: "On call",
          icon: "team",
        },
        {
          title: "Daniel Cole",
          text: "Technical lead · Network Operations",
          badge: "Available",
          icon: "team",
        },
      ]),
      text("Declaration Policy", [
        "Declare a major incident when service impact exceeds the defined threshold. Use one command center for a shared event and link affected tickets.",
      ]),
    ],
  },
  {
    ...scope,
    id: "W13",
    path: "/workspace/major-incidents/MIM-001",
    title: "EMEA Regional Corporate VPN Gateway Failover",
    description:
      "MIM-001 · Corporate VPN · Frankfurt / Dublin · Coordinator: Priya Shah",
    darkHero: true,
    parent: { label: "Major Incidents", href: "/workspace/major-incidents" },
    actions: [
      link("View service status", "/portal/status"),
      link("Publish Update", undefined, true),
    ],
    metrics: [
      {
        label: "Severity",
        value: "P1 Critical",
        note: "Enterprise remote access",
      },
      {
        label: "Service state",
        value: "Degraded",
        note: "Mitigation in progress",
        tone: "danger",
      },
      {
        label: "Affected users",
        value: "1,420",
        note: "EMEA users · illustrative",
      },
      {
        label: "Next update",
        value: "14:30 UTC",
        note: "Coordinator: Priya Shah",
      },
    ],
    tabs: ["Command Center", "Linked Tickets", "Review"],
    sections: [
      timeline(
        "Live Incident Chronology",
        [
          {
            title: "Gateway failover in progress",
            text: "Secondary London gateway accepting new sessions.",
            meta: "13:45 UTC · Priya Shah",
          },
          {
            title: "Certificate cache issue confirmed",
            text: "Frankfurt and Dublin nodes show stale intermediate trust entries.",
            meta: "12:20 UTC · Daniel Cole",
          },
          {
            title: "Major incident declared",
            text: "EMEA remote access disruption escalated to P1.",
            meta: "09:10 UTC · Priya Shah",
          },
        ],
        "Command Center",
      ),
      checklist(
        "Incident Action Plan & Triage Runbook",
        [
          {
            title: "Verify endpoint telemetry",
            done: true,
            text: "Daniel Cole · Completed",
          },
          {
            title: "Enable secondary gateway route",
            done: true,
            text: "Network Operations · Completed",
          },
          {
            title: "Validate requester reconnection",
            done: false,
            text: "Daniel Cole · In progress",
          },
          {
            title: "Confirm service restoration",
            done: false,
            text: "Priya Shah · Awaiting validation",
          },
        ],
        "Command Center",
      ),
      table(
        "Linked Ingestion Queue",
        ["Ticket", "Requester", "Impact", "State"],
        [
          row(
            [
              "INC-1042",
              "Amina Yusuf",
              "VPN connection blocked",
              "In progress",
            ],
            ticket,
          ),
          row(
            ["INC-1044", "Grace Okafor", "Payroll service degraded", "Open"],
            "/workspace/tickets/INC-1044",
          ),
        ],
        "Linked Tickets",
      ),
      fields(
        "Post-Incident Review",
        [
          textarea(
            "Impact summary",
            "Remote access disruption affected EMEA staff.",
          ),
          textarea(
            "Contributing factors",
            "Certificate rotation and cached gateway trust state.",
          ),
          textarea(
            "Follow-up actions",
            "Review certificate rollout and gateway validation checks.",
          ),
        ],
        "Review",
      ),
    ],
    aside: [
      fields("Stakeholder Broadcast", [
        select("Audience", [
          "Affected employees",
          "Responders",
          "Service owners",
        ]),
        textarea(
          "Public update",
          "We are routing affected connections through our secondary gateway. The next update will follow at 14:30 UTC.",
        ),
      ]),
      cards("Associated ITIL Context", [
        {
          title: "PRB-031 · Gateway timeouts",
          text: "Root cause investigation.",
          href: "/workspace/problems/PRB-031",
        },
        {
          title: "CHG-087 · Firmware patch",
          text: "Emergency remediation window.",
          href: "/workspace/changes/CHG-087",
        },
      ]),
    ],
  },
  {
    ...scope,
    id: "W14",
    path: "/workspace/requests",
    title: "Service Requests & Fulfillment Queue",
    description:
      "Manage approved service requests, stock allocation and delivery milestones.",
    actions: [
      link("Browse catalog", "/portal/catalog"),
      link("Create Request", "/workspace/tickets/new", true),
    ],
    metrics: [
      {
        label: "Active requests",
        value: "28",
        note: "Across all fulfillment teams",
      },
      {
        label: "Awaiting approval",
        value: "16",
        note: "Manager or service-owner review",
        tone: "warning",
      },
      { label: "Ready to fulfill", value: "9", note: "Approved and assigned" },
      {
        label: "Average fulfillment",
        value: "4.8h",
        note: "Illustrative current period",
      },
    ],
    tabs: [
      "All Requests",
      "Awaiting Approval",
      "Ready to Fulfill",
      "Completed",
    ],
    sections: [
      table(
        "Request Queue",
        [
          "Request",
          "Catalog item",
          "Requester",
          "Cost",
          "Approval",
          "Fulfillment",
        ],
        [
          row(
            [
              "REQ-2079",
              "MacBook Pro 16-inch refresh",
              "Samuel Reed",
              "$3,499",
              "Approved",
              "Preparing device",
            ],
            "/workspace/requests/REQ-2079",
          ),
          row(
            [
              "REQ-2081",
              "Financial warehouse access",
              "Layla Ahmed",
              "$450 / year",
              "Pending",
              "Blocked",
            ],
            "/workspace/requests/REQ-2081",
          ),
          row(
            [
              "REQ-2077",
              "Figma Enterprise seat",
              "Amina Yusuf",
              "$240 / year",
              "Approved",
              "Ready",
            ],
            "/workspace/requests/REQ-2077",
          ),
        ],
        "All Requests",
      ),
      table(
        "Approval Bottlenecks",
        ["Request", "Requester", "Approval step", "Age"],
        [
          row(
            ["REQ-2081", "Layla Ahmed", "System owner review", "1 day"],
            "/workspace/requests/REQ-2081",
          ),
        ],
        "Awaiting Approval",
      ),
      table(
        "Approved Work",
        ["Request", "Item", "Assigned team", "Next action"],
        [
          row(
            [
              "REQ-2079",
              "MacBook Pro refresh",
              "Workplace IT",
              "Prepare collection",
            ],
            "/workspace/requests/REQ-2079",
          ),
          row(
            [
              "REQ-2077",
              "Figma Enterprise seat",
              "Applications Support",
              "Provision seat",
            ],
            "/workspace/requests/REQ-2077",
          ),
        ],
        "Ready to Fulfill",
      ),
      table(
        "Fulfilled Requests",
        ["Request", "Item", "Delivered", "Acknowledgment"],
        [
          row(
            [
              "REQ-2060",
              "Replacement power adapter",
              "19 Oct 2026",
              "Received",
            ],
            "/workspace/requests/REQ-2060",
          ),
        ],
        "Completed",
      ),
    ],
    aside: [
      text("Fulfillment Checks", [
        "Approval must be complete before fulfillment starts. Item details and cost are retained from the submitted catalog version.",
      ]),
      cards("Related Configuration", [
        {
          title: "Catalog administration",
          text: "Services, eligibility and fulfillment templates.",
          href: "/admin/catalog",
        },
        {
          title: "Approval workflows",
          text: "Routing and approval-stage definitions.",
          href: "/admin/approvals",
        },
      ]),
    ],
  },
  {
    ...scope,
    id: "W15",
    path: "/workspace/requests/REQ-2079",
    title: "MacBook Pro 16-inch Apple Silicon Refresh",
    description:
      "REQ-2079 · Samuel Reed · Hardware lifecycle replacement · Workplace IT",
    parent: { label: "Service Requests", href: "/workspace/requests" },
    actions: [
      link("Open asset", "/workspace/assets/AST-00321"),
      link("Complete Fulfillment", undefined, true),
    ],
    tabs: ["Fulfillment", "Request Answers", "Conversation"],
    sections: [
      fields("Requester Profile & Configuration", [
        input("Requester", "Samuel Reed"),
        input("Cost center", "CC-410 · Product Design"),
        input("Configuration", "Apple Silicon · 32GB · 1TB"),
        input("Approved cost", "$3,499.00 USD"),
      ]),
      timeline(
        "Approval Audit Trail",
        [
          {
            title: "Manager budget sign-off",
            text: "Approved by department manager.",
            meta: "21 Oct 2026 · 10:15 UTC",
          },
          {
            title: "Asset management review",
            text: "Replacement cycle confirmed; depot stock reserved.",
            meta: "21 Oct 2026 · 11:10 UTC",
          },
        ],
        "Fulfillment",
      ),
      checklist(
        "Fulfillment Checklist",
        [
          {
            title: "Reserve replacement hardware",
            done: true,
            text: "AST-00418 · London depot",
          },
          {
            title: "Install MDM baseline and endpoint protection",
            done: true,
            text: "Standard workplace profile",
          },
          {
            title: "Prepare data migration",
            done: false,
            text: "Workplace IT · In progress",
          },
          {
            title: "Schedule collection and receive old device",
            done: false,
            text: "Awaiting requester appointment",
          },
        ],
        "Fulfillment",
      ),
      table(
        "Submitted Form Snapshot",
        ["Question", "Submitted answer"],
        [
          row([
            "Business reason",
            "Battery wear and device refresh eligibility",
          ]),
          row(["Requested configuration", "MacBook Pro 16-inch · 32GB / 1TB"]),
          row(["Collection location", "London office IT desk"]),
          row(["Catalog version", "v3.2 · $3,499"]),
        ],
        "Request Answers",
      ),
      timeline(
        "Public Request Conversation",
        [
          {
            title: "Samuel Reed",
            text: "I can collect the device after 14:00 on Thursday.",
            meta: "21 Oct 2026 · 15:00 UTC",
          },
          {
            title: "Workplace IT",
            text: "We are preparing your device and will confirm your collection slot.",
            meta: "22 Oct 2026 · 09:00 UTC",
          },
        ],
        "Conversation",
      ),
    ],
    aside: [
      text(
        "Allocated Asset",
        ["AST-00418 · MacBook Pro 16-inch", "London depot · Reserved"],
        [link("View Asset Inventory", "/workspace/assets")],
      ),
      text("Delivery Details", [
        "Collection: London IT desk",
        "Return the old device within 14 days of collection.",
      ]),
      text("Fulfillment SLA", [
        "16h 40m remaining · Illustrative target",
        "Clock starts after required approvals are complete.",
      ]),
    ],
  },
];
