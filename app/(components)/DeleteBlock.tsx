"use client";
import { faClose, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnyExpression } from "mongoose";
import { useRouter } from "next/navigation";
const DeleteBlock = ({ id, userId }: { id: any; userId: string }) => {
  const router = useRouter();
  const deleteTask = async () => {
    const response = await fetch(`/api/Tasks/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      router.push(`/Tasks/User/${userId}`);
      router.refresh();
    }
  };

  return (
    <div>
      <FontAwesomeIcon
        icon={faX}
        className="text-red-400 hover:cursor-pointer hover:text-red-200"
        onClick={deleteTask}
      />
    </div>
  );
};

export default DeleteBlock;
