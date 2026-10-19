import type { RootState } from "@/store/store";
import {
  applyTicketChange,
  type Activity,
  type Message,
  type DemoStatus,
  type TicketChange,
} from "@/features/workspace/ticket-model";
import { ticketsApi } from "@/features/tickets/tickets-api";

export const teams = [
  "Network Operations",
  "Applications Support",
  "Workplace IT",
  "Identity & Access",
] as const;
export type Team = (typeof teams)[number];
export type QueueFilter = "all" | "unassigned" | "due" | "breached";
export type DemoTicket = {
  id: string;
  subject: string;
  requester: string;
  department: string;
  service: string;
  team: Team;
  priority: 1 | 2 | 3 | 4;
  assignee: string | null;
  sla: "On track" | "Due soon" | "Breached";
  status: DemoStatus;
  age: number;
  updatedMinutes: number;
  version: number;
  messages: Message[];
  activity: Activity[];
  attachments: string[];
};
const subjects = [
  "Payroll service unavailable",
  "Unable to connect to company VPN",
  "Shared printer unavailable on floor 3",
  "Request access to finance workspace",
  "Laptop display flickers during meetings",
  "Unable to reset account password",
  "Teams calls disconnect intermittently",
  "New starter equipment request",
];
const people = [
  "Grace Okafor",
  "Amina Yusuf",
  "Omar Hassan",
  "Layla Ahmed",
  "James Chen",
  "Sarah Wilson",
];
export const demoTickets: DemoTicket[] = Array.from({ length: 42 }, (_, i) => ({
  id: i === 0 ? "INC-1044" : i === 1 ? "INC-1042" : `INC-${1100 + i}`,
  subject: subjects[i % subjects.length],
  requester: people[i % people.length],
  department: ["Finance", "Global Sales", "Operations", "Internal Audit"][
    i % 4
  ],
  service: ["Payroll", "Corporate VPN", "Printing", "Identity & Access"][i % 4],
  team: teams[i % teams.length],
  priority: i === 0 || i === 6 ? 1 : i < 9 ? 2 : i < 30 ? 3 : 4,
  assignee:
    i >= 34
      ? null
      : ["Daniel Cole", "Priya Shah", "Rashid Khan", "Maya Lee"][i % 4],
  sla: i === 0 ? "Breached" : i < 6 ? "Due soon" : "On track",
  status: i % 3 === 0 ? "Open" : "In progress",
  age: i % 7,
  updatedMinutes: i * 7 + 4,
  version: 1,
  attachments: i % 3 === 1 ? ["issue-screenshot.png"] : [],
  messages: [
    {
      id: `request-${i}`,
      author: people[i % people.length],
      visibility: "public",
      body:
        i === 1
          ? "Since 9:00 AM I cannot connect to the corporate VPN. The client hangs on Authenticating credentials and returns SEC_CONN_TIMEOUT_403. I restarted my laptop, but the issue persists. I have a client demo at 1:00 PM."
          : `Hello support, I need help with this issue: ${subjects[i % subjects.length]}. Please let me know the next steps.`,
      time: "2026-10-18T09:14:00Z",
      attachments: i % 3 === 1 ? ["issue-screenshot.png"] : [],
    },
    {
      id: `reply-${i}`,
      author: "Daniel Cole",
      visibility: "public",
      body: "Thank you for reporting this. We are investigating and will keep you updated. Can you confirm whether this happens on your office connection or home network?",
      time: "2026-10-18T09:35:00Z",
      attachments: [],
    },
    {
      id: `note-${i}`,
      author: "Daniel Cole",
      visibility: "internal",
      body: "Checking related reports with the support team. Review the affected service before making changes. This note is for support staff only.",
      time: "2026-10-18T10:05:00Z",
      attachments: [],
    },
  ],
  activity: [
    {
      id: `created-${i}`,
      text: `Ticket created by ${people[i % people.length]}`,
      time: "2026-10-18T09:14:00Z",
    },
    {
      id: `assigned-${i}`,
      text:
        i >= 34
          ? "Routed to team; awaiting an assignee"
          : "Assigned to support team",
      time: "2026-10-18T09:20:00Z",
    },
  ],
}));
export const trend = [
  { day: "Mon", created: 18, resolved: 15 },
  { day: "Tue", created: 22, resolved: 20 },
  { day: "Wed", created: 25, resolved: 22 },
  { day: "Thu", created: 21, resolved: 23 },
  { day: "Fri", created: 26, resolved: 24 },
  { day: "Sat", created: 7, resolved: 5 },
  { day: "Sun", created: 9, resolved: 8 },
];
export type BulkItem = { id: string; version: number };
export type BulkResult = { id: string; ok: boolean; error?: string };
const now = () => new Date().toISOString();
function cachedTickets(state: unknown): DemoTicket[] {
  return (
    dashboardApi.endpoints.getDashboardDemo.select()(state as RootState).data ??
    demoTickets
  );
}
// All mutations update only RTK Query's client cache. No backend request is made.
export const dashboardApi = ticketsApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardDemo: builder.query<DemoTicket[], void>({
      queryFn: (_arg, api): { data: DemoTicket[] } => ({
        data: cachedTickets(api.getState()),
      }),
      keepUnusedDataFor: 86400,
    }),
    changeDemoTickets: builder.mutation<
      BulkResult[],
      { items: BulkItem[]; change: TicketChange; bulk: boolean }
    >({
      queryFn: ({ items, change, bulk }, api) => {
        const current = cachedTickets(api.getState());
        const changes = new Map<string, DemoTicket>();
        const results: BulkResult[] = items.map(({ id, version }) => {
          const ticket = current.find((t) => t.id === id);
          if (!ticket)
            return { id, ok: false, error: "Ticket no longer available." };
          const result = applyTicketChange(ticket, change, version, bulk);
          if (!result.ok) return { id, ok: false, error: result.error };
          const time = now();
          changes.set(id, {
            ...result.ticket,
            updatedMinutes: 0,
            activity: [
              ...ticket.activity,
              {
                id: crypto.randomUUID(),
                text: `Daniel Cole: ${result.text}`,
                time,
              },
            ],
          });
          return { id, ok: true };
        });
        api.dispatch(
          dashboardApi.util.updateQueryData(
            "getDashboardDemo",
            undefined,
            (draft) => {
              for (let i = 0; i < draft.length; i++) {
                const changed = changes.get(draft[i].id);
                if (changed) draft[i] = changed;
              }
            },
          ),
        );
        return { data: results };
      },
    }),
    addDemoMessage: builder.mutation<
      { ok: boolean; error?: string },
      {
        id: string;
        version: number;
        body: string;
        visibility: Message["visibility"];
        attachments: string[];
        simulateFailure: boolean;
      }
    >({
      queryFn: (input, api) => {
        const ticket = cachedTickets(api.getState()).find(
          (t) => t.id === input.id,
        );
        if (!ticket)
          return { data: { ok: false, error: "Ticket no longer available." } };
        if (ticket.version !== input.version)
          return {
            data: {
              ok: false,
              error:
                "This ticket changed. Refresh and review the latest version; your draft is preserved.",
            },
          };
        if (ticket.status === "Resolved")
          return {
            data: {
              ok: false,
              error: "Reopen the ticket before sending a message.",
            },
          };
        if (!input.body.trim() || input.body.trim().length > 5000)
          return {
            data: {
              ok: false,
              error: "Enter a message between 1 and 5,000 characters.",
            },
          };
        if (input.simulateFailure)
          return {
            data: {
              ok: false,
              error:
                "Demo delivery failed. Your draft and attachments are preserved. Turn off failure simulation and retry.",
            },
          };
        api.dispatch(
          dashboardApi.util.updateQueryData(
            "getDashboardDemo",
            undefined,
            (draft) => {
              const row = draft.find((t) => t.id === input.id);
              if (!row) return;
              const time = now();
              row.messages.push({
                id: crypto.randomUUID(),
                author: "Daniel Cole",
                visibility: input.visibility,
                body: input.body.trim(),
                time,
                attachments: input.attachments,
              });
              row.attachments = [
                ...new Set([...row.attachments, ...input.attachments]),
              ];
              row.activity.push({
                id: crypto.randomUUID(),
                text:
                  input.visibility === "public"
                    ? "Daniel Cole sent a public reply"
                    : "Daniel Cole added an internal note",
                time,
              });
              row.version++;
              row.updatedMinutes = 0;
            },
          ),
        );
        return { data: { ok: true } };
      },
    }),
  }),
});
export const {
  useGetDashboardDemoQuery,
  useChangeDemoTicketsMutation,
  useAddDemoMessageMutation,
} = dashboardApi;
export function matchesQueue(ticket: DemoTicket, filter: QueueFilter) {
  return (
    filter === "all" ||
    (filter === "unassigned" && !ticket.assignee) ||
    (filter === "due" && ticket.sla === "Due soon") ||
    (filter === "breached" && ticket.sla === "Breached")
  );
}
