import "server-only";

import connectDB from "@/db/connectDB";
import User from "@/db/(models)/User";

async function updateManyTeamUsers(
  teamId: string,
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
      User.findByIdAndUpdate(user, { $pull: { teamsAsAdmin: teamId } });
    }
    for (const user of addedUsers) {
      User.findByIdAndUpdate(user, { $push: { teamsAsAdmin: teamId } });
    }
  } catch (error) {
    throw new Error("Error updating team users" + error);
  }
}
export default updateManyTeamUsers;
