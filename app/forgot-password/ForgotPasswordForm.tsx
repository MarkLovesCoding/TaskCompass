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
type ErrorType = "Error" | "Success";

const formSchema = z.object({
  email: z.string().email().min(5),
});

const ForgotPasswordForm = () => {
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<ErrorType>("Error");

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
        setMessageType("Error");
        setMessage("User with this email is not registered.");
      }
      if (res.status === 200) {
        setMessageType("Success");
        setMessage("Password reset link sent to your email.");
      } else {
        setMessageType("Error");
        setMessage("Something went wrong. Please try again in a minute.");
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
      <div
        className={`w-fit items-center mb-4 ${!message ? " hidden" : "flex "} ${
          messageType == "Error" ? "bg-red-500/20 " : "bg-green-500/20 "
        }bg-accent justify-center`}
      >
        <p
          className={`px-2 ${
            messageType == "Error" ? "text-red-500" : "text-green-500"
          }`}
        >
          {message}
        </p>
      </div>

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
