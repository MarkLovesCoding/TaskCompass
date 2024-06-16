import HomePageComponent from "./HomePageComponent";
import { sessionAuth } from "@/lib/sessionAuth";
import { redirect } from "next/navigation";

const Home = async () => {
  const session = await sessionAuth();
  if (session) {
    redirect(`/dashboard/${session.user.id}`);
  } else {
    return <HomePageComponent />;
  }
};
export default Home;
