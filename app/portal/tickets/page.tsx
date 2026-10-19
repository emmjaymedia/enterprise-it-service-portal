import MyTickets from "@/features/portal/my-tickets";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view } = await searchParams;
  return <MyTickets view={view} />;
}
