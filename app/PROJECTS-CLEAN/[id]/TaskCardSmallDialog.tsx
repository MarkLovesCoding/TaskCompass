import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TaskDto } from "@/use-cases/task/types";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog-task-card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { TaskCard } from "./TaskCard";
import { ProjectDto } from "@/use-cases/project/types";
import { UserDto } from "@/use-cases/user/types";
import { Draggable } from "@hello-pangea/dnd";
import styled from "styled-components";
import { Clock2Icon, Scroll } from "lucide-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ScrollBar } from "@/components/ui/scroll-area";
import { format, formatDistanceStrict } from "date-fns";
const Container = styled.div``;
const TaskCardSmallDialog = ({
  isDraggingOver,
  tasks,
  task,
  project,
  projectUsers,
  task_idx,
  sorted_idx,
}: {
  isDraggingOver: boolean;
  tasks: TaskDto[];
  task: TaskDto;
  project: ProjectDto;
  projectUsers: UserDto[];
  task_idx: number;
  sorted_idx: number;
}) => {
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
  const colorByStatus = (priority: string) => {
    switch (priority) {
      case "Not Started":
        return "bg-red-500";
      case "Up Next":
        return "bg-yellow-500";
      case "In Progress":
        return "bg-orange-500";
      case "Completed":
        return "bg-green-500";
      default:
    }
  };
  const taskIds = tasks.map((task) => task.id);

  // Initialize task card open states with all tasks initially closed
  const initialTaskCardOpenStates: Record<string, boolean> = {};
  taskIds.forEach((id) => {
    initialTaskCardOpenStates[id] = false;
  });
  // const [isTaskOpen, setIsTaskOpen] = useState<boolean>(false);
  // const handleTaskOpen = () => {
  //   setIsTaskOpen(!isTaskOpen);
  // };
  const [taskCardOpenStates, setTaskCardOpenStates] = useState<
    Record<string, boolean>
  >(initialTaskCardOpenStates);

  const toggleTaskCard = (id: string) => {
    setTaskCardOpenStates((prevState) => {
      const newState = { ...prevState };
      newState[id] = !newState[id];
      return newState;
    });
  };

  return (
    <Dialog
      open={taskCardOpenStates[task.id]}
      onOpenChange={() => toggleTaskCard(task.id)}
      key={task.id}
    >
      <DialogTrigger>
        <Draggable draggableId={String(task.id)} index={task_idx}>
          {(provided, snapshot) => (
            <Container
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
              // className={`${
              //   snapshot.isDragging
              //     ? "bg-blue-300  border-green-500 "
              //     : "bg-gray-800  border-gray-500 "
              // } border rounded-lg flex w-72 shadow-lg hover:shadow-sm`}
            >
              <Card
                // key={task.id}
                className={`${
                  snapshot.isDragging
                    ? "bg-primary-foreground  border-primary "
                    : "bg-secondary  border-background "
                } border rounded-lg flex w-[225px] shadow-lg hover:shadow-sm`}
              >
                <div className="flex flex-col overflow-hidden p-2 ">
                  <CardHeader className="flex justify-center">
                    <div className="flex-row space-x-2">
                      <Badge
                        className={cn(
                          colorByPriority(task.priority),
                          "w-fit m-1"
                        )}
                      >
                        {task.priority}
                      </Badge>
                      <Badge
                        className={cn(
                          colorByStatus(task.status),
                          "w-fit text-xs px-1 py-[0.2em] m-1"
                        )}
                      >
                        {task.status}
                      </Badge>
                      <Badge className={"w-fit bg-gray-600 m-1"}>
                        {task.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-start text-md">
                      {task.name}
                    </CardTitle>
                    <CardDescription className="text-start text-sm">
                      <p className="text-xs mb-2">{task.description}</p>
                      <div className="flex flex-row">
                        <Clock2Icon className="w-4 h-4 mr-2 " />
                        <Label className="text-xs">
                          Due in :{" "}
                          {formatDistanceStrict(task.dueDate, task.startDate)}
                        </Label>
                      </div>
                      {/* <div>
                        <Label className="text-xs">
                          Start Date: {format(task.startDate, "P")}
                        </Label>
                      </div>
                      <div>
                        <Label className="text-xs">
                          Due Date: {format(task.dueDate, "P")}{" "}
                        </Label>
                      </div> */}
                    </CardDescription>
                  </CardHeader>
                </div>
              </Card>
            </Container>
          )}
        </Draggable>
      </DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(event: Event) => event.preventDefault()}
        className=" p-6 w-max-[300px] h-max-[550px]  bg-gray-800 rounded-lg border-2"
      >
        <ScrollArea className="  ">
          <TaskCard
            task={task}
            project={project}
            projectUsers={projectUsers}
            isTaskOpen={taskCardOpenStates[task.id]}
          />
          <ScrollBar orientation="vertical" className="h-full">
            {/* <ScrollBar orientation="horizontal" className="w-full "> */}
          </ScrollBar>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TaskCardSmallDialog;
