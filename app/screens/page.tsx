import PreviewPage from "@/features/screens/preview-page";
import { directorySpec } from "@/features/screens/screen-registry";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  return <PreviewPage spec={directorySpec} initialTab={tab} />;
}
