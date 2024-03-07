"use client";
import React, { useState, useEffect } from "react";
import { ColumnOrder, ProjectDto } from "@/use-cases/project/types";
import { TaskDto } from "@/use-cases/task/types";
import { UserDto } from "@/use-cases/user/types";
import { sortByType } from "./utils";
import { SORT_TYPES } from "./constants";
// import { PRIORITY_COLORS } from "./constants";
import { updateProjectAction } from "../_actions/update-project.action";
import { updateTasksOrderInListsAction } from "../_actions/update-tasks-order-in-lists.action";
import { updateProjectColumnOrderAction } from "../_actions/update-project-column-order.action";
import { Droppable, DragDropContext } from "@hello-pangea/dnd";
import CardColumn from "./CardColumn";
import { cn } from "@/lib/utils";
import { set } from "mongoose";
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
}: {
  viewType: string;
  tasks: TaskDto[];
  project: ProjectDto;
  projectUsers: UserDto[];
}) => {
  // const sortByObject = sortByType(viewType, SORT_TYPES, tasks);
  // type SortByType = ReturnType<typeof sortByType>;
  // // const sortedKeys = project.columnOrder.filter((type: string)=>columnObject[type]);
  // console.log("sortByObject", sortByObject);

  // const [columnObject, setColumnObject] = useState(sortByObject);
  // const sortedTasksArray = project.columnOrder[viewType].map((type) => [
  //   type,
  //   columnObject[type],
  // ]);
  // console.log("-*--------SORTED TASKS ARRAY", sortedTasksArray);
  // const [sortedColumns, setSortedColumns] = useState(sortedTasksArray);
  // const [tasksList, setTasksList] = useState(tasks);
  // const [projectData, setProjectData] = useState(project);

  // useEffect(() => {
  //   setTasksList(tasks);
  // }, [tasks]);
  // useEffect(() => {
  //   setProjectData(project);
  // }, [project]);
  // useEffect(() => {
  //   setColumnObject(sortByType(viewType, SORT_TYPES, tasks));
  // }, [viewType, tasks]);
  // useEffect(() => {
  //   const sortedTasksArray = project.columnOrder[viewType].map((type) => [
  //     type,
  //     columnObject[type],
  //   ]);

  //   setSortedColumns(sortedTasksArray);
  // }, [viewType, tasks]);
  const taskIds = tasks.map((task) => task.id);
  const sortByObject = sortByType(viewType, SORT_TYPES, tasks);
  // Initialize state variables
  const [columnObject, setColumnObject] = useState(sortByObject);
  const [sortedColumns, setSortedColumns] = useState<any[]>([]);
  const [tasksList, setTasksList] = useState<TaskDto[]>([]);
  const [projectData, setProjectData] = useState<ProjectDto>(project);

  // Update sortedColumns when viewType or tasks change
  useEffect(() => {
    const sortedTasksArray = projectData.columnOrder[viewType].map(
      (type: string) => [type, columnObject[type]]
    );
    setSortedColumns(sortedTasksArray);
  }, [viewType, columnObject, projectData.columnOrder]);

  // Update tasksList and projectData when tasks or project change
  useEffect(() => {
    setTasksList(tasks);
    setProjectData(project);
  }, [tasks, project]);

  // Update columnObject when viewType or tasks change
  useEffect(() => {
    setColumnObject(sortByType(viewType, SORT_TYPES, tasks));
  }, [viewType, tasks]);
  // Initialize task card open states with all tasks initially closed
  const initialTaskCardOpenStates: Record<string, boolean> = {};
  taskIds.forEach((id) => {
    initialTaskCardOpenStates[id] = false;
  });
  const updateColumnsOrder = async (
    // project: ProjectDto,
    // tasks: TaskDto[],
    // movedTaskId: string,
    // type: string,
    // sourceDroppableId: string,
    // destinationDroppableId: string,
    // sourceIndex: number,
    destinationIndex: number,
    draggableId: string
  ) => {
    const existingProjectData = { ...project };
    const newColumnOrder = projectData.columnOrder[viewType];
    const existingIndex = newColumnOrder.indexOf(draggableId);
    console.log("newColumnOrder", newColumnOrder);

    newColumnOrder.splice(existingIndex, 1);
    console.log("newColumnOrder2", newColumnOrder);

    newColumnOrder.splice(destinationIndex, 0, draggableId);
    console.log("newColumnOrder3", newColumnOrder);
    //update project data in db
    const newProjectData = { ...projectData };
    newProjectData.columnOrder[viewType] = newColumnOrder;
    console.log("newProjectData", newProjectData);
    setProjectData(newProjectData);
    // console.log("newProjectData", newProjectData);

    // await updateProjectColumnOrderAction(project.id, viewType, newColumnOrder);
    try {
      await updateProjectAction(projectData);
    } catch (error: any) {
      setProjectData(existingProjectData);
      console.log("error updating project, reverting to existing data");
      console.error(error);
    }
  };

  const updateTasksOrderInLists = async (
    project: ProjectDto,
    tasks: TaskDto[],
    movedTaskId: string,
    type: string,
    sourceDroppableId: string,
    destinationDroppableId: string,
    sourceIndex: number,
    destinationIndex: number
  ) => {
    const newTasks = [...tasks];
    const tasksAffected = new Set<TaskDto>([]);
    if (
      sourceDroppableId === destinationDroppableId &&
      destinationIndex !== sourceIndex
    ) {
      // task moves position in original column

      const updatedTasks = newTasks.map((task) => {
        if (task.id === movedTaskId) {
          task.orderInLists[type][0] = destinationDroppableId;
          task.orderInLists[type][1] = destinationIndex;
          console.log("taskid", task.id);

          console.log("movedTask", task);
          tasksAffected.add(task);
        }
        //move from above
        else if (
          task.orderInLists[type][0] == sourceDroppableId &&
          task.orderInLists[type][1] >= destinationIndex &&
          sourceIndex > destinationIndex
        ) {
          console.log("taskid", task.id);
          console.log("else if before", task.orderInLists);

          task.orderInLists[type][1] = Number(task.orderInLists[type][1]) + 1;
          console.log("else if after", task.orderInLists);
          tasksAffected.add(task);
        }
        //move from below
        else if (
          task.orderInLists[type][0] == sourceDroppableId &&
          task.orderInLists[type][1] <= destinationIndex &&
          task.orderInLists[type][1] > 0 &&
          sourceIndex < destinationIndex
        ) {
          console.log("taskid", task.id);

          console.log("else if 2 before", task.orderInLists);

          task.orderInLists[type][1] = Number(task.orderInLists[type][1]) - 1;
          console.log("else if 2 after", task.orderInLists);

          tasksAffected.add(task);
        }
        return task;
      });
      setTasksList(updatedTasks);
    } else if (sourceDroppableId !== destinationDroppableId) {
      // task moves column
      const updatedTasks = newTasks.map((task) => {
        if (
          task.orderInLists[type][0] == sourceDroppableId &&
          task.orderInLists[type][1] > sourceIndex &&
          task.id !== movedTaskId
        ) {
          task.orderInLists[type][1] = Number(task.orderInLists[type][1]) - 1;
          tasksAffected.add(task);
        } else if (
          task.orderInLists[type][0] == destinationDroppableId &&
          task.orderInLists[type][1] >= destinationIndex &&
          task.id !== movedTaskId
        ) {
          task.orderInLists[type][1] = Number(task.orderInLists[type][1]) + 1;
          tasksAffected.add(task);
        } else if (task.id === movedTaskId) {
          switch (type) {
            case "priority":
              task.priority = destinationDroppableId;
              break;
            case "status":
              task.status = destinationDroppableId;
              break;
            case "category":
              task.category = destinationDroppableId;
              break;
          }

          task.orderInLists[type][1] = destinationIndex;
          task.orderInLists[type][0] = destinationDroppableId;
          tasksAffected.add(task);
          console.log("RETURN TASK 3", task);
        }
        return task;
      });

      // Updates state first. Then updates the backend
      const tempProject = { ...projectData };
      if (tempProject.listsNextAvailable[type][sourceDroppableId] > 0) {
        tempProject.listsNextAvailable[type][sourceDroppableId]--;
      }
      tempProject.listsNextAvailable[type][destinationDroppableId]++;
      setProjectData(tempProject);
      setTasksList(updatedTasks);

      await updateProjectAction(projectData);
    }
    //update DB
    const affectedTasksArray = Array.from(tasksAffected);
    await updateTasksOrderInListsAction(project.id, affectedTasksArray);
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
    // updateTaskByColumnChange(type, destination.droppableId, draggableId);
    if (type == "task") {
      return updateTasksOrderInLists(
        projectData,
        tasksList,
        draggableId,
        viewType,
        source.droppableId,
        destination.droppableId,
        sourceIndex,
        destinationIndex
      );
    }
    if (type == "column") {
      // return updateColumnsOrder(destinationIndex, draggableId);
      // )
      // const newColumnOrder = projectData.columnOrder[viewType];
      // const existingIndex = newColumnOrder.indexOf(draggableId);
      // console.log("newColumnOrder", newColumnOrder);
      // newColumnOrder.splice(existingIndex, 1);
      // console.log("newColumnOrder2", newColumnOrder);
      // newColumnOrder.splice(destinationIndex, 0, draggableId);
      // console.log("newColumnOrder3", newColumnOrder);
      // //update project data in db
      // const newProjectData = { ...projectData };
      // newProjectData.columnOrder[viewType] = newColumnOrder;
      // console.log("newProjectData", newProjectData);
      // setProjectData(newProjectData);
      // console.log("newProjectData", newProjectData);
      // await updateProjectAction(newProjectData);
      // const newColumnOrder = Array.from(SORT_TYPES);
      // newColumnOrder.splice(source.index, 1);
      // newColumnOrder.splice(destination.index, 0, SORT_TYPES[source.index]);
      // const newColumnOrderObject: Columns = {};
      // newColumnOrder.forEach((columnType) => {
      //   newColumnOrderObject[columnType] = columnObject[columnType];
      // });
      // setColumnObject(newColumnOrderObject);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {/* <div className="flex md:flex-row  justify-center flex-col w-min-full overflow-x"> */}
      <Droppable droppableId="all-columns" direction="horizontal" type="column">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex md:flex-row justify-center flex-col w-min-full "
          >
            <>
              {/* {Object.entries(columnObject).map(
                ([sorted_type, tasksList], sorted_idx) => (
                  <CardColumn
                    tasksList={tasksList}
                    projectData={projectData}
                    sorted_idx={sorted_idx}
                    projectUsers={projectUsers}
                    sorted_type={sorted_type}
                  />
                )
              )} */}
              {sortedColumns.map((column, sorted_idx) => (
                <CardColumn
                  tasksList={column[1] as TaskDto[]}
                  projectData={projectData}
                  sorted_idx={sorted_idx}
                  projectUsers={projectUsers}
                  sorted_type={column[0] as string}
                />
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
