import { Outlet, useLocation } from "react-router";
import { buildSsoUrl } from "../context/AuthProvider";

import { useAuth } from "../customHooks/useAuth";

import type { ReactNode } from "react";

const allowedPaths = ["/"];

export function AuthGuard({ children }: { children?: ReactNode }) {
  const { user, loading } = useAuth();

  const location = useLocation();

  if (allowedPaths.includes(location.pathname)) {
    return children ? <>{children}</> : <Outlet />;
  }

  if (loading) {
    return <>Loading...</>;
  }

  if (!user) {
    window.location.href = buildSsoUrl();

    return null;
  }

  return children ? <>{children}</> : <Outlet />;
}
