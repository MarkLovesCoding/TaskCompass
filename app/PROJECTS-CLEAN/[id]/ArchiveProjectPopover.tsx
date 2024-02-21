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
import { updateProjectArchivedAction } from "../../TEAMS-CLEAN/_actions/update-project-archived.action";
import { ProjectDto } from "@/use-cases/project/types";

const ArchiveProjectPopover = ({ project }: { project: ProjectDto }) => {
  const archiveProjectFormObject = {
    archived: true,
    projectId: project.id,
  };
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger>
          <div className="p-2">
            {project.name}
            <span className="sr-only">Archive Project Trigger</span>
          </div>
        </PopoverTrigger>{" "}
        <PopoverContent>
          <Card>
            <CardHeader>
              <CardTitle className="p-2">Archive Project</CardTitle>
            </CardHeader>
            <CardDescription className="p-4 mb-4 ">
              <p> Are you sure you want to archive this project? </p>
              <br />
              <p className="text-xs"> (Can be unarchived later) </p>
            </CardDescription>
            <CardFooter className="w-full flex flex-row justify-evenly">
              <Button
                variant="outline"
                onClick={() => {
                  updateProjectArchivedAction(archiveProjectFormObject);
                  setIsOpen(false);
                  // handleArchivedSubmit();
                }}
              >
                Archive
              </Button>
              <Button
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
