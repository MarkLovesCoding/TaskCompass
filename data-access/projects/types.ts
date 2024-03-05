export type ProjectModelType = {
  _id: string;
  name: string;
  description: string;
  users: string[];
  tasks: string[];
  team: string;
  createdBy: string;
  archived: boolean;
  listsNextAvailable: object;
};
