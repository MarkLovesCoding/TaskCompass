import { Suspense } from "react";
import { unstable_noStore } from "next/cache";

import { Toaster } from "sonner";

import { sessionAuth } from "@/lib/sessionAuth";
import { TeamPageComponent } from "./TeamPageComponent";
import getTeam from "@/data-access/teams/get-team.persistence";
import getAllUsers from "@/data-access/users/get-all-users.persistence";
import getTeamUsers from "@/data-access/users/get-team-users.persistence";
import getTeamProjects from "@/data-access/projects/get-team-projects";
import getUserObject from "@/data-access/users/get-user.persistence";
import type { UserDto } from "@/use-cases/user/types";
import { TeamPageSkeleton } from "@/app/team/[id]/TeamSkeleton";

import type { TeamDto } from "@/use-cases/team/types";
type ParamsType = {
  id: string;
};

const Projects = async ({ params }: { params: ParamsType }) => {
  unstable_noStore();
  const session = await sessionAuth(`team/${params.id}`);

  const teamId = params.id;
  const team: TeamDto = await getTeam(teamId);
  const user: UserDto = await getUserObject(session!.user.id);
  const projects = await getTeamProjects(team);
  const usersList = await getAllUsers();
  const teamUsers = await getTeamUsers(team.users);

  if (!team) {
    return (
      <p>
        Team Not Retrieved from Database. Please try again later or reload page.
      </p>
    );
  }
  if (!session) {
    return <TeamPageSkeleton />;
  }
  return (
    <div className=" flex justify-center flex-col items-center">
      <Suspense fallback={<TeamPageSkeleton />}>
        <TeamPageComponent
          team={team}
          user={user}
          userId={session?.user.id}
          projects={projects}
          usersList={usersList}
          teamUsers={teamUsers}
        />
      </Suspense>
      <Toaster />
    </div>
  );
};

export default Projects;
