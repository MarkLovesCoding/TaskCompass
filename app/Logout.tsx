"use client";
import React from "react";
import { signOut } from "next-auth/react";

import { toast } from "sonner";

const handleSignOut = async () => {
  try {
    await signOut({ redirect: true, callbackUrl: "/" }); // Set the desired callbackUrl
    toast.success("Signing out...");
  } catch (error) {
    console.error(error);
    toast.error("Error Signing Out");
  }
};
const Logout = () => {
  return (
    <div className="cursor-pointer w-full" onClick={handleSignOut}>
      <p>Sign Out</p>
    </div>
  );
};

export default Logout;
