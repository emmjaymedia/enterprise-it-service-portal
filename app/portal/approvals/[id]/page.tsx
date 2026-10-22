import ApprovalDecision from "@/features/approvals/approval-decision";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ApprovalDecision key={id} id={id} />;
}
