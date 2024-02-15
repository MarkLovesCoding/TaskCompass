import { TeamEntity } from "@/entities/Team";
import { TeamDto, UpdateTeamMembers } from "@/use-cases/team/types";
import { GetUser } from "@/use-cases/user/types";
import { teamToDto } from "@/use-cases/team/utils";

export async function updateTeamMembersUseCase(
  context: {
    updateTeamMembers: UpdateTeamMembers;
    getUser: GetUser;
  },
  data: {
    addedMembers: string[];
    removedMembers: string[];
    team: TeamDto;
  }
) {
  const { userId } = context.getUser()!;
  if (!userId) throw new Error("User not found");

  const validatedTeam = new TeamEntity({
    name: data.team.name,
    members: [...data.team.members],
    projects: [...data.team.projects],
  });
  console.log("updatedTeam", validatedTeam);
  await context.updateTeamMembers(
    teamToDto(validatedTeam),
    data.addedMembers,
    data.removedMembers
  );
}
