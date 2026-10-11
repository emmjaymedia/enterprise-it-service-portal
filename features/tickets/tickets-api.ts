import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { z } from "zod";

const ticketSchema = z.object({
  id: z.string(),
  subject: z.string(),
  category: z.string(),
  priority: z.enum(["High", "Medium", "Low"]),
  status: z.enum(["Open", "In progress", "Resolved"]),
});

const ticketsResponseSchema = z.object({
  data: z.array(ticketSchema),
  meta: z.object({
    total: z.number().int().nonnegative(),
    source: z.literal("fictional-sample-data"),
  }),
});

export type Ticket = z.infer<typeof ticketSchema>;
export type TicketsResponse = z.infer<typeof ticketsResponseSchema>;

const baseQuery = fetchBaseQuery({
  baseUrl: "/api/",
  timeout: 10000,
});

export const ticketsApi = createApi({
  reducerPath: "ticketsApi",
  baseQuery,
  endpoints: (builder) => ({
    getTickets: builder.query<TicketsResponse, void>({
      async queryFn(_argument, api, extraOptions) {
        const result = await baseQuery(
          "tickets",
          api,
          extraOptions,
        );

        if (result.error) {
          return { error: result.error };
        }

        const parsed = ticketsResponseSchema.safeParse(result.data);

        if (!parsed.success) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: "The ticket response has an invalid format.",
            },
          };
        }

        return { data: parsed.data };
      },
    }),
  }),
});

export const { useGetTicketsQuery } = ticketsApi;