"use client"

import * as React from "react"
import { ChevronsUpDown, Lock, UnlockKeyhole } from "lucide-react"
import { useAuth } from "@/context/authContext";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function PanelSwitcher({
  panels,
}) {
  const { isMobile } = useSidebar()
  const [activePanels, setActivePanels] = React.useState(panels[0])
  const {isAdmin  } = useAuth();
  if (!activePanels) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <activePanels.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">ClassFlow</span>
                <span className="truncate text-xs">Admin panel</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              IT Department
            </DropdownMenuLabel>
            {panels.map((panel, index) => (
              <DropdownMenuItem
                key={panel.name}
                onClick={() => setActivePanels(panel)}
                className="gap-2 p-2  flex justify-between"
              >
                <div className='flex items-center justify-between'>
                <div className="flex size-6 items-center justify-center mr-1.5 rounded-md border">
                  <panel.logo className="size-3.5 shrink-0 " />
                </div>
                 <Link
                  key={index}
                  to={isAdmin || panel.role !== "Admin" ? panel.url : "#"}
                  className={`flex items-center gap-2 ${
                    !isAdmin && panel.role === "Admin" ? "pointer-events-none text-muted-foreground" : ""
                  }`}
                >
                  {panel.name}
                </Link>
                </div>
                {  !isAdmin && panel.role === "Admin"?
                  <Lock  className="size-3"/>  
                 :  <UnlockKeyhole  className="size-3"/>
                   }
              </DropdownMenuItem>
            ))}
           
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
