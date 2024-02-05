import { UserType } from "../types/types";
export const getUsersAvailable = async (
  userId: string
): Promise<UserType[]> => {
  const res = await fetch(`/api/Projects/User/${userId}`);
  const { projects } = await res.json();
  const usersAvailable: UserType[] = [];
  for (let project of projects) {
    for (let user of project.users) {
      if (!usersAvailable.includes(user) && user._id != userId)
        usersAvailable.push(user);
    }
  }

  return usersAvailable;
};
export default getUsersAvailable;
