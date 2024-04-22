"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton({}) {
  return (
    <div className="absolute flex flex-col top-[2em] md:top-[3em] w-full h-[calc(100vh-2em)] md:h-[calc(100vh-3em)]">
      <main className="flex  items-center bg-gradient-background-light dark:bg-gradient-background-dark overflow-x-hidden flex-col  h-[calc(100vh-2em)] md:h-[calc(100vh-3em)]  md:gap-8 ">
        {/* <div className="w-full h-[15vh] bg-card-background absolute top-0 left-0 "></div> */}
        <div className="z-20   w-full flex flex-col items-start self-center  pl-8 p-1 bg-accordion-background backdrop-blur shadow-md space-y-4  ">
          {/* <div className="bg-gray-100 p-4 rounded-lg shadow-md"> */}
          {/* <Skeleton className="w-full flex flex-col items-center self-center  pl-8 p-1 shadow-md space-y-4"/> */}

          <div className="flex items-center space-x-3 my-2">
            <Skeleton className="w-10 h-10 bg-nav-background  rounded-full" />
            <Skeleton className="w-[15ch] h-8 rounded-none bg-nav-background " />
          </div>
        </div>

        <div className="z-20 flex justify-center  self-center  m-4 w-full">
          {/* <div className="flex mt-0 p-8 bg-accordion-background backdrop-blur rounded-lg justify-center self-center w-fit   flex-col "> */}
          {/* <div className="self-center"> */}
          {/* <Skeleton className=" rounded-lg w-[100px] h-[20px]" /> */}
          {/* </div> */}
          {/* </div> */}
          <div
            defaultValue="teams"
            className="flex mt-0 p-8 bg-accordion-background backdrop-blur rounded-lg justify-center self-center w-fit   flex-col "
          >
            {/* <Skeleton className=" rounded-lg w-[40px] bg-nav-background" /> */}
            {/* <TabsContent value="teams"> */}
            <div className=" z-20 flex-grow mt-2 flex w-full justify-center md:max-w-[60vw] flex-col ">
              <div className="flex justify-center">
                <Skeleton className=" w-[100px] h-10 rounded-full bg-nav-background" />
              </div>

              <div className="flex  max-w-[90vw] w-full p-2 mt-8 items-center justify-between md:ml-0 my-4 h-[40px] align-top ">
                <Skeleton className=" w-[100px] h-8 rounded-none bg-nav-background" />
                <Skeleton
                  // className="rounded-full  ml-auto w-fit px-4"
                  className=" rounded-full w-[100px] h-10 bg-nav-background"
                />
              </div>

              <div className=" flex max-w-[90vw] justify-center md:justify-start flex-row flex-wrap">
                <Skeleton className=" bg-nav-background relative border-2 rounded-none mb-4 max-w-full md:mb-4 flex items-center w-72 h-28 shadow-lg "></Skeleton>
                {/* <Skeleton className="  relative border-2 mb-4 max-w-full mr-4 md:mb-4 flex items-center w-72 h-28 shadow-lg "></Skeleton>
                <Skeleton className="  relative border-2 mb-4 max-w-full mr-4 md:mb-4 flex items-center w-72 h-28 shadow-lg "></Skeleton>
                <Skeleton className="  relative border-2 mb-4 max-w-full mr-4 md:mb-4 flex items-center w-72 h-28 shadow-lg "></Skeleton> */}
                {/* <Skeleton className="  relative border-2 mb-4 max-w-full mr-4 md:mb-4 flex items-center w-72 h-28 shadow-lg "></Skeleton>
                <Skeleton className="  relative border-2 mb-4 max-w-full mr-4 md:mb-4 flex items-center w-72 h-28 shadow-lg "></Skeleton> */}
              </div>
            </div>
            {/* </TabsContent> */}
          </div>
        </div>
      </main>
    </div>
  );
}
