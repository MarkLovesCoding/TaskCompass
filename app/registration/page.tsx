import React from "react";

import { Toaster } from "sonner";
import RegistrationPageComponent from "./RegistrationPageComponent";

const page = () => {
  return (
    <div>
      <RegistrationPageComponent />
      <Toaster />
    </div>
  );
};

export default page;
