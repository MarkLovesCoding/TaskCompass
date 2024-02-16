import React from "react";
import { unstable_noStore } from "next/cache";

import getProject from "@/data-access/projects/get-project.persistence";
import getProjectTasks from "@/data-access/tasks/get-project-tasks.persistence";

import { ProjectPage } from "@/app/PROJECTS-CLEAN/[id]/project-page-component";

import { sessionAuth } from "@/lib/sessionAuth";
import { ProjectContextProvider } from "./ProjectContext";

type ParamsType = {
  id: string;
};

const Projects = async ({ params }: { params: ParamsType }) => {
  unstable_noStore();
  console.log("Params: ", params);
  const session = await sessionAuth(`PROJECTS-CLEAN/${params.id}`);
  const project = await getProject(params.id);
  const tasks = await getProjectTasks(project);
  if (!project) {
    return <p>No project found.</p>;
  }

  return (
    <div className="p-5 flex justify-center flex-col items-center">
      <ProjectContextProvider>
        <ProjectPage
          userId={session?.user.id!}
          project={project}
          tasks={tasks}
        />
      </ProjectContextProvider>
    </div>
  );
};

export default Projects;
