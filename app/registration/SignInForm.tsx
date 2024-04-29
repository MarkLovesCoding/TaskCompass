"use client";
import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
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
import { faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const formSchema = z.object({
  email: z.string().email().min(5),
  password: z.string().min(6),
});

// import { useSession } from "next-auth/react";
interface FormData {
  name?: string;
  email?: string;
  password?: string;
  role: string;
  firstLogIn: boolean;
}
type ErrorType = "Error" | "Success";
const SignInForm = () => {
  const router = useRouter();

  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<ErrorType>("Error");
  const [disableButtons, setDisableButtons] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSignInSubmit = async (values: z.infer<typeof formSchema>) => {
    setDisableButtons(true);
    const loginResponse = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false, // Do not redirect automatically
    });
    setDisableButtons(false);

    if (loginResponse?.error && loginResponse.error == "CredentialsSignin") {
      setMessage("Incorrect Credentials.");
      setMessageType("Error");
      // toast.error("Incorrect Credentials.");
    } else if (loginResponse?.error) {
      setMessage(loginResponse?.error);
      setMessageType("Error");

      // toast.error(loginResponse?.error);
    } else {
      setMessage("Success!");
      setMessageType("Success");

      toast.success("Successfully Logged In. Loading profile...");
      // Successful login
      router.push("/");
    }
  };
  const handleGoogleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setDisableButtons(true);
    const loginResponse = await signIn("google", { redirect: false });
    setDisableButtons(false);
    // Check for login error
    if (loginResponse && loginResponse.error) {
      setMessage(loginResponse?.error);
      setMessageType("Error");

      toast.error(loginResponse.error);
    } else {
      // Successful login
      toast.success("Logging in through Google...");
      setMessageType("Success");
      router.push("/");
    }
  };

  const handleGithubSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setDisableButtons(true);

    // Attempt to sign in with GitHub
    const loginResponse = await signIn("github");
    // Check for login error
    setDisableButtons(false);

    if (loginResponse && loginResponse.error) {
      setMessage(loginResponse?.error);
      setMessageType("Error");
      toast.error(loginResponse.error);
    } else {
      // Successful login

      toast.success("Logging in through GitHub...");
      router.push("/");
    }

    // Handle the error as needed
  };

  return (
    <div>
      <div className="flex flex-row justify-between">
        <h2 className="text-3xl font-extrabold mb-6">Sign In</h2>
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
          onSubmit={form.handleSubmit(onSignInSubmit)}
          method="post"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => {
              return (
                <FormItem className="mt-1">
                  <div className="flex mt-1 flex-row justify-start space-x-4 items-center">
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
                  <div className="flex mt-1 flex-row justify-start space-x-4 items-center">
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
            className="mt-4 w-full py-2 rounded-md"
            disabled={disableButtons}
          >
            Sign In
          </Button>
        </form>
      </Form>
      <div className="mt-4 flex justify-center">
        <form className="mt-4 mr-2 w-[50%]" onSubmit={handleGoogleSubmit}>
          <Button
            type="submit"
            value="Google SignIn"
            className="w-full   py-2 rounded-md"
            disabled={disableButtons}
          >
            <FontAwesomeIcon icon={faGoogle} />
          </Button>
        </form>
        <form className="mt-4 ml-2 w-[50%]" onSubmit={handleGithubSubmit}>
          <Button
            type="submit"
            value="Github SignIn"
            className="w-full   py-2 rounded-md"
            disabled={disableButtons}
          >
            <FontAwesomeIcon icon={faGithub} />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SignInForm;
