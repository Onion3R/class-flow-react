
import { 
  Calendar,
  Home, 
  CalendarCog ,
  Library, 
  Users,   
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,} from "lucide-react"
import { Link } from "react-router-dom";
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
  SidebarMenuSub
} from  "@/components/ui/sidebar";


 const sidebarItems = [
      {
        label: 'Application',
        items: [
            {
                title: "Home",
                url: "#",
                icon: Home,
              },
              {
                title: "Team",
                url: "#",
                icon: Users,
              },
              {
                title: "Subjects",
                url: "#",
                icon: Library,
            }    
          ]
      },
  ]
 
export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>

      </SidebarHeader>
      <SidebarContent>
          {sidebarItems.map((sidebarItem) => (
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
    </Sidebar>
  )
}