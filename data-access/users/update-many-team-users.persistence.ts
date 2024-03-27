import "server-only";

import connectDB from "@/db/connectDB";
import User from "@/db/(models)/User";

async function updateManyTeamUsers(
  projectId: string,
  initialUsers: string[],
  updatedUsers: string[]
): Promise<void> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }

  try {
    const addedUsers = updatedUsers.filter(
      (member) => !initialUsers.includes(member)
    );
    const removedUsers = initialUsers.filter(
      (member) => !updatedUsers.includes(member)
    );
    for (const user of removedUsers) {
      User.findByIdAndUpdate(user, { $pull: { teamsAsAdmin: projectId } });
    }
    for (const user of addedUsers) {
      User.findByIdAndUpdate(user, { $push: { teamsAsAdmin: projectId } });
    }
  } catch (error) {
    throw new Error("Error updating Project users" + error);
  }
}
export default updateManyTeamUsers;
