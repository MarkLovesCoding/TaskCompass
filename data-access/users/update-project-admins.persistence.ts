import "server-only";

import connectDB from "@/db/connectDB";

import User from "@/db/(models)/User";

async function updateProjectAdmins(
  projectId: string,
  initialAdmins: string[],
  updatedAdmins: string[]
): Promise<void> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }

  // const userId = user.id;
  try {
    // Find the user by ID
    const addedAdmins = updatedAdmins.filter(
      (member) => !initialAdmins.includes(member)
    );
    const removedAdmins = initialAdmins.filter(
      (member) => !updatedAdmins.includes(member)
    );
    for (const user of removedAdmins) {
      User.findByIdAndUpdate(user, { $pull: { projectsAsAdmin: projectId } });
    }
    for (const user of addedAdmins) {
      User.findByIdAndUpdate(user, { $push: { projectsAsAdmin: projectId } });
    }
  } catch (error) {
    throw new Error("Error updating Project users" + error);
  }
}
export default updateProjectAdmins;
