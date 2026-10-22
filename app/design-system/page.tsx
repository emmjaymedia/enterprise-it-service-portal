import RenderScreen from "@/features/screens/render-screen";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  return <RenderScreen path="/design-system" tab={tab} />;
}
