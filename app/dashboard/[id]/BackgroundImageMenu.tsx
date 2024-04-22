import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { updateUserBackgroundAction } from "./_actions/update-user-background.action";
import { updateProjectBackgroundAction } from "@/app/project/_actions/update-project-background.action";
import { updateTeamBackgroundAction } from "@/app/team/_actions/update-team-background.action";
import { UserDto } from "@/use-cases/user/types";
import { ProjectDto } from "@/use-cases/project/types";
import { TeamDto } from "@/use-cases/team/types";
import { toast } from "sonner";
const BackgroundImageMenu = ({
  type,
  object,
}: {
  type: "User" | "Project" | "Team";
  object: UserDto | ProjectDto | TeamDto;
}) => {
  const [backgroundImage, setBackgroundImage] = useState<string>(
    object.backgroundImage
  );
  const PER_PAGE = 12;
  const [selectedImages, setSelectedImages] = useState<any[]>([]);
  const [imagesLoadPage, setImagesLoadPage] = useState<number>(1);

  const loadImageSetonOpen = async (bool: boolean) => {
    // isImagesDialogOpen = bool;
    if (bool) {
      await loadNextImageSet();
    }
  };

  const loadNextImageSet = async () => {
    const nextPage = imagesLoadPage + 1;
    const showPage = imagesLoadPage == 1 ? 1 : nextPage;
    // await apiSearchNext(nextPage);
    await fetch("/api/unsplash", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ page: showPage, perPage: PER_PAGE }),
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
        console.error("Error:", error);
      });
    setImagesLoadPage(nextPage);
  };
  type TUrls = {
    full: string;
    large: string;
    regular: string;
    raw: string;
    small: string;
    thumb: string;
  };
  const setNewBackground = async (urls: TUrls) => {
    setBackgroundImage(urls.full);
    if (type === "User") {
      try {
        await updateUserBackgroundAction(object.id, urls.full);
        toast.success("Dashboard background image updating...");
      } catch (err) {
        toast.error("Error updating dashboad background image");
        console.error(err);
      }
    }
    if (type === "Project") {
      try {
        await updateProjectBackgroundAction(object.id, urls.full, urls.small);
        toast.success("Project background image updating...");
      } catch (err) {
        toast.error("Error updating project background image");
        console.error(err);
      }
    }

    if (type === "Team") {
      try {
        await updateTeamBackgroundAction(object.id, urls.full, urls.small);
        toast.success("Team background image updating...");
      } catch (err) {
        toast.error("Error updating team background image");
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
        <DialogContent className="border-2 w-[80%]  bg-drawer-background backdrop-blur  p-4 border-nav-background">
          <div className="flex flex-col h-fit overflow-auto">
            <h1 className="font-bold text-lg w-full text-center">
              Customize Background
            </h1>
            <div className="flex flex-wrap justify-center h-[300px] p-2">
              {selectedImages.length > 0 ? (
                selectedImages.map((image: any, index) => {
                  return (
                    <div
                      key={index}
                      className="relative max-w-[120px] max-h-[80px] m-1 overflow-y-clip cursor-pointer hover:border-white border-2 truncate text-ellipsis group"
                    >
                      <Image
                        onClick={() => setNewBackground(image.urls)}
                        src={image.urls.thumb}
                        alt="Background Image"
                        width={120}
                        height={80}
                        className={`${
                          image.width / image.height > 1.5
                            ? "w-auto h-[80px]"
                            : "w-[120px] h-auto"
                        }  overflow-clip rounded cursor-pointer z-40 `}
                      />
                      {/* <div className="w-full h-full absolute top-0 left-0 z-30 bg-black/10 group-hover:bg-black/0"></div> */}
                      <Link
                        href={image.user.links.html}
                        className=" w-full absolute h-[20px]  bg-black/30 z-40 hover:bg-black/60 top-[60px] left-[0px]  truncate text-ellipsis "
                        title={image.user.name}
                      >
                        <p className="  px-2 text-xs truncate text-ellipsis">
                          {image.user.name}
                        </p>
                      </Link>
                      {/* <p>{image.url.full}</p> */}
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
                <Button onClick={loadNextImageSet} className="w-28 px-1 ">
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
