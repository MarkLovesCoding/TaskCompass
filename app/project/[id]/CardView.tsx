"use client";
import { useState, useEffect } from "react";

import { toast } from "sonner";
import { Droppable, DragDropContext } from "@hello-pangea/dnd";

import CardColumn from "./CardColumn";
import { updateProjectAction } from "../_actions/update-project.action";
import { updateTasksAction } from "../_actions/update-tasks.action";
import { ValidationError } from "@/use-cases/utils";

import type { ProjectDto } from "@/use-cases/project/types";
import type { TaskDto } from "@/use-cases/task/types";
import type { UserDto } from "@/use-cases/user/types";

interface Columns {
  [key: string]: {
    taskIds: string[];
  };
}
const CardView = ({
  viewType,
  tasks,
  project,
  projectUsers,
  isCurrentUserAdmin,
}: {
  viewType: string;
  tasks: TaskDto[];
  project: ProjectDto;
  projectUsers: UserDto[];
  isCurrentUserAdmin: boolean;
}) => {
  const taskIds = tasks.map((task) => task.id);
  const projectTasksIdsOrder = project.tasksOrder[viewType];

  function updateTaskInArray(
    tasksToUpdate: TaskDto[],
    taskIdToUpdate: string,
    columnTypeToUpdate: string,
    type: string
  ): TaskDto[] {
    const updatedTasks = [...tasksToUpdate]; // Create a copy of the original array
    const index = updatedTasks.findIndex((task) => task.id === taskIdToUpdate); // Find the index of the task with the specified ID
    // const existingTasksData = { ...tasksList };
    if (index !== -1) {
      const updatedTask = updatedTasks.find(
        (task) => task.id === taskIdToUpdate
      ) as TaskDto;
      // const newTaskData = { ...existingTask };
      if (type == "status" || type == "priority" || type == "category") {
        updatedTask[type] = columnTypeToUpdate;
      }

      // If the task with the specified ID is found
      updatedTasks[index] = updatedTask; // Replace the task at that index with the new task
    }
    return updatedTasks; // Return the updated array
  }

  function mapIdsToTasks(
    projectTaskIdsOrder: Record<string, string[]>,
    tasks: TaskDto[]
  ): Record<string, TaskDto[]> {
    const projectTasksOrder: Record<string, TaskDto[]> = {};

    for (const key in projectTaskIdsOrder) {
      if (key in projectTaskIdsOrder) {
        const ids = projectTaskIdsOrder[key];
        projectTasksOrder[key] = ids
          .map((id) => tasks.find((task) => task.id === id))
          .filter(Boolean) as TaskDto[];
      }
    }

    return projectTasksOrder;
  }
  const sortByObject = mapIdsToTasks(projectTasksIdsOrder, tasks);
  const [tasksList, setTasksList] = useState<TaskDto[]>([]);
  const [projectData, setProjectData] = useState<ProjectDto>(project);
  const sortedTasksArray = projectData.columnOrder[viewType].map(
    (type: string) => [type, sortByObject[type]]
  );

  useEffect(() => {
    setTasksList(tasks);
    setProjectData(project);
  }, [tasks, project]);

  // Initialize task card open states with all tasks initially closed
  const initialTaskCardOpenStates: Record<string, boolean> = {};
  taskIds.forEach((id) => {
    initialTaskCardOpenStates[id] = false;
  });
  const updateColumnsOrder = async (
    sourceIndex: number,
    destinationIndex: number,
    draggableId: string
  ) => {
    const existingProjectData = { ...project };
    const newColumnOrder = projectData.columnOrder[viewType];
    newColumnOrder.splice(sourceIndex, 1);
    newColumnOrder.splice(destinationIndex, 0, draggableId);
    //update project data in db
    const newProjectData = { ...projectData };
    newProjectData.columnOrder[viewType] = newColumnOrder;
    setProjectData(newProjectData);
    try {
      await updateProjectAction(projectData);
    } catch (err: any) {
      setProjectData(existingProjectData);

      if (err instanceof ValidationError) {
        toast.error("Validation error: " + err.message);
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error(
          "An unknown error occurred while updating project. Please try again."
        );
      }
    }
  };

  const updateTasksOrderInLists = async (
    sourceDroppableId: string,
    destinationDroppableId: string,
    sourceIndex: number,
    destinationIndex: number,
    draggableId: string
  ) => {
    const existingProjectData = { ...projectData };
    const newProjectData = { ...projectData };
    // console.log("newProjectData", newProjectData);
    if (
      sourceDroppableId === destinationDroppableId &&
      destinationIndex !== sourceIndex
    ) {
      const newTaskOrder = projectData.tasksOrder[viewType][sourceDroppableId];
      newTaskOrder.splice(sourceIndex, 1);
      newTaskOrder.splice(destinationIndex, 0, draggableId);

      newProjectData.tasksOrder[viewType][sourceDroppableId] = newTaskOrder;
      setProjectData(newProjectData);

      try {
        await updateProjectAction(projectData);
      } catch (err: any) {
        setProjectData(existingProjectData);
        if (err instanceof ValidationError) {
          toast.error("Validation error: " + err.message);
        } else if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error(
            "An unknown error occurred while updating project. Please try again."
          );
        }
      }
    } else if (sourceDroppableId !== destinationDroppableId) {
      //error happens in UI here when not refreshed.

      // task moves column
      const existingTasksData = [...tasksList];
      updateTaskInArray(
        tasksList,
        draggableId,
        destinationDroppableId,
        viewType
      );

      const newSourceTaskOrder =
        projectData.tasksOrder[viewType][sourceDroppableId];
      const newDestinationTaskOrder =
        projectData.tasksOrder[viewType][destinationDroppableId];
      newSourceTaskOrder.splice(sourceIndex, 1);
      newDestinationTaskOrder.splice(destinationIndex, 0, draggableId);
      newProjectData.tasksOrder[viewType][sourceDroppableId] =
        newSourceTaskOrder;
      newProjectData.tasksOrder[viewType][destinationDroppableId] =
        newDestinationTaskOrder;

      setProjectData(newProjectData);
      // Optimistic Updates state first. Then updates the backend, reverting if there is an error

      try {
        await updateTasksAction(projectData.id, tasksList);
      } catch (err: any) {
        setTasksList(existingTasksData);
        console.log(
          "error updating project, reverting to existing data for task and project"
        );
        toast.error("Error updating project, reverting to existing data");
        throw err;
      }

      try {
        await updateProjectAction(projectData);
        toast.success(
          `Task moved from ${sourceDroppableId} to ${destinationDroppableId} `
        );
      } catch (err: any) {
        setProjectData(existingProjectData);
        console.log(
          "error updating project, reverting to existing data for task and project"
        );
        toast.error("Error updating project, reverting to existing data");
        throw err;
      }
    }
  };
  const onDragEnd = (result: any) => {
    // dropped outside the list
    const {
      destination,
      source,
      draggableId,
      type,
    }: { destination: any; source: any; draggableId: string; type: string } =
      result;
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
    if (type == "task") {
      return updateTasksOrderInLists(
        source.droppableId,
        destination.droppableId,
        sourceIndex,
        destinationIndex,
        draggableId
      );
    }
    if (type == "column") {
      return updateColumnsOrder(sourceIndex, destinationIndex, draggableId);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="all-columns" direction="horizontal" type="column">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex flex-row ml-[1em] justify-start w-min-full "
          >
            <>
              {sortedTasksArray.map((column, sorted_idx) => (
                <div key={sorted_idx}>
                  <CardColumn
                    tasksList={column[1] as TaskDto[]}
                    projectData={projectData}
                    sorted_idx={sorted_idx}
                    projectUsers={projectUsers}
                    sorted_type={column[0] as string}
                    isCurrentUserAdmin={isCurrentUserAdmin}
                  />
                </div>
              ))}
            </>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default CardView;
