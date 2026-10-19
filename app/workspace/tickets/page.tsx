import { Suspense } from "react";
import TicketQueue from "@/features/workspace/ticket-queue";
export default function TicketsPage() {
  return (
    <Suspense fallback={<p role="status">Loading ticket queue…</p>}>
      <TicketQueue />
    </Suspense>
  );
}
