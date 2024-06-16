import React from "react";

import { Toaster } from "sonner";
import RegistrationPageComponent from "./RegistrationPageComponent";

import { sessionAuth } from "@/lib/sessionAuth";
import { redirect } from "next/navigation";

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
