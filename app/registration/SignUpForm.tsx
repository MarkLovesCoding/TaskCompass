import React, { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";

import { signIn } from "next-auth/react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";
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
    name: z.string().min(5).max(30),
    email: z.string().email().min(5),
    password: passwordSchema,
    passwordConfirm: passwordSchema,
    role: z.string().min(1),
    firstLogIn: z.boolean(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"],
  });
type ErrorType = "Error" | "Success";
const SignUpForm = () => {
  const router = useRouter();

  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<ErrorType>("Error");
  const [disableButtons, setDisableButtons] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "Email User",
      firstLogIn: true,
    },
  });
  const onSignUpSubmit = async (values: z.infer<typeof formSchema>) => {
    // try {
    setDisableButtons(true);
    const res = await fetch("/api/sign-up", {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      // await createNewEmailUserAction(values);
      toast.success("User Created Successfully!");

      try {
        await signIn("credentials", {
          email: values.email,
          password: values.password,
        });
        setTimeout(() => {
          toast.success("Signing In...");
        }, 800);
        setMessage("Signing in...");
        setMessageType("Success");
        // toast.success("User Created Successfully!");
        setDisableButtons(false);

        router.push("/");
      } catch (error: any) {
        console.error(error);
        setMessage(error);
        setMessageType("Error");
        toast.error("Error Signing In User");
      }
    } else {
      const response = await res.json();
      setMessageType("Error");
      setMessage(response.message);
      toast.error(response.message);
      setDisableButtons(false);
    }
  };

  const handleGoogleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setDisableButtons(true);
    const loginResponse = await signIn("google", { redirect: false });
    // Check for login error
    if (loginResponse && loginResponse.error) {
      setMessage(loginResponse?.error);
      setMessageType("Error");

      toast.error(loginResponse.error);
      setDisableButtons(false);
    } else {
      // Successful login
      toast.success("Logging in through Google...");
      setMessageType("Success");
      setDisableButtons(false);

      router.push("/");
    }
  };

  const handleGithubSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setDisableButtons(true);
    toast("Signing In through GitHub...");

    const loginResponse = await signIn("github");
    // Check for login error

    if (loginResponse && loginResponse.error) {
      setMessage(loginResponse?.error);
      setMessageType("Error");
      toast.error(loginResponse.error);
      setDisableButtons(false);
    } else {
      // Successful login

      toast.success("Logging in through GitHub...");
      setDisableButtons(false);

      router.push("/");
    }
  };
  return (
    <div className="max-w-[100%]">
      <div className="flex flex-row justify-between">
        <h2 className="text-3xl font-extrabold mb-6">Register</h2>
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
            value="Create User"
            className="w-full mt-4 py-2 rounded-md"
          >
            Register
          </Button>
        </form>
      </Form>
      <div className="flex justify-center">
        <form className="mt-4 mr-2 w-[50%]" onSubmit={handleGoogleSubmit}>
          <Button
            type="submit"
            value="Google SignIn"
            className="w-full   py-2 rounded-md"
          >
            <FontAwesomeIcon icon={faGoogle} />
          </Button>
        </form>
        <form className="mt-4 ml-2 w-[50%]" onSubmit={handleGithubSubmit}>
          <Button
            type="submit"
            value="Github SignIn"
            className="w-full   py-2 rounded-md"
          >
            <FontAwesomeIcon icon={faGithub} />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
