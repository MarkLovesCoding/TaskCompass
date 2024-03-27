"use client";
import { MoonIcon, SunIcon } from "lucide-react";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/lib/utils/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-10 w-[4.25em] shrink-0 relative cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-accent",

      className
    )}
    {...props}
    ref={ref}
  >
    <SunIcon className=" absolute h-[1.4rem] text-yellow-300 fill-yellow-300 w-[1.4rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 right-[2.4rem]" />
    <MoonIcon className="  absolute text-yellow-300 fill-yellow-300 h-[1.4rem] w-[1.4rem] rotate-90 scale-0 transition-all left-[2.4rem] dark:rotate-0 dark:scale-100" />
    <SwitchPrimitives.Thumb
      className={cn(
        // "pointer-events-none  h-8 w-8 flex align-middle items-center justify-center rounded-full dark:bg-primary bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-8 data-[state=unchecked]:translate-x-0"
        "pointer-events-none block h-8 w-8 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-8 data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
