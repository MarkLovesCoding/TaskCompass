import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/small-task-card";
import { cn } from "@/lib/utils/utils";
import { TaskDto } from "@/use-cases/task/types";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog-task-card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { TaskCard } from "./TaskCard";
import { ProjectDto } from "@/use-cases/project/types";
import { UserDto } from "@/use-cases/user/types";
import { Draggable } from "@hello-pangea/dnd";
import styled from "styled-components";
import { Clock2Icon, UsersIcon } from "lucide-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ScrollBar } from "@/components/ui/scroll-area";
import { formatDistanceStrict } from "date-fns";
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
        return "bg-badgeRed";
      case "Medium":
        return "bg-badgeYellow";
      case "Low":
        return "bg-badgeGreen";
      default:
        return "bg-gray-500";
    }
  };
  const colorByStatus = (priority: string) => {
    switch (priority) {
      case "Not Started":
        return "bg-badgeRed";

      case "Up Next":
        return "bg-badgeYellow";

      case "In Progress":
        return "bg-badgeOrange";

      case "Completed":
        return "bg-badgeGreen";

      default:
    }
  };
  const taskIds = tasks.map((task) => task.id);

  // Initialize task card open states with all tasks initially closed
  const initialTaskCardOpenStates: Record<string, boolean> = {};
  taskIds.forEach((id) => {
    initialTaskCardOpenStates[id] = false;
  });

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
            >
              <Card
                className={`${
                  snapshot.isDragging
                    ? "bg-taskcardsmall-background   border-primary opacity-95 rotate-6"
                    : "bg-taskcardsmall-background border-background "
                } border rounded-lg flex w-[225px] my-2 shadow-lg hover:shadow-sm`}
              >
                <div className="flex flex-col overflow-hidden p-1 w-full">
                  <CardHeader className="flex justify-center">
                    <CardTitle className="text-start text-md truncate">
                      {task.name}
                    </CardTitle>
                    <CardDescription className="text-start text-sm space-y-2">
                      <p className="text-xs  truncate">{task.description}</p>
                      <div className="flex flex-row">
                        <Clock2Icon className="w-4 h-4 mr-2 " />
                        <Label className="text-xs">
                          Due in :{" "}
                          {formatDistanceStrict(task.dueDate, new Date())}
                        </Label>
                      </div>
                      <div className="flex flex-row">
                        <UsersIcon className="w-4 h-4 mr-2 " />
                        <Label className="text-xs">
                          {task.assignees.length > 0
                            ? "Assigned Users :  " + task.assignees.length
                            : "Unassigned"}
                        </Label>
                      </div>
                      <div className="flex-row flex-wrap space-x-1">
                        <Badge
                          className={cn(
                            colorByPriority(task.priority),
                            "w-fit  text-xs text-center px-1.5 py-[0.25em] m-1"
                          )}
                        >
                          {task.priority}
                        </Badge>
                        <Badge
                          className={cn(
                            colorByStatus(task.status),
                            "w-fit text-xs   text-center  px-1.5 py-[0.25em] m-1"
                          )}
                        >
                          {task.status}
                        </Badge>
                        <Badge
                          className={
                            "w-fit  text-center text-xs px-1.5 py-[0.25em] m-1"
                          }
                        >
                          {task.category}
                        </Badge>
                      </div>
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
        className=" p-6 w-max-[300px] overflow-auto h-max-[550px] backdrop-filter backdrop-blur bg-taskcard-background rounded-lg border-2"
      >
        <ScrollArea className="">
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
