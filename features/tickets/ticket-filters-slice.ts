import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type TicketStatusFilter =
  | "All"
  | "Open"
  | "In progress"
  | "Resolved";

type TicketFiltersState = {
  status: TicketStatusFilter;
};

const initialState: TicketFiltersState = {
  status: "All",
};

const ticketFiltersSlice = createSlice({
  name: "ticketFilters",
  initialState,
  reducers: {
    statusFilterChanged(
      state,
      action: PayloadAction<TicketStatusFilter>,
    ) {
      state.status = action.payload;
    },
  },
  selectors: {
    selectStatusFilter: (state) => state.status,
  },
});

export const { statusFilterChanged } = ticketFiltersSlice.actions;
export const { selectStatusFilter } = ticketFiltersSlice.selectors;
export default ticketFiltersSlice.reducer;