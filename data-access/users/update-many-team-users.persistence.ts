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
      await User.findByIdAndUpdate(user, {
        $pull: {
          teamsAsMember: teamId,
          teamsAsAdmin: teamId,
        },
      });
    }
    for (const user of addedUsers) {
      await User.findByIdAndUpdate(user, { $push: { teamsAsMember: teamId } });
    }
  } catch (error) {
    throw new Error("Error updating team users" + error);
  }
}
export default updateManyTeamUsers;
