"use server";
import getUserObject from "@/data-access/users/get-user.persistence";
import { updateUser } from "@/data-access/users/update-user.persistence";
import { updateUserDashboardBackgroundUseCase } from "@/use-cases/user/update-user-dashboard-background.use-case";
import { revalidatePath } from "next/cache";
import { getUserFromSession } from "@/lib/sessionAuth";
export async function updateUserDashboardBackgroundAction(
  userId: string,
  dashboardBackgroundImage: string
) {
  const { getUser } = await getUserFromSession();
  try {
    await updateUserDashboardBackgroundUseCase(
      {
        updateUser,
        getUser,
        getUserObject,
      },
      {
        userId: userId,
        dashboardBackgroundImage: dashboardBackgroundImage,
      }
    );
    revalidatePath(`/dashboard/${userId}`);

    return { success: true };
  } catch (error: any) {
    console.error(error);
  }
}
