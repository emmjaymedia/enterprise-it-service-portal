import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  supportResolutionRecorded,
  supportHandoffRecorded,
  supportTicketReopened,
} from "@/features/workspace/workflow-events";
import {
  feedbackEligibility,
  type ResolutionFeedback,
} from "./feedback-policy";
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
  resolvedAt?: string;
  resolutionCycle?: number;
  resolutionSummary?: string;
  resolutionCode?: string;
  resolutionArticle?: string;
  feedback?: ResolutionFeedback[];
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
      resolvedAt: "2026-10-21T14:00:00Z",
      resolutionCycle: 1,
      resolutionSummary:
        "Your license is ready. Sign in with your corporate account and verify your team workspace.",
      subject: "Figma license request",
      status: "Resolved",
      priority: "P4 Low",
      description:
        "Your license has been provisioned. Please sign in with your corporate account.",
      service: "Software",
      category: "Software",
      createdAt: "2026-10-15T08:00:00Z",
      updatedAt: "2026-10-21T14:00:00Z",
    },
    {
      id: "INC-1028",
      resolvedAt: "2026-10-08T10:00:00Z",
      resolutionCycle: 1,
      feedback: [
        {
          cycle: 1,
          rating: 4,
          comment: "Calendar works again.",
          criteria: {},
          submittedAt: "2026-10-08T12:00:00Z",
          updatedAt: "2026-10-08T12:00:00Z",
        },
      ],
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
    submitResolutionFeedback(
      state,
      action: PayloadAction<{
        id: string;
        cycle: number;
        rating: number;
        comment: string;
        criteria: Record<string, string>;
        at: string;
        edit: boolean;
      }>,
    ) {
      const p = action.payload;
      const ticket = state.tickets.find((t) => t.id === p.id);
      if (
        !ticket ||
        feedbackEligibility(ticket, Date.parse(p.at)) ||
        ticket.resolutionCycle !== p.cycle ||
        !Number.isInteger(p.rating) ||
        p.rating < 1 ||
        p.rating > 5 ||
        p.comment.length > 500
      )
        return;
      const prior = ticket.feedback?.find((f) => f.cycle === p.cycle);
      if (!!prior !== p.edit) return;
      const value = {
        cycle: p.cycle,
        rating: p.rating,
        comment: p.comment.trim(),
        criteria: p.criteria,
        submittedAt: prior?.submittedAt ?? p.at,
        updatedAt: p.at,
      };
      if (prior) Object.assign(prior, value);
      else (ticket.feedback ??= []).push(value);
    },
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
  extraReducers: (builder) => {
    builder.addCase(supportTicketReopened, (state, { payload: p }) => {
      const ticket = state.tickets.find((t) => t.id === p.id);
      if (
        !ticket ||
        p.requester !== "Amina Yusuf" ||
        ticket.status !== "Resolved"
      )
        return;
      ticket.status = "Open";
      ticket.updatedAt = p.at;
      (ticket.messages ??= []).push({
        id: p.eventId,
        author: "IT Support",
        text: `Ticket reopened: ${p.reason}`,
        at: p.at,
      });
    });
    builder.addCase(supportHandoffRecorded, (state, { payload: p }) => {
      const ticket = state.tickets.find((t) => t.id === p.id);
      if (
        !ticket ||
        p.requester !== "Amina Yusuf" ||
        ["Resolved", "Closed", "Cancelled"].includes(ticket.status)
      )
        return;
      ticket.team = p.team;
      ticket.owner = p.assignee ?? "Awaiting assignment";
      ticket.updatedAt = p.at;
      if (p.publicText)
        (ticket.messages ??= []).push({
          id: p.eventId,
          author: "IT Support",
          text: p.publicText,
          at: p.at,
        });
    });
    builder.addCase(supportResolutionRecorded, (state, { payload: p }) => {
      const ticket = state.tickets.find((t) => t.id === p.id);
      if (
        !ticket ||
        p.requester !== "Amina Yusuf" ||
        ["Resolved", "Closed", "Cancelled"].includes(ticket.status)
      )
        return;
      ticket.status = "Resolved";
      ticket.resolutionCycle = (ticket.resolutionCycle ?? 0) + 1;
      ticket.resolvedAt = p.at;
      ticket.updatedAt = p.at;
      ticket.resolutionSummary = p.summary;
      ticket.resolutionCode = p.code;
      ticket.resolutionArticle = p.article;
      (ticket.messages ??= []).push({
        id: p.eventId,
        author: "Daniel Cole · IT Support",
        text: `Resolution — ${p.code}: ${p.summary}${p.article ? `\nPublic article reference: ${p.article}` : ""}`,
        at: p.at,
      });
    });
  },
});
export const {
  submitResolutionFeedback,
  saveDraft,
  addIssue,
  saveReplyDraft,
  sendPublicReply,
  requesterAction,
} = slice.actions;
export default slice.reducer;
