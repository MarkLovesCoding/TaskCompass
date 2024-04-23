"use client";
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog-user-search";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button-alert";
import { Badge } from "@/components/ui/badge";

import { updateProjectArchivedAction } from "../../team/_actions/update-project-archived.action";

import type { ProjectDto } from "@/use-cases/project/types";

const ArchivedProjectCardWithUnarchiveAction = ({
  project,
  key,
  team,
  permission,
}: {
  project: ProjectDto;
  key: number;
  team: string;
  permission: "admin" | "member";
}) => {
  const archiveProjectFormObject = {
    archived: false,
    projectId: project.id,
  };
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger>
          <ArchivedCard
            project={project}
            key={key}
            team={team}
            permission={permission}
          />
          <span className="sr-only">Activate Project Trigger</span>
        </DialogTrigger>
        {permission == "admin" && (
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
        )}
        {permission == "member" && (
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

export default ArchivedProjectCardWithUnarchiveAction;

const ArchivedCard = ({
  project,
  key,
  team,
  permission,
}: {
  project: ProjectDto;
  key: number;
  team: string;
  permission: "admin" | "member";
}) => {
  return (
    <Card
      key={key}
      className=" hover:border-primary border-2 mb-4 max-w-full mr-4 flex items-center w-72 h-28 bg-gray-600  shadow-lg hover:shadow-sm"
    >
      <CardHeader className="w-full h-full p-2">
        <div className="flex flex-row w-full justify-between">
          <p className="text-xs text-accent-foreground italic">Team: {team}</p>
          <div className=" flex justify-end">
            <Badge
              className={` min-w-fit text-xs px-2 py-[0.2em] m-1 self-end ${
                permission == "admin" ? "bg-badgeRed" : "bg-badgeBlue"
              } `}
            >
              {permission == "admin" ? `Admin` : `Member`}
            </Badge>
          </div>
        </div>
        <CardTitle className="text-sm text-start pl-2 italic md:text-base">
          {project.name} - Archived
        </CardTitle>
        <CardDescription className="text-xs text-ellipsis"></CardDescription>
      </CardHeader>
    </Card>
  );
};
