"use client";
import { capitalizeEachWord } from "./utils";
import { Button } from "@/components/ui/button";
import { NewTaskCard } from "./NewTaskCard";
import { PlusIcon, FolderKanbanIcon } from "lucide-react";
import Link from "next/link";
import type { ProjectDto } from "@/use-cases/project/types";
import type { TaskDto } from "@/use-cases/task/types";
// import UpdateProjectUsersCard from "./UpdateProjectUsersCard";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/card-scroll-area";
import { UserDto } from "@/use-cases/user/types";

import { useState } from "react";
import CardView from "./CardView";
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
  const [sortBy, setSortBy] = useState<string>("priority");
  const isUserAdmin =
    project && user.projectsAsAdmin.some((id) => id === project.id);
  const uniqueProjectUsers = [...projectUsers];
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
          `fixed h-12 top-8 md:top-12 flex-row flex p-2 border-b-slate-50 w-[calc(100vw-1.5rem)] md:w-[calc(100vw-2rem)] bg-background `
        )}
      >
        <div className="min-w-fit p-1 max-h-12 md:max-h-16">
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
                <Button variant="outline" className="group hover:bg-accent">
                  <Label className="hidden md:flex hover:cursor  ">{`View : ${capitalizeEachWord(
                    sortBy
                  )}  `}</Label>
                  <FolderKanbanIcon className="group-hover:text-primary w-8 h-8 md:ml-3 self-center cursor-pointer" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 ">
                <DropdownMenuLabel className="text-center  font-bold">
                  View
                </DropdownMenuLabel>
                <Separator className="my-2" />
                <DropdownMenuRadioGroup
                  className=" hover:cursor "
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
                <Button variant="outline" className="group hover:bg-accent">
                  <Label className="hidden md:flex ">New Task</Label>
                  <PlusIcon className="w-8 h-8 md:ml-3 self-center group-hover:text-primary" />
                  <span className="sr-only">New Task Button</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="border-2 border-nav-background">
                <NewTaskCard project={project} />
              </PopoverContent>
            </Popover>
          </div>
          {/* )} */}
        </div>
      </div>
      <main
        className={cn(
          isUserAdmin ? "left-6 md:left-8 " : "left-0",
          `fixed top-[8rem] w-[calc(100vw-1.5rem)] md:w-[calc(100vw-2rem)] h-[calc(100vh-5rem)] md:h-[calc(100vh-8rem)] border border-l-0`
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
