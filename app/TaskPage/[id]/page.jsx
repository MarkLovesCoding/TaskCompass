import TaskForm from "@/app/(components)/TaskForm";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options.js";
import { redirect } from "next/navigation";
import { ProjectType, ParamsType, TaskType } from "@/app/types/types";

const getTaskById = async (id) => {
  try {
    const res = await fetch(`http://localhost:3000/api/Tasks/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch Task");
    }

    return res.json();
  } catch (error) {
    console.log(error);
  }
};
const getProjectsFromUserForFormList = async (userId) => {
  // Fetch data from an API or any other source
  const response = await fetch(
    `http://localhost:3000/api/Projects/User/${userId}`
  );
  const data = await response.json();
  // console.log("Projects api", data);
  // Return the data as props
  // console.log("ProjectsByUser___________:", data);
  return data.projects;
};

const getConnectionsUsers = async (userId) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/Users/Connections/${userId}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.log("Error fetching data for users/connections");
    }
    const usersFromConnections = await response.json();

    const { availableAssignees } = usersFromConnections;

    // Use Set to eliminate duplicates based on _id
    const uniqueAssigneesIds = Array.from(
      new Set(availableAssignees.map((user) => user._id))
    );

    // Fetch the full user objects based on unique _id values
    const uniqueUsers = uniqueAssigneesIds.map((userId) =>
      availableAssignees.find((user) => user._id === userId)
    );

    return uniqueUsers;
  } catch (error) {
    console.error("Error getting user connections: ", error.message);
    throw error;
  }
};

const TaskPage = async ({ params }) => {
  let updateTaskData;
  const session = await getServerSession(options);
  if (!session) {
    redirect(`/api/auth/signin?callbackUrl=/TaskPage/${params}`);
  }
  const userName = session.user.name;
  const userId = session.user.id;

  const projects = await getProjectsFromUserForFormList(userId);
  const initialAssignees = await getConnectionsUsers(userId);
  const EDITMODE = params.id === "new" ? false : true;

  if (EDITMODE) {
    updateTaskData = await getTaskById(params.id);
    updateTaskData = updateTaskData.foundTask;
    // console.log("TaskData", updateTaskData);
  } else {
    updateTaskData = {
      _id: "new",
    };
    // console.log("Task DATA:", updateTaskData);
  }

  return (
    <TaskForm
      task={updateTaskData}
      projects={projects}
      userData={session.user}
      initialAssignees={initialAssignees}
    />
  );
};

export default TaskPage;
