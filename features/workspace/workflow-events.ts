import { createAction } from "@reduxjs/toolkit";
export const supportResolutionRecorded = createAction<{
  id: string;
  requester: string;
  summary: string;
  code: string;
  article?: string;
  at: string;
  eventId: string;
}>("workflow/supportResolutionRecorded");
export const supportHandoffRecorded = createAction<{
  id: string;
  requester: string;
  team: string;
  assignee: string | null;
  publicText: string;
  at: string;
  eventId: string;
}>("workflow/supportHandoffRecorded");
export const supportTicketReopened = createAction<{
  id: string;
  requester: string;
  reason: string;
  at: string;
  eventId: string;
}>("workflow/supportTicketReopened");
