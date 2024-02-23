import { TeamEntity } from "@/entities/Team";
import { GetTeam, UpdateTeam, UpdateTeamAdmins } from "@/use-cases/team/types";
import { GetUser } from "@/use-cases/user/types";
import { teamToDto } from "@/use-cases/team/utils";

export async function updateTeamAdminsUseCase(
  context: {
    updateTeam: UpdateTeam;
    updateTeamAdmins: UpdateTeamAdmins;
    getTeam: GetTeam;
    getUser: GetUser;
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
  await context.updateTeamAdmins(
    data.teamId,
    initialAdmins,
    data.updatedAdmins
  );
}
