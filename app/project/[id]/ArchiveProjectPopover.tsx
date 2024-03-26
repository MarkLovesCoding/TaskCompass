import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import React from "react";
import { Button } from "@/components/ui/button";
import { updateProjectArchivedAction } from "../../team/_actions/update-project-archived.action";
import { ProjectDto } from "@/use-cases/project/types";
import { useRouter } from "next/navigation";
const ArchiveProjectPopover = ({ project }: { project: ProjectDto }) => {
  const archiveProjectFormObject = {
    archived: true,
    projectId: project.id,
  };
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger>
          <div className="py-1 px-1 text-xs">
            {/* {project.name} */}
            Archive Project
            <span className="sr-only">Archive Project Trigger</span>
          </div>
        </PopoverTrigger>{" "}
        <PopoverContent>
          <Card>
            <CardHeader>
              <CardTitle className="">Archive Project</CardTitle>
            </CardHeader>
            <CardDescription className="p-4 mb-2 ">
              <p> Are you sure you want to archive this project? </p>
              <br />
              <p className="text-xs text-center"> (Can be unarchived later) </p>
            </CardDescription>
            <CardFooter className="w-full flex flex-row justify-evenly">
              <Button
                className="text-sm "
                variant="destructive"
                onClick={() => {
                  updateProjectArchivedAction(archiveProjectFormObject);
                  setIsOpen(false);
                  router.push(`/TEAMS-CLEAN/${project.team}`);
                  // handleArchivedSubmit();
                }}
              >
                Archive
              </Button>
              <Button
                className="text-sm "
                variant="outline"
                onClick={() => {
                  // handleArchivedCancel();
                  setIsOpen(false);
                }}
              >
                Cancel
              </Button>
            </CardFooter>
          </Card>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default ArchiveProjectPopover;
