import { z } from "zod";

export const ticketCategories = [
  "Network",
  "Software",
  "Hardware",
  "Account",
] as const;

export const ticketPriorities = ["High", "Medium", "Low"] as const;

export const createTicketSchema = z
  .object({
    subject: z
      .string()
      .trim()
      .min(5, "Enter a subject with at least 5 characters.")
      .max(120, "Keep the subject within 120 characters."),
    description: z
      .string()
      .trim()
      .min(20, "Describe the issue using at least 20 characters.")
      .max(2000, "Keep the description within 2,000 characters."),
    category: z.enum(ticketCategories),
    priority: z.enum(ticketPriorities),
  })
  .strict();

export const ticketSchema = createTicketSchema.extend({
  id: z.string(),
  status: z.enum(["Open", "In progress", "Resolved"]),
});

export const ticketsResponseSchema = z.object({
  data: z.array(ticketSchema),
  meta: z.object({
    total: z.number().int().nonnegative(),
    source: z.literal("fictional-sample-data"),
  }),
});

export const createTicketResponseSchema = z.object({
  data: ticketSchema,
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type Ticket = z.infer<typeof ticketSchema>;
export type TicketsResponse = z.infer<typeof ticketsResponseSchema>;
export type CreateTicketResponse = z.infer<
  typeof createTicketResponseSchema
>;


export const ticketDetailsResponseSchema = z.object({
  data: ticketSchema,
});

export type TicketDetailsResponse = z.infer<
  typeof ticketDetailsResponseSchema
>;