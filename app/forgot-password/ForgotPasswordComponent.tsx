"use client";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

import ForgotPasswordForm from "./ForgotPasswordForm";
import LogoPng from "../../public/compass.png";

const ForgotPasswordComponent = () => {
  const router = useRouter();

  const { data: session } = useSession();
  useEffect(() => {
    // Redirect to home if the user is already signed in
    if (session) {
      //@ts-expect-error
      router.push(`/dashboard/${session.user.id}`);
    }
  }, [session, router]);

  return (
    <div className="absolute bg-gradient-background-light justify-center dark:bg-gradient-background-dark  top-0 left-0 flex flex-col  w-full lg:flex-row min-h-[100vh] h-auto">
      <Link href="/">
        <div className="absolute top-[20px] left-[40px] flex flex-row h-[100px] justify-center items-center">
          <Image src={LogoPng} alt="Task Compass Logo" width={80} height={80} />{" "}
          <h1 className="text-2xl font-bold">TaskCompass</h1>
        </div>
      </Link>
      {/* Right side (sign-in form) */}
      <div className="lg:flex-1  p-10">
        <div className="mx-auto flex flex-col h-[100%] max-w-[500px] justify-center">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordComponent;
