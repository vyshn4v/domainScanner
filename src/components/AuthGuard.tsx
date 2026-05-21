// @deprecated — This file is NOT imported anywhere in the app.
// The active AuthGuard is src/guard/AuthGuard.tsx
// This file is kept for reference only and should not be modified.
import { useEffect, useState, type ReactNode, createContext } from "react";
import api from "../lib/api";
import { Outlet, useLocation } from "react-router";
import type { AuthContextType } from "./util/authProvider";

const SSO_VALIDATE_URL = `${import.meta.env.VITE_SSO_URL}/auth/validate`;

function getRedirectTarget() {
  return window.location.origin;
}

function buildSsoUrl() {
  return `${SSO_VALIDATE_URL}?redirect=${encodeURIComponent(getRedirectTarget())}`;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthGuard({ children }: { children?: ReactNode }) {
  const API_BASE_URL = window.location.origin;
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AuthContextType | null>(() =>
    JSON.parse(sessionStorage.getItem("user") || "null"),
  );
  const [isExcludedPage, setIsExcludedPage] = useState(false);
  const allowedPaths = ["/"];
  useEffect(() => {
    if (allowedPaths.includes(location?.pathname || "")) {
      setIsExcludedPage(true);
      return;
    }
    if (user) {
      setLoading(false);
      return;
    }
    api
      .get(`${import.meta.env.VITE_SCANNER_URL}/auth/validate`, {
        withCredentials: true,
      })
      .then((res) => {
        setUser(res.data);
        sessionStorage.setItem("user", JSON.stringify(res.data));
        // setIsAuthenticated(true);
      })
      .catch(() => {
        window.location.href = buildSsoUrl();
        return null;
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const checkVersion = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/version.json?t=${Date.now()}`,
        ).then((res) => res.json());
        const oldVersion = localStorage.getItem("appVersion");
        const theme = localStorage.getItem("theme");
        if (!theme) {
          localStorage.setItem("theme", res.theme);
          window.location.reload();
          return;
        }
        if (!oldVersion) {
          localStorage.setItem("appVersion", res.version);
          return;
        }
        if (res.version !== oldVersion) {
          localStorage.setItem("appVersion", res.version);
          window.location.reload();
        }
      } catch (err) {
        console.error(err);
      }
    };

    checkVersion();

    const interval = setInterval(checkVersion, 60000);

    return () => clearInterval(interval);
  }, []);
  if (isExcludedPage) {
    return (
      <AuthContext.Provider value={user}>
        {children ? children : <Outlet />}
      </AuthContext.Provider>
    );
  }
  if (loading) {
    return <>Loading......</>;
  }
  if (!user) {
    return null;
  }
  return (
    <AuthContext.Provider value={user}>
      {children ? children : <Outlet />}
    </AuthContext.Provider>
  );
}
