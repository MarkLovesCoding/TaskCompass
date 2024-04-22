import { UserEntity, UserEntityValidationError } from "@/entities/User";
import { GetUser, GetUserSession, UpdateUser } from "@/use-cases/user/types";
import { userToDto } from "./utils";
import { AuthenticationError, ValidationError } from "../utils";

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
  if (!retrieveUser) throw new Error("User not found");

  try {
    const validatedUser = new UserEntity(retrieveUser);
    validatedUser.updateDashboardBackgroundImage(data.dashboardBackgroundImage);
    await context.updateUser(userToDto(validatedUser));
  } catch (err) {
    const error = err as UserEntityValidationError;
    throw new ValidationError(error.getErrors());
  }
}
