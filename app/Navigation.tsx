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
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "./themeToggler";
import getUserProjectsAndTeams from "@/data-access/users/get-user-full-nav.persistence";
import { sessionAuth } from "@/lib/sessionAuth";
import { ProjectDto } from "@/use-cases/project/types";
import { TeamDto } from "@/use-cases/team/types";
import { UserDto } from "@/use-cases/user/types";
import {
  CompassIcon,
  KanbanIcon,
  LayoutDashboard,
  Menu,
  UsersIcon,
} from "lucide-react";

const Navigation: React.FC = async () => {
  const session = await sessionAuth();
  const sessionUserId = session?.user.id;
  console.log("session", session);
  //move into usecase?
  let userObject: UserDto,
    userProjectsAndTeams: { projects: ProjectDto[]; teams: TeamDto[] };
  if (session) {
    userProjectsAndTeams = await getUserProjectsAndTeams(sessionUserId!);
  } else return <div></div>;
  const { teams, projects } = userProjectsAndTeams;

  return (
    <>
      {session && (
        <header className=" fixed top-0 left-0 min-w-[100vw] flex items-center h-12 px-4 border-b shrink-0 md:px-6 bg-nav-background z-50">
          <Link
            className="flex items-center gap-2 text-lg font-semibold sm:text-base mr-4"
            href="#"
          >
            <CompassIcon className="w-10 h-10 fill-primary" />
            <span className="font-bold">TaskCompass</span>
            <span className="sr-only">Task Compass Project Management App</span>
          </Link>
          <nav className="font-medium flex flex-row items-center gap-5 text-sm lg:gap-6 ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative group  p-4 rounded-full flex flex-row justify-around items-center gap-2 text-sm font-medium text-muted-foreground border-solid border-[1px] border-white hover:bg-secondary-foreground hover:text-primary focus:bg-primary focus:text-primary transition-colors duration-200 ease-in-out"
                >
                  <Menu className="w-6 h-6 text-white fill-white group-hover:fill-background group-hover:text-background" />

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
                      {projects.map((project, project_idx) => (
                        <DropdownMenuItem key={project_idx}>
                          <Link href={`/project/${project.id}`}>
                            {project.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
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
