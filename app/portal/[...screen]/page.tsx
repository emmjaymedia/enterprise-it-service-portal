import RenderScreen from "@/features/screens/render-screen";
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ screen: string[] }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { screen } = await params;
  const { tab } = await searchParams;
  return <RenderScreen path={"/portal/" + screen.join("/")} tab={tab} />;
}
