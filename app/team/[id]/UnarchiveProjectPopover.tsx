"use client";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog-user-search";
import React from "react";
import { Button } from "@/components/ui/button-alert";
import { updateProjectArchivedAction } from "../_actions/update-project-archived.action";
import { ProjectDto } from "@/use-cases/project/types";
import { toast } from "sonner";

const UnarchiveProjectPopover = ({
  project,
  isCurrentUserAdmin,
}: {
  project: ProjectDto;
  isCurrentUserAdmin: boolean;
}) => {
  const archiveProjectFormObject = {
    archived: false,
    projectId: project.id,
  };
  const [isOpen, setIsOpen] = React.useState(false);
  const handleArchivedSubmit = async () => {
    try {
      await updateProjectArchivedAction(archiveProjectFormObject);
      toast.success(`Project: ${project.name} Activated Successfully!`);
      setIsOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(`Error Activating Project: ${project.name}`);
    }
  };
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger className="hover:bg-secondary w-full p-2 rounded-lg">
          {project.name}
          <span className="sr-only">Activate Project Trigger</span>
        </DialogTrigger>{" "}
        {isCurrentUserAdmin ? (
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
                  handleArchivedSubmit();
                  // updateProjectArchivedAction(archiveProjectFormObject);
                  // toast.success("Project Activated Successfully!");
                  // setIsOpen(false);
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
        ) : (
          <DialogContent className="p-4 rounded-lg border-2 border-primary bg-alert-background backdrop-filter">
            <Label className="text-center text-base p-8 md:text-lg">
              Admin Permissions Required to Unarchive Project
            </Label>
            <div className="w-full flex flex-row justify-evenly">
              <Button
                className="text-sm "
                variant="outline"
                onClick={() => {
                  // handleArchivedCancel();
                  setIsOpen(false);
                }}
              >
                Close
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default UnarchiveProjectPopover;
