export const supportAgents = [
  { id: "AGENT-001", name: "Amina Yusuf" },
  { id: "AGENT-002", name: "Daniel Okoro" },
] as const;

export const agentIdSchema = z.enum(["AGENT-001", "AGENT-002"]);

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
  assigneeId: agentIdSchema.nullable().optional(),
  resolution: z.string().nullable().optional(),
  version: z.number().int().nonnegative().optional(),
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


export const updateTicketSchema = z.discriminatedUnion("action", [
  z
    .object({
      action: z.literal("assign"),
      assigneeId: agentIdSchema,
      expectedVersion: z.number().int().nonnegative(),
    })
    .strict(),
  z
    .object({
      action: z.literal("start"),
      expectedVersion: z.number().int().nonnegative(),
    })
    .strict(),
  z
    .object({
      action: z.literal("resolve"),
      resolution: z
        .string()
        .trim()
        .min(10, "Use at least 10 characters for the resolution.")
        .max(2000, "Keep the resolution within 2,000 characters."),
      expectedVersion: z.number().int().nonnegative(),
    })
    .strict(),
]);

export type UpdateTicketInput = z.infer<typeof updateTicketSchema>;