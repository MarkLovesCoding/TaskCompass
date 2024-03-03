"use client";
import React, { useState, useEffect } from "react";
import { ProjectDto } from "@/use-cases/project/types";
import { TaskDto } from "@/use-cases/task/types";
import { UserDto } from "@/use-cases/user/types";
import { sortByType } from "./utils";
import { SORT_TYPES } from "./constants";
import { cn } from "@/lib/utils";
import TaskCardSmallDialog from "./TaskCardSmallDialog";
// import { PRIORITY_COLORS } from "./constants";
import styled from "styled-components";
import { updateTaskPriorityAction } from "../_actions/update-task-priority.action";
import { updateTaskCategoryAction } from "../_actions/update-task-category.action";
import { updateTaskStatusAction } from "../_actions/update-task-status.action";
import { Droppable, DragDropContext } from "@hello-pangea/dnd";
import { previousDay } from "date-fns";
const Container = styled.div``;
interface Columns {
  [key: string]: {
    taskIds: string[];
  };
}
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
  const columns = {} as Columns;
  // Generate unique IDs for each task
  const [columnObject, setColumnObject] = useState(sortByObject);
  useEffect(() => {
    setColumnObject(sortByObject);
  }, [type]);
  // Iterate over each key-value pair in the currentObject
  Object.entries(sortByObject).forEach(([key, tasks]) => {
    // Extract the taskIds from the array of TaskDto
    const taskIds = tasks.map((task) => task.id);

    // Assign the taskIds to the corresponding key in columns
    columns[key] = {
      taskIds: taskIds,
    };
  });
  const [columnsForDnd, setColumnsForDnd] = React.useState(columns);
  const taskIds = tasks.map((task) => task.id);

  // Initialize task card open states with all tasks initially closed
  const initialTaskCardOpenStates: Record<string, boolean> = {};
  taskIds.forEach((id) => {
    initialTaskCardOpenStates[id] = false;
  });

  const onDragEnd = (result: any) => {
    // dropped outside the list
    const {
      destination,
      source,
      draggableId,
    }: { destination: any; source: any; draggableId: string } = result;
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    const sourceIndex = source.index;
    const destinationIndex = destination.index;
    const columnTasks = columnObject[source.droppableId];
    console.log("draggedId", draggableId);
    console.log("source.droppableId", source.droppableId);
    console.log("column", columnTasks);
    console.log("columns", columnObject);

    const newTasks = columnTasks;
    console.log("sourceIndex", sourceIndex);
    console.log("destinationIndex", destinationIndex);

    const newTask = columnTasks.find((task) => task.id === draggableId);
    newTasks.splice(sourceIndex, 1);
    newTasks.splice(destinationIndex, 0, newTask!);
    console.log("newTaskIds_edited", newTasks);
    console.log("newTask", newTask);

    console.log("type", type);
    console.log("sourcedroppableId", source.droppableId);
    console.log("destinationdroppableId", destination.droppableId);

    // setColumnObject((prev) => {
    //   return {
    //     ...prev,
    //     [source.droppableId]: newTasks,
    //   };
    // });
    // console.log("columnsForDnd", columnsForDnd);
    // Update the task order in the backend
    // create function to abstract this
    updateTaskByColumnChange(type, destination.droppableId, draggableId);
    // if (type === "priority") {
    //   updateTaskPriorityAction({
    //     id: draggableId,
    //     priority: destination.droppableId,
    //   });
    // }

    // Update the task order in the backend
    // updateTaskOrder({
    //   variables: {
    //     input: {
    //       taskId: task.id,
    //       sourceIndex,
    //       destinationIndex,
    //       sourceDroppableId,
    //       destinationDroppableId,
    //     },
    //   },
    // });
  };

  const updateTaskByColumnChange = (
    type: string,
    destinationColumn: string,
    taskId: string
  ) => {
    switch (type) {
      case "priority":
        updateTaskPriorityAction({
          id: taskId,
          priority: destinationColumn,
        });
        break;
      case "status":
        updateTaskStatusAction({
          id: taskId,
          status: destinationColumn,
        });
        break;
      case "category":
        updateTaskCategoryAction({
          id: taskId,
          category: destinationColumn,
        });
        break;
      default:
        break;
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex md:flex-row  justify-center flex-col w-min-full overflow-x">
        <div className="flex md:flex-row justify-center flex-col w-min-full overflow-x">
          {/* Render div elements for entries where tasks exist */}
          {type === "category" ? (
            <>
              {Object.entries(columnObject)
                .filter(([_, tasks]) => tasks.length > 0)
                .map(([sorted_type, tasks], sorted_idx) => (
                  <Droppable droppableId={sorted_type} key={sorted_idx}>
                    {(provided, snapshot) => (
                      //COLUMNS
                      <Container
                        ref={provided.innerRef}
                        key={sorted_idx}
                        {...provided.droppableProps}
                        className={cn(
                          "min-w-[325px]",
                          `flex flex-col items-center min-h-[500x] px-4 space-y-8 align-top `
                        )}
                      >
                        <label className="text-2xl font-bold">{`${sorted_type}`}</label>
                        {tasks.map(
                          (task, task_idx) =>
                            !task.archived && (
                              <div key={task.id}>
                                <TaskCardSmallDialog
                                  tasks={tasks}
                                  task={task}
                                  project={project}
                                  projectUsers={projectUsers}
                                  task_idx={task_idx}
                                  sorted_idx={sorted_idx}
                                />
                              </div>
                            )
                        )}
                        {provided.placeholder}
                      </Container>
                    )}
                  </Droppable>
                ))}
              {/* Render div element for "No Tasks" case */}
              {Object.entries(columnObject)
                .filter(([_, tasks]) => tasks.length === 0)
                .map(([sorted_type], sorted_idx) => (
                  <div
                    key={sorted_idx}
                    className={cn(
                      "min-w-[325px]",
                      `flex flex-col items-center min-h-[500px] py-10 px-4 space-y-8 align-top overflow-clip`
                    )}
                  >
                    <label className="text-2xl font-bold">{`${sorted_type}`}</label>
                    <span>No tasks</span>
                  </div>
                ))}
            </>
          ) : (
            <>
              {Object.entries(columnObject).map(
                ([sorted_type, tasks], sorted_idx) => (
                  <Droppable droppableId={sorted_type} key={sorted_idx}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        key={sorted_idx}
                        className="flex flex-col  items-center min-w-[400px] py-10 px-4 space-y-8 align-top overflow-clip"
                      >
                        <label className="text-2xl font-bold">{`${sorted_type}`}</label>
                        {tasks.length === 0
                          ? "No tasks"
                          : tasks.map(
                              (task, task_idx) =>
                                !task.archived && (
                                  <div key={task_idx}>
                                    <TaskCardSmallDialog
                                      tasks={tasks}
                                      task={task}
                                      project={project}
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
                )
              )}
            </>
          )}
        </div>
      </div>
    </DragDropContext>
  );
};

export default CardView;
