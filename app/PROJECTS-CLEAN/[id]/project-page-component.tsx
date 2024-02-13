import Link from "next/link";
import {
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";

import {
  CardTitle,
  CardDescription,
  CardHeader,
  Card,
} from "@/components/ui/card";
import { TaskCard } from "../TaskCard";
import { Button } from "@/components/ui/button";
import { ProjectHeader } from "../../../components/component/project-header";

import { ProjectDto } from "@/use-cases/project/types";
import getProjectTasks from "@/data-access/tasks/get-project-tasks";
export async function ProjectPage({
  project,
  userId,
}: {
  project: ProjectDto;
  userId: string;
}) {
  const tasks = await getProjectTasks(project);
  return (
    <div className="flex flex-col w-full min-h-screen">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <div className="flex items-center gap-4">
          <ProjectHeader project={project} />
          <Dialog>
            <DialogTrigger>
              <Button className="rounded-full ml-auto" size="icon">
                <PlusIcon className="w-4 h-4" />
                <span className="sr-only">New Task Button</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="">
              <TaskCard task={"new"} project={project} userId={userId} />
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            {tasks.length === 0
              ? "No current tasks"
              : tasks.map((task, task_idx) => (
                  <Card
                    key={task_idx}
                    className="border rounded-lg flex items-center p-4 border-green-500"
                  >
                    <ArrowRightIcon classNam="w-4 h-4 text-green-500" />
                    <div className="grid gap-1 ml-4">
                      <CardHeader>
                        <CardTitle>{task.name}</CardTitle>
                        <CardDescription>{task.description}</CardDescription>
                      </CardHeader>
                    </div>
                  </Card>
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
