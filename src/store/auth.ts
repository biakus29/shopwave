// Auth is now handled by Firebase.
// Supabase is used only as a Database, referencing Firebase UIDs.

import { create } from "zustand";
import { User as FirebaseUser } from "firebase/auth";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: "admin" | "vendor" | "customer";
  created_at: string;
}

interface AuthStore {
  user: FirebaseUser | null;
  profile: Profile | null;
  loading: boolean;
  setUser: (user: FirebaseUser | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  profile: null,
  loading: true,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
}));
