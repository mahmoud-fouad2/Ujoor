import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

import { apiFetch } from "@/lib/api";
import { clearStoredAccessToken, getStoredAccessToken, setStoredAccessToken } from "@/lib/auth-storage";

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  role: string;
  tenantId: string | null;
  employeeId: string | null;
};

type AuthState = {
  loading: boolean;
  accessToken: string | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const token = await getStoredAccessToken();
        if (!mounted) return;
        if (token) {
          setAccessToken(token);
          try {
            const me = await apiFetch("/api/mobile/me", { token });
            setUser(me.data as User);
          } catch {
            await clearStoredAccessToken();
            setAccessToken(null);
            setUser(null);
          }
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const res = await apiFetch("/api/mobile/auth/login", {
      init: {
        method: "POST",
        body: JSON.stringify({ email, password }),
      },
    });

    const token = res?.data?.accessToken as string | undefined;
    const nextUser = res?.data?.user as User | undefined;
    if (!token || !nextUser) throw new Error("Login failed");

    await setStoredAccessToken(token);
    setAccessToken(token);
    setUser(nextUser);
  };

  const signOut = async () => {
    await clearStoredAccessToken();
    setAccessToken(null);
    setUser(null);
  };

  const value = useMemo<AuthState>(
    () => ({ loading, accessToken, user, signIn, signOut }),
    [loading, accessToken, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
