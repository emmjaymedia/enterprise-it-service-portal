import {
  createApi,
  fetchBaseQuery,
  
} from "@reduxjs/toolkit/query/react"; 
import {
  createTicketResponseSchema,
  ticketsResponseSchema,
  type CreateTicketInput,
  type CreateTicketResponse,
  type TicketsResponse,
  ticketDetailsResponseSchema,
  type TicketDetailsResponse,
} from "./ticket-schema"; 

export type {
  Ticket,
  TicketsResponse,
  
} from "./ticket-schema";

const baseQuery = fetchBaseQuery({
  baseUrl: "/api/",
  timeout: 10000,
});

export const ticketsApi = createApi({
  reducerPath: "ticketsApi",
  baseQuery,
  tagTypes: ["Tickets"],
  endpoints: (builder) => ({
    getTickets: builder.query<TicketsResponse, void>({
      async queryFn(_argument, api, extraOptions) {
        const result = await baseQuery("tickets", api, extraOptions);

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
      providesTags: [{ type: "Tickets", id: "LIST" }],
    }),

getTicket: builder.query<TicketDetailsResponse, string>({
  async queryFn(id, api, extraOptions) {
    const result = await baseQuery(
      `tickets/${encodeURIComponent(id)}`,
      api,
      extraOptions,
    );

    if (result.error) {
      return { error: result.error };
    }

    const parsed = ticketDetailsResponseSchema.safeParse(result.data);

    if (!parsed.success) {
      return {
        error: {
          status: "CUSTOM_ERROR",
          error: "The ticket details response has an invalid format.",
        },
      };
    }

    return { data: parsed.data };
  },
  providesTags: (_result, _error, id) => [
    { type: "Tickets", id },
  ],
}),

    createTicket: builder.mutation<
      CreateTicketResponse,
      CreateTicketInput
    >({
      async queryFn(body, api, extraOptions) {
        const result = await baseQuery(
          {
            url: "tickets",
            method: "POST",
            body,
          },
          api,
          extraOptions,
        );

        if (result.error) {
          return { error: result.error };
        }

        const parsed = createTicketResponseSchema.safeParse(result.data);

        if (!parsed.success) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error:
                "The server returned an unexpected response. Check the ticket list before submitting again.",
            },
          };
        }

        return { data: parsed.data };
      },
      invalidatesTags: (result) =>
        result ? [{ type: "Tickets", id: "LIST" }] : [],
    }),
  }),
});

export const {
  useGetTicketsQuery,
  useGetTicketQuery,
  useCreateTicketMutation,
} = ticketsApi;