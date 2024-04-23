import type { UserModelType } from "./types";
import type { UserDto } from "@/use-cases/user/types";

export function userModelToUserDto(user: UserModelType): UserDto {
  const convertedProjectsAsAdmin =
    user.projectsAsAdmin && user.projectsAsAdmin.length > 0
      ? user.projectsAsAdmin.map((user) => user.toString())
      : [];
  const convertedTeamsAsAdmin =
    user.teamsAsAdmin && user.teamsAsAdmin.length > 0
      ? user.teamsAsAdmin.map((user) => user.toString())
      : [];
  const convertedProjectsAsMember =
    user.projectsAsMember && user.projectsAsMember.length > 0
      ? user.projectsAsMember.map((user) => user.toString())
      : [];
  const convertedTeamsAsMember =
    user.teamsAsMember && user.teamsAsMember.length > 0
      ? user.teamsAsMember.map((user) => user.toString())
      : [];
  const convertedTasks =
    user.tasks.length > 0 ? user.tasks.map((user) => user.toString()) : [];
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    projectsAsAdmin: convertedProjectsAsAdmin,
    projectsAsMember: convertedProjectsAsMember,
    teamsAsAdmin: convertedTeamsAsAdmin,
    teamsAsMember: convertedTeamsAsMember,
    tasks: convertedTasks,
    avatar: user.avatar,
    backgroundImage: user.backgroundImage,
  };
}
