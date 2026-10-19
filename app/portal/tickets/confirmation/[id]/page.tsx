import SubmissionConfirmation from "@/features/portal/submission-confirmation";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SubmissionConfirmation id={id} />;
}
