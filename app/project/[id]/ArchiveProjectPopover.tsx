import React from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button-alert";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog-user-search";
import { ArchiveIcon } from "lucide-react";

import { updateProjectArchivedAction } from "../../team/_actions/update-project-archived.action";
import { ValidationError } from "@/use-cases/utils";

import type { ProjectDto } from "@/use-cases/project/types";

const ArchiveProjectPopover = ({ project }: { project: ProjectDto }) => {
  const archiveProjectFormObject = {
    archived: true,
    projectId: project.id,
  };
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const handleArchivedSubmit = async () => {
    try {
      await updateProjectArchivedAction(archiveProjectFormObject);
      toast.success(`Project: ${project.name} Archived Successfully!`);
      setIsOpen(false);
      router.push(`/team/${project.team}`);
    } catch (err: any) {
      if (err instanceof ValidationError) {
        toast.error("Validation error: " + err.message);
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error(
          "An unknown error occurred while archiving project. Please try again."
        );
      }
    }
    // handleArchivedSubmit();
  };
  return (
    <>
      {/* <div className="flex justify-center my-auto"> */}
      <Button
        variant="outline"
        className="h-fit w-fit py-1 px-2 group/archive hover:border-destructive hover:bg-destructive"
      >
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger className="group/archive   ">
            <div className="flex flex-row">
              <ArchiveIcon className="w-4 h-4 mr-1   self-center   group-hover/archive:text-white" />
              <div className="py-1 px-1 text-xs group-hover/archive:text-white">
                {/* {project.name} */}
                Archive Project
                <span className="sr-only">Archive Project Trigger</span>
              </div>
            </div>
          </DialogTrigger>{" "}
          <DialogContent className="p-4 rounded-lg border-2 border-primary bg-alert-background backdrop-filter">
            {/* <Card>
            <CardHeader> */}
            <Label className="text-center text-xl md:text-2xl">
              Archive Project
            </Label>
            {/* </CardHeader> */}
            <div className="p-4 mb-2 ">
              <p> Are you sure you want to archive this project? </p>
              <br />
              <p className="text-xs text-center"> (Can be unarchived later) </p>
            </div>

            <div className="w-full flex flex-row justify-evenly">
              <Button
                className="text-sm "
                variant="destructive"
                onClick={() => {
                  handleArchivedSubmit();
                  // updateProjectArchivedAction(archiveProjectFormObject);
                  // toast.success(
                  //   `Project: ${project.name} Archived Successfully!`
                  // );
                  // setIsOpen(false);
                  // router.push(`/team/${project.team}`);
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
            </div>
            {/* </Card> */}
          </DialogContent>
        </Dialog>
        <span className="sr-only">Archive Project Button</span>
      </Button>
    </>
  );
};

export default ArchiveProjectPopover;
