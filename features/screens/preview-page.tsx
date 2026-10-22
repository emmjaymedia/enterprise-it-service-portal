"use client";
import { useState } from "react";
import WorkspaceShell from "@/components/workspace/workspace-shell";
import ScreenView from "./screen-view";
import type { ScreenSpec } from "./screen-types";
export default function PreviewPage({
  spec,
  initialTab,
}: {
  spec: ScreenSpec;
  initialTab?: string;
}) {
  const [search, setSearch] = useState("");
  return spec.area === "portal" ? (
    <ScreenView
      key={`${spec.path}:${initialTab ?? ""}`}
      spec={spec}
      initialTab={initialTab}
    />
  ) : (
    <WorkspaceShell search={search} onSearch={setSearch}>
      <ScreenView
        key={`${spec.path}:${initialTab ?? ""}`}
        spec={spec}
        initialTab={initialTab}
      />
    </WorkspaceShell>
  );
}
