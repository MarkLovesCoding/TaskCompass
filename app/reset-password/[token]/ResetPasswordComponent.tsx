// import ResetPasswordComponent from "./ForgotPasswordComponent";
"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import LogoPng from "../../../public/compass.png";

import Link from "next/link";
import ResetPasswordForm from "./ResetPasswordForm";

const ResetPasswordComponent = ({ token }: { token: string }) => {
  console.log("token--component", token);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Redirect to home if the user is already signed in
    if (session) {
      //@ts-expect-error
      router.push(`/dashboard/${session!.user.id}`);
    }
  }, [session, router]);

  return (
    <div className="absolute bg-gradient-background-light justify-center dark:bg-gradient-background-dark  top-0 left-0 flex flex-col  w-full lg:flex-row min-h-[100vh] h-auto">
      {/* Left side (announcement or other content) */}
      <Link href="/">
        <div className="absolute top-[20px] left-[40px] flex flex-row h-[100px] justify-center items-center">
          <Image src={LogoPng} alt="Task Compass Logo" width={80} height={80} />{" "}
          <h1 className="text-2xl font-bold">TaskCompass</h1>
        </div>
      </Link>
      {/* Right side (sign-in form) */}
      <div className="lg:flex-1  p-10">
        <div className="mx-auto flex flex-col h-[100%] max-w-[500px] justify-center">
          <ResetPasswordForm token={token} />
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordComponent;
