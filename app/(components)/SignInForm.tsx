import { useRouter } from "next/navigation";
import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { signIn } from "next-auth/react";
// import {fa-google} from "@fortawesome/free-solid-svg-icons";
import { faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
const formSchema = z.object({
  email: z.string().email().min(1),
  password: z.string().min(1),
});

// import { useSession } from "next-auth/react";
interface FormData {
  name?: string;
  email?: string;
  password?: string;
  role: string;
  firstLogIn: boolean;
}

const SignInForm = () => {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSignInSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("values", values);
    const loginResponse = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false, // Do not redirect automatically
    });

    if (loginResponse?.error && loginResponse.error == "CredentialsSignin") {
      setErrorMessage("Incorrect Credentials. ");
    } else if (loginResponse?.error) {
      setErrorMessage(loginResponse?.error);
    } else {
      // Successful login
      router.push("/");
    }
  };
  const handleGoogleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const loginResponse = await signIn("google", { redirect: false });
    // Successful login
    if (loginResponse && loginResponse.error)
      setErrorMessage(loginResponse.error);
    else {
      // Successful login
      router.push("/");
    }
  };

  const handleGithubSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Attempt to sign in with GitHub
    const loginResponse = await signIn("github");
    // Successful login

    if (loginResponse && loginResponse.error)
      setErrorMessage(loginResponse.error);
    else {
      // Successful login
      router.push("/");
    }

    // Handle the error as needed
  };

  return (
    <div>
      <h2 className="text-3xl font-extrabold mb-6">Sign In</h2>

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
          <Button
            type="submit"
            value="Create User"
            className="mt-4 w-full py-2 rounded-md"
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
      <p className="text-red-500">{errorMessage}</p>
    </div>
  );
};

export default SignInForm;
