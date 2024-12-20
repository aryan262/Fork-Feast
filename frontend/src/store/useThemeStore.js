import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useThemeStore = create()(
  persist(
    (set) => ({
      theme: "light",
      setTheme: (theme) => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(theme);
        localStorage.setItem("vite-ui-theme", theme);
        set({ theme });
      },
      loadThemeFromStorage: (storageKey, defaultTheme) => {
        const storedTheme = localStorage.getItem(storageKey) || defaultTheme;
        set({ theme: storedTheme });
      },
      initializeTheme: () => {
        if (typeof window !== "undefined") {
          const storedTheme = localStorage.getItem("vite-ui-theme");
          const themeToApply = storedTheme || "light";

          const root = window.document.documentElement;
          root.classList.remove("light", "dark");
          root.classList.add(themeToApply);

          set({ theme: themeToApply });
        }
      },
    }),
    {
      name: "theme-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
