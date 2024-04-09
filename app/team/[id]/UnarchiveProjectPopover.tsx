"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog-user-search";
import React from "react";
import { Button } from "@/components/ui/button-alert";
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
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger className="hover:bg-secondary w-full p-2 rounded-lg">
          {project.name}
          <span className="sr-only">Activate Project Trigger</span>
        </DialogTrigger>{" "}
        <DialogContent className="p-4 rounded-lg border-2 border-primary bg-alert-background backdrop-filter">
          <Label className="text-center text-xl md:text-2xl">
            Activate Project
          </Label>
          <div className="p-4 mb-2 ">
            Are you sure you want to activate this project?
          </div>
          <div className="w-full flex flex-row justify-evenly">
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
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UnarchiveProjectPopover;
