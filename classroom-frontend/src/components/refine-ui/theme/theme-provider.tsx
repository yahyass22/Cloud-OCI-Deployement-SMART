"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "ocean" | "forest" | "rose" | "amber" | "violet" | "default";
type Mode = "dark" | "light";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultMode?: Mode;
  storageKey?: string;
  modeStorageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  mode: Mode;
  setTheme: (theme: Theme) => void;
  setMode: (mode: Mode) => void;
};

const initialState: ThemeProviderState = {
  theme: "default",
  mode: "light",
  setTheme: () => null,
  setMode: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "default",
  defaultMode = "light",
  storageKey = "refine-ui-theme",
  modeStorageKey = "refine-ui-mode",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );
  const [mode, setMode] = useState<Mode>(
    () => (localStorage.getItem(modeStorageKey) as Mode) || defaultMode
  );

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove existing mode classes
    root.classList.remove("light", "dark");
    // Add current mode class
    root.classList.add(mode);

    // Handle accent theme
    if (theme === "default") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", theme);
    }
  }, [theme, mode]);

  const value = {
    theme,
    mode,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    setMode: (mode: Mode) => {
      localStorage.setItem(modeStorageKey, mode);
      setMode(mode);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    console.error("useTheme must be used within a ThemeProvider");
  }

  return context;
}

ThemeProvider.displayName = "ThemeProvider";
