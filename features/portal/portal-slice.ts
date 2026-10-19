import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
export type IssueDraft = {
  subject: string;
  category: string;
  service: string;
  asset: string;
  impact: string;
  urgency: string;
  description: string;
};
export const emptyDraft: IssueDraft = {
  subject: "",
  category: "",
  service: "",
  asset: "",
  impact: "Just me",
  urgency: "Degraded work",
  description: "",
};
export type PublicMessage = {
  id: string;
  author: string;
  text: string;
  at: string;
  attachments?: { name: string; size: number }[];
};
export type EmployeeTicket = {
  messages?: PublicMessage[];
  owner?: string;
  team?: string;
  asset?: string;
  canCancel?: boolean;
  createdAt: string;
  updatedAt: string;
  service: string;
  category: string;
  attachments?: { name: string; size: number }[];
  id: string;
  subject: string;
  status: string;
  priority: string;
  description: string;
};
const initialState: {
  draft: IssueDraft;
  tickets: EmployeeTicket[];
  replyDrafts: Record<string, string>;
} = {
  replyDrafts: {},
  draft: emptyDraft,
  tickets: [
    {
      createdAt: "2026-10-18T09:14:00Z",
      updatedAt: "2026-10-19T09:30:00Z",
      service: "Corporate VPN",
      category: "Network / Remote Access",
      owner: "Daniel Cole",
      team: "Network Operations",
      asset: "ASSET-MBP-9812 — MacBook Pro",
      messages: [
        {
          id: "public-1042",
          author: "Daniel Cole · IT Support",
          text: "Hello Amina, we are investigating the VPN gateway. Could you tell us whether you are connected through office guest Wi-Fi or your home ISP?",
          at: "2026-10-19T09:30:00Z",
        },
      ],
      id: "INC-1042",
      subject: "Unable to connect to company VPN",
      status: "In progress",
      priority: "P2 High",
      description:
        "Cisco AnyConnect client hangs at “Contacting gateway…” followed by handshake timeout 403.",
    },
    {
      id: "REQ-1039",
      subject: "Figma license request",
      status: "Resolved",
      priority: "P4 Low",
      description:
        "Your license has been provisioned. Please sign in with your corporate account.",
      service: "Software",
      category: "Software",
      createdAt: "2026-10-15T08:00:00Z",
      updatedAt: "2026-10-18T14:00:00Z",
    },
    {
      id: "INC-1028",
      subject: "Outlook calendar not syncing",
      status: "Closed",
      priority: "P3 Medium",
      description: "Calendar synchronization restored after account refresh.",
      service: "Email / Outlook",
      category: "Software",
      createdAt: "2026-10-05T08:00:00Z",
      updatedAt: "2026-10-08T10:00:00Z",
    },
    {
      id: "REQ-0991",
      subject: "Replacement power adapter",
      status: "Closed",
      priority: "P4 Low",
      description: "Replacement adapter collected from the IT desk.",
      service: "Hardware",
      category: "Hardware",
      createdAt: "2026-09-01T08:00:00Z",
      updatedAt: "2026-09-04T10:00:00Z",
    },
    {
      id: "REQ-1040",
      subject: "Additional monitor for my desk",
      status: "Open",
      priority: "P4 Low",
      description:
        "Please provide an additional monitor for the sales workspace.",
      service: "Hardware",
      category: "Hardware",
      createdAt: "2026-10-19T08:00:00Z",
      updatedAt: "2026-10-19T08:00:00Z",
      canCancel: true,
    },
    {
      id: "INC-1046",
      subject: "MFA prompt not arriving on my phone",
      status: "Pending requester",
      priority: "P3 Medium",
      description: "I cannot receive the push notification to sign in.",
      service: "Account / Access",
      category: "Account / Access",
      createdAt: "2026-10-19T07:00:00Z",
      updatedAt: "2026-10-19T09:00:00Z",
      messages: [
        {
          id: "public-1046",
          author: "IT Support",
          text: "Please confirm your phone model and whether the authenticator app has an internet connection. Do not send your password or verification codes.",
          at: "2026-10-19T09:00:00Z",
        },
      ],
    },
  ],
};
const slice = createSlice({
  name: "portal",
  initialState,
  reducers: {
    saveReplyDraft(state, action: PayloadAction<{ id: string; text: string }>) {
      state.replyDrafts[action.payload.id] = action.payload.text;
    },
    sendPublicReply(
      state,
      action: PayloadAction<{ id: string; message: PublicMessage }>,
    ) {
      const ticket = state.tickets.find((t) => t.id === action.payload.id);
      if (
        !ticket ||
        ["Resolved", "Closed", "Cancelled"].includes(ticket.status) ||
        action.payload.message.text.trim().length < 2 ||
        action.payload.message.text.length > 5000
      )
        return;
      (ticket.messages ??= []).push(action.payload.message);
      ticket.updatedAt = action.payload.message.at;
      if (ticket.status === "Pending requester") ticket.status = "In progress";
      delete state.replyDrafts[ticket.id];
    },
    requesterAction(
      state,
      action: PayloadAction<{
        id: string;
        kind: "confirm" | "reopen" | "cancel";
        reason: string;
        at: string;
        eventId: string;
      }>,
    ) {
      const { id, kind, reason, at, eventId } = action.payload;
      const ticket = state.tickets.find((t) => t.id === id);
      if (!ticket) return;
      if (kind === "confirm" && ticket.status === "Resolved")
        ticket.status = "Closed";
      else if (
        kind === "reopen" &&
        ticket.status === "Resolved" &&
        reason.trim().length >= 10
      )
        ticket.status = "Open";
      else if (
        kind === "cancel" &&
        ticket.canCancel &&
        ["Open", "In progress"].includes(ticket.status) &&
        reason.trim().length >= 10
      )
        ticket.status = "Cancelled";
      else return;
      ticket.updatedAt = at;
      (ticket.messages ??= []).push({
        id: eventId,
        author: "Amina Yusuf",
        at,
        text:
          kind === "confirm"
            ? "Solution confirmed. Ticket closed."
            : `${kind === "reopen" ? "Issue reopened" : "Request cancelled"}: ${reason.trim()}`,
      });
    },
    saveDraft(state, action: PayloadAction<IssueDraft>) {
      state.draft = action.payload;
    },
    addIssue(state, action: PayloadAction<EmployeeTicket>) {
      state.tickets.unshift(action.payload);
      state.draft = emptyDraft;
    },
  },
});
export const {
  saveDraft,
  addIssue,
  saveReplyDraft,
  sendPublicReply,
  requesterAction,
} = slice.actions;
export default slice.reducer;
