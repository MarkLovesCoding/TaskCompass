"use client";
import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

import { ProjectType, TaskType, UserType } from "../types/types";
type ExpandedProjectType = Omit<ProjectType, "users" | "tasks"> & {
  users: UserType[];
  tasks: TaskType[];
};
type ExpandedUserType = Omit<UserType, "connections" | "projects"> & {
  connections: UserType[];
  projects: ProjectType[];
};
const AddUserButton = ({
  project,
  users,
  defaultUser,
}: {
  project: ExpandedProjectType;
  users: ExpandedUserType[];
  defaultUser: string;
}) => {
  const [errorMessage, setErrorMessage] = useState("");

  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);
  // const [userEmails, setUserEmails] = useState([]);
  const [userSelected, setUserSelected] = useState<ExpandedUserType>();
  const [userIdSelected, setUserIdSelected] = useState<string>();
  const [usersAvailable, setUsersAvailable] =
    useState<ExpandedUserType[]>(users);

  // useEffect(() => {
  //   console.log("USERS LOADED on LOAD", users);

  //   // Assuming defaultUser is the ID you want to exclude
  //   // const defaultUser = "yourDefaultUserId";

  //   const uniqueUserSet = new Set(
  //     usersAvailable.filter((user) => user._id !== defaultUser)
  //   );

  //   const uniqueUserArray = Array.from(uniqueUserSet);

  //   setUsersAvailable((prevState) => {
  //     // Maintain the initial default and append the unique emails
  //     return [...uniqueUserArray];
  //   });
  // }, []);

  // useEffect(() => {
  //   console.log("USERS LOADED on LOAD", users);
  //   const emails = usersAvailable
  //     .filter((user) => user._id !== defaultUser)
  //     .map((user) => user.email);
  //   setUserEmails((prevState) => {
  //     return [...prevState, ...emails];
  //   });
  // }, []);

  useEffect(() => {
    const selectedUser = users.find((user) => user._id === userIdSelected);
    setUserSelected(selectedUser);
  }, [userIdSelected, users]);
  const router = useRouter();
  const checkIfUserInProject = () => {
    console.log("User Selected", userSelected);
    const isUserInProject = project.users.some(
      (user) => user.email == userIdSelected
    );
    return isUserInProject;
  };
  const addUserToProject = async () => {
    // e.preventDefault();
    console.log("form submitted_________________", userSelected);
    const res = await fetch("/api/AddUserToProject", {
      method: "POST",
      body: JSON.stringify({ userSelected, project }),
      headers: {
        "content-type": "application/json",
      },
    });
    if (res.status == 409) {
      setErrorMessage("User already in project");
      // const response = await res.json();
    } else {
      console.log("RESPONSE AND FORM SUBMITTION:", await res.json());
      router.push(`/Projects/${project._id}`);
      router.refresh();
    }
  };
  const handleButtonClick = async () => {
    if (isActive) {
      if (!checkIfUserInProject() && !project.isDefault) {
        await addUserToProject();
      }

      setIsActive(false);
      setIsHovered(false);

      // Additional logic for when a user is added (to be implemented)
    } else {
      setIsActive(true);
    }
  };
  const handleSelectChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLOptionElement | HTMLInputElement>
  ) => {
    setUserIdSelected(e.target.value);
    console.log("USER SELETED:,", userSelected);
  };
  return (
    <>
      <div
        className={`    ${
          isActive ? " flex   rounded-[25px] flex-row w-full justify-end" : ""
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          // setIsHovered(false);
          // setIsActive(false);
        }}
      >
        {isActive && (
          <div
            className={`     ${
              isActive
                ? " transition-[width] flex  mr-[10px] align-middle w-[250px]  h-[50px] box-border   rounded-[25px] "
                : "w-0"
            }`}
          >
            <select
              className=" text-xs w-[250px] p-1  rounded-[25px] "
              onChange={handleSelectChange}
            >
              <option className="text-xs ">
                {"Select User to Add to Project"}
              </option>
              {users.map((user, user_idx) => (
                <option
                  className="text-xs "
                  key={user_idx}
                  value={user._id as string}
                >
                  {user.email}
                </option>
              ))}
            </select>
          </div>
        )}
        <button
          className={`w-[50px] h-[50px] rounded-full  flex items-center justify-center cursor-pointer focus:outline-none transition-transform transform hover:bg-slate-700`}
          onClick={handleButtonClick}
        >
          <FontAwesomeIcon icon={faPlus} className={"text-red-200"} />
        </button>
      </div>
      <p className="text-red-500">{errorMessage}</p>
    </>
  );
};

// export default AddUserButton;

// export default AddUserButton;

export default AddUserButton;
