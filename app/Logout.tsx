"use client";
import React from "react";
import { signOut } from "next-auth/react";
const handleSignOut = async () => {
  await signOut({ redirect: true, callbackUrl: "/" }); // Set the desired callbackUrl
};
const Logout = () => {
  return (
    <div className="cursor-pointer w-full" onClick={handleSignOut}>
      <p>Sign Out</p>
    </div>
  );
};

export default Logout;
