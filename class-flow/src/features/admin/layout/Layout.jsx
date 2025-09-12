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


import { SidebarProvider, SidebarTrigger } from "../../../components/ui/sidebar"
import { AppSidebar } from "../../../components/SideBar/app-sidebar"
import { Outlet } from "react-router-dom";
import AvatarPopUpComponent from "../../../components/AvatarPopUp/AvatarPopUpComponent";
import BreadCrumbComponent from "@/components/BreadCrumb/BreadCrumbComponent"
import { Separator } from "@Components/ui/separator";
import { Button } from "../../../components/ui/button";
import { MessageSquare } from "lucide-react";
import { MotionWrapper } from "../../../lib/routing/animation/MotionWrapper";
export default function Layout() {
  return (
    <MotionWrapper>
    <SidebarProvider>
      <AppSidebar />
      <div className="flex h-screen w-full relative">
        <main className="flex-1 w-full">
          <div className="flex items-center justify-between h-[45px]  border-b">
            <div className="flex items-center justify-center gap-2  h-[40%]   w-full ">
              <div className="flex-1 items-center justify-center flex max-w-[60px]" >
                <SidebarTrigger  className="my-6 " />
              </div>
              <div className="flex-3 h-full flex">
                <Separator orientation="vertical" className=" mr-5  " />
                <BreadCrumbComponent  />

              </div>
            </div>
            <div className="flex items-center sm:justify-between sm:gap-10  sm:w-[180px] mr-2 sm:mr-7 justify-end">
              <div  className="hidden sm:block">
              <Button size='sm' className='text-sm' variant='outline' >
                <MessageSquare/>Feedback
                </Button>
                </div>
              <AvatarPopUpComponent />
            </div>
          </div>
          <Outlet /> 
        </main>
      </div>
    </SidebarProvider>
    </MotionWrapper>
  );
}