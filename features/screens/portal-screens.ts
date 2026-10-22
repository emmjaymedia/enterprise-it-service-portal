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
const scope = { area: "portal", eyebrow: "EMPLOYEE SELF-SERVICE" } as const;
export const catalogItems = [
  {
    slug: "macbook-refresh",
    title: "MacBook Pro 16-inch Hardware Refresh",
    description:
      "Replacement Apple Silicon laptop for eligible workplace refreshes.",
    category: "Hardware & Devices",
    cost: "$3,499",
    time: "3–5 business days",
    icon: "box" as const,
  },
  {
    slug: "financial-warehouse",
    title: "Financial Analytics Data Warehouse Access",
    description:
      "Read-only Snowflake access with PII masking and data-owner approval.",
    category: "Access & Permissions",
    cost: "$450 / year",
    time: "4 business hours after approval",
    icon: "settings" as const,
  },
  {
    slug: "figma-seat",
    title: "Figma Enterprise Design Seat",
    description:
      "Collaborate with your team using the approved enterprise design workspace.",
    category: "Software & SaaS",
    cost: "$240 / year",
    time: "1 business day",
    icon: "book" as const,
  },
  {
    slug: "home-office",
    title: "Standard Home Office Ergonomic Bundle",
    description:
      "Approved monitor, keyboard and ergonomic accessories for remote work.",
    category: "Hardware & Devices",
    cost: "$640",
    time: "5 business days",
    icon: "box" as const,
  },
  {
    slug: "cloud-sandbox",
    title: "Cloud Sandbox / Development Environment",
    description:
      "An isolated development environment with cost controls and team ownership.",
    category: "Cloud Infrastructure",
    cost: "$300 / month",
    time: "2 business days",
    icon: "settings" as const,
  },
  {
    slug: "bastion-access",
    title: "Temporary Bastion / SSH Elevation Access",
    description:
      "Time-limited production access with security review and an approved change.",
    category: "Access & Permissions",
    cost: "No additional charge",
    time: "After security approval",
    icon: "settings" as const,
  },
];
export const knowledgeArticles = [
  {
    slug: "vpn-connection",
    id: "KB-4029",
    title: "Troubleshoot your VPN connection",
    category: "Network & Access",
    text: "Diagnose connection timeouts, handshake failures and cached authentication state.",
    time: "4 min read",
  },
  {
    slug: "outlook-sign-in",
    id: "KB-4032",
    title: "Resolve Outlook repeated sign-in prompts",
    category: "Software & SaaS",
    text: "Review cached sessions and restore your approved organization account.",
    time: "5 min read",
  },
  {
    slug: "mfa-setup",
    id: "KB-4030",
    title: "Set up your authenticator on a new device",
    category: "Identity & SSO",
    text: "Register a replacement device while retaining a verified recovery path.",
    time: "3 min read",
  },
  {
    slug: "snowflake-access",
    id: "KB-4033",
    title: "Snowflake access roles and entitlement requests",
    category: "Access & Permissions",
    text: "Choose the least-privilege role and prepare your manager’s approval request.",
    time: "6 min read",
  },
];
export const portalScreens: ScreenSpec[] = [
  {
    ...scope,
    id: "E06",
    path: "/portal/catalog",
    title: "Enterprise Service Catalog",
    description:
      "Request approved hardware, software and access for your work.",
    actions: [link("My requests", "/portal/tickets")],
    tabs: [
      "All Services",
      "Hardware & Devices",
      "Software & SaaS",
      "Access & Permissions",
      "Cloud Infrastructure",
    ],
    sections: [
      cards(
        "Available Services",
        catalogItems.map((i) => ({
          title: i.title,
          text: i.description,
          meta: `${i.cost} · ${i.time}`,
          badge: i.category,
          href: `/portal/catalog/${i.slug}`,
          icon: i.icon,
        })),
        "All Services",
      ),
      ...[
        "Hardware & Devices",
        "Software & SaaS",
        "Access & Permissions",
        "Cloud Infrastructure",
      ].map((category) =>
        cards(
          category,
          catalogItems
            .filter((i) => i.category === category)
            .map((i) => ({
              title: i.title,
              text: i.description,
              meta: `${i.cost} · ${i.time}`,
              badge: "Approval required",
              href: `/portal/catalog/${i.slug}`,
              icon: i.icon,
            })),
          category,
        ),
      ),
    ],
    aside: [
      text("Request Guidance", [
        "Select a service to review eligibility, estimated cost and approval requirements.",
        "Your request will retain the service’s submitted definition and price.",
      ]),
      text(
        "Need Help Instead?",
        [
          "Report an incident if something you already use has stopped working.",
        ],
        [link("Report an Issue", "/portal/tickets/new")],
      ),
    ],
  },
  ...catalogItems.map((item): ScreenSpec => ({
    ...scope,
    id: "E07",
    path: `/portal/catalog/${item.slug}`,
    title: item.title,
    description: item.description,
    parent: { label: "Service Catalog", href: "/portal/catalog" },
    actions: [
      link("Back to catalog", "/portal/catalog"),
      link("Review Request", undefined, true),
    ],
    tabs: ["Request Form", "Service Details"],
    sections: [
      fields(
        "Request Details",
        [
          input("Requester", "Amina Yusuf"),
          input("Department", "Global Sales"),
          select("Location", ["London", "Dublin", "Remote"]),
          input("Cost center", "CC-410"),
          ...(item.category === "Hardware & Devices"
            ? [
                select("Configuration", [
                  "Standard workplace configuration",
                  "Enhanced configuration",
                ]),
                input("Current asset", "AST-00321"),
              ]
            : [
                select("Requested role", [
                  "Standard user",
                  "Read-only analyst",
                  "Time-limited elevated access",
                ]),
                input("Duration", "30 days"),
              ]),
          textarea(
            "Business justification",
            "Explain the business need and intended use.",
          ),
        ],
        "Request Form",
      ),
      text(
        "Eligibility & Cost",
        [
          "Available to eligible employees with manager authorization.",
          `Estimated cost: ${item.cost}.`,
          `Estimated fulfillment: ${item.time}.`,
        ],
        undefined,
        "Service Details",
      ),
      text(
        "Request Conditions",
        [
          "Requests are reviewed by the relevant service owner. Changes to scope or cost may require renewed approval.",
          "Submitted answers and catalog version remain attached to the request.",
        ],
        undefined,
        "Service Details",
      ),
    ],
    aside: [
      text("Service Expectations", [
        item.time,
        `Cost estimate: ${item.cost}`,
        "Catalog definition: v3.2",
      ]),
      {
        kind: "workflow",
        title: "Approval Workflow Preview",
        items: [
          { title: "1 · Department manager", text: "Business need and budget" },
          { title: "2 · Service owner", text: "Eligibility and access scope" },
          {
            title: "3 · Fulfillment team",
            text: "Provisioning after approval",
          },
        ],
      },
    ],
  })),
  {
    ...scope,
    id: "E08",
    path: "/portal/knowledge",
    title: "Knowledge Base & Self-Service Guides",
    description: "Find approved guidance for common workplace issues.",
    actions: [link("Report an Issue", "/portal/tickets/new")],
    tabs: [
      "All Guides",
      "Network & Access",
      "Identity & SSO",
      "Software & SaaS",
      "Access & Permissions",
    ],
    sections: [
      cards(
        "Featured & Trending Solutions",
        knowledgeArticles.map((a) => ({
          title: a.title,
          text: a.text,
          meta: `${a.id} · ${a.time}`,
          badge: a.category,
          href: `/portal/knowledge/${a.slug}`,
          icon: "book",
        })),
        "All Guides",
      ),
      ...[
        "Network & Access",
        "Identity & SSO",
        "Software & SaaS",
        "Access & Permissions",
      ].map((category) =>
        cards(
          category,
          knowledgeArticles
            .filter((a) => a.category === category)
            .map((a) => ({
              title: a.title,
              text: a.text,
              meta: a.time,
              href: `/portal/knowledge/${a.slug}`,
              icon: "book",
            })),
          category,
        ),
      ),
    ],
    aside: [
      cards("Browse Topics", [
        {
          title: "Network & Access",
          text: "VPN and remote connection help.",
          href: "/portal/knowledge?tab=Network%20%26%20Access",
        },
        {
          title: "Identity & SSO",
          text: "Authenticator and account guidance.",
          href: "/portal/knowledge?tab=Identity%20%26%20SSO",
        },
      ]),
      text(
        "Couldn’t Find What You Need?",
        [
          "IT Support can help with issues that are not covered by a published guide.",
        ],
        [link("Contact IT Support", "/portal/tickets/new")],
      ),
    ],
  },
  ...knowledgeArticles.map((article): ScreenSpec => ({
    ...scope,
    id: "E09",
    path: `/portal/knowledge/${article.slug}`,
    title: article.title,
    description: `${article.id} · ${article.category} · Updated 21 Oct 2026 · ${article.time}`,
    parent: { label: "Knowledge Base", href: "/portal/knowledge" },
    actions: [link("Report Related Issue", "/portal/tickets/new")],
    sections: [
      text("Before You Start", [
        article.text,
        "Keep your organization’s approved tools available. Do not share passwords, recovery codes or private account information.",
      ]),
      checklist(
        "Quick Diagnostic Checklist",
        article.slug === "vpn-connection"
          ? [
              {
                title: "Verify your internet connection",
                text: "Confirm that other organization services are reachable.",
              },
              {
                title: "Check the current service status",
                text: "A known outage may explain the issue.",
                href: "/portal/status",
              },
              {
                title: "Record the exact error message",
                text: "Include it in your report if you need further help.",
              },
            ]
          : [
              {
                title: "Check your account and device details",
                text: "Confirm that you are using the intended organization account.",
              },
              {
                title: "Review current service status",
                text: "Known interruptions may affect sign-in.",
                href: "/portal/status",
              },
              {
                title: "Prepare your recovery path",
                text: "Keep an approved alternate method available.",
              },
            ],
      ),
      text(
        "Step-by-Step Guidance",
        article.slug === "vpn-connection"
          ? [
              "1. Close duplicate VPN clients and confirm that your internet connection is stable.",
              "2. Open the organization-approved VPN client and choose the correct regional gateway.",
              "3. Sign in using your organization account and follow the normal authenticator prompt.",
              "4. If a timeout or handshake failure persists, record the error and contact IT Support. Avoid changing certificate or security settings without approved guidance.",
            ]
          : [
              "1. Open the organization-approved application or account settings.",
              "2. Confirm the correct organization account and review the sign-in prompt.",
              "3. Follow the approved device-registration or account-recovery procedure.",
              "4. If the problem persists, contact IT Support with the time, device and error message.",
            ],
      ),
      text(
        "Was This Article Helpful?",
        ["Tell us whether these instructions helped resolve your issue."],
        [link("Yes, Helpful"), link("Needs Improvement")],
      ),
    ],
    aside: [
      text("In This Article", [
        "Before you start",
        "Quick diagnostic checklist",
        "Step-by-step guidance",
        "Further help",
      ]),
      cards(
        "Related Guides",
        knowledgeArticles
          .filter((a) => a.slug !== article.slug)
          .slice(0, 2)
          .map((a) => ({
            title: a.title,
            text: a.text,
            href: `/portal/knowledge/${a.slug}`,
            icon: "book",
          })),
      ),
      text(
        "Still Need Help?",
        [
          "Include the article number in your issue report so IT Support can see what you already tried.",
        ],
        [link("Report an Issue", "/portal/tickets/new")],
      ),
    ],
  })),
  {
    ...scope,
    id: "E10",
    path: "/portal/assets",
    title: "My Assigned Hardware & Workplace Assets",
    description:
      "Review your assigned devices, accessories and software seats.",
    actions: [
      link("Request Equipment", "/portal/catalog"),
      link("Report Hardware Issue", "/portal/tickets/new", true),
    ],
    metrics: [
      { label: "Active hardware", value: "2", note: "Laptop and monitor" },
      {
        label: "Security compliance",
        value: "100%",
        note: "Illustrative endpoint state",
      },
      {
        label: "Next refresh",
        value: "2027",
        note: "Subject to eligibility review",
      },
    ],
    tabs: ["Hardware", "Software Entitlements", "Custody History"],
    sections: [
      cards(
        "Assigned Hardware",
        [
          {
            title: "Dell Latitude 7440",
            text: "AST-00321 · Windows 11 Enterprise · 32GB RAM / 1TB SSD",
            badge: "Assigned · Compliant",
            meta: "Assigned 15 Jan 2025 · Warranty July 2027",
            icon: "box",
            href: "/portal/tickets/new",
          },
          {
            title: "Dell UltraSharp 27-inch 4K USB-C Monitor",
            text: "AST-00502 · London office workstation",
            badge: "Assigned",
            meta: "Assigned 15 Jan 2025 · Warranty May 2027",
            icon: "box",
            href: "/portal/tickets/new",
          },
        ],
        "Hardware",
      ),
      table(
        "Assigned Enterprise Software",
        ["Application", "License", "Status", "Renewal"],
        [
          row([
            "Microsoft 365",
            "Enterprise E5",
            "Active",
            "Organization-managed",
          ]),
          row(["Figma", "Enterprise design seat", "Active", "October 2027"]),
          row([
            "Corporate VPN",
            "Employee access",
            "Active",
            "Organization-managed",
          ]),
        ],
        "Software Entitlements",
      ),
      timeline(
        "Equipment Custody Log",
        [
          {
            title: "Laptop and monitor received",
            text: "Acknowledgment recorded for the London office allocation.",
            meta: "15 Jan 2025",
          },
          {
            title: "Previous laptop returned",
            text: "Workplace IT completed the return inspection.",
            meta: "15 Jan 2025",
          },
        ],
        "Custody History",
      ),
    ],
    aside: [
      text(
        "Lost or Stolen Equipment?",
        [
          "Contact IT Support immediately if an assigned device is lost or stolen. Include the asset tag when available.",
        ],
        [link("Report an Issue", "/portal/tickets/new")],
      ),
      text("Hardware Lifecycle & Refresh", [
        "Device refresh eligibility depends on asset age, health and your workplace policy.",
        "Request replacement hardware through the service catalog.",
      ]),
    ],
  },
  {
    ...scope,
    id: "E13",
    path: "/portal/status",
    title: "Core Infrastructure Health",
    description:
      "Service availability, active interruptions and planned maintenance updates.",
    actions: [link("Report a Service Issue", "/portal/tickets/new")],
    metrics: [
      {
        label: "Platform availability",
        value: "99.88%",
        note: "Illustrative 90-day sample",
      },
      { label: "Users affected", value: "1,420", note: "EMEA remote access" },
      {
        label: "Active interruptions",
        value: "1",
        note: "Corporate VPN degradation",
        tone: "warning",
      },
    ],
    tabs: ["Current Status", "Maintenance", "Incident Updates"],
    sections: [
      text(
        "Corporate VPN & Remote Access Degradation",
        [
          "Some EMEA users may experience authentication timeouts or increased gateway latency.",
          "Network Operations is routing affected sessions through the secondary gateway. Next update: 14:30 UTC.",
        ],
        undefined,
        "Current Status",
      ),
      cards(
        "Business System Availability",
        [
          {
            title: "Corporate VPN & Gateway Access",
            text: "Frankfurt / Dublin gateways · Monitoring mitigation",
            badge: "Degraded",
            icon: "alert",
          },
          {
            title: "Email & Collaboration",
            text: "Exchange, Teams and collaboration tools",
            badge: "Operational",
            icon: "settings",
          },
          {
            title: "Identity & Single Sign-On",
            text: "Organization sign-in and authenticator services",
            badge: "Operational",
            icon: "settings",
          },
          {
            title: "Payroll & HRIS",
            text: "Payroll and employee management",
            badge: "Operational",
            icon: "settings",
          },
          {
            title: "Financial Analytics",
            text: "Warehouse and reporting services",
            badge: "Operational",
            icon: "settings",
          },
          {
            title: "Workplace Printing",
            text: "Office printing and peripherals",
            badge: "Operational",
            icon: "box",
          },
        ],
        "Current Status",
      ),
      cards(
        "Planned Maintenance Windows",
        [
          {
            title: "Emergency gateway firmware patch",
            text: "22 Oct · 12:00–12:45 UTC · Corporate VPN",
            badge: "Maintenance",
            meta: "Some reconnects may be required.",
          },
          {
            title: "Workday tax engine migration",
            text: "24 Oct · 22:00–23:30 UTC · Payroll & HRIS",
            badge: "Scheduled",
            meta: "Payroll reporting may be temporarily unavailable.",
          },
        ],
        "Maintenance",
      ),
      timeline(
        "Service Update Timeline",
        [
          {
            title: "Secondary gateway accepting connections",
            text: "Affected traffic is being redirected. Recovery validation continues.",
            meta: "22 Oct · 13:45 UTC",
          },
          {
            title: "Gateway issue identified",
            text: "Certificate cache behavior is under investigation.",
            meta: "22 Oct · 12:20 UTC",
          },
          {
            title: "Interruption acknowledged",
            text: "We are investigating remote access reports from EMEA users.",
            meta: "22 Oct · 09:15 UTC",
          },
        ],
        "Incident Updates",
      ),
    ],
    aside: [
      text("Service Transparency", [
        "Status values and timestamps are illustrative screen content. This page is not connected to live monitoring.",
        "Report your issue if you need help or have a different error.",
      ]),
    ],
  },
];
