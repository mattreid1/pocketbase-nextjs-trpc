"use client";

import { useEffect, useState } from "react";
import PocketBase from "pocketbase";
import { env } from "@/env";
import { type UserRecord } from "@/pocketbase/user";
import { clearAuthCookie } from "@/app/actions";

const pb = new PocketBase(env.NEXT_PUBLIC_POCKETBASE_URL);

export function useAuth() {
  const [user, setUser] = useState<UserRecord>(
    pb.authStore.record as UserRecord
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = pb.authStore.onChange((token, model) => {
      setUser(model as UserRecord);
    });

    // Try to refresh the auth on mount
    const refreshAuth = async () => {
      try {
        if (pb.authStore.isValid) {
          await pb.collection("users").authRefresh();
        }
      } catch (_) {
        pb.authStore.clear();
      } finally {
        setLoading(false);
      }
    };

    refreshAuth().catch(console.error);

    return () => {
      unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const authData = await pb
      .collection("users")
      .authWithPassword(email, password);

    // Set the cookie
    document.cookie = pb.authStore.exportToCookie({
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

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
