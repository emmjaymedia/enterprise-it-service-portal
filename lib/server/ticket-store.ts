import type { Ticket } from "@/features/tickets/ticket-schema";

// Server-only guard: do not import this module into client components.
if (typeof window !== "undefined") {
  throw new Error("The ticket store must only run on the server.");
}


const sampleTickets: Ticket[] = [
  {
    id: "TKT-001",
    subject: "Unable to connect to office Wi-Fi",
    description: "The office Wi-Fi connection fails on my laptop.",
    category: "Network",
    priority: "High",
    status: "Open",
  },
  {
    id: "TKT-002",
    subject: "Microsoft Teams microphone issue",
    description: "My microphone is unavailable during Teams calls.",
    category: "Software",
    priority: "Medium",
    status: "In progress",
  },
  {
    id: "TKT-003",
    subject: "Laptop running slowly",
    description: "My laptop becomes slow when opening applications.",
    category: "Hardware",
    priority: "Medium",
    status: "Open",
  },
  {
    id: "TKT-004",
    subject: "Email setup assistance",
    description: "I need help configuring email on my work device.",
    category: "Account",
    priority: "Low",
    status: "Resolved",
  },
];

// Local development only: one temporary store per server process.
const demoGlobal = globalThis as typeof globalThis & {
  serviceDeskTickets?: Ticket[];
};

export function getTickets(): Ticket[] {
  demoGlobal.serviceDeskTickets ??= [...sampleTickets];
  return demoGlobal.serviceDeskTickets;
}


export function getTicketById(id: string): Ticket | undefined {
  return getTickets().find((ticket) => ticket.id === id);
}