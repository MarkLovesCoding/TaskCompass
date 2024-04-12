"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import Image from "next/image";
import LogoPng from "../public/compass.png";
import TaskColumns from "../public/task-columns.png";
import Dashboard from "../public/dashboard.png";
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
  if (session) {
    // Render loading screen
    return <div>Loading...</div>;
  } else
    return (
      <div className="absolute bg-gradient-background-light dark:bg-gradient-background-dark  top-0 left-0 flex flex-col  w-full min-h-[100vh] h-auto overflow-hidden">
        {/* Left side (announcement or other content) */}
        <div className="absolute top-[20px] left-[40px] flex flex-row h-[100px] justify-center items-center">
          <Image src={LogoPng} alt="Task Compass Logo" width={80} height={80} />{" "}
          <h1 className="text-2xl font-bold">TaskCompass</h1>
        </div>
        <div className=" absolute top-[50px] right-[50px] flex justify-center">
          <Link href="/registration">
            <Button className=" hover:border-white border-2">
              Register / Sign In
            </Button>
          </Link>
        </div>
        <div className="   self-center flex flex-col  text-center w-full justify-center items-center h-[90vh] min-h-[300px] ">
          <h2 className="  bg-gradient-to-r  from-orange-500 via-pink-500 to-purple-500 text-transparent bg-clip-text max-w-[80%] sm:max-w-60%  text-5xl leading-tight tracking-lighter md:text-6xl lg:leading-[1.1] text-orange-500 font-bold p-8 pb-4">
            {" Simplifying Project Management"}
          </h2>

          <h3 className="text-lg text-muted-foreground sm:text-xl p-8 pt-4">
            TaskCompass is here to help you navigate your next project!
          </h3>
        </div>
        <div className="   self-center flex flex-col  md:flex-row-reverse text-center w-full justify-center items-center h-[90vh] min-h-[300px] ">
          <div className="flex-col flex w-full md:w-[50%] m-8 md:ml-0  md:m-12">
            <h2 className="text-2xl">Categorize, Prioritize, Customize</h2>

            <h3 className="text-base text-muted-foreground sm:text-xl p-8 pt-4">
              Fluid Drag and Drop KanBan-style. View by Status, Priority, or
              Custom Categories
            </h3>
          </div>
          <div className="flex relative h-full  flex-col w-full md:w-[50%] justify-center items-center p-8 md:p-0 md:justify-start">
            <Image
              className="md:absolute md:-left-16 md:top-[25%] "
              src={TaskColumns}
              alt="Task Compass Logo"
              // width={400}
              // height={400}
            />
          </div>
        </div>
        <div className="   self-center flex flex-col  text-center w-full justify-center items-center h-[90vh] min-h-[300px] ">
          <h2 className="text-2xl">Build, Administrate, Assign</h2>

          <h3 className="text-base text-muted-foreground sm:text-xl p-8 pt-4">
            Form effective teams with appropriate roles and permissions.
            Customize Project Users from Team List. Assign Tasks Project
            Members.
          </h3>
        </div>
        <div className="   self-center flex flex-col  text-center w-full justify-center items-center h-[90vh] min-h-[300px] ">
          <h2 className="text-2xl"> Create, Edit, Complete</h2>

          <h3 className="text-base text-muted-foreground sm:text-xl p-8 pt-4">
            Create Tasks with Due Dates, Descriptions, and Assignees. Edit Tasks
            through drag and drop or cards
          </h3>
        </div>
        <div className="   self-center flex flex-col  md:flex-row-reverse text-center w-full justify-center items-center h-[90vh] min-h-[300px] ">
          <div className="flex relative h-full  flex-col w-full md:w-[50%] justify-center items-center p-8 md:p-0 md:justify-start">
            <Image
              className="md:absolute md:-right-16 md:top-[25%] "
              src={Dashboard}
              alt="dashboard-image-1"
              // width={400}
              // height={400}
            />
          </div>
          <div className="flex-col flex w-full md:w-[50%] m-8 md:mr-0  md:m-12">
            <h2 className="text-2xl">Manage, Archive, Retrieve </h2>

            <h3 className="text-base text-muted-foreground sm:text-xl p-8 pt-4">
              Manage your Team and Project views, with Project and Task tracking
              and easy archival/retrieval.
            </h3>
          </div>
        </div>

        <div className="  bg-nav-background border-t-accent border-t self-center flex flex-row  text-center w-full justify-center items-center h-[30vh] min-h-[150px] ">
          <div className="flex min-w-[50%] flex-col">
            <h2 className="text-2xl">Task Compass</h2>
            <h2 className="text-lg">© markhalstead.dev 2024</h2>
          </div>
          <div className="flex min-w-[50%]">
            <h3 className="text-base text-muted-foreground sm:text-xl p-8 pt-4">
              Get in Touch.
            </h3>
          </div>
        </div>
        {/* Right side (sign-in form) */}
      </div>
    );
};

export default HomePageComponent;
