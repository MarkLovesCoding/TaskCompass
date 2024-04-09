import { ProjectDto } from "@/use-cases/project/types";
import { TaskDto } from "@/use-cases/task/types";
import { UserDto } from "@/use-cases/user/types";

import { AvatarFallback, Avatar } from "@/components/ui/avatar";
import { ProjectUserCardWithPermissions } from "./ProjectUserCardWithPermissions";
import { ProjectHeader } from "./ProjectHeader";
import {
  ArrowRightCircle,
  ArrowLeftCircleIcon,
  ArchiveIcon,
} from "lucide-react";

// import UpdateProjectUsersCard from "./UpdateProjectUsersCard";
import { ProjectUserSearchTable } from "./ProjectUserSearchTable";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UserIcon, UserCog, CheckIcon, ClockIcon } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/card-scroll-area";
import UnarchiveTaskPopover from "./UnarchiveTaskPopover";
import ArchiveProjectPopover from "./ArchiveProjectPopover";

import { getInitials } from "@/lib/utils/getInitials";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { TeamDto } from "@/use-cases/team/types";
type ProjectDrawerProps = {
  userId: string;
  team: TeamDto;
  tasks: TaskDto[];
  project: ProjectDto;
  teamUsers: UserDto[];
  projectUsers: UserDto[];
};
const ProjectDrawer = ({
  userId,
  team,
  tasks,
  project,
  teamUsers,
  projectUsers,
}: ProjectDrawerProps) => {
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

  return (
    <Drawer direction="left">
      <DrawerTrigger>
        <div className="fixed z-60 group top-[2rem] md:top-[3rem] left-0 w-6 md:w-8 z-20 h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)] bg-nav-background backdrop-filter backdrop-blur  hover:bg-card  border-r-2 border-t-2 rounded-tr-lg rounded-br-lg border-b-2 border-nav-background hover:border-r-primary  hover:border-t-primary hover:border-b-primary ">
          <ArrowRightCircle className="  fixed z-70 rounded-full fill-background group-hover:text-primary text-nav-background top-[calc(50%-1em)] left-3 md:left-4 w-6 h-6 md:w-8 md:h-8 self-center cursor-pointer" />
        </div>
      </DrawerTrigger>

      <DrawerContent>
        <div
          className={`group hidden bg-drawer-background backdrop-filter backdrop-blur  p-6 fixed top-12 left-0 h-[calc(100vh-3rem)]  tooSmall:grid   max-w-[450px]  rounded-tr-lg rounded-br-lg  border-r-2 border-t-2 border-b-2 border-r-primary hover:border-r-primary  border-t-primary hover:border-t-primary border-b-primary hover:border-b-primary cursor-grab active:cursor-grabbing`}
        >
          <Label>Window too too small, please expand or rotate to view</Label>
        </div>

        <div
          className={`group  tooSmall:hidden flex flex-col bg-accordion-background backdrop-filter backdrop-blur-lg   fixed top-12 left-0 h-[calc(100vh-3rem)] w-[425px] max-w-[95vw] rounded-tr-lg rounded-br-lg border-r-2 border-t-2 border-b-2 z-40 border-r-card hover:border-r-primary border-t-card hover:border-t-primary border-b-card hover:border-b-primary cursor-grab active:cursor-grabbing p-2 pt-3 `}
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
                            (task) =>
                              task.status !== "Completed" && !task.archived
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
                            (task) =>
                              task.status == "Completed" && !task.archived
                          ).length
                        }
                      </p>
                    </Label>
                  </div>
                  <div className=" w-[225px] mobileLandscape:w-[175px]">
                    <Popover>
                      <PopoverTrigger className=" flex flex-col w-full  mobileLandscape:w-[175px]">
                        <Label className="flex flex-row items-center space-x-2 p-1 pr-2  w-full rounded hover:bg-accent hover:cursor-pointer">
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
                <h3 className="   mr-auto text-md font-bold">Users</h3>
                <ProjectUserSearchTable
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
                              <ProjectUserCardWithPermissions
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
                              <Avatar key={index} className=" w-8 h-8">
                                <AvatarFallback
                                  className={` text-xs hover:bg-primary bg-secondary`}
                                >
                                  {getInitials(member.name)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="sr-only">User Avatar</span>
                            </PopoverTrigger>
                            <PopoverContent className="w-[calc(100%-3em)] m-4 p-0 border-none">
                              <ProjectUserCardWithPermissions
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
                {/* <Button
                  variant="outline"
                  className="h-fit w-fit group/hover hover:border-destructive hover:bg-destructive"
                > */}
                <ArchiveProjectPopover project={project} />
                {/* <span className="sr-only">Archive Project Button</span>
                </Button> */}
              </div>
            </div>{" "}
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ProjectDrawer;
