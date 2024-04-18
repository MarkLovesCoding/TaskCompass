"use client";
import { capitalizeEachWord } from "./utils";
import { Button } from "@/components/ui/button";
import { NewTaskCard } from "./NewTaskCard";
import { PlusIcon, FolderKanbanIcon, ArrowLeft, Scroll } from "lucide-react";
import Link from "next/link";
import type { ProjectDto } from "@/use-cases/project/types";
import type { TaskDto } from "@/use-cases/task/types";
import axios from "axios";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover_add";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/card-scroll-area";
import { UserDto } from "@/use-cases/user/types";

import { use, useEffect, useState } from "react";
import CardView from "./CardView";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils/utils";
import { TeamDto } from "@/use-cases/team/types";
import { updateProjectBackgroundAction } from "../_actions/update-project-background.action";
import ProjectDrawer from "./ProjectDrawer";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

import { createApi } from "unsplash-js";
const api = createApi({
  // Don't forget to set your access token here!
  // See https://unsplash.com/developers
  accessKey: "SsU6mvH9lF3cSQEmUUnSY1OmLqsWkFqCyXILkod-bT0",
});

type Photo = {
  id: number;
  width: number;
  height: number;
  urls: { large: string; regular: string; raw: string; small: string };
  color: string | null;
  user: {
    username: string;
    name: string;
  };
};

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
  const [sortBy, setSortBy] = useState<string>("status");
  const [projectBackgroundImage, setProjectBackgroundImage] = useState<string>(
    project.backgroundImage
  );
  const PER_PAGE = 12;
  const [selectedImages, setSelectedImages] = useState<any[]>([]);
  const [imagesLoadPage, setImagesLoadPage] = useState<number>(1);

  const apiSearchFirst = async (page: number) => {
    api.search
      .getPhotos({
        query: "nature",
        page: 1,
        perPage: PER_PAGE,
        orientation: "landscape",
      })
      .then((result) => {
        console.log("result>>>>>>>>>>>>>>", result);
        setSelectedImages(result!.response!.results);
        // setSelectedImages(result);
      })
      .catch(() => {
        console.log("something went wrong!");
      });
  };
  const apiSearchNext = async (page: number) => {
    api.search
      .getPhotos({
        query: "nature",
        page: page,
        perPage: PER_PAGE,
        orientation: "landscape",
      })
      .then((result) => {
        console.log("result>>>>>>>>>>>>>>", result);
        setSelectedImages((prev) => {
          return [...prev, ...result!.response!.results];
        });
        // setSelectedImages(result);
      })
      .catch(() => {
        console.log("something went wrong!");
      });
  };

  const loadImageSetonOpen = async (bool: boolean) => {
    // isImagesDialogOpen = bool;
    if (bool) {
      await loadImageSet();
    }
  };

  const loadImageSet = async () => {
    // const nextPage = imagesLoadPage + 1;
    if (imagesLoadPage === 1) {
      apiSearchFirst(imagesLoadPage);
    }
    // setImagesLoadPage(nextPage);
  };
  const loadNextImageSet = async () => {
    const nextPage = imagesLoadPage + 1;
    await apiSearchNext(nextPage);
    setImagesLoadPage(nextPage);
  };
  const setNewBackground = async (url: string) => {
    setProjectBackgroundImage(url);
    await updateProjectBackgroundAction(project.id, url);
  };
  const isCurrentUserAdmin =
    project && user.projectsAsAdmin.some((id) => id === project.id);
  const uniqueProjectUsers = [...projectUsers];
  if (!project || !tasks) return <div>Loading...</div>;

  return (
    <div className={`flex flex-col justify-start items-center min-h-full `}>
      <div className="z-50">
        <ProjectDrawer
          userId={userId}
          team={team}
          tasks={tasks}
          project={project}
          teamUsers={teamUsers}
          projectUsers={projectUsers}
          isCurrentUserAdmin={isCurrentUserAdmin}
        />
      </div>
      <div
        className={cn(
          `fixed h-16 z-40 shadow-md left-0 top-8 md:top-12 flex-row flex p-2 border-b-slate-50 w-full bg-accordion-background backdrop-filter backdrop-blur  `
        )}
      >
        <div className="min-w-fit p-1 pl-8 h-full justify-evenly flex flex-col">
          <Link
            href={`/team/${project.team}`}
            className="flex flex-row group/back-team"
          >
            <ArrowLeft className="w-4 h-4 cursor-pointer rounded-full " />
            <h4 className="text-xs  ml-2 cursor-pointer group-hover/back-team:underline">
              Back to Team
            </h4>
          </Link>
          <div className="flex items-center m-2 mt-0 h-full justify-between max-w-[20ch]   md:max-w-md">
            <h4 className=" text-xs md:text-sm lg:text-md pr-3 italic">
              Project:
            </h4>
            <h4 className="text-xs md:text-sm font-bold mr-2 lg:text-md text-ellipsis truncate">
              {project.name}
            </h4>
            <Badge
              className={` min-w-fit text-xs px-2 py-[0.2em] m-1 ${
                project.createdBy == userId
                  ? "bg-badgePurple"
                  : isCurrentUserAdmin
                  ? "bg-badgeRed"
                  : "bg-badgeBlue"
              } `}
            >
              {project.createdBy == userId
                ? "Creator"
                : isCurrentUserAdmin
                ? `Admin`
                : `Member`}
            </Badge>
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
                  <DropdownMenuRadioItem value="status">
                    Status
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="priority">
                    Priority
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
          <div>
            <Dialog onOpenChange={loadImageSetonOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="group hover:bg-accent">
                  <Label className="hidden md:flex ">Change Background</Label>
                  <PlusIcon className="w-8 h-8 md:ml-3 self-center group-hover:text-primary" />
                  <span className="sr-only">Change Background Button</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="border-2 w-[80%]  bg-cardcolumn-background  p-4 border-nav-background">
                <div className="flex flex-col h-fit overflow-auto">
                  <h1>Customize Background</h1>
                  <div className="flex flex-wrap justify-center h-[300px] p-4">
                    {selectedImages.length &&
                      selectedImages.map((image: any, index) => {
                        return (
                          <div
                            key={index}
                            className="relative max-w-[120px] max-h-[80px] m-1 overflow-y-clip hover:border-white border-2 rounded-sm truncate text-ellipsis"
                          >
                            <Image
                              onClick={() => setNewBackground(image.urls.full)}
                              src={image.urls.thumb}
                              alt="Background Image"
                              width={120}
                              height={80}
                              className="max-w-[120px] h-auto overflow-clip rounded cursor-pointer "
                            />

                            <Link
                              href={image.user.links.html}
                              className="px-5  truncate text-ellipsis"
                              title={image.user.name}
                            >
                              <p className="absolute top-[60px] left-[12px]  max-w-[calc(100%-24px)]  bg-badgeGray/40 text-xs truncate text-ellipsis">
                                {image.user.name}
                              </p>
                            </Link>
                            {/* <p>{image.url.full}</p> */}
                          </div>
                        );
                      })}
                    <Button onClick={loadNextImageSet} className="w-24 ">
                      + Load More
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          {/* )} */}
        </div>
      </div>
      <main
        style={
          projectBackgroundImage
            ? {
                backgroundImage: "url(" + projectBackgroundImage + ")",
                backgroundSize: "cover",
                backgroundPosition: " center",
                backgroundRepeat: "no-repeat",
              }
            : {}
        }
        className={cn(
          isCurrentUserAdmin ? "left-6 md:left-8 " : "left-0",
          `bg-gradient-background-light dark:bg-gradient-background-dark fixed w-[calc(100vw-1.5rem)] md:w-[calc(100vw-2rem)]  min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-3rem)] border border-l-0`
        )}
      >
        <ScrollArea
          type="always"
          className=" w-[calc(100vw-2rem)] flex h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)] "
        >
          <div className="flex justify-start  pt-16 align-top">
            <CardView
              viewType={sortBy}
              tasks={tasks}
              project={project}
              projectUsers={uniqueProjectUsers}
              isCurrentUserAdmin={isCurrentUserAdmin}
            />
          </div>
          <ScrollBar orientation="horizontal" />
          <ScrollBar />
        </ScrollArea>
      </main>
    </div>
  );
}
