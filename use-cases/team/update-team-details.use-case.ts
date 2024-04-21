import { TeamEntity } from "@/entities/Team";
import { UpdateTeam, GetTeam } from "@/use-cases/team/types";

import { GetUserSession } from "@/use-cases/user/types";
import { teamToDto } from "@/use-cases/team/utils";

export async function updateTeamDetailsUseCase(
  context: {
    updateTeam: UpdateTeam;
    getTeam: GetTeam;
    getUser: GetUserSession;
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
  validatedTeam.updateName(data.name);

  await context.updateTeam(teamToDto(validatedTeam));
}
