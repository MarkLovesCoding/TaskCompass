import TaskCard from "@/app/(components)/TaskCard";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options.js";
import { redirect } from "next/navigation";
import { UserType, ParamsType, TaskType } from "@/app/types/types";

const getUserAndTaskDataById = async (
  id: string
): Promise<{ user: UserType; tasks: TaskType[] } | undefined> => {
  let tasks, user;
  try {
    const res = await fetch(`http://localhost:3000/api/Tasks/User/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch user and Task data");
    }
    // console.log(res);
    const data = await res.json();

    tasks = data.foundTasks;
  } catch (error) {
    console.log(error);
  }
  try {
    const res = await fetch(`http://localhost:3000/api/Users/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch user and Task data");
    }
    // console.log(res);
    const data = await res.json();

    user = data.user;
  } catch (error) {
    console.log(error);
  }
  return { tasks, user };
};

const TasksPageForUser = async ({ params }: { params: ParamsType }) => {
  const session = await getServerSession(options);
  if (!session) {
    redirect(`/api/auth/signin?callbackUrl=/TasksPageForUser/${params.id}`);
  }
  const { tasks, user } = (await getUserAndTaskDataById(params.id)) as {
    user: UserType;
    tasks: TaskType[];
  };
  console.log("user", user);
  console.log("tasks", tasks);
  const uniqueCategories = [
    ...new Set(tasks?.map((task: TaskType) => task.category)),
  ];

  return (
    <div className="p-5 flex justify-center flex-col items-center ">
      <h1>{[user] ? user.name : "No User Found"}</h1>
      <h2 className="pt-4 pb-10">{!tasks && "No "}Tasks Assigned</h2>

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

export default TasksPageForUser;
