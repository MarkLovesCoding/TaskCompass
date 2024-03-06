export type TaskType = {
  name: string;
  description: string;
  priority: string;
  category: string;
  status: string;
  assignees: string[];
  dueDate?: number;
  startDate: number;
  project: string;
  label: string;
  orderInLists: object;
  _id?: number | Object | string;
};
export type ProjectType = {
  name: string;
  description: string;
  users: string[];
  tasks: string[];
  listsNextAvailable: object;
  _id?: number | Object | string;
};
export type ParamsType = {
  id: string;
};
export type UserType = {
  _id?: number | Object;
  // id: Number,
  name: string;
  email: string;
  password?: string;
  avatar: string;
  projectsAsAdmin: string[];
  projectsAsMember: string[];
  teamsAsAdmin: string[];
  teamsAsMember: string[];
  tasks: string[];
  createdAt: Date;
  id?: string;
};
// export type ConnectionType = {
//   userId: string;
//   // id: Number,
//   name: string;
//   email: string;

//   projects: string[];
//   tasks: string[];
// };
export type Session = {
  user: {
    id: string;
    name: string;
    email: string;
    image: undefined;
    role: string;
  };
};
export type TeamType = {
  name: string;
  users: string[];
  projects: string[];
  _id?: number | Object | string;
};
