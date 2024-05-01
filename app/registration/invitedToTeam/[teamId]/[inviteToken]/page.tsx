import React from "react";

import InvitedUserToTeamComponent from "./InvitedUserToTeamComponent";
import { Toaster } from "sonner";
import { validateTokenSetUpUserAction } from "./_actions/validate-token-set-up-user.action";

type ParamsType = {
  params: {
    teamId: string;
    inviteToken: string;
  };
};
const page = async ({ params }: ParamsType) => {
  let err = false;
  let teamName = "";
  const { teamId, inviteToken } = params;
  try {
    teamName = await validateTokenSetUpUserAction(teamId, inviteToken);
    err = false;
  } catch (error) {
    err = true;
  }
  console.log("params", params);
  console.log("teamId", teamId);
  console.log("inviteToken", inviteToken);
  console.log("teamName", teamName);
  console.log("err", err);
  return (
    <div>
      <InvitedUserToTeamComponent teamName={teamName} errStatus={err} />
      <Toaster />
    </div>
  );
};

export default page;
