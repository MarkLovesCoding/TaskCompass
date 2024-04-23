"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { toast } from "sonner";
import { Switch } from "@/components/ui/switch-theme";
import { Label } from "@/components/ui/label";

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
    </>
  );
}
