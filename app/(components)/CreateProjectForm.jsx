"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
export const CreateProjectForm = ({ userId }) => {
  const { data: session } = useSession({
    required: true,

    onUnauthenticated() {
      redirect(`/api/auth/signin?callbackUrl=/CreateProject${userId}`);
    },
  });
  const sessionUserId = session.user.id;
  const router = useRouter();
  const [formData, setFormData] = useState({
    tasks: [],
    users: [userId],
    isDefault: false,
  });

  // const [newProject, setNewProject] = useState({tasks:[],users:[]});
  const [errorMessage, setErrorMessage] = useState("");
  // const userConnections = user.connections;
  console.log(formData);
  const handleChange = (e) => {
    const value = e.target?.value;
    const name = e.target?.name;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  console.log("formData:", formData);
  // const handleAddUser = (e) => {
  //   const value = e.target?.value;

  //   setFormData((prevState) => ({
  //     ...prevState,
  //     addUser: value,
  //   }));
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    const res = await fetch(`/api/CreateProject/${userId}`, {
      method: "POST",
      body: JSON.stringify({ formData }),
      "content-type": "application/json",
    });
    if (!res.ok) {
      const response = await res.json();
      setErrorMessage(response.message);
    } else {
      router.push(`/Projects/User/${userId}`);
      router.refresh();
    }
  };
  return (
    <>
      <form
        onSubmit={handleSubmit}
        method="post"
        className="flex flex-col gap-3 w-1/2"
      >
        <h1>Create New Project</h1>
        <label>Project Name</label>
        <input
          id="name"
          name="name"
          type="text"
          onChange={handleChange}
          required={true}
          value={formData.name}
          className="m-2"
        />

        <input
          type="submit"
          value="Create New Project"
          // className="bg-blue-300 hover:bg-blue-100"
        />
      </form>
      <p className="text-red-500">{errorMessage}</p>
    </>
  );
};
export default CreateProjectForm;
