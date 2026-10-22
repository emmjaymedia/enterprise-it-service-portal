import { notFound } from "next/navigation";
import PreviewPage from "./preview-page";
import { findScreen } from "./screen-registry";
export default function RenderScreen({
  path,
  tab,
}: {
  path: string;
  tab?: string;
}) {
  const spec = findScreen(path);
  if (!spec) notFound();
  return <PreviewPage spec={spec} initialTab={tab} />;
}
