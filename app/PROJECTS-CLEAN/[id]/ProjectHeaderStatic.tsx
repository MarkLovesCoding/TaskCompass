import { ProjectDto } from "@/use-cases/project/types";
import { ArrowBigLeftIcon, LayoutIcon } from "lucide-react";
import Link from "next/link";

export function ProjectHeaderStatic({ project }: { project: ProjectDto }) {
  return (
    <div className="flex items-center gap-4 cursor-default">
      <Link href={`/TEAMS-CLEAN/${project.team}`}>
        <ArrowBigLeftIcon className="w-8 h-8 self-start cursor-pointer" />
      </Link>
      <div className="mt-4 mr-2 ">
        <div className="flex flex-row justify-start align-middle">
          <LayoutIcon className="w-8 h-8 self-center mr-5" />
          <div className="self-center">
            <p className={`header-input`}>{project.name}</p>
          </div>
        </div>
        <div className="mt-2">
          <p className={`description-input `}>{project.description}</p>
        </div>
      </div>
    </div>
  );
}
