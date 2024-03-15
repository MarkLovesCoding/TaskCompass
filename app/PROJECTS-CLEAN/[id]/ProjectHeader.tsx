import { ProjectDto } from "@/use-cases/project/types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { LayoutIcon } from "lucide-react";
import * as z from "zod";
import { useForm, useController } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProjectDetailsAction } from "@/app/PROJECTS-CLEAN/_actions/update-project-details.action.";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(4).max(20),
  description: z.string().min(4).max(80),
});

export function ProjectHeader({ project }: { project: ProjectDto }) {
  const [buttonShow, setButtonShow] = useState(false);
  const [isHeaderEditing, setIsHeaderEditing] = useState(false);
  const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);
  const originalName = project.name;
  const originalDescription = project.description;

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    nameField.onChange(event); // Trigger the onChange event for the field
    setButtonShow(true);
  };

  const handleNameBlur = () => {
    nameField.onBlur(); // Trigger the onBlur event for the field
    setIsHeaderEditing(false);
  };

  const handleNameClick = () => {
    setIsHeaderEditing(true); // Trigger the onClick event for the field
  };
  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    descriptionfield.onChange(event); // Trigger the onChange event for the field
    setButtonShow(true);
  };
  const handleDescriptionBlur = () => {
    descriptionfield.onBlur(); // Trigger the onBlur event for the field
    setIsDescriptionEditing(false);
  };

  const handleDescriptionClick = () => {
    setIsDescriptionEditing(true);
  };

  const handleCancel = () => {
    const currentName = form.getValues("name");
    const currentDescription = form.getValues("description");
    if (currentName !== originalName) {
      form.setValue("name", originalName);
    }
    if (currentDescription !== originalDescription) {
      form.setValue("description", originalDescription);
    }
    setButtonShow(false);
  };

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: project.name,
      description: project.description,
    },
  });
  const { field: nameField } = useController({
    name: "name", // Name of the field you want to control
    control: form.control, // Pass the form control from useForm
    defaultValue: project.name, // Default value for the field
    rules: {
      // Optional rules for validation
      minLength: 4,
      maxLength: 25,
    },
  });
  const { field: descriptionfield } = useController({
    name: "description", // Name of the field you want to control
    control: form.control, // Pass the form control from useForm
    defaultValue: project.description, // Default value for the field
    rules: {
      // Optional rules for validation
      minLength: 4,
      maxLength: 75,
    },
  });
  const onNewProjectFormSubmit = async (values: z.infer<typeof formSchema>) => {
    await updateProjectDetailsAction(values, project.id);
    setButtonShow(false);
    console.log("values", values);
    router.refresh();
  };
  return (
    <div className="flex items-start   mobileLandscape:max-w-[50%] border-secondary border-solid border-[1px]  rounded-lg p-2">
      <Form {...form}>
        <form
          className=" mr-2 w-full"
          onSubmit={form.handleSubmit(onNewProjectFormSubmit)}
        >
          <div className="flex flex-row justify-start align-middle">
            <LayoutIcon className=" h-6 w-6   self-center mr-2" />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem className="self-center">
                    <FormControl>
                      <Input
                        type="text"
                        className={`header-input text-lg ${
                          isHeaderEditing ? "editing" : ""
                        }`}
                        placeholder="Task"
                        {...field}
                        onClick={handleNameClick}
                        onChange={handleNameChange}
                        onBlur={handleNameBlur}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />{" "}
          </div>
          <div className="flex flex-col mobileLandscape:flex-row w-full">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => {
                return (
                  <FormItem className="mt-2 mb-2  mr-2   min-w-[66%]  mobileLandscape:max-w-[66%] max-h-16">
                    <FormControl>
                      <Textarea
                        className={`description-input max-h-16 overflow-hidden resize-none mobileLandscape:text-xs ${
                          isDescriptionEditing ? "editing" : ""
                        }`}
                        spellCheck="false"
                        maxLength={75}
                        placeholder="Description"
                        {...field}
                        onClick={handleDescriptionClick}
                        onChange={handleDescriptionChange}
                        onBlur={handleDescriptionBlur}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            {buttonShow && (
              <div className="flex ml-4 flex-row mobileLandscape:flex-col mt-2 mobileLandscape:mt-0 justify-space ">
                <Button className="m-1  text-xs  h-8 px-2 " type="submit">
                  Save
                </Button>{" "}
                <Button
                  className="m-1 text-xs d h-8 px-2 "
                  type="button"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
