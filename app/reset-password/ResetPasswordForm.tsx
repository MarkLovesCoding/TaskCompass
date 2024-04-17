"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
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
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
    password: passwordSchema,
    passwordConfirm: z.string().min(8),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"],
  });

// import { useSession } from "next-auth/react";
interface FormData {
  password: string;
  passwordConfirm: string;
}

const ResetPasswordForm = ({ params }: any) => {
  const router = useRouter();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await fetch("/api/auth/verify-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: params.token }),
        });
        if (res.status === 400) {
          setErrorMessage("Token is invalid or has expired.");

          router.push("/forgot-password");
        }
        if (res.status === 200) {
          setErrorMessage("");
          router.push("/login");
        }
      } catch (error) {
        setErrorMessage("Token is invalid or has expired.");
        console.log(error);
      }
    };
    verifyToken();
  }, [params.token]);

  const [errorMessage, setErrorMessage] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      passwordConfirm: "",
    },
  });
  const handleResetPasswordSubmit = async (values: FormData) => {
    console.log("values", values);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      console.log("res", res.body);
      if (res.status == 400) {
        setErrorMessage("Error resetting password.");
      }
      if (res.status === 200) {
        setErrorMessage("Password reset successfully.");
        setTimeout(() => {
          router.push("/login");
        }, 1000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-extrabold mb-6">Reset your password</h2>
      {/* <h3 className="text-xl font-bold mb-4">
        {`   No prob! We'll send you a link to the email associated with the account.`}
      </h3> */}

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
            Send Reset Email
          </Button>
        </form>
      </Form>

      <p className="text-red-500">{errorMessage}</p>
    </div>
  );
};

export default ResetPasswordForm;
