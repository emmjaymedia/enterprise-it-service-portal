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
  area: "workspace",
  eyebrow: "OPERATIONS & GOVERNANCE",
} as const;
export const operationsScreens: ScreenSpec[] = [
  {
    ...scope,
    id: "P01",
    path: "/workspace/problems",
    title: "Problem Records & Known Error Database",
    description:
      "Investigate recurring incidents, identify root causes and track permanent remediation.",
    actions: [
      link("Known errors", "/workspace/problems?tab=Known%20Errors"),
      link("Create Problem", undefined, true),
    ],
    metrics: [
      { label: "Active problems", value: "12", note: "3 under investigation" },
      { label: "Connected incidents", value: "28", note: "Across 6 services" },
      { label: "Knowledge articles", value: "148", note: "Approved runbooks" },
      {
        label: "Mean age",
        value: "4.2 days",
        note: "Illustrative active register",
      },
    ],
    tabs: ["All Problems", "Known Errors", "Resolved"],
    sections: [
      table(
        "Problem Register",
        ["Problem", "Summary", "Service", "Owner", "Priority", "Status"],
        [
          row(
            [
              "PRB-031",
              "Recurring VPN gateway authentication timeouts",
              "Corporate VPN",
              "Priya Shah",
              "P1 Critical",
              "Investigating",
            ],
            "/workspace/problems/PRB-031",
            "danger",
          ),
          row(
            [
              "PRB-032",
              "Payroll database locking contention",
              "Payroll & HRIS",
              "Daniel Cole",
              "P2 High",
              "Root cause identified",
            ],
            "/workspace/problems/PRB-032",
          ),
          row(
            [
              "PRB-033",
              "Intermittent laptop battery degradation",
              "Workplace IT",
              "Rashid Khan",
              "P3 Medium",
              "Known error",
            ],
            "/workspace/problems/PRB-033",
          ),
        ],
        "All Problems",
      ),
      cards(
        "Verified Workarounds",
        [
          {
            title: "Gateway authentication timeout",
            text: "Reconnect through the secondary regional gateway while permanent remediation is validated.",
            badge: "Known error",
            href: "/workspace/problems/PRB-031",
          },
          {
            title: "Laptop power management",
            text: "Review battery health and apply the approved workplace profile.",
            badge: "Known error",
            href: "/workspace/problems/PRB-033",
          },
        ],
        "Known Errors",
      ),
      table(
        "Resolved Investigations",
        ["Problem", "Service", "Resolved", "Outcome"],
        [
          row(
            [
              "PRB-029",
              "Email & Collaboration",
              "18 Oct 2026",
              "Token cache fix published",
            ],
            "/workspace/problems/PRB-029",
          ),
        ],
        "Resolved",
      ),
    ],
    aside: [
      text("Top Incident Generators", [
        "Corporate VPN · 14 linked incidents",
        "Payroll database · 8 linked incidents",
        "Workplace devices · 6 linked incidents",
      ]),
      cards("Related Content", [
        {
          title: "VPN recovery runbook",
          text: "Review the operational recovery procedure.",
          href: "/workspace/knowledge/KB-4031/edit",
          icon: "book",
        },
      ]),
    ],
  },
  {
    ...scope,
    id: "P02",
    path: "/workspace/problems/PRB-031",
    title: "PRB-031 — Recurring VPN gateway authentication timeouts",
    description:
      "Certificate rotation in the Dublin gateway cluster · Owner: Priya Shah",
    parent: { label: "Problems Register", href: "/workspace/problems" },
    actions: [
      link("Open related change", "/workspace/changes/CHG-087"),
      link("Update Investigation", undefined, true),
    ],
    tabs: ["Investigation", "Linked Incidents", "Known Error"],
    sections: [
      text(
        "Symptoms & Failure Signatures",
        [
          "Users report SEC_CONN_TIMEOUT_403 after gateway certificate rotation. Failures are concentrated on cached sessions through the Frankfurt and Dublin clusters.",
          "Service impact: intermittent authentication failures and repeated sign-in prompts for remote users.",
        ],
        undefined,
        "Investigation",
      ),
      fields(
        "Root Cause Analysis",
        [
          textarea(
            "Contributing factors",
            "Stale intermediate certificate entries remain on secondary gateway nodes after rotation.",
          ),
          textarea(
            "Evidence",
            "Gateway logs show trust-chain validation failures during RADIUS authentication.",
          ),
          textarea(
            "Permanent remediation",
            "Apply the validated firmware patch and synchronize trust stores across the cluster.",
          ),
        ],
        "Investigation",
      ),
      timeline(
        "Investigation Timeline",
        [
          {
            title: "Failure pattern isolated",
            text: "Certificate cache behavior correlated with the maintenance window.",
            meta: "22 Oct 2026 · Priya Shah",
          },
          {
            title: "Linked incident cohort reviewed",
            text: "Affected users share the same gateway cluster.",
            meta: "21 Oct 2026 · Daniel Cole",
          },
        ],
        "Investigation",
      ),
      table(
        "Affected Incidents",
        ["Ticket", "Requester", "Service", "State"],
        [
          row(
            ["INC-1042", "Amina Yusuf", "Corporate VPN", "In progress"],
            "/workspace/tickets/INC-1042",
          ),
          row(
            ["INC-1044", "Grace Okafor", "Payroll", "Open"],
            "/workspace/tickets/INC-1044",
          ),
        ],
        "Linked Incidents",
      ),
      text(
        "Verified Workaround",
        [
          "Route affected users through the secondary London gateway. Validate reconnect behavior before returning traffic to the primary cluster.",
          "Workaround owner: Network Operations. Publication requires content review.",
        ],
        [link("Review Knowledge Article", "/workspace/knowledge/KB-4031/edit")],
        "Known Error",
      ),
    ],
    aside: [
      text("Investigation Ownership", [
        "Priya Shah · Network Operations",
        "Service: Corporate VPN",
        "Status: Investigation in progress",
      ]),
      cards("Permanent Remediation", [
        {
          title: "CHG-087 · Emergency gateway firmware patch",
          text: "Implementation and rollback plans are recorded in the change request.",
          href: "/workspace/changes/CHG-087",
        },
      ]),
    ],
  },
  {
    ...scope,
    id: "C01",
    path: "/workspace/changes",
    title: "Changes Register & Release Governance",
    description:
      "Review operational risk, authorization and planned service changes.",
    actions: [
      link("Change calendar", "/workspace/changes/calendar"),
      link("Create Change", "/workspace/changes/new", true),
    ],
    metrics: [
      { label: "Scheduled this week", value: "4", note: "Across 3 services" },
      { label: "Awaiting CAB", value: "2", note: "Review quorum pending" },
      {
        label: "Change success",
        value: "98.2%",
        note: "Illustrative 30-day period",
      },
      {
        label: "Next freeze",
        value: "12 days",
        note: "Quarter-end financial close",
      },
    ],
    tabs: ["All Changes", "Pending Approval", "Scheduled", "Completed"],
    sections: [
      table(
        "Change Register",
        ["Change", "Summary", "Type", "Risk", "Owner", "Window", "Status"],
        [
          row(
            [
              "CHG-087",
              "Emergency gateway firmware patch",
              "Emergency",
              "High",
              "Priya Shah",
              "22 Oct · 12:00 UTC",
              "Implementing",
            ],
            "/workspace/changes/CHG-087",
            "danger",
          ),
          row(
            [
              "CHG-088",
              "Workday Q4 tax engine database migration",
              "Normal",
              "Medium",
              "Daniel Cole",
              "24 Oct · 22:00 UTC",
              "Scheduled",
            ],
            "/workspace/changes/CHG-088",
          ),
          row(
            [
              "CHG-089",
              "Windows endpoint baseline refresh",
              "Standard",
              "Low",
              "Rashid Khan",
              "26 Oct · 09:00 UTC",
              "Pending CAB",
            ],
            "/workspace/changes/CHG-089",
          ),
        ],
        "All Changes",
      ),
      table(
        "CAB Review Queue",
        ["Change", "Risk", "Requested by", "Review stage"],
        [
          row(
            ["CHG-089", "Low", "Rashid Khan", "Security review"],
            "/workspace/changes/CHG-089",
          ),
        ],
        "Pending Approval",
      ),
      cards(
        "Scheduled Maintenance",
        [
          {
            title: "CHG-088 · Workday database migration",
            text: "24 Oct · 22:00–23:30 UTC · Payroll & HRIS",
            href: "/workspace/changes/CHG-088",
            badge: "Scheduled",
          },
        ],
        "Scheduled",
      ),
      table(
        "Completed Changes",
        ["Change", "Service", "Outcome", "Review"],
        [
          row(
            ["CHG-084", "Email & Collaboration", "Successful", "PIR complete"],
            "/workspace/changes/CHG-084",
          ),
        ],
        "Completed",
      ),
    ],
    aside: [
      cards("Weekly CAB Roster", [
        { title: "Daniel Cole", text: "Technical review", icon: "team" },
        {
          title: "Priya Shah",
          text: "Security and service risk",
          icon: "team",
        },
        { title: "Rashid Khan", text: "Workplace operations", icon: "team" },
      ]),
      text("Emergency Change Policy", [
        "Expedited authority must be documented. An emergency change still requires evidence, rollback planning and a retrospective review.",
      ]),
    ],
  },
  {
    ...scope,
    id: "C02",
    path: "/workspace/changes/new",
    title: "Create Change Request (RFC)",
    description:
      "Define the affected services, assess risk and prepare implementation and rollback plans.",
    parent: { label: "Changes Register", href: "/workspace/changes" },
    actions: [
      link("Return to register", "/workspace/changes"),
      link("Save Draft"),
      link("Submit for Review", undefined, true),
    ],
    tabs: ["Scope & Risk", "Implementation Plans", "Schedule & Review"],
    sections: [
      fields(
        "Change Profile & Scope Association",
        [
          input(
            "Change title",
            "Gateway firmware patch and route synchronization",
          ),
          select("Change type", ["Normal", "Standard", "Emergency"]),
          select("Affected service", [
            "Corporate VPN",
            "Payroll & HRIS",
            "Workplace IT",
          ]),
          input("Related problem", "PRB-031"),
          textarea(
            "Business reason",
            "Restore reliable remote authentication following the gateway certificate rotation.",
          ),
        ],
        "Scope & Risk",
      ),
      fields(
        "Risk & Impact Assessment",
        [
          select("Affected users", [
            "Single team",
            "Multiple departments",
            "Organization-wide",
          ]),
          select("Service criticality", ["High", "Medium", "Low"]),
          select("Test evidence", [
            "Staging validated",
            "Peer reviewed",
            "Awaiting validation",
          ]),
          select("Expected outage", [
            "No interruption",
            "Under 30 minutes",
            "Over 30 minutes",
          ]),
        ],
        "Scope & Risk",
      ),
      fields(
        "Implementation & Rollback Architecture",
        [
          textarea(
            "Implementation plan",
            "1. Validate the standby gateway.\n2. Drain active connections.\n3. Apply the approved firmware.\n4. Verify authentication and restore traffic.",
          ),
          textarea(
            "Validation plan",
            "Run authentication smoke tests and monitor gateway error rates.",
          ),
          textarea(
            "Rollback plan",
            "Restore the previous firmware image and route traffic to the standby cluster.",
          ),
        ],
        "Implementation Plans",
      ),
      fields(
        "Maintenance Window & Reviewer Selection",
        [
          input("Start (UTC)", "2026-10-24 22:00"),
          input("End (UTC)", "2026-10-24 23:30"),
          input("Implementation owner", "Priya Shah"),
          select("Review board", [
            "Infrastructure CAB",
            "Workplace CAB",
            "Emergency CAB",
          ]),
        ],
        "Schedule & Review",
      ),
      text(
        "Conflict Review",
        [
          "Potential overlap: Corporate VPN maintenance on 24 Oct. Confirm service-owner availability and change-freeze restrictions before review.",
        ],
        undefined,
        "Schedule & Review",
      ),
    ],
    aside: [
      text("Mandatory RFC Artifacts", [
        "Affected services and assets",
        "Risk assessment and evidence",
        "Implementation, test and rollback plans",
        "Approved window and accountable owner",
      ]),
      cards("Related Investigation", [
        {
          title: "PRB-031 · Gateway authentication",
          text: "Review symptoms, evidence and linked incidents.",
          href: "/workspace/problems/PRB-031",
        },
      ]),
    ],
  },
  {
    ...scope,
    id: "C03",
    path: "/workspace/changes/CHG-087",
    title: "CHG-087 — Emergency firmware patch & gateway route sync",
    description:
      "Corporate VPN · Emergency change · Owner: Priya Shah · Window: 22 Oct, 12:00–12:45 UTC",
    parent: { label: "Changes Register", href: "/workspace/changes" },
    actions: [
      link("View calendar", "/workspace/changes/calendar"),
      link("Record Execution", undefined, true),
    ],
    tabs: ["Execution", "Plans & Evidence", "Approvals", "Review"],
    metrics: [
      {
        label: "Change state",
        value: "Implementing",
        note: "Approved emergency window",
      },
      {
        label: "Risk",
        value: "High",
        note: "Production gateway cluster",
        tone: "warning",
      },
      { label: "Window", value: "45 minutes", note: "12:00–12:45 UTC" },
      { label: "Rollback", value: "Ready", note: "Previous firmware retained" },
    ],
    sections: [
      checklist(
        "Active Execution Runbook",
        [
          {
            title: "Validate standby authentication",
            done: true,
            text: "Staging and standby tests passed.",
          },
          {
            title: "Drain affected gateway connections",
            done: true,
            text: "Traffic routed to London.",
          },
          {
            title: "Apply firmware and synchronize trust store",
            done: false,
            text: "Priya Shah · In progress",
          },
          {
            title: "Run post-change verification",
            done: false,
            text: "Awaiting patch completion",
          },
        ],
        "Execution",
      ),
      {
        kind: "code",
        title: "Bastion Console Preview",
        paragraphs: [
          "[12:08:20 UTC] Change window authorization verified\n[12:09:01 UTC] Standby gateway health check: PASS\n[12:11:18 UTC] Primary connections drained\n[12:12:04 UTC] Firmware validation in progress\n[preview] This console displays sample output.",
        ],
        tab: "Execution",
      },
      text(
        "Implementation Plan",
        [
          "Validate the standby gateway, drain active connections, install the approved image and verify trust-store synchronization.",
        ],
        undefined,
        "Plans & Evidence",
      ),
      text(
        "Verified Rollback Protocol",
        [
          "Restore the signed previous firmware image if authentication validation fails. Reapply the known-good routing configuration and notify the service owner.",
        ],
        undefined,
        "Plans & Evidence",
      ),
      timeline(
        "CAB Approval Quorum",
        [
          {
            title: "Technical review approved",
            text: "Daniel Cole · Implementation plan reviewed",
            meta: "22 Oct · 10:15 UTC",
          },
          {
            title: "Emergency authority recorded",
            text: "Priya Shah · Risk and rollback approved",
            meta: "22 Oct · 10:40 UTC",
          },
        ],
        "Approvals",
      ),
      fields(
        "Post-Implementation Review",
        [
          textarea("Outcome summary"),
          textarea("Validation evidence"),
          textarea("Follow-up actions"),
        ],
        "Review",
      ),
    ],
    aside: [
      cards("CMDB & Blast Radius", [
        {
          title: "Corporate VPN",
          text: "1,420 illustrative affected users; 3 gateway nodes.",
          href: "/workspace/cmdb",
        },
        {
          title: "PRB-031",
          text: "Linked authentication investigation.",
          href: "/workspace/problems/PRB-031",
        },
      ]),
      text("Stakeholder Broadcast", [
        "Change in progress. Existing connections are routed through the secondary region. Service owners will receive the next validation update.",
      ]),
    ],
  },
  {
    ...scope,
    id: "C04",
    path: "/workspace/changes/calendar",
    title: "Enterprise Change & Maintenance Calendar",
    description:
      "Coordinate service windows and review overlaps across production environments.",
    parent: { label: "Changes Register", href: "/workspace/changes" },
    actions: [
      link("Changes register", "/workspace/changes"),
      link("Propose Window", "/workspace/changes/new", true),
    ],
    tabs: ["Week", "Month", "List"],
    sections: [
      {
        kind: "calendar",
        title: "19–25 October 2026 · UTC",
        items: [
          {
            title: "CHG-087 · VPN gateway patch",
            text: "Thu 22 · 12:00–12:45",
            href: "/workspace/changes/CHG-087",
            tone: "danger",
          },
          {
            title: "CHG-088 · Workday migration",
            text: "Sat 24 · 22:00–23:30",
            href: "/workspace/changes/CHG-088",
          },
          {
            title: "Gateway health validation",
            text: "Sun 25 · 08:00–09:00",
            href: "/workspace/changes/CHG-087",
          },
        ],
        tab: "Week",
      },
      {
        kind: "calendar",
        title: "October 2026 · UTC",
        items: [
          {
            title: "Quarter-end change freeze",
            text: "26–30 Oct · Finance services",
            tone: "warning",
          },
          {
            title: "CHG-087 · VPN gateway patch",
            text: "22 Oct · Emergency window",
            href: "/workspace/changes/CHG-087",
          },
          {
            title: "CHG-088 · Workday migration",
            text: "24 Oct · Approved window",
            href: "/workspace/changes/CHG-088",
          },
        ],
        tab: "Month",
      },
      table(
        "Scheduled Changes",
        ["Change", "Service", "Start (UTC)", "End (UTC)", "Risk"],
        [
          row(
            [
              "CHG-087",
              "Corporate VPN",
              "22 Oct · 12:00",
              "22 Oct · 12:45",
              "High",
            ],
            "/workspace/changes/CHG-087",
          ),
          row(
            [
              "CHG-088",
              "Payroll & HRIS",
              "24 Oct · 22:00",
              "24 Oct · 23:30",
              "Medium",
            ],
            "/workspace/changes/CHG-088",
          ),
        ],
        "List",
      ),
    ],
    aside: [
      text("Window Conflict Review", [
        "A VPN validation task follows the emergency patch. Service owners should verify responder availability and upstream dependencies.",
      ]),
      text("Policy Calendar", [
        "All displayed times use UTC.",
        "Quarter-end freeze: 26–30 October. Emergency authority is required for exceptions.",
      ]),
    ],
  },
  {
    ...scope,
    id: "I01",
    path: "/workspace/assets",
    title: "Hardware & Asset Inventory",
    description:
      "Track assigned hardware, depot stock, warranty coverage and lifecycle state.",
    actions: [
      link("CMDB services", "/workspace/cmdb"),
      link("Register / Import", "/workspace/assets/new", true),
    ],
    metrics: [
      {
        label: "Total tracked assets",
        value: "4,820",
        note: "Illustrative inventory",
      },
      {
        label: "Stock availability",
        value: "London Depot",
        note: "38 ready-to-issue devices",
      },
      {
        label: "Warranty expiring",
        value: "38 units",
        note: "Within 90 days",
        tone: "warning",
      },
      {
        label: "Action required",
        value: "14 flagged",
        note: "Review ownership or health",
        tone: "danger",
      },
    ],
    tabs: ["All Assets", "Assigned", "In Stock", "Retired"],
    sections: [
      table(
        "Asset Register",
        [
          "Asset tag",
          "Model",
          "Serial",
          "Custodian",
          "Location",
          "Lifecycle",
          "Warranty",
        ],
        [
          row(
            [
              "AST-00321",
              "Dell Latitude 7440",
              "DL7440-00321",
              "Amina Yusuf",
              "London",
              "Assigned",
              "Jul 2027",
            ],
            "/workspace/assets/AST-00321",
          ),
          row(
            [
              "AST-00418",
              "MacBook Pro 16-inch",
              "MBP16-00418",
              "Reserved for Samuel Reed",
              "London Depot",
              "Reserved",
              "Oct 2028",
            ],
            "/workspace/assets/AST-00418",
          ),
          row(
            [
              "AST-00502",
              "Dell UltraSharp 27-inch",
              "DU27-00502",
              "Amina Yusuf",
              "London",
              "Assigned",
              "May 2027",
            ],
            "/workspace/assets/AST-00502",
          ),
        ],
        "All Assets",
      ),
      table(
        "Employee Custody",
        ["Asset", "Device", "Assigned to", "Assigned date"],
        [
          row(
            ["AST-00321", "Dell Latitude 7440", "Amina Yusuf", "15 Jan 2025"],
            "/workspace/assets/AST-00321",
          ),
          row(
            [
              "AST-00502",
              "Dell UltraSharp 27-inch",
              "Amina Yusuf",
              "15 Jan 2025",
            ],
            "/workspace/assets/AST-00502",
          ),
        ],
        "Assigned",
      ),
      cards(
        "Available Depot Stock",
        [
          {
            title: "MacBook Pro 16-inch",
            text: "12 available · London Depot",
            badge: "Ready to issue",
            href: "/workspace/assets/AST-00418",
            icon: "box",
          },
          {
            title: "Dell Latitude 7440",
            text: "26 available · London Depot",
            badge: "Ready to issue",
            href: "/workspace/assets/new",
            icon: "box",
          },
        ],
        "In Stock",
      ),
      table(
        "Retired Hardware",
        ["Asset", "Model", "Retired date", "Disposition"],
        [
          row([
            "AST-00110",
            "Dell Latitude 7400",
            "12 Aug 2026",
            "Secure recycling complete",
          ]),
        ],
        "Retired",
      ),
    ],
    aside: [
      text("Inventory Coverage", [
        "4,820 assets across London, Dublin and remote workplaces.",
        "Device health, warranty and financial values are sample content for screen review.",
      ]),
      cards("Quick Navigation", [
        {
          title: "Register hardware",
          text: "Manual entry and CSV import layout.",
          href: "/workspace/assets/new",
        },
        {
          title: "Inspect service dependencies",
          text: "View configuration items and relationships.",
          href: "/workspace/cmdb",
        },
      ]),
    ],
  },
  {
    ...scope,
    id: "I02",
    path: "/workspace/assets/AST-00321",
    title: "AST-00321 — Dell Latitude 7440",
    description:
      "Assigned to Amina Yusuf · London · In service · Corporate Windows endpoint",
    parent: { label: "Asset Inventory", href: "/workspace/assets" },
    actions: [
      link("Assign / Transfer"),
      link("Log Maintenance", undefined, true),
    ],
    tabs: ["Overview", "Custody History", "Maintenance", "Related Records"],
    sections: [
      fields(
        "Asset Overview & Hardware Specs",
        [
          input("Manufacturer & model", "Dell Latitude 7440"),
          input("Serial number", "DL7440-00321"),
          input("Processor", "Intel Core i7"),
          input("Memory / storage", "32GB RAM · 1TB SSD"),
          input("Operating system", "Windows 11 Enterprise"),
          input("Assigned location", "London office"),
        ],
        "Overview",
      ),
      cards(
        "MDM & Security Telemetry",
        [
          {
            title: "Battery health",
            text: "Illustrative endpoint telemetry",
            value: "94%",
            badge: "Healthy",
          },
          {
            title: "Disk encryption",
            text: "BitLocker recovery managed",
            badge: "Encrypted",
          },
          {
            title: "Endpoint protection",
            text: "Corporate security baseline",
            badge: "Compliant",
          },
        ],
        "Overview",
      ),
      timeline(
        "Custody History & Audit Trail",
        [
          {
            title: "Assigned to Amina Yusuf",
            text: "Global Sales · London office",
            meta: "15 Jan 2025",
          },
          {
            title: "Received by Workplace IT",
            text: "Asset registered and enrolled in management.",
            meta: "12 Jan 2025",
          },
        ],
        "Custody History",
      ),
      table(
        "Maintenance Records",
        ["Date", "Work performed", "Technician", "Outcome"],
        [
          row([
            "12 Oct 2026",
            "Firmware and security baseline",
            "Rashid Khan",
            "Verified",
          ]),
          row([
            "14 Jul 2026",
            "Battery health review",
            "Workplace IT",
            "No repair required",
          ]),
        ],
        "Maintenance",
      ),
      table(
        "Linked ITSM Records",
        ["Record", "Summary", "Relation", "State"],
        [
          row(
            [
              "INC-1042",
              "Unable to connect to VPN",
              "Affected device",
              "In progress",
            ],
            "/workspace/tickets/INC-1042",
          ),
          row(
            ["REQ-2079", "Hardware refresh", "Related request", "Preparing"],
            "/workspace/requests/REQ-2079",
          ),
        ],
        "Related Records",
      ),
    ],
    aside: [
      text("Current Custodian", [
        "Amina Yusuf · Global Sales",
        "London office · Assigned 15 Jan 2025",
      ]),
      text("Warranty & Financials", [
        "Dell ProSupport · Expires July 2027",
        "Purchase cost: $1,480 · Illustrative financial data",
      ]),
      cards("Attached Peripherals", [
        {
          title: "Dell UltraSharp 27-inch",
          text: "AST-00502 · USB-C display",
          href: "/workspace/assets/AST-00502",
          icon: "box",
        },
      ]),
    ],
  },
  {
    ...scope,
    id: "I03",
    path: "/workspace/assets/new",
    title: "Register & Import Assets",
    description:
      "Prepare hardware records, map CSV columns and inspect validation results.",
    parent: { label: "Asset Inventory", href: "/workspace/assets" },
    actions: [
      link("Inventory", "/workspace/assets"),
      link("Review Import", undefined, true),
    ],
    tabs: ["CSV Import", "Register Single Asset"],
    sections: [
      {
        kind: "workflow",
        title: "Asset Import Stages",
        items: [
          { title: "1 · Upload CSV", text: "Select hardware inventory file" },
          { title: "2 · Map columns", text: "Confirm field mapping" },
          { title: "3 · Validate / dry run", text: "Review sample validation" },
          { title: "4 · Results", text: "Inspect accepted and rejected rows" },
        ],
        tab: "CSV Import",
      },
      text(
        "Selected Import File",
        [
          "Q4_Hardware_Procurement_Dell_Apple_Batch.csv",
          "142 illustrative input rows · No file has been uploaded.",
        ],
        undefined,
        "CSV Import",
      ),
      table(
        "Column Mapping Definition",
        ["Source column", "Target field", "Required", "Validation"],
        [
          row(["Asset_Tag", "Asset tag", "Yes", "Unique"]),
          row(["Serial_Number", "Serial number", "Yes", "Unique"]),
          row(["Model_Name", "Model", "Yes", "Text"]),
          row(["Assigned_Email", "Custodian", "No", "Directory lookup"]),
          row(["Purchase_Date", "Purchase date", "No", "ISO date"]),
        ],
        "CSV Import",
      ),
      table(
        "Pre-Flight Dry Run",
        ["Row", "Asset", "Result", "Message"],
        [
          row(["1", "AST-00418", "Valid", "Ready for import"]),
          row(
            ["17", "AST-00321", "Duplicate", "Existing asset tag"],
            undefined,
            "warning",
          ),
          row(
            ["29", "AST-00492", "Needs review", "Custodian not found"],
            undefined,
            "warning",
          ),
        ],
        "CSV Import",
      ),
      fields(
        "Register Single Hardware Asset",
        [
          input("Asset tag"),
          input("Serial number"),
          input("Manufacturer"),
          input("Model"),
          select("Asset type", [
            "Laptop",
            "Desktop",
            "Monitor",
            "Network equipment",
          ]),
          select("Lifecycle", ["In stock", "Assigned", "Under repair"]),
          input("Location", "London Depot"),
          input("Warranty end date"),
        ],
        "Register Single Asset",
      ),
    ],
    aside: [
      text("Ingestion Policy & Workflows", [
        "Duplicate tags and serial numbers require review.",
        "Invalid rows are isolated before import. Existing custodian relationships must be verified.",
      ]),
      text("Preview Results", [
        "142 total rows",
        "129 valid · 13 need review",
        "Import execution will be connected later.",
      ]),
    ],
  },
  {
    ...scope,
    id: "I04",
    path: "/workspace/cmdb",
    title: "Configuration Management Database & Service Topology",
    description:
      "Inspect configuration items, ownership and upstream / downstream service dependencies.",
    actions: [
      link("Asset inventory", "/workspace/assets"),
      link("Link Configuration Item", undefined, true),
    ],
    tabs: ["Dependency Graph", "Configuration Items", "Service Health"],
    sections: [
      {
        kind: "topology",
        title: "Corporate VPN · Production",
        items: [
          {
            title: "Corporate VPN Service",
            text: "Service owner: Priya Shah",
            href: "/portal/status",
            tone: "warning",
          },
          {
            title: "Dublin Gateway Cluster",
            text: "dub-vpn-gw01 · Degraded",
            tone: "danger",
          },
          { title: "London Gateway Cluster", text: "lon-vpn-gw01 · Healthy" },
          { title: "Identity Provider", text: "SSO / RADIUS · Healthy" },
          { title: "Core Network", text: "Regional transit · Healthy" },
        ],
        tab: "Dependency Graph",
      },
      table(
        "Accessible Dependency Table",
        ["Configuration item", "Type", "Relationship", "Health", "Owner"],
        [
          row([
            "Corporate VPN",
            "Business service",
            "Depends on gateway clusters",
            "Degraded",
            "Network Operations",
          ]),
          row([
            "dub-vpn-gw01",
            "Gateway",
            "Supports Corporate VPN",
            "Degraded",
            "Priya Shah",
          ]),
          row([
            "lon-vpn-gw01",
            "Gateway",
            "Standby for Dublin cluster",
            "Healthy",
            "Daniel Cole",
          ]),
          row([
            "Enterprise SSO",
            "Identity service",
            "Authenticates gateway users",
            "Healthy",
            "Identity & Access",
          ]),
        ],
        "Configuration Items",
      ),
      cards(
        "Service Health Overview",
        [
          {
            title: "Corporate VPN",
            text: "Authentication degradation in EMEA.",
            badge: "Degraded",
            href: "/portal/status",
          },
          {
            title: "Email & Collaboration",
            text: "Normal service operation.",
            badge: "Operational",
            href: "/portal/status",
          },
          {
            title: "Identity & SSO",
            text: "Normal service operation.",
            badge: "Operational",
            href: "/portal/status",
          },
        ],
        "Service Health",
      ),
    ],
    aside: [
      text("Selected Configuration Item", [
        "dub-vpn-gw01.infra.internal",
        "Production · Dublin",
        "Owner: Network Operations",
      ]),
      text("Blast Radius Preview", [
        "1,420 illustrative affected users",
        "3 dependent service paths",
        "Dependency data is a screen preview, not live discovery.",
      ]),
      cards("Related Records", [
        {
          title: "MIM-001 · VPN gateway failover",
          text: "Active command center.",
          href: "/workspace/major-incidents/MIM-001",
        },
        {
          title: "CHG-087 · Gateway patch",
          text: "Emergency service remediation.",
          href: "/workspace/changes/CHG-087",
        },
      ]),
    ],
  },
  {
    ...scope,
    id: "K01",
    path: "/workspace/knowledge",
    title: "Knowledge Management & Content Governance",
    description:
      "Manage runbooks, review article ownership and maintain employee-facing guidance.",
    actions: [
      link("Employee knowledge base", "/portal/knowledge"),
      link("New Article", "/workspace/knowledge/new/edit", true),
    ],
    metrics: [
      { label: "Total articles", value: "148", note: "Across 6 categories" },
      {
        label: "Needs review",
        value: "8",
        note: "Owners notified",
        tone: "warning",
      },
      {
        label: "Self-service use",
        value: "41.8%",
        note: "Illustrative content engagement",
      },
      {
        label: "Helpfulness",
        value: "4.72 / 5",
        note: "Illustrative submitted feedback",
      },
    ],
    tabs: ["All Articles", "Drafts", "In Review", "Published", "Archived"],
    sections: [
      table(
        "Content Library",
        ["Article", "Title", "Category", "Audience", "Owner", "State"],
        [
          row(
            [
              "KB-4029",
              "Troubleshoot your VPN connection",
              "Network & Access",
              "Employees",
              "Daniel Cole",
              "Published",
            ],
            "/workspace/knowledge/KB-4029/edit",
          ),
          row(
            [
              "KB-4031",
              "VPN gateway failover & firmware recovery",
              "Infrastructure",
              "Support only",
              "Priya Shah",
              "In review",
            ],
            "/workspace/knowledge/KB-4031/edit",
          ),
          row(
            [
              "KB-4032",
              "Resolve Outlook repeated sign-in prompts",
              "Email & Collaboration",
              "Employees",
              "Maya Lee",
              "Draft",
            ],
            "/workspace/knowledge/KB-4032/edit",
          ),
        ],
        "All Articles",
      ),
      cards(
        "Draft Articles",
        [
          {
            title: "KB-4032 · Outlook repeated sign-in",
            text: "Draft · Maya Lee · Updated 21 Oct",
            href: "/workspace/knowledge/KB-4032/edit",
            icon: "book",
          },
        ],
        "Drafts",
      ),
      cards(
        "Reviewer Queue",
        [
          {
            title: "KB-4031 · VPN gateway recovery",
            text: "Awaiting technical review by Daniel Cole.",
            href: "/workspace/knowledge/KB-4031/edit",
            icon: "book",
          },
        ],
        "In Review",
      ),
      cards(
        "Published Runbooks",
        [
          {
            title: "KB-4029 · Troubleshoot your VPN connection",
            text: "Published for employees. Next review: January 2027.",
            href: "/portal/knowledge/vpn-connection",
            icon: "book",
          },
        ],
        "Published",
      ),
      text(
        "Archived Content",
        [
          "KB-3980 · Legacy VPN setup — replaced by KB-4029.",
          "Archived articles retain their history and link to the approved replacement.",
        ],
        [link("View Replacement", "/portal/knowledge/vpn-connection")],
        "Archived",
      ),
    ],
    aside: [
      text("Stale Content Alert", [
        "8 articles need owner review. Prioritize frequently viewed runbooks and guidance linked to active incidents.",
      ]),
      cards("Top Deflecting Runbooks", [
        {
          title: "VPN connection troubleshooting",
          text: "Employee self-service guidance.",
          href: "/portal/knowledge/vpn-connection",
        },
        {
          title: "Authenticator setup",
          text: "Identity & SSO instructions.",
          href: "/portal/knowledge/mfa-setup",
        },
      ]),
    ],
  },
  {
    ...scope,
    id: "K02",
    path: "/workspace/knowledge/KB-4031/edit",
    title: "Editing: KB-4031 — VPN Edge Gateway Failover & Firmware Recovery",
    description:
      "Version 1.4 draft · Owner: Priya Shah · Infrastructure operations",
    parent: { label: "Knowledge Management", href: "/workspace/knowledge" },
    actions: [
      link("Preview Article", "/portal/knowledge/vpn-connection"),
      link("Save Draft"),
      link("Submit for Review", undefined, true),
    ],
    tabs: ["Content", "Preview", "Version History"],
    sections: [
      fields(
        "Article Metadata",
        [
          input("Title", "VPN Edge Gateway Failover & Firmware Recovery"),
          select("Category", [
            "Infrastructure",
            "Network & Access",
            "Identity & SSO",
          ]),
          select("Audience", ["Support only", "Employees"]),
          input("Keywords", "VPN, gateway, certificate, failover"),
        ],
        "Content",
      ),
      fields(
        "Structured Article Body",
        [
          textarea(
            "Scope and trigger criteria",
            "Use this runbook for a verified gateway authentication issue after certificate rotation. Confirm service-owner authorization before production work.",
          ),
          textarea(
            "Cluster failover sequence",
            "1. Confirm standby health.\n2. Drain primary sessions.\n3. Redirect new connections.\n4. Validate requester access.",
          ),
          textarea(
            "Post-switchover communication",
            "Tell affected requesters which service was restored and how to verify connectivity.",
          ),
        ],
        "Content",
      ),
      text(
        "VPN Edge Gateway Failover & Firmware Recovery",
        [
          "Scope: approved infrastructure responders handling gateway authentication issues.",
          "1. Verify the standby gateway and current change authorization.",
          "2. Drain active sessions and redirect new connections.",
          "3. Monitor authentication error rates and validate requester access.",
          "4. Record evidence and update the major incident timeline.",
        ],
        undefined,
        "Preview",
      ),
      timeline(
        "Version History",
        [
          {
            title: "v1.4 · Current draft",
            text: "Added certificate cache validation and requester communication steps.",
            meta: "22 Oct 2026 · Priya Shah",
          },
          {
            title: "v1.3 · Published",
            text: "Regional failover procedure reviewed.",
            meta: "14 Sep 2026 · Daniel Cole",
          },
        ],
        "Version History",
      ),
    ],
    aside: [
      text("Governance & Sign-off", [
        "Author: Priya Shah",
        "Technical reviewer: Daniel Cole",
        "State: In review · Publication not yet approved",
      ]),
      fields("Reviewer Comments", [
        textarea(
          "Review note",
          "Please include the rollback verification step before publication.",
        ),
      ]),
      text("Access Controls", [
        "Support-only content must not be exposed to employees. External links and attachments require review before publication.",
      ]),
    ],
  },
  {
    ...scope,
    id: "R01",
    path: "/workspace/reports",
    title: "Service Performance & SLA Governance",
    description:
      "Review ticket volume, backlog health, service targets and requester satisfaction.",
    actions: [
      link("Report builder", "/workspace/reports/builder"),
      link("Export Report"),
    ],
    notice:
      "Illustrative reporting sample · Values are not live operational measurements.",
    metrics: [
      {
        label: "Resolution SLA met",
        value: "96.4%",
        note: "+2.1% illustrative comparison",
      },
      {
        label: "First response SLA met",
        value: "91.8%",
        note: "Current sample period",
      },
      { label: "Active backlog", value: "28", note: "7 high-priority tickets" },
      {
        label: "Requester CSAT",
        value: "4.68 / 5",
        note: "43 submitted responses · 34% rate",
      },
    ],
    tabs: ["Overview", "SLA Ledger", "Satisfaction"],
    sections: [
      {
        kind: "chart",
        title: "Inflow vs. Resolution Volume",
        bars: [
          { label: "Mon", value: 18, secondary: 15 },
          { label: "Tue", value: 22, secondary: 20 },
          { label: "Wed", value: 25, secondary: 22 },
          { label: "Thu", value: 21, secondary: 23 },
          { label: "Fri", value: 26, secondary: 24 },
        ],
        caption: "Blue: created · Pale blue: resolved · Illustrative sample",
        tab: "Overview",
      },
      {
        kind: "chart",
        title: "Backlog Aging Distribution",
        bars: [
          { label: "0–2 days", value: 42 },
          { label: "3–5 days", value: 25 },
          { label: "6–10 days", value: 17 },
          { label: "11–20 days", value: 9 },
          { label: "21+ days", value: 3 },
        ],
        tab: "Overview",
      },
      table(
        "Authorized SLA Ledger",
        ["Ticket", "Service", "Priority", "Response", "Resolution", "Outcome"],
        [
          row(
            [
              "INC-1042",
              "Corporate VPN",
              "P2 High",
              "Within target",
              "At risk",
              "In progress",
            ],
            "/workspace/tickets/INC-1042",
          ),
          row(
            [
              "INC-1044",
              "Payroll",
              "P1 Critical",
              "Within target",
              "Breached",
              "Open",
            ],
            "/workspace/tickets/INC-1044",
          ),
        ],
        "SLA Ledger",
      ),
      {
        kind: "chart",
        title: "Requester Rating Distribution",
        bars: [
          { label: "5 stars", value: 28 },
          { label: "4 stars", value: 10 },
          { label: "3 stars", value: 3 },
          { label: "2 stars", value: 1 },
          { label: "1 star", value: 1 },
        ],
        caption:
          "43 responses from 126 eligible resolution cycles · Illustrative sample",
        tab: "Satisfaction",
      },
    ],
    aside: [
      fields("Reporting Scope", [
        select("Date range", ["Last 30 days", "Last 7 days", "This quarter"]),
        select("Team", ["All teams", "Network Operations", "Workplace IT"]),
        select("Service", ["All services", "Corporate VPN", "Payroll"]),
      ]),
      text("Metric Definitions", [
        "SLA attainment: met target cycles / eligible completed cycles.",
        "CSAT: mean submitted rating, alongside response count and rate.",
        "All dates use UTC. Current periods may be incomplete.",
      ]),
    ],
  },
  {
    ...scope,
    id: "R02",
    path: "/workspace/reports/builder",
    title: "Custom Report Builder & Scheduled Deliveries",
    description:
      "Configure datasets, dimensions and a report layout before scheduling delivery.",
    parent: { label: "Performance Reports", href: "/workspace/reports" },
    actions: [
      link("Back to reports", "/workspace/reports"),
      link("Save Report", undefined, true),
    ],
    tabs: ["Report Definition", "Preview", "Delivery Schedule"],
    sections: [
      fields(
        "Report Definition & Scope",
        [
          input("Report name", "SLA Performance by Tier-1 Service"),
          select("Dataset", [
            "Ticket resolution cycles",
            "Ticket volume",
            "Requester feedback",
          ]),
          select("Date range", [
            "Last 30 days",
            "Last quarter",
            "Custom period",
          ]),
          select("Team scope", [
            "All teams",
            "Network Operations",
            "Workplace IT",
          ]),
        ],
        "Report Definition",
      ),
      checklist(
        "Metric Aggregation",
        [
          { title: "Ticket volume", done: true },
          { title: "Resolution SLA attainment", done: true },
          { title: "Mean resolution time", done: true },
          { title: "Requester CSAT", done: false },
        ],
        "Report Definition",
      ),
      fields(
        "Dimensions & Ordering",
        [
          select("Group by", ["Service", "Team", "Priority"]),
          select("Sort by", [
            "Resolution SLA attainment",
            "Ticket volume",
            "Mean duration",
          ]),
          select("Visualization", ["Bar chart", "Table", "Line chart"]),
        ],
        "Report Definition",
      ),
      table(
        "Tabular Drilldown Preview",
        ["Service", "Cycles", "SLA met", "Mean resolution", "CSAT"],
        [
          row(["Corporate VPN", "42", "92.8%", "3.8h", "4.6"]),
          row(["Email & Collaboration", "38", "97.3%", "2.1h", "4.8"]),
          row(["Workplace IT", "46", "98.0%", "4.4h", "4.7"]),
        ],
        "Preview",
      ),
      fields(
        "Automated Delivery Schedule",
        [
          select("Frequency", ["Weekly", "Monthly", "Paused"]),
          select("Day", ["Monday", "Tuesday", "Friday"]),
          input("Time (UTC)", "08:00"),
          input("Authorized recipients", "service-leads@example.com"),
          select("Format", ["PDF summary", "CSV attachment"]),
          input("Access expiry", "7 days"),
        ],
        "Delivery Schedule",
      ),
      text(
        "Recipient Access Review",
        [
          "Recipients must have permission to view the report’s underlying scope. Delivery and export execution will be added later.",
        ],
        undefined,
        "Delivery Schedule",
      ),
    ],
    aside: [
      cards("Saved Reports", [
        {
          title: "Weekly service health",
          text: "Service volume and SLA overview.",
          href: "/workspace/reports",
        },
        {
          title: "Requester satisfaction",
          text: "Resolution feedback and response rates.",
          href: "/workspace/reports?tab=Satisfaction",
        },
      ]),
      text("Preview Dataset", [
        "All chart and table values are illustrative. Saving and scheduled delivery are not connected.",
      ]),
    ],
  },
];
