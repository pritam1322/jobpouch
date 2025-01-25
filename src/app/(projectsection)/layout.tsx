
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import SessionWrapper from "@/components/SessionWrapper";
import { Provider } from "@/lib/reactQuery-provider";
import { Analytics } from '@vercel/analytics/next';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ProjectSidebar } from "@/components/sidebars/ProjectSideBar";

export const metadata: Metadata = {
  title: "JobPouch App",
  description: "job tracking app",
};

export default function JobLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-neutral-800">
      <body className="pb-10">
        <SessionWrapper >
          <Provider>
            <Toaster />
            <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SidebarProvider>
            <ProjectSidebar />
              <SidebarTrigger />
              <div className="flex w-full mx-auto">
                {children}
              </div>
            </SidebarProvider>
            </ThemeProvider>
            <Analytics />
          </Provider>
        </SessionWrapper>
      </body>
    </html>
  );
}
