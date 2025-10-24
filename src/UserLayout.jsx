
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./components/SideBar/regular-app-sidebar";
import { SidebarProvider, useSidebar } from "./components/ui/sidebar"
import { MotionWrapper } from "./lib/routing/animation/MotionWrapper";
export default function UserLayout() {
  return (
     <MotionWrapper>
    <SidebarProvider>
      <UserLayoutContent />
    </SidebarProvider>
    </MotionWrapper>
  );
}

function UserLayoutContent() {
  const { isMobile } = useSidebar();

  return (
    <div className="min-h-screen h-full w-full ">
      {isMobile ? <AppSidebar /> : null}
      <main className="p-4 ">
        <Outlet />
      </main>
    </div>
  );
}