import { useEffect, useLayoutEffect, useState, startTransition } from "react";
import type { ReactNode } from "react";
import type { Theme } from "./theme";
import { ThemeContext } from "./theme";

interface ThemeProviderProps {
  children: ReactNode;
}

function resolveTheme(theme: Theme): "light" | "dark" {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return theme;
}

function applyThemeClass(theme: "light" | "dark") {
  const root = window.document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const savedTheme =
    typeof window !== "undefined"
      ? (localStorage.getItem("theme") as Theme | null)
      : null;

  const [theme, setTheme] = useState<Theme>(() => savedTheme || "system");

  const [actualTheme, setActualTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") {
      return "dark";
    }
    return resolveTheme(savedTheme || "system");
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
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      if (theme === "system") {
        const newTheme = mediaQuery.matches ? "dark" : "light";
        setActualTheme(newTheme);
        applyThemeClass(newTheme);
      }
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
