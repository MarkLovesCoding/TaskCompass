import { UserEntity } from "@/entities/User";
import { UserDto } from "@/use-cases/user/types";

export function userToDto(user: UserEntity): UserDto {
  const userId = user.getId();
  if (!userId) throw new Error("Project id is required");
  return {
    id: user.getId(),
    name: user.getName(),
    email: user.getEmail(),
    projects: user.getProjects(),
    teams: user.getTeams(),
    tasks: user.getTasks(),
    avatar: user.getAvatar(),
  };
}
