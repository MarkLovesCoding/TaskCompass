import { TeamEntity } from "@/entities/Team";
import { CreateNewTeam } from "@/use-cases/team/types";
import { GetUserSession } from "@/use-cases/user/types";
import { teamToCreateTeamDto } from "@/use-cases/team/utils";

export async function createNewTeamUseCase(
  context: {
    createNewTeam: CreateNewTeam;
    getUser: GetUserSession;
  },
  data: {
    name: string;
  }
) {
  const { userId } = context.getUser()!;
  if (!userId) throw new Error("User not found");

  const newTeam = new TeamEntity({
    name: data.name,
    users: [userId],
    projects: [],
    createdBy: userId,
    backgroundImage: "",
    backgroundImageThumbnail: "",
  });
  await context.createNewTeam(teamToCreateTeamDto(newTeam), userId);
}
