import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { QueueFilters } from "./queue-filters";
export type SavedView = {
  id: string;
  name: string;
  filters: QueueFilters;
  columns: string[];
};
export type ComposerDraft = {
  public: string;
  internal: string;
  publicAttachments: string[];
  internalAttachments: string[];
};
const initialState: {
  views: SavedView[];
  drafts: Record<string, ComposerDraft>;
} = { views: [], drafts: {} };
const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    viewSaved(state, action: PayloadAction<SavedView>) {
      state.views.push(action.payload);
    },
    viewDeleted(state, action: PayloadAction<string>) {
      state.views = state.views.filter((v) => v.id !== action.payload);
    },
    draftSaved(
      state,
      action: PayloadAction<{ id: string; draft: ComposerDraft }>,
    ) {
      state.drafts[action.payload.id] = action.payload.draft;
    },
  },
});
export const { viewSaved, viewDeleted, draftSaved } = workspaceSlice.actions;
export default workspaceSlice.reducer;
