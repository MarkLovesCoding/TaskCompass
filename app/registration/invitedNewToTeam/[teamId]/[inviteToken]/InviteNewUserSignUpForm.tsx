"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { signUpNewUserAddToTeamAction } from "./_actions/_actions/sign-up-new-user-add-to-team.action";

import type { TInvitedUser } from "@/entities/Team";

const formSchema = z.object({
  name: z.string().min(5).max(30),
  email: z.string().email().min(5),
  password: z.string().min(6),
  role: z.string().min(1),
  firstLogIn: z.boolean(),
});
type ErrorType = "Error" | "Success";
const InviteNewUserSignUpForm = ({
  invitedUser,
}: {
  invitedUser: TInvitedUser;
}) => {
  const router = useRouter();
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<ErrorType>("Error");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: invitedUser.email,
      password: "",
      role: "Email User",
      firstLogIn: true,
    },
  });
  const onSignUpSubmit = async (values: z.infer<typeof formSchema>) => {
    // e.preventDefault();

    try {
      await signUpNewUserAddToTeamAction(invitedUser, values);

      setMessage("Signing in...");
      setMessageType("Success");
      toast.success("User Created Successfully!");
      toast.success("Signing In User...");
      await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      router.push("/");
    } catch (error: any) {
      console.error(error);
      setMessage(error);
      setMessageType("Error");
      toast.error("Error Signing In User");
    }
  };

  return (
    <div className="max-w-[100%]">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col justify-start mb-6">
          <h2 className="text-3xl font-extrabold mb-6">
            Welcome to TaskCompass
          </h2>
          <p>To join the team, please register below:</p>
        </div>
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
        <form onSubmit={form.handleSubmit(onSignUpSubmit)} method="post">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => {
              return (
                <FormItem className="mt-1">
                  <div className="flex mt-1 flex-row justify-start space-x-4 items-center">
                    <FormLabel>Username</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Input
                      placeholder="Type in username"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => {
              return (
                <FormItem className="mt-4">
                  <div className="flex  flex-row justify-start space-x-4 items-center">
                    <FormLabel>Email</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Input
                      disabled={true}
                      placeholder="Type in email"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              );
            }}
          />{" "}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => {
              return (
                <FormItem className="mt-4">
                  <div className="flex flex-row justify-start space-x-4 items-center">
                    <FormLabel>Password</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Input
                      placeholder="Type in password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              );
            }}
          />
          <Button
            type="submit"
            value="Create User"
            className="w-full mt-4 py-2 rounded-md"
          >
            Register
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default InviteNewUserSignUpForm;
