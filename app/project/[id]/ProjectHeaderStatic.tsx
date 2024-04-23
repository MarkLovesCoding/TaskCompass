import { LayoutIcon } from "lucide-react";

import { ProjectDto } from "@/use-cases/project/types";

export function ProjectHeaderStatic({ project }: { project: ProjectDto }) {
  return (
    <div className="flex items-center gap-4 cursor-grab">
      <div className="mt-4 mr-2 ">
        <div className="flex flex-row justify-start    align-middle">
          <LayoutIcon className="w-8 h-8 self-center mr-5" />
          <div className="self-center">
            <p className={`header-input cursor-grab`}>{project.name}</p>
          </div>
        </div>
        <div className="mt-2">
          <p className={`description-input cursor-grab`}>
            {project.description}
          </p>
        </div>
      </div>
    </div>
  );
}
