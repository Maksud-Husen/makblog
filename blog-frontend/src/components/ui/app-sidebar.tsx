import { Home, FileText, LogOut, User } from "lucide-react"
import { useNavigate } from 'react-router-dom'
import { logout as authLogout } from '@/service/auth'

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface AppSidebarProps {
  activeTab: 'dashboard' | 'posts'
  setActiveTab: (tab: 'dashboard' | 'posts') => void
}

export function AppSidebar({ activeTab, setActiveTab }: AppSidebarProps) {
  const navigate = useNavigate()
  const username = localStorage.getItem('username') || 'Admin'

  const handleLogout = () => {
    authLogout()
    navigate('/login')
  }

  const items = [
    {
      title: "Dashboard",
      value: "dashboard" as const,
      icon: Home,
    },
    {
      title: "Posts",
      value: "posts" as const,
      icon: FileText,
    },
  ]

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-0 py-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="md:h-8 md:p-0 !pl-0 !-ml-6" onClick={() => window.location.reload()}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground transition-all group-data-[collapsible=icon]:size-8">
                <span className="text-xl font-bold">M</span>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold">MakBlog</span>
                <span className="truncate text-xs">Admin Panel</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <SidebarGroup className="px-0">
          <SidebarGroupLabel className="!pl-0 pr-2">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    onClick={() => setActiveTab(item.value)}
                    isActive={activeTab === item.value}
                    tooltip={item.title}
                    className="!pl-0 !-ml-6"
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-0 py-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex w-full items-center gap-2 py-1.5 !-ml-6">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <User className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold">{username}</span>
              </div>
              <button 
                className="p-2 hover:bg-sidebar-accent rounded-md transition-colors group-data-[collapsible=icon]:hidden" 
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut className="size-4 text-red-500" />
              </button>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
