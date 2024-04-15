import { cn } from "@/lib/utils/utils";
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
  isCurrentUserAdmin: boolean;
};
const CardColumn = ({
  tasksList,
  projectData,
  sorted_idx,
  projectUsers,
  sorted_type,
  isCurrentUserAdmin,
}: CardColumnProps) => {
  return (
    <Draggable draggableId={sorted_type} index={sorted_idx} key={sorted_type}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            snapshot.isDragging
              ? "bg-cardcolumn-background opacity-70 "
              : "bg-cardcolumn-background  ",
            "w-[250px] m-2 md:m-4  rounded-lg  flex flex-col items-center align-top p-4 shadow-md"
          )}
        >
          <label className="text-lg pt-2 md:text-xl lg:text-2xl font-bold">{`${sorted_type}`}</label>

          <Droppable droppableId={sorted_type} key={sorted_idx} type="task">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                // key={sorted_idx}
                className={cn(
                  snapshot.isDraggingOver
                    ? "bg-drawer-background  "
                    : "bg-transparent",
                  ` w-[250px] m-4 md:mx-8  flex flex-col  mb-0 rounded-lg md:py-6 items-center align-top px-2  `
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
                              isCurrentUserAdmin={isCurrentUserAdmin}
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
