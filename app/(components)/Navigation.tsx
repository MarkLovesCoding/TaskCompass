import Link from "next/link";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Logout from "./Logout";
import {
  faFolder,
  faPlus,
  faPerson,
  faPersonCirclePlus,
  faTicket,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { faUserAlt } from "@fortawesome/free-solid-svg-icons/faUserAlt";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
const Navigation: React.FC = async () => {
  const session = await getServerSession(options);
  const sessionUserId = session?.user.id;

  return (
    <>
      {session && (
        <header className="bg-opacity-10 bg-slate-300">
          <nav className="flex justify-between items-center w-full px-10 py-4">
            <div className="flex gap-10">
              <div className="flex items-center space-x-4">
                <Link href="/TaskPage/new" title="Create New Task">
                  <FontAwesomeIcon icon={faPlus} className="icon" />
                </Link>

                <Link href={`/Tasks/User/${sessionUserId}`} title="Your Tasks">
                  <p> Tasks</p>
                </Link>
                <Link
                  href={`/Projects/User/${sessionUserId}`}
                  title="View Your Projects"
                >
                  <p> Projects</p>
                </Link>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
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
                {/* <DropdownMenuGroup> */}
                <DropdownMenuItem>
                  <Link
                    href={`/UserPage/${sessionUserId}`}
                    title="Your Profile"
                  >
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href={`/TaskPage/new`} title="AddConnection">
                    Create New Task
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href={`/CreateProject/${sessionUserId}`}
                    title="Create New Project"
                  >
                    Create New Project
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={`/AddConnection/`} title="AddConnection">
                    Add Connection
                  </Link>
                </DropdownMenuItem>
                {/* </DropdownMenuProject> */}
                <DropdownMenuSeparator />{" "}
                <DropdownMenuItem>
                  <Link
                    href={`/Tasks/User/${sessionUserId}`}
                    title="Your Tasks"
                  >
                    Tasks
                  </Link>
                </DropdownMenuItem>{" "}
                <DropdownMenuItem>
                  <Link
                    href={`/Projects/User/${sessionUserId}`}
                    title="View Your Projects"
                  >
                    Projects
                  </Link>
                </DropdownMenuItem>
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
