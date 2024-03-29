import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import React from "react";
import { Button } from "@/components/ui/button";
import { updateProjectArchivedAction } from "../../team/_actions/update-project-archived.action";
import { ProjectDto } from "@/use-cases/project/types";
import { useRouter } from "next/navigation";
import { ArchiveIcon } from "lucide-react";
const ArchiveProjectPopover = ({ project }: { project: ProjectDto }) => {
  const archiveProjectFormObject = {
    archived: true,
    projectId: project.id,
  };
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      {/* <div className="flex justify-center my-auto"> */}
      <Button
        variant="outline"
        className="h-fit w-fit py-1 px-2 group/archive hover:border-destructive hover:bg-destructive"
      >
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger className="group/archive   ">
            <div className="flex flex-row">
              <ArchiveIcon className="w-4 h-4 mr-1   self-center   group-hover/archive:text-white" />
              <div className="py-1 px-1 text-xs group-hover/archive:text-white">
                {/* {project.name} */}
                Archive Project
                <span className="sr-only">Archive Project Trigger</span>
              </div>
            </div>
          </PopoverTrigger>{" "}
          <PopoverContent>
            {/* <Card>
            <CardHeader> */}
            <Label className="">Archive Project</Label>
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
                  updateProjectArchivedAction(archiveProjectFormObject);
                  setIsOpen(false);
                  router.push(`/team/${project.team}`);
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
          </PopoverContent>
        </Popover>
        <span className="sr-only">Archive Project Button</span>
      </Button>
    </>
  );
};

export default ArchiveProjectPopover;
