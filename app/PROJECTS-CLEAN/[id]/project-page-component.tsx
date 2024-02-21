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
import { Archive, CircleEllipsisIcon } from "lucide-react";
import { PersonStanding } from "lucide-react";
import type { ProjectDto } from "@/use-cases/project/types";
import type { TaskDto } from "@/use-cases/task/types";
import { AddMemberForm } from "./AddMemberForm";
import UpdateProjectMembersCard from "./UpdateProjectMembersCard";
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
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

import { UserDto } from "@/use-cases/user/types";
import UnarchiveTaskPopover from "./UnarchiveTaskPopover";
// import UpdateProjectMembersCard from "./UpdateProjectMembersCard";
export async function ProjectPage({
  userId,
  project,
  tasks,
  teamMembers,
  projectMembers,
}: {
  userId: string;
  project: ProjectDto;
  tasks: TaskDto[];
  teamMembers: UserDto[];
  projectMembers: UserDto[];
}) {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <div className="flex items-center gap-4">
          <ProjectHeader project={project} />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <CircleEllipsisIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {/* <DropdownMenuLabel>Add Users</DropdownMenuLabel> */}

              {/* <DropdownMenuSeparator /> */}
              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Add users</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <UpdateProjectMembersCard
                        userId={userId}
                        project={project}
                        teamMembers={teamMembers}
                        projectMembers={projectMembers}
                      />
                      {/* <AddMemberForm /> */}
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
                      {/* <Popover>
                  <PopoverTrigger>
                    Archived
                    <span className="sr-only">New Task Button</span>
                  </PopoverTrigger>
                  <PopoverContent> */}
                      {/* <NewTaskCard project={project} /> */}

                      <ScrollArea>
                        {tasks.length === 0
                          ? "No archived tasks"
                          : tasks.map((task, task_idx) =>
                              task.archived ? (
                                <UnarchiveTaskPopover task={task} />
                              ) : (
                                <div key={task_idx}>No Archived Tasks</div>
                              )
                            )}
                      </ScrollArea>
                      {/* <AddMemberForm /> */}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
              {/* <DropdownMenuSeparator /> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {tasks.length === 0
            ? "No current tasks"
            : tasks.map((task, task_idx) => (
                <Dialog key={task_idx}>
                  <DialogTrigger>
                    <Card
                      key={task_idx}
                      className="border rounded-lg flex items-center p-4 border-green-500"
                    >
                      <div className="grid gap-1 ml-4">
                        <CardHeader>
                          <CardTitle>{task.name}</CardTitle>
                          <CardDescription>{task.description}</CardDescription>
                        </CardHeader>
                      </div>
                    </Card>
                  </DialogTrigger>
                  <DialogContent
                    onOpenAutoFocus={(event: Event) => event.preventDefault()}
                    // onCloseAutoFocus={(event: Event) => event.preventDefault()}
                    className=""
                  >
                    <TaskCard task={task} project={project} />
                  </DialogContent>
                </Dialog>
              ))}
          <div className="">
            <Popover>
              <PopoverTrigger>
                {" "}
                +<span className="sr-only">New Task Button</span>
              </PopoverTrigger>
              <PopoverContent>
                <NewTaskCard project={project} />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </main>
    </div>
  );
}
