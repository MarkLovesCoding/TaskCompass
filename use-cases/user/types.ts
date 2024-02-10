export type UserDto = {
  id: string;
  name: string;
  email?: string;
  projects: string[];
  teams: string[];
  tasks: string[];
  avatar: string;
};
