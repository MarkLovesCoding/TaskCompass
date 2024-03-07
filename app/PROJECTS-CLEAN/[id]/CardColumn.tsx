import { cn } from "@/lib/utils";
import { ProjectDto } from "@/use-cases/project/types";
import { TaskDto } from "@/use-cases/task/types";
import { UserDto } from "@/use-cases/user/types";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import React from "react";
import TaskCardSmallDialog from "./TaskCardSmallDialog";
type CardColumnProps = {
  tasksList: TaskDto[];
  projectData: ProjectDto;
  sorted_idx: number;
  projectUsers: UserDto[];
  sorted_type: string;
};
const CardColumn = ({
  tasksList,
  projectData,
  sorted_idx,
  projectUsers,
  sorted_type,
}: CardColumnProps) => {
  return (
    <Draggable draggableId={sorted_type} index={sorted_idx}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            snapshot.isDragging ? "bg-gray-800" : "bg-gray-900",
            "min-w-[325px] m-6  flex flex-col items-center align-top px-4"
          )}
        >
          <label className="text-2xl font-bold">{`${sorted_type}`}</label>

          <Droppable droppableId={sorted_type} key={sorted_idx} type="task">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                // key={sorted_idx}
                className={cn(
                  snapshot.isDraggingOver
                    ? "bg-gray-800   "
                    : "border-gray-500 border-1",
                  ` min-w-[325px] m-6  flex flex-col items-center align-top px-4  `
                )}
              >
                {tasksList.length === 0
                  ? "No tasks"
                  : tasksList.map(
                      (task, task_idx) =>
                        !task.archived && (
                          <div key={task_idx}>
                            <TaskCardSmallDialog
                              isDraggingOver={snapshot.isDraggingOver}
                              tasks={tasksList}
                              task={task}
                              project={projectData}
                              projectUsers={projectUsers}
                              task_idx={task_idx}
                              sorted_idx={sorted_idx}
                            />
                          </div>
                        )
                    )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};

export default CardColumn;
