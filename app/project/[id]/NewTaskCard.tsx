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
import { toast } from "sonner";
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
  const handleNameBlur = () => {
    // nameField.onBlur();
    setIsHeaderEditing(false);
  };

  const handleNameClick = () => {
    setIsHeaderEditing(true); // Trigger the onClick event for the field
  };
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
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      await createNewTaskAction(values);
      toast.success("Task created successfully");
      router.refresh();
    } catch (error) {
      toast.error("Error creating task");
      console.error(error);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          method="post"
          className="grid gap-6 w-full max-w-md mx-auto  p-6"
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
                    maxLength={25}
                    spellCheck="false"
                    type="text"
                    {...field}
                    onClick={handleNameClick}
                    onChange={field.onChange}
                    onBlur={handleNameBlur}
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
                className="m-auto flex justify-center hover:border-white border-transparent border-2 align-middle w-fit"
              >
                Create New
              </Button>
            </PopoverClose>{" "}
            <PopoverClose asChild>
              <Button
                type="button"
                variant="ghost"
                className="m-auto flex justify-center hover:border-white border-2  border-transparent align-middle w-fit"
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
