import SharedShell from "@/features/shared/shared-shell";
import GlobalSearch from "@/features/shared/global-search";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  return (
    <SharedShell>
      <GlobalSearch key={q ?? ""} initialQuery={q ?? ""} />
    </SharedShell>
  );
}
