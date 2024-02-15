"use client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";

import {
  CardTitle,
  CardDescription,
  CardHeader,
  Card,
} from "@/components/ui/card";
import { TaskCard } from "./TaskCard";
import { ProjectHeader } from "../../../components/component/project-header";

import { ProjectDto } from "@/use-cases/project/types";
import { TaskDto } from "@/use-cases/task/types";
export async function ProjectPage({
  project,
  tasks,
}: {
  project: ProjectDto;
  tasks: TaskDto[];
}) {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <div className="flex items-center gap-4">
          <ProjectHeader project={project} />
          <Dialog>
            <DialogTrigger>
              {/* <Button className="rounded-full ml-auto" size="icon"> */}
              <PlusIcon className="w-4 h-4" />
              <span className="sr-only">New Task Button</span>
            </DialogTrigger>
            <DialogContent className="">
              <TaskCard task={"new"} project={project} />
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            {tasks.length === 0
              ? "No current tasks"
              : tasks.map((task, task_idx) => (
                  <Dialog key={task_idx}>
                    <DialogTrigger>
                      <Card
                        key={task_idx}
                        className="border rounded-lg flex items-center p-4 border-green-500"
                      >
                        <ArrowRightIcon classNam="w-4 h-4 text-green-500" />
                        <div className="grid gap-1 ml-4">
                          <CardHeader>
                            <CardTitle>{task.name}</CardTitle>
                            <CardDescription>
                              {task.description}
                            </CardDescription>
                          </CardHeader>
                        </div>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="">
                      <TaskCard task={task} project={project} />
                    </DialogContent>
                  </Dialog>
                ))}
          </div>
        </div>
      </main>
    </div>
  );
}

//@ts-expect-error
function PlusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
//@ts-expect-error
function ArrowRightIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
