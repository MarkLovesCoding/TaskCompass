import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";

import { capitalizeEachWord } from "@/app/project/[id]/utils";
import { ValidationError } from "@/use-cases/utils";
import { updateUserBackgroundAction } from "./_actions/update-user-background.action";
import { updateProjectBackgroundAction } from "@/app/project/_actions/update-project-background.action";
import { updateTeamBackgroundAction } from "@/app/team/_actions/update-team-background.action";

import type { ProjectDto } from "@/use-cases/project/types";
import type { TeamDto } from "@/use-cases/team/types";
import type { UserDto } from "@/use-cases/user/types";

export type TImageCategories =
  | "nature"
  | "dogs"
  | "animals"
  | "people"
  | "food"
  | "technology"
  | "space"
  | "architecture"
  | "business"
  | "health"
  | "music"
  | "sports"
  | "spirituality"
  | "travel"
  | "textures"
  | "3D renders";

const IMAGE_CATEGORIES: TImageCategories[] = [
  "nature",
  "dogs",
  "animals",
  "people",
  "food",
  "technology",
  "space",
  "architecture",
  "business",
  "health",
  "music",
  "sports",
  "spirituality",
  "travel",
  "textures",
  "3D renders",
];
const BackgroundImageMenu = ({
  type,
  object,
}: {
  type: "User" | "Project" | "Team";
  object: UserDto | ProjectDto | TeamDto;
}) => {
  const PER_PAGE = 12;
  const [selectedImages, setSelectedImages] = useState<any[]>([]);
  const [imagesLoadPage, setImagesLoadPage] = useState<number>(1);
  console.log("selectedImages[0]", selectedImages);
  const [photoCategory, setPhotoCategory] = useState<TImageCategories>(
    IMAGE_CATEGORIES[0]
  );

  const loadImageSetonOpen = async (bool: boolean) => {
    if (bool) {
      await loadNextImageSet(photoCategory);
    }
  };

  const loadNextImageSet = async (category: TImageCategories) => {
    const nextPage = imagesLoadPage + 1;
    const showPage = imagesLoadPage == 1 ? 1 : nextPage;
    // await apiSearchNext(nextPage);
    await fetch("/api/unsplash", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        category: category,
        page: showPage,
        perPage: PER_PAGE,
      }),
      cache: "no-cache",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setSelectedImages((prev) => {
          return [...prev, ...data];
        });
      })
      .catch((error) => {
        toast.error("Error loading images from unsplash.com");
        console.error("Error:", error);
      });
    setImagesLoadPage(nextPage);
  };

  const onCategoryChange = async (category: TImageCategories) => {
    setPhotoCategory(category);
    setImagesLoadPage(1);
    setSelectedImages([]);
    await loadNextImageSet(category);
  };

  type TUrls = {
    full: string;
    large?: string;
    regular?: string;
    raw: string;
    small: string;
    thumb: string;
  };
  type TLinks = {
    download: string;
    download_location: string;
    html: string;
    self: string;
  };
  const setNewBackground = async (urls: TUrls, links: TLinks) => {
    // trigger download action for unsplash API requirements
    await fetch("/api/unsplash/download", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        download_location: links.download_location,
      }),
      cache: "no-cache",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        toast.error(
          "Error triggering download of image via API for unsplash.com"
        );
        console.error("Error:", error);
      });
    // setBackgroundImage(urls.full);
    if (type === "User") {
      try {
        await updateUserBackgroundAction(object.id, urls.full);
        toast.success("Dashboard background image updating...");
      } catch (err: any) {
        if (err instanceof ValidationError) {
          toast.error("Validation error: " + err.message);
        } else if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error(
            "An error occurred updating backdoung. Please try again."
          );
        }
      }
    }
    if (type === "Project") {
      try {
        await updateProjectBackgroundAction(
          object.id,
          urls.full,
          urls.small || urls.thumb
        );
        toast.success("Project background image updating...");
      } catch (err) {
        toast.error("Error updating project background image");
        console.error(err);
      }
    }

    if (type === "Team") {
      try {
        await updateTeamBackgroundAction(
          object.id,
          urls.full,
          urls.small || urls.thumb
        );
        toast.success("Team background image updating...");
      } catch (err: any) {
        toast.error("Error updating team background image.", err.message);
        console.error(err);
      }
    }
  };

  return (
    <div>
      <Dialog onOpenChange={loadImageSetonOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="group hover:bg-accent px-2 mr-3">
            <Label className="hidden md:flex ">Change Background</Label>
            <ImageIcon className="w-6 h-6 md:ml-3 self-center group-hover:text-primary" />
            <span className="sr-only">Change Background Button</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="border-2 w-[80%]  bg-drawer-background backdrop-blur  p-4  border-nav-background">
          <div className="flex flex-col h-fit overflow-auto">
            <div className="flex flex-row items-center justify-evenly mx-16 mt-1">
              <h1 className="font-bold text-lg w-full text-center ">
                Customize Background
              </h1>
              <Select
                onValueChange={onCategoryChange}
                defaultValue={IMAGE_CATEGORIES[0]}
              >
                <SelectTrigger className=" w-fit">
                  <SelectValue
                    className="text-lg font-bold text-center self-center pr-2 "
                    placeholder={IMAGE_CATEGORIES[0]}
                  />
                </SelectTrigger>
                <SelectContent>
                  {IMAGE_CATEGORIES?.map((category, _index) => (
                    <SelectItem
                      className="text-sm "
                      key={_index}
                      value={category}
                    >
                      {capitalizeEachWord(category)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap justify-center h-[300px] p-2">
              {selectedImages.length > 0 ? (
                selectedImages.map((image: any, index) => {
                  return (
                    <div
                      key={index}
                      className="relative max-w-[120px] max-h-[80px] m-1 overflow-y-clip cursor-pointer hover:border-white border-2 truncate text-ellipsis group"
                    >
                      <Image
                        onClick={() =>
                          setNewBackground(image.urls, image.links)
                        }
                        src={image.urls.thumb}
                        alt={image.alt_description}
                        width={120}
                        height={80}
                        className={`${
                          image.width / image.height > 1.5
                            ? "w-auto h-[80px]"
                            : "w-[120px] h-auto"
                        }  overflow-clip rounded cursor-pointer z-40 `}
                      />
                      <Link
                        href={
                          image.user.links.html +
                          "?utm_source=taskcompass&utm_medium=referral"
                        }
                        className=" w-full absolute h-[25px] group/user bg-black/30 z-40 hover:bg-black/60 top-[55px] left-[0px]  truncate text-ellipsis "
                        title={`${image.user.name} on unsplash.com`}
                      >
                        <div className="flex flex-col relative">
                          <p className="  px-2 text-[11px] truncate group-hover/user:underline text-ellipsis">
                            {image.user.name}
                          </p>
                        </div>
                      </Link>
                    </div>
                  );
                })
              ) : (
                <div className="flex justify-center w-full h-fit flex-wrap scroll-none">
                  <Skeleton className="w-[120px] m-1 h-[80px] rounded-none bg-nav-background" />
                  <Skeleton className="w-[120px] m-1 h-[80px] rounded-none bg-nav-background" />
                  <Skeleton className="w-[120px] m-1 h-[80px] rounded-none bg-nav-background" />
                  <Skeleton className="w-[120px] m-1 h-[80px] rounded-none bg-nav-background" />
                  <Skeleton className="w-[120px] m-1 h-[80px] rounded-none bg-nav-background" />
                  <Skeleton className="w-[120px] m-1 h-[80px] rounded-none bg-nav-background" />
                  <Skeleton className="w-[120px] m-1 h-[80px] rounded-none bg-nav-background" />
                  <Skeleton className="w-[120px] m-1 h-[80px] rounded-none bg-nav-background" />
                  <Skeleton className="w-[120px] m-1 h-[80px] rounded-none bg-nav-background" />
                  <Skeleton className="w-[120px] m-1 h-[80px] rounded-none bg-nav-background" />
                  <Skeleton className="w-[120px] m-1 h-[80px] rounded-none bg-nav-background" />
                  <Skeleton className="w-[120px] m-1 h-[80px] rounded-none bg-nav-background" />
                </div>
              )}
              <div className="min-w-full py-4 flex justify-center">
                <Button
                  onClick={async () => {
                    await loadNextImageSet(photoCategory);
                  }}
                  className="w-28 px-1 "
                >
                  More Images...
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BackgroundImageMenu;
