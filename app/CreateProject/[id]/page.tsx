import { getServerSession } from "next-auth";
import { options } from "../../api/auth/[...nextauth]/options.js";
import { redirect } from "next/navigation";
import { CreateProjectForm } from "../../(components)/CreateProjectForm.jsx";
type ParamsType = {
  id: string;
};
const CreateProject = async ({ params }: { params: ParamsType }) => {
  const { id } = params;
  const session = await getServerSession(options);
  if (!session) {
    redirect(`/api/auth/signin?callbackUrl=/CreateProject/${id}`);
  }

  return (
    <div>
      <CreateProjectForm userId={id} />
    </div>
  );
};

export default CreateProject;
