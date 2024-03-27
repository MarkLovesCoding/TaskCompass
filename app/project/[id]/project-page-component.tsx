"use client";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import useScreenSize from "../hooks/useScreenSize";
import { capitalizeEachWord } from "./utils";
import { Button } from "@/components/ui/button";
import { TaskCard } from "./TaskCard";
import { MemberCardWithPermissions } from "./member-card-with-permissions";
import { NewTaskCard } from "./NewTaskCard";
import { ProjectHeader } from "./ProjectHeader";
import {
  PlusIcon,
  FolderKanbanIcon,
  ArrowBigLeftIcon,
  ArrowRightCircle,
  XIcon,
  ArrowLeftIcon,
  ArrowLeftCircleIcon,
  ArchiveIcon,
} from "lucide-react";
import Link from "next/link";
import { PersonStanding } from "lucide-react";
import type { ProjectDto } from "@/use-cases/project/types";
import type { TaskDto } from "@/use-cases/task/types";
// import UpdateProjectUsersCard from "./UpdateProjectUsersCard";
import { MemberCardSearchTable } from "./member-card-search-table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UserIcon, UserCog, CheckIcon, ClockIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/card-scroll-area";
import getProject from "@/data-access/projects/get-project.persistence";
import getProjectTasks from "@/data-access/tasks/get-project-tasks.persistence";
import { ArrowDownCircle } from "lucide-react";
import { UserDto } from "@/use-cases/user/types";
import UnarchiveTaskPopover from "./UnarchiveTaskPopover";
import ArchiveProjectPopover from "./ArchiveProjectPopover";

import { ProjectHeaderStatic } from "./ProjectHeaderStatic";
import { getInitials } from "@/lib/utils/getInitials";

import { useState, useEffect } from "react";
import CardView from "./CardView";
import SideBar from "./SideBar";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Project from "@/db/(models)/Project";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils/utils";
import { TeamDto } from "@/use-cases/team/types";
import ProjectDrawer from "./ProjectDrawer";
export function ProjectPage({
  // id,
  userId,
  user,
  project,
  tasks,
  teamUsers,
  projectUsers,
  team,
}: {
  // id: string;
  userId: string;
  user: UserDto;
  project: ProjectDto;
  tasks: TaskDto[];
  teamUsers: UserDto[];
  team: TeamDto;
  projectUsers: UserDto[];
}) {
  // const [project, setProject] = useState<ProjectDto>();
  // const [tasks, setTasks] = useState<TaskDto[]>([]);
  // useEffect(() => {
  //   console.log("projectUsers", projectUsers);

  //   const fetchData = async () => {
  //     const project = await getProject(id);
  //     setProject(project);
  //     const tasks = await getProjectTasks(project);
  //     setTasks(tasks);
  //     // Do something with project and tasks
  //   };

  //   fetchData();
  // }, [projectUsers, id]);
  const [sortBy, setSortBy] = useState<string>("priority");
  const isUserAdmin =
    project && user.projectsAsAdmin.some((id) => id === project.id);
  // const isUserAdmin = false;
  // const archivedTasks = tasks.filter((task) => task.archived);
  // const uniqueTeamUsers = [...teamUsers];
  const uniqueProjectUsers = [...projectUsers];
  // const projectAdmins = projectUsers.filter((user) =>
  //   user.projectsAsAdmin.includes(project.id)
  // );
  // const projectMembers = projectUsers.filter((user) =>
  //   user.projectsAsMember.includes(project.id)
  // );
  if (!project || !tasks) return <div>Loading...</div>;
  console.log("Tasks", tasks);
  return (
    <div className="flex flex-col justify-start items-center min-h-full ">
      <div>
        {isUserAdmin && (
          <ProjectDrawer
            userId={userId}
            team={team}
            tasks={tasks}
            project={project}
            teamUsers={teamUsers}
            projectUsers={projectUsers}
          />
        )}
      </div>
      <div
        className={cn(
          isUserAdmin ? "left-8 " : "left-0",
          `fixed h-16 top-16 flex-row flex p-2 border-b-slate-50 w-[calc(100vw-2rem)] bg-background `
        )}
      >
        <div className="min-w-fit p-1 max-h-16">
          <Link href={`/team/${project.team}`}>
            <h4 className="text-xs  underline cursor-pointer">Back to Team</h4>
          </Link>
          <div className="flex items-center m-2 ">
            <h4 className=" text-sm md:text-md lg:text-lg pr-3">Project:</h4>
            <h4 className="text-sm md:text-md font-bold lg:text-lg">
              {project.name}
            </h4>
          </div>
        </div>
        <div className="flex flex-row w-full   justify-center align-middle ">
          <div title="Change View" className="p-2 ">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Label className="hidden md:flex ">{`View : ${capitalizeEachWord(
                    sortBy
                  )}  `}</Label>
                  <FolderKanbanIcon className="w-8 h-8 md:ml-3 self-center cursor-pointer" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel className="text-center font-bold">
                  View
                </DropdownMenuLabel>
                <Separator className="my-2" />
                <DropdownMenuRadioGroup
                  value={sortBy}
                  onValueChange={setSortBy}
                >
                  <DropdownMenuRadioItem value="priority">
                    Priority
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="status">
                    Status
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="category">
                    Category
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {/* {isUserAdmin && ( */}
          <div title="Create New Task" className="p-2">
            <Popover>
              <PopoverTrigger>
                <Button variant="outline">
                  <Label className="hidden md:flex ">New Task</Label>
                  <PlusIcon className="w-8 h-8 md:ml-3 self-center" />
                  <span className="sr-only">New Task Button</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <NewTaskCard project={project} />
              </PopoverContent>
            </Popover>
          </div>
          {/* )} */}
        </div>
      </div>
      <main
        className={cn(
          isUserAdmin ? "left-8 " : "left-0",
          `fixed top-[8rem] w-[calc(100vw-2rem)] h-[calc(100vh-8rem)] border`
        )}
      >
        <ScrollArea
          type="always"
          className=" w-[calc(100vw-2rem)] flex  h-[calc(100vh-8rem)] "
        >
          <div className="flex justify-start align-top">
            <CardView
              viewType={sortBy}
              tasks={tasks}
              project={project}
              projectUsers={uniqueProjectUsers}
            />
          </div>
          <ScrollBar orientation="horizontal" />
          <ScrollBar />
        </ScrollArea>
      </main>
    </div>
  );
}
