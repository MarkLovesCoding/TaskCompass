import { TeamEntity } from "@/entities/Team";
import { GetTeam, UpdateTeam, UpdateTeamMembers } from "@/use-cases/team/types";
import { GetUser } from "@/use-cases/user/types";
import { teamToDto } from "@/use-cases/team/utils";

export async function updateTeamMembersUseCase(
  context: {
    updateTeam: UpdateTeam;
    updateTeamMembers: UpdateTeamMembers;
    getTeam: GetTeam;
    getUser: GetUser;
  },
  data: {
    teamId: string;
    updatedMembers: string[];
  }
) {
  const { userId } = context.getUser()!;
  if (!userId) throw new Error("User not found");

  const team = await context.getTeam(data.teamId);
  const validatedTeam = new TeamEntity(team);
  const initialMembers = validatedTeam.getMembers();
  validatedTeam.updateMembers(data.updatedMembers);

  console.log("updatedTeam", validatedTeam);
  await context.updateTeam(teamToDto(validatedTeam));
  await context.updateTeamMembers(
    data.teamId,
    initialMembers,
    data.updatedMembers
  );
}