'use client';
import { Calendar, ChevronsLeftRight, ChevronsUpDown, Home, Inbox, MailPlus, UserPen } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu"
import { useSession } from "next-auth/react"
import Link from "next/link";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Applied Jobs",
    url: "viewJobApplication",
    icon: Inbox,
  },
  {
    title: "Email tracker",
    url: "/emailJobApplication",
    icon: MailPlus,
  },
  {
    title: "Project Section",
    url: "/projects",
    icon: Calendar,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: UserPen,
  }
]

export function ProjectSidebar() {

  const { data: session } = useSession();
  const candidateName = session?.user.name ? session?.user.name.split(' ')[0] : 'Username';

  return (
    <Sidebar>
        <SidebarHeader>
            <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                <DropdownMenuTrigger asChild className="min-h-10 text-md">
                    <SidebarMenuButton>
                    JobPouch
                    <ChevronsLeftRight className="ml-auto" />
                    </SidebarMenuButton>
                </DropdownMenuTrigger>
                </DropdownMenu>
            </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
        <SidebarGroupLabel>Job Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="py-7">
                    <Avatar >
                      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar> { candidateName }
                      <ChevronsUpDown className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem>
                  <Link href='/' >Home</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href='/profile' >Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
    </Sidebar>
  )
}
