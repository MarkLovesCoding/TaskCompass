"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover_add";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/card-scroll-area";
import { Label } from "@/components/ui/label";
import { PlusIcon, FolderKanbanIcon, ArrowLeft, ImageIcon } from "lucide-react";

import CardView from "./CardView";
import { NewTaskCard } from "./NewTaskCard";
import ProjectDrawer from "./ProjectDrawer";
import BackgroundImageMenu from "@/app/dashboard/[id]/BackgroundImageMenu";
import { cn } from "@/lib/utils/utils";
import { capitalizeEachWord } from "./utils";

import type { TeamDto } from "@/use-cases/team/types";
import type { ProjectDto } from "@/use-cases/project/types";
import type { TaskDto } from "@/use-cases/task/types";
import type { UserDto } from "@/use-cases/user/types";

export function ProjectPage({
  userId,
  user,
  project,
  tasks,
  teamUsers,
  projectUsers,
  team,
}: {
  userId: string;
  user: UserDto;
  project: ProjectDto;
  tasks: TaskDto[];
  teamUsers: UserDto[];
  team: TeamDto;
  projectUsers: UserDto[];
}) {
  const [sortBy, setSortBy] = useState<string>("status");
  const [projectBackgroundImage, setProjectBackgroundImage] = useState<string>(
    project.backgroundImage
  );

  useEffect(() => {
    setProjectBackgroundImage(project.backgroundImage);
  }, [project.backgroundImage]);

  const isCurrentUserAdmin =
    project && user.projectsAsAdmin.some((id) => id === project.id);
  const uniqueProjectUsers = [...projectUsers];
  if (!project || !tasks) return <div>Loading...</div>;

  return (
    <div className={`flex flex-col justify-start items-center min-h-full `}>
      <div className="z-50">
        <ProjectDrawer
          userId={userId}
          team={team}
          tasks={tasks}
          project={project}
          teamUsers={teamUsers}
          projectUsers={projectUsers}
          isCurrentUserAdmin={isCurrentUserAdmin}
        />
      </div>
      <div
        className={cn(
          `fixed h-16 z-40 shadow-md left-0 top-8 md:top-12 flex-row flex p-2 border-b-slate-50 w-full bg-accordion-background backdrop-filter backdrop-blur  `
        )}
      >
        <div className="min-w-fit p-1 pl-8 h-full justify-evenly flex flex-col">
          <Link
            href={`/team/${project.team}`}
            className="flex flex-row group/back-team"
          >
            <ArrowLeft className="w-4 h-4 cursor-pointer rounded-full " />
            <h4 className="text-xs  ml-2 cursor-pointer group-hover/back-team:underline">
              Back to Team
            </h4>
          </Link>
          <div className="flex items-center m-2 mt-0 h-full justify-between max-w-[20ch]   md:max-w-md">
            <h4 className=" text-xs md:text-sm lg:text-md pr-3 italic">
              Project:
            </h4>
            <h4 className="text-xs md:text-sm font-bold mr-2 lg:text-md text-ellipsis truncate">
              {project.name}
            </h4>
          </div>
        </div>
        <div className="flex flex-row w-full   justify-center align-middle ">
          <div title="Change View" className="p-1 ">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="group hover:bg-accent p-2">
                  <Label className="hidden md:flex hover:cursor  ">{`View : ${capitalizeEachWord(
                    sortBy
                  )}  `}</Label>
                  <FolderKanbanIcon className="group-hover:text-primary w-6 h-6 md:ml-3 self-center cursor-pointer" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 ">
                <DropdownMenuLabel className="text-center  font-bold">
                  View
                </DropdownMenuLabel>
                <Separator className="my-2" />
                <DropdownMenuRadioGroup
                  className=" hover:cursor "
                  value={sortBy}
                  onValueChange={setSortBy}
                >
                  <DropdownMenuRadioItem value="status">
                    Status
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="priority">
                    Priority
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="category">
                    Category
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {/* {isUserAdmin && ( */}
          <div title="Create New Task" className="p-1">
            <Popover>
              <PopoverTrigger>
                <Button variant="outline" className="group hover:bg-accent p-2">
                  <Label className="hidden md:flex ">New Task</Label>
                  <PlusIcon className="w-6 h-6 md:ml-3 self-center group-hover:text-primary" />
                  <span className="sr-only">New Task Button</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="border-2 border-nav-background">
                <NewTaskCard project={project} />
              </PopoverContent>
            </Popover>
          </div>
          <div title="Change Background" className="p-1">
            <BackgroundImageMenu type={"Project"} object={project} />
            {/* <Dialog onOpenChange={loadImageSetonOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="group hover:bg-accent p-2">
                  <ImageIcon className="w-6 h-6 self-center group-hover:text-primary" />
                  <span className="sr-only">Change Background Button</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="border-2 w-[80%]  bg-drawer-background backdrop-blur rounded-md p-4 border-nav-background">
                <div className="flex flex-col h-fit overflow-auto">
                  <h1 className="font-bold text-lg w-full text-center">
                    Customize Background
                  </h1>
                  <div className="flex flex-wrap justify-center h-[300px] p-2">
                    {selectedImages.length > 0 ? (
                      selectedImages.map((image: any, index) => {
                        return (
                          <div
                            key={index}
                            className="relative max-w-[120px] max-h-[80px] m-1 overflow-y-clip cursor-pointer hover:border-white border-2 truncate text-ellipsis group"
                          >
                            <Image
                              onClick={() => setNewBackground(image.urls)}
                              src={image.urls.thumb}
                              alt="Background Image"
                              width={120}
                              height={80}
                              className={`${
                                image.width / image.height > 1.5
                                  ? "w-auto h-[80px]"
                                  : "w-[120px] h-auto"
                              }  overflow-clip rounded cursor-pointer z-40 `}
                            />
                            <Link
                              href={image.user.links.html}
                              className=" w-full absolute h-[20px]  bg-black/30 z-40 hover:bg-black/60 top-[60px] left-[0px]  truncate text-ellipsis "
                              title={image.user.name}
                            >
                              <p className="  px-2 text-xs truncate text-ellipsis">
                                {image.user.name}
                              </p>
                            </Link>
                          </div>
                        );
                      })
                    ) : (
                      <div className="flex justify-center w-full h-fit flex-wrap scroll-none">
                        <Skeleton className="w-[120px] m-1 h-[80px] rounded-none bg-nav-background" />
                        <Skeleton className="w-[120px] m-1 h-[80px] rounded-none bg-nav-background" />
                        <Skeleton className="w-[120px] m-1 h-[80px] rounded-none bg-nav-background" />
                        <Skeleton className="w-[120px] m-1 h-[80px] rounded-none bg-nav-background" />
                        <Skeleton className="w-[120px] m-1 h-[80px] rounded-none bg-nav-background" />
                        <Skeleton className="w-[120px] m-1 h-[80px] rounded-none bg-nav-background" />
                        <Skeleton className="w-[120px] m-1 h-[80px] rounded-none bg-nav-background" />
                        <Skeleton className="w-[120px] m-1 h-[80px] rounded-none bg-nav-background" />
                        <Skeleton className="w-[120px] m-1 h-[80px] rounded-none bg-nav-background" />
                        <Skeleton className="w-[120px] m-1 h-[80px] rounded-none bg-nav-background" />
                        <Skeleton className="w-[120px] m-1 h-[80px] rounded-none bg-nav-background" />
                        <Skeleton className="w-[120px] m-1 h-[80px] rounded-none bg-nav-background" />
                      </div>
                    )}
                    <div className="min-w-full py-4 flex justify-center">
                      <Button onClick={loadNextImageSet} className="w-28 px-1 ">
                        More Images...
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog> */}
          </div>

          {/* )} */}
        </div>
        <Badge
          className={` min-w-fit h-fit self-center text-xs px-2 py-[0.2em] m-1 ${
            project.createdBy == userId
              ? "bg-badgePurple"
              : isCurrentUserAdmin
              ? "bg-badgeRed"
              : "bg-badgeBlue"
          } `}
        >
          {project.createdBy == userId
            ? "Creator"
            : isCurrentUserAdmin
            ? `Admin`
            : `Member`}
        </Badge>
      </div>
      <main
        style={
          projectBackgroundImage
            ? {
                backgroundImage: "url(" + projectBackgroundImage + ")",
                backgroundSize: "cover",
                backgroundPosition: " center",
                backgroundRepeat: "no-repeat",
              }
            : {}
        }
        className={cn(
          isCurrentUserAdmin ? "left-6 md:left-8 " : "left-0",
          `bg-gradient-background-light dark:bg-gradient-background-dark fixed w-[calc(100vw-1.5rem)] md:w-[calc(100vw-2rem)]  min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-3rem)] border border-l-0`
        )}
      >
        <ScrollArea
          type="always"
          className=" w-[calc(100vw-2rem)] flex h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)] "
        >
          <div className="flex justify-start  pt-16 align-top">
            <CardView
              viewType={sortBy}
              tasks={tasks}
              project={project}
              projectUsers={uniqueProjectUsers}
              isCurrentUserAdmin={isCurrentUserAdmin}
            />
          </div>
          <ScrollBar orientation="horizontal" />
          <ScrollBar />
        </ScrollArea>
      </main>
    </div>
  );
}
