"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface FormData {
  email: string;
}

const formSchema = z.object({
  email: z.string().email().min(5),
});

const ForgotPasswordForm = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleForgotEmailSubmit = async (values: FormData) => {
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (res.status == 400) {
        setErrorMessage("User with this email is not registered.");
      }
      if (res.status === 200) {
        setErrorMessage("Password reset link sent to your email.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-extrabold mb-6">Forgot Your Password?</h2>
      <h3 className="text-xl font-bold mb-4">
        {`   No prob! We'll send you a link to the email associated with the account.`}
      </h3>

      <Form {...form}>
        <form
          className="mb-4"
          onSubmit={form.handleSubmit(handleForgotEmailSubmit)}
          method="post"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => {
              return (
                <FormItem className="mt-2">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Type in email"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />{" "}
          <Button
            type="submit"
            value="Send Reset Email"
            className="mt-4 w-full py-2 rounded-md"
          >
            Send Reset Email
          </Button>
        </form>
      </Form>

      <p className="text-red-500">{errorMessage}</p>
      <div>
        <Link href="/registration">
          <p className="text-center text-sm font-medium text-primary hover:text-primary-dark">
            Back to Sign In
          </p>
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
