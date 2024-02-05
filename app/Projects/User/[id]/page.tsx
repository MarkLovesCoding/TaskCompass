import React from "react";
import ProjectCard from "@/app/(components)/ProjectCard";
import { ProjectType, TaskType, UserType } from "@/app/types/types";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import Link from "next/link";
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
type VerboseProjectType = Omit<ProjectType, "tasks" | "users"> & {
  tasks: TaskType[];
  users: UserType[];
};

const getProjects = async (id: string) => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/Projects/UserWithTasks/${id}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );
    if (!res.ok)
      throw new Error(
        "failed to fetch data on page load. Status:" + res.status
      );
    const data = await res.json();
    // const projects = data.projects;
    const { projects } = data;
    return projects;
  } catch (err) {
    console.log("Failed to get projects:", err);
  }
};
// const getUser = async ()=>{
//   try{
//     const res = await fetch("http://localhost:3000/api/Users",{
//       method:"GET"
//     })
//     if (!res.ok)
//       throw new Error(
//         "failed to fetch user data on page load. Status:" + res.status
//       );
//     const data = await res.json();
//   }
// }
const Projects = async ({ params }: { params: ParamsType }) => {
  const session: Session | null = await getServerSession(options);
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/Projects");
  }
  console.log("Sessiondata: " + JSON.stringify(session?.user));
  const userDataForProjectFiltering = params.id;
  const projects: VerboseProjectType[] = await getProjects(
    userDataForProjectFiltering
  );

  if (!projects) {
    return <p>No current projects.</p>;
  }
  const uniqueProjects = [
    ...new Set(projects?.map(({ name }: { name: string }) => name)),
  ];

  return (
    <div className="p-5 flex justify-center flex-col items-center">
      <h1 className="pt-4 pb-10">Your Projects</h1>

      <div className="flex justify-center flex-col items-center">
        {projects &&
          uniqueProjects.map((uniqueProject, projectIndex) => (
            <div
              key={projectIndex}
              className="mb-10 flex justify-center flex-col items-center"
            >
              {/* <h2 className="mb-2">{uniqueproject}</h2> */}
              <div className="justify-center mb-4 grid grid-flow-row lg:auto-cols-2 xl:auto-cols-4 ">
                {projects
                  .filter((project) => project.name === uniqueProject)
                  .map((filteredProject, _filteredProjectIdx) => (
                    <ProjectCard
                      key={_filteredProjectIdx}
                      project={filteredProject}
                    />
                  ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Projects;
