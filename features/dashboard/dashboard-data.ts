import { ticketsApi } from "@/features/tickets/tickets-api";

export const teams = ["Network Operations", "Applications Support", "Workplace IT", "Identity & Access"] as const;
export type Team = (typeof teams)[number];
export type QueueFilter = "all" | "unassigned" | "due" | "breached";
export type DemoTicket = {
  id: string; subject: string; requester: string; department: string;
  service: string; team: Team; priority: 1 | 2 | 3 | 4;
  assignee: string | null; sla: "On track" | "Due soon" | "Breached";
  status: "Open" | "In progress"; age: number;
};
const subjects = ["Payroll service unavailable", "Unable to connect to company VPN", "Shared printer unavailable on floor 3", "Request access to finance workspace", "Laptop display flickers during meetings", "Unable to reset account password", "Teams calls disconnect intermittently", "New starter equipment request"];
const people = ["Grace Okafor", "Amina Yusuf", "Omar Hassan", "Layla Ahmed", "James Chen", "Sarah Wilson"];
export const demoTickets: DemoTicket[] = Array.from({ length: 42 }, (_, i) => ({
  id: i === 0 ? "INC-1044" : i === 1 ? "INC-1042" : `INC-${1100 + i}`,
  subject: subjects[i % subjects.length], requester: people[i % people.length],
  department: ["Finance", "Global Sales", "Operations", "Internal Audit"][i % 4],
  service: ["Payroll", "Corporate VPN", "Printing", "Identity & Access"][i % 4],
  team: teams[i % teams.length], priority: i === 0 || i === 6 ? 1 : i < 9 ? 2 : i < 30 ? 3 : 4,
  assignee: i >= 34 ? null : ["Daniel Cole", "Priya Shah", "Rashid Khan", "Maya Lee"][i % 4],
  sla: i === 0 ? "Breached" : i < 6 ? "Due soon" : "On track",
  status: i % 3 === 0 ? "Open" : "In progress", age: i % 7,
}));
export const trend = [
  { day: "Mon", created: 18, resolved: 15 }, { day: "Tue", created: 22, resolved: 20 },
  { day: "Wed", created: 25, resolved: 22 }, { day: "Thu", created: 21, resolved: 23 },
  { day: "Fri", created: 26, resolved: 24 }, { day: "Sat", created: 7, resolved: 5 },
  { day: "Sun", created: 9, resolved: 8 },
];
// Frontend-only fixture exposed through the existing RTK Query service.
// No API route, server store or backend contract is changed.
export const dashboardApi = ticketsApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardDemo: builder.query<DemoTicket[], void>({
      queryFn: () => ({ data: demoTickets }),
    }),
  }),
});
export const { useGetDashboardDemoQuery } = dashboardApi;
export function matchesQueue(ticket: DemoTicket, filter: QueueFilter) {
  return filter === "all" || (filter === "unassigned" && !ticket.assignee) ||
    (filter === "due" && ticket.sla === "Due soon") || (filter === "breached" && ticket.sla === "Breached");
}
