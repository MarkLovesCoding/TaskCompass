"use client";

import { useSession } from "next-auth/react";
import {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  forwardRef,
} from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import debounce from "lodash/debounce";

import { motion, useAnimation } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import LogoPng from "../public/compass.png";

import GroguCard from "../public/grogu-card.png";
import ArchiveTaskCard from "../public/archive-task-card.png";
import DashboardTeams from "../public/dashboard-teams.png";
import FullUsers from "../public/full-users.png";
import MoveTask from "../public/move-task.png";
import PriorityView from "../public/priority-view.png";
import SWCard from "../public/sw-card.png";

function interpolateColors(color1: string, color2: string, progress: number) {
  const rgba1 = color1.match(/\d+/g)!;
  const rgba2 = color2.match(/\d+/g)!;
  const result = [];
  for (let i = 0; i < rgba1.length; i++) {
    const val =
      parseInt(rgba1[i]) + (parseInt(rgba2[i]) - parseInt(rgba1[i])) * progress;
    result.push(Math.round(val));
  }
  return `rgba(${result.join(",")})`;
}

const HomePageComponent = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);
  const controls = useAnimation();

  // Cleanup

  useEffect(() => {
    // Redirect to home if the user is already signed in
    if (session) {
      //@ts-expect-error
      router.push(`/dashboard/${session!.user.id}`);
    }
  }, [session, router]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (session) {
    // Render loading screen tbd
    return <div>Loading...</div>;
  } else
    return (
      <motion.div
        className="relative transition-colors top-0 left-0 flex flex-col w-full min-h-[100vh] h-auto overflow-hidden"
        style={{ backgroundColor: calculateColor(scrollY) }}
      >
        {/* Left side (announcement or other content) */}
        {/* <div className="bg-gradient-background-dark"> */}
        <div className="absolute top-[5px] left-[20px] md:top-[20px] md:left-[40px] flex flex-row h-[100px] justify-center items-center">
          <Image
            src={LogoPng}
            className="w-[40px] h-[40px] md:w-[80px] md:h-[80px]"
            alt="Task Compass Logo"
            // width={80}
            // height={80}
          />{" "}
          <h1 className="text-base md:text-2xl font-bold">TaskCompass</h1>
        </div>
        <div className=" absolute top-[36px] right-[20px] md:top-[50px] md:right-[50px] flex justify-center">
          <Link href="/registration">
            <Button className=" hover:border-white border-2">
              Register / Sign-In
            </Button>
          </Link>
        </div>
        <div className="   self-center flex flex-col  text-center w-full justify-center items-center h-[80vh] mt-[20vh] min-h-[300px] ">
          <h2 className="  bg-gradient-to-r  from-orange-500 via-pink-500 to-purple-500 text-transparent bg-clip-text max-w-[700px] sm:max-w-60%  text-5xl leading-tight tracking-lighter md:text-6xl lg:leading-[1.1] text-orange-500 font-bold p-8 pb-4">
            {" Simplifying Project Management"}
          </h2>

          <h3 className="text-lg text-muted-foreground sm:text-xl p-8 pt-4">
            TaskCompass is here to help you navigate your next project!
          </h3>
        </div>
        {/* </div> */}

        <div className="mb-10">
          <FeatureSection
            title={"Visualize, Categorize, Prioritize"}
            description={
              "Fluid Drag and Drop KanBan-style. View by Status, Priority, or Categories."
            }
            side="right"
          >
            <Image
              className=" flex top-[75px] -left-16 sm:-left-16 sm:top-[40%] w-[300px] sm:w-[320px] lg:w-[340px]"
              src={PriorityView}
              alt="dashboard-image-1"
            />
          </FeatureSection>

          <FeatureSection
            title={"Create, Edit, Complete"}
            description={
              "Create Tasks with Due Dates, Descriptions, Assignees, and more."
            }
            side="left"
          >
            <Image
              className=" flex top-10 -right-16 md:-right-16 md:top-[50%] w-[200px] sm:w-[250px] lg:w-[280px]"
              src={MoveTask}
              alt="dashboard-image-1"
            />
            <Image
              className=" flex top-10 -left-16 md:-left-16 md:top-[25%] w-[200px] sm:w-[250px] lg:w-[280px]"
              src={SWCard}
              alt="dashboard-image-1"
            />
          </FeatureSection>

          <FeatureSection
            title={"Manage, Archive, Retrieve"}
            description={
              "Accessible Personal, Team, and Project Dashboards. Easy Team and Project cleanup with archiving/retrival."
            }
            side="right"
          >
            <Image
              className=" flex top-10 -right-16 md:-right-16 md:top-[50%] w-[220px] sm:w-[250px] lg:w-[280px]"
              src={ArchiveTaskCard}
              alt="dashboard-image-1"
            />
            <Image
              className=" flex top-10 -left-16 md:-left-16 md:top-[25%] w-[220px] sm:w-[250px] lg:w-[280px]"
              src={DashboardTeams}
              alt="dashboard-image-1"
            />
          </FeatureSection>
          <FeatureSection
            title={"Build, Administrate, Assign"}
            description={
              "Form effective teams with appropriate roles and permissions. Manage Project Users. Assign Tasks."
            }
            side="left"
          >
            <div className="flex flex-row justify-between items-end first-line:pb-8">
              <Image
                className=" flex top-10 -left-16 md:-left-16 md:top-[25%] pb-2 w-[160px] sm:w-[170px] lg:w-[190px]"
                src={GroguCard}
                alt="dashboard-image-1"
                // width={400}
                // height={400}
              />
              <Image
                className=" flex top-10 -right-16 md:-right-16 md:top-[50%] w-[200px] sm:w-[300px] lg:w-[320px]"
                src={FullUsers}
                alt="dashboard-image-1"
                // width={400}
                // height={400}
              />
            </div>
          </FeatureSection>
        </div>

        <div className="  bg-black border-t-accent border-t self-center flex flex-row  text-center w-full justify-center items-center h-[50vh] min-h-[150px] ">
          <div className="flex min-w-[50%] flex-col">
            <h2 className="text-2xl text-left">Task Compass</h2>
            <h2 className="text-lg text-left">
              <Link href={`https://www.markhalstead.dev`}>
                markhalstead.dev
              </Link>{" "}
              © 2024
            </h2>
          </div>
          {/* <div className="flex min-w-[50%]">
            <h3 className="text-base text-muted-foreground sm:text-xl p-8 pt-4">
              Get in Touch.
            </h3>
          </div> */}
        </div>
      </motion.div>
    );
};
interface FeatureSectionProps {
  title: string;
  description: string;
  side: "right" | "left";
  children: React.ReactNode;
}
const FeatureSection = forwardRef<HTMLDivElement, FeatureSectionProps>(
  ({ title, description, side, children }, ref) => (
    <div
      ref={ref}
      className={`  ${
        side === "left" ? "sm:flex-row " : "sm:flex-row-reverse "
      } self-center flex flex-col border-t border-t-accent overflow-clip  text-center w-full justify-end items-end h-[80vh] sm:h-[80vh] lg:h-[80vh]  min-h-[300px] `}
    >
      <div className="flex-col self-center items-center flex w-full sm:w-[50%] lg:w-[65%] m-12 md:mr-0  md:m-12">
        <div className="  lg:w-[40vw] mt-12 sm:mt-0 sm:[70vw] w-full px-[10%] sm:px-[0%]">
          <h2 className="text-2xl"> {title} </h2>
          <h3 className="text-base text-muted-foreground sm:text-xl p-8 pb-0 pt-4">
            {description}
          </h3>
        </div>
      </div>
      <div className="flex relative h-[250px]  justify-end flex-col  w-full sm:w-[50%]  items-center md:p-0">
        <div className="flex flex-row justify-evenly items-end">
          <div
            className={`flex flex-row justify-evenly items-end first-line:pb-8`}
          >
            <div
              className={`flex flex-row ${
                side == "left" ? "justify-evenly" : "justify-end"
              } items-end`}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
);

FeatureSection.displayName = "FeatureSection";

export default HomePageComponent;

function calculateColor(scrollY: number) {
  const triggerPoints = [0, 100, 180, 260, 340]; // Adjust trigger points in viewport height (vh)
  // const colors = [
  //   "rgba(14,37,46,1)",
  //   "rgba(9,75,103,1)",
  //   "rgba(14,37,46,1)",
  //   "rgba(9,75,103,1)",
  //   "rgba(14,37,46,1)",
  //   "rgba(9,75,103,1)",
  // ];
  const colors = [
    "rgba(14,37,46,1)",
    "rgba(0,0,0,1)",
    "rgba(14,37,46,1)",
    "rgba(0,0,0,1)",

    "rgba(14,37,46,1)",
    // "rgba(0,0,0,1)",
  ];
  for (let i = 0; i < triggerPoints.length - 1; i++) {
    if (
      scrollY >= (triggerPoints[i] * window.innerHeight) / 100 &&
      scrollY < (triggerPoints[i + 1] * window.innerHeight) / 100
    ) {
      const progress =
        (scrollY - (triggerPoints[i] * window.innerHeight) / 100) /
        (((triggerPoints[i + 1] - triggerPoints[i]) * window.innerHeight) /
          100);
      const currentColor = colors[i];
      const nextColor = colors[i + 1];
      return interpolateColors(currentColor, nextColor, progress);
    }
  }
  return colors[0]; // Default color
}
