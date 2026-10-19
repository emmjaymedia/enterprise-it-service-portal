"use client";
import { useState } from "react";
import { useAppSelector } from "@/store/hooks";
import PortalShell from "@/features/portal/portal-shell";
import WorkspaceShell from "@/components/workspace/workspace-shell";
export default function SharedShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const context = useAppSelector((state) => state.shared.context);
  const [search, setSearch] = useState("");
  return context === "agent" ? (
    <WorkspaceShell search={search} onSearch={setSearch}>
      {children}
    </WorkspaceShell>
  ) : (
    <PortalShell>{children}</PortalShell>
  );
}
