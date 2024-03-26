"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
      <div className="absolute  bg-background top-16 left-0 flex flex-col lg:flex-row h-screen">
        {/* Left side (announcement or other content) */}
        <div className=" lg:flex-1  flex flex-col text-center justify-center items-center min-h-[300px]">
          <h1 className=" max-w-[80%] sm:max-w-60% text-3xl  sm:text-2xl leading-tight tracking-lighter md:text-6xl lg:leading-[1.1] text-orange-500 font-bold mb-4">
            {" It's time to get your sh** in order."}
          </h1>
          <h3 className="text-lg text-muted-foreground sm:text-xl">
            TaskCompass is here to help!
          </h3>
        </div>

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
