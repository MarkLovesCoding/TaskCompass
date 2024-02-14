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
  const userId = session?.user.id!;
  // const session: Session | null = await getServerSession(options);

  // console.log("Sessiondata: " + JSON.stringify(session?.user));
  const projectIdForProjectFiltering = params.id;
  console.log(projectIdForProjectFiltering);
  // const userConnections = await getConnectionsUsers(session.user.id);
  // const userConnections = tempData.availableAssignees;
  const project = await getProject(projectIdForProjectFiltering);
  const tasks = await getProjectTasks(project);
  console.log("tasks", tasks);
  // console.log("getuserConnections", userConnections);
  if (!project) {
    return <p>No project found.</p>;
  }

  return (
    <div className="p-5 flex justify-center flex-col items-center">
      {/* <h1 className="pt-4 pb-10">Your projects</h1> */}

      <ProjectPage project={project} userId={userId} tasks={tasks} />
    </div>
  );
};

export default Projects;
