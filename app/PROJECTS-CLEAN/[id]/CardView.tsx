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
import { updateProjectAction } from "../_actions/update-project.action";
import { updateTasksOrderInListsAction } from "../_actions/update-tasks-order-in-lists.action";
import { Droppable, DragDropContext } from "@hello-pangea/dnd";
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
  console.log("sortByObject", sortByObject);
  const columns = {} as Columns;
  // Generate unique IDs for each task
  const [columnObject, setColumnObject] = useState(sortByObject);
  const [tasksList, setTasksList] = useState(tasks);
  const [projectData, setProjectData] = useState(project);
  // useEffect(() => {
  //   setTasksList(tasks);
  //   setProjectData(project);
  //   setColumnObject(sortByType(type, SORT_TYPES, tasks));
  // }, [tasks, project, type]);
  useEffect(() => {
    setTasksList(tasks);
  }, [tasks]);
  useEffect(() => {
    setProjectData(project);
  }, [project]);
  useEffect(() => {
    setColumnObject(sortByType(type, SORT_TYPES, tasks));
  }, [type, tasks]);

  // useEffect(() => {
  //   setColumnObject(sortByObject);
  // }, [type]);
  // const [typeTasksAndOrder, setTypeTasksAndOrder] = useState(sortByObject);
  // Iterate over each key-value pair in the currentObject
  Object.entries(sortByObject).forEach(([key, tasks]) => {
    // Extract the taskIds from the array of TaskDto
    const taskIds = tasks.map((task) => task.id);

    // Assign the taskIds to the corresponding key in columns
    columns[key] = {
      taskIds: taskIds,
    };
  });
  // const [columnsForDnd, setColumnsForDnd] = React.useState(columns);
  const taskIds = tasks.map((task) => task.id);

  // Initialize task card open states with all tasks initially closed
  const initialTaskCardOpenStates: Record<string, boolean> = {};
  taskIds.forEach((id) => {
    initialTaskCardOpenStates[id] = false;
  });
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
  // functino to update OrderInLists  // ALL tasks in project
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
      // setProjectData((prev) => {
      //   console.log("*******prev", prev);
      //   const updatedProject = { ...prev };
      //   if (updatedProject.listsNextAvailable[type][sourceDroppableId] > 0) {
      //     updatedProject.listsNextAvailable[type][sourceDroppableId]--;
      //   }
      //   console.log(
      //     "*******55555*22********projectData2",
      //     updatedProject.listsNextAvailable
      //   );

      //   updatedProject.listsNextAvailable[type][destinationDroppableId] += 1;
      //   console.log(
      //     "******22225*22********projectData2",
      //     updatedProject.listsNextAvailable
      //   );

      //   return updatedProject;
      // });
      console.log("*********22********projectData2", projectData);
      setTasksList(updatedTasks);
      console.log(
        "***222*updatedProject.listsNextAvailable",
        projectData.listsNextAvailable
      );
      console.log("**222**type", type);
      console.log("**222**sourceDroppableId", sourceDroppableId);
      console.log("**222**destinationDroppableId", destinationDroppableId);
      console.log("********55********projectData2", projectData);

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
    // const sourceColumnTasks = columnObject[source.droppableId];
    // if (
    //   destination.droppableId === source.droppableId &&
    //   destination.index !== source.index
    // ) {
    //   console.log("draggedId", draggableId);
    //   console.log("source.droppableId", source.droppableId);
    //   console.log("column", sourceColumnTasks);
    //   console.log("columns", columnObject);

    //   const newTasks = sourceColumnTasks;
    //   console.log("sourceIndex", sourceIndex);
    //   console.log("destinationIndex", destinationIndex);

    //   const newTask = sourceColumnTasks.find((task) => task.id === draggableId);
    //   newTasks.splice(sourceIndex, 1);
    //   newTasks.splice(destinationIndex, 0, newTask!);
    //   console.log("newTaskIds_edited", newTasks);
    //   console.log("newTask", newTask);

    //   console.log("type", type);
    //   console.log("sourcedroppableId", source.droppableId);
    //   console.log("destinationdroppableId", destination.droppableId);
    // }
    // //CASES
    // if (
    //   destination.droppableId !== source.droppableId &&
    //   destination.index !== source.index
    // ) {
    //   const destinationColumnTasks = columnObject[destination.droppableId];
    //   console.log(
    //     "projectData.listsNextAvailable",
    //     projectData.listsNextAvailable
    //   );
    //   console.log("type", type);
    //   console.log("source.droppableId", source.droppableId);
    //   console.log("destination.droppableId", destination.droppableId);

    //   console.log("projectData", projectData);

    //   setProjectData((prev) => {
    //     return {
    //       ...prev,
    //       listsNextAvailable: {
    //         ...prev.listsNextAvailable,
    //         [type]: {
    //           ...prev.listsNextAvailable[type],
    //           [source.droppableId]:
    //             prev.listsNextAvailable[type][source.droppableId] + 1,
    //           [destination.droppableId]:
    //             prev.listsNextAvailable[type][
    //               destination.droppableId as string
    //             ] - 1,
    //         },
    //       },
    //     };
    //   });
    // console.log("projectDataafter", projectData);

    // // projectData.listsNextAvailable[type][source.droppableId] =
    // //   //@ts-expect-error
    // //   projectData.listsNextAvailable[type][source.droppableId] - 1;
    // // //@ts-expect-error
    // // projectData.listsNextAvailable[type][destination.droppableId] =
    // //   //@ts-expect-error
    // //   projectData.listsNextAvailable[type][destination.droppableId] + 1;
    // console.log("tasklistbefore", tasksList);

    // setTasksList((prev) => {
    //   return prev.map((task) => {
    //     if (task.id === draggableId) {
    //       return {
    //         ...task,
    //         orderInLists: {
    //           ...task.orderInLists,
    //           [type]: [destination.droppableId, destinationIndex],
    //         },
    //       };
    //     }
    //     return task;
    //   });
    // });
    // // tasksList.find((task) => task.id === draggableId)!.orderInLists[type] = [
    // //   destination.droppableId,
    // //   destinationIndex,
    // // ];
    // console.log("tasklistafter", tasksList);
    // }
    // projectData.listsNextAvailable[type][destination.droppableId] = projectData.listsNextAvailable[type][destination.droppableId] + 1;

    //  task moves column

    //project.listsNextAvailable. 'fromColumn' - 1
    //project.listsNextAvailable. 'ToColumn' + 1
    //task.orderInLists.type = ['toColumn', 'toIndex']

    // UPDATE OTHER TASKS ORDERS
    // AllTaskObjects.forEach((task) => {
    //   if (task.orderInLists.type[0] === 'toColumn' && task.orderInLists.type[1] >= 'toIndex') {
    //     task.orderInLists.type[1] + 1
    //  }) else
    // if (task.orderInLists.type[0] === 'toColumn && task.orderInLists.type[1] <= 'toIndex') {
    //   task.orderInLists.type[1] - 1
    // }
    // })

    //  task moves position in column
    //AllTaskObjects.forEach((task) => {
    //   if (task.orderInLists.type[0] === 'fromColumn' && task.orderInLists.type[1] >= 'fromIndex') {
    //     task.orderInLists.type[1] + 1
    //  }) else
    // if (task.orderInLists.type[0] === 'fromColumn && task.orderInLists.type[1] <= 'fromIndex') {
    //   task.orderInLists.type[1] - 1
    // }
    // })
    //  task.orderInLists.type = ['fromColumn', 'toIndex']

    // setColumnObject((prev) => {
    //   return {
    //     ...prev,
    //     [source.droppableId]: newTasks,
    //   };
    // });

    // console.log("columnsForDnd", columnsForDnd);
    // Update the task order in the backend
    // create function to abstract this
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
    // };
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {/* <div className="flex md:flex-row  justify-center flex-col w-min-full overflow-x"> */}
      <div className="flex md:flex-row justify-center flex-col w-min-full ">
        {/* Render div elements for entries where tasks exist */}
        {type === "category" ? (
          <>
            {Object.entries(columnObject)
              .filter(([_, tasksList]) => tasksList.length > 0)
              .map(([sorted_type, tasksList], sorted_idx) => (
                <Droppable droppableId={sorted_type} key={sorted_idx}>
                  {(provided, snapshot) => (
                    //COLUMNS
                    <>
                      <Container
                        ref={provided.innerRef}
                        key={sorted_idx}
                        {...provided.droppableProps}
                        className={cn(
                          "min-w-[325px]",
                          `flex flex-col items-center min-h-[500x] px-4 align-top `
                        )}
                      >
                        <label className="text-2xl font-bold">{`${sorted_type}`}</label>
                        {tasksList.map(
                          (task, task_idx) =>
                            !task.archived && (
                              <div key={task.id}>
                                <TaskCardSmallDialog
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
                      </Container>
                    </>
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
              ([sorted_type, tasksList], sorted_idx) => (
                <Droppable droppableId={sorted_type} key={sorted_idx}>
                  {(provided, snapshot) => (
                    <>
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        key={sorted_idx}
                        className="flex flex-col  items-center min-w-[400px]  px-4  align-top overflow-clip"
                      >
                        <label className="text-2xl font-bold">{`${sorted_type}`}</label>
                        {tasksList.length === 0
                          ? "No tasks"
                          : tasksList.map(
                              (task, task_idx) =>
                                !task.archived && (
                                  <div key={task_idx}>
                                    <TaskCardSmallDialog
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
                    </>
                  )}
                </Droppable>
              )
            )}
          </>
        )}
      </div>
      {/* </div> */}
    </DragDropContext>
  );
};

export default CardView;
