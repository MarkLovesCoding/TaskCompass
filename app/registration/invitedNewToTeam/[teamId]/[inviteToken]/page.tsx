import React from "react";
import InvitedNewComponent from "./InvitedNewUserToTeamComponent";
import { Toaster } from "sonner";
// import { validateInviteTokenAction } from "@/app/registration/invitedToTeam/[teamId]/[inviteToken]/_actions/validate-token-set-up-user.action";

type ParamsType = {
  params: { teamId: string; inviteToken: string };
};

const page = async ({ params }: ParamsType) => {
  // try {
  //   await validateInviteTokenAction({
  //     teamId: params.teamId,
  //     inviteToken: params.inviteToken,
  //   });
  // } catch (error) {
  //   console.error(error);
  // }

  return (
    <div>
      <InvitedNewComponent
        teamId={params.teamId}
        inviteToken={params.inviteToken}
      />
      <Toaster />
    </div>
  );
};

export default page;
