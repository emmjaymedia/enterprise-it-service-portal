import {
  getTicketById,
  updateTicket,
} from "@/lib/server/ticket-store";
import { updateTicketSchema } from "@/features/tickets/ticket-schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const headers = { "Cache-Control": "no-store" };

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const ticket = getTicketById(id);

  if (!ticket) {
    return Response.json(
      {
        error: {
          message: "This ticket could not be found.",
        },
      },
      { status: 404, headers },
    );
  }

  return Response.json({ data: ticket }, { headers });
}


export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const contentType = request.headers
    .get("content-type")
    ?.split(";")[0]
    .trim()
    .toLowerCase();

  if (contentType !== "application/json") {
    return Response.json(
      { error: { message: "Send updates as application/json." } },
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

  const parsed = updateTicketSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      {
        error: {
          message: "Check the update fields and try again.",
          fieldErrors: parsed.error.flatten().fieldErrors,
        },
      },
      { status: 400, headers },
    );
  }

  const { id } = await context.params;
  const result = updateTicket(id, parsed.data);

  if (!result.ok) {
    return Response.json(
      { error: { message: result.message } },
      { status: result.status, headers },
    );
  }

  return Response.json({ data: result.ticket }, { headers });
}