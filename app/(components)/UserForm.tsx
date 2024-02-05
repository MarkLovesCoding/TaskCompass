"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
interface FormData {
  name?: string;
  email?: string;
  password?: string;
  role: string;
  firstLogIn: boolean;
}
const UserForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    role: "Email User",
    firstLogIn: true,
  });
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target?.value;
    const name = e.target?.name;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log("form submitted_________________", formData);
    const res = await fetch("/api/Users", {
      method: "POST",
      body: JSON.stringify({ formData }),
      headers: {
        "content-type": "application/json",
      },
    });
    if (!res.ok) {
      const response = await res.json();
      setErrorMessage(response.message);
    } else {
      console.log("RESPONSE AND FORM SUBMITTION:", await res.json());
      router.refresh();
      router.push("/");
    }
  };
  return (
    <>
      <form
        onSubmit={handleSubmit}
        method="post"
        className="flex flex-col gap-3 w-1/2"
      >
        <h1>Create New User</h1>
        <label className="block text-sm font-medium text-gray-300">
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          onChange={handleChange}
          required={true}
          value={formData.name}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        />
        <label className="block text-sm font-medium text-gray-300">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          onChange={handleChange}
          required={true}
          value={formData.email}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        />
        <label className="block text-sm font-medium text-gray-300">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          onChange={handleChange}
          required={true}
          value={formData.password}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        />
        <input
          type="submit"
          value="Create User"
          className="bg-blue-300 hover:bg-blue-100"
        />
      </form>
      <p className="text-red-500">{errorMessage}</p>
    </>
  );
};
export default UserForm;
