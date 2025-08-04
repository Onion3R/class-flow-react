
import { 
  Calendar,
  Home, 
  CalendarCog ,
  CalendarPlus,
  Library, 
  Users,   
  AudioWaveform,
  MessageSquare,
  GalleryVerticalEnd,
  ChartNoAxesGantt,
  LayoutGrid} from "lucide-react"
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
} from  "@/Components/ui/sidebar";
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
      name: "Instructor Panel",
      logo: AudioWaveform,
      plan: "Startup",
      url: "/dashboard",
      role: "Instructor"
    },
  ],
  sidebarItems: [
      {
        label: 'Application',
        items: [
            {
                title: "Home",
                url: "/admin",
                icon: Home,
              },
              {
                title: "Team",
                url: "team",
                icon: Users,
              },
              {
                title: "Subjects",
                url: "subject",
                icon: Library,
            },   
            {
                title: "Programs",
                url: "programs",
                icon: ChartNoAxesGantt,
            } ,
            {
                title: "Rooms",
                url: "room",
                icon: LayoutGrid,
            }    
          ]
      },
      {
        label: 'Schedule',
        items: [
            {
                title: "Create Schedule",
                url: "create-schedule",
                icon: CalendarPlus,
              },
            {
                title: "Generate Schedule",
                url: "generate-schedule",
                icon: CalendarCog,
              },
              {
                title: "Scedules",
                url: "schedules",
                icon: Calendar,
                subLink: [
                  { title: "Grade 11", url: `${baseUrl}/junior` },
                  { title: "Grade 12", url: `${baseUrl}/senior` },
                ]
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