// import React from 'react'
// import { Outlet } from 'react-router-dom'
// import NavBar from './Components/NavBar.jsx'
// function Layout() {
//   return (
//    <>
//     <NavBar  />
//     <main className='container bg-blue-50'>
//       <Outlet />
//     </main>
//    </>
//   )
// }

// export default Layout


import { SidebarProvider, SidebarTrigger } from "./Components/ui/sidebar"
import { AppSidebar } from "./Components/ui/app-sidebar"
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex h-screen w-screen relative">
        <main className="flex-1 w-full">
          <SidebarTrigger />
          <Outlet /> 
        </main>
      </div>
    </SidebarProvider>
  );
}