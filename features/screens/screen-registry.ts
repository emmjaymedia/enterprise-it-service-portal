import type { ScreenSpec } from "./screen-types";
import { workspaceScreens } from "./workspace-screens";
import { operationsScreens } from "./operations-screens";
import { adminScreens } from "./admin-screens";
import { portalScreens } from "./portal-screens";
import {
  cards,
  text,
  fields,
  input,
  select,
  table,
  row,
  link,
  checklist,
  timeline,
} from "./screen-builders";
const designScreens: ScreenSpec[] = [
  {
    id: "DS01",
    path: "/design-system",
    area: "design",
    eyebrow: "DESIGN FOUNDATIONS",
    title: "ServiceDesk UI Kit & Design System",
    description:
      "Shared colors, typography, form controls and record patterns used across the portal.",
    actions: [
      link("Screen Directory", "/screens"),
      link("Interface States", "/design-system/states"),
    ],
    tabs: ["Foundations", "Components", "Record Patterns"],
    sections: [
      {
        kind: "tokens",
        title: "Design Tokens & Chromatic Palette",
        tab: "Foundations",
      },
      text(
        "Typography Scale",
        [
          "Display · ServiceDesk Enterprise",
          "Heading · Clear service ownership",
          "Body · Readable instructions and operational context.",
          "Caption · Supplemental timestamps and metadata.",
        ],
        undefined,
        "Foundations",
      ),
      fields(
        "Form Controls",
        [
          input("Short text", "Example ticket subject"),
          select("Single choice", ["Network Operations", "Workplace IT"]),
          {
            label: "Description",
            type: "textarea",
            value: "Describe the issue and its impact.",
            span: true,
          },
        ],
        "Components",
      ),
      text(
        "Button Primitives",
        [
          "Primary actions lead a workflow; secondary actions support review and navigation.",
        ],
        [
          link("Primary Action", undefined, true),
          link("Secondary Action"),
          link("Navigate to Tickets", "/workspace/tickets"),
        ],
        "Components",
      ),
      table(
        "Priority & Status Specimens",
        ["Ticket", "Priority", "State", "Service target"],
        [
          row(
            ["INC-1044", "P1 Critical", "Open", "Breached"],
            "/workspace/tickets/INC-1044",
          ),
          row(
            ["INC-1042", "P2 High", "In progress", "Due soon"],
            "/workspace/tickets/INC-1042",
          ),
          row(
            ["REQ-2079", "P3 Medium", "Approved", "On track"],
            "/workspace/requests/REQ-2079",
          ),
        ],
        "Record Patterns",
      ),
      checklist(
        "Task & Progress Specimens",
        [
          {
            title: "Completed task",
            done: true,
            text: "Visible completion state",
          },
          {
            title: "Pending task",
            done: false,
            text: "Dependency or owner context",
          },
        ],
        "Record Patterns",
      ),
    ],
    aside: [
      text("Interface Principles", [
        "Visible ownership, clear next actions and consistent record states.",
        "Public and internal content use distinct labeling. Keyboard focus remains visible.",
      ]),
    ],
  },
  {
    id: "S03",
    path: "/design-system/states",
    area: "design",
    eyebrow: "INTERFACE STATES",
    title: "Interactive Edge & Access States",
    description: "Empty, loading, unavailable and restricted state layouts.",
    actions: [
      link("System States", "/system-states"),
      link("Design System", "/design-system"),
    ],
    tabs: ["Empty & Loading", "Errors & Access", "Recovery"],
    sections: [
      cards(
        "Empty State Patterns",
        [
          {
            title: "All Caught Up!",
            text: "There are no tickets assigned to you. Review your team queue or return to the overview.",
            href: "/workspace/tickets",
          },
          {
            title: "No Search Results",
            text: "Try another phrase or clear the selected filters.",
            href: "/search",
          },
        ],
        "Empty & Loading",
      ),
      text(
        "Loading State",
        [
          "Loading your workspace…",
          "A loading region retains the page structure and announces progress without implying that an action succeeded.",
        ],
        undefined,
        "Empty & Loading",
      ),
      cards(
        "Access & System Templates",
        [
          {
            title: "Access Restricted",
            text: "You do not have access to this record.",
            href: "/403",
          },
          {
            title: "Record Not Found",
            text: "The requested record is unavailable.",
            href: "/404",
          },
          {
            title: "Maintenance",
            text: "A scheduled service window is in progress.",
            href: "/maintenance",
          },
          {
            title: "Offline",
            text: "Connection guidance and safe recovery.",
            href: "/offline",
          },
        ],
        "Errors & Access",
      ),
      text(
        "Recover Without Losing Context",
        [
          "Retry failed operations while preserving entered text. Reauthentication should return to the intended record after identity is verified.",
        ],
        [
          link("Session Expired", "/session-expired"),
          link("Sign In", "/login"),
        ],
        "Recovery",
      ),
    ],
    aside: [
      text("State Guidance", [
        "Use concise recovery instructions. Avoid exposing restricted record details.",
        "These are navigable screen previews; enforcement will be added with the underlying features.",
      ]),
    ],
  },
];
export const previewScreens = [
  ...workspaceScreens,
  ...operationsScreens,
  ...adminScreens,
  ...portalScreens,
  ...designScreens,
];
const aliases: Record<
  string,
  {
    base: string;
    title: string;
    description: string;
    fields?: Record<string, string>;
    status?: string;
  }
> = {
  "/workspace/major-incidents/MIM-002": {
    base: "W13",
    title: "Global Payroll & Time Tracking Database Locking Outage",
    description:
      "MIM-002 · Payroll & HRIS · Recovery complete · Post-incident review scheduled",
    status: "Under review",
  },
  "/workspace/major-incidents/MIM-003": {
    base: "W13",
    title: "Cloud API Gateway Interruption",
    description:
      "MIM-003 · Cloud services · Restored 18 Oct 2026 · Review completed",
    status: "Completed",
  },
  "/workspace/problems/PRB-032": {
    base: "P02",
    title: "PRB-032 — Payroll database locking contention",
    description: "Payroll & HRIS · Owner: Daniel Cole · Root cause identified",
    fields: {
      "Contributing factors":
        "Long-running payroll transactions caused lock contention during the reporting window.",
      Evidence:
        "Transaction logs and reporting-query traces are retained with the investigation.",
      "Permanent remediation":
        "Review indexing, transaction boundaries and scheduled reporting workloads.",
    },
  },
  "/workspace/problems/PRB-033": {
    base: "P02",
    title: "PRB-033 — Intermittent laptop battery degradation",
    description: "Workplace IT · Owner: Rashid Khan · Known error",
    fields: {
      "Contributing factors":
        "Aging endpoint batteries and legacy power profiles.",
      Evidence: "Device health reports show degraded battery capacity.",
      "Permanent remediation":
        "Apply the approved power profile and replace eligible batteries.",
    },
  },
  "/workspace/problems/PRB-029": {
    base: "P02",
    title: "PRB-029 — Repeated Outlook sign-in prompts",
    description:
      "Email & Collaboration · Resolved 18 Oct 2026 · Token-cache guidance published",
    status: "Resolved",
  },
  "/workspace/changes/CHG-088": {
    base: "C03",
    title: "CHG-088 — Workday Q4 tax engine database migration",
    description:
      "Payroll & HRIS · Normal change · Scheduled 24 Oct, 22:00–23:30 UTC",
    status: "Scheduled",
  },
  "/workspace/changes/CHG-089": {
    base: "C03",
    title: "CHG-089 — Windows endpoint baseline refresh",
    description: "Workplace IT · Standard change · CAB review pending",
    status: "Pending approval",
  },
  "/workspace/changes/CHG-084": {
    base: "C03",
    title: "CHG-084 — Collaboration service token-cache update",
    description:
      "Email & Collaboration · Completed · Post-implementation review closed",
    status: "Completed",
  },
  "/workspace/assets/AST-00418": {
    base: "I02",
    title: "AST-00418 — MacBook Pro 16-inch",
    description:
      "Reserved for Samuel Reed · London Depot · Hardware refresh allocation",
    fields: {
      "Manufacturer & model": "Apple MacBook Pro 16-inch",
      "Serial number": "MBP16-00418",
      Processor: "Apple Silicon",
      "Operating system": "macOS Sonoma",
      "Assigned location": "London Depot",
    },
  },
  "/workspace/assets/AST-00502": {
    base: "I02",
    title: "AST-00502 — Dell UltraSharp 27-inch Monitor",
    description: "Assigned to Amina Yusuf · London · USB-C workplace display",
    fields: {
      "Manufacturer & model": "Dell UltraSharp 27-inch",
      "Serial number": "DU27-00502",
      Processor: "Not applicable",
      "Memory / storage": "Not applicable",
      "Operating system": "Monitor firmware",
      "Assigned location": "London office",
    },
  },
  "/workspace/requests/REQ-2081": {
    base: "W15",
    title: "Financial Analytics Data Warehouse Access",
    description:
      "REQ-2081 · Layla Ahmed · Manager and data-owner approval · Fulfillment blocked",
    status: "Pending approval",
    fields: {
      Requester: "Layla Ahmed",
      "Cost center": "CC-510 · Internal Audit",
      Configuration: "Read-only analyst · PII masked · 30 days",
      "Approved cost": "$450 / year",
    },
  },
  "/workspace/requests/REQ-2077": {
    base: "W15",
    title: "Figma Enterprise Design Seat",
    description:
      "REQ-2077 · Amina Yusuf · Approved · Awaiting license provisioning",
    status: "Ready to fulfill",
    fields: {
      Requester: "Amina Yusuf",
      "Cost center": "CC-410 · Global Sales",
      Configuration: "Enterprise design seat",
      "Approved cost": "$240 / year",
    },
  },
  "/workspace/requests/REQ-2060": {
    base: "W15",
    title: "Replacement Power Adapter",
    description:
      "REQ-2060 · Amina Yusuf · Fulfilled 19 Oct 2026 · Receipt acknowledged",
    status: "Completed",
    fields: {
      Requester: "Amina Yusuf",
      Configuration: "Standard USB-C power adapter",
      "Approved cost": "$65.00 USD",
    },
  },
  "/workspace/knowledge/KB-4029/edit": {
    base: "K02",
    title: "Editing: KB-4029 — Troubleshoot your VPN connection",
    description: "Published v3.2 · Employee audience · Owner: Daniel Cole",
    fields: {
      Title: "Troubleshoot your VPN connection",
      Category: "Network & Access",
      Audience: "Employees",
      "Scope and trigger criteria":
        "Employee guidance for diagnosing VPN connection errors. Avoid changing managed security settings.",
    },
  },
  "/workspace/knowledge/KB-4032/edit": {
    base: "K02",
    title: "Editing: KB-4032 — Resolve Outlook repeated sign-in prompts",
    description: "Draft v1.0 · Employee audience · Owner: Maya Lee",
    fields: {
      Title: "Resolve Outlook repeated sign-in prompts",
      Category: "Identity & SSO",
      Audience: "Employees",
      "Scope and trigger criteria":
        "Review repeated sign-in prompts for approved organization accounts.",
    },
  },
  "/workspace/knowledge/new/edit": {
    base: "K02",
    title: "Create Knowledge Article",
    description: "New draft · Define audience, ownership and review scope",
    fields: {
      Title: "",
      Keywords: "",
      "Scope and trigger criteria": "",
      "Cluster failover sequence": "",
      "Post-switchover communication": "",
    },
  },
};
export function findScreen(path: string): ScreenSpec | undefined {
  const direct = previewScreens.find((screen) => screen.path === path);
  if (direct) return direct;
  const ticketPanel = path.match(
    /^\/workspace\/tickets\/(INC-(?:1042|1044|11(?:0[2-9]|[1-3][0-9]|4[01])))\/(tasks|related)$/,
  );
  if (ticketPanel) {
    const base = previewScreens.find(
      (screen) => screen.id === (ticketPanel[2] === "tasks" ? "W10" : "W09"),
    )!;
    return JSON.parse(
      JSON.stringify(base).replaceAll("INC-1042", ticketPanel[1]),
    ) as ScreenSpec;
  }
  const alias = aliases[path];
  if (!alias) return;
  const base = previewScreens.find((screen) => screen.id === alias.base)!;
  const spec: ScreenSpec = JSON.parse(JSON.stringify(base));
  spec.path = path;
  spec.title = alias.title;
  spec.description = alias.description;
  // Alternate sample records use their own context instead of borrowing the primary record's history.
  if (path.includes("/major-incidents/")) {
    spec.darkHero = alias.status !== "Completed";
    spec.metrics = [
      {
        label: "Incident state",
        value: alias.status!,
        note: alias.description,
      },
      {
        label: "Service restoration",
        value: "Restored",
        note: "Review evidence retained",
      },
    ];
    spec.sections = [
      {
        kind: "timeline",
        title: "Incident Chronology",
        tab: "Command Center",
        items: [
          {
            title: "Service restored",
            text: "Responders validated normal operation and notified the service owner.",
          },
          {
            title: "Recovery completed",
            text: "The affected service returned to its expected operating state.",
          },
        ],
      },
      {
        kind: "table",
        title: "Linked Tickets",
        tab: "Linked Tickets",
        columns: ["Context", "State"],
        rows: [
          row(["Affected ticket cohort", "Retained for post-incident review"]),
        ],
      },
      {
        kind: "text",
        title: "Post-Incident Review",
        tab: "Review",
        paragraphs: [
          alias.description,
          "Follow-up actions and review evidence are retained with the incident.",
        ],
      },
    ];
    spec.aside = [text("Incident Ownership", [alias.description])];
  }
  if (path.includes("/problems/")) {
    spec.sections = spec.sections.map((section) =>
      section.kind === "text"
        ? {
            ...section,
            paragraphs: [
              alias.title,
              alias.description,
              "Review the evidence and approved workaround for this sample investigation.",
            ],
            links: undefined,
          }
        : section.kind === "timeline"
          ? timeline(
              "Investigation Timeline",
              [
                {
                  title: "Investigation context reviewed",
                  text: alias.description,
                },
              ],
              section.tab,
            )
          : section.kind === "table"
            ? table(
                "Linked Incident Context",
                ["Service context", "State"],
                [row([alias.description, alias.status ?? "Investigating"])],
                section.tab,
              )
            : section,
    );
    spec.aside = [text("Investigation Ownership", [alias.description])];
  }
  if (path.includes("/changes/")) {
    spec.metrics = [
      { label: "Change state", value: alias.status!, note: alias.description },
      {
        label: "Risk review",
        value: "Required",
        note: "Service-owner validation",
      },
    ];
    spec.sections = spec.sections.map((section) =>
      section.kind === "checklist"
        ? checklist(
            "Execution Checklist",
            [
              {
                title: "Confirm authorization and service-owner readiness",
                done: alias.status === "Completed",
              },
              {
                title: "Execute the approved service change",
                done: alias.status === "Completed",
              },
              {
                title: "Record validation and review evidence",
                done: alias.status === "Completed",
              },
            ],
            section.tab,
          )
        : section.kind === "text"
          ? {
              ...section,
              paragraphs: [
                alias.title,
                alias.description,
                "Implementation and rollback evidence must be reviewed before the service window.",
              ],
            }
          : section.kind === "code"
            ? {
                ...section,
                paragraphs: [
                  "[preview] Execution output appears here after implementation is connected.",
                ],
              }
            : section.kind === "timeline"
              ? timeline(
                  "Review History",
                  [{ title: alias.status!, text: alias.description }],
                  section.tab,
                )
              : section,
    );
    spec.aside = [text("Change Context", [alias.description])];
  }
  if (path.includes("/assets/")) {
    spec.sections = spec.sections.map((section) =>
      section.kind === "timeline"
        ? timeline(
            "Custody History",
            [{ title: "Asset registered", text: alias.description }],
            section.tab,
          )
        : section.kind === "table"
          ? table(
              section.title,
              ["Context", "State"],
              [row([alias.description, "Sample record"])],
              section.tab,
            )
          : section,
    );
    spec.aside = [
      text("Asset Context", [alias.description]),
      text("Lifecycle", [
        path.includes("00418")
          ? "Reserved for hardware refresh fulfillment"
          : "Assigned to Amina Yusuf",
      ]),
    ];
  }
  if (path.includes("/requests/")) {
    spec.sections = spec.sections.map((section) =>
      section.kind === "checklist"
        ? checklist(
            "Fulfillment Checklist",
            [
              {
                title: "Validate required approvals",
                done: alias.status !== "Pending approval",
              },
              {
                title: "Provision the requested service",
                done: alias.status === "Completed",
              },
              {
                title: "Validate delivery with requester",
                done: alias.status === "Completed",
              },
            ],
            section.tab,
          )
        : section.kind === "timeline"
          ? timeline(
              section.title,
              [{ title: alias.status!, text: alias.description }],
              section.tab,
            )
          : section.kind === "table"
            ? table(
                "Submitted Request Snapshot",
                ["Question", "Answer"],
                [
                  row(["Requested service", alias.title]),
                  row(["Cost", alias.fields?.["Approved cost"] ?? "—"]),
                  row(["State", alias.status!]),
                ],
                section.tab,
              )
            : section,
    );
    spec.aside = [
      text("Request Context", [alias.description]),
      text("Service Definition", [
        "The submitted catalog version and required approvals remain attached to this request.",
      ]),
    ];
  }
  if (path.includes("/knowledge/")) {
    spec.sections = spec.sections.map((section) =>
      section.kind === "fields"
        ? section
        : section.kind === "timeline"
          ? timeline(
              "Version History",
              [{ title: "Current article version", text: alias.description }],
              section.tab,
            )
          : {
              ...section,
              paragraphs: [
                alias.title,
                alias.description,
                "Review the article body, audience and supporting instructions before publication.",
              ],
            },
    );
    spec.aside = [
      text("Article Governance", [
        alias.description,
        "Publication requires the appropriate content review.",
      ]),
    ];
  }
  const updateFields = (sections: ScreenSpec["sections"]) =>
    sections.map((section) => ({
      ...section,
      fields: section.fields?.map((field) =>
        alias.fields && field.label in alias.fields
          ? { ...field, value: alias.fields[field.label] }
          : field,
      ),
    }));
  spec.sections = updateFields(spec.sections);
  if (spec.aside) spec.aside = updateFields(spec.aside);
  return spec;
}
const existing = [
  ["A01", "Sign In", "/login"],
  ["A02", "Password Recovery", "/password/reset"],
  ["A03", "MFA Challenge", "/verify"],
  ["E01", "Employee Home", "/portal"],
  ["E02", "Report an Issue", "/portal/tickets/new"],
  ["E03", "Submission Confirmation", "/portal/tickets/confirmation/INC-1042"],
  ["E04", "My Tickets", "/portal/tickets"],
  ["E05", "Employee Ticket Detail", "/portal/tickets/INC-1042"],
  ["E11", "Approvals Inbox", "/portal/approvals"],
  ["E12", "Approval Decision", "/portal/approvals/REQ-2081"],
  ["E14", "Notifications", "/notifications"],
  ["E15", "Profile & Preferences", "/profile"],
  ["E16", "Resolution Feedback", "/portal/tickets/REQ-1039/feedback"],
  ["W01", "Operations Dashboard", "/workspace"],
  ["W02", "Ticket Queue", "/workspace/tickets"],
  ["W03", "Agent Ticket Detail", "/workspace/tickets/INC-1042"],
  ["W05", "Triage Preview Drawer", "/workspace/tickets?preview=INC-1042"],
  ["W07", "Resolve Ticket Dialog", "/workspace/tickets/INC-1042#resolve"],
  [
    "W08",
    "Escalate or Transfer Dialog",
    "/workspace/tickets/INC-1042#escalate",
  ],
  ["S01", "Global Search", "/search"],
  ["S02", "System & Access States", "/system-states"],
];
export const screenDirectory = [
  ...existing.map(([id, title, path]) => ({ id, title, path })),
  ...previewScreens
    .filter(
      (screen, index, all) =>
        all.findIndex((other) => other.id === screen.id) === index,
    )
    .map(({ id, title, path }) => ({ id, title, path })),
].sort((a, b) => a.id.localeCompare(b.id));
export const directorySpec: ScreenSpec = {
  id: "DIRECTORY",
  path: "/screens",
  area: "design",
  eyebrow: "APPLICATION PAGES",
  title: "Screen Directory",
  description:
    "Browse every service desk screen. Existing workflows remain available; new screens use sample content for visual review.",
  actions: [
    link("Operations Dashboard", "/workspace"),
    link("Employee Portal", "/portal"),
    link("Design System", "/design-system"),
  ],
  tabs: [
    "All Screens",
    "Employee Portal",
    "Support Workspace",
    "Administration",
    "Access & Shared",
  ],
  sections: [
    table(
      "All Application Screens",
      ["Screen", "Title", "Route"],
      screenDirectory.map((screen) =>
        row([screen.id, screen.title, screen.path], screen.path),
      ),
      "All Screens",
    ),
    ...[
      ["Employee Portal", /^E/],
      ["Support Workspace", /^(W|C|P|I|K|R)/],
      ["Administration", /^D[0-9]/],
      ["Access & Shared", /^(A|S|DS)/],
    ].map(([tab, pattern]) =>
      table(
        String(tab),
        ["Screen", "Title", "Route"],
        screenDirectory
          .filter((screen) => (pattern as RegExp).test(screen.id))
          .map((screen) =>
            row([screen.id, screen.title, screen.path], screen.path),
          ),
        String(tab),
      ),
    ),
  ],
};
