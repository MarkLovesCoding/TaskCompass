import React from "react";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import getProject from "@/data-access/projects/get-project";
import { ProjectPage } from "@/components/component/project-page";
const tempData = {
  availableAssignees: [
    {
      _id: "6595dfb779f96caa40686372",
      name: "Mark Halstead",
      email: "markdavidjameshalstead@gmail.com",
      role: "Google User",
      projects: ["6595dfb779f96caa40686370", "6595fc9679f96caa406864aa"],
      tasks: ["6595f8dc79f96caa406863fc"],
      connections: [],
      createdAt: "2024-01-03T22:29:11.488Z",
      updatedAt: "2024-01-04T00:32:22.698Z",
      __v: 0,
    },
  ],
};

type Session = {
  user: {
    id: string;
    name: string;
    email: string;
    image: undefined;
    role: string;
  };
};
type ParamsType = {
  id: string;
};

const Projects = async ({ params }: { params: ParamsType }) => {
  console.log("Params: ", params);

  const session: Session | null = await getServerSession(options);
  if (!session) {
    redirect(`/api/auth/signin?callbackUrl=/Projects/${params.id}`);
  }
  // console.log("Sessiondata: " + JSON.stringify(session?.user));
  const projectIdForProjectFiltering = params.id;
  console.log(projectIdForProjectFiltering);
  // const userConnections = await getConnectionsUsers(session.user.id);
  // const userConnections = tempData.availableAssignees;
  const project = await getProject(projectIdForProjectFiltering);

  // console.log("getuserConnections", userConnections);
  if (!project) {
    return <p>No project found.</p>;
  }

  return (
    <div className="p-5 flex justify-center flex-col items-center">
      {/* <h1 className="pt-4 pb-10">Your projects</h1> */}

      <ProjectPage project={project} />
    </div>
  );
};

export default Projects;
