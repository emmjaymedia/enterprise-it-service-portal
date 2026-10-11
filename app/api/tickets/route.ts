export async function GET() {
  return Response.json(
    {
      data: [
        {
          id: "TKT-001",
          subject: "Unable to connect to office Wi-Fi",
          category: "Network",
          priority: "High",
          status: "Open",
        },
        {
          id: "TKT-002",
          subject: "Microsoft Teams microphone issue",
          category: "Software",
          priority: "Medium",
          status: "In progress",
        },
        {
          id: "TKT-003",
          subject: "Laptop running slowly",
          category: "Hardware",
          priority: "Medium",
          status: "Open",
        },
        {
          id: "TKT-004",
          subject: "Email setup assistance",
          category: "Account",
          priority: "Low",
          status: "Resolved",
        },
      ],
      meta: {
        total: 4,
        source: "fictional-sample-data",
      },
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}