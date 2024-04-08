"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import SignUpForm from "./SignUpForm";
import SignInForm from "./SignInForm";
const HomePageComponent = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Redirect to home if the user is already signed in
    if (session) {
      //@ts-expect-error
      router.push(`/dashboard/${session!.user.id}`);
    }
  }, [session, router]);
  const [toRegister, setToRegister] = useState(false);
  if (session) {
    // Render loading screen
    return <div>Loading...</div>;
  } else
    return (
      <div className="absolute bg-gradient-background-light dark:bg-gradient-background-dark  top-0 left-0 flex flex-col  w-full lg:flex-row min-h-[100vh] h-auto">
        {/* Left side (announcement or other content) */}
        <div className=" lg:flex-1   self-center flex flex-col  text-center  justify-center items-center h-full min-h-[300px] ">
          <h1 className="  bg-gradient-to-r  from-orange-500 via-pink-500 to-purple-500 text-transparent bg-clip-text max-w-[80%] sm:max-w-60%  text-5xl leading-tight tracking-lighter md:text-6xl lg:leading-[1.1] text-orange-500 font-bold p-8 pb-4">
            {" Time to get your sh** together."}
          </h1>
          <h3 className="text-lg text-muted-foreground sm:text-xl p-8 pt-4">
            TaskCompass is here to help you organize your next project!
          </h3>
        </div>
        {/* <div>
          <Button>Register / Sign In</Button>
        </div> */}
        {/* Right side (sign-in form) */}
        <div className="lg:flex-1  p-10">
          {/* <div className="lg:flex-1 bg-gradient-to-r from-gray-800 to-gray-600 p-10"> */}
          <div className="mx-auto flex flex-col h-[100%] max-w-[500px] justify-center">
            {/* <h2 className="text-3xl font-extrabold text-white mb-6">Sign In</h2> */}

            {/* Conditional rendering based on authentication status */}
            {toRegister ? <SignUpForm /> : <SignInForm />}
            <div className=" mt-2 text-center">
              {toRegister ? "Already registered? " : "First time? "}
              <span
                className="cursor-pointer underline"
                onClick={() => setToRegister(!toRegister)}
              >
                {toRegister ? "Log In Here!" : " Sign Up Here!"}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
};

export default HomePageComponent;
