
import { Calendar, Home, CalendarCog , Library, Users } from "lucide-react"
import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenuSub
} from  "@/Components/ui/sidebar";
import Schedule from "@/Schedule";
 
// Menu items.
const SidbarItems = [
  {
    label: 'Application',
    items: [
        {
            title: "Home",
            url: "/",
            icon: Home,
          },
          {
            title: "Team",
            url: "/page1",
            icon: Users,
          },
          {
            title: "Subjects",
            url: "/subject",
            icon: Library,
        }    
      ]
  },
  {
    label: 'Schedule',
    items: [
       {
    title: "Generate Schedule",
    url: "#",
    icon: CalendarCog,
    },
    {
      title: "Scedules",
      url: "#",
      icon: Calendar,
      subLink: [
        {
          title: 'Freshmen',
          url: "/page2",
        },
        {
          title: 'Sophomore',
          url: "/page2",
        },
        {
          title: 'Junior',
          url: "/page2",
        },
        {
          title: 'Senior',
          url: "/page2",
        },

      ]
    },
    ]
  }
  
 
]
 
export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
          {SidbarItems.map((sidebarItems) => (
            <SidebarGroup key={sidebarItems.label}>
              <SidebarGroupLabel>{sidebarItems.label}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {sidebarItems.items.map((item) => (
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
    </Sidebar>
  )
}