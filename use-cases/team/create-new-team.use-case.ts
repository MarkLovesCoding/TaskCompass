import { TeamEntity } from "@/entities/Team";
import { CreateNewTeam } from "@/use-cases/team/types";
import { GetUser } from "@/use-cases/user/types";
import { teamToCreateTeamDto } from "@/use-cases/team/utils";

export async function createNewTeamUseCase(
  context: {
    createNewTeam: CreateNewTeam;
    getUser: GetUser;
  },
  data: {
    name: string;
  }
) {
  const { userId } = context.getUser()!;
  if (!userId) throw new Error("User not found");

  const newTeam = new TeamEntity({
    name: data.name,
    members: [userId],
    projects: [],
  });
  console.log("newTeam", newTeam);
  await context.createNewTeam(teamToCreateTeamDto(newTeam));
}
