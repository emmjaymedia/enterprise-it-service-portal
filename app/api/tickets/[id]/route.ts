import { getTicketById } from "@/lib/server/ticket-store";

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