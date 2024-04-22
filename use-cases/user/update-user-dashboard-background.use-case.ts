import { UserEntity } from "@/entities/User";
import { GetUser, GetUserSession, UpdateUser } from "@/use-cases/user/types";
import { userToDto } from "./utils";
import { AuthenticationError } from "../utils";

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
  const user = context.getUser()!;
  if (!user) throw new AuthenticationError();

  const retrieveUser = await context.getUserObject(data.userId);
  const validatedUser = new UserEntity(retrieveUser);
  validatedUser.updateDashboardBackgroundImage(data.dashboardBackgroundImage);
  await context.updateUser(userToDto(validatedUser));
}
