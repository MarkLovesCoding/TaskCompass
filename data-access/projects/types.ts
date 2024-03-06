export type ProjectModelType = {
  _id: string;
  name: string;
  description: string;
  users: string[];
  tasks: string[];
  team: string;
  createdBy: string;
  archived: boolean;
  listsNextAvailable: ListsNextAvailable;
};
export type ListsNextAvailable = Record<string, Record<string, number>>;
