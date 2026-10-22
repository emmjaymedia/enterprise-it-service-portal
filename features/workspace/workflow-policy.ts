import type { Team } from "@/features/dashboard/dashboard-data";
export const resolutionCodes = [
  "Solved — permanent fix",
  "Solved — workaround",
  "Guidance provided",
] as const;
export const resolutionArticles = [
  { id: "KB-4029", title: "Troubleshoot your VPN connection" },
  { id: "KB-4030", title: "Restore account access" },
] as const;
export const routingTargets: Record<
  Team,
  { available: boolean; members: string[]; lead: string }
> = {
  "Network Operations": {
    available: true,
    members: ["Daniel Cole", "Priya Shah"],
    lead: "Priya Shah",
  },
  "Applications Support": {
    available: true,
    members: ["Priya Shah", "Maya Lee"],
    lead: "Maya Lee",
  },
  "Workplace IT": {
    available: true,
    members: ["Rashid Khan", "Daniel Cole"],
    lead: "Rashid Khan",
  },
  "Identity & Access": {
    available: false,
    members: ["Maya Lee"],
    lead: "Maya Lee",
  },
};
export type ResolutionTask = {
  id: string;
  label: string;
  required: boolean;
  done: boolean;
};
export type WorkflowFields = {
  tasks?: ResolutionTask[];
  approvalState?: "Not required" | "Pending" | "Approved";
  sensitive?: boolean;
  allowedTeams?: Team[];
  escalationLevel?: number;
  resolutionCode?: string;
  resolutionSummary?: string;
  resolutionArticle?: string;
  resolutionCycle?: number;
};
