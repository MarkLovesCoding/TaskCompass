import { UserEntity } from "@/entities/User";
import type { UserDto } from "@/use-cases/user/types";

export function userToDto(user: UserEntity): UserDto {
  const userId = user.getId();
  if (!userId) throw new Error("Project id is required");
  return {
    id: userId,
    name: user.getName(),
    email: user.getEmail(),
    projectsAsAdmin: user.getProjectsAsAdmin(),
    teamsAsAdmin: user.getTeamsAsAdmin(),
    projectsAsMember: user.getProjectsAsMember(),
    teamsAsMember: user.getTeamsAsMember(),
    tasks: user.getTasks(),
    avatar: user.getAvatar(),
    backgroundImage: user.getBackgroundImage(),
  };
}
