export type ProjectModelType = {
  _id: string;
  name: string;
  description: string;
  admins: string[];
  members: string[];
  tasks: string[];
  team: string;
  archived: boolean;
};
