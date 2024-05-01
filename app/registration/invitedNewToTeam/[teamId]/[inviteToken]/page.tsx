import { Toaster } from "sonner";
import InvitedNewUserToTeamComponent from "./InvitedNewUserToTeamComponent";
import { validateTokenInvitedNewUserAction } from "./_actions/_actions/validate-token-invited-new-user.action";

import type { TInvitedUser } from "@/entities/Team";

type ParamsType = {
  params: { teamId: string; inviteToken: string };
};
const page = async ({ params }: ParamsType) => {
  const { teamId, inviteToken } = params;
  let invitedUser: TInvitedUser | null;
  try {
    invitedUser = await validateTokenInvitedNewUserAction(teamId, inviteToken);

    return (
      <div>
        <InvitedNewUserToTeamComponent
          invitedUser={invitedUser}
          errState={false}
        />
        <Toaster />
      </div>
    );
  } catch (error) {
    <div>
      <InvitedNewUserToTeamComponent invitedUser={null} errState={true} />
      <Toaster />
    </div>;
    console.error(error);
  }
};

export default page;
