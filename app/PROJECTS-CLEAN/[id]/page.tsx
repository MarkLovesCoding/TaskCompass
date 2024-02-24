import React from "react";
import { unstable_noStore } from "next/cache";

import getProject from "@/data-access/projects/get-project.persistence";
import getTeam from "@/data-access/teams/get-team.persistence";
import getTeamMembers from "@/data-access/users/get-team-members.persistence";
import getTeamAdmins from "@/data-access/users/get-team-admins.persistence";
import getProjectTasks from "@/data-access/tasks/get-project-tasks.persistence";
import getProjectMembers from "@/data-access/users/get-project-members.persistence";
import getProjectAdmins from "@/data-access/users/get-project-admins.persistence";
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
  const team = await getTeam(project.team);
  const teamMembers = await getTeamMembers(team.members);
  const teamAdmins = await getTeamAdmins(team.admins);
  const projectMembers = await getProjectMembers(project.members);
  const projectAdmins = await getProjectAdmins(project.admins);

  if (!project) {
    return <p>No project found.</p>;
  }

  return (
    <div className=" flex justify-center flex-col items-center">
      <ProjectContextProvider>
        <ProjectPage
          userId={session?.user.id!}
          project={project}
          teamMembers={teamMembers}
          teamAdmins={teamAdmins}
          projectMembers={projectMembers}
          projectAdmins={projectAdmins}
          tasks={tasks}
        />
      </ProjectContextProvider>
    </div>
  );
};

export default Projects;
