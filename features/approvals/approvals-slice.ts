import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
export type ApprovalAction = "Approve" | "Reject" | "Clarify" | "Delegate";
export type Approval = {
  id: string;
  title: string;
  requester: string;
  category: string;
  service: string;
  cost: string;
  scope: string;
  justification: string;
  age: number;
  due: string;
  status: "Pending" | "Approved" | "Rejected" | "Delegated" | "Withdrawn";
  version: number;
  canDelegate: boolean;
  history: string[];
};
const base: Approval[] = [
  {
    id: "REQ-2081",
    title: "Request access to finance workspace",
    requester: "Layla Ahmed",
    category: "Access entitlement",
    service: "Snowflake Financials Data Warehouse",
    cost: "$450 / year",
    scope: "AUDITOR_READONLY · SELECT, DESCRIBE · PII masked · 30 days",
    justification:
      "Conducting the annual financial audit. Read-only access to production finance tables is required with standard PII masking.",
    age: 0,
    due: "22 Oct 2026, 17:00 UTC",
    status: "Pending",
    version: 1,
    canDelegate: true,
    history: ["Request submitted by Layla Ahmed."],
  },
  {
    id: "REQ-2079",
    title: "MacBook Pro 16-inch hardware refresh",
    requester: "Samuel Reed",
    category: "Hardware & assets",
    service: "Employee devices",
    cost: "$3,499 CapEx",
    scope: "Replacement for AST-00502; return old device within 14 days",
    justification:
      "Battery wear prevents reliable work. The existing device is due for replacement.",
    age: 1,
    due: "23 Oct 2026, 12:00 UTC",
    status: "Pending",
    version: 1,
    canDelegate: true,
    history: ["Budget approval requested."],
  },
  {
    id: "REQ-2075",
    title: "Temporary Admin Bastion Access",
    requester: "Daniel Cole",
    category: "Cloud resources",
    service: "Production VPN gateway",
    cost: "No additional cost",
    scope: "Privileged gateway access · 4 hours",
    justification: "Emergency maintenance for VPN gateway change CHG-087.",
    age: 4,
    due: "22 Oct 2026, 15:00 UTC",
    status: "Pending",
    version: 1,
    canDelegate: false,
    history: ["Infrastructure lead authorization requested."],
  },
  {
    id: "REQ-2074",
    title: "Sales analytics access",
    requester: "Amina Yusuf",
    category: "Access entitlement",
    service: "Sales analytics",
    cost: "$120 / year",
    scope: "Read-only sales reports",
    justification: "Review regional sales performance.",
    age: 7,
    due: "24 Oct 2026, 17:00 UTC",
    status: "Pending",
    version: 1,
    canDelegate: false,
    history: ["Self-request demo: another approver is required."],
  },
  {
    id: "REQ-2068",
    title: "Design software renewal",
    requester: "Samuel Reed",
    category: "Access entitlement",
    service: "Design software",
    cost: "$240 / year",
    scope: "Standard seat",
    justification: "Annual renewal.",
    age: 8,
    due: "20 Oct 2026, 17:00 UTC",
    status: "Approved",
    version: 2,
    canDelegate: false,
    history: ["Approved by Amina Yusuf. Next: license team review."],
  },
  {
    id: "REQ-2065",
    title: "Additional cloud environment",
    requester: "Daniel Cole",
    category: "Cloud resources",
    service: "Cloud hosting",
    cost: "$300 / month",
    scope: "Development environment",
    justification: "Temporary testing capacity.",
    age: 9,
    due: "19 Oct 2026, 17:00 UTC",
    status: "Withdrawn",
    version: 2,
    canDelegate: false,
    history: ["Withdrawn by requester."],
  },
];
const slice = createSlice({
  name: "approvals",
  initialState: {
    records: base,
    drafts: {} as Record<string, string>,
    outcomes: {} as Record<string, string>,
  },
  reducers: {
    saveApprovalDraft(
      state,
      action: PayloadAction<{ id: string; text: string }>,
    ) {
      state.drafts[action.payload.id] = action.payload.text;
    },
    changeApprovalPreview(state, action: PayloadAction<string>) {
      const record = state.records.find((r) => r.id === action.payload);
      if (record?.status === "Pending") {
        record.version++;
        record.scope += " · Revised request";
        record.history.push(
          "Requester changed the scope. Review the latest revision.",
        );
      }
    },
    decideApproval(
      state,
      action: PayloadAction<{
        id: string;
        version: number;
        action: ApprovalAction;
        note: string;
        delegate: string;
      }>,
    ) {
      const p = action.payload;
      const r = state.records.find((r) => r.id === p.id);
      if (!r) return;
      const fail = (text: string) => {
        state.outcomes[r.id] = text;
      };
      if (r.version !== p.version)
        return fail(
          "Request changed. Review the updated scope before deciding again.",
        );
      if (r.status !== "Pending")
        return fail("This approval is no longer pending.");
      if (r.requester === "Amina Yusuf")
        return fail(
          "Self-approval is blocked. Another approver must review this request.",
        );
      if (
        p.note.trim().length > 500 ||
        ((p.action === "Reject" || p.action === "Clarify") &&
          p.note.trim().length < 10)
      )
        return fail("Enter a reason of 10–500 characters.");
      if (
        p.action === "Delegate" &&
        (!r.canDelegate || p.delegate !== "Priya Shah")
      )
        return fail(
          "The selected delegate is unavailable or delegation is not permitted.",
        );
      if (p.action === "Approve") r.status = "Approved";
      if (p.action === "Reject") r.status = "Rejected";
      if (p.action === "Delegate") r.status = "Delegated";
      r.version++;
      r.history.push(
        `${p.action} by Amina Yusuf${p.action === "Delegate" ? ` to ${p.delegate}` : ""}${p.note.trim() ? `: ${p.note.trim()}` : "."}`,
      );
      state.outcomes[r.id] =
        p.action === "Clarify"
          ? "Clarification requested. Approval remains pending."
          : p.action === "Approve"
            ? "Your approval was recorded. Further review and fulfillment remain pending."
            : p.action === "Delegate"
              ? "Delegated to Priya Shah. This item has left your pending inbox."
              : "Request rejected with your reason.";
      delete state.drafts[r.id];
    },
  },
});
export const { saveApprovalDraft, decideApproval, changeApprovalPreview } =
  slice.actions;
export default slice.reducer;
