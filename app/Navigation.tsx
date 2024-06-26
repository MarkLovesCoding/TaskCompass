import Link from "next/link";
import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CompassIcon,
  KanbanIcon,
  LayoutDashboard,
  Menu,
  UsersIcon,
} from "lucide-react";

import { sessionAuth } from "@/lib/sessionAuth";
import { ModeToggle } from "./themeTogglerSwitch";
import getUserProjectsAndTeams from "@/data-access/users/get-user-full-nav.persistence";
import Logout from "./Logout";
import LogoPng from "../public/compass_small.png";

import type { ProjectDto } from "@/use-cases/project/types";
import type { TeamDto } from "@/use-cases/team/types";

const Navigation: React.FC = async () => {
  const session = await sessionAuth();
  const sessionUserId = session?.user.id;
  //move into usecase?
  // let userObject: UserDto,
  let userProjectsAndTeams: { projects: ProjectDto[]; teams: TeamDto[] };
  if (session !== null) {
    userProjectsAndTeams = await getUserProjectsAndTeams(sessionUserId!);
  } else return <div></div>;
  const { teams, projects } = userProjectsAndTeams;

  return (
    <>
      {session && (
        <header className=" fixed top-0 left-0 min-w-[100vw] flex items-center h-8 md:h-12 px-4 shrink-0 md:px-6 bg-nav-background z-50">
          <Link
            className="flex items-center gap-2 text-lg font-semibold sm:text-base mr-4"
            href="#"
          >
            {/* <CompassIcon className="w-6 h-6 md:w-10 md:h-10  fill-orange" /> */}
            <Image
              src={LogoPng}
              alt="Task Compass Logo"
              width={40}
              height={40}
            />{" "}
            <span className="text-sm md:text-base font-bold">TaskCompass</span>
            <span className="sr-only">Task Compass Project Management App</span>
          </Link>
          <nav className="font-medium flex flex-row items-center gap-5 text-sm lg:gap-6 ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative group p-1 h-7 md:p-4 md:h-10 border-none md:border-solid rounded-full flex flex-row justify-around items-center gap-3 md:gap-2 text-sm font-medium text-muted-foreground border-[1px] border-white hover:bg-primary hover:text-primary focus:bg-primary focus:text-primary transition-colors duration-200 ease-in-out"
                >
                  <Menu className="w-5 h-5 md:w-6 md:h-6 my-0 text-white fill-white group-hover:fill-background group-hover:text-background" />

                  <Avatar className="ml-auto h-6 w-6 md:h-8 md:w-8">
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
                <ModeToggle />
                <DropdownMenuSeparator />

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="flex flex-row space-x-2">
                    <UsersIcon className="w-6 h-6 mr-2" />
                    Teams
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      {teams.map((team, team_idx) => (
                        <DropdownMenuItem key={team_idx}>
                          <Link href={`/team/${team.id}`}>{team.name}</Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>

                <DropdownMenuSeparator />

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="flex flex-row space-x-2">
                    <KanbanIcon className="w-6 h-6 mr-2" />
                    Projects
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      {projects.map(
                        (project, project_idx) =>
                          !project.archived && (
                            <DropdownMenuItem key={project_idx}>
                              <Link href={`/project/${project.id}`}>
                                {project.name}
                              </Link>
                            </DropdownMenuItem>
                          )
                      )}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>

                <DropdownMenuSeparator />
                <Link href={`/dashboard/${sessionUserId}`} title="Your Profile">
                  <DropdownMenuItem className="cursor-pointer flex flex-row space-x-2">
                    <LayoutDashboard className="w-6 h-6 mr-2" />
                    Dashboard
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
