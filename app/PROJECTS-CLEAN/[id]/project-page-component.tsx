"use client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  Card,
} from "@/components/ui/card";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { TaskCard } from "./TaskCard";
import { NewTaskCard } from "./NewTaskCard";
import { ProjectHeader } from "./ProjectHeader";
import { CircleEllipsisIcon } from "lucide-react";
import { PersonStanding } from "lucide-react";
import type { ProjectDto } from "@/use-cases/project/types";
import type { TaskDto } from "@/use-cases/task/types";
import { AddMemberForm } from "./AddMemberForm";

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
import EditProjectDetailsCard from "./EditProjectDetailsCard";
export async function ProjectPage({
  userId,
  project,
  tasks,
}: {
  userId: string;
  project: ProjectDto;
  tasks: TaskDto[];
}) {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <div className="flex items-center gap-4">
          <ProjectHeader project={project} />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <PersonStanding />
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
                      <AddMemberForm />
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
                  <DialogContent className="">
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
