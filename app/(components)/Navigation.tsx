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
        // <header className="flex items-center h-16 px-4 border-b shrink-0 md:px-6">
        //   <Link
        //     className="flex items-center gap-2 text-lg font-semibold sm:text-base mr-4"
        //     href="#"
        //   >
        //     <span className="font-bold">BrandName</span>
        //     <span className="sr-only">Acme Inc</span>
        //   </Link>
        //   <nav className="font-medium sm:flex flex-row items-center gap-5 text-sm lg:gap-6">
        //     <DropdownMenu>
        //       <DropdownMenuTrigger asChild>
        //         <Link
        //           className="font-bold bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 py-2 px-4 rounded-lg"
        //           href="#"
        //         >
        //           Projects
        //         </Link>
        //       </DropdownMenuTrigger>
        //       <DropdownMenuContent align="start">
        //         <DropdownMenuItem>Project 1</DropdownMenuItem>
        //         <DropdownMenuItem>Project 2</DropdownMenuItem>
        //         <DropdownMenuItem>Project 3</DropdownMenuItem>
        //       </DropdownMenuContent>
        //     </DropdownMenu>
        //     <DropdownMenu>
        //       <DropdownMenuTrigger asChild>
        //         <Link
        //           className="text-gray-500 dark:text-gray-400 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 py-2 px-4 rounded-lg"
        //           href="#"
        //         >
        //           Teams
        //         </Link>
        //       </DropdownMenuTrigger>
        //       <DropdownMenuContent align="start">
        //         <DropdownMenuItem>Team 1</DropdownMenuItem>
        //         <DropdownMenuItem>Team 2</DropdownMenuItem>
        //         <DropdownMenuItem>Team 3</DropdownMenuItem>
        //       </DropdownMenuContent>
        //     </DropdownMenu>

        //     <div className=" ml-auto">
        //       <DropdownMenu>
        //         <DropdownMenuTrigger asChild>
        //           <Button
        //             variant="ghost"
        //             className="relative h-8 w-8 rounded-full"
        //           >
        //             <Avatar className="ml-auto h-8 w-8">
        //               <AvatarImage
        //                 src="/avatars/01.png"
        //                 alt={session.user.email}
        //               />
        //               <AvatarFallback>
        //                 {session.user.name[0].toUpperCase()}
        //               </AvatarFallback>
        //             </Avatar>
        //           </Button>
        //         </DropdownMenuTrigger>
        //         <DropdownMenuContent className="w-56" align="end" forceMount>
        //           <DropdownMenuLabel className="font-normal">
        //             <div className="flex flex-col space-y-1">
        //               <p className="text-sm font-medium leading-none">
        //                 {session.user.name}
        //               </p>
        //               <p className="text-xs leading-none text-muted-foreground">
        //                 {session.user.email}
        //               </p>
        //             </div>
        //           </DropdownMenuLabel>
        //           <DropdownMenuSeparator />
        //           {/* <DropdownMenuGroup> */}
        //           <DropdownMenuItem>
        //             <Link
        //               href={`/UserPage/${sessionUserId}`}
        //               title="Your Profile"
        //             >
        //               Profile
        //             </Link>
        //           </DropdownMenuItem>
        //           <DropdownMenuSeparator />
        //           <DropdownMenuItem>
        //             <Link href={`/TaskPage/new`} title="AddConnection">
        //               Create New Task
        //             </Link>
        //           </DropdownMenuItem>
        //           <DropdownMenuItem>
        //             <Link
        //               href={`/CreateProject/${sessionUserId}`}
        //               title="Create New Project"
        //             >
        //               Create New Project
        //             </Link>
        //           </DropdownMenuItem>
        //           <DropdownMenuItem>
        //             <Link href={`/AddConnection/`} title="AddConnection">
        //               Add Connection
        //             </Link>
        //           </DropdownMenuItem>
        //           {/* </DropdownMenuProject> */}
        //           <DropdownMenuSeparator />{" "}
        //           <DropdownMenuItem>
        //             <Link
        //               href={`/Tasks/User/${sessionUserId}`}
        //               title="Your Tasks"
        //             >
        //               Tasks
        //             </Link>
        //           </DropdownMenuItem>{" "}
        //           <DropdownMenuItem>
        //             <Link
        //               href={`/Projects/User/${sessionUserId}`}
        //               title="View Your Projects"
        //             >
        //               Projects
        //             </Link>
        //           </DropdownMenuItem>
        //           <DropdownMenuSeparator />
        //           <DropdownMenuItem>
        //             <Logout />
        //           </DropdownMenuItem>
        //         </DropdownMenuContent>
        //       </DropdownMenu>
        //     </div>
        //   </nav>
        //   {/* </div> */}
        // </header>
        <header className="flex items-center h-16 px-4 border-b shrink-0 md:px-6">
          <Link
            className="flex items-center gap-2 text-lg font-semibold sm:text-base mr-4"
            href="#"
          >
            <span className="font-bold">BrandName</span>
            <span className="sr-only">Acme Inc</span>
          </Link>
          <nav className="font-medium sm:flex flex-row items-center gap-5 text-sm lg:gap-6 ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Link
                  className="font-bold bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 py-2 px-4 rounded-lg"
                  href="#"
                >
                  Projects
                </Link>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>Project 1</DropdownMenuItem>
                <DropdownMenuItem>Project 2</DropdownMenuItem>
                <DropdownMenuItem>Project 3</DropdownMenuItem>
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
                <DropdownMenuItem>Team 1</DropdownMenuItem>
                <DropdownMenuItem>Team 2</DropdownMenuItem>
                <DropdownMenuItem>Team 3</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                <DropdownMenuItem>
                  <Link
                    href={`/USERPAGE-CLEAN/${sessionUserId}`}
                    title="Your Profile"
                  >
                    Profile
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
