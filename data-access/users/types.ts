export type UserModelType = {
  _id: string;
  name: string;
  email: string;
  projectsAsAdmin: string[];
  projectsAsMember: string[];
  teamsAsAdmin: string[];
  teamsAsMember: string[];
  tasks: string[];
  avatar: string;
  backgroundImage: string;
};
