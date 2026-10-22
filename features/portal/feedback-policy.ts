// Preview policy: five calendar days from resolution, matching the supplied E16 reference.
export const feedbackWindowMs = 5 * 86400000;
export const feedbackDemoNow = Date.parse("2026-10-22T12:00:00Z");
export type ResolutionFeedback = {
  cycle: number;
  rating: number;
  comment: string;
  criteria: Record<string, string>;
  submittedAt: string;
  updatedAt: string;
};
export type FeedbackTicket = {
  status: string;
  resolvedAt?: string;
  resolutionCycle?: number;
  feedback?: ResolutionFeedback[];
};
export function feedbackEligibility(ticket: FeedbackTicket, now: number) {
  if (!["Resolved", "Closed"].includes(ticket.status))
    return "This ticket is active or reopened. Feedback is unavailable until the next resolution.";
  if (!ticket.resolvedAt || !ticket.resolutionCycle)
    return "There is no eligible resolution cycle for this ticket.";
  if (now > Date.parse(ticket.resolvedAt) + feedbackWindowMs)
    return "The five-day feedback and edit window has expired.";
  return "";
}
