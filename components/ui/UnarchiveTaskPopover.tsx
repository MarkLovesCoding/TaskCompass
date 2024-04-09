import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card-archive";
import { TaskDto } from "@/use-cases/task/types";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import React from "react";
import { Button } from "@/components/ui/button";
import { updateTaskArchivedAction } from "../_actions/update-task-archived.action";
import { set } from "mongoose";

const UnarchiveTaskPopover = ({ task }: { task: TaskDto }) => {
  const unarchiveFormObject = {
    id: task.id,
    archived: false,
    projectId: task.project,
  };
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger className="w-full hover:bg-secondary p-2 rounded-md">
          <div className="py-1 px-1 text-xs text-left ">
            {task.name}
            <span className="sr-only">Activate Task Menu Trigger</span>
          </div>
        </PopoverTrigger>{" "}
        <PopoverContent className="p-0 border-0 rounded-lg">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Activate Task</CardTitle>
            </CardHeader>
            <CardDescription className="p-4 mb-2 ">
              <p> Are you sure you want to activate this task? </p>
            </CardDescription>
            <CardFooter className="w-full flex flex-row justify-evenly">
              <Button
                className="text-sm "
                variant="default"
                onClick={() => {
                  updateTaskArchivedAction(unarchiveFormObject);
                  setIsOpen(false);
                }}
              >
                Activate
              </Button>
              <Button
                className="text-sm "
                variant="outline"
                onClick={() => {
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

export default UnarchiveTaskPopover;
