'use client';

import { AppSidebar } from "./SideBarSection";
import { SidebarProvider } from "@/components/ui/sidebar"
import { useTheme } from "next-themes"

export default function AIToolsPage(){
    const { setTheme } = useTheme()
    setTheme("dark");
    return (
        <section className="mt-8 max-w-4xl mx-auto justify-center text-white">

        </section>
    )
}