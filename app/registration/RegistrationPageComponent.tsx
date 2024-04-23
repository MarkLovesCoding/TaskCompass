"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import SignUpForm from "./SignUpForm";
import SignInForm from "./SignInForm";
import { DashboardSkeleton } from "../dashboard/[id]/DashboardSkeleton";
import LogoPng from "../../public/compass.png";

const RegistrationPageComponent = () => {
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
    //skeletons of dashboard?

    return <DashboardSkeleton />;
    // return <TeamPageSkeleton />;
  } else
    return (
      <div className="absolute bg-gradient-background-light justify-center dark:bg-gradient-background-dark  top-0 left-0 flex flex-col  w-full lg:flex-row min-h-[100vh] h-auto">
        {/* Left side (announcement or other content) */}
        <Link href="/">
          <div className="absolute top-[5px] left-[20px] md:top-[10px] md:left-[40px] flex flex-row h-[100px] justify-center items-center">
            <Image
              src={LogoPng}
              className="w-[40px] h-[40px] md:w-[80px] md:h-[80px]"
              alt="Task Compass Logo"
              // width={80}
              // height={80}
            />{" "}
            <h1 className="text-base md:text-2xl font-bold">TaskCompass</h1>
          </div>
        </Link>
        {/* Right side (sign-in form) */}
        <div className="lg:flex-1  p-10">
          {/* <div className="lg:flex-1 bg-gradient-to-r from-gray-800 to-gray-600 p-10"> */}
          <div className="mx-auto flex flex-col h-[100%] max-w-[500px] justify-center mt-4">
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
              <Link href="/forgot-password">
                <p className="ml-4 underline">Forgot Password?</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
};
export default RegistrationPageComponent;
