import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
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
        <PopoverTrigger>
          <div className="py-1 px-1 text-xs">
            {task.name}
            <span className="sr-only">Activate Task Menu Trigger</span>
          </div>
        </PopoverTrigger>{" "}
        <PopoverContent>
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

      {/* <Form {...archivedForm}>
        <form
          ref={archivedFormRef}
          onSubmit={archivedForm.handleSubmit(onArchivedSubmit)}
          method="post"
          className="grid gap-6 w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-gray-800"
        >
          <FormField
            control={archivedForm.control}
            name="archived"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex align-middle">Due Date</FormLabel>
                <Popover open={archivedOpen} onOpenChange={setArchivedOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          "text-muted-foreground"
                        )}
                      >
                        Unarchive User
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Card>
                      <CardHeader>
                        <CardTitle>Unarchive Task</CardTitle>
                      </CardHeader>
                      <CardDescription>
                        Are you sure you want to archive this task?
                      </CardDescription>
                      <CardFooter>
                        <Button
                          variant="outline"
                          onClick={() => {
                            console.log("archived");
                            handleArchivedSubmit();
                          }}
                        >
                          Archive
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            handleArchivedCancel();
                            console.log("cancel");
                          }}
                        >
                          Cancel
                        </Button>
                      </CardFooter>
                    </Card>
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form> */}
    </>
  );
};

export default UnarchiveTaskPopover;
