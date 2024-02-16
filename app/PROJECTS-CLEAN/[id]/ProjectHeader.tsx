import { ProjectDto } from "@/use-cases/project/types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProjectDetailsAction } from "@/app/PROJECTS-CLEAN/_actions/update-project-details.action.";
import { useState } from "react";
const formSchema = z.object({
  name: z.string().min(4).max(20),
  description: z.string().min(4).max(80),
});

export function ProjectHeader({ project }: { project: ProjectDto }) {
  const [buttonShow, setButtonShow] = useState(false);
  const [headerText, setHeaderText] = useState(project.name);
  const [descriptionText, setDescriptionText] = useState(project.description);
  const [isHeaderEditing, setIsHeaderEditing] = useState(false);
  const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);

  const handleHeaderClick = () => {
    setIsHeaderEditing(true);
  };
  const handleDescriptionClick = () => {
    setIsDescriptionEditing(true);
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setButtonShow(true);
    setHeaderText(event.target.value);
  };

  const handleDescriptionInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setButtonShow(true);
    setDescriptionText(event.target.value);
  };
  const handleHeaderInputBlur = () => {
    setIsHeaderEditing(false);
  };
  const handleDescriptionInputBlur = () => {
    setIsDescriptionEditing(false);
  };
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: project.name,
      description: project.description,
    },
  });
  const onNewProjectFormSubmit = async (values: z.infer<typeof formSchema>) => {
    await updateProjectDetailsAction(values, project.id);
    setButtonShow(false);
    console.log("values", values);
    router.refresh();
  };
  return (
    <div className="flex items-center gap-4">
      {/* <div className="grid gap-1">
        <h1 className="text-lg font-bold">{project.name}</h1>
        <p className="text-sm font-normal leading-none text-gray-500 dark:text-gray-400">
          {project.description}
        </p>
      </div> */}

      <Form {...form}>
        <form
          className="mt-4 mr-2 "
          onSubmit={form.handleSubmit(onNewProjectFormSubmit)}
        >
          <div className="flex flex-row justify-start align-middle">
            <LayoutIcon className="w-8 h-8 self-center mr-5" />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem className="self-center">
                    {/* <FormLabel>Name </FormLabel> */}
                    <FormControl>
                      <Input
                        //  placeholder=" project name" type="text" {...field}
                        type="text"
                        className={`header-input ${
                          isHeaderEditing ? "editing" : ""
                        }`}
                        value={headerText}
                        placeholder="Task"
                        onClick={handleHeaderClick}
                        onChange={handleInputChange}
                        onBlur={handleHeaderInputBlur}
                        readOnly={!isHeaderEditing}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />{" "}
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => {
              return (
                <FormItem className="mt-2">
                  {/* <FormLabel className="text-xs text-gray-600">
                    {" "}
                    Description
                  </FormLabel> */}
                  <FormControl>
                    <Textarea
                      // placeholder=" project description" {...field}

                      className={`description-input resize-none ${
                        isDescriptionEditing ? "editing" : ""
                      }`}
                      value={descriptionText}
                      placeholder="Description"
                      onClick={handleDescriptionClick}
                      onChange={handleDescriptionInputChange}
                      onBlur={handleDescriptionInputBlur}
                      readOnly={!isDescriptionEditing}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          {buttonShow && <Button type="submit">Submit</Button>}
        </form>
      </Form>
    </div>
  );
}

//@ts-expect-error
function LayoutIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <line x1="3" x2="21" y1="9" y2="9" />
      <line x1="9" x2="9" y1="21" y2="9" />
    </svg>
  );
}
