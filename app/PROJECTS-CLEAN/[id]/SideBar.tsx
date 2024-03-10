import {
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import React from "react";
import { Button } from "@/components/ui/button";

const SideBar = () => {
  return (
    <div>
      {" "}
      <DrawerContent className="h-full w-[400px] fixed bottom-0 left-0">
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose>
            <Button variant="outline">X</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </div>
  );
};

export default SideBar;
