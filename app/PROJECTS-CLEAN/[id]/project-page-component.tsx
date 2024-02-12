import Link from "next/link";
import {
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  Card,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProjectHeader } from "../../../components/component/project-header";
import { TaskCardComponent } from "../../../components/component/task-card-component";
import { ProjectDto } from "@/use-cases/project/types";
import getProjectTasks from "@/data-access/tasks/get-project-tasks";
export async function ProjectPage({ project }: { project: ProjectDto }) {
  const tasks = await getProjectTasks(project);
  return (
    <div className="flex flex-col w-full min-h-screen">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <div className="flex items-center gap-4">
          <ProjectHeader project={project} />
          <Button className="rounded-full ml-auto" size="icon">
            <PlusIcon className="w-4 h-4" />
            <span className="sr-only">New Task</span>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            {tasks &&
              tasks.map((task, task_idx) => (
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

            {/* <h2 className="text-sm font-semibold p-4">Low</h2> */}

            {/* <Card className="border rounded-lg flex items-center p-4 border-green-500">
              <ArrowRightIcon className="w-4 h-4 text-green-500" />
              <div className="grid gap-1 ml-4">
                <CardHeader>
                  <CardTitle>Fix Bugs</CardTitle>
                  <CardDescription>
                    Address critical bugs in the application
                  </CardDescription>
                </CardHeader>
              </div>
            </Card>
          </div>
          <div>
            <h2 className="text-sm font-semibold p-4">Regular</h2>
            <Card className="border rounded-lg flex items-center p-4 border-yellow-500">
              <ArrowRightIcon className="w-4 h-4 text-yellow-500" />
              <div className="grid gap-1 ml-4">
                <CardHeader>
                  <CardTitle>Fix Bugs</CardTitle>
                  <CardDescription>
                    Address critical bugs in the application
                  </CardDescription>
                </CardHeader>
              </div>
            </Card>
          </div>
          <div>
            <h2 className="text-sm font-semibold p-4">High</h2>

            <Card className="border rounded-lg flex items-center p-4 border-red-500">
              <ArrowRightIcon className="w-4 h-4 text-red-500" />
              <div className="grid gap-1 ml-4">
                <CardHeader>
                  <CardTitle>Fix Bugs</CardTitle>
                  <CardDescription>
                    Address critical bugs in the application
                  </CardDescription>
                </CardHeader>
              </div>
            </Card> */}
          </div>
        </div>
      </main>
    </div>
  );
}
//@ts-expect-error
function FrameIcon(props) {
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
      <line x1="22" x2="2" y1="6" y2="6" />
      <line x1="22" x2="2" y1="18" y2="18" />
      <line x1="6" x2="6" y1="2" y2="22" />
      <line x1="18" x2="18" y1="2" y2="22" />
    </svg>
  );
}
//@ts-expect-error
function CircleEllipsisIcon(props) {
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
      <circle cx="12" cy="12" r="10" />
      <path d="M17 12h.01" />
      <path d="M12 12h.01" />
      <path d="M7 12h.01" />
    </svg>
  );
}
//@ts-expect-error
function LayoutIcon(props) {
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
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <line x1="3" x2="21" y1="9" y2="9" />
      <line x1="9" x2="9" y1="21" y2="9" />
    </svg>
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
