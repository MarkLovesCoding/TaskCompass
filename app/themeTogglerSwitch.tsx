"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch-theme";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { setTheme } = useTheme();
  const currentTheme = localStorage.getItem("theme");
  const [checked, setChecked] = React.useState<boolean>();
  React.useEffect(() => {
    if (currentTheme == "dark") {
      setTheme("dark");
      setChecked(false);
    } else if (currentTheme == "light") {
      setTheme("light");
      setChecked(true);
    } else {
      setTheme("dark");
      setChecked(false);
    }
  }, []);
  React.useEffect(() => {
    localStorage.setItem("theme", checked ? "light" : "dark");
  }, [checked]);

  const handleCheckedChange = () => {
    const newValue = !checked; // Calculate the new value before setting it

    if (newValue) {
      setTheme("light"); // If the new value is false, set the theme to "light"
      toast.success("Light Mode Activated");
    } else {
      setTheme("dark"); // If the new value is true, set the theme to "dark"
      toast.success("Dark Mode Activated");
    }
    // setChecked(newValue)
    setTimeout(() => setChecked(newValue), 10); // Set the state with the new value
  };
  return (
    <>
      <div className="flex flex-row space-x-4 items-center">
        <Switch
          checked={checked}
          onCheckedChange={handleCheckedChange}
          id="dark-mode"
        />
        <Label htmlFor="dark-mode">Theme </Label>
      </div>
      {/* <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu> */}
    </>
  );
}
