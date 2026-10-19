import { Suspense } from "react";
import TicketDetail from "@/features/workspace/ticket-detail";
export default async function TicketDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense fallback={<p role="status">Loading ticket…</p>}>
      <TicketDetail id={id} />
    </Suspense>
  );
}
