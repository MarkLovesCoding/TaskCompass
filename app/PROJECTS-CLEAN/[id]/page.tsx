import React from "react";
import getProject from "@/data-access/projects/get-project";
import getProjectTasks from "@/data-access/tasks/get-project-tasks";

import { ProjectPage } from "@/app/PROJECTS-CLEAN/[id]/project-page-component";
import { unstable_noStore } from "next/cache";
import { sessionAuth } from "@/lib/sessionAuth";

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
      <ProjectPage project={project} tasks={tasks} />
    </div>
  );
};

export default Projects;
