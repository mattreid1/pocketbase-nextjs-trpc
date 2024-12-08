"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import PocketBase from "pocketbase";
import { env } from "@/env";
import { useAuth } from "@/hooks/useAuth";

const pb = new PocketBase(env.NEXT_PUBLIC_POCKETBASE_URL);

const signupFormSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8, "Must be at least 8 characters"),
    passwordConfirm: z.string().min(8, "Must be at least 8 characters"),
    firstName: z.string(),
    lastName: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.passwordConfirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["passwordConfirm"],
        message: "Passwords don't match",
      });
    }
  });

type SignupFormType = z.infer<typeof signupFormSchema>;

export default function SignupPage() {
  const { login } = useAuth();
  const router = useRouter();
  const form = useForm<SignupFormType>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
      firstName: "",
      lastName: "",
    },
  });

  const onSubmit = async (data: SignupFormType) => {
    const { email, password, firstName, lastName } = data;

    try {
      // Create the user
      await pb.collection("users").create({
        email,
        password,
        passwordConfirm: password,
        firstName,
        lastName,
      });

      // Log the new user in
      await login(email, password);

      toast.success("Account created successfully! Redirecting...");

      // Redirect to home page
      router.replace("/");
    } catch (error) {
      console.error(error);
      toast.error("Error creating account");
      form.reset(data);
    }
  };

  return (
    <div className="col-span-12 flex flex-col items-center p-2 pt-8 md:col-span-6 md:col-start-4 lg:col-span-4 lg:col-start-5 2xl:col-span-2 2xl:col-start-6">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Form {...form}>
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-xl">Sign Up</CardTitle>
              <CardDescription>
                Create an account to get started.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} required placeholder="John" />
                          </FormControl>
                          <FormDescription />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} required placeholder="Doe" />
                          </FormControl>
                          <FormDescription />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            required
                            placeholder="example@gmail.com"
                          />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" required />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="passwordConfirm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" required />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex w-full flex-col gap-4 text-center text-sm">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    !form.formState.isValid || form.formState.isSubmitting
                  }
                >
                  {form.formState.isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create account
                </Button>
                <div>
                  Already have an account?{" "}
                  <Link href="/login" className="underline">
                    Sign in
                  </Link>
                </div>
              </div>
            </CardFooter>
          </Card>
        </Form>
      </form>
    </div>
  );
}
