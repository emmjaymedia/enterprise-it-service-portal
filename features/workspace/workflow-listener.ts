import { createListenerMiddleware } from "@reduxjs/toolkit";
import { requesterAction } from "@/features/portal/portal-slice";
import { dashboardApi } from "@/features/dashboard/dashboard-data";
import type { RootState, AppDispatch } from "@/store/store";
export const workflowListener = createListenerMiddleware();
workflowListener.startListening({
  actionCreator: requesterAction,
  effect: async (action, api) => {
    if (action.payload.kind !== "reopen") return;
    const before = api.getOriginalState() as RootState;
    const after = api.getState() as RootState;
    const old = before.portal.tickets.find((t) => t.id === action.payload.id);
    const current = after.portal.tickets.find(
      (t) => t.id === action.payload.id,
    );
    if (old?.status !== "Resolved" || current?.status !== "Open") return;
    const ticket = dashboardApi.endpoints.getDashboardDemo
      .select()(after)
      .data?.find(
        (t) => t.id === action.payload.id && t.requester === "Amina Yusuf",
      );
    if (!ticket || ticket.status !== "Resolved") return;
    const request = (api.dispatch as AppDispatch)(
      dashboardApi.endpoints.changeDemoTickets.initiate({
        items: [{ id: ticket.id, version: ticket.version }],
        change: {
          kind: "status",
          value: "Open",
          reason: `Requester reopened: ${action.payload.reason}`,
        },
        bulk: false,
      }),
    );
    await request;
    request.reset();
  },
});
