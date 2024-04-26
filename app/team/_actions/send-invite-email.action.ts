"use server";
import { revalidatePath } from "next/cache";

import { getUserFromSession } from "@/lib/sessionAuth";

import { getTeam } from "@/data-access/teams/get-team.persistence";
import { getUserByEmail } from "@/data-access/users/get-user-by-email.persistence";
import { updateTeam } from "@/data-access/teams/update-team.persistence";

import { sendInviteEmailUseCase } from "@/use-cases/team/send-invite-email.use-case";
import { ValidationError } from "@/use-cases/utils";
import type { TeamDto } from "@/use-cases/team/types";
import type { UserDto } from "@/use-cases/user/types";

type Form = {
  email: string;
  teamId: string;
  inviterName: string;
  role: "member" | "admin";
};

export async function sendInviteEmailAction(form: Form) {
  const { getUser } = await getUserFromSession();

  try {
    await sendInviteEmailUseCase(
      {
        getUserByEmail,
        getUser,
        getTeam,
        updateTeam,
      },
      {
        email: form.email,
        teamId: form.teamId,
        inviterName: form.inviterName,
        role: form.role,
      }
    );
    // revalidatePath(`/team/${teamId}`);

    // return { form: { name: "" } };
  } catch (err) {
    const error = err as Error;
    if (error instanceof ValidationError) {
      throw new ValidationError(error.getErrors());
    } else {
      throw new Error(error.message);
    }
  }
}
