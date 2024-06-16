import React from "react";
import { redirect } from "next/navigation";
import { sessionAuth } from "@/lib/sessionAuth";

import HomePageComponent from "./HomePageComponent";

const Home = async () => {
  const session = await sessionAuth();
  if (session) {
    redirect(`/dashboard/${session.user.id}`);
  } else {
    return <HomePageComponent />;
  }
};
export default Home;
