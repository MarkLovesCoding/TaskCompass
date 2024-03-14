import React from "react";
import { unstable_noStore } from "next/cache";

import getProject from "@/data-access/projects/get-project.persistence";
import getTeam from "@/data-access/teams/get-team.persistence";
import getTeamUsers from "@/data-access/users/get-team-users.persistence";
import getProjectTasks from "@/data-access/tasks/get-project-tasks.persistence";
import getProjectUsers from "@/data-access/users/get-project-users.persistence";
import getProjectAdmins from "@/data-access/users/get-project-admins.persistence";
import { ProjectPage } from "@/app/PROJECTS-CLEAN/[id]/project-page-component";
import toast, { Toaster } from "react-hot-toast";
import { sessionAuth } from "@/lib/sessionAuth";
import getUserObject from "@/data-access/users/get-user.persistence";

type ParamsType = {
  id: string;
};

const Projects = async ({ params }: { params: ParamsType }) => {
  unstable_noStore();
  console.log("Params: ", params);
  const session = await sessionAuth(`PROJECTS-CLEAN/${params.id}`);
  let projectIdFromParams;
  if (params.id.length === 24) {
    projectIdFromParams = params.id;
  } else projectIdFromParams = "";
  const project = await getProject(projectIdFromParams);
  const tasks = await getProjectTasks(project);
  const team = await getTeam(project.team);
  const user = await getUserObject(session!.user.id);
  const teamUsers = await getTeamUsers(team.users);
  const projectUsers = await getProjectUsers(project.users);

  if (!project) {
    return <p>No project found.</p>;
  }
  console.log("Project: ", project);
  console.log("Tasks: ", tasks);
  console.log("Team: ", team);
  console.log("User: ", user);
  console.log("Team Users: ", teamUsers);
  console.log("Project Users: ", projectUsers);

  return (
    <div className="absolute top-[4rem] left-0 flex align-baseline max-h-[calc(100vh-4rem)]">
      <ProjectPage
        user={user}
        userId={session?.user.id!}
        project={project}
        teamUsers={teamUsers}
        projectUsers={projectUsers}
        tasks={tasks}
        team={team}
      />
      <Toaster />
    </div>
  );
};

export default Projects;
