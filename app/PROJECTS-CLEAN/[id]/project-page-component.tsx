"use client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  Card,
  CardFooter,
} from "@/components/ui/card";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { TaskCard } from "./TaskCard";
import { MemberCardWithPermissions } from "./member-card-with-permissions";
import { NewTaskCard } from "./NewTaskCard";
import { ProjectHeader } from "./ProjectHeader";
import {
  Archive,
  CircleEllipsisIcon,
  PlusCircleIcon,
  ShieldEllipsisIcon,
  PlusIcon,
  LayoutDashboardIcon,
  FolderKanbanIcon,
  ArrowBigLeftIcon,
} from "lucide-react";
import Link from "next/link";
import { PersonStanding } from "lucide-react";
import type { ProjectDto } from "@/use-cases/project/types";
import type { TaskDto } from "@/use-cases/task/types";
import { AddMemberForm } from "./AddMemberForm";
import UpdateProjectUsersCard from "./UpdateProjectUsersCard";
import { MemberCardSearchTable } from "./member-card-search-table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { ScrollArea } from "@/components/ui/scroll-area";

import { UserDto } from "@/use-cases/user/types";
import UnarchiveTaskPopover from "./UnarchiveTaskPopover";
import ArchiveProjectPopover from "./ArchiveProjectPopover";

import { Label } from "@/components/ui/label";
import { ProjectHeaderStatic } from "./ProjectHeaderStatic";
// import PriorityView from "./PriorityView";
import { getInitials } from "@/app/utils/getInitials";

import { sortByType } from "./utils";
import { useState } from "react";
import CardView from "./CardView";
// import UpdateProjectMembersCard from "./UpdateProjectMembersCard";
export function ProjectPage({
  userId,
  project,
  tasks,
  teamMembers,
  teamAdmins,
  projectMembers,
  projectAdmins,
}: {
  userId: string;
  project: ProjectDto;
  tasks: TaskDto[];
  teamMembers: UserDto[];
  teamAdmins: UserDto[];
  projectMembers: UserDto[];
  projectAdmins: UserDto[];
}) {
  type SortTypeType = "priority" | "status" | "category";

  const [sortBy, setSortBy] = useState<string>("priority");
  const isUserAdmin = project.admins.some((admin) => admin === userId);
  const archivedTasks = tasks.filter((task) => task.archived);
  const allTeamUsers = [...teamMembers, ...teamAdmins];
  const uniqueTeamUserIds = new Set(allTeamUsers.map((user) => user.id));
  const uniqueTeamUsers = Array.from(uniqueTeamUserIds, (userId) =>
    allTeamUsers.find((user) => user.id === userId)
  ) as UserDto[];
  const allProjectUsers = [...projectMembers, ...projectAdmins];
  const uniqueProjectUserIds = new Set(allProjectUsers.map((user) => user.id));
  const uniqueProjectUsers = Array.from(uniqueProjectUserIds, (userId) =>
    allProjectUsers.find((user) => user.id === userId)
  ) as UserDto[];

  // let sortBy = "priority";
  console.log("teamMembers-SECOND COMONENT", teamMembers);

  return (
    <div className="flex flex-col justify-start items-center min-h-[calc(100vh-4rem)]  ">
      <main className="flex flex-col  max-w-[1400px]  ">
        <div className="flex  flex-row items-center justify-center  mt-4 align-middle">
          <div>
            {" "}
            <Link href={`/TEAMS-CLEAN/${project.team}`}>
              <h4 className="text-xs  underline cursor-pointer">
                Back to Team Page
              </h4>
            </Link>
            {!isUserAdmin ? (
              <div className="flex  py-2 ">
                <ProjectHeaderStatic project={project} />
              </div>
            ) : (
              <div className="flex flex-row py-2">
                <div className="flex flex-col ">
                  <ProjectHeader project={project} />
                </div>
                <div className="flex flex-col">
                  <h2 className="mb-2 text-sm">
                    Project Members: {uniqueProjectUsers.length}
                  </h2>
                  <div className=" mb-2 flex flex-row">
                    <>
                      {uniqueProjectUsers.map((member, index) => (
                        <div className="p-2">
                          <Popover>
                            <PopoverTrigger>
                              <Avatar key={index} className=" w-10 h-10">
                                <AvatarImage src={member.avatar} />
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
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      ))}
                      <MemberCardSearchTable
                        userId={userId}
                        project={project}
                        teamUsers={uniqueTeamUsers}
                        projectUsers={uniqueProjectUsers}
                      />
                    </>
                  </div>
                </div>
                <Separator className="mb-4" orientation="vertical" />

                <div className="flex flex-col">
                  <div className="p-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <CircleEllipsisIcon className="w-8 h-8 self-center cursor-pointer" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        {/* <DropdownMenuGroup> */}
                        {/* <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              Add users
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <UpdateProjectUsersCard
                                  userId={userId}
                                  project={project}
                                  teamUsers={uniqueTeamUsers}
                                  projectUsers={uniqueProjectUsers}
                                />
                                {/* <MemberCardSearchTable /> */}
                        {/* </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub> */}
                        {/* </DropdownMenuGroup> */}
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
                        <Separator className="my-2" />

                        <DropdownMenuGroup>
                          <ArchiveProjectPopover project={project} />
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>{" "}
                  </div>
                  <div className="p-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <FolderKanbanIcon className="w-8 h-8 self-center cursor-pointer" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Sort by:</DropdownMenuLabel>
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
                  {isUserAdmin && (
                    <div className="p-2">
                      <Popover>
                        <PopoverTrigger>
                          <PlusIcon className="w-8 h-8 self-center" />
                          <span className="sr-only">New Task Button</span>
                        </PopoverTrigger>
                        <PopoverContent>
                          <NewTaskCard project={project} />
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <div className="flex flex-col w-[700px] md:max-w-screen-sm">
        <h3 className="text-lg font-bold">Project Tasks</h3>
        <Separator className="mb-4" />
      </div>
      <div className="flex-1 justify-center h-min-full ">
        <CardView
          type={sortBy}
          tasks={tasks}
          project={project}
          projectUsers={uniqueProjectUsers}
        />
      </div>
    </div>
  );
}
