export type TaskType = {
  title: string;
  description: string;
  priority: number;
  progress: number;
  status: string;
  category: string;
  createdAt: Date;
  assignedTo: string;
  project: string;
  _id?: number | Object | string;
};
export type ProjectType = {
  name: string;
  users: string[];
  tasks: string[];
  createdAt: Date;
  password?: string;
  isDefault: boolean;
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
  password: string;
  role: string;
  projects: string[];
  tasks: string[];
  connections: string[];
  createdAt: Date;
  id: string;
  firstLogIn?: boolean;
};
export type ConnectionType = {
  userId: string;
  // id: Number,
  name: string;
  email: string;

  projects: string[];
  tasks: string[];
};
export type Session = {
  user: {
    id: string;
    name: string;
    email: string;
    image: undefined;
    role: string;
  };
};
