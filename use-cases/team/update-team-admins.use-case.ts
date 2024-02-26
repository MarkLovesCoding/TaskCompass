import { TeamEntity } from "@/entities/Team";
import { GetTeam, UpdateTeam, UpdateTeamAdmins } from "@/use-cases/team/types";
import { GetUserSession } from "@/use-cases/user/types";
import { teamToDto } from "@/use-cases/team/utils";

export async function updateTeamAdminsUseCase(
  context: {
    updateTeam: UpdateTeam;
    updateManyTeamAdmins: UpdateTeamAdmins;
    getTeam: GetTeam;
    getUser: GetUserSession;
  },
  data: {
    teamId: string;
    updatedAdmins: string[];
  }
) {
  const { userId } = context.getUser()!;
  if (!userId) throw new Error("User not found");

  const team = await context.getTeam(data.teamId);
  const validatedTeam = new TeamEntity(team);
  const initialAdmins = validatedTeam.getAdmins();
  validatedTeam.updateAdmins(data.updatedAdmins);

  console.log("updatedTeam", validatedTeam);
  await context.updateTeam(teamToDto(validatedTeam));
  await context.updateManyTeamAdmins(
    data.teamId,
    initialAdmins,
    data.updatedAdmins
  );
}
