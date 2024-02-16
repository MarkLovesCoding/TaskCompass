"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface ProjectContextType {
  isNewTaskOpen: boolean;
  handleNewTaskSubmitClose: (value: boolean) => void;
  isUpdateTaskOpen: boolean;
  handleUpdateTaskSubmitClose: (value: boolean) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isNewTaskOpen, setIsNewTaskOpen] = useState<boolean>(false);

  const handleNewTaskSubmitClose = (value: boolean) => {
    setIsNewTaskOpen(value);
  };
  const [isUpdateTaskOpen, setIsUpdateTaskOpen] = useState<boolean>(false);

  const handleUpdateTaskSubmitClose = (value: boolean) => {
    setIsUpdateTaskOpen(value);
  };

  return (
    <ProjectContext.Provider
      value={{
        isNewTaskOpen,
        handleNewTaskSubmitClose,
        isUpdateTaskOpen,
        handleUpdateTaskSubmitClose,
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
