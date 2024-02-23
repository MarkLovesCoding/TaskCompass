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
  const uniqueTeamUsersSet = new Set([...teamMembers, ...teamAdmins]);
  const teamUsers = [...uniqueTeamUsersSet];

  const uniqueProjectUsersSet = new Set([...projectMembers, ...projectAdmins]);
  const projectUsers = [...uniqueProjectUsersSet];
  // let sortBy = "priority";
  const handleChangeView = (type: string) => {
    setSortBy(type);
  };

  return (
    <div className="flex flex-col w-full ">
      <main className="flex flex-1 min-h-[calc(100vh-4rem)] flex-col gap-4  md:gap-8">
        <div className="flex items-center gap-4">
          {" "}
          <div></div>
          {!isUserAdmin ? (
            <div className="flex px-12 py-6 ">
              <ProjectHeaderStatic project={project} />
            </div>
          ) : (
            <div className="flex px-12 py-6">
              <ProjectHeader project={project} />
              <div className="flex flex-row ">
                <div className="p-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <CircleEllipsisIcon className="w-8 h-8 self-center cursor-pointer" />
                      {/* <Label> */}
                      {/* <p className="text-4xl select-none cursor-pointer">
                          ...
                        </p> */}
                      {/* </Label> */}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuGroup>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            Add users
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <UpdateProjectUsersCard
                                userId={userId}
                                project={project}
                                teamUsers={teamUsers}
                                projectUsers={projectUsers}
                              />
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                      </DropdownMenuGroup>
                      <DropdownMenuGroup>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            Archived Tasks
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <ScrollArea>
                                {archivedTasks.length === 0 ? (
                                  <div className="p-4">No archived tasks</div>
                                ) : (
                                  <div className="p-4 flex flex-col">
                                    {
                                      // projects.length === 0
                                      //   ? "No archived projects"
                                      //   :
                                      tasks.map(
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
                                      )
                                    }
                                  </div>
                                )}
                              </ScrollArea>
                              {/* <AddMemberForm /> */}
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                      </DropdownMenuGroup>
                      <Separator className="my-2" />
                      {/* <DropdownMenuSeparator /> */}
                      <DropdownMenuGroup>
                        {/* <DropdownMenuItem> */}
                        <ArchiveProjectPopover project={project} />
                        {/* </DropdownMenuItem> */}

                        {/* <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        Archive Project
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <Label className="p-4">Archived Projects</Label>
                          <Separator className="my-2" />
                          {/* <AddMemberForm /> */}
                        {/* </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub> */}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>{" "}
                </div>
                <div className="p-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      {/* <Button variant="outline"> */}
                      <FolderKanbanIcon className="w-8 h-8 self-center cursor-pointer" />
                      {/* </Button> */}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>Sort by:</DropdownMenuLabel>
                      {/* <DropdownMenuLabel>Add Users</DropdownMenuLabel> */}
                      {/* <DropdownMenuSeparator /> */}
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
                      {/* <Separator className="my-2" /> */}

                      {/* <DropdownMenuSeparator /> */}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {/* <div className="p-4"> */}
                {isUserAdmin && (
                  <div className="p-4">
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
                {/* </div> */}
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 h-min-full overflow-x-auto">
          <CardView
            type={sortBy}
            tasks={tasks}
            project={project}
            projectUsers={projectUsers}
          />
        </div>
      </main>
    </div>
  );
}
