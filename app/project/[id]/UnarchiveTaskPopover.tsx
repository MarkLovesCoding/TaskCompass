import { TaskDto } from "@/use-cases/task/types";
import React from "react";
import { Button } from "@/components/ui/button-alert";
import { Label } from "@/components/ui/label";
import { updateTaskArchivedAction } from "../_actions/update-task-archived.action";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog-user-search";
import { toast } from "sonner";

const UnarchiveTaskPopover = ({
  task,
  isCurrentUserAdmin,
}: {
  task: TaskDto;
  isCurrentUserAdmin: boolean;
}) => {
  const unarchiveFormObject = {
    id: task.id,
    archived: false,
    projectId: task.project,
  };
  const [isOpen, setIsOpen] = React.useState(false);

  const handleArchivedCancel = async () => {
    try {
      await updateTaskArchivedAction(unarchiveFormObject);
      toast.success(`Task: ${task.name} Activated Successfully!`);
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(`Error Activating Task: ${task.name}`);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger className="w-full hover:bg-secondary p-2 rounded-md">
          <div className="py-1 px-1 text-xs text-left ">
            {task.name}
            <span className="sr-only">Activate Task Menu Trigger</span>
          </div>
        </DialogTrigger>{" "}
        {isCurrentUserAdmin ? (
          <DialogContent className="p-4 rounded-lg border-2 border-primary bg-alert-background backdrop-filter">
            {/* <Card className="rounded-lg"> */}
            {/* <CardHeader> */}
            {/* <div className=" "> */}
            <Label className="text-center text-xl md:text-2xl">
              Activate Task
            </Label>
            {/* </CardHeader> */}
            <div className="p-4 mb-2 ">
              <p> Are you sure you want to activate this task? </p>
            </div>
            <div className="w-full flex flex-row justify-evenly">
              <Button
                className=" "
                variant="default"
                onClick={() => {
                  handleArchivedCancel();
                  // updateTaskArchvedAction(unarchiveFormObject);
                  // toast.success("Task Activated Successfully!");
                  // setIsOpen(false);
                }}
              >
                Activate
              </Button>
              <Button
                className=" "
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                Cancel
              </Button>
              {/* </div> */}
            </div>
            {/* </Card> */}
          </DialogContent>
        ) : (
          <DialogContent className="p-4 rounded-lg border-2 border-primary bg-alert-background backdrop-filter">
            <Label className="text-center text-base p-8 md:text-lg">
              Admin Permissions Required to Unarchive Task
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

export default UnarchiveTaskPopover;
