
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./Components/SideBar/regular-app-sidebar";
import { SidebarProvider, useSidebar } from "./Components/ui/sidebar"

export default function UserLayout() {
  return (
    <SidebarProvider>
      <UserLayoutContent />
    </SidebarProvider>
  );
}

function UserLayoutContent() {
  const { isMobile } = useSidebar();

  return (
    <div className="min-h-screen h-full w-full bg-white">
      {isMobile ? <AppSidebar /> : null}
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}