"use client";

import { useEffect, useState } from "react";
import PocketBase from "pocketbase";
import { env } from "@/env";
import { type UserRecord } from "@/pocketbase/user";
import { clearAuthCookie } from "@/app/actions";

const pb = new PocketBase(env.NEXT_PUBLIC_POCKETBASE_URL);

function setAuthCookie() {
  document.cookie = pb.authStore.exportToCookie({
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
}

export function useAuth() {
  const [user, setUser] = useState<UserRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = pb.authStore.onChange((_token, model) => {
      setUser(model ? (model as UserRecord) : null);
    });

    const refreshAuth = async () => {
      try {
        if (pb.authStore.isValid) {
          await pb.collection("users").authRefresh();
          setAuthCookie();
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
        pb.authStore.clear();
      } finally {
        setLoading(false);
      }
    };

    void refreshAuth();

    return () => {
      unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const authData = await pb
      .collection("users")
      .authWithPassword(email, password);

    setAuthCookie();

    return authData;
  };

  const logout = () => {
    pb.authStore.clear();
    clearAuthCookie().catch(console.error);
  };

  return {
    user,
    loading,
    login,
    logout,
    pb,
  };
}
