"use client";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import LogoPng from "@/public/compass.png";

type ParamsType = {
  teamName: string;
  errStatus: boolean;
};
const InvitedUserToTeamComponent = ({ teamName, errStatus }: ParamsType) => {
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
          {errStatus == false ? (
            <div className="flex flex-col justify-center space-y-4">
              <h2>
                You have successfully been added to team:{teamName}. Please sign
                in to access team.
              </h2>
              <Link href="/registration">
                <Button className=" py-2 px-4">Sign in</Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col justify-center space-y-4">
              <h2>
                There was an error adding you to the team. Please contact the
                team owner for assistance.
              </h2>
              <Link href="/registration">
                <Button className=" py-2 px-4">Back to Registration</Button>
              </Link>
            </div>
          )}
        </div>
        {/* Conditional rendering based on authentication status */}
      </div>
    </div>
  );
};
export default InvitedUserToTeamComponent;
