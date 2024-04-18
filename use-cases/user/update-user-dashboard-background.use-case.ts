import { UserEntity } from "@/entities/User";
import { GetUser, GetUserSession, UpdateUser } from "@/use-cases/user/types";
import { userToDto } from "./utils";
export async function updateUserDashboardBackgroundUseCase(
  context: {
    updateUser: UpdateUser;
    getUser: GetUserSession;
    getUserObject: GetUser;
  },
  data: {
    userId: string;
    dashboardBackgroundImage: string;
  }
) {
  const { userId } = context.getUser()!;
  if (!userId) throw new Error("User not found");
  const validatedUser = await context.getUserObject(data.userId);
  const user = new UserEntity(validatedUser);
  user.updateDashboardBackgroundImage(data.dashboardBackgroundImage);
  await context.updateUser(userToDto(user));
  //figure out how to transfer this to toast
  //error happens here
}
