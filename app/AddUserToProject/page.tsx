import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import { Session } from "../types/types";
import { AddUserToProjectForm } from "../(components)/AddUserToProjectForm";

const AddUserToGroup = async (): Promise<JSX.Element> => {
  const session: Session | null = await getServerSession(options);
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/AddUserToGroup");
  }
  const userId = session.user.id;

  return (
    <div>
      <AddUserToProjectForm userId={userId} />
    </div>
  );
};

export default AddUserToGroup;
