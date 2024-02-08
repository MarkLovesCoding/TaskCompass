"use client";
import Link from "next/link";
import DeleteBlock from "./DeleteBlock";
import PriorityDisplay from "./PriorityDisplay";
import ProgressDisplay from "./ProgressDisplay";
import StatusDisplay from "./StatusDisplay";
import { TaskType, UserType, ProjectType } from "../types/types";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
const dateOptions = { month: "2-digit", day: "2-digit", year: "2-digit" };

const TaskCard = ({ task }: { task: TaskType }) => {
  const taskProjectId = task.project;
  // const taskUserId = task.assignedTo;
  const [userName, setUserName] = useState<string | null>(null);
  const [projectName, setProjectName] = useState<string | null>(null);

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       // const res = await fetch(`/api/Users/${taskUserId}`);
  //       const { user } = await res.json();

  //       setUserName(user.name);
  //     } catch (error) {
  //       console.error("Error fetching user data:", error);
  //     }
  //   };

  //   const fetchProjectData = async () => {
  //     try {
  //       const res = await fetch(`/api/Projects/${taskProjectId}`);
  //       const { project } = await res.json();

  //       setProjectName(project.name);
  //     } catch (error) {
  //       console.error("Error fetching project data:", error);
  //     }
  //   };

  //   fetchUserData();
  //   fetchProjectData();
  // }, [taskUserId, taskProjectId]);
  const formatTimeStamp = (timestamp: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
      minute: "2-digit",
      hour: "2-digit",
      hour12: true,
    };

    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString("en-US", options);
    return formattedDate;
  };

  if (userName === null || projectName === null) {
    return null;
  }

  return (
    <>
      <Card className=" p-3 min-w-[300px] flex justify-center flex-col">
        <Link href={`/TaskPage/${task._id}`} style={{ display: "contents" }}>
          {/* <Link href={`/UserPage/${userData}`} style={{ display: "contents" }}> */}

          <CardHeader>
            <div className="flex mb-3">
              <PriorityDisplay priority={task.priority} />
              <div className="ml-auto">
                <DeleteBlock id={task._id} userId={task.assignees[0]} />
              </div>
            </div>
            <div>
              <CardTitle>{task.name}</CardTitle>
              <CardDescription>{task.description}</CardDescription>
            </div>
          </CardHeader>

          <CardContent className="grid gap-6">
            <div className="min-h-[50px] ">
              <p className="font-bold text-muted-foreground"> Assigned To:</p>
              <p className="text-sm text-muted-foreground">{userName}</p>
            </div>{" "}
            <div className="min-h-[50px] ">
              <p className="font-bold text-muted-foreground">Project:</p>
              <p className="text-sm text-muted-foreground">{projectName}</p>
            </div>
            <div className="flex mt-2 w-full ">
              <div className="flex flex-col w-full  ">
                <div className="mb-6">
                  {/* <ProgressDisplay progress={task.progress} /> */}
                </div>
                <div className="flex flex-row">
                  <div className="text-xs my-1 mr-auto flex items-end">
                    {/* {formatTimeStamp(task.createdAt)} */}
                  </div>
                  <div className="ml-auto flex items-end">
                    {/* <StatusDisplay status={task.status} /> */}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          {/* </Link> */}
        </Link>
      </Card>
    </>
  );
};

export default TaskCard;
