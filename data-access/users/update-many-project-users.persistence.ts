import "server-only";

import connectDB from "@/db/connectDB";

import User from "@/db/(models)/User";

async function updateManyProjectUsers(
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
      (user) => !initialUsers.includes(user)
    );
    const removedUsers = initialUsers.filter(
      (user) => !updatedUsers.includes(user)
    );
    for (const user of removedUsers) {
      User.findByIdAndUpdate(user, {
        $pull: { projectsAsMember: projectId, projectsAsAdmin: projectId },
      });
    }
    for (const user of addedUsers) {
      User.findByIdAndUpdate(user, { $push: { projectsAsMember: projectId } });
    }
  } catch (error) {
    throw new Error("Error updating Project users" + error);
  }
}
export default updateManyProjectUsers;
