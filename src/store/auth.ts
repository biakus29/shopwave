// Auth is now handled by Supabase SSR.
// This store is kept for client-side caching of profile data only.
// The source of truth is the Supabase session (cookies), not this store.

import { create } from "zustand";
import { Profile } from "@/lib/supabase";

interface AuthStore {
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
}

export const useAuthStore = create<AuthStore>()((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
}));
