import React from "react";
import { unstable_noStore } from "next/cache";
import { Suspense } from "react";
import getProject from "@/data-access/projects/get-project.persistence";
import getTeam from "@/data-access/teams/get-team.persistence";
import getTeamUsers from "@/data-access/users/get-team-users.persistence";
import getProjectTasks from "@/data-access/tasks/get-project-tasks.persistence";
import getProjectUsers from "@/data-access/users/get-project-users.persistence";
import { ProjectPage } from "@/app/project/[id]/MainProjectComponent";
import { Toaster } from "react-hot-toast";
import { sessionAuth } from "@/lib/sessionAuth";
import getUserObject from "@/data-access/users/get-user.persistence";
import { ProjectPageSkeleton } from "./ProjectPageSkeleton";

type ParamsType = {
  id: string;
};

const Projects = async ({ params }: { params: ParamsType }) => {
  unstable_noStore();
  const session = await sessionAuth(`project/${params.id}`);
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
    return (
      <div className="flex w-full h-full justify-center items-center">
        <p className="text-3xl font-bold text-center">
          No project found. Please go back and try again.
        </p>
        ;
      </div>
    );
  }

  return (
    <div className="absolute top-[3rem] left-0 flex align-baseline max-h-[calc(100vh-3rem)]">
      <Suspense fallback={<ProjectPageSkeleton />}>
        <ProjectPage
          user={user}
          userId={session?.user.id!}
          project={project}
          teamUsers={teamUsers}
          projectUsers={projectUsers}
          tasks={tasks}
          team={team}
        />
      </Suspense>
      <Toaster />
    </div>
  );
};

export default Projects;
