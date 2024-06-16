import React from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Trash2Icon } from "lucide-react";
import { ProjectDto } from "@/use-cases/project/types";
import { TaskDto } from "@/use-cases/task/types";

import { deleteTaskAction } from "@/app/project/_actions/delete-task.action";
import { ValidationError } from "@/use-cases/utils";

const DeleteTaskConfirmAlert = ({
  project,
  task,
}: {
  project: ProjectDto;
  task: TaskDto;
}) => {
  const doesTaskHaveAssignees = task.assignees.length > 0;

  const router = useRouter();
  const onDeleteTaskConfirm = async (taskId: string, projectId: string) => {
    try {
      await deleteTaskAction({ taskId, projectId });
      toast.success(`Task: ${task.name} Deleted Successfully!`);
    } catch (err: any) {
      if (err instanceof ValidationError) {
        toast.error("Validation error: " + err.message);
      } else if (err instanceof Error) {
        toast.error(err.message);
        // restore Task logic TBD//
      } else {
        toast.error(
          "An unknown error occurred while deleting task. Please try again."
        );
      }
    }
  };

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger className="p-2 rounded-full hover:bg-red-500">
          <Trash2Icon />
        </AlertDialogTrigger>
        {!doesTaskHaveAssignees ? (
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{`Are you absolutely sure you want to delete task: ${task.name} ?`}</AlertDialogTitle>
              <AlertDialogDescription>
                {` This action cannot be undone. This will permanently delete the task. If you don't want to delete you can always archive the task instead.`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="w-full flex flex-row space-between">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  onDeleteTaskConfirm(task.id, project.id);
                }}
              >
                Delete Task
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        ) : (
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{`Cannot Delete Task: ${task.name}.`}</AlertDialogTitle>
              <AlertDialogDescription>
                {`Task still has ${task.assignees.length} assignees. Please remove assignees first to delete the task.`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        )}
      </AlertDialog>
    </>
  );
};

export default DeleteTaskConfirmAlert;
