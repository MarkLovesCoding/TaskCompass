import React from "react";
import { ProjectType, TaskType, UserType } from "@/app/types/types";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

import Link from "next/link";
import UserCardSmall from "@/app/(components)/UserCardSmall";
import TaskCardSmall from "@/app/(components)/TaskCardSmall";
import AddButton from "@/app/(components)/AddButton";

const tempData = {
  availableAssignees: [
    {
      _id: "6595dfb779f96caa40686372",
      name: "Mark Halstead",
      email: "markdavidjameshalstead@gmail.com",
      role: "Google User",
      projects: ["6595dfb779f96caa40686370", "6595fc9679f96caa406864aa"],
      tasks: ["6595f8dc79f96caa406863fc"],
      connections: [],
      createdAt: "2024-01-03T22:29:11.488Z",
      updatedAt: "2024-01-04T00:32:22.698Z",
      __v: 0,
    },
  ],
};

type Session = {
  user: {
    id: string;
    name: string;
    email: string;
    image: undefined;
    role: string;
  };
};
type ParamsType = {
  id: string;
};
type ExpandedProjectType = Omit<ProjectType, "users" | "tasks"> & {
  users: UserType[];
  tasks: TaskType[];
};
type ExpandedUserType = Omit<UserType, "connections" | "projects"> & {
  connections: UserType[];
  projects: ProjectType[];
};

const getProject = async (id: string) => {
  try {
    const res = await fetch(`http://localhost:3000/api/Projects/${id}`, {
      method: "GET",
      cache: "no-store",
    });
    if (!res.ok)
      throw new Error(
        "failed to fetch data on page load. Status:" + res.status
      );
    const data = await res.json();

    // });
    const project = data.project;
    // console.log("FILTERED", data.project);

    return project;
  } catch (err) {
    console.log("Failed to get projects:", err);
  }
};

const getConnectionsUsers = async (id: string) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/Users/Connections/${id}`,
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
      new Set(availableAssignees.map((user: UserType) => user._id))
    );

    // Fetch the full user objects based on unique _id values
    const uniqueUsers = uniqueAssigneesIds.map((userId) =>
      availableAssignees.find((user: UserType) => user._id === userId)
    );

    return uniqueUsers;
  } catch (error: any) {
    console.error("Error getting user connections: ", error.message);
    throw error;
  }
};
const Projects = async ({ params }: { params: ParamsType }) => {
  console.log("Params: ", params);

  const session: Session | null = await getServerSession(options);
  if (!session) {
    redirect(`/api/auth/signin?callbackUrl=/Projects/${params.id}`);
  }
  // console.log("Sessiondata: " + JSON.stringify(session?.user));
  const projectIdForProjectFiltering = params.id;
  console.log(projectIdForProjectFiltering);
  const userConnections = await getConnectionsUsers(session.user.id);
  // const userConnections = tempData.availableAssignees;
  const project: ExpandedProjectType = await getProject(
    projectIdForProjectFiltering
  );
  console.log("getuserConnections", userConnections);
  if (!project) {
    return <p>No project found.</p>;
  }
  // console.log("projectUSERS_________________", project.tasks);
  // console.log("projectConnections_________________", project.users);

  return (
    <div className="p-5 flex justify-center flex-col items-center">
      {/* <h1 className="pt-4 pb-10">Your projects</h1> */}
      <h3 className="mb-2">Project: {project.name}</h3>

      <div>
        <h3>
          Tasks:
          {project.tasks.length == 0 ? (
            <span> {project.tasks.length}</span>
          ) : (
            project.tasks.map((task, task_idx) => (
              <span key={task_idx}>
                <div className="mb-10 flex justify-center flex-col items-center">
                  <div className="justify-center mb-4 grid grid-flow-row lg:auto-cols-2 xl:auto-cols-4 ">
                    {/* LOOK AT HOW TO MAP THE USER.IDS (POPULATE etc.) */}
                    <TaskCardSmall task={task} />
                  </div>
                </div>
              </span>
            ))
          )}
        </h3>
      </div>
      <div className="flex justify-center flex-col items-center">
        <h3 className="mb-2">Users In Project: </h3>
        {project.users.map((user, user_idx) => (
          <span key={user_idx}>
            <div className="mb-10 flex justify-center flex-col items-center">
              <div className="justify-center mb-4 grid grid-flow-row lg:auto-cols-2 xl:auto-cols-4 ">
                {/* LOOK AT HOW TO MAP THE USER.IDS (POPULATE etc.) */}
                <UserCardSmall userData={user._id as string} />
              </div>
            </div>
          </span>
        ))}
        {/* <AddButton users={project.users.map((user) => user._id) as string[]} /> */}
        {!project.isDefault && (
          <AddButton
            project={project}
            users={userConnections}
            defaultUser={session.user.id}
          />
        )}
      </div>
    </div>
  );
};

export default Projects;
