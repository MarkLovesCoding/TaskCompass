"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProjectDto } from "@/use-cases/project/types";
import { createNewTaskAction } from "../_actions/create-new-task.action";
import { useRouter } from "next/navigation";
import { PopoverClose } from "@radix-ui/react-popover";
type TaskFormProps = {
  project: ProjectDto;
};

const formSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  project: z.string(),
});

// let renderCount = 0;
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
    },
  });

  const { register, control } = form;
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    createNewTaskAction(values);

    router.refresh();
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          method="post"
          className="grid gap-6 w-full max-w-md mx-auto bg-transparent p-6"
        >
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
                variant="ghost"
                className="m-auto flex justify-center align-middle w-fit"
              >
                Close
              </Button>
            </PopoverClose>
          </div>
        </form>
      </Form>
    </>
  );
};
