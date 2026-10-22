import RenderScreen from "@/features/screens/render-screen";
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab } = await searchParams;

  return <RenderScreen path={`/workspace/tickets/${id}/related`} tab={tab} />;
}
