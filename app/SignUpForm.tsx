import { useRouter } from "next/navigation";
import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input } from "@/components/ui/input";
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
  name: z.string().min(5),
  email: z.string().email().min(5),
  password: z.string().min(1),
  role: z.string().min(1),
  firstLogIn: z.boolean(),
});
interface FormData {
  name?: string;
  email?: string;
  password?: string;
  role: string;
  firstLogIn: boolean;
}

const SignUpForm = () => {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string>("");
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
    // e.preventDefault();
    console.log("form submitted_________________", values);
    const res = await fetch("/api/Users", {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "content-type": "application/json",
      },
    });
    if (res.ok) {
      await signIn("credentials", {
        email: values.email,
        password: values.password,
      });
      // console.log("RESPONSE AND FORM SUBMITTION:", await res.json());
      // router.refresh();
      router.push("/");
    } else {
      const response = await res.json();
      setErrorMessage(response.message);
    }
  };
  // const handleGoogleSubmit = async (e: FormEvent) => {
  //   e.preventDefault();
  //   signIn("google");
  // };
  // const handleGithubSubmit = async (e: FormEvent) => {
  //   e.preventDefault();
  //   signIn("github");
  // };
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

    const loginResponse = await signIn("github");
    // Successful login

    if (loginResponse && loginResponse.error)
      setErrorMessage(loginResponse.error);
    else {
      // Successful login
      router.push("/");
    }
  };
  return (
    <div className="max-w-[100%]">
      <h2 className="text-3xl font-extrabold mb-6">Register</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSignUpSubmit)} method="post">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => {
              return (
                <FormItem className="mt-2">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Type in username"
                      type="text"
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
          {/* <div className="mb-4">
            <label className="block text-sm font-medium">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              onChange={handleChange}
              required={true}
              value={formData.name}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={handleChange}
              required={true}
              value={formData.email}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div> */}
          {/* <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={handleChange}
              required={true}
              value={formData.password}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div> */}
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
      <p className="text-red-500">{errorMessage}</p>
    </div>
  );
};

export default SignUpForm;
