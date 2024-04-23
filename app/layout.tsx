import "./globals.css";
import type { Metadata, Viewport } from "next";

import { Toaster } from "sonner";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";

import { ThemeProvider } from "@/components/ui/theme-provider";
import Provider from "./(providers)/Providers";
import Navigation from "./Navigation";

config.autoAddCss = false;

export const metadata: Metadata = {
  title: "TaskCompass",
  description: "Created By MarkHalstead.dev",
};
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en" className="bg-nav-background">
      <Provider>
        <body className="bg-background">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Navigation />
            <div>{children}</div>
          </ThemeProvider>
          <Toaster />
        </body>
      </Provider>
    </html>
  );
}
