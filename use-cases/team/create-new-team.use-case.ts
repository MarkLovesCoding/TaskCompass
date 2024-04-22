import { TeamEntity } from "@/entities/Team";
import { CreateNewTeam } from "@/use-cases/team/types";
import { GetUserSession } from "@/use-cases/user/types";
import { teamToCreateTeamDto } from "@/use-cases/team/utils";
import { AuthenticationError } from "../utils";

export async function createNewTeamUseCase(
  context: {
    createNewTeam: CreateNewTeam;
    getUser: GetUserSession;
  },
  data: {
    name: string;
  }
) {
  const user = context.getUser()!;
  if (!user) throw new AuthenticationError();

  const newTeam = new TeamEntity({
    name: data.name,
    users: [user.userId],
    projects: [],
    createdBy: user.userId,
    backgroundImage: "",
    backgroundImageThumbnail: "",
  });
  await context.createNewTeam(teamToCreateTeamDto(newTeam), user.userId);
}
