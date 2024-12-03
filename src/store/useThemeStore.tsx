import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeStore {
  themeStyle: string;
  setThemeStyle: (theme: string) => void;
}

export const useThemeStore = create(
  persist<ThemeStore>(
    (set) => ({
      themeStyle: "light-dark",
      setThemeStyle: (theme) => set(() => ({ themeStyle: theme })),
    }),
    { name: "theme-style" }
  )
);
