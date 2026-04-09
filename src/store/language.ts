import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language = "en" | "fr";

interface LanguageStore {
  language: Language;
  setLanguage: (language: Language) => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: "fr", // Default to French as requested previously, but supporting both
      setLanguage: (language) => set({ language }),
    }),
    {
      name: "language-storage",
    }
  )
);
