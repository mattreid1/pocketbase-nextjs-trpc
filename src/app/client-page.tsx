"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export function ClientDemoCard() {
  const { user, loading, logout } = useAuth();

  return (
    <Card className="max-w-[400px]">
      <CardHeader>
        <CardTitle>Getting Started</CardTitle>
        <CardDescription>Read the README to get started.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-2">
        {loading ? (
          <div className="flex items-center justify-center py-2">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : user ? (
          <div>Hey, {user.email}!</div>
        ) : (
          <div>Not logged in</div>
        )}
        <div>
          This project is a starter that gets many basic things set up,
          including Pocketbase, shadcn/ui, the Next.js App Router, and tRPC.
          Speed run the setup for your project by using this template!
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full flex-row gap-2">
          {!loading &&
            (user ? (
              <Button onClick={logout} className="w-full">
                Logout
              </Button>
            ) : (
              <Link href="/login" className="w-full">
                <Button className="w-full">Login</Button>
              </Link>
            ))}
        </div>
      </CardFooter>
    </Card>
  );
}
