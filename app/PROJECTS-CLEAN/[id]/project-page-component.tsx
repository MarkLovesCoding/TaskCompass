"use client";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import useScreenSize from "../hooks/useScreenSize";
import { capitalizeEachWord } from "./utils";
import { Button } from "@/components/ui/button";
import { TaskCard } from "./TaskCard";
import { MemberCardWithPermissions } from "./member-card-with-permissions";
import { NewTaskCard } from "./NewTaskCard";
import { ProjectHeader } from "./ProjectHeader";
import {
  PlusIcon,
  FolderKanbanIcon,
  ArrowBigLeftIcon,
  ArrowRightCircle,
  XIcon,
  ArrowLeftIcon,
  ArrowLeftCircleIcon,
  ArchiveIcon,
} from "lucide-react";
import Link from "next/link";
import { PersonStanding } from "lucide-react";
import type { ProjectDto } from "@/use-cases/project/types";
import type { TaskDto } from "@/use-cases/task/types";
// import UpdateProjectUsersCard from "./UpdateProjectUsersCard";
import { MemberCardSearchTable } from "./member-card-search-table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UserIcon, UserCog, CheckIcon, ClockIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import getProject from "@/data-access/projects/get-project.persistence";
import getProjectTasks from "@/data-access/tasks/get-project-tasks.persistence";
import { ArrowDownCircle } from "lucide-react";
import { UserDto } from "@/use-cases/user/types";
import UnarchiveTaskPopover from "./UnarchiveTaskPopover";
import ArchiveProjectPopover from "./ArchiveProjectPopover";

import { ProjectHeaderStatic } from "./ProjectHeaderStatic";
import { getInitials } from "@/app/utils/getInitials";

import { useState, useEffect } from "react";
import CardView from "./CardView";
import SideBar from "./SideBar";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Project from "@/db/(models)/Project";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { TeamDto } from "@/use-cases/team/types";
export function ProjectPage({
  // id,
  userId,
  user,
  project,
  tasks,
  teamUsers,
  projectUsers,
  team,
}: {
  // id: string;
  userId: string;
  user: UserDto;
  project: ProjectDto;
  tasks: TaskDto[];
  teamUsers: UserDto[];
  team: TeamDto;
  projectUsers: UserDto[];
}) {
  // const [project, setProject] = useState<ProjectDto>();
  // const [tasks, setTasks] = useState<TaskDto[]>([]);
  // useEffect(() => {
  //   console.log("projectUsers", projectUsers);

  //   const fetchData = async () => {
  //     const project = await getProject(id);
  //     setProject(project);
  //     const tasks = await getProjectTasks(project);
  //     setTasks(tasks);
  //     // Do something with project and tasks
  //   };

  //   fetchData();
  // }, [projectUsers, id]);
  const [sortBy, setSortBy] = useState<string>("priority");
  const isUserAdmin =
    project && user.projectsAsAdmin.some((id) => id === project.id);
  // const isUserAdmin = false;
  const archivedTasks = tasks.filter((task) => task.archived);
  const uniqueTeamUsers = [...teamUsers];
  const uniqueProjectUsers = [...projectUsers];
  const projectAdmins = projectUsers.filter((user) =>
    user.projectsAsAdmin.includes(project.id)
  );
  const projectMembers = projectUsers.filter((user) =>
    user.projectsAsMember.includes(project.id)
  );
  const screenSize = useScreenSize();
  const isShort = screenSize.height < 640;
  const isSkinny = screenSize.width < 550;
  if (!project || !tasks) return <div>Loading...</div>;
  console.log("Tasks", tasks);
  return (
    <div className="flex flex-col justify-start items-center min-h-full ">
      <div>
        {isUserAdmin && (
          <Drawer direction="left">
            <DrawerTrigger>
              <div className="fixed group top-[4rem] left-0 w-8 z-20 h-[calc(100vh-4rem)] border-r-2 border-t-2 rounded-tr rounded-br border-b-2 border-r-gray-700 hover:border-r-white  border-t-gray-700 hover:border-t-white border-b-gray-700 hover:border-b-white bg-gray-900 hover:bg-gray-800">
                <ArrowRightCircle className="  fixed z-50 rounded-full fill-background group-hover:text-white text-slate-600 top-[calc(50%-1em)] left-4  w-8 h-8 self-center cursor-pointer" />
              </div>
            </DrawerTrigger>

            {isSkinny && isShort ? (
              <DrawerContent className="group lg:h-[calc(100vh-2em)] flex justify-center items-center h-[calc(100vh-4em)] overflow-x-visible  max-w-[95vw] tall:max-w-[450px] rounded-tl-none rounded-bl-none p-4 fixed top-16 left-0 border-r-2 border-t-2 border-b-2 border-r-gray-700 hover:border-r-white  border-t-gray-700 hover:border-t-white border-b-gray-700 hover:border-b-white cursor-grab active:cursor-grabbing">
                <DrawerClose className="absolute top-1 right-2">
                  {/* <Button variant="outline"> */}
                  <ArrowLeftCircleIcon className="fixed right-[-1em] top-[calc(50%-4rem)] w-8 h-8 self-center bg-background text-gray-700 group-hover:text-white" />
                  {/* </Button> */}
                </DrawerClose>{" "}
                <DrawerHeader className="flex justify-center items-center">
                  <Label>Window Too Small, please expand to view</Label>
                </DrawerHeader>
              </DrawerContent>
            ) : (
              <DrawerContent className="group lg:h-[calc(100vh-2em)]  h-[calc(100vh-4em)] overflow-x-visible  max-w-[95vw] tall:max-w-[450px] rounded-tl-none rounded-bl-none p-4 fixed top-16 left-0 border-r-2 border-t-2 border-b-2 border-r-gray-700 hover:border-r-white  border-t-gray-700 hover:border-t-white border-b-gray-700 hover:border-b-white cursor-grab active:cursor-grabbing">
                <DrawerClose className="absolute top-1 right-2">
                  {/* <Button variant="outline"> */}
                  <ArrowLeftCircleIcon className="fixed right-[-1em] top-[calc(50%-4rem)] w-8 h-8 self-center bg-background text-gray-700 group-hover:text-white" />
                  {/* </Button> */}
                </DrawerClose>
                <DrawerHeader>
                  <div className="flex flex-col mobileLandscape:w-[60%]">
                    <ProjectHeader project={project} />
                  </div>
                  <Separator
                    className="my-1 lg:my-4"
                    orientation="horizontal"
                  />
                  <div className="flex flex-col short:flex-row  ">
                    <div className="flex-1 flex-col mobilePortrait:flex-col mr-2 py-2">
                      {/* <div className="grid grid-cols-5 gap-4"> */}
                      <div className="flex flex-row  lg:gap-4 justify-start align-middle lg:min-h-4">
                        <h3 className="  lg:mb-2 mr-auto text-md lg:text-xl font-bold">
                          Members
                        </h3>
                        <MemberCardSearchTable
                          userId={userId}
                          project={project}
                          teamUsers={uniqueTeamUsers}
                          projectUsers={uniqueProjectUsers}
                        />
                      </div>
                      {/* Admins Section */}
                      <div className="flex flex-col mobileLandscape:flex-row mobilePortrait:flex-col">
                        <div>
                          <div className="flex flex-col w-[225px] mobilePortrait:w-[175px]">
                            <Label className="flex flex-row p-2 lg:p-4 items-center space-x-2 text-popover-foreground text-md">
                              <div className="flex flex-row mr-auto items-center space-x-2 ">
                                <UserCog className="w-4 h-4 opacity-60" />
                                <p className="text-sm lg:text-md">
                                  Project Admins :
                                </p>{" "}
                              </div>
                              <p className="ml-auto font-bold">
                                {projectAdmins.length}
                              </p>
                            </Label>
                          </div>

                          <div className=" mb-2 flex flex-row overflow-auto">
                            <>
                              {projectAdmins.map((member, index) => (
                                <div key={index} className="p-2">
                                  <Popover>
                                    <PopoverTrigger>
                                      <Avatar
                                        key={index}
                                        className="w-8 h-8 lg:w-10 lg:h-10"
                                      >
                                        {/* <AvatarImage src={member.avatar} /> */}
                                        <AvatarFallback
                                          className={` text-xs lg:text-sm bg-gray-500`}
                                        >
                                          {getInitials(member.name)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="sr-only">
                                        User Avatar
                                      </span>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[calc(100%-3em)] m-4 p-0 border-none">
                                      <MemberCardWithPermissions
                                        user={member}
                                        project={project}
                                        tasks={tasks}
                                        team={team}
                                      />
                                    </PopoverContent>
                                  </Popover>
                                </div>
                              ))}
                            </>
                            {/* </div> */}
                          </div>
                        </div>
                        {/* <Separator
                    className="my-4 w-[75%] mx-auto"
                    orientation="horizontal"
                  /> */}
                        {/* {isShort && (
                          <Separator
                            className="my-10   mx-auto"
                            orientation="vertical"
                          />
                        )} */}
                        <div>
                          <div className="flex flex-col  w-[225px] mobilePortrait:w-[175px]">
                            <Label className="flex flex-row p-2 lg:p-4 items-center space-x-2 text-popover-foreground text-md">
                              <div className="flex flex-row mr-auto items-center space-x-2 ">
                                <UserIcon className="w-4 h-4 opacity-60" />

                                <p className="text-sm lg:text-md">
                                  Project Members :{" "}
                                </p>
                              </div>
                              <p className="ml-auto font-bold">
                                {projectMembers.length}
                              </p>
                            </Label>
                          </div>
                          <div className=" mb-2 flex flex-row">
                            <>
                              {projectMembers.map((member, index) => (
                                <div key={index} className="p-2">
                                  <Popover>
                                    <PopoverTrigger>
                                      <Avatar
                                        key={index}
                                        className=" w-10 h-10"
                                      >
                                        {/* <AvatarImage src={member.avatar} /> */}
                                        <AvatarFallback
                                          className={`text-sm bg-gray-500`}
                                        >
                                          {getInitials(member.name)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="sr-only">
                                        User Avatar
                                      </span>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                      <MemberCardWithPermissions
                                        user={member}
                                        project={project}
                                        tasks={tasks}
                                        team={team}
                                      />
                                    </PopoverContent>
                                  </Popover>
                                </div>
                              ))}
                            </>
                            {/* </div> */}
                          </div>
                        </div>
                      </div>
                    </div>
                    {isShort && !isSkinny ? (
                      <Separator
                        className="my-1 lg:my-4  mx-auto"
                        orientation="vertical"
                      />
                    ) : (
                      <Separator
                        className="mx-2 lg:mx-4  my-auto"
                        orientation="horizontal"
                      />
                    )}

                    <div className="flex small:flex-1 flex-col ml-2">
                      <h3 className="mb-2 mr-auto text-md lg:text-xl font-bold">
                        Tasks
                      </h3>
                      <div className="flex flex:row flex-wrap short:flex-col">
                        <div className="flex flex-col lg:w-[225px]  mobilePortrait:w-[175px]">
                          <Label className="flex flex-row p-1 lg:p-4 items-center space-x-2 text-popover-foreground text-md">
                            <div className="flex flex-row mr-auto items-center space-x-2 ">
                              <ClockIcon className="w-4 h-4 mr-1  opacity-60" />
                              <p className="text-sm lg:text-md">
                                Active Tasks :{" "}
                              </p>{" "}
                            </div>
                            <p className="ml-auto font-bold">
                              {
                                tasks.filter(
                                  (task) => task.status !== "Completed"
                                ).length
                              }
                            </p>
                          </Label>
                        </div>{" "}
                        <div className="flex flex-col lg:w-[225px]  mobilePortrait:w-[175px] ">
                          <Label className="flex flex-row p-1 lg:p-4 items-center space-x-2 text-popover-foreground text-md">
                            <div className="flex flex-row mr-auto items-center space-x-2 ">
                              <CheckIcon className="w-4 h-4 mr-1 opacity-60" />
                              <p className="text-sm lg:text-md">
                                Completed Tasks :{" "}
                              </p>{" "}
                            </div>

                            <p className="ml-auto font-bold">
                              {
                                tasks.filter(
                                  (task) => task.status == "Completed"
                                ).length
                              }
                            </p>
                          </Label>
                        </div>
                        <div className="">
                          <Popover>
                            <PopoverTrigger className=" flex flex-col lg:w-[225px]  mobilePortrait:w-[175px]">
                              <div className="flex flex-row items-center space-x-2 p-1 lg:p-4 rounded hover:bg-primary-foreground">
                                <div className="flex flex-row mr-auto items-center space-x-2 ">
                                  <ArchiveIcon className="w-4 h-4 mr-1 opacity-60" />
                                  <p className="text-sm lg:text-md">
                                    Archived Tasks:
                                  </p>
                                </div>
                                <p className="ml-auto font-bold">
                                  {tasks.filter((task) => task.archived).length}
                                </p>
                              </div>
                              {/* <p className="text-sm ml-5 underline italic">
                          {archivedTasks.length > 0 && `unarchive?`}
                        </p> */}
                            </PopoverTrigger>
                            <PopoverContent>
                              <ScrollArea>
                                {archivedTasks.length === 0 ? (
                                  <div className="p-2">No archived tasks</div>
                                ) : (
                                  <div className="p-2 flex flex-col">
                                    {tasks.map(
                                      (task, task_idx) =>
                                        task.archived && (
                                          <div key={task_idx}>
                                            <UnarchiveTaskPopover task={task} />
                                            {task_idx !== 0 ||
                                              (task_idx !==
                                                archivedTasks.length - 1 && (
                                                <Separator className="my-2" />
                                              ))}
                                          </div>
                                        )
                                    )}
                                  </div>
                                )}
                              </ScrollArea>
                            </PopoverContent>
                          </Popover>
                          {/* <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <ArchiveIcon className="w-8 h-8 self-center cursor-pointer" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuGroup>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              Archived Tasks
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <ScrollArea>
                                  {archivedTasks.length === 0 ? (
                                    <div className="p-2">No archived tasks</div>
                                  ) : (
                                    <div className="p-2 flex flex-col">
                                      {tasks.map(
                                        (task, task_idx) =>
                                          task.archived && (
                                            <div key={task_idx}>
                                              <UnarchiveTaskPopover
                                                task={task}
                                              />
                                              {task_idx !== 0 ||
                                                (task_idx !==
                                                  archivedTasks.length - 1 && (
                                                  <Separator className="my-2" />
                                                ))}
                                            </div>
                                          )
                                      )}
                                    </div>
                                  )}
                                </ScrollArea>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </DrawerHeader>

                <DrawerFooter className="flex align-bottom mb-4 lg:my-auto my-0">
                  <Separator
                    className="my-1 lg:my-4 mx-auto"
                    orientation="horizontal"
                  />

                  <div className="flex justify-center my-auto">
                    <Button variant="outline">
                      {/* <Label>Archive Project</Label> */}
                      <ArchiveIcon className="w-8 h-8 ml-3 self-center" />
                      <ArchiveProjectPopover project={project} />
                      <span className="sr-only">Archive Project Button</span>
                    </Button>
                  </div>
                </DrawerFooter>
              </DrawerContent>
            )}
            {/* <SideBar /> */}
          </Drawer>
        )}
      </div>
      <div
        className={cn(
          isUserAdmin ? "left-8 " : "left-0",
          `fixed h-16 top-16 flex-row flex p-2 border-b-slate-50 w-[calc(100vw-2rem)] bg-background `
        )}
      >
        <div className="min-w-fit p-2 max-h-16">
          <Link href={`/TEAMS-CLEAN/${project.team}`}>
            <h4 className="text-xs  underline cursor-pointer">Back to Team</h4>
          </Link>
          <h4>{project.name}</h4>
        </div>
        <div className="flex flex-row w-full   justify-center align-middle ">
          <div className="p-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Label>{`View : ${capitalizeEachWord(sortBy)}  `}</Label>
                  <FolderKanbanIcon className="w-8 h-8 ml-3 self-center cursor-pointer" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>View</DropdownMenuLabel>
                <Separator className="my-2" />
                <DropdownMenuRadioGroup
                  value={sortBy}
                  onValueChange={setSortBy}
                >
                  <DropdownMenuRadioItem value="priority">
                    Priority
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="status">
                    Status
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="category">
                    Category
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {/* {isUserAdmin && ( */}
          <div className="p-2">
            <Popover>
              <PopoverTrigger>
                <Button variant="outline">
                  <Label>New Task</Label>
                  <PlusIcon className="w-8 h-8 ml-3 self-center" />
                  <span className="sr-only">New Task Button</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <NewTaskCard project={project} />
              </PopoverContent>
            </Popover>
          </div>
          {/* )} */}
        </div>
      </div>
      <main
        className={cn(
          isUserAdmin ? "left-8 " : "left-0",
          `fixed top-[8rem] w-[calc(100vw-2rem)] h-[calc(100vh-8rem)] border`
        )}
      >
        <ScrollArea
          type="always"
          className=" w-[calc(100vw-2rem)] h-[calc(100vh-8rem)] "
        >
          <div className="">
            <CardView
              viewType={sortBy}
              tasks={tasks}
              project={project}
              projectUsers={uniqueProjectUsers}
            />
          </div>
          <ScrollBar orientation="horizontal" />
          <ScrollBar />
        </ScrollArea>
      </main>
    </div>
  );
}
