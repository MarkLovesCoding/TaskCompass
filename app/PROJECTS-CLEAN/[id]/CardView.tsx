"use client";
import React, { useState, useEffect } from "react";
import { ProjectDto } from "@/use-cases/project/types";
import { TaskDto } from "@/use-cases/task/types";
import { UserDto } from "@/use-cases/user/types";
import { sortByType } from "./utils";
import { SORT_TYPES } from "./constants";
// import { PRIORITY_COLORS } from "./constants";
import { updateProjectAction } from "../_actions/update-project.action";
import { updateTasksOrderInListsAction } from "../_actions/update-tasks-order-in-lists.action";
import { Droppable, DragDropContext } from "@hello-pangea/dnd";
import CardColumn from "./CardColumn";
import { cn } from "@/lib/utils";
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
  console.log("sortByObject", sortByObject);

  const [columnObject, setColumnObject] = useState(sortByObject);
  const [tasksList, setTasksList] = useState(tasks);
  const [projectData, setProjectData] = useState(project);

  useEffect(() => {
    setTasksList(tasks);
  }, [tasks]);
  useEffect(() => {
    setProjectData(project);
  }, [project]);
  useEffect(() => {
    setColumnObject(sortByType(type, SORT_TYPES, tasks));
  }, [type, tasks]);

  const taskIds = tasks.map((task) => task.id);

  // Initialize task card open states with all tasks initially closed
  const initialTaskCardOpenStates: Record<string, boolean> = {};
  taskIds.forEach((id) => {
    initialTaskCardOpenStates[id] = false;
  });

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
    // updateTaskByColumnChange(type, destination.droppableId, draggableId);

    return updateTasksOrderInLists(
      projectData,
      tasksList,
      draggableId,
      type,
      source.droppableId,
      destination.droppableId,
      sourceIndex,
      destinationIndex
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {/* <div className="flex md:flex-row  justify-center flex-col w-min-full overflow-x"> */}
      <div className="flex md:flex-row justify-center flex-col w-min-full ">
        {/* Render div elements for entries where tasks exist */}
        {/* {type === "category" ? (
          <>
            {Object.entries(columnObject)
              .filter(([_, tasks]) => tasks.length > 0)
              .map(([sorted_type, tasksList], sorted_idx) => (
                // <Droppable droppableId={sorted_type} key={sorted_idx}>
                //   {(provided, snapshot) => (
                //     //COLUMNS

                //     <div
                //       ref={provided.innerRef}
                //       key={sorted_idx}
                //       {...provided.droppableProps}
                //       className={cn(
                //         snapshot.isDraggingOver
                //           ? "bg-gray-800   "
                //           : "border-gray-500 border-1",
                //         ` min-w-[325px] m-6  flex flex-col items-center align-top px-4  `
                //       )}
                //     >
                //       <label className="text-2xl font-bold">{`${sorted_type}`}</label>
                //       {tasksList.map(
                //         (task, task_idx) =>
                //           !task.archived && (
                //             <div key={task.id}>
                //               <TaskCardSmallDialog
                //                 isDraggingOver={snapshot.isDraggingOver}
                //                 tasks={tasksList}
                //                 task={task}
                //                 project={projectData}
                //                 projectUsers={projectUsers}
                //                 task_idx={task_idx}
                //                 sorted_idx={sorted_idx}
                //               />
                //             </div>
                //           )
                //       )}
                //       {provided.placeholder}
                //     </div>
                //   )}
                // </Droppable>
                <CardColumn
                  tasksList={tasksList}
                  projectData={projectData}
                  sorted_idx={sorted_idx}
                  projectUsers={projectUsers}
                  sorted_type={sorted_type}
                />
              ))}
            {/* Render div element for "No Tasks" case */}
        {/* {Object.entries(columnObject)
              // .filter(([_, tasks]) => tasks.length === 0)
              // .map(([sorted_type], sorted_idx) => ( */}
        {/* // <CardColumn */}
        {/* //   tasksList={tasks}
                //   projectData={projectData}
                //   sorted_idx={sorted_idx}
                //   projectUsers={projectUsers}
                //   sorted_type={sorted_type}
                // />

        //         <Droppable droppableId={sorted_type} key={sorted_idx}> */}
        {/* //           {(provided, snapshot) => ( */}
        {/* //             <div
        //               ref={provided.innerRef}
        //               key={sorted_idx}
        //               {...provided.droppableProps}
        //               className={cn(
        //                 snapshot.isDraggingOver
        //                   ? "bg-gray-800   "
        //                   : "border-gray-500 border-1",
        //                 ` min-w-[325px] m-6  flex flex-col items-center align-top px-4  `
        //               )}
        //             >
        //               <label className="text-2xl font-bold">{`${sorted_type}`}</label>
        //               <span>No tasks</span>
        //             </div>
        //           )}
        //         </Droppable>
        //       ))}
        //   </> */}
        {/* // ) : ( */}
        {/* <> */}
        <>
          {Object.entries(columnObject).map(
            ([sorted_type, tasksList], sorted_idx) => (
              // <Droppable droppableId={sorted_type} key={sorted_idx}>
              //   {(provided, snapshot) => (
              //     <div
              //       ref={provided.innerRef}
              //       {...provided.droppableProps}
              //       // key={sorted_idx}
              //       className={cn(
              //         snapshot.isDraggingOver
              //           ? "bg-gray-800   "
              //           : "border-gray-500 border-1",
              //         ` min-w-[325px] m-6  flex flex-col items-center align-top px-4  `
              //       )}
              //     >
              //       <label className="text-2xl font-bold">{`${sorted_type}`}</label>
              //       {tasksList.length === 0
              //         ? "No tasks"
              //         : tasksList.map(
              //             (task, task_idx) =>
              //               !task.archived && (
              //                 <div key={task_idx}>
              //                   <TaskCardSmallDialog
              //                     isDraggingOver={snapshot.isDraggingOver}
              //                     tasks={tasksList}
              //                     task={task}
              //                     project={projectData}
              //                     projectUsers={projectUsers}
              //                     task_idx={task_idx}
              //                     sorted_idx={sorted_idx}
              //                   />
              //                 </div>
              //               )
              //           )}
              //       {provided.placeholder}
              //     </div>
              //   )}
              // </Droppable>
              <CardColumn
                tasksList={tasksList}
                projectData={projectData}
                sorted_idx={sorted_idx}
                projectUsers={projectUsers}
                sorted_type={sorted_type}
              />
            )
          )}
        </>
        {/* </> */}
      </div>
      {/* </div> */}
    </DragDropContext>
  );
};

export default CardView;
