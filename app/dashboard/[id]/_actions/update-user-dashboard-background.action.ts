"use server";
import getUserObject from "@/data-access/users/get-user.persistence";
import getTeam from "@/data-access/teams/get-team.persistence";
import { updateTeam } from "@/data-access/teams/update-team.persistence";
import { updateUser } from "@/data-access/users/update-user.persistence";
import { updateUserDashboardBackgroundUseCase } from "@/use-cases/user/update-user-dashboard-background.use-case";
import getProject from "@/data-access/projects/get-project.persistence";
import { updateProject } from "@/data-access/projects/update-project.persistence";
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
    revalidatePath("/dashobard/[slug]/page");

    //for toasts, not yet implemented
    return { success: true };
  } catch (error: any) {
    console.error(error);
  }
}
