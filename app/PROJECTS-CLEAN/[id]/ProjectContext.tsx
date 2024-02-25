"use client";
import { UserDto } from "@/use-cases/user/types";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface ProjectContextType {
  projectUsers: UserDto[];
  setProjectUsers: React.Dispatch<React.SetStateAction<UserDto[]>>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [projectUsers, setProjectUsers] = useState<UserDto[]>([]);

  return (
    <ProjectContext.Provider
      value={{
        projectUsers,
        setProjectUsers,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useMyContext must be used within a MyContextProvider");
  }
  return context;
};
