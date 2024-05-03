"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { toast } from "sonner";
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
  const [disableButtons, setDisableButtons] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(10); // Countdown in seconds

  //
  useEffect(() => {
    let countdownTimer: NodeJS.Timeout;

    if (disableButtons && countdown > 0) {
      // Start countdown timer
      countdownTimer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }

    // Cleanup function
    return () => clearInterval(countdownTimer);
  }, [disableButtons, countdown]);

  useEffect(() => {
    if (countdown === 0) {
      // Enable buttons after countdown reaches 0
      setDisableButtons(false);
      setCountdown(30);
    }
  }, [countdown]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  const waitThirtySecondsToEnableButtons = () => {
    setTimeout(() => {
      setDisableButtons(false);
    }, 30000);
  };
  const waitToResetMessage = (seconds: number) => {
    setTimeout(() => {
      setMessage("");
    }, seconds * 1000);
  };
  const handleForgotEmailSubmit = async (values: FormData) => {
    setDisableButtons(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (res.status == 200) {
        setMessageType("Success");
        setMessage("Password reset link sent to your email.");
        toast.success("Password reset link sent to your email.");
        waitToResetMessage(5);

        // setDisableButtons(false);
      } else if (res.status == 500) {
        res.json().then((data) => {
          setMessageType("Error");
          setMessage(data.message);
          toast.error(data.message);
          waitToResetMessage(5);
        });
        // setDisableButtons(false);
      }
    } catch (error) {
      console.log(error);
      setMessageType("Error");
      setMessage("Error sending forgot password email, please try again.");
      toast.error("Error sending forgot password email, please try again.");
      waitToResetMessage(5);
    }
    waitThirtySecondsToEnableButtons();
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
            disabled={disableButtons}
          >
            {disableButtons
              ? `Send Reset Email (${countdown}s)`
              : "Send Reset Email"}
          </Button>
        </form>
      </Form>

      <div>
        <Link
          // className={`${disableButtons == true ? "" : "block"}`}
          href={`${disableButtons == true ? "/registration" : "#"}`}
        >
          <p className="text-center text-sm font-medium text-primary hover:text-primary-dark">
            Back to Sign In
          </p>
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
