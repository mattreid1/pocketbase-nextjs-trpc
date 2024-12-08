import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import PocketBase from "pocketbase";
import { env } from "@/env";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pb = new PocketBase(env.POCKETBASE_URL);

  pb.authStore.loadFromCookie(cookies().toString());

  if (pb.authStore.isValid && pb.authStore.record) {
    redirect("/");
  }

  return children;
}
