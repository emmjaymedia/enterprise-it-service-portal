import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
export type Context = "employee" | "agent";
export type Preferences = {
  language: string;
  timezone: string;
  dateFormat: string;
  email: boolean;
  inApp: boolean;
  digest: boolean;
};
export const defaultPreferences: Preferences = {
  language: "English",
  timezone: "Africa/Lagos",
  dateFormat: "DD/MM/YYYY",
  email: true,
  inApp: true,
  digest: false,
};
export type Notice = {
  id: string;
  context: Context;
  category: "Ticket updates" | "System" | "Knowledge";
  title: string;
  body: string;
  at: string;
  href: string | null;
  read: boolean;
};
const initialState = {
  context: "employee" as Context,
  session: "preview" as
    "preview" | "challenge" | "verified" | "expired" | "signed-out",
  challengeEmail: "",
  challengeAttempts: 0,
  challengeExpires: 0,
  resetActive: false,
  resetUsed: false,
  preferences: {
    employee: { ...defaultPreferences },
    agent: { ...defaultPreferences },
  },
  revoked: [] as string[],
  recent: { employee: [] as string[], agent: [] as string[] },
  notices: [
    {
      id: "n1",
      context: "employee",
      category: "Ticket updates",
      title: "A public update on your VPN issue",
      body: "IT Support has asked which network you are using.",
      at: "2026-10-19T09:30:00Z",
      href: "/portal/tickets/INC-1042",
      read: false,
    },
    {
      id: "n2",
      context: "employee",
      category: "Ticket updates",
      title: "Your Figma license is ready",
      body: "Review the solution and confirm if your access works.",
      at: "2026-10-18T14:00:00Z",
      href: "/portal/tickets/REQ-1039",
      read: false,
    },
    {
      id: "n3",
      context: "employee",
      category: "System",
      title: "A related record is unavailable",
      body: "The linked item is no longer available in this demo.",
      at: "2026-10-18T12:00:00Z",
      href: null,
      read: false,
    },
    {
      id: "n4",
      context: "employee",
      category: "Knowledge",
      title: "VPN troubleshooting guide updated",
      body: "Review the self-help steps before submitting another issue.",
      at: "2026-10-17T10:00:00Z",
      href: "/portal#guides",
      read: true,
    },
    {
      id: "a1",
      context: "agent",
      category: "Ticket updates",
      title: "Major incident needs review",
      body: "Open the agent record to review current service impact.",
      at: "2026-10-19T09:00:00Z",
      href: "/workspace/tickets/INC-1044",
      read: false,
    },
    {
      id: "a2",
      context: "agent",
      category: "System",
      title: "Workspace demo refreshed",
      body: "Queue records are ready for frontend review.",
      at: "2026-10-18T10:00:00Z",
      href: "/workspace",
      read: true,
    },
  ] as Notice[],
};
const slice = createSlice({
  name: "shared",
  initialState,
  reducers: {
    setContext(state, action: PayloadAction<Context>) {
      state.context = action.payload;
    },
    startChallenge(
      state,
      action: PayloadAction<{ email: string; expires: number }>,
    ) {
      state.session = "challenge";
      state.challengeEmail = action.payload.email;
      state.challengeAttempts = 0;
      state.challengeExpires = action.payload.expires;
    },
    failChallenge(state) {
      state.challengeAttempts += 1;
    },
    renewChallenge(state, action: PayloadAction<number>) {
      if (state.session === "challenge" && state.challengeAttempts < 3)
        state.challengeExpires = action.payload;
    },
    verifySession(state) {
      if (state.session === "challenge" && state.challengeAttempts < 3) {
        state.session = "verified";
        state.challengeEmail = "";
      }
    },
    setSession(state, action: PayloadAction<"expired" | "signed-out">) {
      state.session = action.payload;
      state.challengeEmail = "";
      state.challengeExpires = 0;
    },
    startReset(state) {
      state.resetActive = true;
      state.resetUsed = false;
    },
    completeReset(state) {
      state.resetActive = false;
      state.resetUsed = true;
    },
    savePreferences(
      state,
      action: PayloadAction<{ context: Context; value: Preferences }>,
    ) {
      state.preferences[action.payload.context] = action.payload.value;
    },
    revokeSession(state, action: PayloadAction<string>) {
      if (!state.revoked.includes(action.payload))
        state.revoked.push(action.payload);
    },
    markRead(
      state,
      action: PayloadAction<{ context: Context; ids: string[] }>,
    ) {
      state.notices.forEach((n) => {
        if (
          n.context === action.payload.context &&
          action.payload.ids.includes(n.id)
        )
          n.read = true;
      });
    },
    clearRead(state, action: PayloadAction<Context>) {
      state.notices = state.notices.filter(
        (n) => n.context !== action.payload || !n.read,
      );
    },
    rememberSearch(
      state,
      action: PayloadAction<{ context: Context; query: string }>,
    ) {
      const { context, query } = action.payload;
      if (query.trim())
        state.recent[context] = [
          query.trim(),
          ...state.recent[context].filter((q) => q !== query.trim()),
        ].slice(0, 5);
    },
    clearSearches(state, action: PayloadAction<Context>) {
      state.recent[action.payload] = [];
    },
  },
});
export const {
  setContext,
  startChallenge,
  failChallenge,
  renewChallenge,
  verifySession,
  setSession,
  startReset,
  completeReset,
  savePreferences,
  revokeSession,
  markRead,
  clearRead,
  rememberSearch,
  clearSearches,
} = slice.actions;
export default slice.reducer;
export const identities = {
  employee: {
    name: "Amina Yusuf",
    initials: "AY",
    email: "amina.yusuf@company.example",
    role: "Sales Lead",
    department: "Global Sales EMEA",
  },
  agent: {
    name: "Daniel Cole",
    initials: "DC",
    email: "daniel.cole@company.example",
    role: "Support Specialist",
    department: "Network Operations",
  },
};
