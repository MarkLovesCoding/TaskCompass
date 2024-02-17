import { TeamEntity } from "@/entities/Team";
import { UpdateTeam, GetTeam } from "@/use-cases/team/types";

import { GetUser } from "@/use-cases/user/types";
import { teamToDto } from "@/use-cases/team/utils";

// to be sorted out with how to update team and user and impliment
export async function updateTeamDetailsUseCase(
  context: {
    updateTeam: UpdateTeam;
    getTeam: GetTeam;
    getUser: GetUser;
  },
  data: {
    name: string;
    teamId: string;
  }
) {
  const user = context.getUser();
  if (!user) throw new Error("User not found");
  if (user) console.log("user found");
  const team = await context.getTeam(data.teamId);

  if (!team) throw new Error("Team not found");
  if (team) console.log("team found", team);
  const validatedTeam = new TeamEntity(team);
  console.log("validatedTeam", validatedTeam);
  console.log("data.name", data.name);
  validatedTeam.updateName(data.name);
  console.log("validatedTeam2", validatedTeam);

  await context.updateTeam(teamToDto(validatedTeam));
}
