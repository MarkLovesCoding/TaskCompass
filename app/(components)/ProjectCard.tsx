import Link from "next/link";
import { ProjectType, UserType, TaskType } from "../types/types";
import { formatTimeStamp } from "../utils/dateUtils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
type VerboseProjectType = Omit<ProjectType, "tasks" | "users"> & {
  tasks: TaskType[];
  users: UserType[];
};

const dateOptions = { month: "2-digit", day: "2-digit", year: "2-digit" };
type dateOptionsType = typeof dateOptions;
const ProjectCard = ({ project }: { project: VerboseProjectType }) => {
  return (
    <div className=" min-w-[300px] max-w-[300px] flex flex-col rounded-md shadow-lg p-3 m-2">
      <Card className=" p-5 flex justify-center flex-col items-center">
        <Link href={`/Projects/${project._id}`} style={{ display: "contents" }}>
          <CardHeader>
            <div>
              <CardTitle>{project.name}</CardTitle>
              {/* {Project?.description && <CardDescription>{ Project.description} </CardDescription>} */}
            </div>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className=" min-h-[80px] ">
              <p className="font-bold"> Members:</p>
              {project.users.map((user, idx) => (
                <p key={idx} className="whitespace-pre-wrap">
                  {(user as UserType)?.email}
                </p>
              ))}{" "}
            </div>
            <div className=" min-h-[80px] ">
              <p className="font-bold"> Current Tasks:</p>
              {project.tasks?.length == 0 ? (
                <p>No Active Tasks</p>
              ) : (
                project.tasks?.map((task, task_idx) => (
                  <p key={task_idx} className="whitespace-pre-wrap">
                    <Link href={`/TaskPage/${task._id}`}>{task.title}</Link>
                  </p>
                ))
              )}
            </div>
            {/* <div className="flex mt-2">
              <div className="flex flex-col">
                <p className="text-xs my-1">
                  <span className="font-bold">Created: </span>
                  <span className="">{formatTimeStamp(Project.createdAt)}</span>
                </p>
              </div>
            </div> */}
          </CardContent>
        </Link>
      </Card>
    </div>
  );
};

export default ProjectCard;
