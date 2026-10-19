export const isActive = (status: string) =>
  !["Resolved", "Closed", "Cancelled"].includes(status);
export const responseTarget = (priority: string) =>
  ({
    P1: "15 minutes",
    P2: "1 business hour",
    P3: "4 business hours",
    P4: "8 business hours",
  })[priority.slice(0, 2)] ?? "To be confirmed";
export const resolutionTarget = (priority: string) =>
  ({
    P1: "4 hours",
    P2: "8 business hours",
    P3: "24 business hours",
    P4: "40 business hours",
  })[priority.slice(0, 2)] ?? "To be confirmed";
