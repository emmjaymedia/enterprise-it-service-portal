"use client";
import { useState } from "react";
import WorkspaceShell from "@/components/workspace/workspace-shell";
import ApprovalsInbox from "@/features/approvals/approvals-inbox";
import ApprovalDecision from "@/features/approvals/approval-decision";
export default function WorkspaceApprovals({ id }: { id?: string }) {
  const [search, setSearch] = useState("");
  return (
    <WorkspaceShell search={search} onSearch={setSearch}>
      {id ? (
        <ApprovalDecision key={id} id={id} basePath="/workspace/approvals" />
      ) : (
        <ApprovalsInbox basePath="/workspace/approvals" />
      )}
    </WorkspaceShell>
  );
}
