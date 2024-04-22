import React from "react";
import RegistrationPageComponent from "./RegistrationPageComponent";
import { Toaster } from "sonner";
const page = () => {
  return (
    <div>
      <RegistrationPageComponent />
      <Toaster />
    </div>
  );
};

export default page;
