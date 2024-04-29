import { TInvitedUser } from "@/entities/Team";

export type TeamModelType = {
  _id: string;
  name: string;
  projects: string[];
  users: string[];
  createdBy: string;
  backgroundImage: string;
  backgroundImageThumbnail: string;
  invitedUsers: TInvitedUser[];
};
