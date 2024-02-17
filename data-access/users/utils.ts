import type { UserModelType } from "./types";
import type { UserDto } from "@/use-cases/user/types";
export function userModelToUserDto(user: UserModelType): UserDto {
  const convertedProjects =
    user.projects.length > 0
      ? user.projects.map((user) => user.toString())
      : [];
  const convertedTeams =
    user.teams.length > 0 ? user.teams.map((user) => user.toString()) : [];
  const convertedTasks =
    user.tasks.length > 0 ? user.tasks.map((user) => user.toString()) : [];
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    projects: convertedProjects,
    teams: convertedTeams,
    tasks: convertedTasks,
    avatar: user.avatar,
  };
}
