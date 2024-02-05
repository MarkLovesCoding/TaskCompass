import React, { useEffect, useState } from "react";
import { UserType, TaskType, ProjectType } from "../types/types";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserCardSmall from "./UserCardSmall";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
type VerboseUserType = Omit<UserType, "tasks" | "projects" | "connections"> & {
  tasks: TaskType[];
  projects: ProjectType[];
  connections: UserType[];
};

const UserCardLarge = async ({ user }: { user: VerboseUserType }) => {
  return (
    <>
      <div className=" items-start justify-center gap-6 rounded-lg p-8 md:grid lg:grid-cols-2 xl:grid-cols-3">
        <div className="mb-10 flex justify-center flex-col items-center">
          <div className="justify-center mb-4 grid grid-flow-row lg:auto-cols-2 xl:auto-cols-4 ">
            <UserCardSmall userData={user._id as string} />
          </div>
        </div>
        <div className="mb-2 flex justify-center flex-col items-center">
          <Card className=" p-5 flex justify-center flex-col">
            <Link
              href={`/Tasks/User/${user._id}`}
              style={{ display: "contents" }}
            >
              <CardHeader>
                <div>
                  <CardTitle>Tasks</CardTitle>
                  <CardDescription>Active </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="grid gap-6">
                {user.tasks.length > 0
                  ? user.tasks?.map((task, task_idx) => (
                      <Link
                        key={`link-${task_idx}`}
                        href={`/TaskPage/${task._id}`}
                        style={{ display: "contents" }}
                      >
                        <div
                          key={task_idx}
                          className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground"
                        >
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {task.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {task.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))
                  : "None"}
              </CardContent>
            </Link>
          </Card>
        </div>
        <div className="mb-2 flex justify-center flex-col items-center">
          <Card className=" p-5 flex justify-center flex-col items-center">
            <Link
              href={`/Projects/User/${user._id}`}
              style={{ display: "contents" }}
            >
              <CardHeader>
                <div>
                  <CardTitle>Projects</CardTitle>
                  {/* <CardDescription>User's Projects</CardDescription> */}
                </div>
              </CardHeader>
              <CardContent className="grid gap-6">
                {user.projects?.map((project, project_idx) => (
                  <Link
                    key={`link-${project_idx}`}
                    href={`/Projects/${project._id}`}
                    style={{ display: "contents" }}
                  >
                    <div
                      key={project_idx}
                      className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {project.name}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          {/* {project} */}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Link>
          </Card>
        </div>
        <div className="mb-2 flex justify-center flex-col items-center">
          <Card className=" p-5 flex justify-center flex-col items-center">
            <CardHeader>
              <div>
                <CardTitle>Connections</CardTitle>
                {/* <CardDescription>Availabl</CardDescription> */}
              </div>
            </CardHeader>
            <CardContent className="grid gap-6">
              {user.connections.length > 0 ? (
                user.connections?.map((connection, connection_idx) => (
                  <p key={connection_idx} className="whitespace-pre-wrap">
                    {connection.email}
                  </p>
                ))
              ) : (
                <CardDescription>No Available Connections</CardDescription>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default UserCardLarge;
