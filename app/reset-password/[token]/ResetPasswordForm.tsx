"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import * as z from "zod";
import { useForm } from "react-hook-form";
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

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter",
  })
  .regex(/[0-9]/, { message: "Password must contain at least one number" });

const formSchema = z
  .object({
    userId: z.string(),
    password: passwordSchema,
    passwordConfirm: z.string().min(8),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"],
  });

interface FormData {
  userId: string;
  password: string;
  passwordConfirm: string;
}
type ErrorType = "Error" | "Success";

const ResetPasswordForm = ({ token }: { token: string }) => {
  const [userId, setUserId] = useState<string>("");
  const router = useRouter();
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<ErrorType>("Error");

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await fetch("/api/auth/verify-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: token }),
        });
        // const temp = await res.json();
        if (res.status === 400) {
          setMessageType("Error");
          setMessage("Token is invalid or has expired.");

          router.push("/forgot-password");
        }
        if (res.status === 200) {
          const user = await res.json();
          setMessageType("Success");
          setMessage(`Hi ${user.name}. Please reset your password.`);
          setUserId(user._id);
          // router.push("/registration");
        }
      } catch (error) {
        setMessageType("Error");
        setMessage("Token is invalid or has expired.");
        console.log(error);
      }
    };
    verifyToken();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "",
      password: "",
      passwordConfirm: "",
    },
  });
  useEffect(() => {
    form.setValue("userId", userId);
  }, [userId]);

  const handleResetPasswordSubmit = async (values: FormData) => {
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (res.status == 400) {
        setMessageType("Error");
        setMessage("Error resetting password.");
      }
      if (res.status === 200) {
        setMessageType("Success");

        setMessage("Password reset successfully.");
        router.push("/registration");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="flex flex-row justify-between">
        <h2 className="text-3xl font-extrabold mb-6">Reset your password</h2>
        <div
          className={`w-fit items-center mb-4 ${
            !message ? " hidden" : "flex "
          } ${
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
      </div>
      <Form {...form}>
        <form
          className="mb-4"
          onSubmit={form.handleSubmit(handleResetPasswordSubmit)}
          method="post"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => {
              return (
                <FormItem className="mt-2">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Type in password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="passwordConfirm"
            render={({ field }) => {
              return (
                <FormItem className="mt-2">
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Type in password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <Button
            type="submit"
            value="Send Reset Email"
            className="mt-4 w-full py-2 rounded-md"
          >
            Reset Password
          </Button>
        </form>
      </Form>

      <div>
        <Link href="/forgot-password">
          <p className="text-center text-sm font-medium text-primary hover:text-primary-dark">
            Back to Forgot Password
          </p>
        </Link>
        <Link href="/registration">
          <p className="text-center text-sm font-medium text-primary hover:text-primary-dark">
            Back to Sign In
          </p>
        </Link>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
