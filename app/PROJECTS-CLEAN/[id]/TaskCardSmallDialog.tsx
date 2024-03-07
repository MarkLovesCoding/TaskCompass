import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TaskDto } from "@/use-cases/task/types";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import React, { useState } from "react";
import { TaskCard } from "./TaskCard";
import { ProjectDto } from "@/use-cases/project/types";
import { UserDto } from "@/use-cases/user/types";
import { Draggable } from "@hello-pangea/dnd";
import styled from "styled-components";

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
                    ? "bg-blue-300  border-green-500 "
                    : "bg-gray-800  border-gray-500 "
                } border rounded-lg flex w-72 shadow-lg hover:shadow-sm`}
              >
                <div className="flex flex-col overflow-hidden p-2 ">
                  <CardHeader className="flex justify-start">
                    <Badge
                      className={cn(colorByPriority(task.priority), "w-min")}
                    >
                      {task.priority}
                    </Badge>
                    <CardTitle className="text-start">{task.name}</CardTitle>
                    <CardDescription className="text-start">
                      {snapshot.isDragging ? task.description : "Drag to move"}
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
        className="p-6 w-max-[768px] bg-gray-800 rounded-lg border-2"
      >
        <TaskCard
          task={task}
          project={project}
          projectUsers={projectUsers}
          isTaskOpen={taskCardOpenStates[task.id]}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TaskCardSmallDialog;