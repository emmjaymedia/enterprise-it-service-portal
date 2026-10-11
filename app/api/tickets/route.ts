import { randomUUID } from "node:crypto";
import { getTickets } from "@/lib/server/ticket-store";
import {
  createTicketSchema,
  type Ticket,
} from "@/features/tickets/ticket-schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";


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