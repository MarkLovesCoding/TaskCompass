"use client";
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
import { updateProjectArchivedAction } from "../_actions/update-project-archived.action";
import { ProjectDto } from "@/use-cases/project/types";

const UnarchiveProjectPopover = ({ project }: { project: ProjectDto }) => {
  const archiveProjectFormObject = {
    archived: false,
    projectId: project.id,
  };
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger className="hover:bg-secondary p-2 rounded-lg">
          {project.name}
          <span className="sr-only">Activate Project Trigger</span>
        </PopoverTrigger>{" "}
        <PopoverContent>
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Activate Project</CardTitle>
            </CardHeader>
            <CardDescription className="p-4 mb-2 ">
              Are you sure you want to activate this project?
            </CardDescription>
            <CardFooter className="w-full flex flex-row justify-evenly">
              <Button
                className="text-sm "
                variant="default"
                onClick={() => {
                  updateProjectArchivedAction(archiveProjectFormObject);
                  setIsOpen(false);
                  // handleArchivedSubmit();
                }}
              >
                Activate
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

export default UnarchiveProjectPopover;
