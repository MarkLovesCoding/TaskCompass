import TaskCard from "@/app/(components)/TaskCard";
import { getServerSession } from "next-auth";
import { options } from "../../api/auth/[...nextauth]/options.js";
import { redirect } from "next/navigation";
import { ProjectType, ParamsType, TaskType } from "@/app/types/types";

const getProjectAndTaskDataById = async (
  id: string
): Promise<{ project: ProjectType; tasks: TaskType[] } | undefined> => {
  try {
    const res = await fetch(`http://localhost:3000/api/ProjectTasks/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch project and task data");
    }
    // console.log(res);
    const data = await res.json();
    const { foundProject, foundTasks } = data;
    console.log("foundTasks", foundTasks);
    console.log("foundProject", foundProject);
    return { project: foundProject, tasks: foundTasks };
  } catch (error) {
    console.log(error);
  }
};

const ProjectTasks = async ({ params }: { params: ParamsType }) => {
  const session = await getServerSession(options);
  if (!session) {
    redirect(`/api/auth/signin?callbackUrl=/ProjectTasks/${params.id}`);
  }
  const { project, tasks } = (await getProjectAndTaskDataById(params.id)) as {
    project: ProjectType;
    tasks: TaskType[];
  };
  // console.log("project", project);
  // console.log("tasks", tasks);
  const uniqueCategories = [
    ...new Set(tasks?.map((task: TaskType) => task.category)),
  ];

  return (
    <div className="p-5 flex justify-center flex-col items-center ">
      <h1>{project ? project.name : "No project Found"}</h1>
      <h1 className="pt-4 pb-10">Tasks</h1>

      <div className=" flex justify-center flex-col items-center">
        {tasks &&
          uniqueCategories.map((uniqueCategory, categoryIndex) => (
            <div
              key={categoryIndex}
              className="mb-10 flex justify-center flex-col items-center"
            >
              <h2>{uniqueCategory}</h2>
              <div className="justify-center mb-2 grid grid-flow-row lg:grid-cols-2 xl:grid-cols-4">
                {tasks
                  .filter((task) => task.category === uniqueCategory)
                  .map((filteredTask, _filteredTaskIdx) => (
                    <TaskCard
                      //@ts-expect-error
                      id={_filteredTaskIdx}
                      key={_filteredTaskIdx}
                      task={filteredTask}
                    />
                  ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ProjectTasks;
