"use client";
import React from "react";
import { signOut } from "next-auth/react";
const handleSignOut = async () => {
  await signOut({ redirect: true, callbackUrl: "/" }); // Set the desired callbackUrl
};
const Logout = () => {
  return (
    <div className="cursor-pointer" onClick={handleSignOut}>
      <p>Logout</p>
    </div>
  );
};

export default Logout;
