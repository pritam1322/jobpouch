import { BotMessageSquare, Calendar, ChevronsLeftRight, Home, Inbox } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"


// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Applied Jobs",
    url: "/viewJobApplication",
    icon: Inbox,
  },
  {
    title: "Job Summarization",
    url: "/job-summarization",
    icon: BotMessageSquare,
  },
  {
    title: "Email Generation",
    url: "/email-generation",
    icon: Calendar,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
            <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                <DropdownMenuTrigger asChild className="min-h-10">
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
          <SidebarGroupLabel>AI Application</SidebarGroupLabel>
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
