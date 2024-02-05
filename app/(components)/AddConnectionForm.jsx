"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import getUsersAvailable from "@/app/utils/getUsers";

const AddConnectionForm = ({ userId }) => {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState({});
  const [usersEmailList, setUsersEmailList] = useState(["Add User Email..."]);
  const [usersList, setUsersList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [displayAddEmail, setDisplayAddEmail] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    console.log();
    const fetchUsers = async () => {
      try {
        const users = await getUsersAvailable(userId);
        const userEmails = users.map((user) => user.email);
        const uniqueEmails = Array.from(
          new Set([...usersEmailList, ...userEmails])
        );

        setUsersEmailList(uniqueEmails);
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

    let connectionUserData;
    if (displayAddEmail) {
      try {
        const res = await fetch(`/api/Users/LookupByEmail`, {
          method: "POST",
          body: JSON.stringify({ email: userEmail.email }),
          headers: {
            "content-type": "application/json",
          },
        });
        if (!res.ok) {
          const response = await res.json();
          setErrorMessage(response.message);
        } else {
          const { user } = await res.json();
          connectionUserData = user._id;
        }
      } catch (error) {
        setErrorMessage("An error occurred while processing your request.");
      }
    } else {
      connectionUserData = selectedUser;
    }
    const res = await fetch(`/api/AddConnection/`, {
      method: "POST",
      body: JSON.stringify({
        userId: userId,
        connectionUserData: connectionUserData,
      }),
      headers: {
        "content-type": "application/json",
      },
    });
    if (!res.ok) {
      const response = await res.json();
      setErrorMessage(response.message);
    } else {
      router.push(`/UserPage/${userId}`);
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
        {/* <h1>Add Connection</h1> */}
        {/* <label>Add to Group (optional..)</label> */}
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
              className="m-2 rounded"
            />
          </>
        )}
        <input type="submit" value="Add User" />
      </form>
      <p className="text-red-500">{errorMessage}</p>
    </>
  );
};
export default AddConnectionForm;
