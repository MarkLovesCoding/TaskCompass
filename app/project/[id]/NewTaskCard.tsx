"use client";
import React, { Fragment, use, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import {
  PopoverTrigger,
  PopoverContent,
  Popover,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils/utils";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import * as z from "zod";
import { useController, useWatch } from "react-hook-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProjectDto } from "@/use-cases/project/types";
import { TaskDto } from "@/use-cases/task/types";
import { createNewTaskAction } from "../_actions/create-new-task.action";
import { updateTaskAction } from "../_actions/update-task.action";
import { useRouter } from "next/navigation";
import { updateTaskUsersAction } from "../_actions/update-task-users.action";
import { PopoverClose } from "@radix-ui/react-popover";
type TaskFormProps = {
  project: ProjectDto;
  // onSubmit: (data: TaskType) => void;
};

const formSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  project: z.string(),
});

let renderCount = 0;
export const NewTaskCard: React.FC<TaskFormProps> = ({ project }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHeaderEditing, setIsHeaderEditing] = useState(false);

  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      name: "New Task Name",
      project: project.id,
      // description: isNewTask ? "Describe your task here" : task.description,
    },
  });

  const { register, control } = form;
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("form submitted: ", values);
    setIsSubmitting(true);

    // handleNewTaskSubmitClose(false);
    createNewTaskAction(values);

    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(values, null, 2)}</code>
    //     </pre>
    //   ),
    // });
    router.refresh();
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          method="post"
          className="grid gap-6 w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-gray-800"
        >
          {/* <Card className="w-full max-w-md p-4 md:p-8 grid gap-4">
            <CardHeader> */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormControl>
                  <Input
                    className={`header-input text-base ${
                      isHeaderEditing ? "editing" : ""
                    }`}
                    placeholder="Task Name"
                    maxLength={20}
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* </CardContent> */}
          {/* </Card> */}
          {/* <Button
            type="submit"
            className="m-auto flex justify-center align-middle w-fit"
            disabled={isSubmitting}
          >
            {"Create Task"}
          </Button> */}
          <div className="flex justify-between">
            <PopoverClose asChild>
              <Button
                type="submit"
                className="m-auto flex justify-center align-middle w-fit"
              >
                Create New
              </Button>
            </PopoverClose>{" "}
            <PopoverClose asChild>
              <Button
                type="button"
                className="m-auto flex justify-center align-middle w-fit"
              >
                Close
              </Button>
            </PopoverClose>
          </div>
          {/* <DialogClose asChild>
            <Button
              type="button"
              className="m-auto flex justify-center align-middle w-fit"
            >
              Close
            </Button>
          </DialogClose> */}
        </form>
      </Form>
    </>
  );
};
