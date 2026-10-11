import { configureStore } from "@reduxjs/toolkit";
import ticketFiltersReducer from "@/features/tickets/ticket-filters-slice";
import { ticketsApi } from "@/features/tickets/tickets-api";

export function makeStore() {
  return configureStore({
    reducer: {
      ticketFilters: ticketFiltersReducer,
      [ticketsApi.reducerPath]: ticketsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(ticketsApi.middleware),
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];