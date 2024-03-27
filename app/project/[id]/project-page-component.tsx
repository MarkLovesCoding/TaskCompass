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
import { ScrollArea, ScrollBar } from "@/components/ui/card-scroll-area";
import getProject from "@/data-access/projects/get-project.persistence";
import getProjectTasks from "@/data-access/tasks/get-project-tasks.persistence";
import { ArrowDownCircle } from "lucide-react";
import { UserDto } from "@/use-cases/user/types";
import UnarchiveTaskPopover from "./UnarchiveTaskPopover";
import ArchiveProjectPopover from "./ArchiveProjectPopover";

import { ProjectHeaderStatic } from "./ProjectHeaderStatic";
import { getInitials } from "@/lib/utils/getInitials";

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
import { cn } from "@/lib/utils/utils";
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
  if (!project || !tasks) return <div>Loading...</div>;
  console.log("Tasks", tasks);
  return (
    <div className="flex flex-col justify-start items-center min-h-full ">
      <div>
        {isUserAdmin && (
          <Drawer direction="left">
            <DrawerTrigger>
              <div className="fixed group top-[3rem] left-0 w-8 z-20 h-[calc(100vh-3rem)] bg-nav-background hover:bg-primary  border-r-2 border-t-2 rounded-tr rounded-br border-b-2 border-nav-background hover:border-r-card  hover:border-t-card hover:border-b-card ">
                <ArrowRightCircle className="  fixed z-50 rounded-full fill-background group-hover:text-primary text-card top-[calc(50%-1em)] left-4  w-8 h-8 self-center cursor-pointer" />
              </div>
            </DrawerTrigger>

            <DrawerContent>
              <div
                className={`group hidden bg-drawer-background backdrop-filter backdrop-blur  p-6 fixed top-12 left-0 h-[calc(100vh-3rem)]  tooSmall:grid   max-w-[450px]  rounded-tl-none rounded-bl-none  border-r-2 border-t-2 border-b-2 border-r-primary hover:border-r-primary  border-t-primary hover:border-t-primary border-b-primary hover:border-b-primary cursor-grab active:cursor-grabbing`}
              >
                <Label>
                  Window too too small, please expand or rotate to view
                </Label>
              </div>

              <div
                className={`group  tooSmall:hidden flex flex-col bg-drawer-background backdrop-filter backdrop-blur-lg   fixed top-12 left-0 h-[calc(100vh-3rem)] w-[425px] max-w-[95vw] rounded-tl-none rounded-bl-none border-r-2 border-t-2 border-b-2 z-40 border-r-card hover:border-r-primary border-t-card hover:border-t-primary border-b-card hover:border-b-primary cursor-grab active:cursor-grabbing p-2 pt-3 `}
              >
                <DrawerClose className="">
                  <ArrowLeftCircleIcon className="absolute right-[-1em] z-50 top-[calc(50%-3rem)]  rounded-full w-8 h-8 self-center bg-background text-card group-hover:text-primary" />
                </DrawerClose>

                <ScrollArea className="p-3">
                  <ScrollBar />
                  {/* <div className="flex-1 basis-1/2"> */}
                  <div className="  flex flex-col mb-2  order-1  p-2">
                    <ProjectHeader project={project} />
                  </div>
                  <div
                    className={`   order-2 mb-2
                       border-secondary border-solid border-[1px]  rounded-lg p-2
                   `}
                  >
                    <div className=" flex flex-col ml-2">
                      <h3 className="mb-2 mobileLandscape:mb-1 mr-auto text-md lg:text-lg font-bold">
                        Tasks
                      </h3>
                      <div className="flex flex-col">
                        <div className="flex flex-col w-[225px] mobileLandscape:w-[175px] ">
                          <Label className="flex flex-row p-1 pr-2  items-center space-x-2 text-popover-foreground">
                            <div className="flex flex-row mr-auto items-center space-x-2 ">
                              <ClockIcon className="w-4 h-4 mr-1  opacity-60" />
                              <p className=" mobileLandscape:text-xs text-sm">
                                Active Tasks :
                              </p>
                            </div>
                            <p className="ml-auto font-bold mobileLandscape:text-sm">
                              {
                                tasks.filter(
                                  (task) => task.status !== "Completed"
                                ).length
                              }
                            </p>
                          </Label>
                        </div>
                        <div className="flex flex-col w-[225px] mobileLandscape:w-[175px] ">
                          <Label className="flex flex-row p-1 items-center pr-2 space-x-2 text-popover-foreground ">
                            <div className="flex flex-row mr-auto items-center space-x-2 ">
                              <CheckIcon className="w-4 h-4 mr-1 opacity-60" />
                              <p className="text-sm mobileLandscape:text-xs">
                                Completed Tasks :
                              </p>
                            </div>

                            <p className="ml-auto font-bold mobileLandscape:text-sm">
                              {
                                tasks.filter(
                                  (task) => task.status == "Completed"
                                ).length
                              }
                            </p>
                          </Label>
                        </div>
                        <div className=" w-[225px] mobileLandscape:w-[175px]">
                          <Popover>
                            <PopoverTrigger className=" flex flex-col w-full  mobileLandscape:w-[175px]">
                              <Label className="flex flex-row items-center space-x-2 p-1 pr-2  w-full rounded hover:bg-primary-foreground">
                                <div className="flex flex-row mr-auto items-center space-x-2  ">
                                  <ArchiveIcon className="w-4 h-4 mr-1 opacity-60" />
                                  <p className=" mobileLandscape:text-xs text-sm italic">
                                    Archived Tasks:
                                  </p>
                                </div>
                                <p className="ml-auto font-bold text-sm mobileLandscape:text-sm">
                                  {tasks.filter((task) => task.archived).length}
                                </p>
                              </Label>
                            </PopoverTrigger>
                            <PopoverContent>
                              <ScrollArea>
                                {archivedTasks.length === 0 ? (
                                  <div className="">No archived tasks</div>
                                ) : (
                                  <div className=" flex flex-col">
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
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* </div> */}
                  <div
                    className={` border-secondary border-solid border-[1px] mb-2  order-3  rounded-lg p-2 flex  flex-col   py-2`}
                  >
                    <div className="flex flex-row  justify-start align-middle ml-2">
                      <h3 className="   mr-auto text-md font-bold">Members</h3>
                      <MemberCardSearchTable
                        userId={userId}
                        project={project}
                        teamUsers={uniqueTeamUsers}
                        projectUsers={uniqueProjectUsers}
                      />
                    </div>
                    <div className=" flex flex-col  ">
                      <div>
                        <div className="flex flex-col  w-[225px] mobileLandscape:w-[175px]">
                          <Label className="flex flex-row p-2 items-center space-x-2 text-popover-foreground ">
                            <div className="flex flex-row mr-auto items-center space-x-2 ">
                              <UserCog className="w-4 h-4 mr-1 opacity-60" />
                              <p className=" text-sm mobileLandscape:text-xs">
                                Project Admins :
                              </p>
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
                                    <Avatar key={index} className="w-8 h-8 ">
                                      <AvatarFallback
                                        className={` text-xs hover:bg-primary bg-secondary`}
                                      >
                                        {getInitials(member.name)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="sr-only">User Avatar</span>
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
                        </div>
                      </div>

                      <div>
                        <div className="flex flex-col  w-[225px] mobileLandscape:w-[175px] ">
                          <Label className="flex flex-row p-2  items-center space-x-2 text-popover-foreground ">
                            <div className="flex flex-row mr-auto items-center space-x-2 ">
                              <UserIcon className="w-4 h-4 mr-1 opacity-60" />

                              <p className=" text-sm ">Project Members :</p>
                            </div>
                            <p className="ml-auto font-bold m">
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
                                    <Avatar key={index} className=" w-10 h-10">
                                      <AvatarFallback
                                        className={`text-sm bg-gray-500`}
                                      >
                                        {getInitials(member.name)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="sr-only">User Avatar</span>
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
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={` 1/10
                  flex align-bottom justify-end mb-2 my-0 order-4
                  `}
                  >
                    <div className="flex justify-center my-auto">
                      <Button
                        variant="outline"
                        className="h-fit w-fit py-1 px-2 border-destructive"
                      >
                        <ArchiveIcon className="w-4 h-4 mr-1 self-center" />
                        <ArchiveProjectPopover project={project} />
                        <span className="sr-only">Archive Project Button</span>
                      </Button>
                    </div>
                  </div>{" "}
                </ScrollArea>
              </div>
            </DrawerContent>
          </Drawer>
        )}
      </div>
      <div
        className={cn(
          isUserAdmin ? "left-8 " : "left-0",
          `fixed h-16 top-16 flex-row flex p-2 border-b-slate-50 w-[calc(100vw-2rem)] bg-background `
        )}
      >
        <div className="min-w-fit p-1 max-h-16">
          <Link href={`/team/${project.team}`}>
            <h4 className="text-xs  underline cursor-pointer">Back to Team</h4>
          </Link>
          <div className="flex items-center m-2 ">
            <h4 className=" text-sm md:text-md lg:text-lg pr-3">Project:</h4>
            <h4 className="text-sm md:text-md font-bold lg:text-lg">
              {project.name}
            </h4>
          </div>
        </div>
        <div className="flex flex-row w-full   justify-center align-middle ">
          <div title="Change View" className="p-2 ">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Label className="hidden md:flex ">{`View : ${capitalizeEachWord(
                    sortBy
                  )}  `}</Label>
                  <FolderKanbanIcon className="w-8 h-8 md:ml-3 self-center cursor-pointer" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel className="text-center font-bold">
                  View
                </DropdownMenuLabel>
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
          <div title="Create New Task" className="p-2">
            <Popover>
              <PopoverTrigger>
                <Button variant="outline">
                  <Label className="hidden md:flex ">New Task</Label>
                  <PlusIcon className="w-8 h-8 md:ml-3 self-center" />
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
          className=" w-[calc(100vw-2rem)] flex  h-[calc(100vh-8rem)] "
        >
          <div className="flex justify-start align-top">
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
