"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ProjectPageSkeleton({}) {
  return (
    <div className={`flex flex-col justify-start items-center min-h-full `}>
      <div className="z-70">
        <div className="fixed z-50 group top-[2rem] md:top-[3rem] left-0 w-6 md:w-8 h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)] bg-nav-background  border-r-2 border-t-2 rounded-tr-lg rounded-br-lg border-b-2 border-nav-background  "></div>

        {/* <ArrowLeft className="w-4 h-4 cursor-pointer rounded-full " /> */}
        {/* <Skeleton className="w-12 h-8 rounded-none bg-nav-background" /> */}
      </div>
      <div className="fixed h-16 z-40 shadow-md left-0 top-8 md:top-12 flex-row flex p-2 border-b-slate-50 w-full bg-accordion-background backdrop-filter backdrop-blur ">
        <div className="min-w-fit p-1 pl-8 h-full justify-evenly flex flex-col">
          {/* <ArrowLeft className="w-4 h-4 cursor-pointer rounded-full " />
            <ArrowLeft className="w-4 h-4 cursor-pointer rounded-full " /> */}
          <Skeleton className="w-12 h-8 rounded-none bg-nav-background" />
          {/* </Link> */}
          <div className="flex items-center m-2 mt-0 h-full justify-between max-w-[20ch]   md:max-w-md">
            <Skeleton className="w-20 h-8 rounded-none bg-nav-background" />

            <Skeleton className="w-16 h-6 bg-nav-background" />
          </div>
        </div>
        <div className="flex flex-row w-full   justify-center align-middle ">
          <div title="Change View" className="p-1 ">
            <Skeleton className="w-8 h-8 bg-nav-background" />
          </div>
          {/* {isUserAdmin && ( */}
          <div title="Create New Task" className="p-1">
            <Skeleton className="w-8 h-8 bg-nav-background" />
          </div>
          <div title="Change Background" className="p-1">
            <Skeleton className="w-8 h-8 bg-nav-background" />
          </div>
          {/* )} */}
        </div>
      </div>
      <main
        className={
          "left-6 md:left-8 " +
          `bg-gradient-background-light dark:bg-gradient-background-dark fixed w-[calc(100vw-1.5rem)] md:w-[calc(100vw-2rem)]  min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-3rem)] border border-l-0`
        }
      >
        <div className=" w-[calc(100vw-2rem)] flex h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)] ">
          <div className="flex justify-start  pt-16 align-top">
            {/* columns */}
            <div className="flex flex-row ml-[1em] justify-start w-min-full ">
              <Skeleton className="bg-accordion-background w-[250px]  h-fit m-2 md:m-4  rounded-lg  flex flex-col items-center align-top p-4 shadow-md">
                <Skeleton className="w-28 h-8 rounded-none bg-nav-background" />

                <div className="bg-transparent w-[250px] m-4 md:mx-8  flex flex-col  mb-0 rounded-lg md:py-6 items-center align-top px-2 ">
                  <TaskCardSkeleton />
                </div>
              </Skeleton>
              <Skeleton className="bg-accordion-background w-[250px]  h-fit m-2 md:m-4  rounded-lg  flex flex-col items-center align-top p-4 shadow-md">
                <Skeleton className="w-28 h-8 rounded-none bg-nav-background" />

                <div className="bg-transparent w-[250px] m-4 md:mx-8  flex flex-col  mb-0 rounded-lg md:py-6 items-center align-top px-2 ">
                  <TaskCardSkeleton />
                  <TaskCardSkeleton />
                </div>
              </Skeleton>
              <Skeleton className="bg-accordion-background w-[250px]  h-fit m-2 md:m-4  rounded-lg  flex flex-col items-center align-top p-4 shadow-md">
                <Skeleton className="w-28 h-8 rounded-none bg-nav-background" />

                <div className="bg-transparent w-[250px] m-4 md:mx-8  flex flex-col  mb-0 rounded-lg md:py-6 items-center align-top px-2 ">
                  <TaskCardSkeleton />
                  <TaskCardSkeleton />
                  <TaskCardSkeleton />
                </div>
              </Skeleton>
              <Skeleton className="bg-accordion-background w-[250px]  h-fit m-2 md:m-4  rounded-lg  flex flex-col items-center align-top p-4 shadow-md">
                <Skeleton className="w-28 h-8 rounded-none bg-nav-background" />

                <div className="bg-transparent w-[250px] m-4 md:mx-8  flex flex-col  mb-0 rounded-lg md:py-6 items-center align-top px-2 ">
                  <TaskCardSkeleton />
                </div>
              </Skeleton>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const TaskCardSkeleton = () => {
  return (
    <Skeleton className="bg-nav-background border-background p-4 border rounded-lg flex w-[225px] h-fit my-2 shadow-lg ">
      <div className="flex flex-col overflow-hidden p-1 w-full">
        <div className="flex flex-col">
          <Skeleton className="w-28 h-6 mb-4 items-start rounded-none bg-accordion-background" />
          <div className="space-y-4 ">
            <Skeleton className="w-20 h-4 items-start rounded-none bg-accordion-background" />
            <div className="flex flex-row space-x-2 ">
              <Skeleton className=" w-4 h-4 rounded-sm bg-accordion-background" />
              <Skeleton className=" w-20 h-4 rounded-none bg-accordion-background" />
            </div>
            <div className="flex flex-row space-x-2 mb-2">
              <Skeleton className=" w-4 h-4 rounded-sm bg-accordion-background" />
              <Skeleton className=" w-20 h-4 rounded-none bg-accordion-background" />
            </div>
            <div className="flex flex-row space-x-1">
              <Skeleton className=" w-14 h-6 rounded-sm bg-accordion-background" />
              <Skeleton className=" w-14 h-6 rounded-sm bg-accordion-background" />
              <Skeleton className=" w-14 h-6 rounded-sm bg-accordion-background" />
            </div>
          </div>
        </div>
      </div>
    </Skeleton>
  );
};
