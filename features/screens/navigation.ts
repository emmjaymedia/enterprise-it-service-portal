import type { IconName } from "@/components/workspace/icon";
export const workspaceMenu: { label: string; icon: IconName; href: string }[] =
  [
    {
      label: "Major Incidents",
      icon: "alert",
      href: "/workspace/major-incidents",
    },
    { label: "Service Requests", icon: "ticket", href: "/workspace/requests" },
    { label: "Approvals", icon: "check", href: "/workspace/approvals" },
    { label: "Problems", icon: "alert", href: "/workspace/problems" },
    { label: "Changes", icon: "calendar", href: "/workspace/changes" },
    { label: "Assets & CMDB", icon: "box", href: "/workspace/assets" },
    { label: "Knowledge Base", icon: "book", href: "/workspace/knowledge" },
    { label: "Reports", icon: "chart", href: "/workspace/reports" },
  ];
export const adminMenu = [
  { label: "Administration Overview", href: "/admin" },
  { label: "People & Teams", href: "/admin/people" },
  { label: "Roles & Permissions", href: "/admin/roles" },
  { label: "Ticket Fields & Forms", href: "/admin/forms" },
  { label: "SLA Policies & Calendars", href: "/admin/sla" },
  { label: "Routing & Automation", href: "/admin/automation" },
  { label: "Approval Workflows", href: "/admin/approvals" },
  { label: "Catalog Administration", href: "/admin/catalog" },
  { label: "Channels & Integrations", href: "/admin/integrations" },
  { label: "Notification Templates", href: "/admin/notifications" },
  { label: "Security & Organization", href: "/admin/settings" },
  { label: "Audit Log & Job History", href: "/admin/audit" },
];
export const moduleNavigation: Record<
  string,
  { label: string; href: string }[]
> = {
  tickets: [
    { label: "Queue", href: "/workspace/tickets" },
    { label: "Create Ticket", href: "/workspace/tickets/new" },
    { label: "Saved Views", href: "/workspace/views" },
  ],
  changes: [
    { label: "Changes Register", href: "/workspace/changes" },
    { label: "Change Calendar", href: "/workspace/changes/calendar" },
    { label: "Create Change", href: "/workspace/changes/new" },
  ],
  assets: [
    { label: "Asset Inventory", href: "/workspace/assets" },
    { label: "CMDB Services", href: "/workspace/cmdb" },
    { label: "Register / Import", href: "/workspace/assets/new" },
  ],
  knowledge: [
    { label: "Article Library", href: "/workspace/knowledge" },
    { label: "New Article", href: "/workspace/knowledge/new/edit" },
    { label: "Employee Guides", href: "/portal/knowledge" },
  ],
  reports: [
    { label: "Performance Reports", href: "/workspace/reports" },
    { label: "Report Builder", href: "/workspace/reports/builder" },
  ],
};
