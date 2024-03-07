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
  columnOrder: ColumnOrder;
};
export type ListsNextAvailable = Record<string, Record<string, number>>;
export type ColumnOrder = Record<string, string[]>;
