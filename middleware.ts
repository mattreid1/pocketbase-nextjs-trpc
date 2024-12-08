import { env } from "@/env";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import PocketBase from "pocketbase";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Create a new PocketBase instance for this request
  const pb = new PocketBase(env.POCKETBASE_URL);

  // Load the auth store from the cookie
  pb.authStore.loadFromCookie(request.headers.get("cookie") ?? "");

  try {
    // If we have a valid auth, try to refresh it
    if (pb.authStore.isValid) {
      await pb.collection("users").authRefresh();

      // Update the cookie with the new auth data
      response.headers.set(
        "set-cookie",
        pb.authStore.exportToCookie({
          secure: process.env.NODE_ENV === "production",
          sameSite: "Strict",
          httpOnly: false,
        })
      );
    }
  } catch (_) {
    // Clear the auth store and cookie on failed refresh
    pb.authStore.clear();
    response.headers.set("set-cookie", pb.authStore.exportToCookie());
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - public files with extensions (.svg, .jpg, etc)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|.*\\..*$).*)",
  ],
};
