import { configureStore } from "@reduxjs/toolkit";
import ticketFiltersReducer from "@/features/tickets/ticket-filters-slice";

export function makeStore() {
  return configureStore({
    reducer: {
      ticketFilters: ticketFiltersReducer,
    },
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];