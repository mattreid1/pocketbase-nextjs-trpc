"use server";

import { cookies } from "next/headers";

export async function clearAuthCookie() {
  cookies().delete("pb_auth");
}
