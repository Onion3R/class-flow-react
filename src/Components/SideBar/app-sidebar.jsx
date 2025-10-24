
import { 
  Calendar,
  LayoutDashboard, 
  CalendarCog ,
  CalendarPlus,
  Library, 
  Users,   
  AudioWaveform,
  MessageSquare,
  GalleryVerticalEnd,
  LayoutList,
  ChartNoAxesGantt} from "lucide-react"
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarFooter,
  SidebarMenuSub
} from  "@/components/ui/sidebar";
import { PanelSwitcher } from "../PanelSwitcher/panelSwitcher";
const baseUrl = "schedules";
const data2 = {
  info: {
    name: "ClassFlow",
    panel: "Admin panel",
    avatar: "/avatars/shadcn.jpg",
  },
  panels: [
    {
      name: "Admin Panel",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
      url: "/admin",
      role: "Admin" 
    },
    {
      name: "Teacher Panel",
      logo: AudioWaveform,
      plan: "Startup",
      url: "/dashboard",
      role: "Teacher"
    },
  ],
  sidebarItems: [
      {
        label: 'Home',
        items: [
            {
                title: "Dashboard",
                url: "/admin",
                icon: LayoutDashboard,
              },
              {
                title: "Teachers",
                url: "teachers",
                icon: Users,
              },
               {
                title: "Programs",
                url: "programs",
                icon: ChartNoAxesGantt,
            } ,
           
              {
                title: "Subjects",
                url: "subjects",
                icon: Library,
            },   
              {
                title: "Assignment",
                url: "assignments",
                icon: LayoutList,
            },   
           
          ]
      },
      {
        label: 'Schedule',
        items: [
            {
                title: "New Schedule",
                url: "create-schedule",
                icon: CalendarPlus,
              },
            {
                title: "Auto-Generate",
                url: "generate-schedule",
                icon: CalendarCog,
              },
              {
                title: "Schedule List",
                url: "schedules",
                icon: Calendar,
                // subLink: [
                //   { title: "Grade 11", url: `${baseUrl}/junior` },
                //   { title: "Grade 12", url: `${baseUrl}/senior` },
                // ]
            },
        ]
      }
    ]

}
  
    

 
export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
           <PanelSwitcher panels={data2.panels} />
      </SidebarHeader>
      <SidebarContent>
          {data2.sidebarItems.map((sidebarItem) => (
            <SidebarGroup key={sidebarItem.label}>
              <SidebarGroupLabel>{sidebarItem.label}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {sidebarItem.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <Link to={item.url}>
                          <item.icon className="text-lg" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                        { item.subLink && item.subLink.length > 0 && 
                        ( 
                          item.subLink.map((itemSub) => (
                            <SidebarMenuSub key={itemSub.title}>
                            <SidebarMenuSubItem key={itemSub.title}>
                              <SidebarMenuSubButton asChild> 
                                <Link to={itemSub.url}>
                                  <span>{itemSub.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                            </SidebarMenuSub>
                          ))
                        
                        )
                          }
                      </SidebarMenuItem>
                    ))}
                     
                  </SidebarMenu>
                  
                </SidebarGroupContent>
                
            </SidebarGroup>
          ))}
      </SidebarContent>
      <SidebarFooter className=" sm:hidden">
      <Button  variant="outline" >
        <MessageSquare/>Feedback
      </Button>
          </SidebarFooter>
    </Sidebar>
  )
}