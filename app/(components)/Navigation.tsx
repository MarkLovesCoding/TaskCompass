import Link from "next/link";
import Logout from "./Logout";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import getUserProjectsAsAdmin from "@/data-access/projects/get-user-projects-as-admin";
import getUserProjectsAsMember from "@/data-access/projects/get-user-projects-as-member";
import getUser from "@/data-access/users/get-user.persistence";
import getUserTeamsAsMember from "@/data-access/teams/get-user-teams-as-member";
import getUserTeamsAsAdmin from "@/data-access/teams/get-user-teams-as-admin";
import { sessionAuth } from "@/lib/sessionAuth";
import { ProjectDto } from "@/use-cases/project/types";
import { TeamDto } from "@/use-cases/team/types";
import { UserDto } from "@/use-cases/user/types";

const Navigation: React.FC = async () => {
  const session = await sessionAuth();
  // const session = await getServerSession(options);
  const sessionUserId = session?.user.id;
  console.log("session", session);
  //move into usecase?
  let userObject: UserDto,
    userProjectsAsAdmin: ProjectDto[],
    userProjectsAsMember: ProjectDto[],
    userTeamsAsAdmin: TeamDto[],
    userTeamsAsMember: TeamDto[];
  if (session) {
    userObject = await getUser(sessionUserId!);
    userProjectsAsAdmin = await getUserProjectsAsAdmin(userObject);
    userProjectsAsMember = await getUserProjectsAsMember(userObject);
    userTeamsAsAdmin = await getUserTeamsAsAdmin(userObject);
    userTeamsAsMember = await getUserTeamsAsMember(userObject);
  }

  return (
    <>
      {session && (
        <header className="flex items-center h-16 px-4 border-b shrink-0 md:px-6">
          <Link
            className="flex items-center gap-2 text-lg font-semibold sm:text-base mr-4"
            href="#"
          >
            <span className="font-bold">TaskCompass</span>
            <span className="sr-only">Task Compass Project Management App</span>
          </Link>
          <nav className="font-medium flex flex-row items-center gap-5 text-sm lg:gap-6 ml-auto">
            {
              <div className=" sm:hidden">
                <DropdownMenu>
                  {/* <DropdownMenuTrigger asChild> */}
                  {/* <Link
                      className="m-4 font-bold bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 py-2 px-4 rounded-lg"
                      href="#"
                    >
                      ...
                    </Link> */}
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost">...</Button>
                  </DropdownMenuTrigger>
                  {/* </DropdownMenuTrigger> */}
                  <DropdownMenuContent>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>Teams</DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          {/* <DropdownMenuContent align="start"> */}
                          {userTeamsAsAdmin!.map((team, team_idx) => (
                            <DropdownMenuItem key={team_idx}>
                              <Link href={`/TEAMS-CLEAN/${team.id}`}>
                                {team.name}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                          <DropdownMenuSeparator />
                          {userTeamsAsMember!.map((team, team_idx) => (
                            <DropdownMenuItem key={team_idx}>
                              <Link href={`/TEAMS-CLEAN/${team.id}`}>
                                {team.name}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                          {/* <DropdownMenuItem>Team 1</DropdownMenuItem>
                          
                          {/* </DropdownMenuContent> */}
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator />

                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>Projects</DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          {/* <DropdownMenuContent align="start"> */}
                          {userProjectsAsAdmin!.map((project, project_idx) => (
                            <DropdownMenuItem key={project_idx}>
                              <Link href={`/PROJECTS-CLEAN/${project.id}`}>
                                {project.name}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                          <DropdownMenuSeparator />
                          {userProjectsAsMember!.map((project, project_idx) => (
                            <DropdownMenuItem key={project_idx}>
                              <Link href={`/PROJECTS-CLEAN/${project.id}`}>
                                {project.name}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                          {/* <DropdownMenuItem>Project 1</DropdownMenuItem>
                <DropdownMenuItem>Project 2</DropdownMenuItem>
                <DropdownMenuItem>Project 3</DropdownMenuItem> */}
                          {/* </DropdownMenuContent> */}
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  </DropdownMenuContent>
                </DropdownMenu>
                {/* <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Link
                      className="m-4 font-bold bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 py-2 px-4 rounded-lg"
                      href="#"
                    >
                      Projects
                    </Link>
                  </DropdownMenuTrigger>
                </DropdownMenu> */}
                {/* <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Link
                      className="text-gray-500 dark:text-gray-400 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 py-2 px-4 rounded-lg"
                      href="#"
                    >
                      Teams
                    </Link>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {userTeams?.map((team, team_idx) => (
                      <DropdownMenuItem key={team_idx}>
                        <Link href={`/TEAMS-CLEAN/${team.id}`}>
                          {team.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu> */}
              </div>
            }
            {
              <div className="hidden sm:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Link
                      className="m-4 font-bold bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 py-2 px-4 rounded-lg"
                      href="#"
                    >
                      Projects
                    </Link>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {userProjectsAsAdmin!.map((project, project_idx) => (
                      <DropdownMenuItem key={project_idx}>
                        <Link href={`/PROJECTS-CLEAN/${project.id}`}>
                          {project.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    {userProjectsAsMember! &&
                      userProjectsAsMember.length > 0 && (
                        <DropdownMenuSeparator />
                      )}
                    {userProjectsAsMember!.map((project, project_idx) => (
                      <DropdownMenuItem key={project_idx}>
                        <Link href={`/PROJECTS-CLEAN/${project.id}`}>
                          {project.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    {/* <DropdownMenuItem>Project 1</DropdownMenuItem>
                <DropdownMenuItem>Project 2</DropdownMenuItem>
                <DropdownMenuItem>Project 3</DropdownMenuItem> */}
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Link
                      className="text-gray-500 dark:text-gray-400 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 py-2 px-4 rounded-lg"
                      href="#"
                    >
                      Teams
                    </Link>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {userTeamsAsAdmin!.map((team, team_idx) => (
                      <DropdownMenuItem key={team_idx}>
                        <Link href={`/TEAMS-CLEAN/${team.id}`}>
                          {team.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    {userTeamsAsMember! && userTeamsAsMember?.length > 0 && (
                      <DropdownMenuSeparator />
                    )}
                    {userTeamsAsMember!.map((team, team_idx) => (
                      <DropdownMenuItem key={team_idx}>
                        <Link href={`/TEAMS-CLEAN/${team.id}`}>
                          {team.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            }

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="ml-auto h-8 w-8">
                    <AvatarImage
                      src="/avatars/01.png"
                      alt={session.user.email}
                    />
                    <AvatarFallback>
                      {session.user.name[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session.user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link
                  href={`/USERPAGE-CLEAN/${sessionUserId}`}
                  title="Your Profile"
                >
                  <DropdownMenuItem className="cursor-pointer ">
                    Profile
                  </DropdownMenuItem>
                </Link>

                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Logout />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </header>
      )}
    </>
  );
};

export default Navigation;
