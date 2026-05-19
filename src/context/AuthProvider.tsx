import { createContext, useEffect, useState, type ReactNode } from "react";

import api from "../lib/api";

const SSO_VALIDATE_URL = `${import.meta.env.VITE_SSO_URL}/auth/validate`;

function getRedirectTarget() {
  return window.location.origin;
}

export function buildSsoUrl() {
  return `${SSO_VALIDATE_URL}?redirect=${encodeURIComponent(
    getRedirectTarget(),
  )}`;
}

export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  isdbSynced: boolean;
  allowedApps: Record<string, number>;
};

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export const AuthContext = createContext<AuthContextType | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(() =>
    JSON.parse(sessionStorage.getItem("user") || "null"),
  );

  useEffect(() => {
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
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
