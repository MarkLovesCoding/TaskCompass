import React from "react";
import { redirect } from "next/navigation";
import { sessionAuth } from "@/lib/sessionAuth";

import RegistrationPageComponent from "./RegistrationPageComponent";
import { Toaster } from "sonner";

const page = async () => {
  const session = await sessionAuth();
  if (session) {
    redirect(`/dashboard/${session.user.id}`);
  } else {
    return (
      <div>
        <RegistrationPageComponent />
        <Toaster />
      </div>
    );
  }
};
export default page;
