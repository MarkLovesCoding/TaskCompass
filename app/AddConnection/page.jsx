import AddConnectionForm from "@/app/(components)/AddConnectionForm";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
// import type { JSX } from "react"; // Import JSX type
// import { Session } from "../types/types";

const AddConnection = async () => {
  const session = await getServerSession(options);
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/AddConnection");
  }
  const userId = session.user.id;

  return (
    <>
      <div>
        <h1>Add Connection</h1>
      </div>
      <AddConnectionForm userId={userId} />
    </>
  );
};
export default AddConnection;
