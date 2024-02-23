"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import React from "react";
import { TaskCard } from "./TaskCard";
import { ProjectDto } from "@/use-cases/project/types";
import { TaskDto } from "@/use-cases/task/types";
import { UserDto } from "@/use-cases/user/types";
import { sortByType } from "./utils";
import type { SortType } from "./constants";
import { SORT_TYPES } from "./constants";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
// import { PRIORITY_COLORS } from "./constants";

const CardView = ({
  type,
  tasks,
  project,
  projectUsers,
}: {
  type: string;
  tasks: TaskDto[];
  project: ProjectDto;
  projectUsers: UserDto[];
}) => {
  const sortByObject = sortByType(type, SORT_TYPES, tasks);
  const colorByPriority = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500";
      case "Medium":
        return "bg-yellow-500";
      case "Low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  // console.log(PRIORITY_COLORS["High"]);
  // const highPriorityTasks = tasks.filter((task) => task.priority === "High");
  // const mediumPriorityTasks = tasks.filter(
  //   (task) => task.priority === "Medium"
  // );
  // const lowPriorityTasks = tasks.filter((task) => task.priority === "Low");
  // const priorityObject = {
  //   High: { tasks: highPriorityTasks, color: "red" },
  //   Medium: { tasks: mediumPriorityTasks, color: "yellow" },
  //   Low: { tasks: lowPriorityTasks, color: "green" },
  // };

  return (
    <div className="flex md:flex-row flex-col w-min-full overflow-x">
      {Object.entries(sortByObject).map((sorted_type, sorted_idx) => (
        <div
          key={sorted_idx}
          className="flex flex-col  items-center min-w-[400px] py-10 px-4 space-y-8 align-top overflow-clip"
        >
          <label className="text-2xl font-bold">{`${sorted_type[0]}`}</label>
          {sorted_type[1].length === 0
            ? "No tasks"
            : sorted_type[1].map((task, task_idx) => (
                <Dialog key={task_idx}>
                  <DialogTrigger>
                    <Card
                      key={task_idx}
                      className={`border rounded-lg flex items-center w-72 border-gray-500 bg-gray-800 shadow-lg hover:shadow-sm`}
                    >
                      <div className="flex flex-col overflow-hidden p-2 ">
                        <CardHeader className="flex justify-start">
                          <Badge
                            className={cn(
                              colorByPriority(task.priority),
                              "w-min"
                            )}
                          >
                            {task.priority}
                          </Badge>
                          <CardTitle className="text-start">
                            {task.name}
                          </CardTitle>
                          <CardDescription className="text-start">
                            {task.description}
                          </CardDescription>
                        </CardHeader>
                      </div>
                    </Card>
                  </DialogTrigger>
                  <DialogContent
                    onOpenAutoFocus={(event: Event) => event.preventDefault()}
                    // onCloseAutoFocus={(event: Event) => event.preventDefault()}
                    className="p-6 w-max-[768px] bg-gray-800 rounded-lg border-2"
                  >
                    <TaskCard
                      task={task}
                      project={project}
                      projectUsers={projectUsers}
                    />
                  </DialogContent>
                </Dialog>
              ))}
        </div>
      ))}
    </div>
  );
};

export default CardView;
