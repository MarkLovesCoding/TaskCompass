import React from "react";

import { TeamPageComponent } from "./team-page-component";
import getTeam from "@/data-access/teams/get-team.persistence";
import type { TeamDto } from "@/use-cases/team/types";
import { unstable_noStore } from "next/cache";
import { sessionAuth } from "@/lib/sessionAuth";
import getAllUsers from "@/data-access/users/get-all-users.persistence";
import getTeamMembers from "@/data-access/users/get-team-members.persistence";
import getTeamAdmins from "@/data-access/users/get-team-admins.persistence";
import getTeamProjects from "@/data-access/projects/get-team-projects";

type ParamsType = {
  id: string;
};

const Projects = async ({ params }: { params: ParamsType }) => {
  unstable_noStore();
  const session = await sessionAuth(`TEAMS-CLEAN/${params.id}`);

  const teamId = params.id;
  const team: TeamDto = await getTeam(teamId);
  const projects = await getTeamProjects(team);
  const usersList = await getAllUsers();
  const teamMembers = await getTeamMembers(team.members);
  const teamAdmins = await getTeamAdmins(team.admins);

  if (!team) {
    return (
      <p>
        Team Not Retrieved from Database. Please try again later or reload page.
      </p>
    );
  }

  return (
    <div className=" flex justify-center flex-col items-center">
      <TeamPageComponent
        team={team}
        userId={session?.user.id!}
        projects={projects}
        usersList={usersList}
        teamMembers={teamMembers}
        teamAdmins={teamAdmins}
      />
    </div>
  );
};

export default Projects;
