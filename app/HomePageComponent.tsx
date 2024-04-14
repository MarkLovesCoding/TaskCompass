"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import Image from "next/image";
import LogoPng from "../public/compass.png";
import TaskColumns from "../public/task-columns.png";
import NewProject from "../public/new-project.png";
import TaskCardAssign from "../public/task-card-assign.png";
import ActivateTask from "../public/activate-task.png";
import ArchiveTask from "../public/archive-task.png";
import ArchiveProject from "../public/archive-project.png";
import FullUsers from "../public/full-users.png";
import DarkMode from "../public/dark-mode.png";
import MoveTask from "../public/move-task.png";
import PriorityView from "../public/priority-view.png";
import SWCard from "../public/sw-card.png";
import ArchiveProjectCard from "../public/archive-project-card.png";
import Dashboard from "../public/dashboard.png";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import Task from "@/db/(models)/Task";
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
      <div className="absolute bg-gradient-background-dark  top-0 left-0 flex flex-col  w-full min-h-[100vh] h-auto overflow-hidden">
        {/* Left side (announcement or other content) */}
        <div className="absolute top-[5px] left-[20px] md:top-[20px] md:left-[40px] flex flex-row h-[100px] justify-center items-center">
          <Image
            src={LogoPng}
            className="w-[40px] h-[40px] md:w-[80px] md:h-[80px]"
            alt="Task Compass Logo"
            // width={80}
            // height={80}
          />{" "}
          <h1 className="text-base md:text-2xl font-bold">TaskCompass</h1>
        </div>
        <div className=" absolute top-[36px] right-[20px] md:top-[50px] md:right-[50px] flex justify-center">
          <Link href="/registration">
            <Button className=" hover:border-white border-2">
              Register / Sign-In
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

        <div className="   self-center flex flex-col border-b border-b-accent md:flex-row-reverse text-center w-full justify-center items-center h-[80vh] md:h-[65vh] min-h-[300px] ">
          <div className="flex-col flex w-full md:w-[50%] lg:w-[65%] m-6 mb-0 md:ml-0  md:m-12">
            <div className="lg:w-[40vw] md:[70vw] w-full px-[10%] md:px-[0%]">
              <h2 className="text-2xl"> Visualize, Categorize, Prioritize</h2>

              <h3 className="text-base text-muted-foreground sm:text-xl p-8 pb-0 pt-4">
                Fluid Drag and Drop KanBan-style. View by Status, Priority, or
                Categories
              </h3>
            </div>
          </div>
          <div className="flex relative h-full  flex-col border-b border-b-accent overflow-clip w-full md:w-[50%] justify-center items-center p-8 md:p-0 md:justify-start">
            <div>
              {/* <Image
                className=" absolute top-10 -left-16 md:-left-16 md:top-[25%] w-[400px] md:w-[400px] lg:w-[400px]"
                src={TaskColumns}
                // src={TaskColumns}
                alt="Task Compass Logo"
                // sizes="(max-width: 768px) 60vw, (max-width: 1024px) 30vw, 10vw"
                // width={400}
                // height={400}
              />{" "} */}
              <Image
                className=" absolute top-10 -left-16 md:-left-16 md:top-[25%] w-[200px] md:w-[250px] lg:w-[370px]"
                src={PriorityView}
                alt="dashboard-image-1"
                // width={400}
                // height={400}
              />
            </div>
          </div>
        </div>

        <div className="   self-center flex flex-col-reverse overflow-clip border-b border-b-accent md:flex-row-reverse text-center w-full justify-center items-center h-[80vh] md:h-[65vh] min-h-[300px] ">
          <div className="flex relative h-full  flex-col w-full md:w-[50%] justify-center items-center p-8 md:p-0 md:justify-start">
            <div>
              <Image
                className=" absolute top-10 -right-16 md:-right-16 md:top-[45%] w-[200px] md:w-[250px] lg:w-[370px]"
                src={MoveTask}
                alt="dashboard-image-1"
                // width={400}
                // height={400}
              />
              <Image
                className=" absolute top-10 -left-16 md:-left-16 md:top-[25%] w-[200px] md:w-[250px] lg:w-[370px]"
                src={SWCard}
                alt="dashboard-image-1"
                // width={400}
                // height={400}
              />
            </div>
          </div>
          <div className="flex-col flex w-full md:w-[50%] lg:w-[65%] m-6 mb-0 md:ml-0  md:m-12">
            <div className="lg:w-[40vw] md:[70vw] w-full px-[10%] md:px-[0%]">
              <h2 className="text-2xl"> Create, Edit, Complete </h2>

              <h3 className="text-base text-muted-foreground sm:text-xl p-8 pb-0 pt-4">
                Create Tasks with Due Dates, Descriptions, Assignees, and more.
              </h3>
            </div>
          </div>
        </div>

        <div className="   self-center flex flex-col border-b border-b-accent overflow-clip md:flex-row-reverse text-center w-full justify-center items-center h-[80vh] md:h-[65vh] min-h-[300px] ">
          <div className="max-w-[1024px]">
            <div className="lg:w-[40vw] md:[80vw] w-full ">
              <h2 className="text-2xl">Manage, Archive, Retrieve </h2>

              <h3 className="text-base text-muted-foreground sm:text-xl p-8 pt-4">
                Manage your Team and Project views, with Project and Task
                tracking and easy archival/retrieval.
              </h3>
            </div>
            <div className="flex relative h-full  flex-col w-full md:w-[50%] justify-center items-center p-8 md:p-0 md:justify-start">
              <Image
                className=" absolute top-10 -left-16 md:-left-16 md:top-[25%] w-[200px] md:w-[250px] lg:w-[370px]"
                src={ArchiveProject}
                alt="Task Compass Logo"
                // width={400}
                // height={400}
              />
            </div>
          </div>
        </div>
        <div className="   self-center flex flex-col-reverse border-b border-b-accent overflow-clip md:flex-row-reverse text-center w-full justify-center items-center h-[80vh] md:h-[65vh] min-h-[300px] ">
          <div className="flex relative h-full  flex-col w-full md:w-[50%] justify-center items-center p-8 md:p-0 md:justify-start">
            <Image
              className=" absolute top-10 -right-16 md:-right-16 md:top-[45%] w-[200px] md:w-[250px] lg:w-[370px]"
              src={FullUsers}
              alt="dashboard-image-1"
              // width={400}
              // height={400}
            />
          </div>
          <div className="flex-col flex w-full md:w-[50%] m-8 md:mr-0  md:m-12">
            <h2 className="text-2xl">Build, Administrate, Assign </h2>

            <h3 className="text-base text-muted-foreground sm:text-xl p-8 pt-4">
              Form effective teams with appropriate roles and permissions.
              Customize Project Users from Team List. Assign Tasks Project
              Members.
            </h3>
          </div>
        </div>

        {/* <div className="   self-center flex flex-col  text-center w-full justify-center items-center h-[90vh] min-h-[300px] ">
          <h2 className="text-2xl"> Create, Edit, Complete</h2>

          <h3 className="text-base text-muted-foreground sm:text-xl p-8 pt-4">
            Create Tasks with Due Dates, Descriptions, and Assignees. Edit Tasks
            through drag and drop or cards
          </h3>
        </div> */}

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
