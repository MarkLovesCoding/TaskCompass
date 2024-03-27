export type TaskModelType = {
  _id: string;
  name: string;
  description: string;
  project: string;
  assignees: string[];
  dueDate: Date;
  startDate: Date;
  category: string;
  priority: string;
  status: string;
  archived: boolean;
  createdBy: string;
};
export type OrderInLists = Record<string, [string, number]>;
