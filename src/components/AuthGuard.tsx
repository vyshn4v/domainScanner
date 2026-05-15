import { useEffect, useMemo, useState, type ReactNode } from "react";
import api from "../lib/api";
import { useLocation } from "react-router";

const SSO_VALIDATE_URL = `${import.meta.env.VITE_SSO_URL}/auth/validate`;

function getRedirectTarget() {
  return window.location.origin;
}

function buildSsoUrl() {
  return `${SSO_VALIDATE_URL}?redirect=${encodeURIComponent(getRedirectTarget())}`;
}

export function AuthGuard({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<object | null>(() =>
    JSON.parse(sessionStorage.getItem("user") || "null"),
  );
  const [isExcludedPage, setIsExcludedPage] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  console.log("AuthGuard - User:", user);
  console.log("pathname:", location.pathname);
  const allowedPaths = ["/", "/profile"];
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
        setIsAuthenticated(true);
      })
      .catch(() => {
        window.location.href = buildSsoUrl();
        return null;
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  if (isExcludedPage) {
    return <>{children}</>;
  }
  if (loading) {
    return <>Loading......</>;
  }
  if (!user) {
    return null;
  }
  return <>{children}</>;
}
