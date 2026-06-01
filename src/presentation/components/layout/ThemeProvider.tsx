import { useEffect, useLayoutEffect, useState, startTransition } from "react";
import type { ReactNode } from "react";
import { type Theme, ThemeContext } from "../../../core/hooks/useTheme";

interface ThemeProviderProps {
  children: ReactNode;
}

function resolveTheme(theme: Theme): "light" | "dark" {
  if (theme === "system") {
    if (typeof window === "undefined" || !window.matchMedia) {
      return "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return theme;
}

function applyThemeClass(theme: "light" | "dark") {
  const root = window.document.documentElement;
  root.classList.remove("light");
  root.classList.remove("dark");
  root.classList.add(theme);
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme") as Theme | null;
      return saved || "system";
    }
    return "system";
  });

  const [actualTheme, setActualTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") {
      return "dark";
    }
    const saved = localStorage.getItem("theme") as Theme | null;
    return resolveTheme(saved || "system");
  });

  useLayoutEffect(() => {
    const nextTheme = resolveTheme(theme);
    startTransition(() => setActualTheme(nextTheme));
    applyThemeClass(nextTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      const newTheme = e.matches ? "dark" : "light";
      setActualTheme(newTheme);
      applyThemeClass(newTheme);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, actualTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
