"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import getUsersAvailable from "@/app/utils/getUsers";

export const AddUserToProjectForm = ({ userId }) => {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState({});
  const [usersEmailList, setUsersEmailList] = useState(["Add User Email..."]);
  const [usersList, setUsersList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [displayAddEmail, setDisplayAddEmail] = useState(true);

  // const [newProject, setNewProject] = useState({tickets:[],users:[]});
  const [errorMessage, setErrorMessage] = useState("");
  // useEffect(() => {
  //   const users = getUsersAvailable(session.user.id);
  //   setUsersList((prevState) => [prevState, ...users]);
  // }, []);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getUsersAvailable(userId);
        const userEmails = users.map((user) => user.email);
        setUsersEmailList((prevState) => [...prevState, ...userEmails]);
        setUsersList((prevState) => [...prevState, ...users]);
      } catch (error) {
        console.error("Error fetching users:", error);
        // Handle error, set appropriate state if needed
      }
    };

    fetchUsers();
  }, [userId]);
  const handleChange = (e) => {
    const value = e.target?.value;
    const name = e.target?.name;
    setUserEmail((prevState) => ({
      [name]: value,
    }));
  };
  const handleUserLookUpChange = (e) => {
    const value = e.target?.value;
    if (value == "Add User Email...") {
      setDisplayAddEmail(true);
      setSelectedUser(null);
    } else {
      setDisplayAddEmail(false);
      setSelectedUser(usersList.find((user) => user.email === value));
    }
    setUserEmail((prevState) => ({
      email: value,
    }));
  };
  const handleSubmit = async (e) => {
    console.log("userEmail____", userEmail.email);
    e.preventDefault();
    setErrorMessage("");
    let connectionId;
    if (displayAddEmail) {
      try {
        const res = await fetch(`/api/Users/LookupByEmail`, {
          method: "POST",
          body: JSON.stringify({ email: userEmail.email }),
          headers: {
            "content-type": "application/json",
          },
        });
        console.log("RES_____", res);
        if (!res.ok) {
          const response = await res.json();
          setErrorMessage(response.message);
        } else {
          const { user } = await res.json();
          console.log("User found:", user);
          connectionId = user._id;
          // Handle the found user as needed
          console.log("CONNECTIONID__________", connectionId);
        }
      } catch (error) {
        console.error("An error occurred:", error);
        setErrorMessage("An error occurred while processing your request.");
      }
    }
    const res = await fetch(`/api/AddConnection/`, {
      method: "POST",
      body: JSON.stringify({ userId: userId, connectionId: connectionId }),
      headers: {
        "content-type": "application/json",
      },
    });
    if (!res.ok) {
      const response = await res.json();
      console.log("WHAT HAPPENED HERE");
      setErrorMessage(response.message);
    } else {
      console.log("RESPONSE________", res);
      router.refresh();
      router.push(`/UserPage/${userId}`);
    }
  };
  return (
    <>
      <form
        onSubmit={handleSubmit}
        method="post"
        className="flex flex-col gap-3 w-1/2"
      >
        {/* <h1>Add Connection</h1> */}
        {/* <label>Add to Project (optional..)</label> */}
        <select onChange={handleUserLookUpChange}>
          {usersEmailList.map((email, email_idx) => (
            //@ts-ignore
            <option key={email_idx} value={email}>
              {email}
            </option>
          ))}
        </select>
        {displayAddEmail && (
          <>
            <label>Email</label>
            <input
              id="email"
              name="email"
              type="email"
              onChange={handleChange}
              value={userEmail.userName}
              className="m-2 bg-slate-400 rounded"
            />
          </>
        )}
        <input type="submit" value="Add User" />
      </form>
      <p className="text-red-500">{errorMessage}</p>
    </>
  );
};
export default AddUserToProjectForm;
