import ResolutionFeedback from "@/features/portal/resolution-feedback";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ResolutionFeedback key={id} id={id} />;
}
