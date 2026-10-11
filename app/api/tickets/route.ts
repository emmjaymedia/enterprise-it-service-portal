import { randomUUID } from "node:crypto";
import {
  createTicketSchema,
  type Ticket,
} from "@/features/tickets/ticket-schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

function getTickets(): Ticket[] {
  demoGlobal.serviceDeskTickets ??= [...sampleTickets];
  return demoGlobal.serviceDeskTickets;
}

const headers = { "Cache-Control": "no-store" };

export async function GET() {
  const tickets = getTickets();

  return Response.json(
    {
      data: tickets,
      meta: {
        total: tickets.length,
        source: "fictional-sample-data",
      },
    },
    { headers },
  );
}

export async function POST(request: Request) {
  const contentType = request.headers
    .get("content-type")
    ?.split(";")[0]
    .trim()
    .toLowerCase();

  if (contentType !== "application/json") {
    return Response.json(
      { error: { message: "Send the ticket as application/json." } },
      { status: 415, headers },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: { message: "The request contains invalid JSON." } },
      { status: 400, headers },
    );
  }

  const parsed = createTicketSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      {
        error: {
          message: "Check the ticket fields and try again.",
          fieldErrors: parsed.error.flatten().fieldErrors,
        },
      },
      { status: 400, headers },
    );
  }

  const ticket: Ticket = {
    ...parsed.data,
    id: `TKT-${randomUUID()}`,
    status: "Open",
  };

  getTickets().unshift(ticket);

  return Response.json({ data: ticket }, { status: 201, headers });
}