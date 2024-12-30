import { Calendar, ChartNoAxesCombined, ChevronsLeftRight, Home, Inbox, UserPen } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuTrigger } from "../ui/dropdown-menu"

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
    title: "AI Tools",
    url: "/aiTools",
    icon: Calendar,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: UserPen,
  },
  {
    title: "Statistics",
    url: "/stats",
    icon: ChartNoAxesCombined,
  },
]

export function CandidateSidebar() {
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
    </Sidebar>
  )
}
