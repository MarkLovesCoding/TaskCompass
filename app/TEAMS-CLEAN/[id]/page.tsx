import React from "react";

import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

import { TeamPageComponent } from "@/components/component/team-page-component";
import getTeam from "@/data-access/teams/get-team";
import type { TeamDto } from "@/use-cases/team/types";

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
  const session: Session | null = await getServerSession(options);
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/Projects");
  }
  console.log("Sessiondata: " + JSON.stringify(session?.user));
  const teamId = params.id;
  const team: TeamDto = await getTeam(teamId);

  if (!team) {
    return <p>No team found.</p>;
  }

  return (
    <div className="p-5 flex justify-center flex-col items-center">
      <TeamPageComponent team={team} />
    </div>
  );
};

export default Projects;
