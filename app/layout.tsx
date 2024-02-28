import type { Metadata, Viewport } from "next";
import "./globals.css";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import Navigation from "./(components)/Navigation";
import AuthProvider from "./(components)/AuthProvider";
import { ThemeProvider } from "@/components/ui/theme-provider";
import QueryProvider from "./utils/Providers";
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
    <html suppressHydrationWarning lang="en">
      <AuthProvider>
        <QueryProvider>
          {/* <QueryClientProvider client={new QueryClient()}> */}
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
          </body>
        </QueryProvider>
        {/* </QueryClientProvider> */}
      </AuthProvider>
    </html>
  );
}
