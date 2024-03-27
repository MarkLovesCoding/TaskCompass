import "server-only";

import connectDB from "@/db/connectDB";
import User from "@/db/(models)/User";

async function updateManyTeamMembers(
  projectId: string,
  initialMembers: string[],
  updatedMembers: string[]
): Promise<void> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }

  try {
    const addedMembers = updatedMembers.filter(
      (member) => !initialMembers.includes(member)
    );
    const removedMembers = initialMembers.filter(
      (member) => !updatedMembers.includes(member)
    );
    for (const user of removedMembers) {
      User.findByIdAndUpdate(user, { $pull: { teamsAsMember: projectId } });
    }
    for (const user of addedMembers) {
      User.findByIdAndUpdate(user, { $push: { teamsAsMember: projectId } });
    }
  } catch (error) {
    throw new Error("Error updating Project users" + error);
  }
}
export default updateManyTeamMembers;
