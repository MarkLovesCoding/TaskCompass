"use client";
import Image from "next/image";
import Link from "next/link";

import LogoPng from "@/public/compass.png";
import InviteNewUserSignUpForm from "./InviteNewUserSignUpForm";
import InvalidTokenComponent from "./InvalidTokenComponent";

import type { TInvitedUser } from "@/entities/Team";
const InvitedNewUserToTeamComponent = ({
  invitedUser,
  errState,
}: {
  invitedUser: TInvitedUser | null;
  errState: boolean;
}) => {
  //  const { data: session } = useSession();
  //const router = useRouter();

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
          {invitedUser !== null && !errState ? (
            // <></>
            // <h2 className="text-3xl font-extrabold text-white mb-6">Sign In</h2>
            <InviteNewUserSignUpForm
              invitedUser={invitedUser as TInvitedUser}
            />
          ) : (
            <InvalidTokenComponent />
          )}
        </div>
      </div>
    </div>
  );
};
export default InvitedNewUserToTeamComponent;
