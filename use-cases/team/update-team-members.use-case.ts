import { TeamEntity } from "@/entities/Team";
import { GetTeam, UpdateTeam } from "@/use-cases/team/types";
import { GetUser } from "@/use-cases/user/types";
import { teamToDto } from "@/use-cases/team/utils";

export async function updateTeamMembersUseCase(
  context: {
    updateTeam: UpdateTeam;
    getTeam: GetTeam;
    getUser: GetUser;
  },
  data: {
    teamId: string;
    addedMembers: string[];
    removedMembers: string[];
  }
) {
  const { userId } = context.getUser()!;
  if (!userId) throw new Error("User not found");

  const team = await context.getTeam(data.teamId);
  const validatedTeam = new TeamEntity(team);
  validatedTeam.addMembers(data.addedMembers);
  validatedTeam.removeMembers(data.removedMembers);

  console.log("updatedTeam", validatedTeam);
  await context.updateTeam(teamToDto(validatedTeam));
}
